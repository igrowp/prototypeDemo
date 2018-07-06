import { CvtDBProvider } from './../storage/cvt.db.provider';
import { HttpUtils } from './../utils/httpUtils';
import { PubConstant } from './../entity/constant.provider';
import { DBService } from './../storage/db.service';
import { LoginWebProvider } from './../web/login.web.provider';
import { AssetWebProvider } from './../web/asset.web.provider';
import { LoginDBProvider } from './../storage/login.db.provider';
import { User, UserAccount } from './../entity/entity.provider';
import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';
import { PubDBProvider } from './../storage/pub.db.provider';
import { NoticeService } from './notice.service';
/*
提供关于登陆的服务
*/
@Injectable()
export class LoginService {
  constructor(
    public loginWebProvider:LoginWebProvider,
    private loginDBProvider:LoginDBProvider,
    private assetWebProvider:AssetWebProvider,
    private pubDBProvider:PubDBProvider,
    private dbService:DBService,
    private alertCtrl:AlertController,
    private noticeService:NoticeService,
    private loadingCtrl:LoadingController,
    private cvtDbProvider:CvtDBProvider,
  ) {
    
  }
  

  /**
   * 设置服务器的地址和端口
   */
  settingHttpAddressAndPort(){
    var address=HttpUtils.getUrlAddressFromProperties();
    var port=HttpUtils.getUrlPortFromProperties();
    this.alertCtrl.create({
      title:"设置服务器地址/端口",
      inputs: [
        {
          label:'地址',
          name: 'address',
          placeholder: '地址：'+address
        },
        {
          name:'port',
          placeholder:'端口：'+port
        }
      ],
      buttons:[
        {
          text:'恢复默认值',
          handler:data=>{
            HttpUtils.setDefaultUrlToProperties();
            this.noticeService.showToast("设置成功");
          }
        },
        {
          text: '确定',
          handler: data => {
            if (data.address == "") {
              this.noticeService.showToast("服务器地址为空");
            } else if (data.port == "") {
              this.noticeService.showToast("服务器端口为空");
            } else {
              if (!data.address.includes("http://") && !data.address.includes("https://")) {
                data.address = "http://" + data.address;
              }
              HttpUtils.setUrlToProperties(data.address, data.port);
              //保存到本地
              this.setInStorage(PubConstant.LOCAL_STORAGE_KEY_URL_ADDRESS, data.address);
              this.setInStorage(PubConstant.LOCAL_STORAGE_KEY_URL_PORT, data.port);
              this.noticeService.showToast("设置成功");
            }
          }
        }
      ]
    }).present();
  }

