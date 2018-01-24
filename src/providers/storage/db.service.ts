import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Properties } from '../properties/properties';
import { NoticeService } from '../service/notice.service';

/*
  该类用于数据库的创建已经数据库版本升级操作
*/
@Injectable()
export class DBService {
  private database: SQLiteObject = null;
  private isOpen: boolean = false;  //判断数据库是否打开
  private newVersion: number;    //数据库版本号
  private oldVersion: number; //获取本地存储的旧版本
  private dbName;     //数据库名称
  private dbLocation; //数据库所在位置


  //更新demo，在表中添加一个字段，数据进行迁移
  // private CREATE_TEMP_TABLE = "alter table sys_person_info_simple rename to _temp_sys_person_info_simple";
  // private CREATE_TABLE = `create table sys_person_info_simple(
  //   WORKER_NUMBER varchar(20),
  //   USER_NAME varchar(100),
  //   WORK_IN_ORG varchar(32),
  //   USER_ID varchar(32),
  //   AGE integer
  //   );`;
  // private INSERT_DATA = "insert into sys_person_info_simple select *,'' from _temp_sys_person_info_simple";
  // private DROP_TABLE = "drop table _temp_sys_person_info_simple";

  



  constructor(private sqlite: SQLite,
             private storage:Storage,
             private noticeService:NoticeService) {
    //设定本次数据库的版本号
    this.newVersion = Properties.dbConfig.version;
    this.dbName = Properties.dbConfig.name;
    this.dbLocation = Properties.dbConfig.location
    this.initDB();
  }
  /**
   * 初始化数据库，用于第一次登陆时候操作，创建或升级数据库
   */
  initDB(){
    return new Promise<SQLiteObject>((resolve,reject)=>{
      this.onCreate().then((db)=>{
        this.onUpgrade();
        //alert("初始化数据库")
        //alert("数据库"+db);
        resolve(db);
      },(err)=>{reject(err)})
    })
  }


  /**
   * 初始化判断
   * 并没有将新版本记录到本地数据库中
   */
  onCreate() {
    return new Promise<SQLiteObject>((resolve, reject) => {
      //获取本地数据库中的版本
      this.storage.get("dbVersion").then((version) => {
        if (version) {
          this.oldVersion = version;
          if (!this.database) {
            this.openDB().then((db) => {
              resolve(db);
            }, err => { reject(err.message) });
          }else{
            resolve(this.database);
          }
        } else {
          //本地没有存储该数据库版本,初始化数据
          //alert("创建数据库");
          this.createDB().then(() => {
            this.storage.set("dbVersion", 1.0).then((db) => {
              this.oldVersion = 1.0;  //设置初始数据库版本号为1.0版本
              resolve(db);
            }, err => { reject("写入数据库版本错误" + err.message) });
          })
        }
      })
    })
  }

  //查询数据库
  executeSql(sql:string,params:any){
    return this.database.executeSql(sql, params);
  }


  /**
   * 数据库升级操作
   */
  onUpgrade() {
    //数据库版本不同，需要进行升级
    if (this.newVersion > this.oldVersion) {
      switch (this.oldVersion) {
        //升级数据库demo
        //注意数据库升级是根据当前版本升级到最新数据库的，对于每一次升级都是建立在1.0修改版本基础上，而不是建立在上个版本的，所以不要忘记将前面版本的改动进行添加。
        // case 1.0:
        //   this.database.executeSql(this.CREATE_TEMP_TABLE, {});
        //   this.database.executeSql(this.CREATE_TABLE, {});
        //   this.database.executeSql(this.INSERT_DATA, {});
        //   this.database.executeSql(this.DROP_TABLE, {});
        //   this.storage.set("dbVersion", this.newVersion);
        //   break;
      }
    }else if(this.newVersion < this.oldVersion){
      //低版本覆盖高版本的情况
      //先不做，目前思路是重新创建数据库,弹出提示框，是否愿意这样做
      //this.noticeService.showIonicAlertWithTitle("提示","低版本数据库覆盖高版本数据库，将清空数据库信息！")

    }
  }



