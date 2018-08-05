import { TodoEvent, WorkflowBean, PostRequestResult, NextStepInfo} from './../entity/pub.entity';
import { Injectable } from '@angular/core';
import { HttpService } from '../utils/http/http.service';
/**
 * 与流程审批有关的服务器数据请求
 */
@Injectable()
export class WorkflowWebProvider {
  constructor(private httpService:HttpService) {
  }
  private baseUrl="/workflow"

  /**
   * 从服务器获取工作流任务列表
   * @param workerNumber 
   */
  getTaskListFromServe(workerNumber:string):Promise<Array<TodoEvent>>{
    return this.httpService.get(this.baseUrl + "/task/list", {
      workerNumber
    })
  }

  /**
   * 从服务器获取下一步审批信息
   * @param workerNumber 
   */
  getNextStepFromServe(taskId:string):Promise<Array<NextStepInfo>>{
    return this.httpService.get(this.baseUrl + "/task/info", {
      taskId
    })
  }
  
  /**
   * 提交审批到服务器
   * @param taskId 
   */
  submitToServe(workflowBean:WorkflowBean):Promise<PostRequestResult>{

    let obj: any = {
      taskId: workflowBean.taskId,
      comment: workflowBean.comment,
      outcome: workflowBean.outcome,
      workerNumber: workflowBean.workerNumber,
      rejectTo: workflowBean.rejectTo,
      approveType: workflowBean.approveType,
      nextStepApprovers: workflowBean.nextStepApprovers,
    }
    return this.httpService.post(this.baseUrl+"/submit",obj)
  }

}