import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path'
import AccurateService from './services/accurate';
import config from './config/config.json';
import updateConfig from './lib/common';
import dayjs from 'dayjs'

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded())
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/accurate/authorize', (req: Request, res: Response) => {
  const accurateClientId = process.env.ACCURATE_CLIENT_ID
  const accurateRedirectUri = process.env.ACCURATE_REDIRECT_URI
  const accurateScope = process.env.ACCURATE_SCOPE
  res.redirect(`https://account.accurate.id/oauth/authorize?client_id=${accurateClientId}&response_type=code&redirect_uri=${accurateRedirectUri}&scope=${accurateScope}`);
});

app.get('/accurate/redirect', async (req: Request, res: Response) => {
  const authCode = req.query.code as string
  const resp = await AccurateService.grantAccessToken(authCode)
  config.accessToken = resp.access_token
  config.refreshToken = resp.refresh_token
  updateConfig()
  return res.send(resp)
});

app.get('/accurate/db', async (req: Request, res: Response) => {
  const data = await AccurateService.getDbList(config as any)
  res.send(data)
});

app.get('/accurate/db/:id', async (req: Request, res: Response) => {
  const id = req.params.id as any
  config.databaseId = id
  const data = await AccurateService.openDb(config as any, id)
  config.host = data.host
  config.sessionId = data.session
  updateConfig()
  res.send({
    message: "Open DB Success",
    data
  })
});

app.get('/accurate/sales-invoices', async (req: Request, res: Response) => {
  const data = await AccurateService.listSalesInvoices(config as any, {})
  res.send(data)
});

app.get('/tokopedia/orders/webhook/mock', async (req: Request, res: Response) => {
  res.render("tokopedia-webhook-mock")
});

app.post('/tokopedia/orders/webhook', async (req: Request, res: Response) => {
  const data = req.body
  
  const cust = await AccurateService.saveCustomer(config as any, {
    customerNo: data.customer.id,
    name: data.customer.name
  })
  if(cust?.s == false) {
    return res.send({
      message: "failed",
      data: {
        cust,
      }
    })
  }
  const details = data.products.map((prod: any) => ({
    itemNo: prod.id,
    quantity: prod.quantity,
    unitPrice: prod.price,
  }))
  const salesInvoice = await AccurateService.saveSalesInvoice(config as any, {
    number: data.order_id,
    transDate: dayjs().format("DD/MM/YYYY"),
    customerNo: data.customer.id,
    detailItem: details
  })
  if(salesInvoice?.s == false) {
    return res.send({
      message: "failed",
      data: {
        cust,
      }
    })
  }
  return res.send({
    message: "ok",
    data: {
      cust,
      salesInvoice
    }
  })
});

app.use((err:any, req:Request, res:Response, next:any) => {
  console.error(err.stack)
  res.status(500).send({
    message: "something wrong",
    error: err
  })
})


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});