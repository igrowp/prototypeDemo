import { PostRequestResult } from './../entity/pub.entity';
import { HttpUtils } from './../utils/httpUtils';
import { Http } from '@angular/http';
import { ForkJoinObservable } from 'rxjs/observable/ForkJoinObservable';
import { Observable } from "rxjs";
import { File, FileEntry } from '@ionic-native/file';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { PubConstant } from '../entity/constant.provider';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { ConvertUtil } from '../utils/convertUtil';

@Injectable()
export class AttachmentWebProvider {
  //上传文件方式
  UploadType = {
    BASE64: 0,
    BLOB: 1
  }
  constructor(private http: Http,
    private photoLibrary: PhotoLibrary,
    private file: File) {
  }
  private getUrl() {
    return HttpUtils.getFileUploadUrlFromProperties() + "/upload";
  }

  /**
   * 上传base64图片格式到服务器
   * @param recordId 存放附件的表的主键
   * @param recordIdList 存放附件的表的主键，批量处理情况(实例场景：资产领用时选择多个资产，只签一次名的情况)
   * @param cvtNonNoticeId 转产通知单ID
   * @param attachmentType 附件类型
   * @param base64 图片转为base64
   */
  private uploadBase64(recordId: string, recordIdList: string, cvtNonNoticeId, attachmentType: string, base64: string) {
    let options = HttpUtils.getRequestOptions();
    let obj: any = {
      recordId: recordId,
      attachmentType: attachmentType,
      recordIdList: recordIdList,
      cvtNonNoticeId: cvtNonNoticeId,
      base64: base64
    }
    return new Promise<PostRequestResult>((resolve, reject) => {
      this.http.post(this.getUrl() + "/base64/save", HttpUtils.toQueryString(obj), options)
        .map(res => res.json())
        .timeout(PubConstant.HTTP_TIME_OUT_LONG)
        .subscribe((data) => {
          resolve(data);
        }, (error) => {
          reject(error)
        })
    })
  }



  ////////////////////提交签名//////////////////////
  /**
   * 上传图片
   * @param workerNumber 员工编号
   * @param signaturePath 签名路径
   * @param signatureName 签名名称
   * @param recordId 存放附件的表的主键
   * @param recordIdList 存放附件的表的主键，批量处理情况
   * @param cvtNonNoticeId 转产通知单ID
   * @param attachmentType 附件类型
   * @param uploadType 上传类型
   */
  uploadSignature(workerNumber, signaturePath, signatureName, recordId, recordIdList, cvtNonNoticeId, attachmentType, uploadType: number) {
    return new Promise((resolve, reject) => {
      let signatureParams = new Map<string, string>();
      signatureParams.set("workerNumber", workerNumber);
      if (recordId) {
        signatureParams.set("recordId", recordId);
      } else if (recordIdList) {
        signatureParams.set("recordIdList", JSON.stringify(recordIdList));
      } else if (cvtNonNoticeId) {
        signatureParams.set("cvtNonNoticeId", cvtNonNoticeId);
      } else {
        //没有签名附件主键的情况
        reject("缺少附件表主键");
      }
      signatureParams.set("attachmentType", attachmentType); //转产凭证、资产附件、转产照片、盘点
      this.photoLibrary.getPhoto(signaturePath).then((blob) => {
        if (uploadType == this.UploadType.BLOB) {
          // 使用blob方式传递参数
          this.uploadSignatureToServe(blob, signatureName, signatureParams).then((data) => {
            resolve(data);
          }, err => reject(err))
        }
        else {
          ConvertUtil.blobToDataURL(blob, (base64) => {
            //使用base64方式传输
            this.uploadBase64(recordId, recordIdList, cvtNonNoticeId, attachmentType, base64).then(() => {
              resolve();
            }, err => reject(err))
          })
        }
      }, err => reject(err))
    })
  }


