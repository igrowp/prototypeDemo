import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AssetHandleDBProvider } from '../storage/asset.handle.db.provider';
import { Idle, Scrap } from '../entity/pub.entity';
import { AssetHandleWebProvider } from '../web/asset.handle.web.provider';
/*
  资产处置类
*/
@Injectable()
export class AssetHandleService {

  constructor(private assetHandleDbProvider:AssetHandleDBProvider,
      private assetHandelWebProvider:AssetHandleWebProvider) {
  }
  ////web端

  /**
   * 从服务器中获取闲置资产
   * @param assetId 
   */
  getIdleDeviceFromServe(assetId: string) {
    return new Promise<Idle>((resolve, reject) => {
      this.assetHandelWebProvider.getIdleDeviceFromServe(assetId)
        .subscribe((idle) => {
          if (idle.idleId) {
            this.addOrUpdateToIdle(idle);
            resolve(idle);
          }else{
            //服务器没有数据，本地进行查找
            this.assetHandleDbProvider.selectIdleByAssetId(assetId).then((data) => {
              resolve(data);
            }, (error) => reject(error))
          }
        }, (error) => {
          //失败了，可能是服务器出错了，也可能是断网
          //在本地查找
          this.assetHandleDbProvider.selectIdleByAssetId(assetId).then((data) => {
            resolve(data);
          }, (error) => reject(error))
        })
    })
  }


  /**A320——WIFI
   * 同步闲置资产到服务器端，离线状态则存储到本地
   * @param idle 
   */
  synchroIdleDeviceToServe(idle:Idle){
    return new Promise<string>((resolve,reject)=>{
      this.assetHandelWebProvider.synchroIdleDeviceToServe(idle).subscribe((data)=>{
        if(data.result==true){
            //没有数据，上传成功
            //删除本地的资产闲置记录
            this.assetHandleDbProvider.deleteIdleById(idle.idleId);
            resolve("提交成功");
        }else{
          //请求失败，出现异常
          reject("资产闲置上传失败");
        }
      },(error)=>{
        //网络不通的情况，先保存到本地
        this.assetHandleDbProvider.selectIdleByAssetId(idle.assetId).then((data)=>{
          if(data==null){
            this.assetHandleDbProvider.insertToIdle(idle);
          }else{
            this.assetHandleDbProvider.updateToIdle(idle);
          }
        })
        resolve("提交成功");
      })
    })
  }


  /**
   * 同步闲置列表
   * @param workerNumber 
   */
  synchroIdleListToServe(workerNumber: string) {
    return new Promise((resolve, reject) => {
      this.assetHandleDbProvider.selectIdleListByWorkerNumber(workerNumber).then((idleList) => {
        if (idleList == null || idleList.length == 0) {
          resolve();
        } else {
          let lastIdleId = idleList[idleList.length - 1].idleId;
          for (let i = 0; i < idleList.length; i++) {
            let idle = idleList[i];
            this.assetHandelWebProvider.synchroIdleDeviceToServe(idle).subscribe((result) => {
              if (result.result == true) {
                //没有数据，上传成功
                //删除本地的资产闲置记录
                this.assetHandleDbProvider.deleteIdleById(idle.idleId);
                if (idle.idleId == lastIdleId) {
                  resolve("提交成功");
                }
              } else {
                //请求失败，出现异常
                reject("资产闲置上传失败");
              }
            }, (error) => {
              reject("网络连接超时");
            })
          }
        }
      },error=>reject("获取闲置资产信息失败"))
    })
  }

  /**
   * 从服务器获取闲置申请单
   * @param applyId 
   */
  getIdleBillFromServe(applyId:String){
    return this.assetHandelWebProvider.getIdleBillFromServe(applyId);
  }

  /**
   * 从服务器获取闲置申请单——设备类
   * @param applyId 
   */
  getIdleDeviceAssetListFromServe(applyId:String){
    return this.assetHandelWebProvider.getIdleDeviceAssetListFromServe(applyId);
  }


