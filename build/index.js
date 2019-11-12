"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmi_js_1 = require("tmi.js");
const Commands_1 = require("./class/Commands");
const Taboos_1 = require("./class/Taboos");
let IsConnected = false;
const channels = ["gamstertv"];
const opts = {
    channels: channels,
    identity: {
        username: "gamstertv",
        password: "oauth:qaoefyrcyrpfx54ux7dnj74avah2cw"
    },
    options: {
        clientId: "myl9onshb8bl8ho6qdn2o64bg5w7y9",
        debug: true
    },
    logger: {
        info: (message) => { },
        warn: (message) => { },
        error: (message) => { }
    }
};
const client = tmi_js_1.Client(opts);
client.connect();
client.on("ping", () => {
    console.log(`Received PING : ${new Date(Date.now()).toLocaleString()}`);
});
client.on("connecting", (address, port) => {
    Commands_1.Commands.botStatus(true).then(x => { console.log("tmi connecting..."); });
});
client.on("connected", (address, port) => {
    IsConnected = true;
    console.log("tmi connected!");
    Commands_1.Commands.twitchClient.then(tc => {
        tc.kraken.users.getMe().then(t => {
            return t.getFollows();
        }).then(c => {
            c.forEach(v => {
                Taboos_1.Taboos.initTaboo(v.channel.name).then(() => {
                    client.join(v.channel.name).then(x => console.log(`${x[0]} 채널에 입장하였습니다.`));
                });
            });
        }).catch(err => {
            console.error("겜스터봇 팔로우정보 미획득");
        });
    }).catch(err => {
        console.error("트위치API 클라이언트 생성 실패");
    });
});
client.on("disconnected", reason => {
    IsConnected = false;
    Commands_1.Commands.botStatus(true).then(x => { console.log(`tmi disconnected : ${reason}`); });
});
client.on("reconnect", () => {
    console.log("tmi reconnect");
    channels.forEach((value, index) => {
        client.join(value).then(x => console.log(`${x[0]} 채널에 재입장하였습니다.`));
    });
});
client.on("chat", (channel, userstate, message, self) => {
    if (self)
        return;
    if (client.readyState() === "OPEN") {
        channel = channel.substring(1);
        if (message.startsWith("!")) {
            Commands_1.Commands.Message(client, message, channel, userstate);
        }
        let vote = Commands_1.Commands.VoteList.getValue(channel);
        if (vote) {
            if (!isNaN(parseInt(message.substr(0, 1))) && userstate.username) {
                let voteNumber = parseInt(message.substr(0, 1));
                vote.setVoteCount(voteNumber, userstate.username);
            }
        }
        let taboo = Taboos_1.Taboos.List(channel);
        taboo.forEach(v => {
            if (message.indexOf(v) > -1 && !userstate.mod && userstate.username !== channel && userstate.username) {
                client.say(channel, `${userstate.username}님이 금지어를 사용하셨습니다.`);
                client.timeout(channel, userstate.username, 60, "금지어 사용").catch(err => {
                    console.log(`${userstate.username}님이 임시차단하지 못하였습니다.`);
                });
            }
        });
    }
});
//# sourceMappingURL=index.js.map