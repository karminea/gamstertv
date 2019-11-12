import {Client, ChatUserstate} from 'tmi.js';
import * as Collections from 'typescript-collections'
import DBClient from "./DBClient";
import * as Type from "../interfaces/types";
import * as Query from "../interfaces/querys";

export class ExtCommands{

    public static async List(channel:string)
    {
        const db = new DBClient();
        let param:Type.DBQueryKeyValue = {key:"Channel", value:channel};
        let result = db.GetQuery<Type.SELECT_COMMANDS>(Query.SELECT_COMMANDS,param)
        return result.then(x=>{            
            let list:Collections.LinkedList<Type.SELECT_COMMANDS> = new Collections.LinkedList<Type.SELECT_COMMANDS>();
            if(x)
            {
               x.forEach(y=>list.add(y));
            }            
            return list;
        })
    }
   
    public static Excute(client:Client, command:string, channel:string,chatuserstate:ChatUserstate)
    {

    }

    public static Add(client:Client, command:string, channel:string,chatuserstate:ChatUserstate)
    {

    }

    public static Delete(client:Client, command:string, channel:string,chatuserstate:ChatUserstate)
    {

    }

    public static Update(client:Client, command:string, channel:string,chatuserstate:ChatUserstate)
    {

    }

}