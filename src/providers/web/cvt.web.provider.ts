import { CvtNonNotice, CvtNonNoticeSub,CvtNonReceive,CvtNonCheck } from './../entity/cvt.entity.provider';
import { FixedAsset } from './../entity/entity.provider';
import { WebService } from './../service/web.service';
import { Http, Headers,RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CvtWebProvider{
    private Local_URL="";
    constructor(public http: Http,
               private webService:WebService,) {
       this.Local_URL=webService.getURL()+"convert/noninstall/notice/";
    }
  //从服务器根据员工编号得到资产，，，领用人的
  getAllCvtAsset(noticeId:string,workInOrg:string){
    let params= "?noticeId="+noticeId+"&workInOrg="+workInOrg;
    return new Promise<Array<FixedAsset>>((resolve,reject)=>{
      this.http.get(this.Local_URL+'getAllCvtAsset'+params)
      .map(res=>res.json())
      .subscribe((data)=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  /**
   * 获取通知单内容
   * @param recipient 
   * @param orgId 
   */
  getCvtNoticeByRecipientAndOrg(recipient:string,orgId:string){
    let params= "?recipient="+recipient+"&orgId="+orgId;
    return new Promise<CvtNonNotice>((resolve,reject)=>{
      this.http.get(this.Local_URL+'getCvtNonNotice'+params)
      .map(res=>res.json())
      .subscribe((data)=>{  
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }
  getCvtNonNoticeSub(noticeId:string){
    let params= "?noticeId="+noticeId;
    return new Promise<Array<CvtNonNoticeSub>>((resolve,reject)=>{
      this.http.get(this.Local_URL+'getCvtNonNoticeSub'+params)
      .map(res=>res.json())
      .subscribe((data)=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  getCvtAssetByAssetName(assetName:string,purchasingId:string,orgId:string){
    let params= "?assetName="+assetName+"&purchasingId="+purchasingId+"&orgId="+orgId;
    return new Promise<Array<FixedAsset>>((resolve,reject)=>{
      this.http.get(this.Local_URL+'getCvtAssetByAssetName'+params)
      .map(res=>res.json())
      .subscribe((data)=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  updateStateToCvtNotice(state:string,noticeId:string){
    let params= "?state="+state+"&noticeId="+noticeId;
    return new Promise<string>((resolve,reject)=>{
      this.http.get(this.Local_URL+'updateStateToCvtNotice'+params)
      .map(res=>res.text())
      .subscribe((data)=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  /**
   * 将本地数据资产台账同步到服务器
   */
  syncCvtNonReceiveToServer(cvtNonReceives: Array<CvtNonReceive>) {
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({
      headers: headers
    });
    var json = JSON.stringify(cvtNonReceives);
    console.log(json);
    let obj: any = {
      cvtNonReceives: json
    }
    return new Promise((resolve, reject) => {
      if(cvtNonReceives==null||cvtNonReceives.length==0){
        resolve();
        return;
      }
      this.http.post(this.Local_URL + "updateToCvtNonReceive", WebService.toQueryString(obj), options)
        .map(res => res.json)
        .subscribe((data) => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }


  /**
   * 将本地数据资产台账同步到服务器
   */
  syncCvtNonCheckToServer(cvtNonChecks: Array<CvtNonCheck>) {
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({
      headers: headers
    });
    var json = JSON.stringify(cvtNonChecks);
    console.log(json);
    let obj: any = {
      cvtNonChecks: json
    }
    return new Promise((resolve, reject) => {
      if(cvtNonChecks==null||cvtNonChecks.length==0){
        resolve();
        return;
      }
      this.http.post(this.Local_URL + "updateToCvtNonCheck", WebService.toQueryString(obj), options)
        .map(res => res.json)
        .subscribe((data) => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

   

  
}