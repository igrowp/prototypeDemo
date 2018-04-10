import { WorkflowWebProvider } from './../../providers/web/workflow.web.provider';
import { CvtWebProvider } from './../../providers/web/cvt.web.provider';
import { TodoEvent, AllocateBill, Asset, IdleBill } from './../../providers/entity/pub.entity';
import { CvtNonNotice, CvtNonNoticeSub } from './../../providers/entity/cvt.entity.provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FixedAsset } from '../../providers/entity/entity.provider';

/**
 * Generated class for the ProcessDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-process-detail',
  templateUrl: 'process-detail.html',
})
export class ProcessDetailPage {
  //公共
  public eventType="";
  public todoEvent:TodoEvent;
  public title:string;
  //公共END


  //转产发放审批
  public assets:Array<FixedAsset>=new Array<FixedAsset>();
  public cvtNonNotice: CvtNonNotice = new CvtNonNotice();
  public cvtNonNoticeSubList: Array<CvtNonNoticeSub>
  //转产发放审批END

  //调拨审批
  public allocateBill:AllocateBill;
  public assetList:Array<Asset>=new Array<Asset>();
  //调拨审批END

  //闲置审批
  public idleBill:IdleBill;
  //public assetList:Array<Asset>=new Array<Asset>();  //已经定义
  //闲置审批END


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private workflowWebProvider:WorkflowWebProvider,
    private cvtWebProvider: CvtWebProvider) {

    this.todoEvent = this.navParams.get("todoEvent");
    switch (this.todoEvent.eventType) {
      case "转产发放通知":
        this.eventType="转产发放通知";
        this.title = "转产发放通知";
        this.cvtNonNotice = this.navParams.get("cvtNonNotice");
        this.cvtNonNoticeSubList = this.navParams.get("cvtNonNoticeSubList");
        break;
      case "资产调拨-气矿内部调拨":
      case "资产调拨-作业区内部调拨":
      case "资产调拨-气矿调入分公司":
      case "资产调拨-分公司调入气矿":
        this.eventType="资产调拨";
        this.allocateBill = this.navParams.get("allocateBill");
        this.assetList = this.navParams.get("assetList");
        this.title = this.allocateBill.allocateType;
        break;
      case "资产闲置认定":
        this.eventType="资产闲置认定";
        this.title = "资产闲置认定";
        this.idleBill = this.navParams.get("idleBill");
        this.assetList = this.navParams.get("assetList");
        break;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProcessDetailPage');
  }

  /**
   * 跳转到审批页面
   */
  handleApprove(){
    this.workflowWebProvider.getNextStepFromServe(this.todoEvent.taskId).subscribe((nextStepInfos)=>{
      if(nextStepInfos.length>=0){
        this.navCtrl.push("ProcessApprovePage",{
          workerNumber:this.navParams.get("workerNumber"),
          nextStepInfos:nextStepInfos,
          todoEvent:this.todoEvent,
        });
      }
    })
  }

  /**
   * 进入详情页面
   * @param noticeSub 
   */
  handleDetail(noticeSub){
    switch(this.todoEvent.eventType){
      case "转产发放通知":
        this.cvtWebProvider.getCvtAssetBySubNoticeId(noticeSub.subNoticeId).then((data)=>{
          this.navCtrl.push("ConvertNonDetailPage",{
            fixedAssets:data,
            CvtNonNoticeSub:noticeSub
          })
        })
        break;
    }
  }

}
