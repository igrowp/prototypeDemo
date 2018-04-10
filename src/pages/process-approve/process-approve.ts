import { PubConstant } from './../../providers/entity/constant.provider';
import { WorkflowWebProvider } from './../../providers/web/workflow.web.provider';
import { TodoEvent, NextStepInfo } from './../../providers/entity/pub.entity';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WorkflowBean } from '../../providers/entity/pub.entity';
import { NoticeService } from '../../providers/service/notice.service';

/**
 * 流程审批页面-提交审批结果
 */

@IonicPage()
@Component({
  selector: 'page-process-approve',
  templateUrl: 'process-approve.html',
})
export class ProcessApprovePage {
  public workflowBean: WorkflowBean = new WorkflowBean;
  public nextStepInfos: Array<NextStepInfo>;
  public rejectTo = PubConstant.WORKFLOW_REJECT_TO_APPLICANT; //驳回到

  public selectedApprovers: Array<string> = new Array<string>(); //用于记录选中的下一个审批人

  private workerNumber;
  public todoEvent = new TodoEvent();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private workflowWebProvider: WorkflowWebProvider,
    private noticeService: NoticeService) {
    this.workerNumber = this.navParams.get("workerNumber");
    this.todoEvent = this.navParams.get("todoEvent");
    this.nextStepInfos = this.navParams.get("nextStepInfos");
    if (!this.todoEvent) {
      this.todoEvent = new TodoEvent();
    }
    if (!this.nextStepInfos) {
      this.nextStepInfos = new Array<NextStepInfo>();
    } else {
      //对审批人进行预处理，如果不需要选择下一个审批人直接记录下来
      for (let i = 0; i < this.nextStepInfos.length; i++) {
        if (this.nextStepInfos[i].nextStepApprovers.length == 1) {
          //记录下不需要选择下一个审批人的信息
          this.selectedApprovers.push(this.nextStepInfos[i].nextStepApprovers[0].processInstanceId);
        }
      }
    }
  }

  /**
   * 选择下一个审批人时需要使用的方法
   * @param processInstanceId 流程实例ID
   * @param nodeId 节点ID
   */
  selectOptions(processInstanceId: string, nodeId: string) {
    if (processInstanceId) {
      //去除该节点下选择的审批人信息
      this.selectedApprovers = this.selectedApprovers.filter((item) => {
        let judge = !item.includes(nodeId);
        return judge;
      })
      //添加新的审批人信息
      this.selectedApprovers.push(processInstanceId);
    }
  }

  /**
   * 提交审批
   */
  handleSubmit() {
    if ((this.selectedApprovers.length < this.nextStepInfos.length) && this.workflowBean.outcome == "同意") {
      this.noticeService.showIonicAlert("请选择下一步审批人");
      return;
    }
    if (!this.workflowBean.outcome) {
      this.noticeService.showIonicAlert("请选择审核结果");
      return;
    }
    if (!this.workflowBean.rejectTo && this.workflowBean.outcome == "驳回") {
      this.noticeService.showIonicAlert("请选择驳回到哪一级");
      return;
    }
    this.workflowBean.taskId = this.todoEvent.taskId;
    this.workflowBean.workerNumber = this.workerNumber;
    this.workflowBean.approveType = this.todoEvent.eventType;
    // this.workflowBean.rejectTo  //与页面绑定
    // this.workflowBean.comment  //与页面绑定
    this.workflowBean.nextStepApprovers = JSON.stringify(this.selectedApprovers);
    // switch (this.todoEvent.eventType) {
    //   case "转产发放审批":
    //     this.workflowBean.approveType = "SUBMITNOTICE";
    //     break;
    //   case "调拨审批":
    //     this.workflowBean.approveType = "调拨审批";
    //     break; 
    //   case "闲置审批":
    //     this.workflowBean.approveType = "闲置审批";
    //     break;
    // }
    this.workflowWebProvider.submitToServe(this.workflowBean).subscribe(() => {
      this.noticeService.showIonicAlert("提交成功");
      this.navCtrl.popToRoot();
    })
  }

}
