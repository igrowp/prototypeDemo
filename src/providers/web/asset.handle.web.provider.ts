import { PubConstant } from './../entity/constant.provider';
import { Idle, PostRequestResult, Scrap, AllocateBill, Asset, IdleBill } from './../entity/pub.entity';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/timeout'
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

  getAlloUrl(){
    return HttpUtils.getUrlFromProperties()+"/allo";
  }
  
  /////闲置
  /**
   * 从服务器获取闲置资产信息
   * @param assetId 
   */
  getIdleFromServe(assetId:String):Observable<Idle>{
    let params = "?assetId=" + assetId;
    return this.http.get(this.getIdleUrl() + '/apply/state' + params)
        .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_SHORT);
  }

  /**
   * 将本地闲置资产数据同步到服务器
   */
  synchroIdleToServe(idle: Idle):Observable<PostRequestResult> {
    let options = HttpUtils.getRequestOptions();
    var json = JSON.stringify(idle);
    let obj: any = {
      idle: json
    }
    return this.http.post(this.getIdleUrl() + "/synchro", HttpUtils.toQueryString(obj), options)
          .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_LONG);
  }

  /**
   * 从服务器获取闲置申请单
   * @param applyId 
   */
  getIdleBillFromServe(applyId:String):Observable<IdleBill>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getIdleUrl() + '/apply/bill' + params)
        .map(res => res.json());
  }

  /**
   * 从服务器获取闲置申请单
   * @param applyId 
   */
  getIdleAssetListFromServe(applyId:String):Observable<Array<Asset>>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getIdleUrl() + '/asset/list' + params)
        .map(res => res.json());
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
  synchroScrapToServe(scrap: Scrap):Observable<PostRequestResult> {
    let options = HttpUtils.getRequestOptions();
    var json = JSON.stringify(scrap);
    let obj: any = {
      scrap: json
    }
    return this.http.post(this.getScrapUrl() + "/synchro", HttpUtils.toQueryString(obj), options)
          .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_LONG);
  }






  //调拨方法
  /**
   * 从服务器获取调拨申请单
   * @param allocateId 
   */
  getAlloBillFromServe(allocateId:String):Observable<AllocateBill>{
    let params = "?allocateId=" + allocateId;
    return this.http.get(this.getAlloUrl() + '/bill' + params)
        .map(res => res.json());
  }

  /**
   * 从服务器获取调拨资产列表
   * @param allocateId 
   */
  getAlloAssetListFromServe(allocateId:String):Observable<Array<Asset>>{
    let params = "?allocateId=" + allocateId;
    return this.http.get(this.getAlloUrl() + '/asset/list' + params)
        .map(res => res.json());
  }
  //调拨方法END
}