import axios from "axios";

type AccurateUser = {
    host: string
    sessionId: string
    accessToken: string
    refreshToken: string
    databaseId: string
}

export default class AccurateService {
    static async grantAccessToken(authCode: string) {
        const redirectUri = process.env.ACCURATE_REDIRECT_URI!
        const authClientId = process.env.ACCURATE_CLIENT_ID as string
        const authClientSecret = process.env.ACCURATE_CLIENT_SECRET as string
        const authSecretBase64 = Buffer.from(`${authClientId}:${authClientSecret}`).toString('base64')

        var payload = new URLSearchParams()
        payload.set('code', authCode)
        payload.set('grant_type', 'authorization_code')
        payload.set('redirect_uri', redirectUri)
        
        const resp = await axios.post(`https://account.accurate.id/oauth/token`, payload, {headers:{
            Authorization: `Basic ${authSecretBase64}`
        }})
        return resp.data
    }

    static async getDbList(user: AccurateUser) {
        const resp = await axios.get(`https://account.accurate.id/api/db-list.do`, {headers:{
            "X-SESSION-ID": user.sessionId,
            Authorization: `Bearer ${user.accessToken}`
        }})
        return resp.data
    }

    static async openDb(user: AccurateUser, id: number) {
        const resp = await axios.get(`https://account.accurate.id/api/open-db.do`, {
            headers:{
                "X-SESSION-ID": user.sessionId,
                Authorization: `Bearer ${user.accessToken}`
            },
            data: { id }
        })
        return resp.data
    }
    static async saveCustomer(user: AccurateUser, payload:any) {
        const resp = await axios.post(`${user.host}/accurate/api/customer/save.do`, payload, {headers:{
            "X-SESSION-ID": user.sessionId,
            Authorization: `Bearer ${user.accessToken}`
        }})
        return resp.data
    }

    static async listSalesInvoices(user: AccurateUser, payload:any) {
        const resp = await axios.get(`${user.host}/accurate/api/sales-invoice/list.do`, { 
            headers:{
                "X-SESSION-ID": user.sessionId,
                Authorization: `Bearer ${user.accessToken}`
            },
            data: payload
        })
        return resp.data
    }

    static async saveSalesInvoice(user: AccurateUser, payload:any) {
        const resp = await axios.post(`${user.host}/accurate/api/sales-invoice/save.do`, payload, { headers:{
            "X-SESSION-ID": user.sessionId,
            Authorization: `Bearer ${user.accessToken}`
        }})
        return resp.data
    }

    static async saveSalesReceipt(user: AccurateUser, payload:any) {
        const resp = await axios.post(`${user.host}/accurate/api/sales-invoice/save.do`, payload, { headers:{
            "X-SESSION-ID": user.sessionId,
            Authorization: `Bearer ${user.accessToken}`
        }})
        return resp.data
    }
}