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
class ExtCommands {
    static async List(channel) {
        const db = new DBClient_1.default();
        let param = { key: "Channel", value: channel };
        let result = db.GetQuery(Query.SELECT_COMMANDS, param);
        return result.then(x => {
            let list = new Collections.LinkedList();
            if (x) {
                x.forEach(y => list.add(y));
            }
            return list;
        });
    }
    static Excute(client, command, channel, chatuserstate) {
    }
    static Add(client, command, channel, chatuserstate) {
    }
    static Delete(client, command, channel, chatuserstate) {
    }
    static Update(client, command, channel, chatuserstate) {
    }
}
exports.ExtCommands = ExtCommands;
//# sourceMappingURL=ExtCommand.js.map