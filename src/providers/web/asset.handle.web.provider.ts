import { PubConstant } from './../entity/constant.provider';
import { Dict, DictDetail, Idle, HttpResult, Scrap } from './../entity/pub.entity';
import { ChangeRecord } from './../entity/entity.provider';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/timeout'
import { FixedAsset, OrgInfo, UserSimple } from '../entity/entity.provider';
import { HttpUtils } from '../utils/httpUtils';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AssetHandleWebProvider {
  constructor(public http: Http) {
  }
  getIdleUrl() {
    return HttpUtils.getUrlFromProperties() + "/idle";
  }

  getScrapUrl() {
    return HttpUtils.getUrlFromProperties() + "/scrap";
  }

  /**
   * 从服务器获取闲置资产信息
   * @param assetId 
   */
  getIdleFromServe(assetId:String):Observable<Idle>{
    let params = "?assetId=" + assetId;
    return this.http.get(this.getIdleUrl() + '/apply/state' + params)
        .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_SHORT);
  }

  /////闲置
  /**
   * 将本地闲置资产数据同步到服务器
   */
  synchroIdleToServe(idle: Idle):Observable<HttpResult> {
    let options = HttpUtils.getRequestOptions();
    var json = JSON.stringify(idle);
    let obj: any = {
      idle: json
    }
    return this.http.post(this.getIdleUrl() + "/synchro", HttpUtils.toQueryString(obj), options)
          .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_LONG);
  }

  
  ////报废
  /**
   * 从服务器获取闲置资产信息
   * @param assetId 
   */
  getScrapFromServe(assetId:String):Observable<Scrap>{
    let params = "?assetId=" + assetId;
    return this.http.get(this.getScrapUrl() + '/apply/state' + params)
        .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_SHORT);
  }
  /**
   * 将本地闲置资产数据同步到服务器
   */
  synchroScrapToServe(scrap: Scrap):Observable<HttpResult> {
    let options = HttpUtils.getRequestOptions();
    var json = JSON.stringify(scrap);
    let obj: any = {
      scrap: json
    }
    return this.http.post(this.getScrapUrl() + "/synchro", HttpUtils.toQueryString(obj), options)
          .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_LONG);
  }
}