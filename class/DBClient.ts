import { ConnectionPool, IRecordSet, ISqlTypeFactory, ISqlType } from "mssql/msnodesqlv8";
import * as Type from "../interfaces/types";

export default class DBClient {        
    private pool:ConnectionPool;
    
    public isConn = ():boolean =>{
        return this.pool.connected;
    }

    constructor()
    {  
        const config = {            
            driver:"msnodesqlv8",
            user:"gamstertv",
            password:"e2244919",
            server:"db",
            database:"GamsterTV",            
            parseJSON:true,
            connectionTimeout:30
        }

        this.pool = new ConnectionPool(config);
        this.pool.setMaxListeners(10);    }
   
    public async GetQuery<T>(query:string, ...param:Type.DBQueryKeyValue[]):Promise<IRecordSet<T>|void>
    {   
        let request = (await this.pool.connect()).request();
        param.forEach((p)=>request.input(p.key,p.value));
        return request.query<T>(query).then((result) => {
            return result.recordset;                
        })
        .catch(err =>{
            console.error(`DB Error : ${err}`)
        })
        .finally(()=>{
            this.pool.close();
        });
    }

    public async GetExecute(query:string, ...param:Type.DBQueryKeyValue[]):Promise<number>
    {
        let request = (await this.pool.connect()).request();
        param.forEach((p)=>request.input(p.key,p.value));

        return request.query(query).then((result) => {
            return result.rowsAffected.length
        })
        .catch(err =>{
            console.error(`DB Error : ${err}`)
            return 0;
        })
        .finally(()=>{
            this.pool.close();
        });
    }
}

module.exports.DBClient = DBClient;