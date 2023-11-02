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
const axios_1 = __importDefault(require("axios"));
class AccurateService {
    static grantAccessToken(authCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const redirectUri = process.env.ACCURATE_REDIRECT_URI;
            const authClientId = process.env.ACCURATE_CLIENT_ID;
            const authClientSecret = process.env.ACCURATE_CLIENT_SECRET;
            const authSecretBase64 = Buffer.from(`${authClientId}:${authClientSecret}`).toString('base64');
            var payload = new URLSearchParams();
            payload.set('code', authCode);
            payload.set('grant_type', 'authorization_code');
            payload.set('redirect_uri', redirectUri);
            const resp = yield axios_1.default.post(`https://account.accurate.id/oauth/token`, payload, { headers: {
                    Authorization: `Basic ${authSecretBase64}`
                } });
            return resp.data;
        });
    }
    static getDbList(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield axios_1.default.get(`https://account.accurate.id/api/db-list.do`, { headers: {
                    "X-SESSION-ID": user.sessionId,
                    Authorization: `Bearer ${user.accessToken}`
                } });
            return resp.data;
        });
    }
    static openDb(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield axios_1.default.get(`https://account.accurate.id/api/open-db.do`, {
                headers: {
                    "X-SESSION-ID": user.sessionId,
                    Authorization: `Bearer ${user.accessToken}`
                },
                data: { id }
            });
            return resp.data;
        });
    }
    static saveCustomer(user, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield axios_1.default.post(`${user.host}/accurate/api/customer/save.do`, payload, { headers: {
                    "X-SESSION-ID": user.sessionId,
                    Authorization: `Bearer ${user.accessToken}`
                } });
            return resp.data;
        });
    }
    static listSalesInvoices(user, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield axios_1.default.get(`${user.host}/accurate/api/sales-invoice/list.do`, {
                headers: {
                    "X-SESSION-ID": user.sessionId,
                    Authorization: `Bearer ${user.accessToken}`
                },
                data: payload
            });
            return resp.data;
        });
    }
    static saveSalesInvoice(user, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield axios_1.default.post(`${user.host}/accurate/api/sales-invoice/save.do`, payload, { headers: {
                    "X-SESSION-ID": user.sessionId,
                    Authorization: `Bearer ${user.accessToken}`
                } });
            return resp.data;
        });
    }
    static saveSalesReceipt(user, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield axios_1.default.post(`${user.host}/accurate/api/sales-invoice/save.do`, payload, { headers: {
                    "X-SESSION-ID": user.sessionId,
                    Authorization: `Bearer ${user.accessToken}`
                } });
            return resp.data;
        });
    }
}
exports.default = AccurateService;
