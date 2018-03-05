import { PubConstant } from './../entity/constant.provider';
import { InvAsset, InvNotice } from './../entity/entity.provider';
import { Http, Headers,RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { PhotoLibrary } from '@ionic-native/photo-library';
import 'rxjs/add/operator/map';
import { HttpUtils } from '../utils/httpUtils';
import { AttachmentWebProvider } from './attachment.web.provider';

@Injectable()
export class InvWebProvider{
    constructor(public http: Http,
        private photoLibrary: PhotoLibrary,
        private attaWebProvider:AttachmentWebProvider,) {
  }
  getUrl(){
    return HttpUtils.getUrlFromProperties()+"/inv";
  }

    /**
     * 根据单位获得盘点通知单
     * @param leadingOrg 
     */
    getInvNoticeByOrg(leadingOrg: string) {
        let params = "?leadingOrg=" + leadingOrg;
        return new Promise<InvNotice>((resolve, reject) => {
          this.http.get(this.getUrl() + '/notice' + params)
            .map(res => res.json())
            .subscribe((data) => {
              if (JSON.stringify(data) == "{}") {
                resolve(null);
              } else {
                resolve(data);
              }
            }, err => {
              reject(err);
            })
        })
    
      }

      // test(invAssets) {
      //   let headers = new Headers();
      //   //headers.append("Accept", 'application/json');
      //   headers.append('Content-Type', 'application/x-www-form-urlencoded');
      //   let options = new RequestOptions({
      //     headers: headers
      //   });
      //   alert(invAssets);
      //   var json = JSON.stringify(invAssets);
      //   console.log(json);
    
      //   let obj: any = {
      //     invAssets: invAssets
      //   }
      //   alert( HttpUtils.toQueryString(obj));
    
      //   return new Promise((resolve, reject) => {
      //     this.http.post(this.getUrl() + "/record", HttpUtils.toQueryString(obj), options)
      //       .map(res => res.text())
      //       .subscribe((data) => {
      //         alert(data)
      //       })
      //   })
      // }    


      /**
   * 将本地资产盘点记录数据同步到服务器
   */
  syncInvToServer(invAssets: Array<InvAsset>) {
    let options =HttpUtils.getRequestOptions();
    var json = JSON.stringify(invAssets);
    console.log(json);
    let obj: any = {
      invAssets: json
    }
    return new Promise((resolve, reject) => {
      this.http.post(this.getUrl() + "/record", HttpUtils.toQueryString(obj), options)
        .map(res => res.json())
        .subscribe((data) => {
          if (invAssets.length == 0) {
            resolve();
          } else {
            for (var i = 0; i < invAssets.length; i++) {
              //图片上传成功
              //传签名
              let invAsset = invAssets[i];
              let signatureParams = new Map<string, string>();
              signatureParams.set("workerNumber", invAsset.workerNumber);
              signatureParams.set("recordId", invAsset.invRecordId);
              signatureParams.set("attachmentType", "inv_signature"); //转产凭证、资产附件、转产照片、盘点
              this.photoLibrary.getPhoto(invAsset.signaturePath).then((blob) => {
                this.attaWebProvider.uploadSignature(blob, invAsset.signature, signatureParams).then(() => {
                  //上传图片
                  let photoUploadParams = new Map<string, string>();
                  photoUploadParams.set("invRecordId", invAsset.noticeId);
                  photoUploadParams.set("attachmentType", "inv_img"); //转产凭证、资产附件、转产照片、盘点
                  photoUploadParams.set("workerNumber", invAsset.workerNumber);
                  let photo: Array<string> = new Array<string>();
                  if (invAsset.photoPath != "") {
                    photo = JSON.parse(invAsset.photoPath);
                  }
                  if (photo.length != 0) {
                    this.attaWebProvider.uploadFile(photoUploadParams, photo, self, (success) => {
                      if (invAsset.assetId == invAssets[invAssets.length - 1].assetId) {
                        //说明完成了最后一个的图片上传
                        resolve("同步成功");
                      }
                      //图片上传成功
                    }, (fail) => {
                      //图片上传失败
                      resolve("同步成功");
                      // reject("图片上传失败"+fail+"<br>");
                    });//END上传图片
                  } else {
                    resolve("同步成功" + "<br>");
                  }
                }, error => {
                  reject(error + "<br>")
                })
              }, error => {
                reject(error + "<br>")
              })
            }
          }
        }, err => {
          reject(err + "<br>");
        });
    });
  }
  

  
}