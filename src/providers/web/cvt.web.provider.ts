import { PubConstant } from './../entity/constant.provider';
import { CvtNonNotice, CvtNonNoticeSub, CvtNonReceive, CvtNonCheck } from './../entity/cvt.entity.provider';
import { FixedAsset } from './../entity/entity.provider';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpUtils } from '../utils/httpUtils';
import { AttachmentWebProvider } from './attachment.web.provider';
import { HttpService } from '../utils/http/http.service';

@Injectable()
export class CvtWebProvider {
  constructor(public http: Http,
    private httpService:HttpService,
    private attaWebProvider: AttachmentWebProvider) {
  }
  private getUrl() {
    return HttpUtils.getUrlFromProperties() + "/cvt/noninstal";
  }
  private baseUrl="/cvt/noninstal"

  //从服务器根据员工编号得到资产，，，领用人的
  getAllCvtAsset(workerNumber: string, noticeId: string):Promise<Array<CvtNonReceive>> {
    return this.httpService.get(this.baseUrl+'/receive/list',{
      workerNumber,
      noticeId
    })
  }

  /**
   * 获取通知单内容
   * @param recipient 
   * @param orgId 
   */
  getCvtNoticeByRecipient(recipient: string):Promise<Array<CvtNonNotice>> {
    return this.httpService.get(this.baseUrl+'/notice/list',{
      recipient
    })
  }


  /**
   * 获取通知单内容
   * @param recipient 
   * @param orgId 
   */
  getCvtNoticeByNoticeId(noticeId: string) {
    return this.httpService.get(this.baseUrl+'/notice',{
      noticeId
    })
  }
  /**
   * 获取资产验收单
   * @param recipient 
   */
  getCvtNonCheckByCheckId(checkId: string):Promise<CvtNonCheck> {
    return this.httpService.get(this.baseUrl+'/check',{
      checkId
    })
  }

  /**
   * 获取资产转产附加通知列表
   * @param noticeId 
   */
  getCvtNonNoticeSubList(noticeId: string):Promise<Array<CvtNonNoticeSub>> {
    return this.httpService.get(this.baseUrl+'/notice/sub/list',{
      noticeId
    })
  }

  /**
   * 领用人不再发放，直接保存
   */
  receiverNoGranting(noticeId, recipient):Promise<Array<string>> {
    return this.httpService.get(this.baseUrl+'/save',{
      noticeId,
      recipient
    })

  }

  /**
   * 根据通知单详情获取某一项资产的列表
   * @param subNoticeId 
   */
  getCvtAssetListBySubNoticeId(subNoticeId: string):Promise<Array<FixedAsset>> {
    return this.httpService.get(this.baseUrl+'/fixed/list/sub',{
      subNoticeId
    })
  }

  updateStateToCvtNotice(state: string, noticeId: string) {
    return this.httpService.get(this.baseUrl+'/notice/update',{
      noticeState:state,
      noticeId
    })
  }

  /**
   * 将本地数据资产台账同步到服务器
   */
  syncCvtNonReceiveToServer(cvtNonReceives: Array<CvtNonReceive>) {
    var json = JSON.stringify(cvtNonReceives);
    let obj: any = {
      cvtNonReceives: json
    }
    
    let options = HttpUtils.getRequestOptions();
    return new Promise((resolve, reject) => {
      if (cvtNonReceives == null || cvtNonReceives.length == 0) {
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
            this.attaWebProvider.uploadSignature(cvtNonReceive.receivePerson, cvtNonReceive.signaturePath, cvtNonReceive.signatureName, cvtNonReceive.receiveId, null, null, PubConstant.ATTACHMENT_TYPE_SIGNATURE_CVT_RECEIVER2, this.attaWebProvider.UploadType.BASE64);
          }
          resolve("同步成功");
        }, err => {
          reject(err);
        });
    });
  }
}