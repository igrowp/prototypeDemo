import { PubConstant } from './../entity/constant.provider';
import { TodoEvent, WorkflowBean, HttpResult } from './../entity/pub.entity';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/timeout'
import { HttpUtils } from '../utils/httpUtils';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WorkflowWebProvider {
  constructor(public http: Http) {
  }
  getUrl() {
    return HttpUtils.getUrlFromProperties() + "/workflow";
  }

  /**
   * 从服务器获取闲置资产信息
   * @param assetId 
   */
  getTaskListFromServe(userName:String):Observable<Array<TodoEvent>>{
    let params = "?userName=" + userName;
    return this.http.get(this.getUrl() + '/task/list' + params)
        .map(res => res.json());
  }

  /**
   * 提交审批到服务器
   * @param assetId 
   */
  submitToServe(workflowBean:WorkflowBean):Observable<HttpResult>{
    let params = "?taskId=" + workflowBean.taskId+"&comment="+workflowBean.comment+"&outcome="+workflowBean.outcome+"&userName="+workflowBean.userName+"&approveType="+workflowBean.approveType;
    return this.http.get(this.getUrl() + '/submit' + params)
        .map(res => res.json());
  }

}