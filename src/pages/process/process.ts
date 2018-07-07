import { AssetHandleService } from './../../providers/service/asset.handle.service';
import { CvtWebProvider } from './../../providers/web/cvt.web.provider';
import { WorkflowWebProvider } from './../../providers/web/workflow.web.provider';
import { TodoEvent, ScrapBill, IdleBill, AssetChgOwnerBill, AssetChgPropertyBill } from './../../providers/entity/pub.entity';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NoticeService } from '../../providers/service/notice.service';
import { ChangeWebProvider } from '../../providers/web/change.web.provider';

/**
 * 流程审批页面
 */

@IonicPage()
@Component({
  selector: 'page-process',
  templateUrl: 'process.html',
})
export class ProcessPage {

  public hasData: boolean = true;
  public errorMessage = "";
  public todoEventList: Array<TodoEvent> = new Array<TodoEvent>();
  public allocateList: Array<TodoEvent> = new Array<TodoEvent>();  //调拨审批列表
  public convertList: Array<TodoEvent> = new Array<TodoEvent>();   //发放通知单审批列表
  public checkList: Array<TodoEvent> = new Array<TodoEvent>();      //资产验收单审批列表
  public idleList: Array<TodoEvent> = new Array<TodoEvent>();      //闲置审批列表
  public scrapList: Array<TodoEvent> = new Array<TodoEvent>();      //报废处置审批列表
  public handleIdleList: Array<TodoEvent> = new Array<TodoEvent>();      //闲置处置审批列表
  public handleScrapList: Array<TodoEvent> = new Array<TodoEvent>();      //报废处置审批列表

  public chgCustodianList: Array<AssetChgOwnerBill> = new Array<AssetChgOwnerBill>();   //资产责任人变更审批
  public chgPropertyList: Array<AssetChgPropertyBill> = new Array<AssetChgPropertyBill>();   //资产责任人变更审批


  private workerNumber;
  constructor(public navCtrl: NavController,
    private assetHandleService: AssetHandleService,
    private workflowWebProvider: WorkflowWebProvider,
    private noticeService: NoticeService,
    private cvtWebProvider: CvtWebProvider,
    private changeWebProvider: ChangeWebProvider,
    public navParams: NavParams) {
    this.workerNumber = this.navParams.get("workerNumber");
    this.init();
  }

  init() {
    let loading = this.noticeService.showIonicLoading("正在获取数据", 10000);
    loading.present();

    //获取工作流审批任务
    this.workflowWebProvider.getTaskListFromServe(this.workerNumber).then((taskList) => {
      if (taskList != null && taskList.length != 0) {
        this.todoEventList = taskList;
        this.todoEventList.filter((item) => {
          switch (item.eventType) {
            case "非安设备转产-发放通知单":
              this.convertList.push(item);
              break;
            case "非安设备转产-资产验收单":
              this.checkList.push(item);
              break;
            case "资产调拨-作业区内部调动":
            case "资产调拨-气矿内部调拨":
            case "资产调拨-气矿调入分公司":
            case "资产调拨-分公司调入气矿":
              this.allocateList.push(item);
              break;
            case "资产闲置认定":
              this.idleList.push(item);
              break;
            case "资产报废申请":
              this.scrapList.push(item);
              break;
            case "闲置资产处置-内部再利用":
            case "闲置资产处置-分公司调用":
            case "闲置资产处置-对外出售":
              this.handleIdleList.push(item);
              break;

            case "报废资产处置":
              this.handleScrapList.push(item);
              break;

            default:
              break;
          }
        })
        this.hasData = true;
        if (this.convertList.length == 0 && this.checkList.length == 0 && this.allocateList.length == 0 && this.idleList.length == 0 && this.scrapList.length == 0 && this.handleIdleList.length == 0 && this.handleScrapList.length == 0) {
          this.errorMessage = "流程功能开发中"
          this.hasData = false;
        }
      } else {
        this.errorMessage = "暂无待办流程";
        this.hasData = false;
      }
      this.changeWebProvider.getCCBillListFromServe(this.workerNumber).then((ownerBills) => {
        this.changeWebProvider.getCSBillListFromServe(this.workerNumber).then((propertyBills) => {
          loading.dismiss();
          if (ownerBills.length > 0) {
            //有责任人变更数据
            this.chgCustodianList = ownerBills;
          }
          if (propertyBills.length > 0) {
            this.chgPropertyList = propertyBills;
          }
          if (ownerBills.length > 0 || propertyBills.length > 0) {
            this.hasData = true;
          }
        }).catch(() => loading.dismiss())
      }).catch(() => loading.dismiss())
    }).catch((error) => {
      this.hasData = false;
      this.errorMessage = "网络连接异常";
      loading.dismiss();
    })




  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProcessPage');
  }