  /**
   * 从服务器获取闲置申请单——非设备类
   * @param applyId 
   */
  getIdleUnDeviceAssetListFromServe(applyId:String){
    return this.assetHandelWebProvider.getIdleUnDeviceAssetListFromServe(applyId);
  }



  ////报废


  //从服务器中获取报废资产
  getScrapFixFromServe(assetId: string) {
    return new Promise<Scrap>((resolve, reject) => {
      this.assetHandelWebProvider.getScrapFixFromServe(assetId)
        .subscribe((scrap) => {
          if (scrap.scrapId) {
            this.addOrUpdateToScrap(scrap);
            resolve(scrap);
          }else{
            //服务器没有数据，本地进行查找
            this.assetHandleDbProvider.selectScrapByAssetId(assetId).then((data) => {
              resolve(data);
            }, (error) => reject(error))
          }
        }, (error) => {
          //失败了，可能是服务器出错了，也可能是断网
          //在本地查找
          this.assetHandleDbProvider.selectScrapByAssetId(assetId).then((data) => {
            resolve(data);
          }, (error) => reject(error))
        })
    })
  }


  /**
   * 同步报废资产到服务器端，离线状态则存储到本地
   * @param scrap 
   */
  synchroScrapFixToServe(scrap:Scrap){
    return new Promise<string>((resolve,reject)=>{
      this.assetHandelWebProvider.synchroScrapFixToServe(scrap).subscribe((data)=>{
        if(data.result==true){
            //没有数据，上传成功
            //删除本地的资产闲置记录
            this.assetHandleDbProvider.deleteScrapById(scrap.scrapId);
            resolve("提交成功");
        }else{
          //请求失败，出现异常
          reject("资产报废上传失败");
        }
      },(error)=>{
        //网络不通的情况，先保存到本地
        this.assetHandleDbProvider.selectScrapByAssetId(scrap.assetId).then((data)=>{
          if(data==null){
            this.assetHandleDbProvider.insertToScrap(scrap);
          }else{
            this.assetHandleDbProvider.updateToScrap(scrap);
          }
        })
        resolve("提交成功");
      })
    })
  }



  /**
   * 同步报废列表
   * @param workerNumber 
   */
  synchroScrapListToServe(workerNumber: string) {
    return new Promise((resolve, reject) => {
      this.assetHandleDbProvider.selectScrapListByWorkerNumber(workerNumber).then((scrapList) => {
        if (scrapList == null || scrapList.length == 0) {
          resolve();
        } else {
          let lastScrapId = scrapList[scrapList.length - 1].scrapId;
          for (let i = 0; i < scrapList.length; i++) {
            let scrap = scrapList[i];
            this.assetHandelWebProvider.synchroScrapFixToServe(scrap).subscribe((result) => {
              if (result.result == true) {
                //没有数据，上传成功
                //删除本地的资产报废记录
                this.assetHandleDbProvider.deleteScrapById(scrap.scrapId);
                if (scrap.scrapId == lastScrapId) {
                  resolve("提交成功");
                }
              } else {
                //请求失败，出现异常
                reject("资产报废上传失败");
              }
            }, (error) => {
              reject("网络连接超时");
            })
          }
        }
      },error=>reject("获取报废资产数据失败"))
    })
  }

  /**
   * 从服务器获取报废申请单
   * @param applyId 
   */
  getScrapBillFromServe(applyId:String){
    return this.assetHandelWebProvider.getScrapBillFromServe(applyId);
  }

  /**
   * 从服务器获取报废资产列表
   * @param applyId 
   */
  getScrapFixAssetListFromServe(applyId:String){
    return this.assetHandelWebProvider.getScrapFixAssetListFromServe(applyId);
  }

  /**
   * 从服务器获取报废资产列表
   * @param applyId 
   */
  getScrapWellAssetListFromServe(applyId:String){
    return this.assetHandelWebProvider.getScrapWellAssetListFromServe(applyId);
  }




//////////本地数据库

