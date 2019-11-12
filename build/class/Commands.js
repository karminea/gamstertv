"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Collections = __importStar(require("typescript-collections"));
const DBClient_1 = __importDefault(require("./DBClient"));
const Query = __importStar(require("../interfaces/querys"));
const fetch = __importStar(require("node-fetch"));
const twitch_1 = __importDefault(require("twitch"));
const Vote_1 = require("./Vote");
const ExtCommand_1 = require("./ExtCommand");
const Taboos_1 = require("./Taboos");
const Fetch = fetch.default;
/*
getTwitchUserById       :	string id	Twitch user info object
getTwitchUserByName     :	string username	Twitch user info object
getTwitchUsersByName    :	Array usernames	Array of Twitch user info objects
getStreamInfoById	    :   string id	Twitch stream object if user is currently streaming or null otherwise
getStreamInfoByUsername :	string username	Twitch stream object if user is currently streaming or null otherwise
getFollowDate           :	string streamerId, string followerId	Date if follower follows streamer or null otherwise
API Call
const helixQueryData = await twitchApi.sendHelixRequest("users?login=nightbot&login=moobot")
const krakenQueryData = await twitchApi.sendApiRequest("users?login=nightbot,moobot", {api: "kraken"})
*/
class Commands {
    static Message(client, message, channel, chatuserstate) {
        if (message.startsWith("!")) {
            const execute = this.commands(client, message, channel, chatuserstate);
            execute.then(v => {
                if (!v.exute) {
                    const cmd = ExtCommand_1.ExtCommands.Excute(client, v.cmd, channel, chatuserstate);
                }
            }).catch(e => {
                console.log(`command error :  ${e}`);
            });
        }
    }
    static async botStatus(online) {
        const db = new DBClient_1.default();
        let result = db.GetExecute(Query.UPDATE_BOT_STATUS, { key: "BotStatus", value: online });
        return result.then(x => {
            return x;
        });
    }
    static async commands(client, cmd, channel, chatuserstate) {
        let command = "";
        let message = "";
        command = cmd.substring(1).trim();
        if (command.indexOf(' ') > -1) {
            const temp = command.split(' ');
            command = temp[0];
            message = temp[1];
        }
        let commandExcute = false;
        switch (command) {
            case "정보":
                commandExcute = await this.info(client, channel);
                break;
            case "업타임":
                commandExcute = await this.uptime(client, channel);
                break;
            case "uptime":
                commandExcute = await this.uptime(client, channel);
                break;
            case "투표":
                if (chatuserstate.mod || chatuserstate.username == channel) {
                    commandExcute = await this.vote(client, channel, message);
                }
                break;
            case "후원":
                commandExcute = await this.donate(client, channel);
                break;
            case "구독":
                commandExcute = await this.subscript(client, channel);
                break;
            case "명령어추가":
                if (chatuserstate.mod || chatuserstate.username == channel) {
                    commandExcute = true;
                }
                break;
            case "명령어삭제":
                if (chatuserstate.mod || chatuserstate.username == channel) {
                    commandExcute = true;
                }
                break;
            case "명령어목록":
                commandExcute = await this.extCommandList(client, channel);
                break;
            case "인원":
                commandExcute = await this.chatters(client, channel);
                break;
            case "금지어추가":
                if (chatuserstate.mod || chatuserstate.username == channel) {
                    commandExcute = await this.tabooAdd(client, channel, message);
                }
                break;
            case "금지어삭제":
                if (chatuserstate.mod || chatuserstate.username == channel) {
                    commandExcute = await this.tabooDel(client, channel, message);
                }
                break;
            case "금지어목록":
                commandExcute = await this.tabooList(client, channel);
                break;
            case "금지어시간":
                if (chatuserstate.mod || chatuserstate.username == channel) {
                    commandExcute = true;
                }
                break;
            case "클립":
                if (chatuserstate.subscriber) {
                    commandExcute = await this.createClip(client, channel);
                }
                break;
        }
        return { exute: commandExcute, cmd: command };
    }
    static async info(client, channel) {
        const stream = await this.twitchClient.then(tx => tx.helix.streams.getStreamByUserName(channel));
        if (stream != null) {
            const game = await stream.getGame().then(x => x ? x.name : "");
            const title = stream.title;
            const viewers = stream.viewers;
            const uptime = Math.ceil((Date.now() - new Date(stream.startDate).getTime()) / 1000.0);
            let hour = (uptime / 3600) | 0;
            let min = ((uptime % 3600) / 60) | 0;
            let sec = uptime % 60 | 0;
            client.say(channel, `방송제목 : ${title}`);
            client.say(channel, `게임 : ${game}`);
            client.say(channel, `시청자수 : ${viewers}`);
            client.say(channel, `방송시간 : ${hour}:${min}:${sec}`);
        }
        else {
            client.say(channel, "방송시간이 아닙니다.");
        }
        return true;
    }
    static async uptime(client, channel) {
        let sendMessage = "";
        const stream = await this.twitchClient.then(tx => tx.helix.streams.getStreamByUserName(channel));
        if (stream != null) {
            const uptime = Math.ceil((Date.now() - new Date(stream.startDate).getTime()) / 1000.0);
            let hour = (uptime / 3600) | 0;
            let min = ((uptime % 3600) / 60) | 0;
            let sec = uptime % 60 | 0;
            sendMessage = `방송시간 : ${hour}:${min}:${sec}`;
        }
        else {
            sendMessage = "방송시간이 아닙니다.";
        }
        client.say(channel, sendMessage);
        return true;
    }
    static async donate(client, channel) {
        if (channel != "dogswellfish") {
            client.say(channel, `https://twip.kr/donate/${channel}`);
        }
        else {
            client.say(channel, `트윕 : https://twip.kr/donate/${channel}`);
            client.say(channel, `투네이션 : https://toon.at/donate/636948150287052616`);
        }
        return true;
    }
    static async subscript(client, channel) {
        client.say(channel, `https://www.twitch.tv/products/${channel}`);
        return true;
    }
    static async chatters(client, channel) {
        const chatter = await this.twitchClient.then(tx => tx.unsupported.getChatters(channel));
        let mod = 0;
        let viewer = 0;
        chatter.allChattersWithStatus.forEach((step, name) => {
            if (step === "moderators") {
                mod++;
            }
            else if (step === "viewers") {
                viewer++;
            }
        });
        client.say(channel, `매니저:${mod}명, 시청자:${viewer}명`);
        return true;
    }
    static async createClip(client, channel) {
        const user = await this.twitchClient.then(tx => tx.helix.users.getUserByName(channel));
        if (user != null) {
            const clip = this.twitchClient.then(tx => tx.helix.clips.createClip({ channelId: user.id }));
        }
        return true;
    }
    static async vote(client, channel, message) {
        let voteWords = message.split('/');
        if (voteWords.length > 1) {
            if (this.VoteList.getValue(channel) == undefined) {
                let vote = new Vote_1.Vote(client, channel, voteWords);
                this.VoteList.setValue(channel, vote);
                vote.endVote().then(() => {
                    this.VoteList.remove(channel);
                    console.log(`${channel} 채널에서 투표객체 삭제`);
                });
            }
            else {
                client.say(channel, "이미 투표가 진행중입니다.");
            }
        }
        else {
            client.say(channel, "투표는 항목이 2개 이상 있어야 합니다.");
        }
        return true;
    }
    static async extCommandList(client, channel) {
        let defaultCommands = ["정보", "업타임", "투표", "후원", "구독", "인원", "클립", "명령어목록", "금지어목록"];
        return ExtCommand_1.ExtCommands.List(channel).then(x => {
            let extCmd = [];
            x.forEach((cmd) => {
                extCmd.push(cmd.Command);
            });
            const str = `[${defaultCommands.concat(extCmd).join(",")}]`;
            client.say(channel, str);
            return true;
        });
    }
    static async tabooList(client, channel) {
        const taboo = Taboos_1.Taboos.List(channel);
        if (taboo) {
            const str = `[${taboo.join(",")}]`;
            client.say(channel, str);
        }
        return true;
    }
    static async tabooAdd(client, channel, taboo) {
        if (taboo.trim() !== "") {
            const channelTaboo = Taboos_1.Taboos.TabooList.getValue(channel) || [];
            if (channelTaboo.includes(taboo)) {
                client.say(channel, `금지어[${taboo}]는 이미 존재합니다.`);
            }
            else {
                Taboos_1.Taboos.Add(channel, taboo).then(x => {
                    if (x) {
                        channelTaboo.push(taboo);
                        Taboos_1.Taboos.TabooList.setValue(channel, channelTaboo);
                        client.say(channel, `금지어[${taboo}]를 추가하였습니다.`);
                    }
                });
            }
        }
        else {
            client.say(channel, "금지어를 입력해 주십시오.");
        }
        return true;
    }
    static async tabooDel(client, channel, taboo) {
        if (taboo.trim() !== "") {
            const channelTaboo = Taboos_1.Taboos.TabooList.getValue(channel) || [];
            if (channelTaboo.includes(taboo)) {
                Taboos_1.Taboos.Delete(channel, taboo).then(x => {
                    if (x) {
                        const index = channelTaboo.indexOf(taboo, 0);
                        if (index > -1) {
                            channelTaboo.splice(index, 1);
                            Taboos_1.Taboos.TabooList.setValue(channel, channelTaboo);
                            client.say(channel, `금지어[${taboo}]를 삭제하였습니다.`);
                        }
                    }
                });
            }
            else {
                client.say(channel, `금지어[${taboo}]는 존재하지 않습니다.`);
            }
        }
        else {
            client.say(channel, "금지어를 입력해 주십시오.");
        }
        return true;
    }
}
exports.Commands = Commands;
Commands.db = new DBClient_1.default();
Commands.twitchClient = (async () => await twitch_1.default.withCredentials("myl9onshb8bl8ho6qdn2o64bg5w7y9", "qaoefyrcyrpfx54ux7dnj74avah2cw"))();
Commands.VoteList = new Collections.LinkedDictionary();
//# sourceMappingURL=Commands.js.map