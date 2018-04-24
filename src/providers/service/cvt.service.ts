import { CvtDBProvider } from './../storage/cvt.db.provider';
import { PubConstant } from './../entity/constant.provider';
import { AssetWebProvider } from './../web/asset.web.provider';
import { CvtNonReceive, CvtNonNotice,CvtNonNoticeSub } from './../entity/cvt.entity.provider';
import { ChangeRecord } from './../entity/entity.provider';
import { CvtWebProvider } from '../web/cvt.web.provider';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { NoticeService } from './notice.service';
import { PubDBProvider } from '../storage/pub.db.provider';
import { AttachmentWebProvider } from '../web/attachment.web.provider';
/*
  提供关于资产转产相关的封装方法，对服务器及本地数据库进行数据操作
*/
@Injectable()
export class CvtService {

  constructor(private cvtWebProvider:CvtWebProvider,
    private cvtDBProvider:CvtDBProvider,
    private attaWebProvider:AttachmentWebProvider,
    private assetWebProvider:AssetWebProvider,
    private pubDBProvider:PubDBProvider,
    private noticeService:NoticeService) {
  }


  /**
   * 同步转产数据
   * @param cvtNoticeList 
   */
  synchroCvtData(cvtNoticeList:Array<CvtNonNotice>){
    return new Promise((resolve,reject)=>{
      if(cvtNoticeList==null||cvtNoticeList.length==0){
        resolve();
      } else {
        let lastNoticeId=cvtNoticeList[cvtNoticeList.length-1].noticeId;
        for (let i = 0; i < cvtNoticeList.length; i++) {
          let cvtNotice = cvtNoticeList[i];
          this.queryFromCvtNonReceive(cvtNotice.noticeId, 1).then((cvtNonReceives) => {
            this._syncCvtDBToServer(cvtNonReceives, cvtNotice.noticeId).then((data) => {
              if(cvtNotice.noticeId==lastNoticeId){
                resolve();
              }
            }, (error) => {
              reject("同步失败" + error);
            })
          }, (error) => {
            reject("获取领用表失败");
          })
        }
      }
    })
    
  }


