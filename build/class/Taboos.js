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
class Taboos {
    static async initTaboo(channel) {
        this.TabooList;
        this.TabooTimeList;
        const db = new DBClient_1.default();
        let param = { key: "Channel", value: channel };
        let result = db.GetQuery(Query.SELECT_TABOO, param);
        result.then(x => {
            if (x) {
                if (x.length > 0) {
                    let taboo = [];
                    let tabooTime = 0;
                    x.forEach((t) => {
                        taboo.push(t.TabooedWord);
                        tabooTime = t.TimeOut;
                    });
                    this.TabooList.setValue(channel, taboo);
                    this.TabooTimeList.setValue(channel, tabooTime);
                }
            }
        });
    }
    static List(channel) {
        return this.TabooList.getValue(channel) || [];
    }
    static async Add(channel, taboo) {
        const db = new DBClient_1.default();
        let param = [{ key: "Channel", value: channel }, { key: "TabooedWord", value: taboo }];
        let result = db.GetExecute(Query.INSERT_TABOO, ...param);
        return result.then(x => {
            return x > 0;
        });
    }
    static async Delete(channel, taboo) {
        const db = new DBClient_1.default();
        let param = [{ key: "Channel", value: channel }, { key: "TabooedWord", value: taboo }];
        let result = db.GetExecute(Query.DELETE_TABOO, ...param);
        return result.then(x => {
            return x > 0;
        });
    }
}
exports.Taboos = Taboos;
Taboos.TabooList = new Collections.LinkedDictionary();
Taboos.TabooTimeList = new Collections.LinkedDictionary();
//# sourceMappingURL=Taboos.js.map