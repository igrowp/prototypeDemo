import { HttpUtils } from './../utils/httpUtils';
import { PubConstant } from './../entity/constant.provider';
import { Idle, PostRequestResult, Scrap, AllocateBill, Asset, IdleBill, ScrapBill, HandleBill } from './../entity/pub.entity';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../utils/http/http.service';

@Injectable()
export class AssetHandleWebProvider {
  constructor(private httpService:HttpService) {
  }
  //闲置
  private getIdleUrl() {
    return "/idle";
  }
  //设备类报废
  private getIdleDeviceUrl() {
    return "/idle/device";
  }
  //非设备类报废
  private getIdleUnDeviceUrl() {
    return "/idle/undevice";
  }


  //报废
  private getScrapUrl() {
    return "/scrap";
  }
  //固定资产报废
  private getScrapFixUrl() {
    return "/scrap/fix";
  }
  //油气水井报废
  private getScrapWellUrl() {
    return "/scrap/well";
  }

  private getAlloUrl(){
    return "/allo";
  }

  private getHandleIdleUrl() {
    return "/handle/idle";
  }

  private getHandleScrapUrl() {
    return "/handle/scrap";
  }
  
  /////闲置
  
  /**
   * 从服务器获取闲置申请单
   * @param applyId 
   */
  getIdleBillFromServe(applyId:String):Promise<IdleBill>{
    return this.httpService.get(this.getIdleUrl() + '/apply/bill',{
      applyId
    })
  }

  ///设备类
  /**
   * 从服务器获取闲置资产信息
   * @param assetId 
   */
  getIdleDeviceFromServe(assetId:String):Promise<Idle>{
    return this.httpService.get(this.getIdleDeviceUrl() + '/apply/state',{
      assetId
    })
  }

  /**
   * 将本地闲置资产数据同步到服务器
   */
  synchroIdleDeviceToServe(idle: Idle):Promise<PostRequestResult> {
    var json = JSON.stringify(idle);
    let obj: any = {
      idle: json
    }
    return this.httpService.post(this.getIdleDeviceUrl() + "/synchro",obj,PubConstant.HTTP_TIME_OUT_LONG)
  }


  /**
   * 从服务器获取闲置申请单
   * @param applyId 
   */
  getIdleDeviceAssetListFromServe(applyId:String):Promise<Array<Idle>>{
    return this.httpService.get(this.getIdleDeviceUrl() + '/asset/bill',{
      applyId
    })
  }

  ///非设备类
  /**
   * 从服务器获取闲置资产信息
   * @param assetId 
   */
  getIdleUnDeviceFromServe(assetId:String):Promise<Idle>{
    return this.httpService.get(this.getIdleUnDeviceUrl() + '/apply/state',{
      assetId
    },PubConstant.HTTP_TIME_OUT_SHORT)
  }

  /**
   * 将本地闲置资产数据同步到服务器
   */
  synchroIdleUnDeviceToServe(idle: Idle):Promise<PostRequestResult> {
    let options = HttpUtils.getRequestOptions();
    var json = JSON.stringify(idle);
    return this.httpService.post(this.getIdleUnDeviceUrl() + "/synchro",{
      idle:json
    },PubConstant.HTTP_TIME_OUT_LONG)
  }


  /**
   * 从服务器获取闲置申请单
   * @param applyId 
   */
  getIdleUnDeviceAssetListFromServe(applyId:String):Promise<Array<Idle>>{
    return this.httpService.get(this.getIdleUnDeviceUrl() + '/asset/list',{
      applyId
    },PubConstant.HTTP_TIME_OUT_SHORT)
  }

  
  ////报废
  /**
   * 从服务器获取闲置申请单
   * @param applyId 
   */
  getScrapBillFromServe(applyId:String):Promise<ScrapBill>{
    return this.httpService.get(this.getScrapUrl() + '/apply/bill',{
      applyId
    })
  }

  //固定资产
  /**
   * 从服务器获取报废资产信息
   * @param assetId 
   */
  getScrapFixFromServe(assetId:String):Promise<Scrap>{
    return this.httpService.get(this.getScrapFixUrl() + '/apply/state',{
      assetId
    },PubConstant.HTTP_TIME_OUT_SHORT)
  }
  /**
   * 将本地报废资产数据同步到服务器
   */
  synchroScrapFixToServe(scrap: Scrap):Promise<PostRequestResult> {
    let options = HttpUtils.getRequestOptions();
    var json = JSON.stringify(scrap);
    return this.httpService.post(this.getScrapFixUrl() + "/synchro",{
      scrap:json
    },PubConstant.HTTP_TIME_OUT_LONG)
  }