  /////////数据库操作方法//////////////
  getSqliteObject(){
    return new Promise<SQLiteObject>((resolve,reject)=>{
      if(this.database){
        resolve(this.database)
      }else{
        //alert("打开数据库");
        this.openDB().then((db)=>{
          this.database=db;
          resolve(this.database);
        })
      }
    })
    
  }
  /**
     * 打开数据库
     */
  openDB() {
    return new Promise<SQLiteObject>((resolve, reject) => {
      if (this.database) {
        resolve(this.database)
      } else {
        this.sqlite.create({
          name: this.dbName,
          location: this.dbLocation
        }).then((db: SQLiteObject) => {
          //alert("打开数据库"+db);
          db.open().then((data) => {
            this.database = db;
            this.isOpen = true;
            resolve(db);
          });
        });
      }
    })
  }

  /**
   * 关闭数据库
   */
  closeDB() {
    return new Promise<boolean>((resolve, reject) => {
      if (this.isOpen) {
        this.database.close().then(() => {
          // alert("关闭成功");
          this.database = null;
          this.isOpen = false;
          resolve(true);
        }, error => {
          reject("关闭失败：" + error.message);
        });
      } else {
        resolve(true);
      }
    })
  }

  /**
   * 删除数据库操作
   * @param dbName  数据库名称 
   * @param dbLocation  数据库所在位置
   */
  deleteDB() {
    this.sqlite.deleteDatabase({
      name: this.dbName,
      location: this.dbLocation
    }).then(() => {
      this.storage.remove("dbVersion").then(() => {
        alert("删除数据库成功!");
      })
    })
  }
  /////////数据库操作方法END//////////////

  ////////存储到localStorage////////////
    /**
       * 向本地存储写入键值对
       * @param key 
       * @param value 
       */
      setInStorage(key: string, value: string) {
        return this.storage.set(key, value);
    }

    /**
     * 从本地存储中读取
     * @param key 
     */
    getFromStorage(key: string) {
        return this.storage.get(key);
    }
    /**
     * 删除本地存储的key键值对
     * @param key 
     */
    removeFromStorage(key: string) {
        return this.storage.remove(key);
    }
    ////////存储到localStorage结束////////////





  ////////初始化数据库///////////////

