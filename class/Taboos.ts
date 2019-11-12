import {Client, ChatUserstate} from 'tmi.js';
import * as Collections from 'typescript-collections'
import DBClient from "./DBClient";
import * as Type from "../interfaces/types";
import * as Query from "../interfaces/querys";

export class Taboos {
    public static TabooList:Collections.LinkedDictionary<string,string[]> = new Collections.LinkedDictionary<string,string[]>();
    public static TabooTimeList:Collections.LinkedDictionary<string,number> = new Collections.LinkedDictionary<string,number>();

    public static async initTaboo(channel:string)
    {
        this.TabooList
        this.TabooTimeList

        const db = new DBClient();
        let param:Type.DBQueryKeyValue = {key:"Channel", value:channel};
        let result = db.GetQuery<Type.SELECT_TABOO>(Query.SELECT_TABOO,param)
        result.then(x=>{            
            if(x)
            {                
                if (x.length > 0)
                {
                    let taboo:string[] = [];
                    let tabooTime:number = 0;
                    x.forEach((t)=>{
                        taboo.push(t.TabooedWord);
                        tabooTime = t.TimeOut
                    });
                    this.TabooList.setValue(channel,taboo);
                    this.TabooTimeList.setValue(channel,tabooTime);
                }                
            }            
        });
    }

    public static List(channel:string)
    {
        return this.TabooList.getValue(channel) || [];        
    }

    public static async Add(channel:string, taboo:string)
    {
        const db = new DBClient();
        let param:Type.DBQueryKeyValue[] = [{key:"Channel", value:channel},{key:"TabooedWord", value:taboo}];
        let result = db.GetExecute(Query.INSERT_TABOO,...param)
        return result.then(x=>{            
            return x > 0;
        })
    }

    public static async Delete(channel:string, taboo:string)
    {
        const db = new DBClient();
        let param:Type.DBQueryKeyValue[] = [{key:"Channel", value:channel},{key:"TabooedWord", value:taboo}];
        let result = db.GetExecute(Query.DELETE_TABOO,...param)
        return result.then(x=>{            
            return x > 0;
        })
    }
}