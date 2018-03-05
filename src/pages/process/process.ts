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
  
  private userName;
  private workerNumber;
  constructor(public navCtrl: NavController, 
    private workflowWebProvider:WorkflowWebProvider,
    private noticeService:NoticeService,
    public navParams: NavParams) {
    this.userName=this.navParams.get("userName");
    this.workerNumber=this.navParams.get("workerNumber");
    this.init();
  }

  init(){
    let loading=this.noticeService.showIonicLoading("正在获取数据",10000);
    loading.present();
    this.workflowWebProvider.getTaskListFromServe(this.userName).subscribe((taskList)=>{
      if(taskList!=null&&taskList.length!=0){
        this.todoEventList=taskList;
        this.todoEventList.filter((item)=>{

          if(item.eventType=="转产发放审批"){
            this.convertList.push(item);
          }else if(item.eventType=="调拨审批"){
            this.allocateList.push(item);
          }
        })
        this.hasData=true;
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


  handleDetail(item:TodoEvent){
    if(item.eventType=="转产发放审批"){
      this.navCtrl.push("ProcessDetailPage",{
        userName:this.userName,
        workerNumber:this.workerNumber,
        todoEvent:item
      });
    }else{
      this.noticeService.showIonicAlert("通知单");
    }
    
  }

}
