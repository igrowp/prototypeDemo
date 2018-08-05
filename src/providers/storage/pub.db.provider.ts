import { ConvertUtil } from './../utils/convertUtil';
import { Dict, DictDetail, Attachment } from './../entity/pub.entity';
import { Injectable } from '@angular/core';
import { DBService } from './db.service';
import { OrgInfo, ChangeRecord, FixedAsset } from '../entity/entity.provider';

/*
  公共的地数据库类
*/
@Injectable()
export class PubDBProvider {
    constructor(private dbService: DBService) {
    }



    //////////////固定资产台账////////////

    /**
         * 获取所有固定资产台账中的数据
         */
    queryAssetsFromFixed(workerNumber: string, isSynchro?: number) {
        let sql: string = "";
        let params: any = [];
        if (isSynchro == null || isSynchro == -1) {
            //搜索全部
            sql = "select * from asset_account_fixed where WORKER_NUMBER=? and RECORD_FLAG=0";
            params = [workerNumber];
        } else {
            sql = "select * from asset_account_fixed where WORKER_NUMBER=? and IS_SYNCHRO=? and RECORD_FLAG=0";
            params = [workerNumber, isSynchro];
        }
        return new Promise<Array<FixedAsset>>((resolve, reject) => {
            this.dbService.executeSql(sql, params)
                .then((data) => {
                    var assets: Array<FixedAsset> = this._getFixedAssetsFromDBResult(data)
                    resolve(assets);
                }).catch((error) => {
                    reject("数据库操作：<br>查询固定资产台账表失败<br>" + error.message);
                });
        })
    }

    /**
     * 根据每页显示条数和页码得到数据
     * @param pageSize   每页的数据大小
     * @param pageIndex 页码，从1开始
     * @param workerNumber 员工编号
     */
    queryAssetsFromFixedByPage(pageSize: number, pageIndex: number, workerNumber: string) {
        return new Promise<Array<FixedAsset>>((resolve, reject) => {
            var index = pageSize * (pageIndex - 1);
            this.dbService.executeSql("select * from asset_account_fixed where WORKER_NUMBER=?  and RECORD_FLAG=0 limit ? offset ?", [workerNumber, pageSize, index])
                .then((data) => {
                    var assets: Array<FixedAsset> = this._getFixedAssetsFromDBResult(data);
                    resolve(assets);
                }).catch((error) => {
                    reject("数据库操作：<br>查询固定资产台账表失败<br>" + error.message);
                });
        })
    }

    /**
     * 根据资产ID和二维码从固定资产台账中获取资产信息
     * @param id 
     * @param code 
     */
    queryFromFixedByIdAndCode(id: string, code: string,workerNumber:string) {
        return new Promise<FixedAsset>((resolve, reject) => {
            this.dbService.executeSql('select * from asset_account_fixed where ASSET_ID=? and TWO_DIMENSION_CODE=? and WORKER_NUMBER=? and RECORD_FLAG=0', [id, code,workerNumber])
                .then((data) => {
                    var asset: FixedAsset = this._getFixedAssetFromDBResult(data);
                    resolve(asset);
                }, (error) => {
                    reject("数据库操作：<br>查询固定资产台账表失败<br>" + error.message);
                })
        })
    }

    /**
     * 根据资产ID从固定资产台账中获取资产信息
     * @param id 
     */
    queryFromFixedById(id: string) {
        return new Promise<FixedAsset>((resolve, reject) => {
            this.dbService.executeSql('select * from asset_account_fixed where ASSET_ID=? and RECORD_FLAG=0', [id])
                .then((data) => {
                    var asset: FixedAsset = this._getFixedAssetFromDBResult(data);
                    resolve(asset);
                }, (error) => {
                    reject("数据库操作：<br>查询固定资产台账表失败<br>" + error.message);
                })
        })
    }

    queryFromFixedByRFID(rfid: string,workerNumber:string) {
        return new Promise<FixedAsset>((resolve, reject) => {
            this.dbService.executeSql("select * from asset_account_fixed where RFID=? and WORKER_NUMBER=? and RECORD_FLAG=0", [rfid,workerNumber])
                .then((data) => {
                    var asset = this._getFixedAssetFromDBResult(data);
                    resolve(asset);
                }).catch((error) => {
                    reject("数据库操作：<br>查询固定资产台账表失败<br>" + error.message);
                });
        });
    }

