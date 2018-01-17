import { SQLiteObject } from "@ionic-native/sqlite";

export class DataBaseUtil{
    private static dataBase:SQLiteObject;
    static generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    static getSqliteObject():SQLiteObject{
        return this.dataBase;
    }

    static setSqliteObject(db:SQLiteObject){
        if(db){
            this.dataBase=db;
        }
    }
}