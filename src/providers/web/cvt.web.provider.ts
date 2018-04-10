import { PubConstant } from './../entity/constant.provider';
import { CvtNonNotice, CvtNonNoticeSub,CvtNonReceive } from './../entity/cvt.entity.provider';
import { FixedAsset } from './../entity/entity.provider';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpUtils } from '../utils/httpUtils';
import { AttachmentWebProvider } from './attachment.web.provider';

@Injectable()
export class CvtWebProvider{
    constructor(public http: Http,
    private attaWebProvider:AttachmentWebProvider) {
    }
    getUrl(){
      return HttpUtils.getUrlFromProperties()+"/cvt/noninstal";
    }

  //从服务器根据员工编号得到资产，，，领用人的
  getAllCvtAsset(workerNumber:string,noticeId:string){
    let params= "?workerNumber="+workerNumber+"&noticeId="+noticeId;
    return new Promise<Array<CvtNonReceive>>((resolve,reject)=>{
      this.http.get(this.getUrl()+'/receive/list'+params)
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
  getCvtNoticeByRecipient(recipient:string){
    let params= "?recipient="+recipient;
    return new Promise<Array<CvtNonNotice>>((resolve,reject)=>{
      this.http.get(this.getUrl()+'/notice/list'+params)
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
  getCvtNoticeByNoticeId(noticeId:string){
    let params= "?noticeId="+noticeId;
    return new Promise<CvtNonNotice>((resolve,reject)=>{
      this.http.get(this.getUrl()+'/notice'+params)
      .map(res=>res.json())
      .subscribe((data)=>{
        if(data=="{}"){
          resolve(null);
        }else{
          resolve(data);
        }
      },err=>{
        reject(err);
      })
    })
  }


  /**
   * 获取资产转产附加通知列表
   * @param noticeId 
   */
  getCvtNonNoticeSubList(noticeId:string){
    let params= "?noticeId="+noticeId;
    return new Promise<Array<CvtNonNoticeSub>>((resolve,reject)=>{
      this.http.get(this.getUrl()+'/notice/sub/list'+params)
      .map(res=>res.json())
      .subscribe((data)=>{
        if(JSON.stringify(data)=="[]"){
          resolve(null);
        }else{
          resolve(data);
        }
      },err=>{
        reject(err);
      })
    })
  }
  
  /**
   * 领用人不再发放，直接保存
   */
  receiverNoGranting(noticeId,recipient){
    let params= "?noticeId="+noticeId+"&recipient="+recipient;
    return new Promise<Array<string>>((resolve,reject)=>{
      this.http.get(this.getUrl()+'/save'+params)
      .map(res=>res.json())
      .subscribe((data)=>{
        resolve(data);
        console.log(data);
      },err=>{
        reject(err);
      })
    })
    
  }

  /**
   * 根据通知单详情获取某一项资产的列表
   * @param subNoticeId 
   */
  getCvtAssetListBySubNoticeId(subNoticeId:string){
    let params= "?subNoticeId="+subNoticeId;
    return new Promise<Array<FixedAsset>>((resolve,reject)=>{
      this.http.get(this.getUrl()+'/fixed/list/sub'+params)
      .map(res=>res.json())
      .subscribe((data)=>{
        resolve(data);
      },err=>{
        reject(err);
      })
    })
  }

  updateStateToCvtNotice(state:string,noticeId:string){
    let params= "?noticeState="+state+"&noticeId="+noticeId;
    return new Promise<string>((resolve,reject)=>{
      this.http.get(this.getUrl()+'/notice/update'+params)
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
    let options=HttpUtils.getRequestOptions();
    var json = JSON.stringify(cvtNonReceives);
    let obj: any = {
      cvtNonReceives: json
    }
    return new Promise((resolve, reject) => {
      if(cvtNonReceives==null||cvtNonReceives.length==0){
        resolve();
        return;
      }
      this.http.post(this.getUrl() + "/receive", HttpUtils.toQueryString(obj), options)
        .map(res => res.json())
        .timeout(PubConstant.HTTP_TIME_OUT_LONG)
        .subscribe((data) => {
          //var receiveId = cvtNonReceives[cvtNonReceives.length - 1].receiveId;
          for (var i = 0; i < cvtNonReceives.length; i++) {
            //图片上传成功
            //传签名
            let cvtNonReceive = cvtNonReceives[i];
            this.attaWebProvider.uploadSignature(cvtNonReceive.receivePerson,cvtNonReceive.signaturePath,cvtNonReceive.signatureName,cvtNonReceive.receiveId,null,null,PubConstant.ATTACHMENT_TYPE_CVT_SIGNATURE,this.attaWebProvider.UploadType.BASE64);
          }
          resolve("同步成功");
        }, err => {
          reject(err);
        });
    });
  }
}