  /**
   * 进入资产责任人变更申请单
   * @param item 
   */
  handleChgOwnerDetail(item) {
    let loading = this.noticeService.showIonicLoading("正在获取数据", 10000);
    loading.present();
    this.changeWebProvider.getAssetListFromServe(item.chgId).then((assetList)=>{
      loading.dismiss();
      this.navCtrl.push("ProcessChgDetailPage", {
        eventType:"资产责任人变更",
        bill: item,
        assetList: assetList
      });
    }).catch((error) => {
      this.noticeService.showIonicAlert("数据获取失败");
      loading.dismiss();
    })
  }

  /**
   * 进入资产属性状态变更申请单
   * @param item 
   */
  handleChgPropertyDetail(item) {
    let loading = this.noticeService.showIonicLoading("正在获取数据", 10000);
    loading.present();
    this.changeWebProvider.getAssetListFromServe(item.chgId).then((assetList)=>{
      loading.dismiss();
      this.navCtrl.push("ProcessChgDetailPage", {
        eventType:"资产状态变更",
        bill: item,
        assetList: assetList
      });
    }).catch((error) => {
      this.noticeService.showIonicAlert("数据获取失败");
      loading.dismiss();
    })
  }

  

  handleDetail(item: TodoEvent) {
    let loading = this.noticeService.showIonicLoading("正在获取数据", 10000);
    loading.present();
    switch (item.eventType) {
      case "非安设备转产-发放通知单":
        this.cvtWebProvider.getCvtNoticeByNoticeId(item.eventId).then((notice) => {
          if (!notice) {
            this.noticeService.showIonicAlert("获取通知单失败");
            loading.dismiss();
            return;
          } else {
            this.cvtWebProvider.getCvtNonNoticeSubList(notice.noticeId).then((noticeSubList) => {
              loading.dismiss();
              this.navCtrl.push("ProcessDetailPage", {
                workerNumber: this.workerNumber,
                cvtNonNotice: notice,
                cvtNonNoticeSubList: noticeSubList,
                todoEvent: item
              });
            }, (error) => {
              this.noticeService.showIonicAlert("数据获取失败");
              loading.dismiss();
            })
          }
        }, (error) => {
          loading.dismiss();
          this.noticeService.showIonicAlert("网络连接失败，请确认当前网络");
        })
        break;
      case "非安设备转产-资产验收单":
        this.cvtWebProvider.getCvtNonCheckByCheckId(item.eventId).then((cvtNonCheck) => {
          if (!cvtNonCheck) {
            this.noticeService.showIonicAlert("获取通知单失败");
            return;
          } else {
            this.navCtrl.push("ProcessDetailPage", {
              workerNumber: this.workerNumber,
              cvtNonCheck: cvtNonCheck,
              todoEvent: item
            });
          }
          loading.dismiss();
        }, (error) => {
          loading.dismiss();
          this.noticeService.showIonicAlert("网络连接失败，请确认当前网络");
        })
        break;
      case "资产调拨-气矿内部调拨":
      case "资产调拨-作业区内部调动":
      case "资产调拨-气矿调入分公司":
      case "资产调拨-分公司调入气矿":
        this.assetHandleService.getAlloBillFromServe(item.eventId).then((allocateBill) => {
          if (allocateBill.allocateId != undefined) {
            this.assetHandleService.getAlloAssetListFromServe(item.eventId).then((assetList) => {
              loading.dismiss();
              this.navCtrl.push("ProcessDetailPage", {
                workerNumber: this.workerNumber,
                allocateBill: allocateBill,
                assetList: assetList,
                todoEvent: item
              });
            }).catch((error) => {
              this.noticeService.showIonicAlert("数据获取失败");
              loading.dismiss();
            })
          } else {
            loading.dismiss();
            this.noticeService.showIonicAlert("获取通知单失败");
            return;
          }
        }).catch((error) => {
          loading.dismiss();
          this.noticeService.showIonicAlert("网络连接失败，请确认当前网络");
        })
        break;
      case "资产闲置认定":
        this.assetHandleService.getIdleBillFromServe(item.eventId).then((idleBill) => {
          if (idleBill.appPerson != undefined) {
            this.assetHandleService.getIdleDeviceAssetListFromServe(item.eventId).then((deviceList) => {
              this.assetHandleService.getIdleUnDeviceAssetListFromServe(item.eventId).then((unDeviceList) => {
                loading.dismiss();
                this.navCtrl.push("ProcessDetailPage", {
                  workerNumber: this.workerNumber,
                  idleBill,
                  deviceList,
                  unDeviceList,
                  todoEvent: item
                });
              }).catch((error) => {
                loading.dismiss();
                this.noticeService.showIonicAlert("非设备类资产数据获取失败");
              })
            }).catch((error) => {
              loading.dismiss();
              this.noticeService.showIonicAlert("设备类资产数据获取失败");
            })
          } else {
            loading.dismiss();
            this.noticeService.showIonicAlert("获取通知单失败");
            return;
          }
        }).catch((error) => {
          loading.dismiss();
          this.noticeService.showIonicAlert("网络连接失败，请确认当前网络");
        })
        break;
      case "资产报废申请":
        this.assetHandleService.getScrapBillFromServe(item.eventId).then((scrapBill) => {
          if (scrapBill.applyId != undefined) {
            this.assetHandleService.getScrapFixAssetListFromServe(item.eventId).then((scrapFixList) => {
              this.assetHandleService.getScrapWellAssetListFromServe(item.eventId).then((scrapWellList) => {
                loading.dismiss();
                this.navCtrl.push("ProcessDetailPage", {
                  workerNumber: this.workerNumber,
                  scrapBill: scrapBill,
                  scrapFixList: scrapFixList,
                  scrapWellList: scrapWellList,
                  todoEvent: item
                })
              }).catch((error) => {
                loading.dismiss();
                this.noticeService.showIonicAlert("油气水井资产数据获取失败");
              })
            }).catch((error) => {
              loading.dismiss();
              this.noticeService.showIonicAlert("固定资产数据获取失败");
            })
          } else {
            loading.dismiss();
            this.noticeService.showIonicAlert("获取通知单失败");
            return;
          }
        }).catch((error) => {
          loading.dismiss();
          this.noticeService.showIonicAlert("网络连接失败，请确认当前网络");
        })
        break;
      case "闲置资产处置-内部再利用":
      case "闲置资产处置-分公司调用":
      case "闲置资产处置-对外出售":
        this.assetHandleService.getHandleIdleBillFromServe(item.eventId).then((handleBill) => {
          if (handleBill.applyId != undefined) {
            this.assetHandleService.getHandleIdleAssetListFromServe(item.eventId).then((assetList) => {
              loading.dismiss();
              this.navCtrl.push("ProcessDetailPage", {
                workerNumber: this.workerNumber,
                handleBill: handleBill,
                assetList: assetList,
                todoEvent: item
              })
            }).catch((error) => {
              loading.dismiss();
              this.noticeService.showIonicAlert("数据获取失败");
            })
          } else {
            loading.dismiss();
            this.noticeService.showIonicAlert("获取通知单失败");
            return;
          }
        }).catch((error) => {
          loading.dismiss();
          this.noticeService.showIonicAlert("网络连接失败，请确认当前网络");
        })
        break;

      case "报废资产处置":
        this.assetHandleService.getHandleScrapBillFromServe(item.eventId).then((handleBill) => {
          if (handleBill.applyId != undefined) {
            this.assetHandleService.getHandleScrapAssetListFromServe(item.eventId).then((assetList) => {
              loading.dismiss();
              this.navCtrl.push("ProcessDetailPage", {
                workerNumber: this.workerNumber,
                handleBill: handleBill,
                assetList: assetList,
                todoEvent: item
              })
            }).catch((error) => {
              loading.dismiss();
              this.noticeService.showIonicAlert("数据获取失败");
            })
          } else {
            loading.dismiss();
            this.noticeService.showIonicAlert("获取通知单失败");
            return;
          }
        }).catch((error) => {
          loading.dismiss();
          this.noticeService.showIonicAlert("网络连接失败，请确认当前网络");
        })
        break;
      default:
        break;
    }

  }

}