  /**
   * 上传签名
   * @param blob 
   * @param fileName 文件名
   * @param params 参数 Map<key,value>
   */
  private uploadSignatureToServe(blob: Blob, fileName, params) {
    let fd = new FormData();
    params.forEach((value, key) => {
      fd.append(key, value);
    });
    fd.append('file', blob, fileName);
    return new Promise((resolve, reject) => {
      this.http.post(this.getUrl() + "/signature", fd)
        .map(res => res.json())
        .timeout(PubConstant.HTTP_TIME_OUT_LONG)
        .subscribe((data) => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });

  }

  /////////////////////提交签名END/////////////////
  /**
   * 上传文件到服务器
   * @param recordId 主键ID
   * @param attachmentType 附件类型
   * @param workerNumber 员工编号
   * @param photoPaths 图片路径,字符串数组形式
   * @param uploadType 上传类型
   */
  uploadFile(recordId: string, attachmentType: string, workerNumber: string, photoPaths: Array<string>, uploadType: number) {
    if (uploadType == this.UploadType.BLOB) {
      //通过blob上传
      return this.uploadFileByBlob(recordId, attachmentType, workerNumber, photoPaths);
    } else {
      //通过base64进行上传
      return new Promise<PostRequestResult>((resolve, reject) => {
        if (photoPaths.length > 0) {
          let lastPhotoPath=photoPaths[photoPaths.length-1];
          for (let i = 0; i < photoPaths.length; i++) {
            let photoPath=photoPaths[i];
            ConvertUtil.fileUrlToBase64(photoPath).then((dataUrl) => {
              this.uploadBase64(recordId, null, null, attachmentType, dataUrl).then((data) => {
                if (lastPhotoPath == photoPath) {
                  resolve(data);
                }
              },(error)=>{
                reject(error);
              })
            }, (error) => {
              reject(error);
            })
          }
        } else {
          let result=new PostRequestResult();
          result.result=true;
          resolve(result);
        }
      })
    }
  }

  /**
   * 上传文件到服务器
   * @param recordId 主键ID
   * @param attachmentType 附件类型
   * @param workerNumber 员工编号
   * @param photoPaths 图片路径，Array<string>
   */
  private uploadFileByBlob(recordId: string, attachmentType: string, workerNumber: string, photoPaths) {
    //上传图片
    let photoUploadParams = new Map<string, string>();
    photoUploadParams.set("invRecordId", recordId);
    photoUploadParams.set("attachmentType", attachmentType); //转产凭证、资产附件、转产照片、盘点
    photoUploadParams.set("workerNumber", workerNumber);
    return new Promise<PostRequestResult>((resolve, reject) => {
      if (photoPaths.length != 0) {
        this.uploadFileToServe(photoUploadParams, photoPaths, self, (data) => {
          resolve(data);
        }, error => {
          reject(error);
        })
      } else {
        let result = new PostRequestResult();
        result.result = true;
        resolve(result);
      }
    })
  }





  private formData = new FormData();
  private upload(filePaths: Array<string>): Observable<any> {
    //每个文件上传任务创建一个信号
    var observables: Array<any> = [];
    filePaths.forEach((value: string, i, array) => {
      if (!value.startsWith('file://')) {
        value = 'file://' + value;
      }
      var observable = new Observable((sub: any) => {
        this.file.resolveLocalFilesystemUrl(value).then(entry => {
          (<FileEntry>entry).file(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const imgBlob = new Blob([reader.result], { type: file.type });
              this.formData.append('file', imgBlob, (<any>file).name);
              sub.next(null);
              sub.complete();
            };
            reader.readAsArrayBuffer(file);
          });
        })
          .catch(error => alert('报错了' + JSON.stringify(error) + "<br>"));
      });

      observables.push(observable);
    });
    return ForkJoinObservable.create(observables);
  }

  /**
   * 上传图片文件
   * @param params 
   * @param filePaths 
   * @param context 
   * @param success 
   * @param fail 
   */
  private uploadFileToServe(params: Map<string, string>, filePaths: Array<string>, context: any, success: Function, fail: Function) {
    this.formData = new FormData();
    //开始上传
    this.upload(filePaths).subscribe(data => {
      params.forEach((value, key) => {
        this.formData.append(key, value);
      });
      this.http.post(this.getUrl() + "/file", this.formData).toPromise().then(res => {
        success.call(context, res);
      }).catch(error => {
        fail.call(context, error);
      });
    }, error => {
      alert('文件处理失败' + "<br>");
    });
  }
}