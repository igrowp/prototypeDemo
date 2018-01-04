import { ChangeRecord, FixedAsset, InvAsset, User } from './../entity/entity.provider';
import { Http } from '@angular/http';
import { WebService } from './web.service';
import { LocalStorageService } from './localStorage.service';
import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the AboutServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AssetService {
  
  Local_URL:String="";    //服务器地址加项目名，例如http://10.88.133.45:8080/ionicApp

  constructor(
            public http:Http,
            public alertCtrl:AlertController,
            public storageService:LocalStorageService,
            public webService:WebService) {
  }

  testhttp(){
    return new Promise((resolve,reject)=>{
      this.webService.testhttp().then((data)=>{
        resolve(data);

      })
    })
  }


  /**
   * 从服务器中下载数据
   * 只会接受一次数据，如果本地已经存储了数据将不会从服务器中获取
   */
  downloadAndSaveData(workerNumber:string){
    return new Promise((resolve,reject)=>{
      this.webService.getListFormFixedByWorkerNumber(workerNumber).then((data)=>{
        if(data.length==0){
          //没有数据
          resolve();
        }
        for(var i=0;i<data.length;i++){
          let fixAsset=data[i];
          if(fixAsset.increaseDate!=null){
            fixAsset.increaseDate=new Date(fixAsset.increaseDate);
          }
          if(fixAsset.productionTime!=null){
            fixAsset.productionTime=new Date(fixAsset.productionTime);
          }
          if(fixAsset.manufactureDate!=null){
            fixAsset.manufactureDate=new Date(fixAsset.manufactureDate);
          }
          this.storageService.insertToFixed(fixAsset).then(()=>{
            if(fixAsset.assetId==data[data.length-1].assetId){
              resolve("同步成功")
            }
          });
        }
      },error=>{
        reject("连接服务器失败，请确认当前为内网环境！");
      });
    });
  }


  /**
   * 同步本地数据到服务器
   * @param fixedAssets 
   * @param invAssets 
   */
  syncDBToServer(fixedAssets:Array<FixedAsset>,invAssets:Array<InvAsset>,changeRecords:Array<ChangeRecord>){
    return new Promise((resolve,reject)=>{
      this.changeCusAndWorkerInFixed(fixedAssets).then((fixeds)=>{
      this.webService.syncFixedToServer(fixeds).then((data)=>{
        this.webService.syncInvToServer(invAssets).then((data)=>{
          //同步资产盘点记录表成功
          this.webService.syncChangeRecordToServer(changeRecords).then(()=>{
            //同步日志表成功
            resolve("同步成功！");
          },(error)=>{
            reject("同步日志表失败"+error);
          })
        },(error)=>{
          reject("同步盘点记录表失败"+error);
        })
      },(error)=>{
        reject("同步资产台账表失败："+error);
      });
    },(error)=>{
      reject("修改保管人失败："+error);
    })
    })
    
  }

  /**
   * 如果保管人发生变化，本地进行修改
   * @param fixedAssets 
   */
  changeCusAndWorkerInFixed(fixedAssets:Array<FixedAsset>){

    let assets=new Array<FixedAsset>();
    return new Promise<Array<FixedAsset>>((resolve,reject)=>{
      if(fixedAssets.length==0){
        resolve(fixedAssets);
      }
      for(var i=0;i<fixedAssets.length;i++){
        var fixedAsset=fixedAssets[i];
        if(fixedAsset.changeCustodian!=""&&fixedAsset.changeWorkerNumber!=""){
          //说明更改了保管人，本地进行修改
          fixedAsset.custodian=fixedAsset.changeCustodian;
          fixedAsset.workerNumber=fixedAsset.changeWorkerNumber;
          fixedAsset.changeCustodian="";
          fixedAsset.changeWorkerNumber="";
          this.storageService.updateToFixed(fixedAsset).then(()=>{
            fixedAsset.isChecked="0";
            assets.push(fixedAsset);
            if(fixedAsset.assetId==fixedAssets[fixedAssets.length-1].assetId){
              resolve(assets);
            }
          },(error)=>{
            reject(error);
          })
        }else{
          fixedAsset.isChecked="0";
          assets.push(fixedAsset);
          if(fixedAsset.assetId==fixedAssets[fixedAssets.length-1].assetId){
            resolve(assets);
          }
        }
      }
    })
  }

  /**
   * 根据员工编号从服务器中获取用户的详细信息
   * @param userId 
   */
  getUserMessageFromServerByWorkerNumber(workerNumber:string){
    return new Promise<User>((resolve,reject)=>{
        this.webService.getUserMessageByWorkerNumber(workerNumber).then((user)=>{
        if(user==null){
          resolve(null)
        }else{
          resolve(user);
        }
    },(error)=>{
      reject("网络连接超时，请确认当前为内网环境！");
    })
    })
  }



/////////////本地数据库查询///////////////////

  /**
   * 从本地固定资产台账中获得数据
   */
  queryAssetsFormFixed(workerNumber:string,isChecked:string){
    return new Promise<Array<FixedAsset>>((resolve,reject)=>{
      this.storageService.queryAssetsFormFixed(workerNumber,isChecked).then((data)=>{
        resolve(data);
      },(err)=>{
        reject(err);
      });
    });
  }

  /**
   * 根据每页显示条数和页码得到数据
   * @param pageSize   每页的数据大小
   * @param pageIndex 页码，从1开始
   * @param workerNumber 员工编号
   */
  queryAssetsFormFixedByPage(pageSize:number,pageIndex:number,workerNumber:string){
    return new Promise<Array<FixedAsset>>((resolve,reject)=>{
      this.storageService.queryAssetsFormFixedByPage(pageSize,pageIndex,workerNumber).then((data)=>{
        resolve(data);
      },(err)=>{
        reject(err);
      });
    });

  }

  /**
   * 从本地固定资产台账中获得数据
   */
  queryAssetsFormInv(preWorkerNumber:string,isSignatured:string){
    return new Promise<Array<InvAsset>>((resolve,reject)=>{
      this.storageService.queryAssetsFromInv(preWorkerNumber,isSignatured).then((data)=>{
        resolve(data);
      },(err)=>{
        reject(err);
      });
    });
  }

  /**
   * 根据资产ID和二维码在固定资产台账中查询资产信息
   * @param assetId 
   * @param code 二维码编号 
   */
  queryAssetFromFixedByIdAndCode(assetId,code){
    return new Promise<FixedAsset>((resolve,reject)=>{
      this.storageService.queryFromFixedByIdAndCode(assetId,code).then((data)=>{
        if(data==null){

          this.alertCtrl.create({
              title:"提醒",
              subTitle:"设备和二维码不一致，请确认后重新尝试！",
              buttons:["确定"]
            }).present();
          return null;
        }
        resolve(data);
      },(error)=>{
        this.alertCtrl.create({
              title:"提醒",
              subTitle:"查询数据失败:"+error,
              buttons:["确定"]
            }).present();
        reject(error);
      })
    })
  }
  

  /**
   * 根据资产id从固定资产台账中获取资产信息
   * @param assetId 
   */
  queryAssetFromFixedById(assetId){
    return new Promise<FixedAsset>((resolve,reject)=>{
      this.storageService.queryFromFixedById(assetId).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }

  /**
   * 根据RFID从固定资产台账中获取资产信息
   * @param Code 
   */
  queryAssetFromFixedByRFID(rfid){
    return new Promise<FixedAsset>((resolve,reject)=>{
      this.storageService.queryFromFixedByRFID(rfid).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }

  /**
   * 根据二维码编号从固定资产台账中获取资产信息
   * @param Code 
   */
  queryAssetFromFixedByCode(Code){
    return new Promise<FixedAsset>((resolve,reject)=>{
      this.storageService.queryFromFixedByCode(Code).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }

  

  /**
   * 根据资产id从资产盘点记录中获取资产信息
   * @param assetId 
   * @param noticeId
   */
  queryAssetFromInvByIdAndNoticeId(assetId,noticeId){
    return new Promise<InvAsset>((resolve,reject)=>{
      if(assetId==null||noticeId==null){
        reject("错误：资产ID为空或通知ID为空");
        return;
      }
      this.storageService.queryFromInvByIdAndNotice(assetId,noticeId).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }
///////////////本地数据库查询结束/////////////

///////////////本地数据库插入//////////////////
  /**
   * 向资产盘点记录表中插入数据
   * @param asset 
   */
  insertToFixed(asset:FixedAsset){
    return new Promise((resolve,reject)=>{
      this.storageService.insertToFixed(asset).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }

  /**
   * 向资产盘点记录表中插入数据
   * @param asset 
   */
  insertToInv(asset:InvAsset){
    return new Promise((resolve,reject)=>{
      this.storageService.insertToInv(asset).then((data)=>{
        resolve(data);
      },(error)=>{
        this.alertCtrl.create({
              title:"提醒",
              subTitle:"插入数据失败:"+error,
              buttons:["确定"]
            }).present();
        reject(error);
      })
    })
  }

///////////////本地数据库插入END//////////////////
  
///////////////本地数据库更新操作//////////////////
  /**
   * 向资产盘点记录表中更新数据
   * @param asset 
   */
  updateToInv(asset:InvAsset){
    return new Promise((resolve,reject)=>{
      this.storageService.updateToInv(asset).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }

  /**
   * 向固定资产台账表中更新数据
   * @param asset 
   */
  updateToFixed(asset:FixedAsset){
    return new Promise((resolve,reject)=>{
      this.storageService.updateToFixed(asset).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }

///////////////本地数据库更新END//////////////////

  ////////////////////////日志更改//////////////////////////////
  /**
   * 在日志表中插入
   */
  insertToChangeRecord(changeRecord:ChangeRecord){
    return new Promise((resolve,reject)=>{
      this.storageService.insertToChangeRecord(changeRecord).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }

  /**
   * 在日志表中插入
   */
  updateToChangeRecord(changeRecord:ChangeRecord){
    return new Promise((resolve,reject)=>{
      this.storageService.updateToChangeRecord(changeRecord).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }
   /**
   * 获取所有的日志文件
   */
  queryListFormChangeRecord(workerNumber:string){
    return new Promise<Array<ChangeRecord>>((resolve,reject)=>{
      this.storageService.queryListFromChangeRecord(workerNumber).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }
   /**
   * 根据资产ID获取日志
   */
  queryFromChangeRecordByAssetId(assetId:string){
    return new Promise((resolve,reject)=>{
      this.storageService.queryFromChangeRecordByAssetId(assetId).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }

////////////////////////日志更改END//////////////////////////////
  formatDate( date: Date ){
      // 格式化日期，获取今天的日期
      var year: number = date.getFullYear();
      var month: any = ( date.getMonth() + 1 ) < 10 ? '0' + ( date.getMonth() + 1 ) : ( date.getMonth() + 1 );
      var day: any = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      return year + '-' + month + '-' + day;
    };

}
