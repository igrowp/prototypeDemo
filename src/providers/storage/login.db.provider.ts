import { SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { DBService } from './db.service';
import { UserAccount, User } from '../entity/entity.provider';

/*
  与登陆有关的本地数据库操作
*/
@Injectable()
export class LoginDBProvider {
  private dataBase: SQLiteObject = null;
  constructor(private dbService:DBService,
  ) {
    this.dbService.getSqliteObject().then((db)=>{
      this.dataBase=db;
      //alert("login==="+this.dbService)
    })
  }

  getDb(){
      return this.dbService;
  }


  ///////////用户信息/////////////////
  /**
     * 根据员工ID获得获得账户信息
     * @param userId
     */
    queryFromUserInfoByUserId(userId: string) {
      return new Promise<User>((resolve, reject) => {
          this.dbService.executeSql('select * from sys_person_info where USER_ID=?', [userId])
              .then((data) => {
                  var userAccount: User = this._getUserInfoFromDBResult(data);
                  resolve(userAccount);
              }, (error) => {
                  reject("数据库操作：\n查询账户信息表失败\n"+error.message);
              })
      })
  }

  /**
     * 根据账号密码获得员工信息
     * @param userName 
     * @param password 
     */
    queryUserInfoByNameAndPWD(userName: string, password: string) {
      return new Promise<User>((resolve, reject) => {
          this.dbService.executeSql(`select info.* 
                                  from sys_login_account login,sys_person_info info
                                  where login.LOGIN_NAME=? AND login.LOGIN_PWD=? AND login.USER_ID=info.USER_ID `, [userName, password])
              .then((data) => {
                  var user: User = this._getUserInfoFromDBResult(data);
                  resolve(user);
              }, (error) => {
                  reject("数据库操作：\n查询用户信息表失败\n"+error.message);
              })
      })
  }

  /**
     * 更新数据到用户信息表中
     * @param user 
     */
    updateToUserInfo(user: User) {
      return new Promise((resolve, reject) => {
          this.dbService.executeSql("update sys_person_info set USER_NAME=?,GENDER=?,AGE=?,WORK_FOR_ORG=?,WFO_ADDRESS=?, WORK_IN_ORG=?,WIO_ADDRESS=?,TELE_PHONE=?,CALL_PHONE=?,E_MAIL=?, NATIONALITY=?,NATIVE_PLACE=?,EDUCATION=?,PROFESSION=?,JOB=?,PRESENT_ADDRESS=?,REMARK=?,WORKER_NUMBER=?,SYNCHRO_TIME=? where USER_ID=?", [user.userName, user.gender, user.age, user.workForOrg, user.wfoAddress, user.workInOrg, user.telePhone, user.callPhone, user.eMail, user.nationatily, user.nativePlace, user.education, user.profession, user.job, user.presentAddress, user.remark, user.workerNumber,user.synchroTime, user.userId])
              .then((data) => {
                  resolve(data);
              })
              .catch((error) => {
                  reject("数据库操作：\n更新用户信息表失败\n"+error.message);
              })
      })
  }

  /**
     * 更新同步数据时间到用户信息表中
     * @param user 
     */
    updateSynchroTimeToUserInfo(workerNumber:string,synchroTime:string) {
        return new Promise((resolve, reject) => {
            this.dbService.executeSql("update sys_person_info set SYNCHRO_TIME=? where WORKER_NUMBER=?", [synchroTime, workerNumber])
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("数据库操作：\n更新用户信息表失败\n"+error.message);
                })
        })
    }

  /**
     * 在用户表中插入数据
     * @param user 
     */
    insertToUserInfo(user: User) {
      return new Promise((resolve, reject) => {
          this.dbService.executeSql('insert into sys_person_info values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [user.userId, user.userName, user.gender, user.age, user.workerNumber, user.workForOrg, user.wfoAddress,
          user.workInOrg, user.wioAddress, user.telePhone, user.callPhone, user.eMail, user.nationatily, user.nativePlace, user.education, user.profession, user.job, user.presentAddress, user.remark,user.synchroTime])
              .then((data) => {
                  resolve(data);
              }, (error) => {
                  reject("数据库操作：\n插入用户表失败\n"+error.message);
              })
      })
  }

  //////////用户信息END//////////////


  ///////////用户账号//////////////////
  /**
    * 根据员工ID查找数据库中是否存在该员工账号信息
    * @param UserId 员工ID
    */
    queryFromAccountByUserId(UserId: string) {

      return new Promise<UserAccount>((resolve, reject) => {
          if (UserId == "" || UserId == null) {
              resolve(null);
              return;
          }
          this.dbService.executeSql('select * from sys_login_account where USER_ID=?', [UserId])
              .then((data) => {
                  var userAccount: UserAccount = this._getAccountFromDBResult(data);
                  resolve(userAccount);
              }, (error) => {
                  reject("数据库操作：\n查询账户表失败\n"+error.message);
              })
      })
  }

  /**
     * 根据账号密码获得账户信息
     * @param userName 
     * @param password 
     */
    queryFromAccountByNameAndPWD(userName: string, password: string) {
      return new Promise<UserAccount>((resolve, reject) => {
          this.dbService.executeSql('select * from sys_login_account where LOGIN_NAME=? and LOGIN_PWD=?', [userName, password])
              .then((data) => {
                  var userAccount: UserAccount = this._getAccountFromDBResult(data);
                  resolve(userAccount);
              }, (error) => {
                  reject("数据库操作：\n查询账户表失败\n"+error.message);
              })
      })
  }

  /**
     * 根据员工编号更新账户信息
     * @param userAccount 员工账户
     */
    updateToAccount(userAccount: UserAccount) {
      return new Promise((resolve, reject) => {
          this.dbService.executeSql("update sys_login_account set LOGIN_NAME=?,LOGIN_PWD=?,ACCT_STATUS=? ,WORKER_NUMBER=? where USER_ID=?", [userAccount.loginName, userAccount.loginPWD, userAccount.acctStatus, userAccount.workerNumber, userAccount.userId])
              .then((data) => {
                  resolve(data);
              })
              .catch((error) => {
                  reject("数据库操作：\n更新账户表失败\n"+error.message);
              })
      })
  }

  /**
     * 在账户表中插入数据
     * @param userAccount 
     */
    insertToAccount(userAccount: UserAccount) {
      return new Promise((resolve, reject) => {
          this.dbService.executeSql('insert into sys_login_account values (?,?,?,?,?)', [userAccount.userId, userAccount.loginName, userAccount.loginPWD, userAccount.acctStatus, userAccount.workerNumber])
              .then((data) => {
                  resolve(data);
              }, (error) => {
                  reject("数据库操作：\n插入账户表失败\n"+error.message);
              })
      })
  }




  ///////////用户账号END//////////////////




  ///////////////查询返回结果//////////////
  /**
     * 从数据库查询结果中返回UserAccount的值
     * @param data 
     */
    private _getAccountFromDBResult(data): UserAccount {
      var userAccount: UserAccount = null;
      if (data.rows.length > 0) {
          userAccount = new UserAccount();
          userAccount.userId = data.rows.item(0).USER_ID;
          userAccount.loginName = data.rows.item(0).LOGIN_NAME;
          userAccount.loginPWD = data.rows.item(0).LOGIN_PWD;
          userAccount.acctStatus = data.rows.item(0).ACCT_STATUS;
          userAccount.workerNumber = data.rows.item(0).WORKER_NUMBER;
      }
      return userAccount;
  }

  /**
     * 从数据库查询结果中返回UserInfo的值
     * @param data 
     */
    private _getUserInfoFromDBResult(data): User {
      var user: User = null;
      if (data.rows.length > 0) {
          user = new User();
          user.userId = data.rows.item(0).USER_ID;
          user.userName = data.rows.item(0).USER_NAME;
          user.gender = data.rows.item(0).GENDER;
          user.age = data.rows.item(0).AGE;
          user.workerNumber = data.rows.item(0).WORKER_NUMBER;
          user.workForOrg = data.rows.item(0).WORK_FOR_ORG;
          user.wfoAddress = data.rows.item(0).WFO_ADDRESS;
          user.workInOrg = data.rows.item(0).WORK_IN_ORG;
          user.wioAddress = data.rows.item(0).WIO_ADDRESS;
          user.telePhone = data.rows.item(0).TELE_PHONE;
          user.callPhone = data.rows.item(0).CALL_PHONE;
          user.eMail = data.rows.item(0).E_MAIL;
          user.nationatily = data.rows.item(0).NATIONALITY;
          user.nativePlace = data.rows.item(0).NATIVE_PLACE;
          user.education = data.rows.item(0).EDUCATION;
          user.profession = data.rows.item(0).PROFESSION;
          user.job = data.rows.item(0).JOB;
          user.presentAddress = data.rows.item(0).PRESENT_ADDRESS;
          user.remark = data.rows.item(0).REMARK;
          user.synchroTime=data.rows.item(0).SYNCHRO_TIME;
      }
      return user;
  }



}
