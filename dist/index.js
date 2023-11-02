"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const accurate_1 = __importDefault(require("./services/accurate"));
const config_json_1 = __importDefault(require("./config/config.json"));
const common_1 = __importDefault(require("./lib/common"));
const dayjs_1 = __importDefault(require("dayjs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.join(__dirname, '/public')));
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.get('/accurate/authorize', (req, res) => {
    const accurateClientId = process.env.ACCURATE_CLIENT_ID;
    const accurateRedirectUri = process.env.ACCURATE_REDIRECT_URI;
    const accurateScope = process.env.ACCURATE_SCOPE;
    res.redirect(`https://account.accurate.id/oauth/authorize?client_id=${accurateClientId}&response_type=code&redirect_uri=${accurateRedirectUri}&scope=${accurateScope}`);
});
app.get('/accurate/redirect', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authCode = req.query.code;
    const resp = yield accurate_1.default.grantAccessToken(authCode);
    config_json_1.default.accessToken = resp.access_token;
    config_json_1.default.refreshToken = resp.refresh_token;
    (0, common_1.default)();
    return res.send(resp);
}));
app.get('/accurate/db', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield accurate_1.default.getDbList(config_json_1.default);
    res.send(data);
}));
app.get('/accurate/db/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    config_json_1.default.databaseId = id;
    const data = yield accurate_1.default.openDb(config_json_1.default, id);
    config_json_1.default.host = data.host;
    config_json_1.default.sessionId = data.session;
    (0, common_1.default)();
    res.send({
        message: "Open DB Success",
        data
    });
}));
app.get('/accurate/sales-invoices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield accurate_1.default.listSalesInvoices(config_json_1.default, {});
    res.send(data);
}));
app.get('/tokopedia/orders/webhook/mock', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("tokopedia-webhook-mock");
}));
app.post('/tokopedia/orders/webhook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const cust = yield accurate_1.default.saveCustomer(config_json_1.default, {
        customerNo: data.customer.id,
        name: data.customer.name
    });
    if ((cust === null || cust === void 0 ? void 0 : cust.s) == false) {
        return res.send({
            message: "failed",
            data: {
                cust,
            }
        });
    }
    const details = data.products.map((prod) => ({
        itemNo: prod.id,
        quantity: prod.quantity,
        unitPrice: prod.price,
    }));
    const salesInvoice = yield accurate_1.default.saveSalesInvoice(config_json_1.default, {
        number: data.order_id,
        transDate: (0, dayjs_1.default)().format("DD/MM/YYYY"),
        customerNo: data.customer.id,
        detailItem: details
    });
    if ((salesInvoice === null || salesInvoice === void 0 ? void 0 : salesInvoice.s) == false) {
        return res.send({
            message: "failed",
            data: {
                cust,
            }
        });
    }
    return res.send({
        message: "ok",
        data: {
            cust,
            salesInvoice
        }
    });
}));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        message: "something wrong",
        error: err
    });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
