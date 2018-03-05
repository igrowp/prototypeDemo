import { InvAsset } from './../entity/entity.provider';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { DBService } from './db.service';
import { InvNotice } from '../entity/entity.provider';
import { Idle, Scrap } from '../entity/pub.entity';

/*
  盘点数据库类
*/
@Injectable()
export class AssetHandleDBProvider {
    private dataBase: SQLiteObject = null;
    constructor(private dbService: DBService) {
        this.dbService.getSqliteObject().then((db) => {
            this.dataBase = db;
        })
    }


    /////////闲置表//////////

    /**
      * 根据资产Id获取闲置表信息
      * @param assetId 
      */
    selectIdleByAssetId(assetId: string) {
        return new Promise<Idle>((resolve, reject) => {
            this.dbService.executeSql('select * from idle_apply_device where ASSET_ID=? and RECORD_FLAG=0', [assetId])
                .then((data) => {
                    var notice = this._getIdleFromDBResult(data);
                    resolve(notice);
                }, (error) => {
                    reject("数据库操作：<br>查询闲置失败<br>" + error.message);
                })
        })
    }


    /**
      * 根据员工编号获取所有闲置表信息
      * @param workerNumber 
      */
    selectIdleListByWorkerNumber(workerNumber: string) {
        return new Promise<Array<Idle>>((resolve, reject) => {
            this.dbService.executeSql('select device.* from idle_apply_device device, asset_account_fixed fixed where  device.ASSET_ID=fixed.ASSET_ID and fixed.WORKER_NUMBER=?', [workerNumber])
                .then((data) => {
                    var notice = this._getIdleListFromDBResult(data);
                    resolve(notice);
                }, (error) => {
                    reject("数据库操作：<br>查询闲置失败<br>" + error.message);
                })
        })
    }

