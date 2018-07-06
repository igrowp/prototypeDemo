import { HttpService } from './../utils/http/http.service';
import { Dict, DictDetail } from './../entity/pub.entity';
import { ChangeRecord } from './../entity/entity.provider';
import { Injectable } from '@angular/core';
import { FixedAsset, OrgInfo, UserSimple } from '../entity/entity.provider';
import { PubConstant } from '../entity/constant.provider';

@Injectable()
export class AssetWebProvider {
  constructor(private httpService:HttpService) {
  }
  private baseUrl="/asset"


  /**
   * 根据资产id获取资产信息
   */
  getFixedByAssetId(assetId:string):Promise<FixedAsset> {
    return this.httpService.get(this.baseUrl+'/fixed',{
      assetId
    })
  }


  /**
   * 获取资产列表数据
   */
  getListFormFixedByWorkerNumber(workerNumber: string, lastRequestTime: string):Promise<Array<FixedAsset>> {
    return this.httpService.get(this.baseUrl+'/fixed/list',{
      workerNumber,
      lastRequestTime
    })
  }

  /**
   * 将本地数据资产台账同步到服务器
   */
  syncFixedToServer(fixedAssets: Array<FixedAsset>) {
    var json = JSON.stringify(fixedAssets);
    return this.httpService.post(this.baseUrl+"/fixed/update",{
      fixedAssets:json
    },PubConstant.HTTP_TIME_OUT_LONG)
  }

  /**
   * 将本地日志表同步到服务器
   */
  syncChangeRecordToServer(changeRecords: Array<ChangeRecord>) {
    var json = JSON.stringify(changeRecords);
    return this.httpService.post(this.baseUrl+"/record",{
      changeRecords:json
    },PubConstant.HTTP_TIME_OUT_LONG)
  }



  /**
  * 从服务器获取组织机构信息
  */
  getOrgInfoListFromServe(lastRequestTime:string=""):Promise<Array<OrgInfo>> {
    return this.httpService.get(this.baseUrl+'/org/list',{
      lastRequestTime
    })
  }

  /**
   * 从服务器获取简单用户信息
   */
  getUserSimpleListFromServe(lastRequestTime:string=""):Promise<Array<UserSimple>> {
        
    return this.httpService.get(this.baseUrl+'/user/simple/list',{
      lastRequestTime
    })
  }

  /**
   * 从服务器获取简单用户信息
   */
  getUserSimpleFromServe(userId:string):Promise<UserSimple> {
    return this.httpService.get(this.baseUrl+'/user',{
      userId
    })
  }

  /**
   * 从服务器获取数据字典
   */
  getDictListFromServe():Promise<Array<Dict>> {
    return this.httpService.get(this.baseUrl+'/dict/list')
  }

   /**
   * 从服务器获取数据字典明细
   */
  getDictDetailListFromServe(lastRequestTime:string=""):Promise<Array<DictDetail>> {
    return this.httpService.get(this.baseUrl+'/dict/detail/list',{
      lastRequestTime
    })
  }

  /**
   * 获取服务器时间
   */
  getCurrentTimeFromServe() {
    return this.httpService.get(this.baseUrl+'/current/time')
  }


}