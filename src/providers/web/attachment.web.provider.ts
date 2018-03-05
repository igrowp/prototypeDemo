import { HttpUtils } from './../utils/httpUtils';
import { Http } from '@angular/http';
import { ForkJoinObservable } from 'rxjs/observable/ForkJoinObservable';
import { Observable } from "rxjs";
import { File, FileEntry } from '@ionic-native/file';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { PubConstant } from '../entity/constant.provider';

@Injectable()
export class AttachmentWebProvider{
    constructor(public http: Http,
        private file: File) {
    }
    getUrl(){
      return HttpUtils.getFileUploadUrlFromProperties()+"/upload";
    }
  

    ////////////////////提交签名//////////////////////
  /**
   * 上传签名
   * @param blob 
   * @param fileName 文件名
   * @param params 参数 Map<key,value>
   */
  uploadSignature(blob: Blob, fileName, params) {
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
  formData = new FormData();
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

  uploadFile(params: Map<string, string>, filePaths: Array<string>, context: any, success: Function, fail: Function) {
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