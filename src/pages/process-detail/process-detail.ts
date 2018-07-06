import { AssetWebProvider } from './../../providers/web/asset.web.provider';
import { WorkflowWebProvider } from './../../providers/web/workflow.web.provider';
import { CvtWebProvider } from './../../providers/web/cvt.web.provider';
import { TodoEvent, AllocateBill, Asset, IdleBill, Idle, Scrap, ScrapBill, HandleBill } from './../../providers/entity/pub.entity';
import { CvtNonNotice, CvtNonNoticeSub, CvtNonCheck } from './../../providers/entity/cvt.entity.provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FixedAsset } from '../../providers/entity/entity.provider';
import { NoticeService } from '../../providers/service/notice.service';

/**
 * 流程审批页面-审批详情页
 */

@IonicPage()
@Component({
  selector: 'page-process-detail',
  templateUrl: 'process-detail.html',
})
export class ProcessDetailPage {
  //公共
  public eventType = "";
  public todoEvent: TodoEvent;
  public title: string;
  //公共END


  //转产发放审批
  public assets: Array<FixedAsset> = new Array<FixedAsset>();
  public cvtNonNotice: CvtNonNotice = new CvtNonNotice();
  public cvtNonNoticeSubList: Array<CvtNonNoticeSub>
  //转产发放审批END

  //资产验收单
  public cvtNonCheck: CvtNonCheck = new CvtNonCheck();
  //资产验收单END

  //调拨审批
  public allocateBill: AllocateBill = new AllocateBill();
  public assetList = new Array<any>();
  //调拨审批END

  //闲置审批
  public idleBill: IdleBill = new IdleBill();
  public deviceList:Array<Asset>=new Array<Asset>();    //设备类资产
  public unDeviceList:Array<Asset>=new Array<Asset>();  //非设备类资产
  //闲置审批END

  //报废审批
  public scrapBill: ScrapBill = new ScrapBill();
  public scrapFixList:Array<Asset>=new Array<Asset>();    //固定资产
  public scrapWellList:Array<Asset>=new Array<Asset>();   //油气水井
  //闲置审批END

  //处置审批
  public handleBill: HandleBill = new HandleBill();
  //public assetList:Array<Asset>=new Array<Asset>();  //已经定义
  //处置审批END


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private workflowWebProvider: WorkflowWebProvider,
    private assetWebProvider: AssetWebProvider,
    private noticeService: NoticeService,
    private cvtWebProvider: CvtWebProvider) {

    this.todoEvent = this.navParams.get("todoEvent");
    switch (this.todoEvent.eventType) {
      case "非安设备转产-发放通知单":
        this.eventType = "非安设备转产-发放通知单";
        this.title = "发放通知单";
        this.cvtNonNotice = this.navParams.get("cvtNonNotice");
        this.cvtNonNoticeSubList = this.navParams.get("cvtNonNoticeSubList");
        break;
      case "非安设备转产-资产验收单":
        this.eventType = "非安设备转产-资产验收单";
        this.title = "资产验收单";
        this.cvtNonCheck = this.navParams.get("cvtNonCheck");
        break;
      case "资产调拨-气矿内部调拨":
      case "资产调拨-作业区内部调动":
      case "资产调拨-气矿调入分公司":
      case "资产调拨-分公司调入气矿":
        this.eventType = "资产调拨";
        this.allocateBill = this.navParams.get("allocateBill");
        this.assetList = this.navParams.get("assetList");
        this.title = this.todoEvent.eventType.replace("资产调拨-","")
        break;
      case "资产闲置认定":
        this.assetList = new Array<Idle>();
        this.eventType = "资产闲置认定";
        this.title = "资产闲置认定";
        this.idleBill = this.navParams.get("idleBill");
        this.deviceList = this.navParams.get("deviceList");
        this.unDeviceList = this.navParams.get("unDeviceList");
        break;
      case "资产报废申请":
        this.assetList = new Array<Scrap>();
        this.eventType = "资产报废申请";
        this.title = "资产报废申请";
        this.scrapBill = this.navParams.get("scrapBill");
        this.scrapFixList = this.navParams.get("scrapFixList");
        this.scrapWellList = this.navParams.get("scrapWellList");
        break;
      case "闲置资产处置-内部再利用":
      case "闲置资产处置-分公司调用":
      case "闲置资产处置-对外出售":
      case "报废资产处置":
        this.eventType = "资产处置";
        this.title = this.todoEvent.eventType.replace("闲置资产处置-","");
        this.handleBill = this.navParams.get("handleBill");
        this.assetList = this.navParams.get("assetList");
        break;
      default:
        break;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProcessDetailPage');
  }

  /**
   * 跳转到审批页面
   */
  handleApprove() {
    this.workflowWebProvider.getNextStepFromServe(this.todoEvent.taskId).then((nextStepInfos) => {
      if (nextStepInfos.length >= 0) {
        this.navCtrl.push("ProcessApprovePage", {
          workerNumber: this.navParams.get("workerNumber"),
          nextStepInfos: nextStepInfos,
          todoEvent: this.todoEvent,
        });
      }
    })
  }

  /**
   * 进入详情页面
   * @param item 
   */
  handleDetail(item) {
    let loading = this.noticeService.showIonicLoading("正在获取数据", 10000);
    loading.present();
    switch (this.todoEvent.eventType) {
      case "非安设备转产-发放通知单":
        this.cvtWebProvider.getCvtAssetListBySubNoticeId(item.subNoticeId).then((data) => {
          loading.dismiss();
          this.navCtrl.push("ConvertNonDetailPage", {
            fixedAssets: data,
            CvtNonNoticeSub: item
          })
        }, error => {
          loading.dismiss();
          this.noticeService.showIonicAlert("获取详情页面失败")
        })
        break;
      case "资产调拨-气矿内部调拨":
      case "资产调拨-作业区内部调动":
      case "资产调拨-气矿调入分公司":
      case "资产调拨-分公司调入气矿":
      case "闲置资产处置-内部再利用":
      case "闲置资产处置-分公司调用":
      case "闲置资产处置-对外出售":
      case "报废资产处置":
        this.assetWebProvider.getFixedByAssetId(item.assetId).then((data) => {
          loading.dismiss();
          this.navCtrl.push("ProcessAssetMessagePage", {
            eventType: "资产详情页",
            fixedAsset: data,
          })
        },error=>{
          loading.dismiss();
          this.noticeService.showIonicAlert("获取详情页面失败")
        })
        break;

      case "资产闲置认定":
        this.navCtrl.push("ProcessAssetMessagePage", {
          eventType: this.todoEvent.eventType,
          idle: item
        })
        break;
      case "资产报废申请":
        this.navCtrl.push("ProcessAssetMessagePage", {
          eventType: this.todoEvent.eventType,
          scrap: item
        })
        break;
      default:
        break;
    }
  }

}
