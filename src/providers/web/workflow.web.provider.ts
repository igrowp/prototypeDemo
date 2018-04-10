import { HttpUtils } from './../utils/httpUtils';
import { TodoEvent, WorkflowBean, PostRequestResult, NextStepInfo} from './../entity/pub.entity';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/timeout'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WorkflowWebProvider {
  constructor(public http: Http) {
  }
  getUrl() {
    return HttpUtils.getUrlFromProperties() + "/workflow";
  }

  /**
   * 从服务器获取工作流任务列表
   * @param workerNumber 
   */
  getTaskListFromServe(workerNumber:string):Observable<Array<TodoEvent>>{
    let params = "?workerNumber=" + workerNumber;
    return this.http.get(this.getUrl() + '/task/list' + params)
        .map(res => res.json());
  }

  /**
   * 从服务器获取下一步审批信息
   * @param workerNumber 
   */
  getNextStepFromServe(taskId:string):Observable<Array<NextStepInfo>>{
    let params = "?taskId=" + taskId;
    return this.http.get(this.getUrl() + '/task/info' + params)
        .map(res => res.json());
  }
  

  /**
   * 提交审批到服务器
   * @param taskId 
   */
  submitToServe(workflowBean:WorkflowBean):Observable<PostRequestResult>{
    let params = "?taskId=" + workflowBean.taskId+"&comment="+workflowBean.comment+"&outcome="+workflowBean.outcome+"&workerNumber="+workflowBean.workerNumber+"&rejectTo="+workflowBean.rejectTo+"&approveType="+workflowBean.approveType+"&nextStepApprovers="+workflowBean.nextStepApprovers;
    return this.http.get(this.getUrl() + '/submit' + params)
        .map(res => res.json());
  }





}