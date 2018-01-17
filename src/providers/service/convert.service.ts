import { AssetWebProvider } from './../web/asset.web.provider';
import { CvtNonReceive, CvtNonCheck, CvtNonNotice,CvtNonNoticeSub } from './../entity/cvt.entity.provider';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { FixedAsset, ChangeRecord, UserSimple } from './../entity/entity.provider';
import { CvtWebProvider } from '../web/cvt.web.provider';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DataBaseUtil } from '../utils/dataBaseUtil';
import { NoticeService } from './notice.service';
import { PubContanst } from '../entity/constant.provider';
import { ConvertDBProvider } from '../storage/convert.db.provider';
import { PubDBProvider } from '../storage/pub.db.provider';
import { AttachmentWebProvider } from '../web/attachment.web.provider';
/*
  Generated class for the AboutServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ConvertService {

  constructor(private cvtWebProvider:CvtWebProvider,
    private photoLibrary: PhotoLibrary,
    private attaWebProvider:AttachmentWebProvider,
    private assetWebProvider:AssetWebProvider,
    private convertDBProvider:ConvertDBProvider,
    private pubDBProvider:PubDBProvider,
    private noticeService:NoticeService) {
  }


  /**
   * 从本地查找通知单
   */
  queryFromCvtNonNoticeByWorkerNumber(workerNumber:string){
    return new Promise<CvtNonNotice>((resolve,reject)=>{
      if(workerNumber==null||workerNumber==""){
        resolve(null);
      }
      this.convertDBProvider.queryFromCvtNonNoticeByWorkerNumber(workerNumber).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }

  /**
   * 从本地查找通知附加表
   */
  queryFromCvtNonNoticeSubByNoticeId(noticeId:string){
    return new Promise<Array<CvtNonNoticeSub>>((resolve,reject)=>{
      if(noticeId==null||noticeId==""){
        resolve(null);
      }
      this.convertDBProvider.queryFromCvtNonNoticeSubByNoticeId(noticeId).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }

  queryFromCvtNonReceive(noticeId:string){
    return new Promise<Array<CvtNonReceive>>((resolve,reject)=>{
      this.convertDBProvider.queryFromCvtNonReceive(noticeId).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }

  /**
   * 获取所有的验收单
   * @param investplanId
   */
  queryFromCvtNonChecks(investplanId:string){
    return new Promise<Array<CvtNonCheck>>((resolve,reject)=>{
      this.convertDBProvider.queryFromCvtNonCheck(investplanId).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }
  /**
   * 根据userId查询员工信息
   * @param userId 
   */
  queryFromUserSimpleByUserId(userId:string){
    return new Promise<UserSimple>((resolve,reject)=>{
      this.pubDBProvider.queryFromUserSimpleByUserId(userId).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }


  /**
   * 从本地查找通知单如果没有则从服务器获取
   */
  getFromCvtNonNoticeByWNAndOrgOrFromServe(workerNumber:string,orgId:string){
    return new Promise<CvtNonNotice>((resolve,reject)=>{
      if(workerNumber==null||workerNumber==""){
        resolve(null);
      }
      this.convertDBProvider.queryFromCvtNonNoticeByWorkerNumber(workerNumber).then((data)=>{
        if(data!=null){
          resolve(data);
        }else{
          //从服务器获取
          this.getCvtNoticeByworkerNumberAndOrgFromServe(workerNumber,orgId).then((data1)=>{
            resolve(data1);
          },(error)=>{
            reject(error);
          })
        }
      },(error)=>{
        reject("本地查找通知单出错：\n"+error);
      })
    })
  }
  /**
   * 根据员工编号和所在单位获得非安转产通知
   * @param workerNumber 
   * @param orgId 
   */
  getCvtNoticeByworkerNumberAndOrgFromServe(workerNumber:string,orgId:string){
    return new Promise<CvtNonNotice>((resolve,reject)=>{
      if(workerNumber==null||workerNumber==""||orgId==null||orgId==""){
        resolve(null);
        return;
      }
      this.cvtWebProvider.getCvtNoticeByRecipientAndOrg(workerNumber,orgId).then((data)=>{
        if(data==null||data.recipient==""){
          resolve(null);
        }else{
          this.convertDBProvider.queryFromCvtNonNoticeByWorkerNumber(data.recipient).then((cvtNonNotice)=>{
            if(cvtNonNotice==null){
              //本地没有存储，存到本地
              this.convertDBProvider.insertToCvtNonNotice(data).then(()=>{
                resolve(data);
              },(error)=>{
                reject("插入本地非安转产通知错误："+error);
              })
            }else{
              //本地有通知，更新
              this.convertDBProvider.updateToCvtNonNotice(data).then(()=>{
                resolve(data);
              },(error)=>{
                reject("更新本地非安转产通知错误："+error);
              })
            }
          },(error)=>{
            reject("查询本地非安转产通知错误："+error);
          })
        }
      },(err)=>{
        resolve(null);  //没有网默认没有通知
        //reject("网络连接超时，请确认当前为内网环境！");
      });
    });
  }


  /**
   * 根据员工编号和所在单位获得非安转产通知
   * @param noticeId
   */
  getCvtNoticeSubByNoticeId(noticeId:string){
    return new Promise<Array<CvtNonNoticeSub>>((resolve,reject)=>{
      this.cvtWebProvider.getCvtNonNoticeSub(noticeId).then((data)=>{
        resolve(data);
      },(err)=>{
        reject(err);
      });
    });
  }

  /**
   * 从服务器中根据通知ID查找附加表信息，并插入到本地
   * @param noticeId 
   */
  insertCvtNonNoticeSubFromServe(noticeId:string){
    return new Promise((resolve,reject)=>{
      this.cvtWebProvider.getCvtNonNoticeSub(noticeId).then((noticeSubs)=>{
        if(noticeSubs.length==0){
          resolve();
        }else{
          for(var i=0;i<noticeSubs.length;i++){
            let noticeSub=noticeSubs[i];
            this.convertDBProvider.insertToCvtNonNoticeSub(noticeSub).then(()=>{
              if(noticeSub.subNoticeId==noticeSubs[noticeSubs.length-1].subNoticeId){
                resolve();
              }
            },(error)=>{
              reject(error);
            })
          }
        }
      },(error)=>{
        reject(error);
      })
    })
  }

  getCvtAssetByAssetName(assetName:string,purchasingId:string,orgId:string){
    return new Promise<Array<FixedAsset>>((resolve,reject)=>{
      this.cvtWebProvider.getCvtAssetByAssetName(assetName,purchasingId,orgId).then((data)=>{
        resolve(data);
      },(err)=>{
        reject(err);
      });
    });
  }

  updateStateToCvtNoticeFromServe(state:string,noticeId:string){
    return new Promise<string>((resolve,reject)=>{
      this.cvtWebProvider.updateStateToCvtNotice(state,noticeId).then((data)=>{
        resolve(data);
      },(err)=>{
        reject(err);
      });
    });
  }



  /**
   * 领用人不再发放，直接保存
   */
  receiverNoGranting(cvtNonNotice: CvtNonNotice, recipient) {
    return new Promise((resolve, reject) => {
      this.cvtWebProvider.receiverNoGranting(cvtNonNotice.noticeId, recipient).then(() => {
        // 更新服务器通知单状态
        this.cvtWebProvider.updateStateToCvtNotice(PubContanst.CvtNonNoniceState.FINISH,cvtNonNotice.noticeId).then(() => {
          //删除本地通知单
          this.convertDBProvider.deleteFromCvtNonNoticeByNoticeId(cvtNonNotice.noticeId).then(() => {
            resolve();
          }, error => reject(error));
        }, (error) => {
          this.noticeService.showIonicAlert(error);
          reject(error);
        })
      })
    })
  }

  /**
   * 修改本地的通知单非安设备转产通知单
   * @param cvtNotice 
   */
  updateStateToCvtNotice(cvtNotice:CvtNonNotice){
    return new Promise<string>((resolve,reject)=>{
      this.convertDBProvider.updateToCvtNonNotice(cvtNotice).then((data)=>{
        resolve("修改成功！");
      },(err)=>{
        reject(err);
      });
    });
  }

  /**
   * 更新非安转产领用单
   * @param cvtNonReceives Array<CvtNonReceive>
   */
  updateToCvtNonReceive(cvtNonReceives:Array<CvtNonReceive>){
    return new Promise((resolve,reject)=>{
      if(cvtNonReceives==null||cvtNonReceives.length==0){
        resolve();
      }
      else {
        let lastReceiveId = cvtNonReceives[cvtNonReceives.length - 1].receiveId;
        for (var i = 0; i < cvtNonReceives.length; i++) {
          let cvtNonReceive = cvtNonReceives[i];
          this.convertDBProvider.updateToCvtNonReceive(cvtNonReceive).then(() => {
            if (cvtNonReceive.receiveId == lastReceiveId) {
              resolve();
            }
          }, (error) => {
            reject(error);
          })
        }
      }
    })
  }
  /**
   * 更新非安转产验收单
   * @param cvtNonChecks Array<any>
   */
  updateToCvtNonCheck(cvtNonChecks:Array<CvtNonCheck>){
    return new Promise((resolve,reject)=>{
      if(cvtNonChecks==null||cvtNonChecks.length==0){
        resolve();
      }
      else {
        let lastCheckId = cvtNonChecks[cvtNonChecks.length - 1].checkId;
        for (var i = 0; i < cvtNonChecks.length; i++) {
          let cvtNonCheck = cvtNonChecks[i];
          this.convertDBProvider.updateToCvtNonCheck(cvtNonCheck).then(() => {
            if (cvtNonCheck.checkId == lastCheckId) {
              resolve();
            }
          }, (error) => {
            reject(error);
          })
        }
      }
    })
  }
  

  /**
   * 上传图片
   * @param workerNumber 员工编号
   * @param signaturePath 签名路径
   * @param signatureName 签名名称
   * @param recordId 存放附件的表的主键
   * @param attachmentType 附件类型
   */
  uploadSignature(workerNumber, signaturePath, signatureName,recordId,attachmentType) {
    return new Promise((resolve, reject) => {
      let signatureParams = new Map<string, string>();
      signatureParams.set("workerNumber", workerNumber);
      signatureParams.set("recordId", recordId);
      signatureParams.set("attachmentType", "inv_signature"); //转产凭证、资产附件、转产照片、盘点
      this.photoLibrary.getPhoto(signaturePath).then((blob) => {
        this.attaWebProvider.uploadSignature(blob, signatureName, signatureParams).then((data) => {
          resolve(data);
        })
      })
    })
  }

  /**
   * 签名确认后，将资产信息保存到本地，主要存入两个表，一个是资产领用表，一个是资产验收表
   * @param noticeId 
   * @param workInOrg 
   */
  saveCvtAssetsFromServe(noticeId:string,workInOrg:string,investplanId:string,workerNumber:string,userName:string){
    return new Promise((resolve,reject)=>{
      if(noticeId==null||noticeId==""||workInOrg==null||workInOrg==""){
        reject("参数为空");
      }
      this.cvtWebProvider.getAllCvtAsset(noticeId,workInOrg).then((fixedAssets)=>{
        if(fixedAssets.length==0){
          resolve();
        }
        for(var i=0;i<fixedAssets.length;i++){
          let fixedAsset=fixedAssets[i];
          let nonReceive=new CvtNonReceive();
          nonReceive.receiveId=DataBaseUtil.generateUUID();  //主键
          nonReceive.noticeId=noticeId;   //通知单主键
          nonReceive.assetId=fixedAsset.assetId;    //资产台账主键
          nonReceive.assetCode=fixedAsset.assetCode;  //资产编码
          nonReceive.assetName=fixedAsset.assetName;  //资产名称
          nonReceive.specModel=fixedAsset.specModel;  //规格型号
          // nonReceive.receiveOrg; //领用单位
          // nonReceive.receivePerson;  //领用人
          // nonReceive.receiveTime;  //领用时间
          // nonReceive.reveiveStyle="0"; //领用方式   
          nonReceive.recordFlag=0;   //逻辑删除标志
          this._addOrUpdateToCvtNonReceive(nonReceive).then(()=>{
            //插入成功，执行
            let nonCheck=new CvtNonCheck();
            nonCheck.checkId=DataBaseUtil.generateUUID();       //主键
            nonCheck.investplanId=investplanId;  //计划表主键
            nonCheck.receiveId=nonReceive.receiveId;     //领用表主键
            // nonCheck.checkBillNum;  //验收申请单号
            nonCheck.checkOrg=fixedAsset.workInOrg;      //验收单位
            // nonCheck.checkDate;     //验收日期
            // nonCheck.checkPerson;   //责任人  可以填
            // nonCheck.checkLeader;   //验收单位负责人  不可填
            // nonCheck.checkOpinion;  //验收单位意见  不写
            // nonCheck.checkState;    //验收状态   初始
            nonCheck.assetId=fixedAsset.assetId;       //资产台账主键
            nonCheck.fundChannel=fixedAsset.fundChannel;   //资金渠道
            nonCheck.assetCode=fixedAsset.assetCode;     //资产编码
            nonCheck.assetName=fixedAsset.assetName;     //资产名称
            nonCheck.specModel=fixedAsset.specModel;     //规格型号
            nonCheck.selfNumber=fixedAsset.selfNumber;    //自编码
            nonCheck.manufacturer=fixedAsset.manufacturer;  //制造单位
            nonCheck.manufactureDate=fixedAsset.manufactureDate; //出厂日期
            nonCheck.workInOrg=fixedAsset.workInOrg;     //使用单位
            nonCheck.serialNumber=fixedAsset.serialNumber;  //出厂编号
            nonCheck.unit=fixedAsset.unit;    //计量单位
            nonCheck.quantity=fixedAsset.quantity;      //数量
            nonCheck.originalValue=fixedAsset.originalValue; //资产原值

            //nonCheck.isReadyForUse; //是否达到预定使用状态  不写
            // nonCheck.componentToolDesc;    //不写
            nonCheck.recordFlag=0;    //逻辑删除标志
            this._addOrUpdateToCvtNonCheck(nonCheck).then(()=>{
              //修改日志表
              let changeRecord=new ChangeRecord();
              changeRecord.assetId=fixedAsset.assetId;
              changeRecord.changeDetail="【资产领用】：领料人-->"+userName;
              changeRecord.changePerson=workerNumber;
              changeRecord.changeTime=new Date().getTime();
              changeRecord.changeType=PubContanst.ChangeRecord.CONVERT;
              changeRecord.dutyOrg=workInOrg;
              changeRecord.state="ENABLE";
              //说明没有该条记录的日志，插入
              this.pubDBProvider.insertToChangeRecord(changeRecord).then(()=>{
                if(fixedAsset.assetId==fixedAssets[fixedAssets.length-1].assetId){
                  //说明插入到了最后一个
                  resolve("插入成功");
                }
              },(error)=>{
                reject(error);
              });
            },(error)=>{
              this.noticeService.showIonicAlert(error);
              reject(error);
            })
          },(error)=>{
            this.noticeService.showIonicAlert(error);
            reject(error);
          })
        }        
      },(error)=>{
        reject(error);
      })
    })

  }

 
  /**
   * 插入日志表
   * @param changeRecord Array<ChangeRecord>
   */
  insertToChangeRecord(changeRecords:Array<ChangeRecord>){
    return new Promise((resolve,reject)=>{
      if(changeRecords==null||changeRecords.length==0){
        resolve();
      }
      else {
        let lastCheckId = changeRecords[changeRecords.length - 1].assetId;
        for (var i = 0; i < changeRecords.length; i++) {
          let changeRecord = changeRecords[i];
          this.pubDBProvider.insertToChangeRecord(changeRecord).then(() => {
            if (changeRecord.assetId == lastCheckId) {
              resolve();
            }
          }, (error) => {
            reject(error);
          })
        }
      }
    })
  }

  /**
   * 根据记录类型获取日志列表
   * @param changeType 
   */
  queryListFromChangeRecordByChangeTypes(changeType:string){
    return new Promise<Array<ChangeRecord>>((resolve,reject)=>{
      this.pubDBProvider.queryListFromChangeRecordByChangeType(changeType).then((records)=>{
        resolve(records);
      },(error)=>{
        reject(error);
      })
    })
  }

  /**
   * 同步本地数据到数据库
   * @param cvtNonReceives 
   * @param cvtNonChecks 
   * @param changeRecords 
   */
  syncCvtDBToServer(cvtNonReceives:Array<CvtNonReceive>, cvtNonChecks:Array<CvtNonCheck>, changeRecords:Array<ChangeRecord>,noticeId:string){
    return new Promise((resove,reject)=>{
      //同步并删除本地领用表
      this.cvtWebProvider.syncCvtNonReceiveToServer(cvtNonReceives).then((data)=>{
        this._deleteFromCvtNonReceivesByReceiveId(cvtNonReceives).then(()=>{
          //同步验收表
          this.cvtWebProvider.syncCvtNonCheckToServer(cvtNonChecks).then((data)=>{
            this._deleteFromCvtNonChecksByCheckId(cvtNonChecks).then(()=>{
              //同步并删除本地记录表
              this.assetWebProvider.syncChangeRecordToServer(changeRecords).then((data)=>{
                this.pubDBProvider.deleteFromChangeRecordByChangeType(PubContanst.ChangeRecord.CONVERT).then(()=>{
                  this.pubDBProvider.deleteFromChangeRecordByChangeType(PubContanst.ChangeRecord.GRANTING).then(()=>{
                    //更新服务器通知单状态
                    this.cvtWebProvider.updateStateToCvtNotice(PubContanst.CvtNonNoniceState.FINISH,noticeId).then(()=>{
                      //删除本地通知单和附加表
                      this.convertDBProvider.deleteFromCvtNonNoticeByNoticeId(noticeId).then(()=>{
                        this.convertDBProvider.deleteFromCvtNonNoticeSubByNoticeId(noticeId).then(()=>{
                          resove(data);
                        },(error)=>reject(error))
                      },(error)=>reject(error))
                    },(error)=>reject(error))
                  },(error)=>reject(error))
                },(error)=>reject(error))
              },(error)=>reject(error))
            },(error)=>reject(error))
          },(error)=>reject(error))
        },(error)=>reject(error))
      },(error)=>reject(error))
    })
  }

  //////插入专区///////////
  //插入或更新非安转产领用表
  private _addOrUpdateToCvtNonReceive(cvtNonReceive: CvtNonReceive){
    return new Promise((resolve,reject)=>{
      this.convertDBProvider.queryFromCvtNonReceiveByReceiveId(cvtNonReceive.receiveId).then((receives)=>{
        if(receives.length==0){
          this.convertDBProvider.insertToCvtNonReceive(cvtNonReceive).then(()=>{
            resolve();
          },err=>reject(err))
        }else{
          this.convertDBProvider.updateToCvtNonReceive(cvtNonReceive).then(()=>{
            resolve();
          },err=>reject(err))
        }
      },err=>reject(err))
    })
  }

  //插入或更新非安转产领用表
  private _addOrUpdateToCvtNonCheck(CvtNonCheck: CvtNonCheck){
    return new Promise((resolve,reject)=>{
      this.convertDBProvider.queryFromCvtNonCheck(CvtNonCheck.checkId).then((checks)=>{
        if(checks.length==0){
          this.convertDBProvider.insertToCvtNonCheck(CvtNonCheck).then(()=>{
            resolve();
          },err=>reject(err))
        }else{
          this.convertDBProvider.updateToCvtNonCheck(CvtNonCheck).then(()=>{
            resolve();
          },err=>reject(err))
        }
      },err=>reject(err))
    })
  }

  //////插入专区END///////////

  //////删除专区///////////
  private _deleteFromCvtNonReceivesByReceiveId(cvtNonReceives:Array<CvtNonReceive>){
    return new Promise((resolve,reject)=>{
      if(cvtNonReceives==null||cvtNonReceives.length==0){
        resolve();
        return;
      }else{
        let lastReceiveId=cvtNonReceives[cvtNonReceives.length-1].receiveId;
        for(var i=0;i<cvtNonReceives.length;i++){
          let cvtNonReceive=cvtNonReceives[i];
          this.convertDBProvider.deleteFromCvtNonReceiveByReceiveId(cvtNonReceive.receiveId).then((data)=>{
            if(cvtNonReceive.receiveId==lastReceiveId){
              resolve();
            }
          },(error)=>{
            reject(error);
          })
        }
      }
    })
  }

  private _deleteFromCvtNonChecksByCheckId(cvtNonChecks:Array<CvtNonCheck>){
    return new Promise((resolve,reject)=>{
      if(cvtNonChecks==null|| cvtNonChecks.length==0){
        resolve();
        return;
      }else{
        let lastCheckId=cvtNonChecks[cvtNonChecks.length-1].checkId;
        for(var i=0;i<cvtNonChecks.length;i++){
          let cvtNonCheck=cvtNonChecks[i];
          this.convertDBProvider.deleteFromCvtNonCheckByCheckId(cvtNonCheck.checkId).then((data)=>{
            if(cvtNonCheck.checkId==lastCheckId){
              resolve();
            }
          },(error)=>{
            reject(error);
          })
        }
      }
    })
  }






  //////删除专区END///////////




  




}
