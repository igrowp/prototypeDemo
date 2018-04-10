import { SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { DBService } from './db.service';
import { CvtNonNotice, CvtNonNoticeSub, CvtNonReceive } from '../entity/cvt.entity.provider';

/*
  盘点数据库类
*/
@Injectable()
export class CvtDBProvider {
    private dataBase: SQLiteObject = null;
    constructor(private dbService: DBService) {
        this.dbService.getSqliteObject().then((db) => {
            this.dataBase = db;
        })
    }

    /////////非安转产通知单//////////
    /**
      * 根据通知单ID获取非安设备转产通知单
      * @param noticeId 
      */
      queryFromCvtNonNoticeByNoticeId(noticeId: string) {
        return new Promise<CvtNonNotice>((resolve, reject) => {
            this.dbService.executeSql('select * from cvt_noninstall_notice where NOTICE_ID=?', [noticeId])
                .then((data) => {
                    var notice = this._getCvtNonNoticeFromDBResult(data);
                    resolve(notice);
                }, (error) => {
                    reject("数据库操作：<br>查询非安设备通知表失败<br>" + error.message);
                })
        })
    }

    /**
      * 根据员工编号获取非安设备转产通知单
      * @param workerNumber 
      */
    queryFromCvtNonNoticeByWorkerNumber(workerNumber: string) {
        return new Promise<Array<CvtNonNotice>>((resolve, reject) => {
            this.dbService.executeSql('select * from cvt_noninstall_notice where RECIPIENT=?', [workerNumber])
                .then((data) => {
                    var notice = this._getCvtNonNoticeListFromDBResult(data);
                    resolve(notice);
                }, (error) => {
                    reject("数据库操作：<br>查询非安设备通知表失败<br>" + error.message);
                })
        })
    }

    /**
     * 根据通知ID更新通知单
     * @param changeRecord 
     */
    updateToCvtNonNotice(cvtNonNotice: CvtNonNotice) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql("update cvt_noninstall_notice set INVESTPLAN_ID=?,ORG_NAME=? ,WORK_ORDER_NUMBER=?, STOREROOM_KEEPER=?,NOTICE_STATE=?,RECORD_FLAG=? where NOTICE_ID=?",
                [cvtNonNotice.investplanId, cvtNonNotice.orgName, cvtNonNotice.workOrderNumber, cvtNonNotice.storeroomKeeper, cvtNonNotice.noticeState, cvtNonNotice.recordFlag, cvtNonNotice.noticeId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>更新非安设备转产通知单失败<br>" + error.message);
                })
        })
    }

    /**
     * 删除非安设备转产通知单
     */
    deleteFromCvtNonNoticeByNoticeId(noticeId: string) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('delete from cvt_noninstall_notice where NOTICE_ID=?', [noticeId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>删除非安设备转产通知单失败<br>" + error.message);
                })
        })
    }

    /**
     * 在非安资产领用通知表中插入数据
     * @param cvtNonNotice 
     */
    insertToCvtNonNotice(cvtNonNotice: CvtNonNotice) {
        return new Promise((resolve, reject) => {
            if (cvtNonNotice == null) {
                resolve();
            }else{
                
            this.dbService.executeSql('insert into cvt_noninstall_notice values (?,?,?,?,?,?,?,?)',
                [cvtNonNotice.noticeId, cvtNonNotice.investplanId, cvtNonNotice.orgName, cvtNonNotice.workOrderNumber, cvtNonNotice.recipient,
                cvtNonNotice.storeroomKeeper, cvtNonNotice.noticeState, cvtNonNotice.recordFlag])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：<br>插入非安资产领用通知表失败<br>" + error.message);
                })
            }
        })
    }


    ////////非安转产通知单END/////////


    ///////非安转产通知单明细/////////
    /**
      * 根据通知单ID获取非安设备转产通知附加表
      * @param noticeId 
      */
      queryFromCvtNonNoticeSubBySubId(subNoticeId: string) {
        return new Promise<CvtNonNoticeSub>((resolve, reject) => {
            this.dbService.executeSql('select * from cvt_noninstall_notice_sub where SUB_NOTICE_ID=?', [subNoticeId])
                .then((data) => {
                    var notice = this._getCvtNonNoticeSubListFromDBResult(data);
                    resolve(notice);
                }, (error) => {
                    reject("数据库操作：<br>查询非安设备通知表失败<br>" + error.message);
                })
        })
    }

    /**
      * 根据通知单ID获取非安设备转产通知附加表
      * @param noticeId 
      */
    queryFromCvtNonNoticeSubByNoticeId(noticeId: string) {
        return new Promise<Array<CvtNonNoticeSub>>((resolve, reject) => {
            this.dbService.executeSql('select * from cvt_noninstall_notice_sub where NOTICE_ID=?', [noticeId])
                .then((data) => {
                    var notice = this._getCvtNonNoticeSubListsFromDBResult(data);
                    resolve(notice);
                }, (error) => {
                    reject("数据库操作：<br>查询非安设备通知表失败<br>" + error.message);
                })
        })
    }

    /**
     * 删除非安设备转产通知单附加表
     */
    deleteFromCvtNonNoticeSubByNoticeId(noticeId: string) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('delete from cvt_noninstall_notice_sub where NOTICE_ID=?', [noticeId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>删除非安设备转产通知单附加表失败<br>" + error.message);
                })
        })
    }

    /**
     * 在非安资产领用通知附加表中插入数据
     * @param noticeSub 
     */
    insertToCvtNonNoticeSub(noticeSub: CvtNonNoticeSub) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('insert into cvt_noninstall_notice_sub values (?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [noticeSub.subNoticeId, noticeSub.noticeId, noticeSub.purchasingId, noticeSub.materialCode, noticeSub.assetName, noticeSub.specModel, noticeSub.unit,
                noticeSub.sentQuantity, noticeSub.price, noticeSub.amount, noticeSub.storageDate, noticeSub.outDate, noticeSub.recordFlag])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：<br>插入非安资产领用通知附加表失败<br>" + error.message);
                })
        })
    }
    ///////非安转产通知单明细END/////////


    ///////非安转产领用通知单///////////
    /**
     * 获取领用表资产信息
     * @param noticeId 
     * @param recordFlag 0代表为分发，1代表已经分发
     */
    queryFromCvtNonReceive(noticeId: string,recordFlag?:number) {
        let sql,param;
        if(recordFlag||recordFlag==0){
            sql='select * from cvt_noninstall_receive where NOTICE_ID=? AND RECORD_FLAG=?';
            param=[noticeId,recordFlag];
        }else{
            sql='select * from cvt_noninstall_receive where NOTICE_ID=?';
            param=[noticeId];
        }
        return new Promise<Array<CvtNonReceive>>((resolve, reject) => {
            this.dbService.executeSql(sql,param)
                .then((data) => {
                    var notice = this._getCvtNonReceivesFromDBResult(data);
                    resolve(notice);
                }, (error) => {
                    reject("数据库操作：<br>查询非安转产领用表失败<br>" + error.message);
                })
        })
    }

    /**
      * 获取领用表资产信息
      */
      queryFromCvtNonReceiveByReceiveId(receiveId: string) {
        return new Promise<CvtNonReceive>((resolve, reject) =>{
            this.dbService.executeSql('select * from cvt_noninstall_receive where RECEIVE_ID=?', [receiveId])
                .then((data) => {
                    var notice = this._getCvtNonReceiveFromDBResult(data);
                    resolve(notice);
                }, (error) => {
                    reject("数据库操作：<br>查询非安转产领用表失败<br>" + error.message);
                })
        })
    }

    /**
     * 根据通知ID更新领用单
     * @param changeRecord 
     */
    updateToCvtNonReceive(cvtNonReceive: CvtNonReceive) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql("update cvt_noninstall_receive set RECEIVE_ORG=?,RECEIVE_PERSON=?,RECEIVE_TIME=? ,RECEIVE_STYLE=?,RECORD_FLAG=?,RECEIVE_NAME=?,SIGNATURE_PATH=?,SIGNATURE_NAME=? where RECEIVE_ID=?",
                [cvtNonReceive.receiveOrg, cvtNonReceive.receivePerson, cvtNonReceive.receiveTime, cvtNonReceive.reveiveStyle, cvtNonReceive.recordFlag, cvtNonReceive.receiveName, cvtNonReceive.signaturePath, cvtNonReceive.signatureName, cvtNonReceive.receiveId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>更新非安设备转产领用单失败<br>" + error.message);
                })
        })
    }
    /**
     * 删除非安设备转产领用单
     */
    deleteFromCvtNonReceiveByNoticeId(noticeId: string) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('delete from cvt_noninstall_receive where NOTICE_ID=?', [noticeId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>删除非安设备转产领用单失败<br>" + error.message);
                })
        })
    }

    /**
     * 在非安资产领用记录表中插入数据
     * @param cvtNonReceive 
     */
    insertToCvtNonReceive(cvtNonReceive: CvtNonReceive) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('insert into cvt_noninstall_receive values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [cvtNonReceive.receiveId, cvtNonReceive.noticeId, cvtNonReceive.assetId, cvtNonReceive.assetCode, cvtNonReceive.assetName, cvtNonReceive.specModel, cvtNonReceive.receiveOrg, cvtNonReceive.receivePerson, cvtNonReceive.receiveTime, cvtNonReceive.reveiveStyle, cvtNonReceive.recordFlag, cvtNonReceive.receiveName, cvtNonReceive.signaturePath, cvtNonReceive.signatureName])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：<br>插入非安资产领用记录表失败<br>" + error.message);
                })
        })
    }
    ///////非安转产领用通知单END///////////



    /////////解析数据库传回值///////////


    /**
     * 从数据库查询结果中返回CvtNonNotice的值
     * @param data 
     */
    private _getCvtNonNoticeFromDBResult(data): CvtNonNotice {
        var cvtNonNotice: CvtNonNotice = null;
        if (data.rows.length > 0) {
            cvtNonNotice = new CvtNonNotice();
            cvtNonNotice.noticeId = data.rows.item(0).NOTICE_ID;
            cvtNonNotice.investplanId = data.rows.item(0).INVESTPLAN_ID;
            cvtNonNotice.orgName = data.rows.item(0).ORG_NAME;
            cvtNonNotice.workOrderNumber = data.rows.item(0).WORK_ORDER_NUMBER;
            cvtNonNotice.recipient = data.rows.item(0).RECIPIENT;
            cvtNonNotice.storeroomKeeper = data.rows.item(0).STOREROOM_KEEPER;
            cvtNonNotice.noticeState = data.rows.item(0).NOTICE_STATE;
            cvtNonNotice.recordFlag = data.rows.item(0).RECORD_FLAG;
        }
        return cvtNonNotice;
    }

    /**
     * 从数据库查询结果中返回CvtNonNotice的值
     * @param data 
     */
    private _getCvtNonNoticeListFromDBResult(data): Array<CvtNonNotice> {
        var cvtNonNotices: Array<CvtNonNotice> = new Array<CvtNonNotice>();
        if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
                var cvtNonNotice = new CvtNonNotice();
                cvtNonNotice.noticeId = data.rows.item(i).NOTICE_ID;
                cvtNonNotice.investplanId = data.rows.item(i).INVESTPLAN_ID;
                cvtNonNotice.orgName = data.rows.item(i).ORG_NAME;
                cvtNonNotice.workOrderNumber = data.rows.item(i).WORK_ORDER_NUMBER;
                cvtNonNotice.recipient = data.rows.item(i).RECIPIENT;
                cvtNonNotice.storeroomKeeper = data.rows.item(i).STOREROOM_KEEPER;
                cvtNonNotice.noticeState = data.rows.item(i).NOTICE_STATE;
                cvtNonNotice.recordFlag = data.rows.item(i).RECORD_FLAG;
                cvtNonNotices.push(cvtNonNotice);
            }
        }
        return cvtNonNotices;
    }

    /**
     * 从数据库查询结果中返回CvtNonNoticeSub的值
     * @param data 
     */
    private _getCvtNonNoticeSubListFromDBResult(data): CvtNonNoticeSub {
        var cvtNonNoticeSub: CvtNonNoticeSub = null;
        if (data.rows.length > 0) {
            cvtNonNoticeSub = new CvtNonNoticeSub();
            cvtNonNoticeSub.subNoticeId = data.rows.item(0).SUB_NOTICE_ID;
            cvtNonNoticeSub.noticeId = data.rows.item(0).NOTICE_ID;
            cvtNonNoticeSub.purchasingId = data.rows.item(0).PURCHASING_ID;
            cvtNonNoticeSub.materialCode = data.rows.item(0).MATERIAL_CODE;
            cvtNonNoticeSub.assetName = data.rows.item(0).ASSET_NAME;
            cvtNonNoticeSub.specModel = data.rows.item(0).SPEC_MODEL;
            cvtNonNoticeSub.unit = data.rows.item(0).UNIT;
            cvtNonNoticeSub.price = data.rows.item(0).PRICE;
            cvtNonNoticeSub.amount = data.rows.item(0).AMOUNT;
            cvtNonNoticeSub.sentQuantity = data.rows.item(0).SENT_QUANTITY;
            cvtNonNoticeSub.storageDate = data.rows.item(0).STORAGE_DATE;
            cvtNonNoticeSub.outDate = data.rows.item(0).OUT_DATE;
            cvtNonNoticeSub.recordFlag = data.rows.item(0).RECORD_FLAG;
        }
        return cvtNonNoticeSub;
    }

    /**
     * 从数据库查询结果中返回CvtNonNoticeSub的值
     * @param data 
     */
    private _getCvtNonNoticeSubListsFromDBResult(data): Array<CvtNonNoticeSub> {
        var cvtNonNoticeSubs: Array<CvtNonNoticeSub> = new Array<CvtNonNoticeSub>();
        if (data.rows.length > 0) {
            cvtNonNoticeSubs = new Array<CvtNonNoticeSub>();
            for (var i = 0; i < data.rows.length; i++) {
                var cvtNonNoticeSub = new CvtNonNoticeSub();
                cvtNonNoticeSub.subNoticeId = data.rows.item(i).SUB_NOTICE_ID;
                cvtNonNoticeSub.noticeId = data.rows.item(i).NOTICE_ID;
                cvtNonNoticeSub.purchasingId = data.rows.item(i).PURCHASING_ID;
                cvtNonNoticeSub.materialCode = data.rows.item(i).MATERIAL_CODE;
                cvtNonNoticeSub.assetName = data.rows.item(i).ASSET_NAME;
                cvtNonNoticeSub.specModel = data.rows.item(i).SPEC_MODEL;
                cvtNonNoticeSub.unit = data.rows.item(i).UNIT;
                cvtNonNoticeSub.price = data.rows.item(i).PRICE;
                cvtNonNoticeSub.amount = data.rows.item(i).AMOUNT;
                cvtNonNoticeSub.sentQuantity = data.rows.item(i).SENT_QUANTITY;
                cvtNonNoticeSub.storageDate = data.rows.item(i).STORAGE_DATE;
                cvtNonNoticeSub.outDate = data.rows.item(i).OUT_DATE;
                cvtNonNoticeSub.recordFlag = data.rows.item(i).RECORD_FLAG;
                cvtNonNoticeSubs.push(cvtNonNoticeSub);
            }
        }
        return cvtNonNoticeSubs;
    }
    /**
    * 从数据库查询结果中返回Array<CvtNonReceive>的值
    * @param data 
    */
    private _getCvtNonReceiveFromDBResult(data): CvtNonReceive {
        var cvtNonReceive:CvtNonReceive = null;
        if (data.rows.length > 0) {
                cvtNonReceive= new CvtNonReceive();
                cvtNonReceive.receiveId = data.rows.item(0).RECEIVE_ID;
                cvtNonReceive.noticeId = data.rows.item(0).NOTICE_ID;
                cvtNonReceive.assetId = data.rows.item(0).ASSET_ID;
                cvtNonReceive.assetCode = data.rows.item(0).ASSET_CODE;
                cvtNonReceive.assetName = data.rows.item(0).ASSET_NAME;
                cvtNonReceive.specModel = data.rows.item(0).SPEC_MODEL;
                cvtNonReceive.receiveOrg = data.rows.item(0).RECEIVE_ORG;
                cvtNonReceive.receivePerson = data.rows.item(0).RECEIVE_PERSON;
                cvtNonReceive.receiveTime = data.rows.item(0).RECEIVE_TIME;
                cvtNonReceive.reveiveStyle = data.rows.item(0).RECEIVE_STYLE;
                cvtNonReceive.recordFlag = data.rows.item(0).RECORD_FLAG;
                cvtNonReceive.receiveName = data.rows.item(0).RECEIVE_NAME;
                cvtNonReceive.signaturePath = data.rows.item(0).SIGNATURE_PATH;
                cvtNonReceive.signatureName = data.rows.item(0).SIGNATURE_NAME;
        }
        return cvtNonReceive;
    }

    /**
    * 从数据库查询结果中返回Array<CvtNonReceive>的值
    * @param data 
    */
    private _getCvtNonReceivesFromDBResult(data): Array<CvtNonReceive> {
        var cvtNonReceives: Array<CvtNonReceive> = new Array<CvtNonReceive>();
        if (data.rows.length > 0) {
            cvtNonReceives = new Array<CvtNonReceive>();
            for (var i = 0; i < data.rows.length; i++) {
                var cvtNonReceive = new CvtNonReceive();
                cvtNonReceive.receiveId = data.rows.item(i).RECEIVE_ID;
                cvtNonReceive.noticeId = data.rows.item(i).NOTICE_ID;
                cvtNonReceive.assetId = data.rows.item(i).ASSET_ID;
                cvtNonReceive.assetCode = data.rows.item(i).ASSET_CODE;
                cvtNonReceive.assetName = data.rows.item(i).ASSET_NAME;
                cvtNonReceive.specModel = data.rows.item(i).SPEC_MODEL;
                cvtNonReceive.receiveOrg = data.rows.item(i).RECEIVE_ORG;
                cvtNonReceive.receivePerson = data.rows.item(i).RECEIVE_PERSON;
                cvtNonReceive.receiveTime = data.rows.item(i).RECEIVE_TIME;
                cvtNonReceive.reveiveStyle = data.rows.item(i).RECEIVE_STYLE;
                cvtNonReceive.recordFlag = data.rows.item(i).RECORD_FLAG;
                cvtNonReceive.receiveName = data.rows.item(i).RECEIVE_NAME;
                cvtNonReceive.signaturePath = data.rows.item(i).SIGNATURE_PATH;
                cvtNonReceive.signatureName = data.rows.item(i).SIGNATURE_NAME;
                cvtNonReceives.push(cvtNonReceive);
            }
        }
        return cvtNonReceives;
    }

}
