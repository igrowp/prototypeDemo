import { InvAsset } from './../entity/entity.provider';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { DBService } from './db.service';
import { InvNotice } from '../entity/entity.provider';

/*
  盘点数据库类
*/
@Injectable()
export class InvDBProvider {
    private dataBase: SQLiteObject = null;
    constructor(private dbService: DBService) {
        this.dbService.getSqliteObject().then((db) => {
            this.dataBase = db;
        })
    }


    /////////盘点通知单操作//////////

    /**
        * 根据所属单位获取盘点通知
        * @param leadingOrg 
        */
    queryFromInvNoticeByLeadingOrg(leadingOrg: string) {
        return new Promise<InvNotice>((resolve, reject) => {
            this.dbService.executeSql('select * from inv_notice where LEADING_ORG=?', [leadingOrg])
                .then((data) => {
                    var invNotice: InvNotice = this._getInvNoticeFromDBResult(data);
                    resolve(invNotice);
                }, (error) => {
                    reject("数据库操作：<br>查询盘点通知表失败<br>" + error.message);
                })
        })
    }

    /**
     * 根据通知ID更新通知单
     * @param changeRecord 
     */
    updateToInvNotice(invNotice: InvNotice) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql("update inv_notice set NOTICE_ID=?,TITLE=?,CONTENT=? ,INITIATOR=?,TIME_START=?,TIME_FINISH=?,STATE=? where LEADING_ORG=?",
                [invNotice.noticeId, invNotice.title, invNotice.content, invNotice.initiator, invNotice.timeStart, invNotice.timeFinish, invNotice.state, invNotice.leadingOrg])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>更新盘点通知表失败<br>" + error.message);
                })
        })
    }

    /**
     * 在盘点通知表中插入数据
     * @param invNotice 
     */
    insertToInvNotice(invNotice: InvNotice) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('insert into inv_notice values (?,?,?,?,?,?,?,?)', [invNotice.noticeId, invNotice.title, invNotice.content, invNotice.leadingOrg, invNotice.initiator, invNotice.timeStart, invNotice.timeFinish, invNotice.state])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：<br>插入盘点通知表失败<br>" + error.message);
                })
        })
    }

    /**
     * 删除资产盘点通知单
     * @param leadingOrg 
     */
    deleteFromInvNotice(leadingOrg: string) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('delete from inv_notice where LEADING_ORG=?', [leadingOrg])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>删除资产盘点通知单失败<br>"+error.message);
                })
        })
    }


    ////////盘点通知单操作END/////////







    /////////盘点记录 inv_asset_record/////////

    /**
     * 从资产盘点记录中获取所有资产信息
     */
    queryAssetsFromInv(preWorkerNumber: string, isSignatured: number) {
        return new Promise<Array<InvAsset>>((resolve, reject) => {
            this.dbService.executeSql("select * from inv_asset_record where PRE_WORKER_NUMBER=? AND IS_SIGNATURED=?", [preWorkerNumber, isSignatured])
                .then((data) => {
                    var assets: Array<InvAsset> = this._getInvAssetsFromDBResult(data);
                    resolve(assets);
                }).catch((error) => {
                    reject("数据库操作：<br>查询盘点记录表失败<br>"+error.message);
                });
        })
    }

    /**
     * 根据资产ID和通知ID从资产盘点记录中查询资产信息
     * @param id 
     */
    queryFromInvByIdAndNotice(id: string, noticeId: string) {
        return new Promise<InvAsset>((resolve, reject) => {
            this.dbService.executeSql("select * from inv_asset_record where ASSET_ID=? and NOTICE_ID=?", [id, noticeId])
                .then((data) => {
                    var asset = this._getInvAssetFromDBResult(data);
                    resolve(asset);
                }).catch((error) => {
                    reject("数据库操作：<br>查询资产信息失败<br>"+error.message);
                });
        })
    }

    /**
     * 更新资产盘点记录信息
     * @param asset 
     */
    updateToInv(asset: InvAsset) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql(`update inv_asset_record 
                                    set WORKER_NUMBER=?,MANAGER=?, TECH_STATUS=?,USE_STATE=?,INSTALL_LOCATION=?,SECURITY_STATE=?,SECURITY_STATE_DESC=?,USE_ORG=?,USE_ORG_NAME=?,HANDLE_SCRAP_MODE=?,
                                        HANDLE_DATE=?,HANDLE_REASON=?,PROFIT_LOSS=?,PROFIT_LOSS_CAUSE=?,TIME_STAMP=?,IS_SIGNATURED=?,REMARK=?,PHOTO_PATH=?,SIGNATURE_PATH=?,SIGNATURE=?,PRE_WORKER_NUMBER=?
                                    where NOTICE_ID=? AND ASSET_ID=?`,
                [asset.workerNumber, asset.manager, asset.techStatus, asset.useState, asset.installLocation, asset.securityState, asset.securityStateDesc, asset.useOrg, asset.useOrgName, asset.handleScrapMode,
                asset.handleDate, asset.handleReason, asset.profitLoss, asset.profitLossCause, asset.timeStamp, asset.isSignatured, asset.remark, asset.photoPath, asset.signaturePath, asset.signature, asset.preWorkerNumber, asset.noticeId, asset.assetId])
                .then((data) => {
                    //alert("成功");
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>更新盘点记录信息表失败<br>"+error.message);
                })
        })
    }

    /**
       * 删除资产盘点记录中的数据
       * @param leadingOrg 
       */
    deleteFromInv(leadingOrg: string) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('select * from sys_person_info where WORK_FOR_ORG=?', [leadingOrg])
                .then((data) => {
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            var workerNumber = data[i].rows.WORKER_NUMBER
                            this.dbService.executeSql('delete from inv_asset_record where PRE_WORKER_NUMBER=?', [workerNumber])
                                .then((data) => {
                                    if (workerNumber == data[data.rows.length - 1].rows.PRE_WORKER_NUMBER) {
                                        resolve(data);
                                    }
                                })
                                .catch((error) => {
                                    reject("数据库操作：<br>删除资产盘点记录数据失败<br>" + error.message);
                                })
                        }
                    }
                })
                .catch((error) => {
                    reject("数据库操作：<br>查询员工信息失败<br>" + error.message);
                })
        })
    }

    /**
     * 在资产盘点记录中插入数据
     * @param asset 
     */
    insertToInv(asset: InvAsset) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('insert into inv_asset_record values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [asset.invRecordId, asset.assetId, asset.noticeId, asset.workerNumber, asset.manager, asset.techStatus, asset.useState, asset.installLocation, asset.securityState, asset.securityStateDesc, asset.useOrg, asset.useOrgName, asset.handleScrapMode, asset.handleDate, asset.handleReason, asset.profitLoss, asset.profitLossCause, asset.timeStamp, asset.assetName, asset.assetType, asset.isSignatured, asset.remark, asset.photoPath, asset.signaturePath, asset.signature, asset.preWorkerNumber])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>插入资产盘带你记录表失败<br>"+error.message);
                })
        })
    }

    /////////盘点记录 END////////






    /////////解析数据库传回值///////////
    /**
       * 从数据库查询结果中返回InvNotice的值
       * @param data 
       */
    private _getInvNoticeFromDBResult(data): InvNotice {
        var invNotice: InvNotice = null;
        if (data.rows.length > 0) {
            invNotice = new InvNotice();
            invNotice.noticeId = data.rows.item(0).NOTICE_ID;
            invNotice.title = data.rows.item(0).TITLE;
            invNotice.content = data.rows.item(0).CONTENT;
            invNotice.leadingOrg = data.rows.item(0).LEADING_ORG;
            invNotice.initiator = data.rows.item(0).INITIATOR;
            invNotice.timeStart = data.rows.item(0).TIME_START;
            invNotice.timeFinish = data.rows.item(0).TIME_FINISH;
            invNotice.state = data.rows.item(0).STATE;
        }
        return invNotice;
    }

    private _getInvAssetsFromDBResult(data): Array<InvAsset> {
        var assets: Array<InvAsset> = new Array<InvAsset>();
        if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
                var asset: InvAsset = new InvAsset();
                asset = new InvAsset();
                asset.invRecordId = data.rows.item(i).INV_RECORD_ID;
                asset.assetId = data.rows.item(i).ASSET_ID;
                asset.noticeId = data.rows.item(i).NOTICE_ID;
                asset.workerNumber = data.rows.item(i).WORKER_NUMBER;
                asset.manager = data.rows.item(i).MANAGER;
                asset.techStatus = data.rows.item(i).TECH_STATUS;
                asset.useState = data.rows.item(i).USE_STATE;
                asset.installLocation = data.rows.item(i).INSTALL_LOCATION;
                asset.securityState = data.rows.item(i).SECURITY_STATE;
                asset.securityStateDesc = data.rows.item(i).SECURITY_STATE_DESC;
                asset.useOrg = data.rows.item(i).USE_ORG;
                asset.useOrgName = data.rows.item(i).USE_ORG_NAME;
                asset.handleScrapMode = data.rows.item(i).HANDLE_SCRAP_MODE;
                asset.handleDate = data.rows.item(i).HANDLE_DATE;
                asset.handleReason = data.rows.item(i).HANDLE_REASON;
                asset.profitLoss = data.rows.item(i).PROFIT_LOSS;
                asset.profitLossCause = data.rows.item(i).PROFIT_LOSS_CAUSE;
                asset.timeStamp = data.rows.item(i).TIME_STAMP;
                asset.assetName = data.rows.item(i).ASSET_NAME;
                asset.assetType = data.rows.item(i).ASSET_TYPE;
                asset.isSignatured = data.rows.item(i).IS_SIGNATURED;
                asset.remark = data.rows.item(i).REMARK;
                asset.photoPath = data.rows.item(i).PHOTO_PATH;
                asset.signaturePath = data.rows.item(i).SIGNATURE_PATH;
                asset.signature = data.rows.item(i).SIGNATURE;
                asset.preWorkerNumber = data.rows.item(i).PRE_WORKER_NUMBER;
                assets.push(asset);
            }
        }
        return assets;
    }

    /**
     * 从数据库查询结果中返回InvAsset的值
     * @param data 
     */
    private _getInvAssetFromDBResult(data): InvAsset {
        var asset: InvAsset = null;
        if (data.rows.length > 0) {
            asset = new InvAsset();
            asset.invRecordId = data.rows.item(0).INV_RECORD_ID;
            asset.assetId = data.rows.item(0).ASSET_ID;
            asset.noticeId = data.rows.item(0).NOTICE_ID;
            asset.workerNumber = data.rows.item(0).WORKER_NUMBER;
            asset.manager = data.rows.item(0).MANAGER;
            asset.techStatus = data.rows.item(0).TECH_STATUS;
            asset.useState = data.rows.item(0).USE_STATE;
            asset.installLocation = data.rows.item(0).INSTALL_LOCATION;
            asset.securityState = data.rows.item(0).SECURITY_STATE;
            asset.securityStateDesc = data.rows.item(0).SECURITY_STATE_DESC;
            asset.useOrg = data.rows.item(0).USE_ORG;
            asset.useOrgName = data.rows.item(0).USE_ORG_NAME;
            asset.handleScrapMode = data.rows.item(0).HANDLE_SCRAP_MODE;
            asset.handleDate = data.rows.item(0).HANDLE_DATE;
            asset.handleReason = data.rows.item(0).HANDLE_REASON;
            asset.profitLoss = data.rows.item(0).PROFIT_LOSS;
            asset.profitLossCause = data.rows.item(0).PROFIT_LOSS_CAUSE;
            asset.timeStamp = data.rows.item(0).TIME_STAMP;
            asset.assetName = data.rows.item(0).ASSET_NAME;
            asset.assetType = data.rows.item(0).ASSET_TYPE;
            asset.isSignatured = data.rows.item(0).IS_SIGNATURED;
            asset.remark = data.rows.item(0).REMARK;
            asset.photoPath = data.rows.item(0).PHOTO_PATH;
            asset.signaturePath = data.rows.item(0).SIGNATURE_PATH;
            asset.signature = data.rows.item(0).SIGNATURE;
            asset.preWorkerNumber = data.rows.item(0).PRE_WORKER_NUMBER;

        }
        return asset;
    }


}
