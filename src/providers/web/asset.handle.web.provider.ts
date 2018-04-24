import { PubConstant } from './../entity/constant.provider';
import { Idle, PostRequestResult, Scrap, AllocateBill, Asset, IdleBill, ScrapBill, HandleBill } from './../entity/pub.entity';
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
  private getIdleUrl() {
    return HttpUtils.getUrlFromProperties() + "/idle";
  }

  private getScrapUrl() {
    return HttpUtils.getUrlFromProperties() + "/scrap";
  }

  private getAlloUrl(){
    return HttpUtils.getUrlFromProperties()+"/allo";
  }

  private getHandleIdleUrl() {
    return HttpUtils.getUrlFromProperties() + "/handle/idle";
  }

  private getHandleScrapUrl() {
    return HttpUtils.getUrlFromProperties() + "/handle/scrap";
  }
  
  /////闲置
  
  /**
   * 从服务器获取闲置申请单
   * @param applyId 
   */
  getIdleBillFromServe(applyId:String):Observable<IdleBill>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getIdleUrl() + '/apply/bill' + params)
        .map(res => res.json());
  }

  ///设备类
  /**
   * 从服务器获取闲置资产信息
   * @param assetId 
   */
  getIdleFromServe(assetId:String):Observable<Idle>{
    let params = "?assetId=" + assetId;
    return this.http.get(this.getIdleUrl() + '/device/apply/state' + params)
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
    return this.http.post(this.getIdleUrl() + "/device/synchro", HttpUtils.toQueryString(obj), options)
          .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_LONG);
  }


  /**
   * 从服务器获取闲置申请单
   * @param applyId 
   */
  getIdleAssetListFromServe(applyId:String):Observable<Array<Idle>>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getIdleUrl() + '/device/asset/list' + params)
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


  /**
   * 从服务器获取闲置申请单
   * @param applyId 
   */
  getScrapBillFromServe(applyId:String):Observable<ScrapBill>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getScrapUrl() + '/apply/bill' + params)
        .map(res => res.json());
  }

  /**
   * 从服务器获取闲置申请单
   * @param applyId 
   */
  getScrapAssetListFromServe(applyId:String):Observable<Array<Scrap>>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getScrapUrl() + '/asset/list' + params)
        .map(res => res.json());
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

  //闲置处置方法
  /**
   * 从服务器获取调拨申请单
   * @param applyId 
   */
  getHandleIdleBillFromServe(applyId:String):Observable<HandleBill>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getHandleIdleUrl() + '/bill' + params)
        .map(res => res.json());
  }

  /**
   * 从服务器获取调拨资产列表
   * @param applyId 
   */
  getHandleIdleAssetListFromServe(applyId:String):Observable<Array<Asset>>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getHandleIdleUrl() + '/asset/list' + params)
        .map(res => res.json());
  }
  //闲置处置方法END

  //报废处置方法
  /**
   * 从服务器获取调拨申请单
   * @param allocateId 
   */
  getHandleScrapBillFromServe(applyId:String):Observable<HandleBill>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getHandleScrapUrl() + '/bill' + params)
        .map(res => res.json());
  }

  /**
   * 从服务器获取调拨资产列表
   * @param applyId 
   */
  getHandleScrapAssetListFromServe(applyId:String):Observable<Array<Asset>>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getHandleScrapUrl() + '/asset/list' + params)
        .map(res => res.json());
  }
  //报废处置方法END
}