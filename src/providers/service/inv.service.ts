import { InvNotice, OrgInfo } from './../entity/entity.provider';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { PubDBProvider } from '../storage/pub.db.provider';
import { InvDBProvider } from '../storage/inv.db.provider';
import { InvWebProvider } from '../web/inv.web.provider';
/*
  资产盘点时对于数据的操作
*/
@Injectable()
export class InvService {

  constructor(
    private invWebProvider: InvWebProvider,
    private pubDBProvider: PubDBProvider,
    private invDBProvider: InvDBProvider,
  ) {
  }

  /**
   * 判断盘点通知单是否可用
   * @param invNotice 
   */
  noticeIsAvailable(invNotice): boolean {
    if (invNotice != null && invNotice.state == "ISSUED") {
      //说明本地有通知，判断一下时间，
      var timeStart = new Date(invNotice.timeStart);
      var timeFinish = new Date(invNotice.timeFinish);
      var timeNow = new Date();
      var flag = this.isDateBetween(timeNow, timeStart, timeFinish);
      return flag;
    } else {
      return false;
    }
  }

  /**
   * 获取通知,先从本地寻找，如果本地没有则从服务器进行下载
   */
  getInvNoticeByLeadingOrgFromServe(leadingOrg: string, workerNumber: string) {
    return new Promise<InvNotice>((resolve, reject) => {
      if (leadingOrg == null || leadingOrg == "") {
        resolve(null);
      }
      this.invDBProvider.queryFromInvNoticeByLeadingOrg(leadingOrg).then((dataNotice) => {
        var data: InvNotice = null;
        //说明本地有通知，判断一下时间，
        var flag = this.noticeIsAvailable(dataNotice);
        if (flag) {
          //说明在时间范围内，可以盘点
          data = dataNotice;
        }
        if (data != null) {
          resolve(data);
        } else {
          //说明本地没有通知，向服务器找找
          this.invWebProvider.getInvNoticeByOrg(leadingOrg).then((noticeServer) => {
            var notice: InvNotice = null;
            var flag1 = this.noticeIsAvailable(noticeServer);
            if (flag1) {
              notice = noticeServer;
            }
            if (notice == null) {
              //说明没有存在该通知
              resolve(null);
            } else {
              if (notice.timeStart != null) {
                notice.timeStart = new Date(notice.timeStart);
              }
              if (notice.timeFinish != null) {
                notice.timeFinish = new Date(notice.timeFinish);
              }
              notice.state = "ISSUED";

              //有该通知，看本地数据库是否存储，没有的话存下去
              this.invDBProvider.queryFromInvNoticeByLeadingOrg(notice.leadingOrg).then((invNotice) => {
                if (invNotice == null) {
                  //本地没有存储，存到本地
                  this.invDBProvider.insertToInvNotice(notice).then(() => {
                    resolve(notice);
                    //对该设备下的资产进行初始化
                    this.pubDBProvider.queryAssetsFromFixed(workerNumber).then((fixedAssets) => {
                      if (fixedAssets) {
                        for (let i = 0; i < fixedAssets.length; i++) {
                          let fixedAsset = fixedAssets[i];
                          fixedAsset.isSynchro = 0;
                          fixedAsset.isChecked = 0;
                          this.pubDBProvider.updateToFixed(fixedAsset);
                        }
                      }
                    })
                    //清除本地该作业区下已经盘点的数据
                    // this.invDBProvider.deleteFromInv
                    // this.invDBProvider.deleteFromInv(notice.leadingOrg).then(()=>{
                    //   resolve(notice);
                    // },(error)=>{
                    //   reject(error);
                    // })
                  }, (error) => {
                    reject(error)
                  });
                } else {
                  //每个作业区只会有一个通知记录
                  if (data != null && invNotice.noticeId != data.noticeId) {
                    //说明不是一个通知了，删除本地数据
                    //this.invDBProvider.deleteFromInv(leadingOrg).then();
                  }
                  this.invDBProvider.updateToInvNotice(notice).then(() => {
                    resolve(notice);
                    //对该设备下的资产进行初始化
                    this.pubDBProvider.queryAssetsFromFixed(workerNumber).then((fixedAssets) => {
                      if (fixedAssets) {
                        for (let i = 0; i < fixedAssets.length; i++) {
                          let fixedAsset = fixedAssets[i];
                          fixedAsset.isSynchro = 0;
                          fixedAsset.isChecked = 0;
                          this.pubDBProvider.updateToFixed(fixedAsset);
                        }
                      }
                    })
                  }, (error) => {
                    reject(error);
                  })
                }
              }, error => {
                reject(error);
              })
            }
          }, (error) => {
            reject("网络连接失败，请确认当前为内网环境")
          })
        }
      }, (error) => {
        reject("获取本地通知表失败")
      })
    })

  }

  /**
   * 根据组织编号获取组织信息
   */
  queryFromOrgInfoByOrgCode(orgCode: string) {
    return new Promise<OrgInfo>((resolve, reject) => {
      this.pubDBProvider.queryFromOrgInfoByOrgCode(orgCode).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      })
    })
  }

  /**
   * 根据通知ID获取通知单
   */
  queryFromInvNoticeByLeadingOrg(leadingOrg: string) {
    return new Promise<InvNotice>((resolve, reject) => {
      if (leadingOrg == null || leadingOrg == "") {
        resolve(null);
      }
      this.invDBProvider.queryFromInvNoticeByLeadingOrg(leadingOrg).then((dataNotice) => {
        var data: InvNotice = null;
        //说明本地有通知，判断一下时间，
        var flag = this.noticeIsAvailable(dataNotice);
        if (flag) {
          //说明在时间范围内，可以盘点
          data = dataNotice;
        }
        if (data != null) {
          resolve(data);
        } else {
          resolve(null);
        }
      }, (error) => {
        reject(error);
      })
    })
  }

  ////////////进行时间判断///////////////////////

  /**
 * 日期比较大小
 * timeFinish大于timeStart，返回1；
 * 等于返回0；
 * timeFinish小于timeStart，返回-1
 * @param timeStart 日期
 * @param timeFinish 比较的日期
 */
  private dateCompare(timeStart: Date, timeFinish: Date) {
    if (timeStart == null || timeFinish == null) {
      return -2;
    }
    var start = timeStart.getTime();
    var finish = timeFinish.getTime();
    if (finish > start) {
      return 1;
    } else if (finish == start) {
      return 0;
    } else {
      return -1;
    }

  }

  /**
 * 判断日期是否在区间内，在区间内返回true，否返回false
 * @param timeNow 日期
 * @param timeStart 区间开始日期
 * @param timeFinish 区间结束日期
 * @returns {Number}
 */
  private isDateBetween(timeNow: Date, timeStart: Date, timeFinish: Date) {
    if (timeNow == null || timeStart == null || timeFinish == null) {
      return;
    }
    var flag = false;
    var startFlag = (this.dateCompare(timeNow, timeStart) < 1);
    var endFlag = (this.dateCompare(timeNow, timeFinish) > -1);
    if (startFlag && endFlag) {
      flag = true;
    }
    return flag;
  }

  ////////////进行时间判断END///////////////////////

}
