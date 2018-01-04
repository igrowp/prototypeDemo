import { UserSimple, UserAccount, InvNotice } from './../entity/entity.provider';
import { User, InvAsset, ChangeRecord } from './../entity/entity.provider';
import { LocalStorageService } from './localStorage.service';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { File, FileEntry } from '@ionic-native/file';
import { ForkJoinObservable } from 'rxjs/observable/ForkJoinObservable';
import { Observable } from "rxjs";
import { FixedAsset, OrgInfo } from '../entity/entity.provider';

/*
  与后台服务器进行的数据交互
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class WebService {
  Local_URL: string = "http://10.88.133.45:8080/ionicApp/";
  //Local_URL:string="http://11.10.97.76:8080/ionicApp/";
  //Local_URL:string="http://localhost:8080/ionicApp/";
  //Local_URL:string="http://192.168.1.33:8080/ionicApp/";
  constructor(public http: Http,
    public alertCtrl: AlertController,
    private photoLibrary: PhotoLibrary,
    private localService: LocalStorageService,
    private file: File) {
    this.localService.getFromStorage("URL").then((val) => {
      if (val != null && val != "") {
        this.Local_URL = val.toString();
      }
    })
  }

  /**
   * 设置本地URL
   * @param URL 
   */
  setURL(URL: string) {
    this.Local_URL = URL;
  }

  /**
   * 获取本地URL地址
   */
  getURL() {
    return this.Local_URL;
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
      this.http.post(this.Local_URL + "inv/uploadSignature", fd)
        .map(res => res.json)
        .subscribe((data) => {
          //alert("成功"+data);  
          resolve(data);
        }, err => {
          reject(err);
        });
    });

  }

  /////////////////////提交签名END/////////////////

  /**
   * 获取资产列表数据
   */
  testhttp() {
    let params = "?workerNumber=" + '00440755';
    return new Promise<Array<FixedAsset>>((resolve, reject) => {
      this.http.get('http://10.88.133.45:8082/ajax/base/test' + params)
        .map(res => res.json())
        .subscribe((data) => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }



  /**
   * 获取资产列表数据
   */
  getListFormFixedByWorkerNumber(workerNumber: string) {
    let params = "?workerNumber=" + workerNumber;
    return new Promise<Array<FixedAsset>>((resolve, reject) => {
      this.http.get(this.Local_URL + 'getListFormFixedByWorkerNumber' + params)
        .map(res => res.json())
        .subscribe((data) => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }

  //////////////登陆//////////////////

  /**
   * 根据账号和密码获取员工数据信息
   * @param account 
   * @param password 
   */
  getUserAccountByNameAndPWD(account: string, password: string) {
    let params = "?loginName=" + account + "&loginPWD=" + password;
    return new Promise<UserAccount>((resolve, reject) => {
      this.http.get(this.Local_URL + '/getUserAccountByloginNameAndPWD' + params)
        .map(res => res.json())
        .subscribe((data) => {
          if (JSON.stringify(data) == "{}") {
            resolve(null);
          } else {
            resolve(data);
          }
        }, err => {
          //查询不到数据会进入这个方法
          reject(err);
        })
    })
  }

  /**
   * 根据用户ID获取员工信息
   * @param userId 
   */
  getUserMessage(userId: string) {
    let params = "?userId=" + userId;
    return new Promise<User>((resolve, reject) => {
      this.http.get(this.Local_URL + 'getUserMessage' + params)
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

  getUserMessageByWorkerNumber(workerNumber: string) {
    let params = "?workerNumber=" + workerNumber;
    return new Promise<User>((resolve, reject) => {
      this.http.get(this.Local_URL + 'getUserMessageByWorkerNumber' + params)
        .map(res => res.json())
        .subscribe((data) => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }


  ////////////登陆 END ////////////////



  ////////////盘点/////////////////
  getInvNoticeByOrg(leadingOrg: string) {
    let params = "?leadingOrg=" + leadingOrg;
    return new Promise<InvNotice>((resolve, reject) => {
      this.http.get(this.Local_URL + 'inv/getInvNoticeByOrg' + params)
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



  ////////////盘点END////////////

  ///////////////数据更新同步下载//////////////////

  /**
   * 从服务器获取组织机构信息
   * @param workerNumber 
   */
  getOrgInfoListFromServe() {
    return new Promise<Array<OrgInfo>>((resolve, reject) => {
      this.http.get(this.Local_URL + 'getOrgInfoList')
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
 * @param workerNumber 
 */
  getUserSimpleListFromServe() {
    return new Promise<Array<UserSimple>>((resolve, reject) => {
      this.http.get(this.Local_URL + 'getUserSimpleList')
        .map(res => res.json())
        .subscribe((data) => {
          resolve(data);
        }, error => {
          reject(error.message);
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
      this.http.post(this.Local_URL + "updateToFixed",WebService.toQueryString(obj), options)
        .map(res => res.json)
        .subscribe((data) => {
          resolve(data);
        }, err => {
          reject(err);
        });
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
      this.http.post(this.Local_URL + "updateToChangeRecord", WebService.toQueryString(obj), options)
        .map(res => res.json)
        .subscribe((data) => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  /**
   * 将本地资产盘点记录数据同步到服务器
   */
  syncInvToServer(invAssets: Array<InvAsset>) {
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({
      headers: headers
    });
    var json = JSON.stringify(invAssets);
    console.log(json);

    let obj: any = {
      invAssets: json
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.Local_URL + "updateToInv", WebService.toQueryString(obj), options)
        .map(res => res.json)
        .subscribe((data) => {
          if (invAssets.length == 0) {
            resolve();
          }
          for (var i = 0; i < invAssets.length; i++) {
            //图片上传成功！
            //传签名
            let invAsset = invAssets[i];
            let signatureParams = new Map<string, string>();
            signatureParams.set("workerNumber", invAsset.workerNumber);
            this.photoLibrary.getPhoto(invAsset.signaturePath).then((blob) => {
              this.uploadSignature(blob, invAsset.signature, signatureParams).then(() => {
                //上传图片
                let photoUploadParams = new Map<string, string>();
                photoUploadParams.set("invRecordId", invAsset.noticeId);
                photoUploadParams.set("attachmentType", "inv"); //转产凭证、资产附件、转产照片、盘点
                photoUploadParams.set("workerNumber", invAsset.workerNumber);
                let photo: Array<string> = new Array<string>();
                if (invAsset.photoPath != "") {
                  photo = JSON.parse(invAsset.photoPath);
                }
                if (photo.length != 0) {
                  this.uploadFile(photoUploadParams, photo, self, (success) => {
                    if (invAsset.assetId == invAssets[invAssets.length - 1].assetId) {
                      //说明完成了最后一个的图片上传
                      resolve("同步成功");
                    }
                    //图片上传成功！
                  }, (fail) => {
                    //图片上传失败！
                    resolve("同步成功");
                    // reject("图片上传失败"+fail+"\n");
                  });//END上传图片
                } else {
                  resolve("同步成功" + "\n");
                }
              }, error => {
                reject(error + "\n")
              })
            }, error => {
              reject(error + "\n")
            })
          }
        }, err => {
          reject(err + "\n");
        });
    });
  }

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
          .catch(error => alert('报错了' + JSON.stringify(error) + "\n"));
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
      this.http.post(this.Local_URL + "inv/upload", this.formData).toPromise().then(res => {
        success.call(context, res);
      }).catch(error => {
        fail.call(context, error);
      });
    }, error => {
      alert('文件处理失败' + "\n");
    });
  }

  ///////////////数据更新同步下载END//////////////////




  //使用以下方法将json进行参数化
  public static toQueryString(obj) {
    let result = [];
    for (let key in obj) {
      //key = encodeURIComponent(key);
      let values = obj[key];
      if (values && values.constructor == Array) {
        let queryValues = [];
        for (let i = 0, len = values.length, value; i < len; i++) {
          value = values[i];
          queryValues.push(this.toQueryPair(key, value));
        }
        result = result.concat(queryValues);
      } else {
        result.push(this.toQueryPair(key, values));
      }
    }
    return result.join('&');
  }
  public static toQueryPair(key, value) {
    if (typeof value == 'undefined') {
      return key;
    }
    //return key + '=' + encodeURIComponent(value === null ? '' : String(value));
    return key + '=' + (value === null ? '' : String(value));
  }


}