    /**
     * 根据通知ID更新闲置表
     * @param changeRecord 
     */
    updateToIdle(idle: Idle) {
        return new Promise((resolve, reject) => {
            if (idle == null) {
                resolve(null);
            } else {
                this.dbService.executeSql(`update idle_apply_device set ASSET_ID=? ,INSTALL_LOCATION=?, OLD_INSTALL_LOCATION=?,STOP_REASON=?,
                ASSET_DESC=?,TEST_RESULT=?,TEST_ORG=?,APPLY_STATE=?,PHOTO_PATH=?,RECORD_FLAG=? where IDLE_ID=?`,
                    [idle.assetId, idle.installLocation, idle.oldInstallLocation, idle.stopReason, idle.assetDesc, idle.testResult, idle.testOrg,idle.applyState,idle.photoPath, idle.recordFlag, idle.idleId])
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((error) => {
                        reject("数据库操作：<br>更新闲置表失败<br>" + error.message);
                    })
            }
        })
    }
    /**
     * 删除闲置表
     */
    deleteIdleById(idleId: string) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('delete from idle_apply_device where IDLE_ID=?', [idleId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>删除闲置表失败<br>" + error.message);
                })
        })
    }


    /**
     * 在闲置表中插入数据
     * @param idle 
     */
    insertToIdle(idle:Idle) {
        return new Promise((resolve, reject) => {
            if (idle == null) {
                resolve();
            }else{
                this.dbService.executeSql('insert into idle_apply_device values (?,?,?,?,?,?,?,?,?,?,?)',
                [idle.idleId,idle.assetId,idle.installLocation,idle.oldInstallLocation,idle.stopReason,
                idle.assetDesc,idle.testResult,idle.testOrg,idle.applyState,idle.photoPath,idle.recordFlag])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：<br>\r插入闲置表失败<br>\r" + error.message);
                })
            }
            
        })
    }

    ////////闲置表END/////////



    /////////报废表//////////

    /**
      * 根据资产Id获取报废表信息
      * @param assetId 
      */
      selectScrapByAssetId(assetId: string) {
        return new Promise<Scrap>((resolve, reject) => {
            this.dbService.executeSql('select * from scrap_apply_fix where ASSET_ID=? and RECORD_FLAG=0', [assetId])
                .then((data) => {
                    var notice = this._getScrapFromDBResult(data);
                    resolve(notice);
                }, (error) => {
                    reject("数据库操作：<br>查询报废失败<br>" + error.message);
                })
        })
    }

    /**
      * 根据员工编号获取所有闲置表信息
      * @param workerNumber 
      */
    selectScrapListByWorkerNumber(workerNumber: string) {
        return new Promise<Array<Scrap>>((resolve, reject) => {
            this.dbService.executeSql('select fix.* from scrap_apply_fix fix, asset_account_fixed fixed where  fix.ASSET_ID=fixed.ASSET_ID and fixed.WORKER_NUMBER=?', [workerNumber])
                .then((data) => {
                    var notice = this._getScrapListFromDBResult(data);
                    resolve(notice);
                }, (error) => {
                    reject("数据库操作：<br>查询闲置失败<br>" + error.message);
                })
        })
    }

    /**
     * 根据通知ID更新报废表
     * @param changeRecord 
     */
    updateToScrap(scrap: Scrap) {
        return new Promise((resolve, reject) => {
            if (scrap == null) {
                resolve(null);
            } else {
                this.dbService.executeSql(`update scrap_apply_fix set ASSET_ID=? ,SCRAP_CATEGORY=?, UNPRODUCTION_TIME=?,STORAGE_LOCATION=?,
                ASSET_BRIEF=?,SCRAP_REASON=?,APPLY_STATE=?,RECORD_FLAG=? where SCRAP_ID=?`,
                    [scrap.assetId, scrap.scrapCategory, scrap.unproductionTime, scrap.storageLocation, scrap.assetBrief, scrap.scrapReason,scrap.applyState, scrap.recordFlag, scrap.scrapId])
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((error) => {
                        reject("数据库操作：<br>更新报废表失败<br>" + error.message);
                    })
            }
        })
    }

    /**
     * 删除报废表
     */
    deleteScrapById(scrapId: string) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('delete from scrap_apply_fix where SCRAP_ID=?', [scrapId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>删除报废表失败<br>" + error.message);
                })
        })
    }


    /**
     * 在报废表中插入数据
     * @param scrap 
     */
    insertToScrap(scrap:Scrap) {
        return new Promise((resolve, reject) => {
            if (scrap == null) {
                resolve();
            }else{
                this.dbService.executeSql('insert into scrap_apply_fix values (?,?,?,?,?,?,?,?,?)',
                [scrap.scrapId,scrap.assetId,scrap.scrapCategory,scrap.unproductionTime,scrap.storageLocation,
                scrap.assetBrief,scrap.scrapReason,scrap.applyState,scrap.recordFlag])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：<br>\r插入报废表失败<br>\r" + error.message);
                })
            }
        })
    }

    ////////报废表END/////////











    /**
     * 从数据库查询结果中返回Idle的值
     * @param data 
     */
    _getIdleFromDBResult(data):Idle{
        var idle: Idle = null;
        if (data.rows.length > 0) {
            idle = new Idle();
            idle.idleId = data.rows.item(0).IDLE_ID;
            idle.assetId = data.rows.item(0).ASSET_ID;
            idle.installLocation = data.rows.item(0).INSTALL_LOCATION;
            idle.oldInstallLocation = data.rows.item(0).OLD_INSTALL_LOCATION;
            idle.stopReason = data.rows.item(0).STOP_REASON;
            idle.assetDesc = data.rows.item(0).ASSET_DESC;
            idle.testResult = data.rows.item(0).TEST_RESULT;
            idle.testOrg = data.rows.item(0).TEST_ORG;
            idle.applyState = data.rows.item(0).APPLY_STATE;
            idle.photoPath=data.rows.item(0).PHOTO_PATH;
            idle.recordFlag = data.rows.item(0).RECORD_FLAG;
        }
        return idle;
    }

     /**
     * 从数据库查询结果中返回Idle的值
     * @param data 
     */
    private _getIdleListFromDBResult(data): Array<Idle> {
        var idleList: Array<Idle> = new Array<Idle>();
        if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
                var idle = new Idle();
                idle.idleId = data.rows.item(i).IDLE_ID;
                idle.assetId = data.rows.item(i).ASSET_ID;
                idle.installLocation = data.rows.item(i).INSTALL_LOCATION;
                idle.oldInstallLocation = data.rows.item(i).OLD_INSTALL_LOCATION;
                idle.stopReason = data.rows.item(i).STOP_REASON;
                idle.assetDesc = data.rows.item(i).ASSET_DESC;
                idle.testResult = data.rows.item(i).TEST_RESULT;
                idle.testOrg = data.rows.item(i).TEST_ORG;
                idle.photoPath=data.rows.item(i).PHOTO_PATH;
                idle.applyState = data.rows.item(i).APPLY_STATE;
                idle.recordFlag = data.rows.item(i).RECORD_FLAG;
                idleList.push(idle);
            }
        }
        return idleList;
    }


    /**
     * 从数据库查询结果中返回Scrap的值
     * @param data 
     */
    _getScrapFromDBResult(data):Scrap{
        var scrap: Scrap = null;
        if (data.rows.length > 0) {
            scrap = new Scrap();
            scrap.scrapId = data.rows.item(0).SCRAP_ID;
            scrap.assetId = data.rows.item(0).ASSET_ID;
            scrap.scrapCategory = data.rows.item(0).SCRAP_CATEGORY;
            scrap.unproductionTime = data.rows.item(0).UNPRODUCTION_TIME;
            scrap.storageLocation = data.rows.item(0).STORAGE_LOCATION;
            scrap.assetBrief = data.rows.item(0).ASSET_BRIEF;
            scrap.scrapReason = data.rows.item(0).SCRAP_REASON;
            scrap.applyState = data.rows.item(0).APPLY_STATE;
            scrap.recordFlag = data.rows.item(0).RECORD_FLAG;
        }
        return scrap;
    }

    /**
    * 从数据库查询结果中返回Idle的值
    * @param data 
    */
    private _getScrapListFromDBResult(data): Array<Scrap> {
        var scrapList: Array<Scrap> = new Array<Scrap>();
        if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
                var scrap = new Scrap();
                scrap.scrapId = data.rows.item(i).SCRAP_ID;
                scrap.assetId = data.rows.item(i).ASSET_ID;
                scrap.scrapCategory = data.rows.item(i).SCRAP_CATEGORY;
                scrap.unproductionTime = data.rows.item(i).UNPRODUCTION_TIME;
                scrap.storageLocation = data.rows.item(i).STORAGE_LOCATION;
                scrap.assetBrief = data.rows.item(i).ASSET_BRIEF;
                scrap.scrapReason = data.rows.item(i).SCRAP_REASON;
                scrap.applyState = data.rows.item(i).APPLY_STATE;
                scrap.recordFlag = data.rows.item(i).RECORD_FLAG;
                scrapList.push(scrap);
            }
        }
        return scrapList;
    }
    
}