import {Client, ChatUserstate, client} from 'tmi.js'
import * as Collections from 'typescript-collections'

interface voteResult {
    index:number;
    title:string;
    value:number;
}

export class Vote{
    private channel:string;
    private param:string[];
    private client:Client;
    private voteUser:string[] = new Array<string>();
    private voteCount:Collections.Dictionary<number,number> = new Collections.Dictionary<number,number>() 

    constructor(client:Client, channel:string, param:string[])
    {
        this.channel = channel;
        this.param = param;
        this.client = client;
        this.client.say(channel,"1분간 투표를 시작합니다. 채팅중 첫번째 숫자만 입력됩니다.");
        param.forEach((x,index,_)=>{
            this.voteCount.setValue(index + 1,0);
            this.client.say(channel,`${index + 1}. ${x}`);
        });
    }

    public setVoteCount(index:number,user:string)
    {
        if (this.voteUser.includes(user))
        {
            console.log(`이미 투표에 참여한 인원 ${user} `);
        }
        else
        {
            this.voteUser.push(user);
            const count:number = this.voteCount.getValue(index)||0;
            this.voteCount.setValue(index,count + 1);
        }        
    }

    public victory():number
    {   
        let max = Math.max(...this.voteCount.values());
        return max;
    }

    public async endVote():Promise<void>
    {        
        let wait = (ms:number) => new Promise(resolve => setTimeout(resolve,ms));
        return await wait(20 * 1000).then(()=>{
            const max = this.victory();
            let index = 0;
            let votes:voteResult[] = Array<voteResult>();
            this.client.say(this.channel,"투표가 종료되었습니다.");
            this.voteCount.forEach((key,value)=>{
                this.client.say(this.channel,`${key}. ${this.param[key-1]} : [${value}]`);
                if (value == max)
                {
                    votes.push({index:key, title:this.param[key-1], value:value});
                }
            });

            let result = votes.map((v)=>{
                return v.title;
            });

            this.client.say(this.channel,`[${result.join(",")}] 항목이 가장 많은 표(${votes[0].value})를 받았습니다.`);

        }).catch(err=>{
            console.log(err);
        });
    }
}