  //闲置
  addOrUpdateToIdle(idle:Idle){
    return new Promise((resolve,reject)=>{
      this.assetHandleDbProvider.selectIdleByAssetId(idle.assetId).then((data)=>{
        if(data==null){
          this.assetHandleDbProvider.insertToIdle(idle).then(()=>{
            resolve();
          },error=>reject(error));
        }else{
          this.assetHandleDbProvider.updateToIdle(idle).then(()=>{
            resolve();
          },error=>reject(error));
        }
      })

    })
  }
  addToIdle(idle:Idle){
    return this.assetHandleDbProvider.insertToIdle(idle);
  }
  deleteIdleById(idleId:string){
    return this.assetHandleDbProvider.deleteIdleById(idleId);
  }
  updateToIdle(idle:Idle){
    return this.assetHandleDbProvider.updateToIdle(idle);
  }
  getIdleByAssetId(assetId:string){
    return this.assetHandleDbProvider.selectIdleByAssetId(assetId);
  }
  getIdleListByWorkerNumber(workerNumber:string){
    return this.assetHandleDbProvider.selectIdleListByWorkerNumber(workerNumber);
  }


  



  ///报废

  addOrUpdateToScrap(scrap:Scrap){
    return new Promise((resolve,reject)=>{
      this.assetHandleDbProvider.selectScrapByAssetId(scrap.assetId).then((data)=>{
        if(data==null){
          this.assetHandleDbProvider.insertToScrap(scrap).then(()=>{
            resolve();
          },error=>reject(error));
        }else{
          this.assetHandleDbProvider.updateToScrap(scrap).then(()=>{
            resolve();
          },error=>reject(error));
        }
      })

    })
  }
  addToScrap(scrap:Scrap){
    return this.assetHandleDbProvider.insertToScrap(scrap);
  }
  deleteScrapById(scrapId:string){
    return this.assetHandleDbProvider.deleteScrapById(scrapId);
  }
  updateToScrap(scrap:Scrap){
    return this.assetHandleDbProvider.updateToScrap(scrap);
  }
  getScrapByAssetId(assetId:string){
    return this.assetHandleDbProvider.selectScrapByAssetId(assetId);
  }
  getScrapListByWorkerNumber(workerNumber:string){
    return this.assetHandleDbProvider.selectScrapListByWorkerNumber(workerNumber);
  }



  //调拨
  /**
   * 从服务器获取调拨申请单
   * @param allocateId 
   */
  getAlloBillFromServe(allocateId:String){
    return this.assetHandelWebProvider.getAlloBillFromServe(allocateId);
  }

  /**
   * 从服务器获取调拨资产列表
   * @param allocateId 
   */
  getAlloAssetListFromServe(allocateId:String){
    return this.assetHandelWebProvider.getAlloAssetListFromServe(allocateId);
  }

  //闲置处置
  /**
   * 从服务器获取闲置处置申请单
   * @param applyId 
   */
  getHandleIdleBillFromServe(applyId:String){
    return this.assetHandelWebProvider.getHandleIdleBillFromServe(applyId);
  }

  /**
   * 从服务器获取闲置处置资产列表
   * @param applyId 
   */
  getHandleIdleAssetListFromServe(applyId:String){
    return this.assetHandelWebProvider.getHandleIdleAssetListFromServe(applyId);
  }

  //报废处置
  /**
   * 从服务器获取报废处置申请单
   * @param applyId 
   */
  getHandleScrapBillFromServe(applyId:String){
    return this.assetHandelWebProvider.getHandleScrapBillFromServe(applyId);
  }

  /**
   * 从服务器获取报废处置资产列表
   * @param applyId 
   */
  getHandleScrapAssetListFromServe(applyId:String){
    return this.assetHandelWebProvider.getHandleScrapAssetListFromServe(applyId);
  }

  

}
