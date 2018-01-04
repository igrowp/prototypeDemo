import { CvtNonNoticeSub, CvtNonReceive, CvtNonCheck, CvtNonNotice } from './../entity/cvt.entity.provider';
import { FixedAsset, InvAsset, InvNotice, OrgInfo, User, UserAccount, UserSimple, ChangeRecord } from './../entity/entity.provider';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  提供本地数据库的增删改查操作，已经数据库的建立和开闭
*/
@Injectable()
export class LocalStorageService {
    private database: any = null;
    private isOpen: boolean = false;

    constructor(
        private sqlite: SQLite,
        private storage: Storage
    ) {
        //判断是否应该创建数据库
        this._getLocal();
    }


    ///////////////查询操作///////////////////////
    /**
     * 获取所有固定资产台账中的数据
     */
    queryAssetsFormFixed(workerNumber: string, isChecked: string) {
        let sql: string = "";
        let params: any = [];
        if (isChecked == "-1") {
            //搜索全部
            sql = "select * from asset_account_fixed where WORKER_NUMBER=?";
            params = [workerNumber];
        } else {
            sql = "select * from asset_account_fixed where WORKER_NUMBER=? and IS_CHECKED=?";
            params = [workerNumber, isChecked];
        }
        return new Promise<Array<FixedAsset>>((resolve, reject) => {
            this.database.executeSql(sql, params)
                .then((data) => {
                    var assets: Array<FixedAsset> = new Array<FixedAsset>();
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            var asset: FixedAsset = new FixedAsset();
                            asset.assetId = data.rows.item(i).ASSET_ID;
                            asset.assetName = data.rows.item(i).ASSET_NAME;
                            asset.assetType = data.rows.item(i).ASSET_TYPE;
                            asset.assetCategory = data.rows.item(i).ASSET_CATEGORY;
                            asset.assetClass = data.rows.item(i).ASSET_CLASS;
                            asset.specModel = data.rows.item(i).SPEC_MODEL;
                            asset.licenseplatWellno = data.rows.item(i).LICENSEPLAT_WELLNO;
                            asset.workForOrg = data.rows.item(i).WORK_FOR_ORG;
                            asset.workInOrg = data.rows.item(i).WORK_IN_ORG;
                            asset.subordinateBlock = data.rows.item(i).SUBORDINATE_BLOCK;
                            //   asset.productionTime=data.rows.item(i).PRODUCTION_TIME;
                            asset.techStatus = data.rows.item(i).TECH_STATUS;
                            asset.useState = data.rows.item(i).USE_STATE;
                            //   asset.manufactureDate=data.rows.item(i).MANUFACTURE_DATE;
                            //   asset.increaseDate=data.rows.item(i).INCREASE_DATE;
                            asset.manufactureDate = this.formatDate(new Date(data.rows.item(i).MANUFACTURE_DATE));
                            asset.productionTime = this.formatDate(new Date(data.rows.item(i).PRODUCTION_TIME));
                            asset.increaseDate = this.formatDate(new Date(data.rows.item(i).INCREASE_DATE));

                            asset.increaseReason = data.rows.item(i).INCREASE_REASON;
                            asset.unit = data.rows.item(i).UNIT;
                            asset.quantity = data.rows.item(i).QUANTITY;
                            asset.yardStatus = data.rows.item(i).YARD_STATUS;
                            asset.assetGroup = data.rows.item(i).ASSET_GROUP;
                            asset.remainingLife = data.rows.item(i).REMAINING_LIFE;
                            asset.netWorth = data.rows.item(i).NET_WORTH;
                            asset.workerNumber = data.rows.item(i).WORKER_NUMBER;
                            asset.custodian = data.rows.item(i).CUSTODIAN;
                            asset.installLocation = data.rows.item(i).INSTALL_LOCATION;
                            asset.remark = data.rows.item(i).REMARK;
                            asset.twoDimensionCode = data.rows.item(i).TWO_DIMENSION_CODE;
                            asset.rfid = data.rows.item(i).RFID;
                            asset.recordFlag = data.rows.item(i).RECORD_FLAG;
                            asset.isChecked = data.rows.item(i).IS_CHECKED;
                            asset.isTrans = data.rows.item(i).IS_TRANS;
                            asset.selfNumber = data.rows.item(i).SELF_NUMBER;
                            asset.assetCode = data.rows.item(i).ASSET_CODE;
                            asset.originalValue = data.rows.item(i).ORIGINAL_VALUE;
                            asset.singleQuantity = data.rows.item(i).SINGLE_QUANTITY;
                            asset.complexQuantity = data.rows.item(i).COMPLEX_QUANTITY;
                            asset.certificateNumber = data.rows.item(i).CERTIFICATE_NUMBER;
                            asset.securityState = data.rows.item(i).SECURITY_STATE;
                            asset.changeCustodian = data.rows.item(i).CHANGE_CUSTODIAN;
                            asset.changeWorkerNumber = data.rows.item(i).CHANGE_WORKER_NUMBER;
                            asset.manufacturer = data.rows.item(i).MANUFACTURER;
                            asset.serialNumber = data.rows.item(i).SERIAL_NUMBER;
                            asset.fundChannel = data.rows.item(i).FUND_CHANNEL;
                            assets.push(asset);
                        }
                    }
                    resolve(assets);
                }).catch((error) => {
                    reject("数据库操作：\n查询固定资产台账表失败\n"+error.message);
                });
        })
    }

    /**
     * 根据每页显示条数和页码得到数据
     * @param pageSize   每页的数据大小
     * @param pageIndex 页码，从1开始
     * @param workerNumber 员工编号
     */
    queryAssetsFormFixedByPage(pageSize: number, pageIndex: number, workerNumber: string) {
        return new Promise<Array<FixedAsset>>((resolve, reject) => {
            var index = pageSize * (pageIndex - 1);
            this.database.executeSql("select * from asset_account_fixed where WORKER_NUMBER=? limit ? offset ?", [workerNumber, pageSize, index])
                .then((data) => {
                    var assets: Array<FixedAsset> = new Array<FixedAsset>();
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            var asset: FixedAsset = new FixedAsset();
                            asset.assetId = data.rows.item(i).ASSET_ID;
                            asset.assetName = data.rows.item(i).ASSET_NAME;
                            asset.assetType = data.rows.item(i).ASSET_TYPE;
                            asset.assetCategory = data.rows.item(i).ASSET_CATEGORY;
                            asset.assetClass = data.rows.item(i).ASSET_CLASS;
                            asset.specModel = data.rows.item(i).SPEC_MODEL;
                            asset.licenseplatWellno = data.rows.item(i).LICENSEPLAT_WELLNO;
                            asset.workForOrg = data.rows.item(i).WORK_FOR_ORG;
                            asset.workInOrg = data.rows.item(i).WORK_IN_ORG;
                            asset.subordinateBlock = data.rows.item(i).SUBORDINATE_BLOCK;
                            asset.productionTime = data.rows.item(i).PRODUCTION_TIME;
                            asset.techStatus = data.rows.item(i).TECH_STATUS;
                            asset.useState = data.rows.item(i).USE_STATE;
                            asset.manufactureDate = data.rows.item(i).MANUFACTURE_DATE;
                            asset.increaseDate = data.rows.item(i).INCREASE_DATE;
                            asset.increaseReason = data.rows.item(i).INCREASE_REASON;
                            asset.unit = data.rows.item(i).UNIT;
                            asset.quantity = data.rows.item(i).QUANTITY;
                            asset.yardStatus = data.rows.item(i).YARD_STATUS;
                            asset.assetGroup = data.rows.item(i).ASSET_GROUP;
                            asset.remainingLife = data.rows.item(i).REMAINING_LIFE;
                            asset.netWorth = data.rows.item(i).NET_WORTH;
                            asset.workerNumber = data.rows.item(i).WORKER_NUMBER;
                            asset.custodian = data.rows.item(i).CUSTODIAN;
                            asset.installLocation = data.rows.item(i).INSTALL_LOCATION;
                            asset.remark = data.rows.item(i).REMARK;
                            asset.twoDimensionCode = data.rows.item(i).TWO_DIMENSION_CODE;
                            asset.rfid = data.rows.item(i).RFID;
                            asset.recordFlag = data.rows.item(i).RECORD_FLAG;
                            asset.isChecked = data.rows.item(i).IS_CHECKED;
                            asset.isTrans = data.rows.item(i).IS_TRANS;
                            asset.selfNumber = data.rows.item(i).SELF_NUMBER;
                            asset.assetCode = data.rows.item(i).ASSET_CODE;
                            asset.originalValue = data.rows.item(i).ORIGINAL_VALUE;
                            asset.singleQuantity = data.rows.item(i).SINGLE_QUANTITY;
                            asset.complexQuantity = data.rows.item(i).COMPLEX_QUANTITY;
                            asset.certificateNumber = data.rows.item(i).CERTIFICATE_NUMBER;
                            asset.securityState = data.rows.item(i).SECURITY_STATE;
                            asset.changeCustodian = data.rows.item(i).CHANGE_CUSTODIAN;
                            asset.changeWorkerNumber = data.rows.item(i).CHANGE_WORKER_NUMBER;
                            asset.manufacturer = data.rows.item(i).MANUFACTURER;
                            asset.serialNumber = data.rows.item(i).SERIAL_NUMBER;
                            asset.fundChannel = data.rows.item(i).FUND_CHANNEL;
                            assets.push(asset);
                        }
                    }
                    resolve(assets);
                }).catch((error) => {
                    reject("数据库操作：\n查询固定资产台账表失败\n"+error.message);
                });
        })
    }

    /**
     * 从资产盘点记录中获取所有资产信息
     */
    queryAssetsFromInv(preWorkerNumber: string, isSignatured: string) {
        return new Promise<Array<InvAsset>>((resolve, reject) => {
            this.database.executeSql("select * from inv_asset_record where PRE_WORKER_NUMBER=? AND IS_SIGNATURED=?", [preWorkerNumber, isSignatured])
                .then((data) => {
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
                    resolve(assets);
                }).catch((error) => {
                    reject("数据库操作：\n查询盘点记录表失败\n"+error.message);
                });
        })
    }


    /**
     * 根据账号密码获得员工信息
     * @param userName 
     * @param password 
     */
    queryUserInfoByNameAndPWD(userName: string, password: string) {
        return new Promise<User>((resolve, reject) => {
            this.database.executeSql(`select info.* 
                                    from sys_login_account login,sys_person_info info
                                    where login.LOGIN_NAME=? AND login.LOGIN_PWD=? AND login.USER_ID=info.USER_ID `, [userName, password])
                .then((data) => {
                    var user: User = this._getUserInfoFromDBResult(data);
                    resolve(user);
                }, (error) => {
                    reject("数据库操作：\n查询用户信息表失败\n"+error.message);
                })
        })
    }

    /**
    * 根据员工ID查找数据库中是否存在该员工账号信息
    * @param UserId 员工ID
    */
    queryFromAccountByUserId(UserId: string) {

        return new Promise<UserAccount>((resolve, reject) => {
            if (UserId == "" || UserId == null) {
                resolve(null);
                return;
            }
            if (this.database == null || this.database == undefined) {
                this.openDB();
            }
            this.database.executeSql('select * from sys_login_account where USER_ID=?', [UserId])
                .then((data) => {
                    var userAccount: UserAccount = this._getAccountFromDBResult(data);
                    resolve(userAccount);
                }, (error) => {
                    reject("数据库操作：\n查询账户表失败\n"+error.message);
                })
        })
    }


    /**
     * 根据账号密码获得账户信息
     * @param userName 
     * @param password 
     */
    queryFromAccountByNameAndPWD(userName: string, password: string) {
        return new Promise<UserAccount>((resolve, reject) => {
            this.database.executeSql('select * from sys_login_account where LOGIN_NAME=? and LOGIN_PWD=?', [userName, password])
                .then((data) => {
                    var userAccount: UserAccount = this._getAccountFromDBResult(data);
                    resolve(userAccount);
                }, (error) => {
                    reject("数据库操作：\n查询账户表失败\n"+error.message);
                })
        })
    }

    /**
     * 根据组织ID获取组织信息
     * @param orgId 
     */
    queryFromOrgInfoByOrgId(orgId: string) {
        return new Promise<OrgInfo>((resolve, reject) => {
            this.database.executeSql('select * from sys_org_info where ORG_ID=?', [orgId])
                .then((data) => {
                    var orgInfo: OrgInfo = this._getOrgInfoFromDBResult(data);
                    resolve(orgInfo);
                }, (error) => {
                    reject("数据库操作：\n查询组织机构表失败\n"+error.message);
                })
        })
    }

    /**
     * 根据组织ID获取组织信息
     * @param orgCode 
     */
    queryFromOrgInfoByOrgCode(orgCode: string) {
        return new Promise<OrgInfo>((resolve, reject) => {
            this.database.executeSql('select * from sys_org_info where ORG_CODE=?', [orgCode])
                .then((data) => {
                    var orgInfo: OrgInfo = this._getOrgInfoFromDBResult(data);
                    resolve(orgInfo);
                }, (error) => {
                    reject("数据库操作：\n查询组织机构表失败\n"+error.message);
                })
        })
    }


    /**
      * 根据通知ID获取盘点通知
      * @param noticeId 
      */
    queryFromInvNoticeByNoticeId(noticeId: string) {
        return new Promise<InvNotice>((resolve, reject) => {
            this.database.executeSql('select * from inv_notice where NOTICE_ID=?', [noticeId])
                .then((data) => {
                    var invNotice: InvNotice = this._getInvNoticeFromDBResult(data);
                    resolve(invNotice);
                }, (error) => {
                    reject("数据库操作：\n查询盘点通知表失败\n"+error.message);
                })
        })
    }

    
    

    /**
      * 根据所属单位获取盘点通知
      * @param leadingOrg 
      */
    queryFromInvNoticeByLeadingOrg(leadingOrg: string) {
        return new Promise<InvNotice>((resolve, reject) => {
            this.database.executeSql('select * from inv_notice where LEADING_ORG=?', [leadingOrg])
                .then((data) => {
                    var invNotice: InvNotice = this._getInvNoticeFromDBResult(data);
                    resolve(invNotice);
                }, (error) => {
                    reject("数据库操作：\n查询盘点通知表失败\n"+error.message);
                })
        })
    }



    /**
      * 获取所有的日志表信息  
      * @param assetId 
      */
    queryListFromChangeRecord(workerNumber: string) {
        return new Promise<Array<ChangeRecord>>((resolve, reject) => {
            this.database.executeSql('select * from asset_change_record where CHANGE_PERSON=?', [workerNumber])
                .then((data) => {
                    var changeRecords: Array<ChangeRecord> = this._getChangeRecordsFromDBResult(data);
                    resolve(changeRecords);
                }, (error) => {
                    reject("数据库操作：\n查询日志表失败\n"+error.message);
                })
        })
    }

    /**
      * 获取所有的日志表信息  
      * @param changeType 
      */
      queryListFromChangeRecordByChangeType(changeType: string) {
        return new Promise<Array<ChangeRecord>>((resolve, reject) => {
            this.database.executeSql('select * from asset_change_record where CHANGE_TYPE=?', [changeType])
                .then((data) => {
                    var changeRecords: Array<ChangeRecord> = this._getChangeRecordsFromDBResult(data);
                    resolve(changeRecords);
                }, (error) => {
                    reject("数据库操作：\n查询日志表失败\n"+error.message);
                })
        })
    }

    /**
      * 根据资产ID获取日志表信息
      * @param assetId 
      */
    queryFromChangeRecordByAssetId(assetId: string) {
        return new Promise<ChangeRecord>((resolve, reject) => {
            this.database.executeSql('select * from asset_change_record where ASSET_ID=?', [assetId])
                .then((data) => {
                    var changeRecord: ChangeRecord = this._getChangeRecordFromDBResult(data);
                    resolve(changeRecord);
                }, (error) => {
                    reject("数据库操作：\n查询日志表失败\n"+error.message);
                })
        })
    }


    queryFromFixedByRFID(rfid: string) {
        return new Promise<FixedAsset>((resolve, reject) => {
            this.database.executeSql("select * from asset_account_fixed where RFID=?", [rfid])
                .then((data) => {
                    var asset = this._getFixedAssetFromDBResult(data);
                    resolve(asset);
                }).catch((error) => {
                    reject("数据库操作：\n查询固定资产台账表失败\n"+error.message);
                });
        });
    }

    /**
     * 根据员工ID获得获得账户信息
     * @param userId
     */
    queryFromUserInfoByUserId(userId: string) {
        return new Promise<User>((resolve, reject) => {
            this.database.executeSql('select * from sys_person_info where USER_ID=?', [userId])
                .then((data) => {
                    var userAccount: User = this._getUserInfoFromDBResult(data);
                    resolve(userAccount);
                }, (error) => {
                    reject("数据库操作：\n查询账户信息表失败\n"+error.message);
                })
        })
    }

    /**
     * 根据资产ID从固定资产台账中获取资产信息
     * @param id 
     */
    queryFromFixedById(id: string) {
        return new Promise<FixedAsset>((resolve, reject) => {
            this.database.executeSql('select * from asset_account_fixed where ASSET_ID=?', [id])
                .then((data) => {
                    var asset: FixedAsset = this._getFixedAssetFromDBResult(data);
                    resolve(asset);
                }, (error) => {
                    reject("数据库操作：\n查询固定资产台账表失败\n"+error.message);
                })
        })
    }

    /** 
     * 根据二维码从固定资产台账中查询资产信息
     * @param code 
     */
    queryFromFixedByCode(code: string) {
        return new Promise<FixedAsset>((resolve, reject) => {
            this.database.executeSql("select * from asset_account_fixed where TWO_DIMENSION_CODE=?", [code])
                .then((data) => {
                    var asset = this._getFixedAssetFromDBResult(data);
                    resolve(asset);
                }).catch((error) => {
                    reject("数据库操作：\n查询固定资产台账表失败\n"+error.message);
                });
        });
    }

    /**
     * 根据资产ID和二维码从固定资产台账中获取资产信息
     * @param id 
     * @param code 
     */
    queryFromFixedByIdAndCode(id: string, code: string) {
        return new Promise<FixedAsset>((resolve, reject) => {
            this.database.executeSql('select * from asset_account_fixed where ASSET_ID=? and TWO_DIMENSION_CODE=?', [id, code])
                .then((data) => {
                    var asset: FixedAsset = this._getFixedAssetFromDBResult(data);
                    resolve(asset);
                }, (error) => {
                    reject("数据库操作：\n查询固定资产台账表失败\n"+error.message);
                })
        })
    }

    /**
     * 根据员工编号获取用户信息
     * @param workerNumber 
     */
    queryFromUserSimpleByWorkerNumber(workerNumber: string) {
        return new Promise<String>((resolve, reject) => {
            this.database.executeSql('select USER_NAME from sys_person_info_simple where WORKER_NUMBER=?', [workerNumber])
                .then((data) => {
                    var userName: string = "";
                    if (data.rows.length > 0) {
                        userName = data.rows.item(0).USER_NAME;
                    }
                    resolve(userName);
                }, (error) => {
                    reject("数据库操作：\n查询简单用户表失败\n"+error.message);
                })
        })
    }

    /**
     * 分页查询组织机构表
     * @param pageSize 
     * @param pageIndex  页号，从1开始 
     */
    queryListFromOrgInfo(pageSize: number, pageIndex: number) {
        return new Promise<Array<OrgInfo>>((resolve, reject) => {
            let sql: string = "";
            let params: any = [];
            if (pageSize == 0 && pageIndex == 0) {
                //都为0时默认查询所有数据
                sql = 'select * from sys_org_info';
                params = [];
            } else {
                var index = pageSize * (pageIndex - 1);
                sql = 'select * from sys_org_info limit ? offset ?';
                params = [pageSize, index];
            }
            this.database.executeSql(sql, params)
                .then((data) => {
                    var orgInfoes: Array<OrgInfo> = null;
                    if (data.rows.length > 0) {
                        orgInfoes = new Array<OrgInfo>();
                        for (var i = 0; i < data.rows.length; i++) {
                            var orgInfo: OrgInfo = new OrgInfo();
                            orgInfo.orgId = data.rows.item(i).ORG_ID;
                            orgInfo.orgFullName = data.rows.item(i).ORG_FULL_NAME;
                            orgInfo.orgCode = data.rows.item(i).ORG_CODE;
                            orgInfo.orgName = data.rows.item(i).ORG_NAME;
                            orgInfo.parentOrgId = data.rows.item(i).PARENT_ORG_ID;
                            orgInfo.recordFlag = data.rows.item(i).RECORD_FLAG;
                            orgInfoes.push(orgInfo);
                        }
                    }
                    resolve(orgInfoes);
                }, (error) => {
                    reject("数据库操作：\n查询组织结构表失败\n"+error.message);
                })
        })
    }

    /**
     * 分页查询员工精简表
     * @param pageSize 
     * @param pageIndex  页号，从1开始 
     */
    queryListFromUserSimple(pageSize: number, pageIndex: number) {
        return new Promise<Array<UserSimple>>((resolve, reject) => {
            let sql: string = "";
            let params: any = [];
            if (pageSize == 0 && pageIndex == 0) {
                //都为0时默认查询所有数据
                sql = 'select * from sys_person_info_simple';
                params = [];
            } else {
                var index = pageSize * (pageIndex - 1);
                sql = 'select * from sys_person_info_simple limit ? offset ?';
                params = [pageSize, index];
            }
            this.database.executeSql(sql, params)
                .then((data) => {
                    var userSimples: Array<UserSimple> = null;
                    if (data.rows.length > 0) {
                        userSimples = new Array<UserSimple>();
                        for (var i = 0; i < data.rows.length; i++) {
                            var userSimple: UserSimple = new UserSimple();
                            userSimple.userName = data.rows.item(i).USER_NAME;
                            userSimple.workerNumber = data.rows.item(i).WORKER_NUMBER;
                            userSimple.workInOrg=data.rows.item(i).WORK_IN_ORG;
                            userSimples.push(userSimple);
                        }
                    }
                    resolve(userSimples);
                }, (error) => {
                    reject("数据库操作：\n查询员工精简表失败\n"+error.message);
                })
        })
    }

        /**
     * 通过编号查询员工精简表
     */
    queryFromUserSimpleByUserId(userId: string) {
        return new Promise<UserSimple>((resolve, reject) => {
            this.database.executeSql("select * from sys_person_info_simple where USER_ID=?", [userId])
                .then((data) => {
                    var userSimple: UserSimple = null;
                    if (data.rows.length > 0) {
                        userSimple = new UserSimple();
                        userSimple.userName = data.rows.item(0).USER_NAME;
                        userSimple.workerNumber = data.rows.item(0).WORKER_NUMBER;
                        userSimple.workInOrg = data.rows.item(0).WORK_IN_ORG;
                        userSimple.userId = data.rows.item(0).USER_ID;
                    }
                    resolve(userSimple);
                }, (error) => {
                    reject("数据库操作：\n查询员工精简表失败\n" + error.message);
                })
        })
    }

    /**
     * 根据资产ID和通知ID从资产盘点记录中查询资产信息
     * @param id 
     */
    queryFromInvByIdAndNotice(id: string, noticeId: string) {
        return new Promise<InvAsset>((resolve, reject) => {
            this.database.executeSql("select * from inv_asset_record where ASSET_ID=? and NOTICE_ID=?", [id, noticeId])
                .then((data) => {
                    var asset = this._getInvAssetFromDBResult(data);
                    resolve(asset);
                }).catch((error) => {
                    reject("数据库操作：\n查询资产信息失败\n"+error.message);
                });
        })
    }

    /////////////非安转产///////////////////
    /**
      * 根据员工编号获取非安设备转产通知单
      * @param noticeId 
      */
      queryFromCvtNonNoticeByWorkerNumber(workerNumber: string) {
        if(this.database==null){
            this.openDB();
        }
        return new Promise<CvtNonNotice>((resolve, reject) => {
            this.database.executeSql('select * from cvt_noninstall_notice where RECIPIENT=?', [workerNumber])
                .then((data) => {
                    var notice: CvtNonNotice = this._getCvtNonNoticeFromDBResult(data);
                    resolve(notice);
                }, (error) => {
                    reject("数据库操作：\n查询非安设备通知表失败\n"+error.message);
                })
        })
    }

     /**
      * 根据员工编号获取非安设备转产通知附加表
      * @param noticeId 
      */
      queryFromCvtNonNoticeSubByNoticeId(noticeId: string) {
        return new Promise<Array<CvtNonNoticeSub>>((resolve, reject) => {
            this.database.executeSql('select * from cvt_noninstall_notice_sub where NOTICE_ID=?', [noticeId])
                .then((data) => {
                    var notice = this._getCvtNonNoticeSubsFromDBResult(data);
                    resolve(notice);
                }, (error) => {
                    reject("数据库操作：\n查询非安设备通知表失败\n"+error.message);
                })
        })
    }
    /**
      * 获取领用表资产信息
      */
    queryFromCvtNonReceive(noticeId: string) {
        return new Promise<Array<CvtNonReceive>>((resolve, reject) => {
            this.database.executeSql('select * from cvt_noninstall_receive where NOTICE_ID=?', [noticeId])
                .then((data) => {
                    var notice = this._getCvtNonReceivesFromDBResult(data);
                    resolve(notice);
                }, (error) => {
                    reject("数据库操作：\n查询非安转产领用表失败\n" + error.message);
                })
        })
    }
    /**
      * 获取领用表资产信息
      */
      queryFromCvtNonCheck(investplanId: string) {
        return new Promise<Array<CvtNonCheck>>((resolve, reject) => {
            this.database.executeSql('select * from cvt_noninstall_check where INVESTPLAN_ID=?', [investplanId])
                .then((data) => {
                    var checks = this._getCvtNonChecksFromDBResult(data);
                    resolve(checks);
                }, (error) => {
                    reject("数据库操作：\n查询非安转产领用表失败\n" + error.message);
                })
        })
    }

