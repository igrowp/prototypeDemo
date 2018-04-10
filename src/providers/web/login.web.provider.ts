import { PubConstant } from './../entity/constant.provider';
import { HttpUtils } from './../utils/httpUtils';
import { UserAccount, User } from './../entity/entity.provider';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginWebProvider{
    constructor(public http: Http) {
  }
  getUrl(){
    return HttpUtils.getUrlFromProperties()+"/login";
  }

    
  /**
   * 根据账号和密码获取员工数据信息
   * @param account 
   * @param password 
   */
  getUserAccountByNameAndPWD(account: string, password: string) {
    let params = "?loginName=" + account + "&loginPWD=" + password;
    return new Promise<UserAccount>((resolve, reject) => {
      this.http.get(this.getUrl() + '/account' + params)
        .map(res => res.json())
        .timeout(PubConstant.HTTP_TIME_OUT_LONG)
        .subscribe((data) => {
          if (JSON.stringify(data) == "{}") {
            resolve(null);
          } else {
            resolve(data);
          }
        }, err => {
          //查询不到数据会进入这个方法
          reject(err);
        })
    })
  }

  /**
   * 根据用户ID获取员工信息
   * @param userId 
   */
  getUserMessage(userId: string) {
    let params = "?userId=" + userId;
    return new Promise<User>((resolve, reject) => {
      this.http.get(this.getUrl() + '/user' + params)
        .map(res => res.json())
        .subscribe((data) => {
          if (JSON.stringify(data) == "{}") {
            resolve(null);
          } else {
            resolve(data);
          }
        }, err => {
          reject(err);
        })
    })
  }

  getUserMessageByWorkerNumber(workerNumber: string) {
    let params = "?workerNumber=" + workerNumber;
    return new Promise<User>((resolve, reject) => {
      this.http.get(this.getUrl() + '/user' + params)
        .map(res => res.json())
        .subscribe((data) => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }


  getUserMessageBySSO(email: string) {
    let params = "?email=" + email;
    return new Promise<User>((resolve, reject) => {
      this.http.get(this.getUrl() + '/user' + params)
        .map(res => res.json())
        .timeout(PubConstant.HTTP_TIME_OUT_SHORT)
        .subscribe((data) => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }


  
}