  /**
   * 下载基本的数据
   */
  downloadBasicData() {
    return new Promise((resolve, reject) => {
      this.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_LAST_REQUEST_TIME).then((lastRequestTime) => {
        this.getAndSaveOrgInfoFromServe(lastRequestTime).then(() => {
          this.downloadDictIfEmpty().then(() => {
            this.getAndSaveDictDetailFromServe(lastRequestTime).then(() => {
              //this.getAndSaveUserSimpleFromServe(lastRequestTime).then(() => {
                //更新完成可以退出了
                this.getAndSaveCurrentTimeFromServe();
                resolve();
              //}, (error) => reject(error))
            }, (error) => reject(error))
          }, (error) => reject(error))
        }, (error) => reject(error))
      })
    })
  }



  /////////////数据下载同步////////////////////
  /**
   * 从服务器获取组织机构信息，并保存
   */
  getAndSaveOrgInfoFromServe(lastRequestTime:string){
    return new Promise((resolve, reject) => {
      this.assetWebProvider.getOrgInfoListFromServe(lastRequestTime).then((data) => {
        if (data == null || data.length == 0) {
          resolve();
        } else {
          for (var i = 0; i < data.length; i++) {
            let orgInfo = data[i]
            this.pubDBProvider.queryFromOrgInfoByOrgId(orgInfo.orgId).then((data1) => {
              if (data1 == null) {
                //说明本地没有该组织机构信息，插入
                this.pubDBProvider.insertToOrgInfo(orgInfo).then(() => {
                  //插入成功
                  if (orgInfo.orgId == data[data.length - 1].orgId) {
                    resolve();
                  }
                }, (error) => {
                  reject(error)
                })
              } else {
                //本地有该组织机构，进行更新
                this.pubDBProvider.updateToOrgInfo(orgInfo).then(() => {
                  //更新成功
                  if (orgInfo.orgId == data[data.length - 1].orgId) {
                    resolve();
                  }
                }, (error) => {
                  reject(error)
                })
              }
            })
          }
        }
      },error=>{
        reject(error);
      });
    });
  }

  // /**
  //  * 从服务器获取员工精简信息表，并保存
  //  */
  // getAndSaveUserSimpleFromServe(lastRequestTime:string){
  //   return new Promise((resolve, reject) => {
  //     this.assetWebProvider.getUserSimpleListFromServe(lastRequestTime).then((data) => {
  //       if (data == null || data.length == 0) {
  //         resolve();
  //       } else {
  //         for (var i = 0; i < data.length; i++) {
  //           let userSimple = data[i];
  //           this.pubDBProvider.queryFromUserSimpleByUserId(userSimple.userId).then((userName) => {
  //             if (userName == null) {
  //               this.pubDBProvider.insertToUserSimple(userSimple).then(() => {
  //                 //插入成功
  //                 if (userSimple.workerNumber == data[data.length - 1].workerNumber) {
  //                   //说明执行成功了
  //                   resolve();
  //                 }
  //               }, (error) => {
  //                 reject("插入简单员工表失败：" + userSimple.workerNumber + error)
  //               })
  //             } else {
  //               //已经有该成员，退出
  //               this.pubDBProvider.updateToUserSimple(userSimple).then(() => {
  //                 if (userSimple.workerNumber == data[data.length - 1].workerNumber) {
  //                   //说明执行成功了
  //                   resolve();
  //                 }
  //               }, error => reject(error))
  //             }
  //           })
  //         }
  //       }
  //     }, error => {
  //       reject(error);
  //     });
  //   });
  // }

  /**
   * 如果本地数据字典表中没有数据从服务器中下载数据
   */
  downloadDictIfEmpty(){
    return new Promise((resolve,reject)=>{
      this.pubDBProvider.queryListFromDict(1,1).then((data)=>{
        if(data==null||data.length==0){
          //说明本地没有员工信息，进行下载
          this.getAndSaveDictFromServe().then(()=>{
            resolve(data);
          },(error)=>{
            reject(error);
          });
        }else{
          //有数据就不用再下载了
          resolve(data);
        }
      },(error)=>{
        reject(error);
      })
    })
  }

  /**
   * 从服务器获取员工精简信息表，并保存
   */
  getAndSaveDictFromServe(){
    return new Promise((resolve, reject) => {
      this.assetWebProvider.getDictListFromServe().then((data) => {
        if (data == null || data.length == 0) {
          resolve();
        } else {
          let dictId=data[data.length-1].dictId;
          for (var i = 0; i < data.length; i++) {
            let dict = data[i];
            this.pubDBProvider.queryFromDictByDictId(dict.dictId).then((dictObject) => {
              if (dictObject == null) {
                this.pubDBProvider.insertToDict(dict).then(() => {
                  //插入成功
                  if (dict.dictId == dictId) {
                    //说明执行成功了
                    resolve();
                  }
                }, (error) => {
                  reject("插入简单员工表失败：" + error)
                })
              } else {
                //已经有该成员
                if (dict.dictId == dictId) {
                  //说明执行成功了
                  resolve();
                }
              }
            })
          }
        }
      }, error => {
        reject(error);
      });

    });
  }

   /**
   * 从服务器获取当前时间
   */
  getAndSaveCurrentTimeFromServe(){
    this.assetWebProvider.getCurrentTimeFromServe().then((data)=>{
      this.setInStorage(PubConstant.LOCAL_STORAGE_KEY_LAST_REQUEST_TIME,data.currentTime);
    })

  }



  /**
   * 从服务器获取字典附加表，并保存
   */
  getAndSaveDictDetailFromServe(lastRequestTime){
    return new Promise((resolve, reject) => {
      this.assetWebProvider.getDictDetailListFromServe(lastRequestTime).then((data) => {
        if (data == null || data.length == 0) {
          resolve();
        } else {
          let dictDetailId=data[data.length-1].dictDetailId;
          for (var i = 0; i < data.length; i++) {
            let dictDetail = data[i];
            this.pubDBProvider.queryFromDictDetailByDictDetailId(dictDetail.dictDetailId).then((dictObject) => {
              if (dictObject == null) {
                this.pubDBProvider.insertToDictDetail(dictDetail).then(() => {
                  //插入成功
                  if (dictDetail.dictDetailId == dictDetailId) {
                    //说明执行成功了
                    resolve();
                  }
                }, (error) => {
                  reject("插入简单员工表失败：" + error)
                })
              } else {
                //已经有该成员
                this.pubDBProvider.updateToDictDetail(dictDetail).then(()=>{
                  if (dictDetail.dictDetailId == dictDetailId) {
                    //说明执行成功了
                    resolve();
                  }
                },error=>reject(error))
              }
            })
          }
        }
      }, error => {
        reject(error);
      });

    });
  }
  /////////////数据下载同步END///////////////


  /**
   * 插入或更新账号信息
   * @param userAccount 账号信息
   */
   insertOrUpdateToUserAccount(userAccount:UserAccount){
      return new Promise((resolve,reject)=>{
          this.loginDBProvider.queryFromAccountByUserId(userAccount.userId).then((data)=>{
            if(data==null){
              //说明没有该人的账号信息，插入
              this.loginDBProvider.insertToAccount(userAccount).then((data)=>{
                // console.log("插入成功");
              },(error)=>{
                alert(error.message);
              })
            }else{
              //有该人的账号信息，进行更新
              this.loginDBProvider.updateToAccount(userAccount).then((data)=>{
                // console.log("更新成功!");
              },(error)=>{
                alert(error.message);
              })
            }
          })
      })

  }

  /**
   * 插入或更新员工信息
   * @param user 员工信息
   */
   insertOrUpdateToUser(user:User){
      return new Promise((resolve,reject)=>{
          this.loginDBProvider.queryFromUserInfoByUserId(user.userId).then((data)=>{
            if(data==null){
              //说明没有该人的账号信息，插入
              this.loginDBProvider.insertToUserInfo(user).then((data)=>{
                // console.log("插入成功");
              },(error)=>{
                alert(error.message);
              })
            }else{
              //有该人的账号信息，进行更新
              this.loginDBProvider.updateToUserInfo(user).then((data)=>{
                // console.log("更新成功!");
              },(error)=>{
                alert(error.message);
              })
            }
          })
      })

  }

  /**
   * 从服务器中获取用户的详细信息
   * @param userId 
   */
  getUserMessageFromServer(userId:string){
    return new Promise<User>((resolve,reject)=>{
      this.loginDBProvider.queryFromUserInfoByUserId(userId).then((data)=>{
        if(data==null){
          //说明本地没有该员工的信息，从服务器中获取
          this.loginWebProvider.getUserMessage(userId).then((user)=>{
            if(user==null){
              //说明没有该员工的信息
              reject("服务器中没有该员工的信息");
            }else{
              this.loginDBProvider.insertToUserInfo(user).then((data)=>{
                //插入成功
                resolve(user);
              },(error)=>{
                reject("插入员工信息到数据库失败"+error.message);
              })
            }
          },(error)=>{
            reject("获取员工信息失败，网络连接超时");
          })
        }else{
          resolve(data);
        }
      })
    })
  }

  /**
   * 通过员工账户和密码得到账户信息
   */
  queryAccountByUserNameAndPWD(userName:string,password:string){
    return new Promise<UserAccount>((resolve,reject)=>{
      this.loginDBProvider.queryFromAccountByNameAndPWD(userName,password).then((data)=>{
        if(data==null){
          //说明本地没有该成员的账户信息,从服务器获取
          let loading=this.loadingCtrl.create({
            content:'正在从服务器获取数据',
            duration:20000
          });
          loading.present();
          this.loginWebProvider.getUserAccountByNameAndPWD(userName,password).then((userAccount)=>{
            if(userAccount==null){
              loading.dismiss();
              reject("账户或密码错误，请确认后重试");
            }else{
              this.loginDBProvider.queryFromAccountByUserId(userAccount.userId).then((userData)=>{
                if(userData==null){
                  //说明本地没有存储该成员的账户信息，存储到本地
                  this.loginDBProvider.insertToAccount(userAccount).then(()=>{
                    // alert("插入账户信息");
                      loading.dismiss();
                      resolve(userAccount);
                    },(error)=>{
                      reject("插入账户到数据库错误："+error.message);
                  });
                }else{
                  //说明本地已经存储该成员的账户信息，进行更新
                  this.loginDBProvider.updateToAccount(userAccount).then(()=>{
                    // alert("插入账户信息");
                      loading.dismiss();
                      resolve(userAccount);
                    },(error)=>{
                      reject("更新账户到数据库错误："+error.message);
                  });
                }
              },(error)=>{
                reject("没有该成员的用户信息，请再次确认");
              })
              
            }
          },(error)=>{
            loading.dismiss();
            reject("获取登陆信息失败，网络连接超时");
          })
        }else{
          //说明有该成员的信息
          resolve(data);
        }
      })
    });
  }

    /**
   * 通过账号密码获得员工信息
   * @param userName 
   * @param password 
   */
  queryUserInfoByUserNameAndPWD(userName:string,password:string){
    return new Promise<User>((resolve,reject)=>{
      this.loginDBProvider.queryUserInfoByNameAndPWD(userName,password).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error.message);
      });
    });
  }
  


  /**
   * 从服务器中通过账号密码查询员工的信息
   * @param userId
   */
  getUserInfoFromServeByUserId(userId:string){
    return this.loginWebProvider.getUserMessage(userId);
  }

  /**
   * 根据单点登录返回结果得到用户信息
   * @param userId
   */
  getUserInfoFromServeBySSO(email:string):Promise<User>{
    return this.loginWebProvider.getUserMessageBySSO(email);
  }


  /**
   * 向本地存储写入键值对     待改进
   * @param key 
   * @param value 
   */
  setInStorage(key: string, value: string) {
    return new Promise((resolve, reject) => {
      if (key == "" || key == null) {
        reject("键为空");
      }
      this.dbService.getFromStorage(key).then((data) => {
        if (data == null || data == "") {
          //说明本地没有该记录
          this.dbService.setInStorage(key, value).then((data) => {
            resolve(data);
          }, (error) => {
            reject(error);
          })
        } else {
          //说明本地已经有该记录，删除后重新添加
          this.dbService.removeFromStorage(key).then(() => {
            this.dbService.setInStorage(key, value).then((data) => {
              resolve(data);
            }, (error) => {
              reject(error);
            })
          }, (error) => {
            reject(error);
          })
        }
      }, (error) => {
        reject(error);
      })
    })
  }
    
  /**
   * 从本地存储中读取
   * @param key 
   */
  getFromStorage(key: string) {
    return new Promise<string>((resolve, reject) => {
      if (key == "" || key == null) {
        reject("键为空");
        return;
      }
      this.dbService.getFromStorage(key).then((data) => {
        if (data != null) {
          resolve(data.toString());
        } else {
          resolve(null);
        }
      }, (error) => {
        reject(error);
      })
    })
  }

  /**
   * 删除本地存储的key键值对
   * @param key 
   */
  RemoveFromStorage(key: string) {
    return new Promise((resolve, reject) => {
      if (key == "" || key == null) {
        reject("键为空");
        return;
      }
      this.dbService.removeFromStorage(key).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error.message);
      })
    })
  }

  /**
   * 初始化数据库
   */
  initDB(){
    return this.dbService.initDB();
  }

  /**
     * 在用户表中插入数据
     * @param user 
     */
  updateSynchroTimeToUserInfo(workerNumber:string,synchroTime:string){
    return this.loginDBProvider.updateSynchroTimeToUserInfo(workerNumber,synchroTime);
  }


  //清楚数据库
  cleanDateBase(workerNumber){
    if(workerNumber){
      //删除该账号下的台账数据
      this.pubDBProvider.deleteAllFromFixed(workerNumber)
      //删除组织机构
      this.pubDBProvider.deleteAllOrgInfo()
      //删除日志
      this.pubDBProvider.deleteAllFromChangeRecord(workerNumber)
      //删除字典表
      this.pubDBProvider.deleteAllFromDictDetail()
      this.RemoveFromStorage(PubConstant.LOCAL_STORAGE_KEY_LAST_REQUEST_TIME)
      this.cvtDbProvider.queryFromCvtNonNoticeByWorkerNumber(workerNumber).then((list)=>{
        if(list.length>0){
          for(let i=0;i<list.length;i++){
            this.cvtDbProvider.deleteFromCvtNonNoticeSubByNoticeId(list[i].noticeId)
            this.cvtDbProvider.deleteFromCvtNonReceiveByNoticeId(list[i].noticeId)
          }
        }
      })
      this.cvtDbProvider.deleteFromCvtNonNoticeByWorkerNumber(workerNumber);
    }

  }
}
 