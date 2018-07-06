import { HttpService } from './../utils/http/http.service';
import { PubConstant } from './../entity/constant.provider';
import { PostRequestResult, ChangeAssetStateBill } from './../entity/pub.entity';
import { Injectable } from '@angular/core';
import { FixedAsset, OrgInfo, UserSimple } from '../entity/entity.provider';
import { Asset, ChangeCustodianBill } from '../entity/pub.entity';

@Injectable()
export class ChangeWebProvider {
  constructor(public httpService:HttpService) {
  }

  private baseUrl_ChangeCustodian="/change/owner"
  private baseUrl_ChangeAssetState="/change/property"


  //资产责任人变更方法
//   /**
//    * 从服务器获取调拨申请单
//    * @param allocateId 
//    */
//   getAlloBillFromServe(allocateId:String):Observable<AllocateBill>{
//     let params = "?allocateId=" + allocateId;
//     return this.http.get(this.getAlloUrl() + '/bill' + params)
//         .map(res => res.json());
//   }

//   /**
//    * 从服务器获取调拨资产列表
//    * @param allocateId 
//    */
//   getAlloAssetListFromServe(allocateId:String):Observable<Array<Asset>>{
//     let params = "?allocateId=" + allocateId;
//     return this.http.get(this.getAlloUrl() + '/asset/list' + params)
//         .map(res => res.json());
//   }
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
  submitChangeCustodianToServe(bill: ChangeCustodianBill,assetList:Array<string>):Promise<PostRequestResult> {
    var json = JSON.stringify(bill);
    let obj: any = {
      bill: json,
      assetList:JSON.stringify(assetList)
    }
    return this.httpService.post(this.baseUrl_ChangeCustodian+"/upload",obj,PubConstant.HTTP_TIME_OUT_LONG)
  }
  //资产责任人变更方法END


  //资产属性状态变更方法
//   /**
//    * 从服务器获取调拨申请单
//    * @param allocateId 
//    */
//   getAlloBillFromServe(allocateId:String):Observable<AllocateBill>{
//     let params = "?allocateId=" + allocateId;
//     return this.http.get(this.getAlloUrl() + '/bill' + params)
//         .map(res => res.json());
//   }

//   /**
//    * 从服务器获取调拨资产列表
//    * @param allocateId 
//    */
//   getAlloAssetListFromServe(allocateId:String):Observable<Array<Asset>>{
//     let params = "?allocateId=" + allocateId;
//     return this.http.get(this.getAlloUrl() + '/asset/list' + params)
//         .map(res => res.json());
//   }
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
   * 将资产属性状态变更申请提交到服务器
   */
  submitChangeAssetStateToServe(bill: ChangeAssetStateBill,assetList:Array<string>):Promise<PostRequestResult> {
    var json = JSON.stringify(bill);
    let obj: any = {
      bill: json,
      assetList:JSON.stringify(assetList)
    }
    return this.httpService.post(this.baseUrl_ChangeAssetState+"/upload",obj,PubConstant.HTTP_TIME_OUT_LONG)
  }
  //资产属性状态变更方法END



}