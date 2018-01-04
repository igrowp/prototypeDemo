import { WebService } from './web.service';
import { User, UserAccount } from './../entity/entity.provider';
import { LocalStorageService} from './localStorage.service';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AlertController, LoadingController } from 'ionic-angular';
/*
提供关于登陆的服务
*/
@Injectable()
export class LoginService {
  constructor(
    public alertCtrl:AlertController,
    
    public webService:WebService,
    public storageService:LocalStorageService,
    private loadingCtrl:LoadingController,
  ) {
    
  }



  /////////////数据下载同步////////////////////
  /**
   * 从服务器获取组织机构信息，并保存
   */
  getAndSaveOrgInfoFromServe(){
    return new Promise((resolve,reject)=>{
      this.webService.getOrgInfoListFromServe().then((data)=>{
        for(var i=0;i<data.length;i++){
          let orgInfo=data[i]
          this.storageService.queryFromOrgInfoByOrgId(orgInfo.orgId).then((data1)=>{
            if(data1==null){
              //说明本地没有该组织机构信息，插入
              this.storageService.insertToOrgInfo(orgInfo).then(()=>{
                //插入成功
                if(orgInfo.orgId==data[data.length-1].orgId){
                  resolve();
                }
              },(error)=>{
                reject(error)
              })
            }else{
              //本地有该组织机构，进行更新
              this.storageService.updateToOrgInfo(orgInfo).then(()=>{
                //更新成功
                if(orgInfo.orgId==data[data.length-1].orgId){
                  resolve();
                }
              },(error)=>{
                reject(error)
              })
            }
          })
        }
      },error=>{
        reject(error);
      });
    });
  }
  /**
   * 如果本地组织机构表中没有数据从服务器中下载数据
   */
  downloadOrgInfoIfEmpty(){
    return new Promise((resolve,reject)=>{
      this.storageService.queryListFromOrgInfo(1,1).then((data)=>{
        if(data==null){
          //说明本地没有员工信息，进行下载
          this.getAndSaveOrgInfoFromServe().then(()=>{
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
   * 如果本地员工精简表中没有数据从服务器中下载数据
   */
  downloadUserSimpleIfEmpty(){
    return new Promise((resolve,reject)=>{
      this.storageService.queryListFromUserSimple(1,1).then((data)=>{
        if(data==null){
          //说明本地没有员工信息，进行下载
          this.getAndSaveUserSimpleFromServe().then(()=>{
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
  getAndSaveUserSimpleFromServe(){
    return new Promise((resolve,reject)=>{
      this.webService.getUserSimpleListFromServe().then((data)=>{
        for(var i=0;i<data.length;i++){
          let userSimple=data[i];
          this.storageService.queryFromUserSimpleByWorkerNumber(userSimple.workerNumber).then((userName)=>{
            if(userName==""){
              this.storageService.insertToUserSimple(userSimple).then(()=>{
                //插入成功
                if(userSimple.workerNumber==data[data.length-1].workerNumber){
                  //说明执行成功了
                  resolve();
                }
              },(error)=>{
                reject("插入简单员工表失败："+userSimple.workerNumber+error)
              })
            }else{
              //已经有该成员，退出
              resolve();
            }
          })
        }
      },error=>{
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
          this.storageService.queryFromAccountByUserId(userAccount.userId).then((data)=>{
            if(data==null){
              //说明没有该人的账号信息，插入
              this.storageService.insertToAccount(userAccount).then((data)=>{
                // console.log("插入成功！");
              },(error)=>{
                alert(error.message);
              })
            }else{
              //有该人的账号信息，进行更新
              this.storageService.updateToAccount(userAccount).then((data)=>{
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
          this.storageService.queryFromUserInfoByUserId(user.userId).then((data)=>{
            if(data==null){
              //说明没有该人的账号信息，插入
              this.storageService.insertToUserInfo(user).then((data)=>{
                // console.log("插入成功！");
              },(error)=>{
                alert(error.message);
              })
            }else{
              //有该人的账号信息，进行更新
              this.storageService.updateToUserInfo(user).then((data)=>{
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
      this.storageService.queryFromUserInfoByUserId(userId).then((data)=>{
        if(data==null){
          //说明本地没有该员工的信息，从服务器中获取
          this.webService.getUserMessage(userId).then((user)=>{
            if(user==null){
              //说明没有该员工的信息
              reject("服务器中没有该员工的信息");
            }else{
              this.storageService.insertToUserInfo(user).then((data)=>{
                //插入成功
                resolve(user);
              },(error)=>{
                reject("插入员工信息到数据库失败"+error.message);
              })
            }
          },(error)=>{
            reject("获取员工信息失败，请在有内网的环境下登陆！");
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
      this.storageService.queryFromAccountByNameAndPWD(userName,password).then((data)=>{
        if(data==null){
          //说明本地没有该成员的账户信息,从服务器获取
          let loading=this.loadingCtrl.create({
            content:'正在从服务器获取数据！',
            duration:20000
          });
          loading.present();
          this.webService.getUserAccountByNameAndPWD(userName,password).then((userAccount)=>{
            if(userAccount==null){
              loading.dismiss();
              reject("账户或密码错误，请确认后重试！");
            }else{
              this.storageService.queryFromAccountByUserId(userAccount.userId).then((userData)=>{
                if(userData==null){
                  //说明本地没有存储该成员的账户信息，存储到本地
                  this.storageService.insertToAccount(userAccount).then(()=>{
                    // alert("插入账户信息");
                      loading.dismiss();
                      resolve(userAccount);
                    },(error)=>{
                      reject("插入账户到数据库错误："+error.message);
                  });
                }else{
                  //说明本地已经存储该成员的账户信息，进行更新
                  this.storageService.updateToAccount(userAccount).then(()=>{
                    // alert("插入账户信息");
                      loading.dismiss();
                      resolve(userAccount);
                    },(error)=>{
                      reject("更新账户到数据库错误："+error.message);
                  });
                }
              },(error)=>{
                reject("没有该成员的用户信息，请再次确认！");
              })
              
            }
          },(error)=>{
            loading.dismiss();
            reject("获取登陆信息失败，请确认账户密码正确，并在有内网的环境下重试！");
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
      this.storageService.queryUserInfoByNameAndPWD(userName,password).then((data)=>{
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
    return new Promise<User>((resolve,reject)=>{
      this.webService.getUserMessage(userId).then((user)=>{
        resolve(user);
      },(error)=>{
        reject(error.message);
      })
    });
  }

  /**
   * 向本地存储写入键值对
   * @param key 
   * @param value 
   */
  setInStorage(key:string,value:string){
      return new Promise((resolve,reject)=>{
        if(key==""||key==null){
          reject("键为空！");
        }
        this.storageService.getFromStorage(key).then((data)=>{
          if(data==null||data==""){
            //说明本地没有该记录
            this.storageService.setInStorage(key,value).then((data)=>{
              resolve(data);
            },(error)=>{
              reject(error);
            })
          }else{
            //说明本地已经有该记录，删除后重新添加
            this.storageService.removeFromStorage(key).then(()=>{
              this.storageService.setInStorage(key,value).then((data)=>{
                resolve(data);
              },(error)=>{
                reject(error);
              })
            },(error)=>{
              reject(error);
            })
          }
        },(error)=>{
          reject(error);
        })
      })
  }
    
  /**
   * 从本地存储中读取
   * @param key 
   */
  getFromStorage(key:string){
      return new Promise<string>((resolve,reject)=>{
        if(key==""||key==null){
          reject("键为空！");
          return;
        }
          this.storageService.getFromStorage(key).then((data)=>{
              resolve(data);
          },(error)=>{
              reject(error);
          })
      })
  }

  /**
   * 删除本地存储的key键值对
   * @param key 
   */
  RemoveFromStorage(key:string){
      return new Promise((resolve,reject)=>{
        if(key==""||key==null){
          reject("键为空！");
          return;
        }
          this.storageService.removeFromStorage(key).then((data)=>{
              resolve(data);
          },(error)=>{
              reject(error.message);
          })
      })
  }

  /**
   * 初始化数据库
   */
  initDB(){
    return new Promise((resolve,reject)=>{
      this.storageService._getLocal().then(()=>{
        resolve();
      },(error)=>{
        reject();
      })
    })
  }





}
 