  /**
   * 从服务器获取资产列表
   * @param applyId 
   */
  getScrapFixAssetListFromServe(applyId:String):Promise<Array<Scrap>>{
    return this.httpService.get(this.getScrapFixUrl() + '/asset/list',{
      applyId
    })
  }

  //油气水井
  /**
   * 从服务器获取报废资产信息
   * @param assetId 
   */
  getScrapWellFromServe(assetId:String):Promise<Scrap>{
    return this.httpService.get(this.getScrapWellUrl() + '/apply/state',{
      assetId
    },PubConstant.HTTP_TIME_OUT_SHORT)
  }
  /**
   * 将本地报废资产数据同步到服务器
   */
  synchroScrapWellToServe(scrap: Scrap):Promise<PostRequestResult> {
    var json = JSON.stringify(scrap);
    return this.httpService.post(this.getScrapWellUrl() + "/synchro",{
      scrap:json
    },PubConstant.HTTP_TIME_OUT_LONG)
  }

  

  /**
   * 从服务器获取资产列表
   * @param applyId 
   */
  getScrapWellAssetListFromServe(applyId:String):Promise<Array<Scrap>>{
    return this.httpService.get(this.getScrapWellUrl() + '/asset/list',{
      applyId
    },PubConstant.HTTP_TIME_OUT_SHORT)
  }




  //调拨方法
  /**
   * 从服务器获取调拨申请单
   * @param allocateId 
   */
  getAlloBillFromServe(allocateId:String):Promise<AllocateBill>{
    return this.httpService.get(this.getAlloUrl() + '/bill',{
      allocateId
    })
  }

  /**
   * 从服务器获取调拨资产列表
   * @param allocateId 
   */
  getAlloAssetListFromServe(allocateId:String):Promise<Array<Asset>>{
    return this.httpService.get(this.getAlloUrl() + '/asset/list',{
      allocateId
    })
  }
  /**
   * 从服务器获取该员工下正在申请调拨的资产列表
   * @param workerNumber 
   */
  getAlloingListFromServe(workerNumber:String):Promise<Array<Asset>>{
    return this.httpService.get(this.getAlloUrl() + '/asset/list/alloing',{
      agent:workerNumber
    })
  }

  /**
   * 将报废申请提交到服务器
   * @
   */
  submitAllocateToServe(allocate: AllocateBill,assetList:Array<string>):Promise<PostRequestResult> {
    var json = JSON.stringify(allocate);
    let obj: any = {
      allocate: json,
      assetList:JSON.stringify(assetList)
    }
    return this.httpService.post(this.getAlloUrl() + "/synchro",{
      allocate: json,
      assetList:JSON.stringify(assetList)
    },PubConstant.HTTP_TIME_OUT_LONG)
  }
  //调拨方法END

  //闲置处置方法
  /**
   * 从服务器获取闲置处置申请单
   * @param applyId 
   */
  getHandleIdleBillFromServe(applyId:String):Promise<HandleBill>{
    return this.httpService.get(this.getHandleIdleUrl() + '/bill',{
      applyId
    })
  }

  /**
   * 从服务器获取闲置处置资产列表
   * @param applyId 
   */
  getHandleIdleAssetListFromServe(applyId:String):Promise<Array<Asset>>{
    return this.httpService.get(this.getHandleIdleUrl() + '/asset/list',{
      applyId
    })
  }
  //闲置处置方法END

  //报废处置方法
  /**
   * 从服务器获取报废处置申请单
   * @param allocateId 
   */
  getHandleScrapBillFromServe(applyId:String):Promise<HandleBill>{
    return this.httpService.get(this.getHandleScrapUrl() + '/bill',{
      applyId
    })
  }

  /**
   * 从服务器获取报废处置资产列表
   * @param applyId 
   */
  getHandleScrapAssetListFromServe(applyId:String):Promise<Array<Asset>>{
    return this.httpService.get(this.getHandleScrapUrl() + '/asset/list',{
      applyId
    })
  }
  //报废处置方法END
}