    /** 
     * 根据二维码从固定资产台账中查询资产信息
     * @param code 
     */
    queryFromFixedByCode(code: string,workerNumber:string) {
        return new Promise<FixedAsset>((resolve, reject) => {
            this.dbService.executeSql("select * from asset_account_fixed where TWO_DIMENSION_CODE=? and WORKER_NUMBER=? and RECORD_FLAG=0", [code,workerNumber])
                .then((data) => {
                    var asset = this._getFixedAssetFromDBResult(data);
                    resolve(asset);
                }).catch((error) => {
                    reject("数据库操作：<br>查询固定资产台账表失败<br>" + error.message);
                });
        });
    }


    /**
     * 在固定资产台账中插入数据
     * @param asset 
     */
    insertToFixed(asset: FixedAsset) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql("insert into asset_account_fixed values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [asset.assetId, asset.assetName, asset.assetType, asset.assetCategory, asset.assetClass, asset.specModel, asset.licenseplatWellno, asset.workForOrg, asset.workInOrg, asset.subordinateBlock,
                asset.productionTime, asset.techStatus, asset.useState, asset.manufactureDate, asset.increaseDate, asset.increaseReason, asset.unit, asset.quantity, asset.yardStatus, asset.assetGroup,
                asset.remainingLife, asset.netWorth, asset.workerNumber, asset.custodian, asset.installLocation, asset.remark, asset.twoDimensionCode, asset.rfid, asset.recordFlag, "0", "0", asset.selfNumber, asset.assetCode, asset.originalValue, asset.singleQuantity, asset.complexQuantity, asset.certificateNumber, asset.securityState, asset.changeCustodian, asset.changeWorkerNumber, asset.manufacturer, asset.serialNumber, asset.fundChannel, asset.photoPath,asset.useStateDesc,asset.wfoAddress])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>插入固定资产台账表失败<br>" + error.message);
                })
        })
    }

    /**
     * 删除台账表数据
     */
    deleteAllFromFixed(workerNumber:string) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('delete from asset_account_fixed where WORKER_NUMBER =?', [workerNumber])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>删除台账表失败<br>" + error.message);
                })
        })
    }

    /**
     * 更新固定资产台账信息表
     * @param asset 
     */
    updateToFixed(asset: FixedAsset) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql(`update asset_account_fixed 
                                       set TECH_STATUS=?,USE_STATE=?,QUANTITY=?,INSTALL_LOCATION=?,TWO_DIMENSION_CODE=?,IS_CHECKED=?,IS_SYNCHRO=?,SECURITY_STATE=?,RFID=?,CUSTODIAN=?,WORKER_NUMBER=?,CHANGE_CUSTODIAN=?,CHANGE_WORKER_NUMBER=?,
                                       LICENSEPLAT_WELLNO=?,SELF_NUMBER=?,SERIAL_NUMBER=?,MANUFACTURE_DATE=?,INSTALL_LOCATION=?,PHOTO_PATH=?,RECORD_FLAG=?,USE_STATE_DESC=?,WFO_ADDRESS=? where ASSET_ID=?`,
                [asset.techStatus, asset.useState, asset.quantity, asset.installLocation, asset.twoDimensionCode, asset.isChecked, asset.isSynchro, asset.securityState, asset.rfid, asset.custodian, asset.workerNumber, asset.changeCustodian, asset.changeWorkerNumber,
                asset.licenseplatWellno, asset.selfNumber, asset.serialNumber, asset.manufactureDate, asset.installLocation, asset.photoPath,asset.recordFlag,asset.useStateDesc,asset.wfoAddress, asset.assetId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>更新资产台账表失败<br>" + error.message);
                })
        })

    }

    //////////////固定资产台账END////////

    /////////////组织机构表/////////////

    /**
       * 根据组织ID获取组织信息
       * @param orgId 
       */
    queryFromOrgInfoByOrgId(orgId: string) {
        return new Promise<OrgInfo>((resolve, reject) => {
            this.dbService.executeSql('select * from sys_org_info where ORG_ID=?', [orgId])
                .then((data) => {
                    var orgInfo: OrgInfo = this._getOrgInfoFromDBResult(data);
                    resolve(orgInfo);
                }, (error) => {
                    reject("数据库操作：<br>查询组织机构表失败<br>" + error.message);
                })
        })
    }

    /**
       * 根据组织ID获取组织信息
       * @param orgCode 
       */
    queryFromOrgInfoByOrgCode(orgCode: string) {
        return new Promise<OrgInfo>((resolve, reject) => {
            this.dbService.executeSql('select * from sys_org_info where ORG_CODE=?', [orgCode])
                .then((data) => {
                    var orgInfo: OrgInfo = this._getOrgInfoFromDBResult(data);
                    resolve(orgInfo);
                }, (error) => {
                    reject("数据库操作：<br>查询组织机构表失败<br>" + error.message);
                })
        })
    }


    /**
       * 分页查询组织机构表
       * @param pageSize 
       * @param pageIndex  页号，从1开始 
       */
    queryListFromOrgInfo(pageSize=0, pageIndex=0) {
        return new Promise<Array<OrgInfo>>((resolve, reject) => {
            let sql: string = "";
            let params: any = [];
            if (pageSize == 0 && pageIndex == 0) {
                //都为0时默认查询所有数据
                sql = 'select * from sys_org_info order by ORG_FULL_NAME asc,ORG_NAME asc';
                params = [];
            } else {
                var index = pageSize * (pageIndex - 1);
                sql = 'select * from sys_org_info limit ? offset ?';
                params = [pageSize, index];
            }
            this.dbService.executeSql(sql, params)
                .then((data) => {
                    var orgInfoes: Array<OrgInfo> = this._getOrgInfosFromDBResult(data);
                    resolve(orgInfoes);
                }, (error) => {
                    reject("数据库操作：<br>查询组织结构表失败<br>" + error.message);
                })
        })
    }

    /**
      * 更新数据到组织结构表中
      * @param orgInfo 
      */
    updateToOrgInfo(orgInfo: OrgInfo) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql("update sys_org_info set ORG_FULL_NAME=?,ORG_CODE=?,ORG_NAME=?,PARENT_ORG_ID=?, RECORD_FLAG=? where ORG_ID=?", [orgInfo.orgFullName, orgInfo.orgCode, orgInfo.orgName, orgInfo.parentOrgId, orgInfo.recordFlag, orgInfo.orgId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>更新组织机构表失败<br>" + error.message);
                })
        })
    }

    /**
       * 在组织结构表中插入数据
       * @param orgInfo 
       */
    insertToOrgInfo(orgInfo: OrgInfo) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('insert into sys_org_info values (?,?,?,?,?,?)', [orgInfo.orgId, orgInfo.orgFullName, orgInfo.orgCode, orgInfo.orgName, orgInfo.parentOrgId, orgInfo.recordFlag])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：<br>插入组织结构表失败<br>" + error.message);
                })
        })
    }

    /**
     * 删除组织机构数据
     */
    deleteAllOrgInfo() {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('delete from sys_org_info', [])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>删除组织机构表失败<br>" + error.message);
                })
        })
    }
    
    //////////////组织机构表END////////////



    ///////////员工精简表////////////////

    // /**
    //    * 通过编号查询员工精简表
    //    */
    // queryFromUserSimpleByUserId(userId: string) {
    //     return new Promise<UserSimple>((resolve, reject) => {
    //         this.dbService.executeSql("select * from sys_person_info_simple where USER_ID=?", [userId])
    //             .then((data) => {
    //                 var userSimple: UserSimple = this._getUserSimpleFromDBResult(data);
    //                 resolve(userSimple);
    //             }, (error) => {
    //                 reject("数据库操作：<br>查询员工精简表失败<br>" + error.message);
    //             })
    //     })
    // }

    // /**
    //    * 分页查询员工精简表
    //    * @param pageSize 
    //    * @param pageIndex  页号，从1开始 
    //    */
    // queryListFromUserSimple(pageSize: number, pageIndex: number) {
    //     return new Promise<Array<UserSimple>>((resolve, reject) => {
    //         let sql: string = "";
    //         let params: any = [];
    //         if (pageSize == 0 && pageIndex == 0) {
    //             //都为0时默认查询所有数据
    //             sql = 'select * from sys_person_info_simple order by USER_NAME';
    //             params = [];
    //         } else {
    //             var index = pageSize * (pageIndex - 1);
    //             sql = 'select * from sys_person_info_simple limit ? offset ?';
    //             params = [pageSize, index];
    //         }
    //         this.dbService.executeSql(sql, params)
    //             .then((data) => {
    //                 var userSimples: Array<UserSimple> = this._getUserSimplesFromDBResult(data);
    //                 resolve(userSimples);
    //             }, (error) => {
    //                 reject("数据库操作：<br>查询员工精简表失败<br>" + error.message);
    //             })
    //     })
    // }

    // /**
    //   * 更新数据到员工精简表中
    //   * @param UserSimple 
    //   */
    //   updateToUserSimple(userSimple: UserSimple) {
    //     return new Promise((resolve, reject) => {
    //         this.dbService.executeSql("update sys_person_info_simple set WORKER_NUMBER=?,USER_NAME=?,WORK_IN_ORG=? where USER_ID=?", [userSimple.workerNumber,userSimple.userName,userSimple.workInOrg,userSimple.userId])
    //             .then((data) => {
    //                 resolve(data);
    //             })
    //             .catch((error) => {
    //                 reject("数据库操作：<br>更新员工精简表失败<br>" + error.message);
    //             })
    //     })
    // }

    // /**
    //    * 在员工信息表中插入数据
    //    * @param userSimple 
    //    */
    // insertToUserSimple(userSimple: UserSimple) {
    //     return new Promise((resolve, reject) => {
    //         this.dbService.executeSql('insert into sys_person_info_simple values (?,?,?,?)', [userSimple.workerNumber, userSimple.userName, userSimple.workInOrg, userSimple.userId])
    //             .then((data) => {
    //                 resolve(data);
    //             }, (error) => {
    //                 reject("数据库操作：<br>插入员工信息表失败<br>" + error.message);
    //             })
    //     })
    // }
    ///////////员工精简表END////////////////



    //////////   附件表   //////////////////

    /**
     * 查询附件表
     * @param assetId 
     * @param attachmentType 
     */
    queryFromAttachments(assetId: string, attachmentType: string) {
        return new Promise<Array<Attachment>>((resolve, reject) => {
            this.dbService.executeSql('select * from sys_attachments where ASSET_ID=? AND ATTACHMENT_TYPE=?', [assetId, attachmentType])
                .then((data) => {
                    var attachments = this._getAttachmentsFromDBResult(data);
                    resolve(attachments);
                }, (error) => {
                    reject("数据库操作：<br>查询附件表失败<br>" + error.message);
                })
        })
    }
    /**
     * 根据是否同步查询附件表
     * @param isUpload 
     */
    queryFromAttachmentsByIsUpload(isUpload: number) {
        return new Promise<Array<Attachment>>((resolve, reject) => {
            this.dbService.executeSql('select * from sys_attachments where IS_UPLOAD=?', [isUpload])
                .then((data) => {
                    var attachments = this._getAttachmentsFromDBResult(data);
                    resolve(attachments);
                }, (error) => {
                    reject("数据库操作：<br>查询附件表失败<br>" + error.message);
                })
        })
    }

    /**
      * 更新数据到附件表中
      * @param attachment 
      */
    updateToAttachment(attachment: Attachment) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql("update sys_attachments set IS_UPLOAD=? where ASSET_ID=? and ATTACHMENT_TYPE=? and STORAGE_PATH=?", [attachment.isUpload, attachment.assetId, attachment.attachmentType, attachment.storagePath])
                .then((data) => {

                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>更新附件表失败<br>" + error.message);
                })
        })
    }


    /**
       * 在附件表中插入数据
       * @param userSimple 
       */
    insertToAttachment(attachment: Attachment) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('insert into sys_attachments values (?,?,?,?,?)', [attachment.assetId, attachment.workerNumber, attachment.attachmentType, attachment.storagePath, attachment.isUpload])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：<br>插入附件表失败<br>" + error.message);
                })
        })
    }
    /**
     * 删除附件表
     */
    deleteFromAttachment(assetId: string, attachment: string) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('delete from sys_attachments where ASSET_ID=? and ATTACHMENT_TYPE=?', [assetId, attachment])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>删除日志表失败<br>" + error.message);
                })
        })
    }
    //////////   附件表END   //////////////////





    //////////   数据字典   //////////////////

    /**
       * 根据Id查询数据字典明细
       * @param dictId 
       */
    queryFromDictByDictId(dictId: string) {
        return new Promise<Dict>((resolve, reject) => {
            this.dbService.executeSql('select * from sys_dict where DICT_ID=?', [dictId])
                .then((data) => {
                    var dict = this._getDictFromDBResult(data);
                    resolve(dict);
                }, (error) => {
                    reject("数据库操作：<br>查询数据字典表失败<br>" + error.message);
                })
        })
    }

    /**
       * 分页查询数据字典
       * @param pageSize 
       * @param pageIndex  页号，从1开始 
       */
    queryListFromDict(pageSize: number, pageIndex: number) {
        return new Promise<Array<Dict>>((resolve, reject) => {
            let sql: string = "";
            let params: any = [];
            if (pageSize == 0 && pageIndex == 0) {
                //都为0时默认查询所有数据
                sql = 'select * from sys_dict order by CATEGORY_CODE';
                params = [];
            } else {
                var index = pageSize * (pageIndex - 1);
                sql = 'select * from sys_dict limit ? offset ?';
                params = [pageSize, index];
            }
            this.dbService.executeSql(sql, params)
                .then((data) => {
                    var userSimples: Array<Dict> = this._getDictListFromDBResult(data);
                    resolve(userSimples);
                }, (error) => {
                    reject("数据库操作：<br>查询数据字典表失败<br>" + error.message);
                })
        })
    }

    /**
       * 在数据字典明细表中插入数据
       * @param userSimple 
       */
    insertToDict(dict: Dict) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('insert into sys_dict values (?,?,?,?)', [dict.dictId, dict.categoryCode, dict.categoryDesc, dict.recordFlag])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：<br>插入数据字典明细表失败<br>" + error.message);
                })
        })
    }
    //////////   数据字典END   //////////////////

    //////////   数据字典明细   //////////////////

    /**
      * 根据Id查询数据字典明细
      * @param dictDetailId 
      */
    queryFromDictDetailByDictDetailId(dictDetailId: string) {
        return new Promise<DictDetail>((resolve, reject) => {
            this.dbService.executeSql('select * from sys_dict_detail where DICT_DETAIL_ID=?', [dictDetailId])
                .then((data) => {
                    var dictDetail = this._getDictDetailFromDBResult(data);
                    resolve(dictDetail);
                }, (error) => {
                    reject("数据库操作：<br>查询数据字典明细表失败<br>" + error.message);
                })
        })
    }

    /**
      * 根据Id查询数据字典明细
      * @param dictDetailId 
      */
    queryFromDictDetailByCategoryAndDictCode(categoryCode: string, dictCode: string) {
        return new Promise<DictDetail>((resolve, reject) => {
            this.dbService.executeSql('select * from sys_dict_detail where CATEGORY_CODE=? and DICT_CODE=?', [categoryCode, dictCode])
                .then((data) => {
                    var dictDetail = this._getDictDetailFromDBResult(data);
                    resolve(dictDetail);
                }, (error) => {
                    reject("数据库操作：<br>查询数据字典明细表失败<br>" + error.message);
                })
        })
    }

    /**
      * 根据DictId查询数据字典明细
      * @param dictDetailId 
      */
    queryListFromDictDetailByCategoryCode(categoryCode: string) {
        return new Promise<Array<DictDetail>>((resolve, reject) => {
            this.dbService.executeSql('select * from sys_dict_detail where CATEGORY_CODE=? order by DICT_CODE', [categoryCode])
                .then((data) => {
                    var dictDetails = this._getDictDetailListFromDBResult(data);
                    resolve(dictDetails);
                }, (error) => {
                    reject("数据库操作：<br>查询数据字典明细表失败<br>" + error.message);
                })
        })
    }

    /**
       * 分页查询数据字典明细
       * @param pageSize 
       * @param pageIndex  页号，从1开始 
       */
    queryListFromDictDetail(pageSize: number, pageIndex: number) {
        return new Promise<Array<DictDetail>>((resolve, reject) => {
            let sql: string = "";
            let params: any = [];
            if (pageSize == 0 && pageIndex == 0) {
                //都为0时默认查询所有数据
                sql = 'select * from sys_dict_detail order by CATEGORY_CODE';
                params = [];
            } else {
                var index = pageSize * (pageIndex - 1);
                sql = 'select * from sys_dict_detail limit ? offset ?';
                params = [pageSize, index];
            }
            this.dbService.executeSql(sql, params)
                .then((data) => {
                    var dictDetail: Array<DictDetail> = this._getDictDetailListFromDBResult(data);
                    resolve(dictDetail);
                }, (error) => {
                    reject("数据库操作：<br>查询数据字典明细表失败<br>" + error.message);
                })
        })
    }

    /**
      * 更新数据到字典明细表中
      * @param UserSimple 
      */
    updateToDictDetail(dictDetail: DictDetail) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql("update sys_dict_detail set CATEGORY_CODE=?,DICT_CODE=?,DICT_CODE_DESC=?,CODE_TYPE=?,CODE_SIZE=? where DICT_DETAIL_ID=?",
                [dictDetail.categoryCode, dictDetail.dictCode, dictDetail.dictCodeDesc, dictDetail.codeType, dictDetail.codeSize, dictDetail.dictDetailId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>更新字典明细表失败<br>" + error.message);
                })
        })
    }

    /**
       * 在数据字典明细表中插入数据
       * @param userSimple 
       */
    insertToDictDetail(dictDetail: DictDetail) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('insert into sys_dict_detail values (?,?,?,?,?,?,?,?)',
                [dictDetail.dictDetailId, dictDetail.categoryCode, dictDetail.dictCode, dictDetail.dictCodeDesc,
                dictDetail.codeType, dictDetail.codeSize, dictDetail.remark, dictDetail.record_flag])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：<br>插入数据字典明细表失败<br>" + error.message);
                })
        })
    }
    /**
     * 删除字典表
     */
    deleteAllFromDictDetail() {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('delete from sys_attachments', [])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>删除字典表失败<br>" + error.message);
                })
        })
    }
    //////////   数据字典明细END   //////////////////






    //////////日志表/////////////////////

    /**
      * 根据资产ID获取日志表信息
      * @param assetId 
      */
    queryFromChangeRecordByAssetId(assetId: string) {
        return new Promise<ChangeRecord>((resolve, reject) => {
            this.dbService.executeSql('select * from asset_change_record where ASSET_ID=?', [assetId])
                .then((data) => {
                    var changeRecord: ChangeRecord = this._getChangeRecordFromDBResult(data);
                    resolve(changeRecord);
                }, (error) => {
                    reject("数据库操作：<br>查询日志表失败<br>" + error.message);
                })
        })
    }

    /**
      * 获取所有的日志表信息  
      * @param assetId 
      */
    queryListFromChangeRecord(workerNumber: string) {
        return new Promise<Array<ChangeRecord>>((resolve, reject) => {
            this.dbService.executeSql('select * from asset_change_record where CHANGE_PERSON=?', [workerNumber])
                .then((data) => {
                    var changeRecords: Array<ChangeRecord> = this._getChangeRecordsFromDBResult(data);
                    resolve(changeRecords);
                }, (error) => {
                    reject("数据库操作：<br>查询日志表失败<br>" + error.message);
                })
        })
    }

    /**
     * 根据资产ID更新日志
     * @param changeRecord 
     */
    updateToChangeRecord(changeRecord: ChangeRecord) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql("update asset_change_record set CHANGE_DETAIL=?,DUTY_ORG=?,CHANGE_PERSON=? ,CHANGE_TIME=?,STATE=? where ASSET_ID=?", [changeRecord.changeDetail, changeRecord.dutyOrg, changeRecord.changePerson, changeRecord.changeTime, changeRecord.state, changeRecord.bizId])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>更新日志表失败<br>" + error.message);
                })
        })
    }


    /**
     * 根据修改编号删除日志表
     */
    deleteFromChangeRecordByChangeType(changeType: string) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('delete from asset_change_record where CHANGE_Type=?', [changeType])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>删除日志表失败<br>" + error.message);
                })
        })
    }

    /**
     * 在日志表中插入数据
     * @param changeRecord 
     */
    insertToChangeRecord(changeRecord: ChangeRecord) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('insert into asset_change_record values (?,?,?,?,?,?,?)', [changeRecord.bizId, changeRecord.changeType, changeRecord.changeDetail, changeRecord.dutyOrg, changeRecord.changePerson, changeRecord.changeTime, changeRecord.state])
                .then((data) => {
                    resolve(data);
                }, (error) => {
                    reject("数据库操作：<br>插入日志表失败<br>" + error.message);
                })
        })
    }

    /**
     * 删除附件表
     */
    deleteAllFromChangeRecord(workerNumber) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql('delete from sys_attachments where WORKER_NUMBER=?', [workerNumber])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：<br>删除附件表失败<br>" + error.message);
                })
        })
    }

    //////////日志表END///////////////






    ///////////////查询返回结果//////////////

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

    private _getOrgInfosFromDBResult(data): Array<OrgInfo> {
        var orgInfoes: Array<OrgInfo> = new Array<OrgInfo>();
        if (data.rows.length > 0) {
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
        return orgInfoes;
    }


    //获取附件表数据
    private _getAttachmentsFromDBResult(data): Array<Attachment> {
        var attachments: Array<Attachment> = new Array<Attachment>();
        if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
                let attachment = new Attachment();
                attachment.assetId = data.rows.item(i).ASSET_ID;
                attachment.workerNumber = data.rows.item(i).WORKER_NUMBER;
                attachment.attachmentType = data.rows.item(i).ATTACHMENT_TYPE;
                attachment.storagePath = data.rows.item(i).STORAGE_PATH;
                attachment.isUpload = data.rows.item(i).IS_UPLOAD;
                attachments.push(attachment);
            }
        }
        return attachments;
    }



    //获取数据字典数据
    private _getDictFromDBResult(data): Dict {
        var dict: Dict = null;
        if (data.rows.length > 0) {
            dict = new Dict();
            dict.dictId = data.rows.item(0).DICT_ID;
            dict.categoryCode = data.rows.item(0).CATEGORY_CODE;
            dict.categoryDesc = data.rows.item(0).CATEGORY_DESC;
            dict.recordFlag = data.rows.item(0).RECORD_FLAG;
        }
        return dict;
    }
    //数据字典列表
    private _getDictListFromDBResult(data): Array<Dict> {
        var dicts: Array<Dict> = new Array<Dict>();
        if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
                var dict: Dict = new Dict();
                dict.dictId = data.rows.item(i).DICT_ID;
                dict.categoryCode = data.rows.item(i).CATEGORY_CODE;
                dict.categoryDesc = data.rows.item(i).CATEGORY_DESC;
                dict.recordFlag = data.rows.item(i).RECORD_FLAG;
                dicts.push(dict);
            }
        }
        return dicts;
    }

    //获取数据字典数据
    private _getDictDetailFromDBResult(data): DictDetail {
        var dictDetail: DictDetail = null;
        if (data.rows.length > 0) {
            dictDetail = new DictDetail();
            dictDetail.dictDetailId = data.rows.item(0).DICT_DETAIL_ID;
            dictDetail.categoryCode = data.rows.item(0).CATEGORY_CODE;
            dictDetail.dictCode = data.rows.item(0).DICT_CODE;
            dictDetail.dictCodeDesc = data.rows.item(0).DICT_CODE_DESC;
            dictDetail.codeType = data.rows.item(0).CODE_TYPE;
            dictDetail.codeSize = data.rows.item(0).CODE_SIZE;
            dictDetail.remark = data.rows.item(0).REMARK;
            dictDetail.record_flag = data.rows.item(0).RECORD_FLAG;
        }
        return dictDetail;
    }
    //数据字典列表
    private _getDictDetailListFromDBResult(data): Array<DictDetail> {
        var dictsDetail: Array<DictDetail> = new Array<DictDetail>();
        if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
                var dictDetail: DictDetail = new DictDetail();
                dictDetail = new DictDetail();
                dictDetail.dictDetailId = data.rows.item(i).DICT_DETAIL_ID;
                dictDetail.categoryCode = data.rows.item(i).CATEGORY_CODE;
                dictDetail.dictCode = data.rows.item(i).DICT_CODE;
                dictDetail.dictCodeDesc = data.rows.item(i).DICT_CODE_DESC;
                dictDetail.codeType = data.rows.item(i).CODE_TYPE;
                dictDetail.codeSize = data.rows.item(i).CODE_SIZE;
                dictDetail.remark = data.rows.item(i).REMARK;
                dictDetail.record_flag = data.rows.item(i).RECORD_FLAG;
                dictsDetail.push(dictDetail);
            }
        }
        return dictsDetail;
    }

    /**
     * 从数据库查询结果中返回Array<ChangeRecord>的值
     * @param data 
     */
    private _getChangeRecordsFromDBResult(data): Array<ChangeRecord> {
        var changeRecords: Array<ChangeRecord> = new Array<ChangeRecord>();
        if (data.rows.length > 0) {
            changeRecords = new Array<ChangeRecord>();
            for (var i = 0; i < data.rows.length; i++) {
                var changeRecord = new ChangeRecord();
                changeRecord.bizId = data.rows.item(i).ASSET_ID;
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
    * 从数据库查询结果中返回ChangeRecord的值
    * @param data 
    */
    private _getChangeRecordFromDBResult(data): ChangeRecord {
        var changeRecord: ChangeRecord = null;
        if (data.rows.length > 0) {
            changeRecord = new ChangeRecord();
            changeRecord.bizId = data.rows.item(0).ASSET_ID;
            changeRecord.changeType = data.rows.item(0).CHANGE_TYPE;
            changeRecord.changeDetail = data.rows.item(0).CHANGE_DETAIL;
            changeRecord.dutyOrg = data.rows.item(0).DUTY_ORG;
            changeRecord.changePerson = data.rows.item(0).CHANGE_PERSON;
            changeRecord.changeTime = data.rows.item(0).CHANGE_TIME;
        }
        return changeRecord;
    }

    private _getFixedAssetsFromDBResult(data): Array<FixedAsset> {
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
                asset.techStatus = data.rows.item(i).TECH_STATUS;
                asset.useState = data.rows.item(i).USE_STATE;
                asset.manufactureDate = ConvertUtil.formatDate(new Date(data.rows.item(i).MANUFACTURE_DATE));
                asset.productionTime = ConvertUtil.formatDate(new Date(data.rows.item(i).PRODUCTION_TIME));
                asset.increaseDate = ConvertUtil.formatDate(new Date(data.rows.item(i).INCREASE_DATE));

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
                asset.isSynchro = data.rows.item(i).IS_SYNCHRO;
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
                asset.photoPath = data.rows.item(i).PHOTO_PATH;
                asset.useStateDesc=data.rows.item(i).USE_STATE_DESC;
                asset.wfoAddress=data.rows.item(i).WFO_ADDRESS;
                assets.push(asset);
            }
        }
        return assets;
    }

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
            asset.manufactureDate = ConvertUtil.formatDate(new Date(data.rows.item(0).MANUFACTURE_DATE));
            asset.productionTime = ConvertUtil.formatDate(new Date(data.rows.item(0).PRODUCTION_TIME));
            asset.increaseDate = ConvertUtil.formatDate(new Date(data.rows.item(0).INCREASE_DATE));
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
            asset.isSynchro = data.rows.item(0).IS_SYNCHRO;
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
            asset.photoPath = data.rows.item(0).PHOTO_PATH;
            asset.useStateDesc=data.rows.item(0).USE_STATE_DESC;
            asset.wfoAddress=data.rows.item(0).WFO_ADDRESS;
        }
        return asset;
    }


}
