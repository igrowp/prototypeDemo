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
  //闲置
  private getIdleUrl() {
    return HttpUtils.getUrlFromProperties() + "/idle";
  }
  //设备类报废
  private getIdleDeviceUrl() {
    return HttpUtils.getUrlFromProperties() + "/idle/device";
  }
  //非设备类报废
  private getIdleUnDeviceUrl() {
    return HttpUtils.getUrlFromProperties() + "/idle/undevice";
  }


  //报废
  private getScrapUrl() {
    return HttpUtils.getUrlFromProperties() + "/scrap";
  }
  //固定资产报废
  private getScrapFixUrl() {
    return HttpUtils.getUrlFromProperties() + "/scrap/fix";
  }
  //油气水井报废
  private getScrapWellUrl() {
    return HttpUtils.getUrlFromProperties() + "/scrap/well";
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
  getIdleDeviceFromServe(assetId:String):Observable<Idle>{
    let params = "?assetId=" + assetId;
    return this.http.get(this.getIdleDeviceUrl() + '/apply/state' + params)
        .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_SHORT);
  }

  /**
   * 将本地闲置资产数据同步到服务器
   */
  synchroIdleDeviceToServe(idle: Idle):Observable<PostRequestResult> {
    let options = HttpUtils.getRequestOptions();
    var json = JSON.stringify(idle);
    let obj: any = {
      idle: json
    }
    return this.http.post(this.getIdleDeviceUrl() + "/synchro", HttpUtils.toQueryString(obj), options)
          .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_LONG);
  }


  /**
   * 从服务器获取闲置申请单
   * @param applyId 
   */
  getIdleDeviceAssetListFromServe(applyId:String):Observable<Array<Idle>>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getIdleDeviceUrl() + '/asset/list' + params)
        .map(res => res.json());
  }

  ///非设备类
  /**
   * 从服务器获取闲置资产信息
   * @param assetId 
   */
  getIdleUnDeviceFromServe(assetId:String):Observable<Idle>{
    let params = "?assetId=" + assetId;
    return this.http.get(this.getIdleUnDeviceUrl() + '/apply/state' + params)
        .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_SHORT);
  }

  /**
   * 将本地闲置资产数据同步到服务器
   */
  synchroIdleUnDeviceToServe(idle: Idle):Observable<PostRequestResult> {
    let options = HttpUtils.getRequestOptions();
    var json = JSON.stringify(idle);
    let obj: any = {
      idle: json
    }
    return this.http.post(this.getIdleUnDeviceUrl() + "/synchro", HttpUtils.toQueryString(obj), options)
          .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_LONG);
  }


  /**
   * 从服务器获取闲置申请单
   * @param applyId 
   */
  getIdleUnDeviceAssetListFromServe(applyId:String):Observable<Array<Idle>>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getIdleUnDeviceUrl() + '/asset/list' + params)
        .map(res => res.json());
  }

  
  ////报废
  /**
   * 从服务器获取闲置申请单
   * @param applyId 
   */
  getScrapBillFromServe(applyId:String):Observable<ScrapBill>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getScrapUrl() + '/apply/bill' + params)
        .map(res => res.json());
  }

  //固定资产
  /**
   * 从服务器获取报废资产信息
   * @param assetId 
   */
  getScrapFixFromServe(assetId:String):Observable<Scrap>{
    let params = "?assetId=" + assetId;
    return this.http.get(this.getScrapFixUrl() + '/apply/state' + params)
        .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_SHORT);
  }
  /**
   * 将本地报废资产数据同步到服务器
   */
  synchroScrapFixToServe(scrap: Scrap):Observable<PostRequestResult> {
    let options = HttpUtils.getRequestOptions();
    var json = JSON.stringify(scrap);
    let obj: any = {
      scrap: json
    }
    return this.http.post(this.getScrapFixUrl() + "/synchro", HttpUtils.toQueryString(obj), options)
          .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_LONG);
  }



  /**
   * 从服务器获取资产列表
   * @param applyId 
   */
  getScrapFixAssetListFromServe(applyId:String):Observable<Array<Scrap>>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getScrapFixUrl() + '/asset/list' + params)
        .map(res => res.json());
  }

  //油气水井
  /**
   * 从服务器获取报废资产信息
   * @param assetId 
   */
  getScrapWellFromServe(assetId:String):Observable<Scrap>{
    let params = "?assetId=" + assetId;
    return this.http.get(this.getScrapWellUrl() + '/apply/state' + params)
        .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_SHORT);
  }
  /**
   * 将本地报废资产数据同步到服务器
   */
  synchroScrapWellToServe(scrap: Scrap):Observable<PostRequestResult> {
    let options = HttpUtils.getRequestOptions();
    var json = JSON.stringify(scrap);
    let obj: any = {
      scrap: json
    }
    return this.http.post(this.getScrapWellUrl() + "/synchro", HttpUtils.toQueryString(obj), options)
          .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_LONG);
  }

  

  /**
   * 从服务器获取资产列表
   * @param applyId 
   */
  getScrapWellAssetListFromServe(applyId:String):Observable<Array<Scrap>>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getScrapWellUrl() + '/asset/list' + params)
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
  /**
   * 从服务器获取该员工下正在申请调拨的资产列表
   * @param workerNumber 
   */
  getAlloingListFromServe(workerNumber:String):Observable<Array<Asset>>{
    let params = "?agent=" + workerNumber;
    return this.http.get(this.getAlloUrl() + '/asset/list/alloing' + params)
        .map(res => res.json());
  }

  /**
   * 将报废申请提交到服务器
   * @
   */
  submitAllocateToServe(allocate: AllocateBill,assetList:Array<string>):Observable<PostRequestResult> {
    let options = HttpUtils.getRequestOptions();
    var json = JSON.stringify(allocate);
    let obj: any = {
      allocate: json,
      assetList:JSON.stringify(assetList)
    }
    return this.http.post(this.getAlloUrl() + "/synchro", HttpUtils.toQueryString(obj), options)
          .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_LONG);
  }
  //调拨方法END

  //闲置处置方法
  /**
   * 从服务器获取闲置处置申请单
   * @param applyId 
   */
  getHandleIdleBillFromServe(applyId:String):Observable<HandleBill>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getHandleIdleUrl() + '/bill' + params)
        .map(res => res.json());
  }

  /**
   * 从服务器获取闲置处置资产列表
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
   * 从服务器获取报废处置申请单
   * @param allocateId 
   */
  getHandleScrapBillFromServe(applyId:String):Observable<HandleBill>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getHandleScrapUrl() + '/bill' + params)
        .map(res => res.json());
  }

  /**
   * 从服务器获取报废处置资产列表
   * @param applyId 
   */
  getHandleScrapAssetListFromServe(applyId:String):Observable<Array<Asset>>{
    let params = "?applyId=" + applyId;
    return this.http.get(this.getHandleScrapUrl() + '/asset/list' + params)
        .map(res => res.json());
  }
  //报废处置方法END
}