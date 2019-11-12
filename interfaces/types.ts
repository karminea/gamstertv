import { ConnectionPool, IRecordSet, ISqlTypeFactory, ISqlType } from "mssql/msnodesqlv8";

export interface DBQueryKeyValue {
    key:string;    
    value:any;
}

export interface SELECT_COMMANDS {
    UID:string;
    Channel:string;
    Command:string;
    UserType:number;
    Response:string;
    Enabled:boolean;
    RepeatTime:number;
    RepeatEnabled:number;
    Reg_Date:Date;
}

export interface SELECT_TABOO {
    UID:string;
    Channel:string;
    TabooedWord:string;
    TimeOut:number;    
    Reg_Date:Date;
}

export interface JWT {
    exp:string;
    user_id:string;
    opaque_user_id:string;
    channel_id:string;
    role:"broadcaster" | "global";
    is_unlinked:boolean;
    pubsub_perms:{
        listen:string[];
        send:string[];
    }
}