/////////////非安转产END///////////////////
    /**
     * 从数据库查询结果中返回FixedAsset的值
     * @param data 
     */
    private _getFixedAssetFromDBResult(data): FixedAsset {
        var asset: FixedAsset = null;
        if (data.rows.length > 0) {
            asset = new FixedAsset();
            asset.assetId = data.rows.item(0).ASSET_ID;
            asset.assetName = data.rows.item(0).ASSET_NAME;
            asset.assetType = data.rows.item(0).ASSET_TYPE;
            asset.assetCategory = data.rows.item(0).ASSET_CATEGORY;
            asset.assetClass = data.rows.item(0).ASSET_CLASS;
            asset.specModel = data.rows.item(0).SPEC_MODEL;
            asset.licenseplatWellno = data.rows.item(0).LICENSEPLAT_WELLNO;
            asset.workForOrg = data.rows.item(0).WORK_FOR_ORG;
            asset.workInOrg = data.rows.item(0).WORK_IN_ORG;
            asset.subordinateBlock = data.rows.item(0).SUBORDINATE_BLOCK;
            asset.techStatus = data.rows.item(0).TECH_STATUS;
            asset.useState = data.rows.item(0).USE_STATE;
            asset.manufactureDate = this.formatDate(new Date(data.rows.item(0).MANUFACTURE_DATE));
            asset.productionTime = this.formatDate(new Date(data.rows.item(0).PRODUCTION_TIME));
            asset.increaseDate = this.formatDate(new Date(data.rows.item(0).INCREASE_DATE));
            asset.increaseReason = data.rows.item(0).INCREASE_REASON;
            asset.unit = data.rows.item(0).UNIT;
            asset.quantity = data.rows.item(0).QUANTITY;
            asset.yardStatus = data.rows.item(0).YARD_STATUS;
            asset.assetGroup = data.rows.item(0).ASSET_GROUP;
            asset.remainingLife = data.rows.item(0).REMAINING_LIFE;
            asset.netWorth = data.rows.item(0).NET_WORTH;
            asset.workerNumber = data.rows.item(0).WORKER_NUMBER;
            asset.custodian = data.rows.item(0).CUSTODIAN;
            asset.installLocation = data.rows.item(0).INSTALL_LOCATION;
            asset.remark = data.rows.item(0).REMARK;
            asset.twoDimensionCode = data.rows.item(0).TWO_DIMENSION_CODE;
            asset.rfid = data.rows.item(0).RFID;
            asset.recordFlag = data.rows.item(0).RECORD_FLAG;
            asset.isChecked = data.rows.item(0).IS_CHECKED;
            asset.isTrans = data.rows.item(0).IS_TRANS;
            asset.selfNumber = data.rows.item(0).SELF_NUMBER;
            asset.assetCode = data.rows.item(0).ASSET_CODE;
            asset.originalValue = data.rows.item(0).ORIGINAL_VALUE;
            asset.singleQuantity = data.rows.item(0).SINGLE_QUANTITY;
            asset.complexQuantity = data.rows.item(0).COMPLEX_QUANTITY;
            asset.certificateNumber = data.rows.item(0).CERTIFICATE_NUMBER;
            asset.securityState = data.rows.item(0).SECURITY_STATE;
            asset.changeCustodian = data.rows.item(0).CHANGE_CUSTODIAN;
            asset.changeWorkerNumber = data.rows.item(0).CHANGE_WORKER_NUMBER;
            asset.manufacturer = data.rows.item(0).MANUFACTURER;
            asset.serialNumber = data.rows.item(0).SERIAL_NUMBER;
            asset.fundChannel = data.rows.item(0).FUND_CHANNEL;
        }
        return asset;
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
    
    /**
     * 从数据库查询结果中返回Array<ChangeRecord>的值
     * @param data 
     */
    private _getChangeRecordsFromDBResult(data): Array<ChangeRecord> {
        var changeRecords: Array<ChangeRecord> = null;
        if (data.rows.length > 0) {
            changeRecords = new Array<ChangeRecord>();
            for (var i = 0; i < data.rows.length; i++) {
                var changeRecord = new ChangeRecord();
                changeRecord.assetId = data.rows.item(i).ASSET_ID;
                changeRecord.changeType = data.rows.item(i).CHANGE_TYPE;
                changeRecord.changeDetail = data.rows.item(i).CHANGE_DETAIL;
                changeRecord.dutyOrg = data.rows.item(i).DUTY_ORG;
                changeRecord.changePerson = data.rows.item(i).CHANGE_PERSON;
                changeRecord.changeTime = data.rows.item(i).CHANGE_TIME;
                changeRecords.push(changeRecord);
            }
        }
        return changeRecords;
    }

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
     * 从数据库查询结果中返回CvtNonNoticeSub的值
     * @param data 
     */
    private _getCvtNonNoticeSubsFromDBResult(data): Array<CvtNonNoticeSub> {
        var cvtNonNoticeSubs: Array<CvtNonNoticeSub> = null;
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
                cvtNonNoticeSub.sentQuantity= data.rows.item(i).SENT_QUANTITY;
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
    private _getCvtNonReceivesFromDBResult(data): Array<CvtNonReceive> {
        var cvtNonReceives: Array<CvtNonReceive> = null;
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
                cvtNonReceive.reveiveStyle= data.rows.item(i).RECEIVE_STYLE;
                cvtNonReceive.recordFlag = data.rows.item(i).RECORD_FLAG;
                cvtNonReceive.receiveName = data.rows.item(i).RECEIVE_NAME;
                cvtNonReceive.signaturePath=data.rows.item(i).SIGNATURE_PATH;
                cvtNonReceive.signatureName=data.rows.item(i).SIGNATURE_NAME;
                cvtNonReceives.push(cvtNonReceive);
            }
        }
        return cvtNonReceives;
    }

    /**
     * 从数据库查询结果中返回Array<CvtNonReceive>的值
     * @param data 
     */
    private _getCvtNonChecksFromDBResult(data): Array<CvtNonCheck> {
        var cvtNonChecks: Array<CvtNonCheck> = null;
        if (data.rows.length > 0) {
            cvtNonChecks = new Array<CvtNonCheck>();
            for (var i = 0; i < data.rows.length; i++) {
                var cvtNonCheck = new CvtNonCheck();
                cvtNonCheck.checkId = data.rows.item(i).CHECK_ID ;
                cvtNonCheck.investplanId = data.rows.item(i).INVESTPLAN_ID ;
                cvtNonCheck.receiveId = data.rows.item(i).RECEIVE_ID ;
                cvtNonCheck.checkBillNum = data.rows.item(i).CHECK_BILL_NUM;
                cvtNonCheck.checkOrg = data.rows.item(i).CHECK_ORG ;
                cvtNonCheck.checkDate = data.rows.item(i).CHECK_DATE ;
                cvtNonCheck.checkPerson = data.rows.item(i).CHECK_PERSON ;
                cvtNonCheck.checkLeader = data.rows.item(i).CHECK_LEADER ;
                cvtNonCheck.checkOpinion = data.rows.item(i).CHECK_OPINION ;
                cvtNonCheck.checkState= data.rows.item(i).CHECK_STATE ;
                cvtNonCheck.assetId = data.rows.item(i).ASSET_ID ;
                cvtNonCheck.fundChannel = data.rows.item(i).FUND_CHANNEL ;
                cvtNonCheck.assetCode = data.rows.item(i).ASSET_CODE ;
                cvtNonCheck.assetName= data.rows.item(i).ASSET_NAME ;
                cvtNonCheck.specModel = data.rows.item(i).SPEC_MODEL ;
                cvtNonCheck.selfNumber = data.rows.item(i).SELF_NUMBER ;
                cvtNonCheck.manufacturer = data.rows.item(i).MANUFACTURER ;
                cvtNonCheck.manufactureDate= data.rows.item(i).MANUFACTURE_DATE ;
                cvtNonCheck.workInOrg = data.rows.item(i).WORK_IN_ORG ;
                cvtNonCheck.serialNumber = data.rows.item(i).SERIAL_NUMBER ;
                cvtNonCheck.unit=data.rows.item(i).UNIT ;
                cvtNonCheck.quantity=data.rows.item(i).QUANTITY ;
                cvtNonCheck.originalValue = data.rows.item(i).ORIGINAL_VALUE ;
                cvtNonCheck.isReadyForUse=data.rows.item(i).IS_READY_FOR_USE ;
                cvtNonCheck.componentToolDesc=data.rows.item(i).COMPONENT_TOOL_DESC ;
                cvtNonCheck.technicalData = data.rows.item(i).TECHNICAL_DATA ;
                cvtNonCheck.recordFlag=data.rows.item(i).RECORD_FLAG ;
                cvtNonChecks.push(cvtNonCheck);
            }
        }
        return cvtNonChecks;
    }


    /**
     * 从数据库查询结果中返回UserAccount的值
     * @param data 
     */
    private _getAccountFromDBResult(data): UserAccount {
        var userAccount: UserAccount = null;
        if (data.rows.length > 0) {
            userAccount = new UserAccount();
            userAccount.userId = data.rows.item(0).USER_ID;
            userAccount.loginName = data.rows.item(0).LOGIN_NAME;
            userAccount.loginPWD = data.rows.item(0).LOGIN_PWD;
            userAccount.acctStatus = data.rows.item(0).ACCT_STATUS;
            userAccount.workerNumber = data.rows.item(0).WORKER_NUMBER;
        }
        return userAccount;
    }

    /**
    * 从数据库查询结果中返回ChangeRecord的值
    * @param data 
    */
    private _getChangeRecordFromDBResult(data): ChangeRecord {
        var changeRecord: ChangeRecord = null;
        if (data.rows.length > 0) {
            changeRecord = new ChangeRecord();
            changeRecord.assetId = data.rows.item(0).ASSET_ID;
            changeRecord.changeType = data.rows.item(0).CHANGE_TYPE;
            changeRecord.changeDetail = data.rows.item(0).CHANGE_DETAIL;
            changeRecord.dutyOrg = data.rows.item(0).DUTY_ORG;
            changeRecord.changePerson = data.rows.item(0).CHANGE_PERSON;
            changeRecord.changeTime = data.rows.item(0).CHANGE_TIME;
        }
        return changeRecord;
    }


    /**
    * 从数据库查询结果中返回OrgInfo的值
    * @param data 
    */
    private _getOrgInfoFromDBResult(data): OrgInfo {
        var orgInfo: OrgInfo = null;
        if (data.rows.length > 0) {
            orgInfo = new OrgInfo();
            orgInfo.orgId = data.rows.item(0).ORG_ID;
            orgInfo.orgFullName = data.rows.item(0).ORG_FULL_NAME;
            orgInfo.orgCode = data.rows.item(0).ORG_CODE;
            orgInfo.orgName = data.rows.item(0).ORG_NAME;
            orgInfo.parentOrgId = data.rows.item(0).PARENT_ORG_ID;
            orgInfo.recordFlag = data.rows.item(0).RECORD_FLAG;
        }
        return orgInfo;
    }

    /**
     * 从数据库查询结果中返回UserInfo的值
     * @param data 
     */
    private _getUserInfoFromDBResult(data): User {
        var user: User = null;
        if (data.rows.length > 0) {
            user = new User();
            user.userId = data.rows.item(0).USER_ID;
            user.userName = data.rows.item(0).USER_NAME;
            user.gender = data.rows.item(0).GENDER;
            user.age = data.rows.item(0).AGE;
            user.workerNumber = data.rows.item(0).WORKER_NUMBER;
            user.workForOrg = data.rows.item(0).WORK_FOR_ORG;
            user.wFOAddress = data.rows.item(0).WFO_ADDRESS;
            user.workInOrg = data.rows.item(0).WORK_IN_ORG;
            user.wIOAddress = data.rows.item(0).WIO_ADDRESS;
            user.telePhone = data.rows.item(0).TELE_PHONE;
            user.callPhone = data.rows.item(0).CALL_PHONE;
            user.eMail = data.rows.item(0).E_MAIL;
            user.nationatily = data.rows.item(0).NATIONALITY;
            user.nativePlace = data.rows.item(0).NATIVE_PLACE;
            user.education = data.rows.item(0).EDUCATION;
            user.profession = data.rows.item(0).PROFESSION;
            user.job = data.rows.item(0).JOB;
            user.presentAddress = data.rows.item(0).PRESENT_ADDRESS;
            user.remark = data.rows.item(0).REMARK;
        }
        return user;
    }
    ///////////////查询操作END///////////////////////


    ///////////////更改操作///////////////////////

    /**
     * 更新资产盘点记录信息
     * @param asset 
     */
    updateToInv(asset: InvAsset) {
        return new Promise((resolve, reject) => {
            this.database.executeSql(`update inv_asset_record 
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
                    reject("数据库操作：\n更新盘点记录信息表失败\n"+error.message);
                })
        })
    }
    /**
     * 更新固定资产台账信息表
     * @param asset 
     */
    updateToFixed(asset: FixedAsset) {
        return new Promise((resolve, reject) => {
            this.database.executeSql("update asset_account_fixed set TECH_STATUS=?,USE_STATE=?,QUANTITY=?,INSTALL_LOCATION=?,TWO_DIMENSION_CODE=?,IS_CHECKED=?,IS_TRANS=?,SECURITY_STATE=?,RFID=?,CUSTODIAN=?,WORKER_NUMBER=?,CHANGE_CUSTODIAN=?,CHANGE_WORKER_NUMBER=? where ASSET_ID=?", [asset.techStatus, asset.useState, asset.quantity, asset.installLocation, asset.twoDimensionCode, asset.isChecked, asset.isTrans, asset.securityState, asset.rfid, asset.custodian, asset.workerNumber, asset.changeCustodian, asset.changeWorkerNumber, asset.assetId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n更新资产台账表失败\n"+error.message);
                })
        })

    }

    /**
     * 根据员工编号更新账户信息
     * @param userAccount 员工账户
     */
    updateToAccount(userAccount: UserAccount) {
        return new Promise((resolve, reject) => {
            this.database.executeSql("update sys_login_account set LOGIN_NAME=?,LOGIN_PWD=?,ACCT_STATUS=? ,WORKER_NUMBER=? where USER_ID=?", [userAccount.loginName, userAccount.loginPWD, userAccount.acctStatus, userAccount.workerNumber, userAccount.userId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n更新账户表失败\n"+error.message);
                })
        })
    }

    /**
     * 根据资产ID更新日志
     * @param changeRecord 
     */
    updateToChangeRecord(changeRecord: ChangeRecord) {
        return new Promise((resolve, reject) => {
            this.database.executeSql("update asset_change_record set CHANGE_DETAIL=?,DUTY_ORG=?,CHANGE_PERSON=? ,CHANGE_TIME=?,STATE=? where ASSET_ID=?", [changeRecord.changeDetail, changeRecord.dutyOrg, changeRecord.changePerson, changeRecord.changeTime, changeRecord.state, changeRecord.assetId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n更新日志表失败\n"+error.message);
                })
        })
    }

    /**
     * 根据通知ID更新通知单
     * @param changeRecord 
     */
    updateToInvNotice(invNotice: InvNotice) {
        return new Promise((resolve, reject) => {
            this.database.executeSql("update inv_notice set NOTICE_ID=?,TITLE=?,CONTENT=? ,INITIATOR=?,TIME_START=?,TIME_FINISH=?,STATE=? where LEADING_ORG=?",
                [invNotice.noticeId, invNotice.title, invNotice.content, invNotice.initiator, invNotice.timeStart, invNotice.timeFinish, invNotice.state, invNotice.leadingOrg])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n更新盘点通知表失败\n" + error.message);
                })
        })
    }

    /**
     * 根据通知ID更新通知单
     * @param changeRecord 
     */
    updateToCvtNonNotice(cvtNonNotice: CvtNonNotice) {
        return new Promise((resolve, reject) => {
            this.database.executeSql("update cvt_noninstall_notice set NOTICE_ID=?,INVESTPLAN_ID=?,ORG_NAME=? ,WORK_ORDER_NUMBER=?, STOREROOM_KEEPER=?,NOTICE_STATE=?,RECORD_FLAG=? where RECIPIENT=?",
                [cvtNonNotice.noticeId,cvtNonNotice.investplanId,cvtNonNotice.orgName,cvtNonNotice.workOrderNumber,cvtNonNotice.storeroomKeeper,cvtNonNotice.noticeState,cvtNonNotice.recordFlag,cvtNonNotice.recipient])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n更新非安设备转产通知单失败\n"+error.message);
                })
        })
    }
    
    /**
     * 根据通知ID更新领用单
     * @param changeRecord 
     */
    updateToCvtNonReceive(cvtNonReceive: CvtNonReceive) {
        return new Promise((resolve, reject) => {
            this.database.executeSql("update cvt_noninstall_receive set RECEIVE_ORG=?,RECEIVE_PERSON=?,RECEIVE_TIME=? ,RECEIVE_STYLE=?,RECORD_FLAG=?,RECEIVE_NAME=?,SIGNATURE_PATH=?,SIGNATURE_NAME=? where RECEIVE_ID=?",
                [cvtNonReceive.receiveOrg,cvtNonReceive.receivePerson,cvtNonReceive.receiveTime,cvtNonReceive.reveiveStyle,cvtNonReceive.recordFlag,cvtNonReceive.receiveName,cvtNonReceive.signaturePath,cvtNonReceive.signatureName,cvtNonReceive.receiveId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n更新非安设备转产领用单失败\n"+error.message);
                })
        })
    }

    /**
     * 根据通知ID更新领用单
     * @param cvtNonCheck  map 
     */
    updateToCvtNonCheck(cvtNonCheck) {
        return new Promise((resolve, reject) => {
            this.database.executeSql("update cvt_noninstall_check set CHECK_BILL_NUM=?,CHECK_ORG=?,CHECK_DATE=? ,CHECK_PERSON=?,CHECK_STATE=?,RECORD_FLAG=? where ASSET_ID=?",
                [cvtNonCheck.checkBillNum,cvtNonCheck.checkOrg,cvtNonCheck.checkDate,cvtNonCheck.checkPerson,cvtNonCheck.checkState,cvtNonCheck.recordFlag,cvtNonCheck.assetId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n更新非安设备转产领用单失败\n"+error.message);
                })
        })
    }

    /**
     * 更新数据到用户信息表中
     * @param user 
     */
    updateToUserInfo(user: User) {
        return new Promise((resolve, reject) => {
            this.database.executeSql("update sys_person_info set USER_NAME=?,GENDER=?,AGE=?,WORK_FOR_ORG=?,WFO_ADDRESS=?, WORK_IN_ORG=?,WIO_ADDRESS=?,TELE_PHONE=?,CALL_PHONE=?,E_MAIL=?, NATIONALITY=?,NATIVE_PLACE=?,EDUCATION=?,PROFESSION=?,JOB=?,PRESENT_ADDRESS=?,REMARK=?,WORKER_NUMBER=? where USER_ID=?", [user.userName, user.gender, user.age, user.workForOrg, user.wFOAddress, user.workInOrg, user.telePhone, user.callPhone, user.eMail, user.nationatily, user.nativePlace, user.education, user.profession, user.job, user.presentAddress, user.remark, user.workerNumber, user.userId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n更新用户信息表失败\n"+error.message);
                })
        })
    }

    /**
     * 更新数据到组织结构表中
     * @param orgInfo 
     */
    updateToOrgInfo(orgInfo: OrgInfo) {
        return new Promise((resolve, reject) => {
            this.database.executeSql("update sys_org_info set ORG_FULL_NAME=?,ORG_CODE=?,ORG_NAME=?,PARENT_ORG_ID=?, RECORD_FLAG=? where ORG_ID=?", [orgInfo.orgFullName, orgInfo.orgCode, orgInfo.orgName, orgInfo.parentOrgId, orgInfo.recordFlag, orgInfo.orgId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n更新组织机构表失败\n"+error.message);
                })
        })
    }
    ///////////////更改操作END///////////////////////

    ///////////////插入操作///////////////////////
    /**
     * 在固定资产台账中插入数据
     * @param asset 
     */
    insertToFixed(asset: FixedAsset) {
        return new Promise((resolve, reject) => {
            this.database.executeSql("insert into asset_account_fixed values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [asset.assetId, asset.assetName, asset.assetType, asset.assetCategory, asset.assetClass, asset.specModel, asset.licenseplatWellno, asset.workForOrg, asset.workInOrg, asset.subordinateBlock,
                asset.productionTime, asset.techStatus, asset.useState, asset.manufactureDate, asset.increaseDate, asset.increaseReason, asset.unit, asset.quantity, asset.yardStatus, asset.assetGroup,
                asset.remainingLife, asset.netWorth, asset.workerNumber, asset.custodian, asset.installLocation, asset.remark, asset.twoDimensionCode, asset.rfid, asset.recordFlag, "0", "0", asset.selfNumber, asset.assetCode, asset.originalValue, asset.singleQuantity, asset.complexQuantity, asset.certificateNumber, asset.securityState, asset.changeCustodian, asset.changeWorkerNumber, asset.manufacturer, asset.serialNumber,asset.fundChannel])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n插入固定资产台账表失败\n"+error.message);
                })
        })

    }


    /**
     * 在资产盘点记录中插入数据
     * @param asset 
     */
    insertToInv(asset: InvAsset) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('insert into inv_asset_record values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [asset.invRecordId, asset.assetId, asset.noticeId, asset.workerNumber, asset.manager, asset.techStatus, asset.useState, asset.installLocation, asset.securityState, asset.securityStateDesc, asset.useOrg, asset.useOrgName, asset.handleScrapMode, asset.handleDate, asset.handleReason, asset.profitLoss, asset.profitLossCause, asset.timeStamp, asset.assetName, asset.assetType, asset.isSignatured, asset.remark, asset.photoPath, asset.signaturePath, asset.signature, asset.preWorkerNumber])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n插入资产盘带你记录表失败\n"+error.message);
                })
        })
    }

    /**
     * 在账户表中插入数据
     * @param userAccount 
     */
    insertToAccount(userAccount: UserAccount) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('insert into sys_login_account values (?,?,?,?,?)', [userAccount.userId, userAccount.loginName, userAccount.loginPWD, userAccount.acctStatus, userAccount.workerNumber])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：\n插入账户表失败\n"+error.message);
                })
        })
    }

    /**
     * 在用户表中插入数据
     * @param user 
     */
    insertToUserInfo(user: User) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('insert into sys_person_info values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [user.userId, user.userName, user.gender, user.age, user.workerNumber, user.workForOrg, user.wFOAddress,
            user.workInOrg, user.wIOAddress, user.telePhone, user.callPhone, user.eMail, user.nationatily, user.nativePlace, user.education, user.profession, user.job, user.presentAddress, user.remark])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：\n插入用户表失败\n"+error.message);
                })
        })
    }

    /**
     * 在组织结构表中插入数据
     * @param orgInfo 
     */
    insertToOrgInfo(orgInfo: OrgInfo) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('insert into sys_org_info values (?,?,?,?,?,?)', [orgInfo.orgId, orgInfo.orgFullName, orgInfo.orgCode, orgInfo.orgName, orgInfo.parentOrgId, orgInfo.recordFlag])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：\n插入组织结构表失败\n"+error.message);
                })
        })
    }

    /**
     * 在员工信息表中插入数据
     * @param userSimple 
     */
    insertToUserSimple(userSimple: UserSimple) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('insert into sys_person_info_simple values (?,?,?,?)', [userSimple.workerNumber, userSimple.userName,userSimple.workInOrg,userSimple.userId])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：\n插入员工信息表失败\n"+error.message);
                })
        })
    }

    /**
     * 在盘点通知表中插入数据
     * @param invNotice 
     */
    insertToInvNotice(invNotice: InvNotice) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('insert into inv_notice values (?,?,?,?,?,?,?,?)', [invNotice.noticeId, invNotice.title, invNotice.content, invNotice.leadingOrg, invNotice.initiator, invNotice.timeStart, invNotice.timeFinish, invNotice.state])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：\n插入盘点通知表失败\n"+error.message);
                })
        })
    }

    /**
     * 在日志表中插入数据
     * @param changeRecord 
     */
    insertToChangeRecord(changeRecord: ChangeRecord) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('insert into asset_change_record values (?,?,?,?,?,?,?)', [changeRecord.assetId, changeRecord.changeType, changeRecord.changeDetail, changeRecord.dutyOrg, changeRecord.changePerson, changeRecord.changeTime, changeRecord.state])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：\n插入日志表失败\n"+error.message);
                })
        })
    }

    /**
     * 在非安资产领用记录表中插入数据
     * @param cvtNonReceive 
     */
    insertToCvtNonReceive(cvtNonReceive: CvtNonReceive) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('insert into cvt_noninstall_receive values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [cvtNonReceive.receiveId, cvtNonReceive.noticeId, cvtNonReceive.assetId, cvtNonReceive.assetCode, cvtNonReceive.assetName, cvtNonReceive.specModel, cvtNonReceive.receiveOrg, cvtNonReceive.receivePerson, cvtNonReceive.receiveTime, cvtNonReceive.reveiveStyle, cvtNonReceive.recordFlag,cvtNonReceive.receiveName,cvtNonReceive.signaturePath,cvtNonReceive.signatureName])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：\n插入非安资产领用记录表失败\n"+error.message);
                })
        })
    }
    
    /**
     * 在非安资产领用验收表中插入数据
     * @param cvtNonCheck 
     */
    insertToCvtNonCheck(cvtNonCheck: CvtNonCheck) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('insert into cvt_noninstall_check values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                               [cvtNonCheck.checkId,cvtNonCheck.investplanId,cvtNonCheck.receiveId,cvtNonCheck.checkBillNum,cvtNonCheck.checkOrg,cvtNonCheck.checkDate,cvtNonCheck.checkPerson,cvtNonCheck.checkLeader,
                                cvtNonCheck.checkOpinion,cvtNonCheck.checkState,cvtNonCheck.assetId,cvtNonCheck.fundChannel,cvtNonCheck.assetCode,cvtNonCheck.assetName,cvtNonCheck.specModel,cvtNonCheck.selfNumber,cvtNonCheck.manufacturer,
                                cvtNonCheck.manufactureDate,cvtNonCheck.workInOrg,cvtNonCheck.serialNumber,cvtNonCheck.unit,cvtNonCheck.quantity,cvtNonCheck.originalValue,cvtNonCheck.isReadyForUse,cvtNonCheck.componentToolDesc,cvtNonCheck.technicalData,cvtNonCheck.recordFlag])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：\n插入非安资产领用验收表失败\n"+error.message);
                })
        })
    }

    /**
     * 在非安资产领用通知表中插入数据
     * @param cvtNonNotice 
     */
    insertToCvtNonNotice(cvtNonNotice: CvtNonNotice) {
        return new Promise((resolve, reject) => {
            if(cvtNonNotice==null){
                resolve();
            }
            this.database.executeSql('insert into cvt_noninstall_notice values (?,?,?,?,?,?,?,?)', 
                               [cvtNonNotice.noticeId,cvtNonNotice.investplanId,cvtNonNotice.orgName,cvtNonNotice.workOrderNumber,cvtNonNotice.recipient,
                            cvtNonNotice.storeroomKeeper,cvtNonNotice.noticeState,cvtNonNotice.recordFlag])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：\n插入非安资产领用通知表失败\n"+error.message);
                })
        })
    }

    /**
     * 在非安资产领用通知附加表中插入数据
     * @param noticeSub 
     */
    insertToCvtNonNoticeSub(noticeSub: CvtNonNoticeSub) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('insert into cvt_noninstall_notice_sub values (?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                               [noticeSub.subNoticeId,noticeSub.noticeId,noticeSub.purchasingId,noticeSub.materialCode,noticeSub.assetName,noticeSub.specModel,noticeSub.unit,
                                noticeSub.sentQuantity,noticeSub.price,noticeSub.amount,noticeSub.storageDate,noticeSub.outDate,noticeSub.recordFlag])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：\n插入非安资产领用通知附加表失败\n"+error.message);
                })
        })
    }
    ///////////////插入操作END///////////////////////

    /**
     * 删除资产盘点记录中的数据
     * @param leadingOrg 
     */
    deleteFromInv(leadingOrg: string) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('select * from sys_person_info where WORK_FOR_ORG=?', [leadingOrg])
                .then((data) => {
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            var workerNumber = data[i].rows.PRE_WORKER_NUMBER
                            this.database.executeSql('delete from inv_asset_record where PRE_WORKER_NUMBER=?', [workerNumber])
                                .then((data) => {
                                    if (workerNumber == data[data.rows.length - 1].rows.PRE_WORKER_NUMBER) {
                                        resolve(data);
                                    }
                                })
                                .catch((error) => {
                                    reject("数据库操作：\n删除资产盘点记录数据失败\n"+error.message);
                                })
                        }
                    }
                })
                .catch((error) => {
                    reject("数据库操作：\n查询员工信息失败\n"+error.message);
                })
        })
    }

    /**
     * 删除资产盘点通知单
     * @param leadingOrg 
     */
    deleteFromInvNotice(leadingOrg: string) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('delete from inv_notice where LEADING_ORG=?', [leadingOrg])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n删除资产盘点通知单失败\n"+error.message);
                })
        })
    }
    /**
     * 根据修改编号删除日志表
     */
    deleteFromChangeRecordByChangeType(changeType:string) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('delete from asset_change_record where CHANGE_Type=?',[changeType])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n删除日志表失败\n"+error.message);
                })
        })
    }

    /**
     * 删除非安设备转产通知单
     */
    deleteFromCvtNonNoticeByNoticeId(noticeId:string) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('delete from cvt_noninstall_notice where NOTICE_ID=?',[noticeId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n删除非安设备转产通知单失败\n"+error.message);
                })
        })
    }
    /**
     * 删除非安设备转产通知单附加表
     */
    deleteFromCvtNonNoticeSubByNoticeId(noticeId:string) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('delete from cvt_noninstall_notice_sub where NOTICE_ID=?',[noticeId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n删除非安设备转产通知单附加表失败\n"+error.message);
                })
        })
    }

    /**
     * 删除非安设备转产领用单
     */
    deleteFromCvtNonReceiveByReceiveId(receiveId:string) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('delete from cvt_noninstall_receive where RECEIVE_ID=?',[receiveId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n删除非安设备转产领用单失败\n"+error.message);
                })
        })
    }

    /**
     * 删除非安转产验收单
     */
    deleteFromCvtNonCheckByCheckId(checkId:string) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('delete from cvt_noninstall_check where CHECK_ID=?',[checkId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n删除非安设备非安转产验收单失败\n"+error.message);
                })
        })
    }

    //////////测试

    /**
     * 删除非安设备转产通知单
     */
    deleteFromCvtNonNotice() {
        return new Promise((resolve, reject) => {
            this.database.executeSql('delete from cvt_noninstall_notice',[])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n删除非安设备转产通知单失败\n"+error.message);
                })
        })
    }
    /**
     * 删除非安设备转产通知单附加表
     */
    deleteFromCvtNonNoticeSub() {
        return new Promise((resolve, reject) => {
            this.database.executeSql('delete from cvt_noninstall_notice_sub',[])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n删除非安设备转产通知单附加表失败\n"+error.message);
                })
        })
    }

    /**
     * 删除非安设备转产领用单
     */
    deleteFromCvtNonReceive() {
        return new Promise((resolve, reject) => {
            this.database.executeSql('delete from cvt_noninstall_receive',[])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n删除非安设备转产领用单失败\n"+error.message);
                })
        })
    }

    /**
     * 删除非安转产验收单
     */
    deleteFromCvtNonCheck() {
        return new Promise((resolve, reject) => {
            this.database.executeSql('delete from cvt_noninstall_check',[])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n删除非安设备非安转产验收单失败\n"+error.message);
                })
        })
    }
    //测试END

    /**
     * 向本地存储写入键值对
     * @param key 
     * @param value 
     */
    setInStorage(key: string, value: string) {
        return new Promise((resolve, reject) => {
            this.storage.set(key, value).then((data) => {
                resolve(data);
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
            this.storage.get(key).then((data) => {
                if (data != null) {
                    resolve(data.toString());
                } else {
                    resolve(null);
                }

            }, (error) => {
                reject(error.message);
            })
        })
    }

    /**
     * 删除本地存储的key键值对
     * @param key 
     */
    removeFromStorage(key: string) {
        return new Promise((resolve, reject) => {
            this.storage.remove(key).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error.message);
            })
        })
    }


    formatDate(date: Date) {
        // 格式化日期，获取今天的日期
        var year: number = date.getFullYear();
        var month: any = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        var day: any = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return year + '-' + month + '-' + day;
    };


    //判断是否是第一次登陆，如果第一次登陆则创建数据库。
    public _getLocal() {
        //alert("判断是否打开数据库");
        return new Promise((resolve, reject) => {
            this.storage.get("isFirstLand").then((val) => {
                if (val == "false") {
                    //不是一地次登陆，已经存在数据库，无需创建
                    // alert("已经不是第一次登陆");                
                    if (this.database == undefined || this.database == null) {
                        //打开数据库
                        //alert("要打开数据库");
                        this.openDB().then(() => {
                            this.isOpen = true;
                            resolve();
                        });
                        //alert("打开数据库");
                    } else {
                        resolve();
                    }
                } else if (val == null || val == "true") {
                    //alert("第一次登陆");
                    //创建数据库
                    this.storage.set("isFirstLand", "false");  //修改登陆状态
                    this.initDB().then(() => {
                        this.isOpen = true;
                        resolve();
                    });    //放在这里是有问题的，应该放在下面，现在是为了调试。
                }
            });

        })
    }

    /**
     * 数据库初始化
     */
    private initDB() {
        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: "gasaam.db",
                location: 'default'
            }).then((db: SQLiteObject) => {
                //创建资产盘点记录表
                db.executeSql('drop table if exists inv_asset_record', {});
                db.executeSql(`create table inv_asset_record
   (INV_RECORD_ID varchar(32) PRIMARY KEY,
    ASSET_ID varchar(32),
    NOTICE_ID varchar(32),
    WORKER_NUMBER varchar(20),
    MANAGER varchar(32),
    TECH_STATUS varchar(32),
    USE_STATE varchar(32),
    INSTALL_LOCATION varchar(100),
    SECURITY_STATE varchar(100),
    SECURITY_STATE_DESC varchar(100),
    USE_ORG varchar(100),
    USE_ORG_NAME varchar(100),
    HANDLE_SCRAP_MODE varchar(32),
    HANDLE_DATE varchar(32),
    HANDLE_REASON varchar(512),
    PROFIT_LOSS decimal,
    PROFIT_LOSS_CAUSE varchar(100),
    TIME_STAMP timestamp,
    ASSET_NAME varchar(32),
    ASSET_TYPE varchar(32),
    IS_SIGNATURED varchar(2) default '0',
    REMARK varchar(100),
    PHOTO_PATH varchar(512),
    SIGNATURE_PATH varchar(128),
    SIGNATURE varcahr(32),
    PRE_WORKER_NUMBER varchar(32))`, {})//建表
                    .then(() => console.log('创建资产盘点记录表成功！'))
                    .catch(e => alert("创建资产盘点记录表" + e.message));

                //建立本地固定资产台账表
                db.executeSql('drop table if exists asset_account_fixed', {});
                db.executeSql(`create table asset_account_fixed
                (ASSET_ID varchar(32) PRIMARY KEY,
ASSET_NAME varchar(100),
ASSET_TYPE varchar(32),
ASSET_CATEGORY varchar(32),
ASSET_CLASS varchar(32),
SPEC_MODEL varchar(100),
LICENSEPLAT_WELLNO varchar(100),
WORK_FOR_ORG varchar(32),
WORK_IN_ORG varchar(32),
SUBORDINATE_BLOCK varchar(32),
PRODUCTION_TIME datetime,
TECH_STATUS varchar(32),
USE_STATE varchar(32),
MANUFACTURE_DATE datetime,
INCREASE_DATE datetime,
INCREASE_REASON varchar(512),
UNIT varchar(32),
QUANTITY integer,
YARD_STATUS varchar(32),
ASSET_GROUP varchar(32),
REMAINING_LIFE integer,
NET_WORTH decimal(20,8),
WORKER_NUMBER varchar(20),
CUSTODIAN varchar(32),
INSTALL_LOCATION varchar(512),
REMARK varchar(512),
TWO_DIMENSION_CODE varchar(100),
RFID varchar(100),
RECORD_FLAG integer DEFAULT '0',
IS_CHECKED varchar(4) DEFAULT '0',
IS_TRANS varchar(4) DEFAULT '0',
SELF_NUMBER varchar(100),
ASSET_CODE varchar(32),
ORIGINAL_VALUE deciman(20,8),
SINGLE_QUANTITY deciman(16,2),
COMPLEX_QUANTITY deciman(16,2),
CERTIFICATE_NUMBER varchar(100),
SECURITY_STATE varchar(32),
CHANGE_CUSTODIAN varchar(32),
CHANGE_WORKER_NUMBER varchar(20),
MANUFACTURER varchar(100),
SERIAL_NUMBER varchar(100),
FUND_CHANNEL varchar(100))`, {})//建表
                    .then(() => console.log('建立本地固定资产台账表成功！'))
                    .catch(e => alert(e.message));
                //创建账户表
                db.executeSql('drop table if exists sys_login_account', {});
                db.executeSql(`create table sys_login_account
(USER_ID varchar(32) PRIMARY KEY,
LOGIN_NAME varchar(100),
LOGIN_PWD varchar(100),
ACCT_STATUS varchar(32),
WORKER_NUMBER varchar(20))`, {})//建表
                    .then(() => console.log('创建账户表成功！'))
                    .catch(e => alert(e.message));

                //创建用户信息表
                db.executeSql('drop table if exists sys_person_info', {});
                db.executeSql(`create table sys_person_info
          (USER_ID varchar(32) PRIMARY KEY,
          USER_NAME varchar(100),
          GENDER char,
          AGE integer,
          WORKER_NUMBER varchar(20),
          WORK_FOR_ORG varchar(32),
          WFO_ADDRESS varchar(100),
          WORK_IN_ORG varchar(32),
          WIO_ADDRESS varchar(100),
          TELE_PHONE varchar(20),
          CALL_PHONE varchar(20),
          E_MAIL varchar(100),
          NATIONALITY varchar(32),
          NATIVE_PLACE varchar(20),
          EDUCATION varchar(32),
          PROFESSION varchar(100),
          JOB varchar(20),
          PRESENT_ADDRESS varchar(100),
          REMARK varchar(512))`, {})//建表
                    .then(() => console.log('创建用户信息表成功！'))
                    .catch(e => alert(e.message));

                //创建日志表
                db.executeSql('drop table if exists asset_change_record', {});
                db.executeSql(`create table asset_change_record
          (ASSET_ID varchar(32),
          CHANGE_TYPE varchar(32),
          CHANGE_DETAIL varchar(512),
          DUTY_ORG varchar(32),
          CHANGE_PERSON varchar(32),
          CHANGE_TIME timestamp,
          STATE varchar(20))`, {})//建表
                    .then(() => console.log('创建组织结构表成功！'))
                    .catch(e => alert(e.message));


                //创建组织结构表
                db.executeSql('drop table if exists sys_org_info', {});
                db.executeSql(`create table sys_org_info
          (ORG_ID varchar(32),
          ORG_FULL_NAME varchar(100),
          ORG_CODE varchar(32),
          ORG_NAME varchar(100),
          PARENT_ORG_ID varchar(32),
          RECORD_FLAG integer)`, {})//建表
                    .then(() => console.log('创建组织结构表成功！'))
                    .catch(e => alert(e.message));

                //创建员工精简信息表
                db.executeSql('drop table if exists sys_person_info_simple', {});
                db.executeSql(`create table sys_person_info_simple
          (WORKER_NUMBER varchar(20),
          USER_NAME varchar(100),
          WORK_IN_ORG varchar(32),
          USER_ID varchar(32))`, {})//建表
                    .then(() => console.log('创建员工精简信息表成功！'))
                    .catch(e => alert(e.message));

                //创建盘点通知表
                db.executeSql('drop table if exists inv_notice', {});
                db.executeSql(`create table inv_notice
          (NOTICE_ID varchar(32) PRIMARY KEY,
          TITLE varchar(100),
          CONTENT varchar(512),
          LEADING_ORG varchar(100),
          INITIATOR varchar(32),
          TIME_START datetime,
          TIME_FINISH datetime,
          STATE varchar(32))`, {})//建表
                    .then(() => {
                        console.log('创建盘点通知表成功！');
                    })
                    .catch(e => alert(e.message));
                    //创建非安领用通知表
                db.executeSql('drop table if exists cvt_noninstall_notice', {});
                db.executeSql(`create table cvt_noninstall_notice
          (NOTICE_ID varchar(32) PRIMARY KEY,
          INVESTPLAN_ID varchar(32),
          ORG_NAME varchar(32),
          WORK_ORDER_NUMBER varchar(100),
          RECIPIENT varchar(32),
          STOREROOM_KEEPER varchar(32),
          NOTICE_STATE varchar(32),
          RECORD_FLAG int)`, {})//建表
                    .then(() => {
                        console.log('创建非安领用通知表成功！');
                    })
                    .catch(e => alert(e.message));

            //创建非安领用通知表
            db.executeSql('drop table if exists cvt_noninstall_notice_sub', {});
            db.executeSql(`create table cvt_noninstall_notice_sub
      (SUB_NOTICE_ID varchar(32) PRIMARY KEY,
      NOTICE_ID varchar(32),
      PURCHASING_ID varchar(32),
      MATERIAL_CODE varchar(100),
      ASSET_NAME varchar(100),
      SPEC_MODEL varchar(100),
      UNIT varchar(32),
      SENT_QUANTITY int,
      PRICE decimal(20,8),
      AMOUNT decimal(20,8),
      STORAGE_DATE datetime,
      OUT_DATE datetime,
      RECORD_FLAG int)`, {})//建表
                .then(() => {
                    console.log('创建非安领用通知表成功！');
                })
                .catch(e => alert(e.message));

                //创建非安设备转产资产领用表
                db.executeSql('drop table if exists cvt_noninstall_receive', {});
                db.executeSql(`create table cvt_noninstall_receive
          (RECEIVE_ID varchar(32) PRIMARY KEY,
          NOTICE_ID varchar(32),
          ASSET_ID varchar(32),
          ASSET_CODE varchar(100),
          ASSET_NAME varchar(100),
          SPEC_MODEL varchar(100),
          RECEIVE_ORG varchar(32),
          RECEIVE_PERSON varchar(32),
          RECEIVE_TIME datetime,
          RECEIVE_STYLE varchar(32),
          RECORD_FLAG int,
          RECEIVE_NAME varchar(32),
          SIGNATURE_PATH varchar(128),
          SIGNATURE_NAME varcahr(32))`, {})//建表
                    .then(() => console.log('创建非安设备转产资产领用表成功！'))
                    .catch(e => alert(e.message));

                //创建非安设备转产资产验收表
                db.executeSql('drop table if exists cvt_noninstall_check', {});
                db.executeSql(`create table cvt_noninstall_check
           (CHECK_ID varchar(32) PRIMARY KEY,
           INVESTPLAN_ID varchar(100),
           RECEIVE_ID varchar(32),
           CHECK_BILL_NUM varchar(100),
           CHECK_ORG varchar(32),
           CHECK_DATE datetime,
           CHECK_PERSON varchar(32),
           CHECK_LEADER varchar(32),
           CHECK_OPINION varchar(512),
           CHECK_STATE varchar(32),
           ASSET_ID varchar(32),
           FUND_CHANNEL varchar(100),
           ASSET_CODE varchar(100),
           ASSET_NAME varchar(100),
           SPEC_MODEL varchar(100),
           SELF_NUMBER varchar(100),
           MANUFACTURER varchar(100),
           MANUFACTURE_DATE datetime,
           WORK_IN_ORG varchar(32),
           SERIAL_NUMBER varchar(100),
           UNIT varchar(32),
           QUANTITY int,
           ORIGINAL_VALUE decimal(20,8),
           IS_READY_FOR_USE varchar(32),
           COMPONENT_TOOL_DESC varchar(512),
           TECHNICAL_DATA varchar(512),
           RECORD_FLAG int)`, {})//建表
                    .then(() => {
                        console.log('创建非安设备转产资产验收表成功！');
                        resolve();
                    })
                    .catch(e => alert(e.message));
                this.database = db;
            }).catch(e => {
                alert(e.message);
            });

        })//END Promise
    }

    /**
     * 打开数据库
     */
    openDB() {
        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: "gasaam.db",
                location: 'default'
            }).then((db: SQLiteObject) => {
                //alert("打开数据库"+db);
                db.open().then((data) => {
                    this.database = db;
                    resolve(db);
                });
            });
        })
    }

    /**
     * 关闭数据库
     */
    closeDB() {
        return new Promise<boolean>((resolve, reject) => {
            if (this.isOpen) {
                this.isOpen = false;
                this.database.close();
                resolve(true);
            } else {
                resolve(true);
            }
        })
    }
}