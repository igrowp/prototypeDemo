import { PubConstant } from './../entity/constant.provider';
import { AppInfo } from './../entity/pub.entity';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/timeout'
import { HttpUtils } from '../utils/httpUtils';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PubWebProvider {
  constructor(public http: Http) {
  }
  getPubUrl() {
    return HttpUtils.getUrlFromProperties() + "/pub";
  }
  
  /**
   * 从服务器获取最新的app版本信息
   */
  getRecentAppVersion():Observable<AppInfo>{
    return this.http.get(this.getPubUrl() + '/app/version')
        .map(res => res.json())
        .timeout(PubConstant.HTTP_TIME_OUT_SHORT);//.timeout(PubConstant.HTTP_TIME_OUT_SHORT);
  }

}