  /**
   * 从本地查找通知单
   */
  queryFromCvtNonNoticeByWorkerNumber(workerNumber:string){
    return new Promise<Array<CvtNonNotice>>((resolve,reject)=>{
      if(workerNumber==null||workerNumber==""){
        resolve(null);
      }
      this.cvtDBProvider.queryFromCvtNonNoticeByWorkerNumber(workerNumber).then((data)=>{
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
      this.cvtDBProvider.queryFromCvtNonNoticeSubByNoticeId(noticeId).then((data)=>{
        resolve(data);
      },(error)=>{
        reject(error);
      })
    })
  }

  queryFromCvtNonReceive(noticeId:string,recordFlag?:number){
    return this.cvtDBProvider.queryFromCvtNonReceive(noticeId,recordFlag);
  }

  /**
   * 根据userId查询员工信息
   * @param userId 
   */
  getUserSimpleList(){
    return this.assetWebProvider.getUserSimpleListFromServe();
  }
  /**
   * 根据userId查询员工信息
   * @param userId 
   */
  getUserSimpleByUserId(userId:string){
    return this.assetWebProvider.getUserSimpleFromServe(userId);
  }


  /**
   * 根据员工编号获得非安转产通知
   * @param workerNumber
   */
  getCvtNonNoticeByWorkerNumberFromServe(workerNumber: string) {
    return new Promise<Array<CvtNonNotice>>((resolve, reject) => {
      if (workerNumber == null || workerNumber == "") {
        resolve(null);
      } else {
        this.cvtWebProvider.getCvtNoticeByRecipient(workerNumber).then((noticeList) => {
          if (noticeList == null || noticeList.length == 0) {
            resolve(null);
          } else {
            let lastNoticeId = noticeList[noticeList.length - 1].noticeId;
            for (let i = 0; i < noticeList.length; i++) {
              let notice = noticeList[i];
              this.cvtDBProvider.queryFromCvtNonNoticeByNoticeId(notice.noticeId).then((cvtNonNotice) => {
                if (cvtNonNotice == null) {
                  //本地没有存储，存到本地
                  this.cvtDBProvider.insertToCvtNonNotice(notice).then(() => {
                    if (notice.noticeId == lastNoticeId) {
                      resolve(noticeList);
                    }
                  }, (error) => {
                    reject("插入本地非安转产通知错误：" + error);
                  })
                } else {
                  //本地有通知，更新
                  this.cvtDBProvider.updateToCvtNonNotice(notice).then(() => {
                    if (notice.noticeId == lastNoticeId) {
                      resolve(noticeList);
                    }
                  }, (error) => {
                    reject("更新本地非安转产通知错误：" + error);
                  })
                }
              }, (error) => {
                reject("查询本地非安转产通知错误：" + error);
              })
            }
          }
        }, (err) => {
          resolve(null);  //没有网默认没有通知
          //reject("网络连接超时，请确认当前为内网环境");
        });
      }
    });
  }


  /**
   * 根据员工编号和所在单位获得非安转产通知
   * @param noticeId
   */
  getCvtNoticeSubByNoticeId(noticeId:string){
    return new Promise<Array<CvtNonNoticeSub>>((resolve,reject)=>{
      this.cvtWebProvider.getCvtNonNoticeSubList(noticeId).then((data)=>{
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
  insertCvtNonNoticeSubFromServe(noticeId: string) {
    return new Promise((resolve, reject) => {
      this.cvtWebProvider.getCvtNonNoticeSubList(noticeId).then((noticeSubs) => {
        if (noticeSubs==null||noticeSubs.length == 0) {
          resolve();
        } else {
          let lastSubNoticeId=noticeSubs[noticeSubs.length - 1].subNoticeId;
          for (var i = 0; i < noticeSubs.length; i++) {
            let noticeSub = noticeSubs[i];
            this.cvtDBProvider.queryFromCvtNonNoticeSubBySubId(noticeSub.subNoticeId).then((data) => {
              if (data == null) {
                //本地不存在，需要插入
                this.cvtDBProvider.insertToCvtNonNoticeSub(noticeSub).then(() => {
                  if (noticeSub.subNoticeId == lastSubNoticeId) {
                    resolve();
                  }
                }, (error) => reject(error))
              }else{
                if (noticeSub.subNoticeId == lastSubNoticeId) {
                  resolve();
                }
              }
            }, (error) => reject(error))
          }
        }
      }, (error) => reject(error))
    })
  }

  /**
   * 根据转产附加表ID获取资产列表
   * @param subNoticeId 
   */
  getCvtAssetListBySubNoticeId(subNoticeId:string){
    return this.cvtWebProvider.getCvtAssetListBySubNoticeId(subNoticeId);
  }

  /**
   * 修改资产转产通知单状态
   * @param state
   * @param noticeId 
   */
  updateStateToCvtNoticeFromServe(state:string,noticeId:string){
    return this.cvtWebProvider.updateStateToCvtNotice(state,noticeId);
  }



  /**
   * 领用人不再发放，直接保存
   */
  receiverNoGranting(cvtNonNotice: CvtNonNotice, recipient,signaturePath:string, signatureName:string) {
    return new Promise((resolve, reject) => {
      this.cvtWebProvider.receiverNoGranting(cvtNonNotice.noticeId, recipient).then((data) => {
        if (data != null) {
          this.attaWebProvider.uploadSignature(recipient, signaturePath, signatureName, null, data,null, PubConstant.ATTACHMENT_TYPE_SIGNATURE_CVT_RECEIVER2,this.attaWebProvider.UploadType.BASE64).then(() => {

          }, (error) => {
            reject("上传签名失败，请检查网络是否通畅");
          })
        }
        //删除本地通知单
        this.cvtDBProvider.deleteFromCvtNonNoticeByNoticeId(cvtNonNotice.noticeId).then(() => {
          resolve();
        }, error => reject(error));
      }, (error) => {
        this.noticeService.showIonicAlert(error);
        reject(error);
      })
    })
  }

  /**
   * 修改本地的通知单非安设备转产通知单
   * @param cvtNotice 
   */
  updateStateToCvtNotice(cvtNotice:CvtNonNotice){
    return new Promise<string>((resolve,reject)=>{
      this.cvtDBProvider.updateToCvtNonNotice(cvtNotice).then((data)=>{
        resolve("修改成功");
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
          this.cvtDBProvider.updateToCvtNonReceive(cvtNonReceive).then(() => {
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
   * 签名确认后，将资产信息保存到本地，存储资产领用表
   * @param noticeId 
   * @param workInOrg 
   */
  saveCvtAssetsFromServe(workerNumber: string,noticeId:string) {
    return new Promise<Array<CvtNonReceive>>((resolve, reject) => {
      if (workerNumber == null || workerNumber == "") {
        reject("参数为空");
      }
      this.cvtWebProvider.getAllCvtAsset(workerNumber,noticeId).then((nonReceives) => {
        if (nonReceives == null || nonReceives.length == 0) {
          resolve(null);
        } else {
          var lastReveiceId = nonReceives[nonReceives.length - 1].receiveId;
          for (var i = 0; i < nonReceives.length; i++) {
            let nonReceive = nonReceives[i];
            if(nonReceive.receivePerson!=null&&nonReceive.receivePerson!=""){
              //说明该资产已发放
              nonReceive.recordFlag=2;
            }
            this._addOrUpdateToCvtNonReceive(nonReceive).then(() => {
              //插入成功，执行
              if (nonReceive.receiveId == lastReveiceId) {
                //说明插入到了最后一个
                resolve(nonReceives);
              }
            }, (error) => {
              reject(error);
            })
          }
        }
      }, (error) => {
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
        let lastCheckId = changeRecords[changeRecords.length - 1].bizId;
        for (var i = 0; i < changeRecords.length; i++) {
          let changeRecord = changeRecords[i];
          this.pubDBProvider.insertToChangeRecord(changeRecord).then(() => {
            if (changeRecord.bizId == lastCheckId) {
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
   * 同步本地数据到数据库
   * @param cvtNonReceives 
   * @param changeRecords 
   */
  private _syncCvtDBToServer(cvtNonReceives: Array<CvtNonReceive>, noticeId: string) {
    return new Promise((resolve, reject) => {
      if (cvtNonReceives.length == 0) {
        resolve();
      } else {
        //同步并删除本地领用表
        this.cvtWebProvider.syncCvtNonReceiveToServer(cvtNonReceives).then((data) => {
          //判断本地是否还存在未发放数据
          this.cvtDBProvider.queryFromCvtNonReceive(noticeId,0).then((receives) => {
            if (receives.length > 0) {
              //依旧存在未发放资产，继续发放，不修改通知单状态
              //需要修改已经上传的领用单状态，将recordFlag设为2
              for (let i = 0; i < cvtNonReceives.length; i++) {
                let cvtNonReceive = cvtNonReceives[i];
                cvtNonReceive.recordFlag = 2;
                this.cvtDBProvider.updateToCvtNonReceive(cvtNonReceive);
              }
              resolve(data);
            } else {
              this.cvtDBProvider.deleteFromCvtNonReceiveByNoticeId(noticeId).then(() => {
                //更新服务器通知单状态
                this.cvtWebProvider.updateStateToCvtNotice(PubConstant.CVT_NON_NOTICE_STATE_COMPLETED, noticeId).then(() => {
                  //删除本地通知单和附加表
                  this.cvtDBProvider.deleteFromCvtNonNoticeByNoticeId(noticeId).then(() => {
                    this.cvtDBProvider.deleteFromCvtNonNoticeSubByNoticeId(noticeId).then(() => {
                      resolve(data);
                    }, (error) => reject(error))
                  }, (error) => reject(error))
                }, (error) => reject(error))
              }, (error) => reject(error))
            }
          }, (error) => reject(error))
        }, (error) => reject(error))

      }
    })
  }

  //////插入专区///////////
  //插入或更新非安转产领用表
  private _addOrUpdateToCvtNonReceive(cvtNonReceive: CvtNonReceive) {
    return new Promise((resolve, reject) => {
      this.cvtDBProvider.queryFromCvtNonReceiveByReceiveId(cvtNonReceive.receiveId).then((receive) => {
        if (receive == null) {
          this.cvtDBProvider.insertToCvtNonReceive(cvtNonReceive).then(() => {
            resolve();
          }, err => reject(err))
        }else{
          this.cvtDBProvider.updateToCvtNonReceive(cvtNonReceive).then(()=>{
            resolve();
          },err=>reject(err))
        }
      }, err => reject(err))
    })
  }

  //////插入专区END///////////




  //删除专区



  //end
  deleteCvtNoticeAndSub(noticeId){
    this.cvtDBProvider.deleteFromCvtNonNoticeByNoticeId(noticeId).then(()=>{
      this.cvtDBProvider.deleteFromCvtNonNoticeSubByNoticeId(noticeId).then(()=>{
      })
    })
  }




}
