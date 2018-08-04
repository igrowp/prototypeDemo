import { PubConstant } from './../entity/constant.provider';
import { UserAccount, User } from './../entity/entity.provider';
import { Injectable } from '@angular/core';
import {Http, Headers,RequestOptions}   from '@angular/http';
import { HttpService } from '../utils/http/http.service';
/**
 * 与登录有关的服务器数据请求
 */

@Injectable()
export class LoginWebProvider{
    constructor(private httpService:HttpService,
              private http:Http) {
  }
  private baseUrl="/login"

    
  /**
   * 根据账号和密码获取员工数据信息
   * @param account 
   * @param password 
   */
  getUserAccountByNameAndPWD(account: string, password: string):Promise<UserAccount> {
    return this.httpService.get(this.baseUrl+"/account",{
      loginName:account,
      loginPWD:password
    },PubConstant.HTTP_TIME_OUT_LONG)
  }

  /**
   * 根据用户ID获取员工信息
   * @param userId 
   */
  getUserMessage(userId: string):Promise<User> {
    return this.httpService.get(this.baseUrl+"/user",{
      userId
    })
  }

  /**
   * 根据员工编号获取员工信息
   * @param workerNumber 
   */
  getUserMessageByWorkerNumber(workerNumber: string):Promise<User> {
    return this.httpService.get(this.baseUrl+"/user",{
      workerNumber
    })
  }


  /**
   * 根据邮箱获取员工信息
   * @param email 
   */
  getUserMessageBySSO(email: string):Promise<User> {
    return this.httpService.get(this.baseUrl+"/user",{
      email
    },PubConstant.HTTP_TIME_OUT_SHORT)
  }  

  /**
   * 获取待处理资产项数据
   * @param workerNumber 
   */
  getUntreatedAssets(workerNumber: string) {
    // return this.http.get("http://11.10.97.76:8080/eaam/common/query/toHandleItem?workerNumber="+workerNumber)
    // .map(res => res.json())
    // .toPromise()
    return this.httpService.get("/eaam/common/query/toHandleItem",{
    // return this.httpService.get("http://11.10.97.76:8080/eaam/common/query/toHandleItem",{
      workerNumber
    })
  }
}