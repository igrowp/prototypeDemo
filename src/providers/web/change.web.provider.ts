import { HttpService } from './../utils/http/http.service';
import { PubConstant } from './../entity/constant.provider';
import { AssetChgPropertyBill, AssetChgOwnerBill ,Asset } from './../entity/pub.entity';
import { Injectable } from '@angular/core';

@Injectable()
export class ChangeWebProvider {
  constructor(public httpService:HttpService) {
  }

  private baseUrl_ChangeCustodian="/change/owner"
  private baseUrl_ChangeAssetState="/change/property"

  /**
   * 根据申请单ID获取资产信息
   * @param chgId 
   */
  getAssetListFromServe(chgId:String):Promise<Array<AssetChgOwnerBill>>{
    return this.httpService.get(this.baseUrl_ChangeCustodian+"/asset/list",{
      chgId
    })
  }


  //资产责任人变更方法
  /**
   * 从服务器获取该员工下正在资产责任人变更的资产
   * @param workerNumber 
   */
  getCCBillListFromServe(workerNumber:String):Promise<Array<AssetChgOwnerBill>>{
    return this.httpService.get(this.baseUrl_ChangeCustodian+"/bill/list",{
      workerNumber
    })
  }


  /**
   * 从服务器获取该员工下正在资产责任人变更的资产
   * @param workerNumber 
   */
  getCCApplyingListFromServe(workerNumber:String):Promise<Array<Asset>>{
    return this.httpService.get(this.baseUrl_ChangeCustodian+"/asset/list/applying",{
      workerNumber
    })
  }

  /**
   * 将责任人变更申请提交到服务器
   */
  submitCCBillToServe(record:AssetChgOwnerBill):Promise<string> {
    let obj: any = {
      record:JSON.stringify(record)
    }
    return this.httpService.post(this.baseUrl_ChangeCustodian+"/bill/submit",obj,PubConstant.HTTP_TIME_OUT_LONG)
  }

  /**
   * 将责任人变更申请提交到服务器
   */
  submitChangeCustodianToServe(bill: AssetChgOwnerBill,assetList:Array<string>):Promise<string> {
    var json = JSON.stringify(bill);
    let obj: any = {
      bill: json,
      assetList:JSON.stringify(assetList)
    }
    return this.httpService.post(this.baseUrl_ChangeCustodian+"/upload",obj,PubConstant.HTTP_TIME_OUT_LONG)
  }
  //资产责任人变更方法END


  //资产属性状态变更方法

  /**
   * 从服务器获取该员工下正在资产责任人变更的资产
   * @param workerNumber 
   */
  getCSBillListFromServe(workerNumber:String):Promise<Array<AssetChgPropertyBill>>{
    return this.httpService.get(this.baseUrl_ChangeAssetState+"/bill/list",{
      workerNumber
    })
  }


  /**
   * 从服务器获取该员工下正在资产状态属性变更的资产
   * @param workerNumber 
   */
  getCSApplyingListFromServe(workerNumber:String):Promise<Array<Asset>>{
    return this.httpService.get(this.baseUrl_ChangeAssetState+"/asset/list/applying",{
      workerNumber
    })
  }


  /**
   * 将责任人变更申请提交到服务器
   */
  submitCSBillToServe(record:AssetChgPropertyBill):Promise<string> {
    let obj: any = {
      record:JSON.stringify(record)
    }
    return this.httpService.post(this.baseUrl_ChangeAssetState+"/bill/submit",obj,PubConstant.HTTP_TIME_OUT_LONG)
  }


  /**
   * 将资产属性状态变更申请提交到服务器
   */
  submitChangeAssetStateToServe(bill: AssetChgPropertyBill,assetList:Array<string>):Promise<string> {
    var json = JSON.stringify(bill);
    let obj: any = {
      bill: json,
      assetList:JSON.stringify(assetList)
    }
    return this.httpService.post(this.baseUrl_ChangeAssetState+"/upload",obj,PubConstant.HTTP_TIME_OUT_LONG)
  }
  //资产属性状态变更方法END



}