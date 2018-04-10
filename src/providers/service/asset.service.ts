import { AssetWebProvider } from './../web/asset.web.provider';
import { ChangeRecord, FixedAsset, InvAsset } from './../entity/entity.provider';
import { Injectable } from '@angular/core';
import { PubDBProvider } from '../storage/pub.db.provider';
import { InvDBProvider } from '../storage/inv.db.provider';
import { InvWebProvider } from '../web/inv.web.provider';

/*
  Generated class for the AboutServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AssetService {

  constructor(
    public pubDBProvider: PubDBProvider,
    public invDbProvider: InvDBProvider,
    public assetWebProvider: AssetWebProvider,
    private invWebProvider: InvWebProvider, ) {
  }

  /**
   * 同步盘点数据
   */
  public synchroInvData(workerNumber: string) {
    return new Promise((resolve, reject) => {
      if (workerNumber == null || workerNumber == "") {
        resolve();
      } else {
        this.queryAssetsFromFixed(workerNumber, 1).then().then((fixedAssets) => {
          this.queryAssetsFromInv(workerNumber, 2).then().then((invAssets) => {
            this.queryListFromChangeRecord(workerNumber).then((changeRecords) => {
              if (fixedAssets.length == 0 && invAssets.length == 0 && changeRecords.length == 0) {
                resolve();
              } else {
                this._syncDBToServer(fixedAssets, invAssets, changeRecords).then((data) => {
                  resolve();
                }, (error) => { reject("同步盘点数据失败<br>网络连接超时"); })
              }
            }, err => { reject("获取日志表失败" ); })
          }, err => { reject("获取盘点记录失败"); })
        }, err => { reject("获取台账失败"); })
      }
    })
  }


  /**
   * 从服务器中下载数据
   * 只会接受一次数据，如果本地已经存储了数据将不会从服务器中获取
   */
  downloadAndSaveData(workerNumber: string) {
    var lastRequestTime = "";//先暂定每次下载所有的数据
    return new Promise((resolve, reject) => {
      this.assetWebProvider.getListFormFixedByWorkerNumber(workerNumber, lastRequestTime).then((data) => {
        if (data.length == 0) {
          //没有数据
          resolve();
          return;
        } else {
          for (var i = 0; i < data.length; i++) {
            let fixAsset = data[i];
            if (fixAsset.increaseDate != null) {
              fixAsset.increaseDate = new Date(fixAsset.increaseDate);
            }
            if (fixAsset.productionTime != null) {
              fixAsset.productionTime = new Date(fixAsset.productionTime);
            }
            if (fixAsset.manufactureDate != null) {
              fixAsset.manufactureDate = new Date(fixAsset.manufactureDate);
            }
            this.pubDBProvider.queryFromFixedById(fixAsset.assetId).then((asset) => {
              if (asset == null) {
                this.pubDBProvider.insertToFixed(fixAsset).then(() => {
                  if (fixAsset.assetId == data[data.length - 1].assetId) {
                    resolve("同步成功")
                  }
                }, error => { reject(error) });
              } else {
                fixAsset.isChecked = asset.isChecked;
                fixAsset.isSynchro = asset.isSynchro;
                this.pubDBProvider.updateToFixed(fixAsset).then(() => {
                  if (fixAsset.assetId == data[data.length - 1].assetId) {
                    resolve("同步成功")
                  }
                }, error => { reject(error) });
              }
            })
          }
        }
      }, error => {
        reject("连接服务器失败，请确认当前为内网环境");
      });
    });
  }

  syncFixedToServer(fixedAssets: Array<FixedAsset>) {
    return this.assetWebProvider.syncFixedToServer(fixedAssets);
  }


  /**
   * 同步本地数据到服务器
   * @param fixedAssets 
   * @param invAssets 
   */
  private _syncDBToServer(fixedAssets: Array<FixedAsset>, invAssets: Array<InvAsset>, changeRecords: Array<ChangeRecord>) {
    return new Promise((resolve, reject) => {
      // this.changeCusAndWorkerInFixed(fixedAssets).then((fixeds)=>{
      this.assetWebProvider.syncFixedToServer(fixedAssets).then((data) => {
        this.invWebProvider.syncInvToServer(invAssets).then((data) => {
          //同步资产盘点记录表成功
          this.assetWebProvider.syncChangeRecordToServer(changeRecords).then(() => {
            //同步日志表成功
            resolve("同步成功");
            //修改台账同步状态
            this._changeAssetsState(fixedAssets, invAssets);
          }, (error) => {
            reject("同步日志表失败<br>网络连接超时");
          })
        }, (error) => {
          reject("同步盘点记录表失败<br>网络连接超时");
        })
      }, (error) => {
        reject("同步资产台账表失败<br>网络连接超时");
      });
      // },(error)=>{
      //   reject("修改保管人失败："+error);
      // })
    })

  }

  private _changeAssetsState(fixedAssets: Array<FixedAsset>, invAssets: Array<InvAsset>) {
    for (var i = 0; i < fixedAssets.length; i++) {
      let fixedAsset = fixedAssets[i];
      fixedAsset.isSynchro = 0;
      this.pubDBProvider.updateToFixed(fixedAsset);
    }
    for (var j = 0; j < invAssets.length; j++) {
      let invAsset = invAssets[j];
      invAsset.isSignatured = 0;
      this.invDbProvider.updateToInv(invAsset);
    }
  }

  // /**
  //  * 如果保管人发生变化，本地进行修改
  //  * @param fixedAssets 
  //  */
  // changeCusAndWorkerInFixed(fixedAssets:Array<FixedAsset>){

  //   let assets=new Array<FixedAsset>();
  //   return new Promise<Array<FixedAsset>>((resolve,reject)=>{
  //     if(fixedAssets.length==0){
  //       resolve(fixedAssets);
  //     }
  //     for(var i=0;i<fixedAssets.length;i++){
  //       var fixedAsset=fixedAssets[i];
  //       if(fixedAsset.changeCustodian!=null&&fixedAsset.changeCustodian!=""&&fixedAsset.changeWorkerNumber!=null&&fixedAsset.changeWorkerNumber!=""){
  //         //说明更改了保管人，本地进行修改
  //         fixedAsset.custodian=fixedAsset.changeCustodian;
  //         fixedAsset.workerNumber=fixedAsset.changeWorkerNumber;
  //         fixedAsset.changeCustodian="";
  //         fixedAsset.changeWorkerNumber="";
  //         this.pubDBProvider.updateToFixed(fixedAsset).then(()=>{
  //           fixedAsset.isChecked=0;
  //           assets.push(fixedAsset);
  //           if(fixedAsset.assetId==fixedAssets[fixedAssets.length-1].assetId){
  //             resolve(assets);
  //           }
  //         },(error)=>{
  //           reject(error);
  //         })
  //       }else{
  //         fixedAsset.isChecked=0;
  //         assets.push(fixedAsset);
  //         if(fixedAsset.assetId==fixedAssets[fixedAssets.length-1].assetId){
  //           resolve(assets);
  //         }
  //       }
  //     }
  //   })
  // }

  // /**
  //  * 根据员工编号从服务器中获取用户的详细信息
  //  * @param userId 
  //  */
  // getUserMessageFromServerByWorkerNumber(workerNumber:string){
  //   return new Promise<User>((resolve,reject)=>{
  //       this.webService.getUserMessageByWorkerNumber(workerNumber).then((user)=>{
  //       if(user==null){
  //         resolve(null)
  //       }else{
  //         resolve(user);
  //       }
  //   },(error)=>{
  //     reject("网络连接超时，请确认当前为内网环境");
  //   })
  //   })
  // }



  /////////////本地数据库查询///////////////////


  /**
   * 从本地固定资产台账中获得数据
   */
  queryAssetsFromFixed(workerNumber: string, isSynchro?: number) {
    return this.pubDBProvider.queryAssetsFromFixed(workerNumber, isSynchro);
  }

  /**
   * 根据每页显示条数和页码得到数据
   * @param pageSize   每页的数据大小
   * @param pageIndex 页码，从1开始
   * @param workerNumber 员工编号
   */
  queryAssetsFormFixedByPage(pageSize: number, pageIndex: number, workerNumber: string) {
    return this.pubDBProvider.queryAssetsFromFixedByPage(pageSize, pageIndex, workerNumber);

  }

  /**
   * 从本地固定资产台账中获得数据
   */
  queryAssetsFromInv(preWorkerNumber: string, isSignatured: number) {
    return this.invDbProvider.queryAssetsFromInv(preWorkerNumber, isSignatured);
  }

  /**
   * 根据资产ID和二维码在固定资产台账中查询资产信息
   * @param assetId 
   * @param code 二维码编号 
   */
  queryAssetFromFixedByIdAndCode(assetId, code) {
    return this.pubDBProvider.queryFromFixedByIdAndCode(assetId, code);
  }


  /**
   * 根据资产id从固定资产台账中获取资产信息
   * @param assetId 
   */
  queryAssetFromFixedById(assetId) {
    return this.pubDBProvider.queryFromFixedById(assetId);
  }

  /**
   * 根据RFID从固定资产台账中获取资产信息
   * @param Code 
   */
  queryAssetFromFixedByRFID(rfid) {
    return this.pubDBProvider.queryFromFixedByRFID(rfid);
  }

  queryListFromDictDetailByCategoryCode(categoryCode) {
    return this.pubDBProvider.queryListFromDictDetailByCategoryCode(categoryCode);
  }

  /**
   * 根据二维码编号从固定资产台账中获取资产信息
   * @param Code 
   */
  queryAssetFromFixedByCode(Code) {
    return this.pubDBProvider.queryFromFixedByCode(Code);
  }



  /**
   * 根据资产id从资产盘点记录中获取资产信息
   * @param assetId 
   * @param noticeId
   */
  queryAssetFromInvByIdAndNoticeId(assetId, noticeId) {
    return new Promise<InvAsset>((resolve, reject) => {
      if (assetId == null || noticeId == null) {
        reject("错误：资产ID为空或通知ID为空");
        return;
      }
      this.invDbProvider.queryFromInvByIdAndNotice(assetId, noticeId).then((data) => {
        resolve(data);
      }, (error) => {
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
  insertToFixed(asset: FixedAsset) {
    return this.pubDBProvider.insertToFixed(asset);
  }

  /**
   * 向资产盘点记录表中插入数据
   * @param asset 
   */
  insertToInv(asset: InvAsset) {
    return this.invDbProvider.insertToInv(asset);
  }

  ///////////////本地数据库插入END//////////////////

  ///////////////本地数据库更新操作//////////////////
  /**
   * 向资产盘点记录表中更新数据
   * @param asset 
   */
  updateToInv(asset: InvAsset) {
    return this.invDbProvider.updateToInv(asset);
  }

  /**
   * 向固定资产台账表中更新数据
   * @param asset 
   */
  updateToFixed(asset: FixedAsset) {
    return this.pubDBProvider.updateToFixed(asset);
  }

  ///////////////本地数据库更新END//////////////////

  ////////////////////////日志更改//////////////////////////////
  /**
   * 在日志表中插入
   */
  insertToChangeRecord(changeRecord: ChangeRecord) {
    return this.pubDBProvider.insertToChangeRecord(changeRecord);
  }

  /**
   * 在日志表中插入
   */
  updateToChangeRecord(changeRecord: ChangeRecord) {
    return this.pubDBProvider.updateToChangeRecord(changeRecord);
  }
  /**
  * 获取所有的日志文件
  */
  queryListFromChangeRecord(workerNumber: string) {
    return this.pubDBProvider.queryListFromChangeRecord(workerNumber);
  }
  /**
  * 根据资产ID获取日志
  */
  queryFromChangeRecordByAssetId(assetId: string) {
    return this.pubDBProvider.queryFromChangeRecordByAssetId(assetId);
  }

  ////////////////////////日志更改END//////////////////////////////
}
