import { PubConstant } from './../entity/constant.provider';
import { PostRequestResult, ChangeAssetStateBill } from './../entity/pub.entity';
import { Observable } from 'rxjs/Observable';

import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { FixedAsset, OrgInfo, UserSimple } from '../entity/entity.provider';
import { HttpUtils } from '../utils/httpUtils';
import { Asset, ChangeCustodianBill } from '../entity/pub.entity';

@Injectable()
export class ChangeWebProvider {
  constructor(public http: Http) {
  }
  private getChangeCustodianUrl() {
    return HttpUtils.getUrlFromProperties() + "/change/custodian";
  }
  private getChangeAssetStateUrl() {
    return HttpUtils.getUrlFromProperties() + "/change/state";
  }


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
   * 从服务器获取该员工下正在申请调拨的资产列表
   * @param workerNumber 
   */
//   getAlloingListFromServe(workerNumber:String):Observable<Array<Asset>>{
//     let params = "?agent=" + workerNumber;
//     return this.http.get(this.getChangeCustodianUrl() + '/asset/list/alloing' + params)
//         .map(res => res.json());
//   }

  /**
   * 将责任人变更申请提交到服务器
   */
  submitChangeCustodianToServe(bill: ChangeCustodianBill,assetList:Array<string>):Observable<PostRequestResult> {
    let options = HttpUtils.getRequestOptions();
    var json = JSON.stringify(bill);
    let obj: any = {
        bill: json,
        assetList:JSON.stringify(assetList)
    }
    return this.http.post(this.getChangeCustodianUrl() + "/upload", HttpUtils.toQueryString(obj), options)
          .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_LONG);
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
   * 从服务器获取该员工下正在申请调拨的资产列表
   * @param workerNumber 
   */
//   getAlloingListFromServe(workerNumber:String):Observable<Array<Asset>>{
//     let params = "?agent=" + workerNumber;
//     return this.http.get(this.getChangeCustodianUrl() + '/asset/list/alloing' + params)
//         .map(res => res.json());
//   }

  /**
   * 将责任人变更申请提交到服务器
   */
  submitChangeAssetStateToServe(bill: ChangeAssetStateBill,assetList:Array<string>):Observable<PostRequestResult> {
    let options = HttpUtils.getRequestOptions();
    var json = JSON.stringify(bill);
    let obj: any = {
        bill: json,
        assetList:JSON.stringify(assetList)
    }
    return this.http.post(this.getChangeAssetStateUrl() + "/upload", HttpUtils.toQueryString(obj), options)
          .map(res => res.json()).timeout(PubConstant.HTTP_TIME_OUT_LONG);
  }
  //资产属性状态变更方法END



}