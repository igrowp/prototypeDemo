import { PubConstant } from './../entity/constant.provider';
import { Dict, DictDetail } from './../entity/pub.entity';
import { ChangeRecord } from './../entity/entity.provider';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { FixedAsset, OrgInfo, UserSimple } from '../entity/entity.provider';
import { HttpUtils } from '../utils/httpUtils';

@Injectable()
export class AssetWebProvider {
  constructor(public http: Http) {
  }
  private getUrl() {
    return HttpUtils.getUrlFromProperties() + "/asset";
  }


  /**
   * 获取资产列表数据
   */
  getFixedByAssetId(assetId:string) {
    let params = "?assetId=" + assetId;
    return new Promise<FixedAsset>((resolve, reject) => {
      this.http.get(this.getUrl() + '/fixed' + params)
        .map(res => res.json())
        .subscribe((data) => {
          if(data=="{}"){
            resolve(null);
          }else{
            resolve(data);
          }
        }, err => {
          reject(err);
        })
    })
  }


  /**
   * 获取资产列表数据
   */
  getListFormFixedByWorkerNumber(workerNumber: string, lastRequestTime: string) {
    let params = "?workerNumber=" + workerNumber + "&lastRequestTime=" + lastRequestTime;
    return new Promise<Array<FixedAsset>>((resolve, reject) => {
      this.http.get(this.getUrl() + '/fixed/list' + params)
        .map(res => res.json())
        .subscribe((data) => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }

  /**
   * 将本地数据资产台账同步到服务器
   */
  syncFixedToServer(fixedAssets: Array<FixedAsset>) {
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({
      headers: headers
    });
    var json = JSON.stringify(fixedAssets);
    console.log(json);
    let obj: any = {
      fixedAssets: json
    }
    return new Promise((resolve, reject) => {
      if (fixedAssets == null || fixedAssets.length == 0) {
        resolve();
      } else {
        this.http.post(this.getUrl() + "/fixed/update", HttpUtils.toQueryString(obj), options)
          .map(res => res.json())
          .timeout(PubConstant.HTTP_TIME_OUT_LONG)
          .subscribe((data) => {
            resolve(data);
          }, err => {
            reject(err);
          });
      }
    });
  }

  /**
   * 将本地日志表同步到服务器
   */
  syncChangeRecordToServer(changeRecords: Array<ChangeRecord>) {
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({
      headers: headers
    });
    var json = JSON.stringify(changeRecords);
    console.log(json);
    let obj: any = {
      changeRecords: json
    }
    return new Promise((resolve, reject) => {
      if (changeRecords == null || changeRecords.length == 0) {
        resolve();
      } else {
        this.http.post(this.getUrl() + "/record", HttpUtils.toQueryString(obj), options)
          .map(res => res.json())
          .timeout(PubConstant.HTTP_TIME_OUT_LONG)
          .subscribe((data) => {
            resolve(data);
          }, err => {
            reject(err);
          });
      }
    });
  }



  /**
  * 从服务器获取组织机构信息
  */
  getOrgInfoListFromServe(lastRequestTime:string) {
    return new Promise<Array<OrgInfo>>((resolve, reject) => {
      let params = "?lastRequestTime=" + lastRequestTime;
      this.http.get(this.getUrl() + '/org/list'+params)
        .map(res => res.json())
        .subscribe((data) => {
          resolve(data);
        }, error => {
          reject(error.message);
        })
    })
  }

  /**
   * 从服务器获取简单用户信息
   */
  getUserSimpleListFromServe(lastRequestTime?:string) {
    return new Promise<Array<UserSimple>>((resolve, reject) => {
      let params ="";
      if(lastRequestTime){
        params="?lastRequestTime=" + lastRequestTime;
      } 
      this.http.get(this.getUrl() + '/user/simple/list'+params)
        .map(res => res.json())
        .subscribe((data) => {
          resolve(data);
        }, error => {
          reject(error.message);
        })
    })
  }

  /**
   * 从服务器获取简单用户信息
   */
  getUserSimpleFromServe(userId:string) {
    return new Promise<UserSimple>((resolve, reject) => {
      let params = "?userId=" + userId;
      this.http.get(this.getUrl() + '/user'+params)
        .map(res => res.json())
        .subscribe((data) => {
          if(data=="{}"){
            resolve(null);
          }else{
            resolve(data);
          }
        }, error => {
          reject(error.message);
        })
    })
  }

  /**
   * 从服务器获取数据字典
   */
  getDictListFromServe() {
    return new Promise<Array<Dict>>((resolve, reject) => {
      this.http.get(this.getUrl() + '/dict/list')
        .map(res => res.json())
        .subscribe((data) => {
          resolve(data);
        }, error => {
          reject(error.message);
        })
    })
  }

   /**
   * 从服务器获取数据字典明细
   */
  getDictDetailListFromServe(lastRequestTime:string) {
    return new Promise<Array<DictDetail>>((resolve, reject) => {
      let params = "?lastRequestTime=" + lastRequestTime;
      this.http.get(this.getUrl() + '/dict/detail/list'+params)
        .map(res => res.json())
        .subscribe((data) => {
          resolve(data);
        }, error => {
          reject(error.message);
        })
    })
  }

  /**
   * 获取服务器时间
   */
  getCurrentTimeFromServe() {
    return new Promise<string>((resolve, reject) => {
      this.http.get(this.getUrl() + '/current/time')
        .map(res => res.json())
        .subscribe((data) => {
          resolve(data.currentTime);
        }, error => {
          reject(error.message);
        })
    })
  }


}