import { WorkflowWebProvider } from './../../providers/web/workflow.web.provider';
import { TodoEvent } from './../../providers/entity/pub.entity';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WorkflowBean } from '../../providers/entity/pub.entity';
import { NoticeService } from '../../providers/service/notice.service';

/**
 * Generated class for the ProcessApprovePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-process-approve',
  templateUrl: 'process-approve.html',
})
export class ProcessApprovePage {
  public outcome;
  public workflowBean:WorkflowBean=new WorkflowBean;

  private userName;
  public todoEvent=new TodoEvent();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private workflowWebProvider:WorkflowWebProvider,
               private noticeService:NoticeService) {
    this.userName=this.navParams.get("userName");
    this.todoEvent=this.navParams.get("todoEvent");
    if(!this.todoEvent){
      this.todoEvent=new TodoEvent();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProcessApprovePage');
  }


  handleSubmit(){
    if(this.outcome==null){
      this.noticeService.showIonicAlert("请选择审核结果");
      return;
    }else if(this.outcome==0){
      this.workflowBean.outcome="同意";
    }else if(this.outcome==1){
      this.workflowBean.outcome="驳回";
    }
    this.workflowBean.taskId=this.todoEvent.taskId;
    this.workflowBean.userName=this.userName;
    this.workflowBean.nextApprovePerson="";  //没有指定下一个审批人，值为空
    this.workflowBean.approveType
    switch(this.todoEvent.eventType){
      case "发放通知单审批":
        this.workflowBean.approveType="SUBMITNOTICE";
        break;
    }
    this.workflowWebProvider.submitToServe(this.workflowBean).subscribe(()=>{
      this.noticeService.showIonicAlert("提交成功");
      this.navCtrl.popToRoot();
    })
  }

}
