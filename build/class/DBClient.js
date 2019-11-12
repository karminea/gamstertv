"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const msnodesqlv8_1 = require("mssql/msnodesqlv8");
class DBClient {
    constructor() {
        this.isConn = () => {
            return this.pool.connected;
        };
        const config = {
            driver: "msnodesqlv8",
            user: "gamstertv",
            password: "e2244919",
            server: "db",
            database: "GamsterTV",
            parseJSON: true,
            connectionTimeout: 30
        };
        this.pool = new msnodesqlv8_1.ConnectionPool(config);
        this.pool.setMaxListeners(10);
    }
    async GetQuery(query, ...param) {
        let request = (await this.pool.connect()).request();
        param.forEach((p) => request.input(p.key, p.value));
        return request.query(query).then((result) => {
            return result.recordset;
        })
            .catch(err => {
            console.error(`DB Error : ${err}`);
        })
            .finally(() => {
            this.pool.close();
        });
    }
    async GetExecute(query, ...param) {
        let request = (await this.pool.connect()).request();
        param.forEach((p) => request.input(p.key, p.value));
        return request.query(query).then((result) => {
            return result.rowsAffected.length;
        })
            .catch(err => {
            console.error(`DB Error : ${err}`);
            return 0;
        })
            .finally(() => {
            this.pool.close();
        });
    }
}
exports.default = DBClient;
module.exports.DBClient = DBClient;
//# sourceMappingURL=DBClient.js.map