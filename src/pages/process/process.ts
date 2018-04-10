import { AssetHandleService } from './../../providers/service/asset.handle.service';
import { CvtWebProvider } from './../../providers/web/cvt.web.provider';
import { WorkflowWebProvider } from './../../providers/web/workflow.web.provider';
import { TodoEvent } from './../../providers/entity/pub.entity';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NoticeService } from '../../providers/service/notice.service';

/**
 * Generated class for the ProcessPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-process',
  templateUrl: 'process.html',
})
export class ProcessPage {


  /*
  接口包括：
  1.根据姓名获取审批列表
  2.根据业务ID获取通知单和资产信息
  3.提交审批结果
   */



  public hasData:boolean=true;
  public errorMessage="";
  public todoEventList:Array<TodoEvent>=new Array<TodoEvent>();
  public allocateList:Array<TodoEvent>=new Array<TodoEvent>();
  public convertList:Array<TodoEvent>=new Array<TodoEvent>();
  public idleList:Array<TodoEvent>=new Array<TodoEvent>();
  
  private workerNumber;
  constructor(public navCtrl: NavController, 
    private assetHandleService:AssetHandleService,
    private workflowWebProvider:WorkflowWebProvider,
    private noticeService:NoticeService,
    private cvtWebProvider:CvtWebProvider,
    public navParams: NavParams) {
    this.workerNumber=this.navParams.get("workerNumber");
    this.init();
  }

  init(){
    let loading=this.noticeService.showIonicLoading("正在获取数据",10000);
    loading.present();
    this.workflowWebProvider.getTaskListFromServe(this.workerNumber).subscribe((taskList)=>{
      if(taskList!=null&&taskList.length!=0){
        
        this.todoEventList=taskList;
        this.todoEventList.filter((item)=>{
          switch(item.eventType){
            case "转产发放通知":
              this.convertList.push(item);
              break;
            case "资产调拨-作业区内部调拨":
            case "资产调拨-气矿内部调拨":

            case "资产调拨-气矿调入分公司":
            case "资产调拨-分公司调入气矿":
              this.allocateList.push(item);
              break;
            case "资产闲置认定":
              this.idleList.push(item);
              break;


          }
        })
        this.hasData=true;
        if(this.convertList.length==0&&this.allocateList.length==0&&this.idleList.length==0){
          this.errorMessage="流程功能开发中"
          this.hasData=false;
        }
        loading.dismiss();
      }else{
        this.errorMessage="没有待办流程";
        this.hasData=false;
        loading.dismiss();
      }
    },(error)=>{
      this.hasData=false;
      this.errorMessage="网络连接异常";
      loading.dismiss();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProcessPage');
  }


  handleDetail(item: TodoEvent) {
    switch (item.eventType) {
      case "转产发放通知":
        this.cvtWebProvider.getCvtNoticeByNoticeId(item.eventId).then((notice) => {
          if (notice.noticeId == undefined) {
            this.noticeService.showIonicAlert("获取通知单失败");
            return;
          } else {
            this.cvtWebProvider.getCvtNonNoticeSub(notice.noticeId).then((noticeSubList) => {
              this.navCtrl.push("ProcessDetailPage", {
                workerNumber: this.workerNumber,
                cvtNonNotice: notice,
                cvtNonNoticeSubList: noticeSubList,
                todoEvent: item
              });
            })
          }
        }, (error) => {
          this.noticeService.showIonicAlert("网络连接失败，请确认当前网络");
        })
        break;
      case "资产调拨-气矿内部调拨":
      case "资产调拨-作业区内部调拨":
      case "资产调拨-气矿调入分公司":
      case "资产调拨-分公司调入气矿":
        this.assetHandleService.getAlloBillFromServe(item.eventId).subscribe((allocateBill) => {
          if (allocateBill.allocateId != undefined) {
            this.assetHandleService.getAlloAssetListFromServe(item.eventId).subscribe((assetList) => {
              this.navCtrl.push("ProcessDetailPage", {
                workerNumber: this.workerNumber,
                allocateBill: allocateBill,
                assetList: assetList,
                todoEvent: item
              });
            })
          } else {
            this.noticeService.showIonicAlert("获取通知单失败");
            return;
          }
        }, (error) => {
          this.noticeService.showIonicAlert("网络连接失败，请确认当前网络");
        })
        break;


      case "资产闲置认定":
        this.assetHandleService.getIdleBillFromServe(item.eventId).subscribe((idleBill) => {
          if (idleBill.appPerson != undefined) {
            this.assetHandleService.getIdleAssetListFromServe(item.eventId).subscribe((assetList) => {
              this.navCtrl.push("ProcessDetailPage", {
                workerNumber: this.workerNumber,
                idleBill: idleBill,
                assetList: assetList,
                todoEvent: item
              });
            })
          } else {
            this.noticeService.showIonicAlert("获取通知单失败");
            return;
          }
        }, (error) => {
          this.noticeService.showIonicAlert("网络连接失败，请确认当前网络");
        })

        break;
    }
    
  }

}