  /**
   * 数据库初始化
   */
  private createDB() {
    return new Promise<SQLiteObject>((resolve, reject) => {
      this.sqlite.create({
        name: this.dbName,
        location: this.dbLocation
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.isOpen = true;

        //创建资产盘点记录表
        db.executeSql('drop table if exists inv_asset_record', {});
        db.executeSql(`create table inv_asset_record
 (INV_RECORD_ID varchar(32) PRIMARY KEY,
  ASSET_ID varchar(32),
  NOTICE_ID varchar(32),
  WORKER_NUMBER varchar(20),
  MANAGER varchar(32),
  TECH_STATUS varchar(32),
  USE_STATE varchar(32),
  INSTALL_LOCATION varchar(100),
  SECURITY_STATE varchar(100),
  SECURITY_STATE_DESC varchar(100),
  USE_ORG varchar(100),
  USE_ORG_NAME varchar(100),
  HANDLE_SCRAP_MODE varchar(32),
  HANDLE_DATE varchar(32),
  HANDLE_REASON varchar(512),
  PROFIT_LOSS decimal,
  PROFIT_LOSS_CAUSE varchar(100),
  TIME_STAMP timestamp,
  ASSET_NAME varchar(32),
  ASSET_TYPE varchar(32),
  IS_SIGNATURED varchar(2) default '0',
  REMARK varchar(100),
  PHOTO_PATH varchar(512),
  SIGNATURE_PATH varchar(128),
  SIGNATURE varcahr(32),
  PRE_WORKER_NUMBER varchar(32))`, {})//建表
          .then(() => console.log('创建资产盘点记录表成功！'))
          .catch(e => alert("创建资产盘点记录表" + e.message));

        //建立本地固定资产台账表
        db.executeSql('drop table if exists asset_account_fixed', {});
        db.executeSql(`create table asset_account_fixed
              (ASSET_ID varchar(32) PRIMARY KEY,
ASSET_NAME varchar(100),
ASSET_TYPE varchar(32),
ASSET_CATEGORY varchar(32),
ASSET_CLASS varchar(32),
SPEC_MODEL varchar(100),
LICENSEPLAT_WELLNO varchar(100),
WORK_FOR_ORG varchar(32),
WORK_IN_ORG varchar(32),
SUBORDINATE_BLOCK varchar(32),
PRODUCTION_TIME datetime,
TECH_STATUS varchar(32),
USE_STATE varchar(32),
MANUFACTURE_DATE datetime,
INCREASE_DATE datetime,
INCREASE_REASON varchar(512),
UNIT varchar(32),
QUANTITY integer,
YARD_STATUS varchar(32),
ASSET_GROUP varchar(32),
REMAINING_LIFE integer,
NET_WORTH decimal(20,8),
WORKER_NUMBER varchar(20),
CUSTODIAN varchar(32),
INSTALL_LOCATION varchar(512),
REMARK varchar(512),
TWO_DIMENSION_CODE varchar(100),
RFID varchar(100),
RECORD_FLAG integer DEFAULT '0',
IS_CHECKED varchar(4) DEFAULT '0',
IS_TRANS varchar(4) DEFAULT '0',
SELF_NUMBER varchar(100),
ASSET_CODE varchar(32),
ORIGINAL_VALUE deciman(20,8),
SINGLE_QUANTITY deciman(16,2),
COMPLEX_QUANTITY deciman(16,2),
CERTIFICATE_NUMBER varchar(100),
SECURITY_STATE varchar(32),
CHANGE_CUSTODIAN varchar(32),
CHANGE_WORKER_NUMBER varchar(20),
MANUFACTURER varchar(100),
SERIAL_NUMBER varchar(100),
FUND_CHANNEL varchar(100))`, {})//建表
          .then(() => console.log('建立本地固定资产台账表成功！'))
          .catch(e => alert(e.message));
        //创建账户表
        db.executeSql('drop table if exists sys_login_account', {});
        db.executeSql(`create table sys_login_account
(USER_ID varchar(32) PRIMARY KEY,
LOGIN_NAME varchar(100),
LOGIN_PWD varchar(100),
ACCT_STATUS varchar(32),
WORKER_NUMBER varchar(20))`, {})//建表
          .then(() => console.log('创建账户表成功！'))
          .catch(e => alert(e.message));

        //创建用户信息表
        db.executeSql('drop table if exists sys_person_info', {});
        db.executeSql(`create table sys_person_info
        (USER_ID varchar(32) PRIMARY KEY,
        USER_NAME varchar(100),
        GENDER char,
        AGE integer,
        WORKER_NUMBER varchar(20),
        WORK_FOR_ORG varchar(32),
        WFO_ADDRESS varchar(100),
        WORK_IN_ORG varchar(32),
        WIO_ADDRESS varchar(100),
        TELE_PHONE varchar(20),
        CALL_PHONE varchar(20),
        E_MAIL varchar(100),
        NATIONALITY varchar(32),
        NATIVE_PLACE varchar(20),
        EDUCATION varchar(32),
        PROFESSION varchar(100),
        JOB varchar(20),
        PRESENT_ADDRESS varchar(100),
        REMARK varchar(512),
        SYNCHRO_TIME varchar(32))`, {})//建表
          .then(() => console.log('创建用户信息表成功！'))
          .catch(e => alert(e.message));

        //创建日志表
        db.executeSql('drop table if exists asset_change_record', {});
        db.executeSql(`create table asset_change_record
        (ASSET_ID varchar(32),
        CHANGE_TYPE varchar(32),
        CHANGE_DETAIL varchar(512),
        DUTY_ORG varchar(32),
        CHANGE_PERSON varchar(32),
        CHANGE_TIME timestamp,
        STATE varchar(20))`, {})//建表
          .then(() => console.log('创建组织结构表成功！'))
          .catch(e => alert(e.message));


        //创建组织结构表
        db.executeSql('drop table if exists sys_org_info', {});
        db.executeSql(`create table sys_org_info
        (ORG_ID varchar(32),
        ORG_FULL_NAME varchar(100),
        ORG_CODE varchar(32),
        ORG_NAME varchar(100),
        PARENT_ORG_ID varchar(32),
        RECORD_FLAG integer)`, {})//建表
          .then(() => console.log('创建组织结构表成功！'))
          .catch(e => alert(e.message));

        //创建员工精简信息表
        db.executeSql('drop table if exists sys_person_info_simple', {});
        db.executeSql(`create table sys_person_info_simple
        (WORKER_NUMBER varchar(20),
        USER_NAME varchar(100),
        WORK_IN_ORG varchar(32),
        USER_ID varchar(32))`, {})//建表
          .then(() => console.log('创建员工精简信息表成功！'))
          .catch(e => alert(e.message));

        //创建盘点通知表
        db.executeSql('drop table if exists inv_notice', {});
        db.executeSql(`create table inv_notice
        (NOTICE_ID varchar(32) PRIMARY KEY,
        TITLE varchar(100),
        CONTENT varchar(512),
        LEADING_ORG varchar(100),
        INITIATOR varchar(32),
        TIME_START datetime,
        TIME_FINISH datetime,
        STATE varchar(32))`, {})//建表
          .then(() => {
            console.log('创建盘点通知表成功！');
          })
          .catch(e => alert(e.message));
        //创建非安领用通知表
        db.executeSql('drop table if exists cvt_noninstall_notice', {});
        db.executeSql(`create table cvt_noninstall_notice
        (NOTICE_ID varchar(32) PRIMARY KEY,
        INVESTPLAN_ID varchar(32),
        ORG_NAME varchar(32),
        WORK_ORDER_NUMBER varchar(100),
        RECIPIENT varchar(32),
        STOREROOM_KEEPER varchar(32),
        NOTICE_STATE varchar(32),
        RECORD_FLAG int)`, {})//建表
          .then(() => {
            console.log('创建非安领用通知表成功！');
          })
          .catch(e => alert(e.message));

        //创建非安领用通知表
        db.executeSql('drop table if exists cvt_noninstall_notice_sub', {});
        db.executeSql(`create table cvt_noninstall_notice_sub
    (SUB_NOTICE_ID varchar(32) PRIMARY KEY,
    NOTICE_ID varchar(32),
    PURCHASING_ID varchar(32),
    MATERIAL_CODE varchar(100),
    ASSET_NAME varchar(100),
    SPEC_MODEL varchar(100),
    UNIT varchar(32),
    SENT_QUANTITY int,
    PRICE decimal(20,8),
    AMOUNT decimal(20,8),
    STORAGE_DATE datetime,
    OUT_DATE datetime,
    RECORD_FLAG int)`, {})//建表
          .then(() => {
            console.log('创建非安领用通知表成功！');
          })
          .catch(e => alert(e.message));

        //创建非安设备转产资产领用表
        db.executeSql('drop table if exists cvt_noninstall_receive', {});
        db.executeSql(`create table cvt_noninstall_receive
        (RECEIVE_ID varchar(32) PRIMARY KEY,
        NOTICE_ID varchar(32),
        ASSET_ID varchar(32),
        ASSET_CODE varchar(100),
        ASSET_NAME varchar(100),
        SPEC_MODEL varchar(100),
        RECEIVE_ORG varchar(32),
        RECEIVE_PERSON varchar(32),
        RECEIVE_TIME datetime,
        RECEIVE_STYLE varchar(32),
        RECORD_FLAG int DEFAULT 0,
        RECEIVE_NAME varchar(32),
        SIGNATURE_PATH varchar(128),
        SIGNATURE_NAME varcahr(32))`, {})//建表
          .then(() => console.log('创建非安设备转产资产领用表成功！'))
          .catch(e => alert(e.message));

        //创建数据字典
        db.executeSql('DROP TABLE IF EXISTS sys_dict', {});
        db.executeSql(`CREATE TABLE sys_dict (
          DICT_ID varchar(32) NOT NULL,
          CATEGORY_CODE varchar(100) DEFAULT NULL,
          CATEGORY_DESC varchar(100) DEFAULT NULL,
          RECORD_FLAG int(11) DEFAULT '0',
          PRIMARY KEY (DICT_ID)
        )`, {})//建表
          .then(() => console.log('创建数据字典成功！'))
          .catch(e => alert(e.message));

          //创建数据字典附加表
        db.executeSql('DROP TABLE IF EXISTS sys_dict_detail', {});
        db.executeSql(`CREATE TABLE sys_dict_detail (
          DICT_DETAIL_ID varchar(32) NOT NULL,
          CATEGORY_CODE varchar(100) DEFAULT NULL,
          DICT_CODE varchar(100) DEFAULT NULL,
          DICT_CODE_DESC varchar(100) DEFAULT NULL,
          CODE_TYPE varchar(20) DEFAULT NULL,
          CODE_SIZE varchar(20) DEFAULT NULL,
          REMARK varchar(100) DEFAULT NULL,
          RECORD_FLAG int(11) DEFAULT '0',
          PRIMARY KEY (DICT_DETAIL_ID)
        ) `, {})//建表
          .then(() => {
            console.log('创建数据字典附加表成功！');
            resolve(db);
          })
          .catch(e => alert(e.message));

      }).catch(e => {
        alert(e.message);
      });

    })//END Promise
  }
  ////////初始化数据库结束///////////
}
