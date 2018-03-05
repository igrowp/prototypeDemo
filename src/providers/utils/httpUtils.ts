import { RequestOptions, Headers } from '@angular/http';
import { Properties } from './../properties/properties';
export class HttpUtils {

    public static getUrlFromProperties(){
        // return Properties.webConfig.address+":"+Properties.webConfig.port;//+"/"+Properties.webConfig.project;
        return Properties.webConfig.address+":"+Properties.webConfig.port+"/"+Properties.webConfig.project;
    }

    public static getFileUploadUrlFromProperties(){
        return Properties.fileUploadURL;

    }

    public static getUrlAddressFromProperties(){
        return Properties.webConfig.address;
    }

    public static getUrlPortFromProperties(){
        return Properties.webConfig.port;
    }

    public static setUrlToProperties(address:string,port:string):boolean{
        var oldAddress=Properties.webConfig.address;
        var oldPort=Properties.webConfig.port;
        try{
            Properties.webConfig.address=address;
            Properties.webConfig.port=port;
            return true;
        }catch(err){
            Properties.webConfig.address=oldAddress;
            Properties.webConfig.port=oldPort;
            return false;
        }
    }
    public static setDefaultUrlToProperties():boolean{
        try{
            Properties.webConfig.address=Properties.webConfigDefault.address;
            Properties.webConfig.port=Properties.webConfigDefault.port;
            return true;
        }catch(err){
            return false;
        }
    }

    public static getRequestOptions() {
        let headers = new Headers();
        //headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        let options = new RequestOptions({
            headers: headers,
        });
        return options;
    }

    //使用以下方法将json进行参数化
    public static toQueryString(obj) {
        let result = [];
        for (let key in obj) {
            key = encodeURIComponent(key); //注释
            let values = obj[key];
            if (values && values.constructor == Array) {
                let queryValues = [];
                for (let i = 0, len = values.length, value; i < len; i++) {
                    value = values[i];
                    queryValues.push(this.toQueryPair(key, value));
                }
                result = result.concat(queryValues);
            } else {
                result.push(this.toQueryPair(key, values));
            }
        }
        return result.join('&');
    }
    private static toQueryPair(key, value) {
        if (typeof value == 'undefined') {
            return key;
        }
        return key + '=' + encodeURIComponent(value === null ? '' : String(value));  //注释   通过MAS接口
        //return key + '=' + (value === null ? '' : String(value));
    }

}