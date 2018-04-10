import { FileService } from './../../providers/service/file.service';
import { ConvertUtil } from './../../providers/utils/convertUtil';
import { AssetHandleService } from './../../providers/service/asset.handle.service';
import { Scrap, Idle } from './../../providers/entity/pub.entity';
import { PubConstant } from './../../providers/entity/constant.provider';
import { DataBaseUtil } from './../../providers/utils/dataBaseUtil';
import { AssetService } from '../../providers/service/asset.service';
import { NoticeService } from '././../../providers/service/notice.service';
import { InvService } from '././../../providers/service/inv.service';
import { Camera } from '@ionic-native/camera';
import { ChangeRecord, FixedAsset, InvAsset } from './../../providers/entity/entity.provider';
import { Component } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import { DictDetail } from '../../providers/entity/pub.entity';

/**
 * Generated class for the EquipMessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inv-asset-message',
  templateUrl: 'inv-asset-message.html',
})
export class InvAssetMessagePage {
  //html绑定变量
  public segment = "changeMessage";
  public photoBase64s:Array<string> = new Array<string>();  //记录选择图片的base64格式，用于选择后的显示
  private photoPaths: Array<string> = new Array<string>();  //记录选择图片的路径，用于存储选择的图片路径
  public fixedAsset: FixedAsset = new FixedAsset();
  public invAsset: InvAsset = new InvAsset();
  public manufactureDate: any;   //出厂日期
  public productionTime: any;    //投产日期      
  public dateNow = ConvertUtil.formatDate(new Date());
  public techStates:Array<DictDetail>;  //技术状况的列表
  public useStates:Array<DictDetail>;  //技术状况的列表
  public securityStates:Array<DictDetail>;  //技术状况的列表
  
  public scrap:Scrap=new Scrap();  //报废记录信息
  public idle:Idle=new Idle();     //闲置记录信息

  public isIdle:boolean=false;   //判断该资产是否已经是闲置资产
  public isScrap:boolean=false;  //判断该资产是否已经是报废资产


  //html绑定变量END

  private originalInvAsset: InvAsset = new InvAsset();
  private changeDetail = null;  //用于记录修改细节，插入到日志中
  private workerNumber;
  private invNoticeId;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,
    public assetService: AssetService,
    private assetHandleService:AssetHandleService,
    private fileService:FileService,
    private camera: Camera,
    private noticeService: NoticeService,
    private invService: InvService) {
    this.segment = "changeMessage";

    //初始化数据
    this.fixedAsset = navParams.get("fixedAsset");
    this.invAsset = navParams.get("invAsset");
    this.invNoticeId = navParams.get("invNoticeId");
    this.workerNumber = navParams.get("workerNumber");
    if (this.invAsset == null) {
      this.invAsset = new InvAsset();
    }else{
      if(this.invAsset.photoPath!=null&&this.invAsset.photoPath!=""){
        this.photoPaths=JSON.parse(this.invAsset.photoPath);
        //解析为base64并展示
        for(let i=0;i<this.photoPaths.length;i++){
          ConvertUtil.fileUrlToBase64(this.photoPaths[i]).then((dataUrl)=>{
            this.photoBase64s.push(dataUrl);
          })
        }
      }
    }
    if (this.fixedAsset == null) {
      this.fixedAsset = new FixedAsset();
    } else {
      this.invAsset.manager = this.fixedAsset.custodian;
      this.invAsset.workerNumber = this.fixedAsset.workerNumber;
      this.invAsset.installLocation=this.fixedAsset.installLocation;
      if (!this.invAsset.useOrg) {
        //没有所在单位
        this.invService.queryFromOrgInfoByOrgCode(this.fixedAsset.workForOrg).then((data) => {
          this.invAsset.useOrg = this.fixedAsset.workForOrg;
          this.invAsset.useOrgName = data.orgName;
          this.originalInvAsset = this.recordData(this.invAsset);
        })
      } else {
        this.originalInvAsset = this.recordData(this.invAsset);
      }

      //判断是否为闲置或报废资产
      if(this.fixedAsset.useState==PubConstant.DICT_SUB_TYPE_IDLE){
        this.isIdle=true;
      }
      if(this.fixedAsset.techStatus==PubConstant.DICT_SUB_TYPE_SCRAP){
        this.isScrap=true;
      }
    }

  
    this.initSelectOptions();

    
  }
  //从数据字典中读取数据，展示在页面中
  initSelectOptions(){
    this.assetService.queryListFromDictDetailByCategoryCode(PubConstant.DICT_TYPE_TECH_STATE).then((techs)=>{
      if(techs){
        this.techStates=techs;
      }
    })
    this.assetService.queryListFromDictDetailByCategoryCode(PubConstant.DICT_TYPE_USE_STATE).then((techs)=>{
      if(techs){
        this.useStates=techs;
      }
    })
    this.assetService.queryListFromDictDetailByCategoryCode(PubConstant.DICT_TYPE_SECURITY_STATE).then((techs)=>{
      if(techs){
        this.securityStates=techs;
      }
    })
  }

  getInitAsset(){
    //下面为增加资产盘点记录，出下面信息外，其他资产信息会跟着输入进行改变。
    this.invAsset.assetId = this.fixedAsset.assetId;
    this.invAsset.noticeId = this.invNoticeId;
    this.invAsset.useState = this.fixedAsset.useState;
    this.invAsset.techStatus = this.fixedAsset.techStatus;
    this.invAsset.securityState = this.fixedAsset.securityState;
    //this.invAsset.installLocation;
    // this.invAsset.useOrg;   //
    // this.invAsset.handleScrapMode=?
    //this.invAsset.handleDate;

    // this.invAsset.workerNumber=this.workerNumber;//后续要选择员工编号
    if (this.invAsset.workerNumber == null) {
      this.invAsset.workerNumber = this.workerNumber;
    }

    this.invAsset.timeStamp = new Date().getTime();
    this.invAsset.invRecordId = DataBaseUtil.generateUUID();
    if (this.invAsset.manager != this.fixedAsset.custodian) {
      this.fixedAsset.changeCustodian = this.invAsset.manager;
    }
    if (this.invAsset.workerNumber != this.fixedAsset.custodian) {
      this.fixedAsset.changeWorkerNumber = this.invAsset.workerNumber;
    }
    this.invAsset.assetName = this.fixedAsset.assetName;
    this.invAsset.assetType = this.fixedAsset.assetType;
    this.invAsset.isSignatured = 1;
    this.invAsset.preWorkerNumber = this.fixedAsset.workerNumber;
    // securityStateDesc;
    // useOrgName;
    // profitLoss;
    // profitLossCause;
    // remark;
    if (this.photoPaths.length == 0) {
      //说明没有选择图片
      this.invAsset.photoPath = "";
    } else {
      this.invAsset.photoPath = JSON.stringify(this.photoPaths);
    }

    //更新资产台账信息
    this.fixedAsset.installLocation = this.invAsset.installLocation;
    this.fixedAsset.isChecked = 1;
  }



  //提交修改        部分数据待确认
  submit() {
    //获得修改后的盘点信息/更新的台账信息
    this.getInitAsset();
    //增加日志
    let changeRecord=this.getChangeRecord(this.originalInvAsset, this.invAsset);
    //保留报废或者闲置表
    this.initIdleOrScrap();
    this.assetService.queryAssetFromInvByIdAndNoticeId(this.invAsset.assetId, this.invNoticeId).then((data) => {
      if (data == null) {
        //说明资产盘点记录表中没有该资产数据，需要插入
        this.assetService.updateToFixed(this.fixedAsset).then((data) => {
          this.assetService.insertToInv(this.invAsset).then((data) => {
            if (this.changeDetail != "") {
              //有日志更改，需要修改日志信息
              this.assetService.queryFromChangeRecordByAssetId(this.fixedAsset.assetId).then((data) => {
                if (data == null) {
                  //说明没有该条记录的日志，插入
                  this.assetService.insertToChangeRecord(changeRecord);
                } else {
                  this.assetService.updateToChangeRecord(changeRecord);
                }
              })
            }
          })
        })
      } else {
        this.assetService.updateToFixed(this.fixedAsset).then((data) => {
          this.assetService.updateToInv(this.invAsset).then((data) => {
            //在修改记录表中添加数据
            if (this.changeDetail != "") {
              //有日志更改，需要修改日志信息
              this.assetService.queryFromChangeRecordByAssetId(this.fixedAsset.assetId).then((data) => {
                if (data == null) {
                  //说明没有该条记录的日志，插入
                  this.assetService.insertToChangeRecord(changeRecord);
                } else {
                  this.assetService.updateToChangeRecord(changeRecord);
                }
              })
            }

          })
        })
      }
      this.noticeService.showIonicAlert("提交成功");
    })
    this.navCtrl.pop();
  }


  /**
   * 如果有报废或者闲置表，保留下来
   */
  initIdleOrScrap(){
    //初始化闲置表,保留到本地
    if(this.isIdle==false&&this.fixedAsset.useState==PubConstant.DICT_SUB_TYPE_IDLE){
      this.assetHandleService.getIdleByAssetId(this.fixedAsset.assetId).then((data)=>{
        this.idle.assetId=this.fixedAsset.assetId;
          this.idle.applyState=PubConstant.APPLY_STATE_NULL;
          this.idle.recordFlag=0;
        if(data==null){
          //没有，插入
          this.idle.idleId=DataBaseUtil.generateUUID();
          this.assetHandleService.addToIdle(this.idle);
        }else{
          this.idle.idleId=data.idleId;
          this.assetHandleService.updateToIdle(this.idle);
        }
      })
    }
    //初始化报废表,保留到本地
    if(this.isScrap==false&&this.fixedAsset.techStatus==PubConstant.DICT_SUB_TYPE_SCRAP){
      this.assetHandleService.getScrapByAssetId(this.fixedAsset.assetId).then((data)=>{
        this.scrap.assetId=this.fixedAsset.assetId;
          this.scrap.applyState=PubConstant.APPLY_STATE_NULL;
          this.scrap.recordFlag=0;
        if(data==null){
          //没有，插入
          this.scrap.scrapId=DataBaseUtil.generateUUID();
          this.assetHandleService.addToScrap(this.scrap);
        }else{
          this.scrap.scrapId=data.scrapId;
          this.assetHandleService.updateToScrap(this.scrap);
        }
      })
    }
  }



  //////////////日志方法//////////////////////////////

  /**
   * 拷贝初始盘点表，为日志做准备
   * @param invAsset 
   */
  recordData(invAsset: InvAsset) {
    var preInvAsset = new InvAsset();
    if (invAsset != null) {
      preInvAsset.techStatus = invAsset.techStatus;
      preInvAsset.useState = invAsset.useState;
      preInvAsset.securityState = invAsset.securityState;
      preInvAsset.handleDate = invAsset.handleDate;
      preInvAsset.installLocation = invAsset.installLocation;
      preInvAsset.manager = invAsset.manager;
      preInvAsset.useOrgName = invAsset.useOrgName;
      preInvAsset.handleReason = invAsset.handleReason;
      preInvAsset.securityState = invAsset.securityState;
    }
    return preInvAsset;
  }

  /**
   * 在做记录表的时候对未进行初始化的数据初始化
   * @param data 
   */
  initDataIfNull(data) {
    if (data) {
      return data;
    } else {
      return "";
    }
  }

  //根据字典code获得文字信息
  getDictCodeDesc(dictDetails:Array<DictDetail>,code:string){
    if(code){
      var filter=dictDetails.filter((item)=>{
        return item.dictCode==code;
      })
      if(filter.length>0){
        return filter[0].dictCodeDesc;
      }else{
        return "";
      }
    }else{
      return "";
    }
  }

  /**
   * 获得修改的日志信息
   * @param preItem 
   * @param lastItem 
   */
  getChangeRecord(preItem: InvAsset, lastItem: InvAsset){
    //增加日志
    this.changeDetail = this._getChangeRecordDetail(this.originalInvAsset, this.invAsset);
    let changeRecord;
    if (this.changeDetail != "") {
      changeRecord = new ChangeRecord();
      changeRecord.bizId = this.fixedAsset.assetId;
      changeRecord.changeDetail = this.changeDetail;
      changeRecord.changePerson = this.workerNumber;
      changeRecord.changeTime = new Date().getTime();
      changeRecord.changeType = PubConstant.CHANGE_RECORD_TYPE_INVENTORY;
      changeRecord.dutyOrg = this.fixedAsset.workInOrg;
      changeRecord.state = "ENABLE";
    }
    return changeRecord;
  }
  /**
   * 得到改变的记录
   * preItem为原始的数据，item为新修改的数据
   */
  private _getChangeRecordDetail(preItem: InvAsset, lastItem: InvAsset) {
    var change: Array<string> = new Array<string>();
    if (preItem.techStatus != lastItem.techStatus) {
      change.push('【技术状况】:"' + this.getDictCodeDesc(this.techStates,preItem.techStatus) + '" --> "' + this.getDictCodeDesc(this.techStates,lastItem.techStatus) + '"');
    }
    if (preItem.useState != lastItem.useState) {
      change.push('【使用状况】:"' + this.getDictCodeDesc(this.useStates,preItem.useState) + '" --> "' + this.getDictCodeDesc(this.useStates,lastItem.useState) + '"');
    }
    if (preItem.securityState != lastItem.securityState) {
      change.push('【安全现状】:"' + this.getDictCodeDesc(this.securityStates,preItem.securityState)+ '" --> "' + this.getDictCodeDesc(this.securityStates,lastItem.securityState) + '"');
    }
    if (preItem.handleDate != lastItem.handleDate) {
      change.push('【闲置/停产日期】:"' + this.initDataIfNull(preItem.handleDate) + '" --> "' + lastItem.handleDate + '"');
    }
    if (preItem.installLocation != lastItem.installLocation) {
      change.push('【安装地点】:"' + this.initDataIfNull(preItem.installLocation) + '" --> "' + lastItem.installLocation + '"');
    }
    // if (preItem.manager != lastItem.manager) {
    //   change.push('【保管人】:"' + this.initDataIfNull(preItem.manager) + '" --> "' + lastItem.manager + '"');
    // }
    // if (preItem.useOrgName != lastItem.useOrgName) {
    //   change.push('【使用单位】:"' + this.initDataIfNull(preItem.useOrgName) + '" --> "' + lastItem.useOrgName + '"');
    // }
    if (preItem.handleReason != lastItem.handleReason) {
      change.push('【修改原因】:"' + this.initDataIfNull(preItem.handleReason) + '" --> "' + lastItem.handleReason + '"');
    }
    if(change.length==0){
      change.push("无变化信息");
    }
    return change.toString();
  }

  //////////////日志方法END//////////////////////////////

  
  /**
   * 确认是否删除按钮
   * @param file 
   */
  private isDeleteImg(index) {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: '是否要删除该照片?',
      cssClass:'alert-conform',
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
            this.photoPaths.splice(index,1);
            this.photoBase64s.splice(index,1);
          }
        }
      ]
    });

    alert.present();
  }

  /**
 * 添加图片
 */
  add() {
    if (this.photoPaths.length >= 3) {
      //只能上传三张照片
      this.noticeService.showIonicAlert("只能上传三张照片");
      return;
    } else {
      this.useASComponent();
    }
  }

  /**
   * 底部选择项
   */
  private useASComponent() {
    
    this.fileService.showActionSheetForImageSelect((fileUrl,dataUrl)=>{
      //拍照
      if (this.photoPaths.length < 3) {
        this.photoPaths.push(fileUrl);
        this.photoBase64s.push(dataUrl);
      }

    }, (fileUrls,dataUrls) => {
      //选择图片
      if(fileUrls.length>0){
        for(let i=0;i<fileUrls.length;i++){
          if(this.photoPaths.length<3){
            this.photoPaths.push(fileUrls[i]);
            this.photoBase64s.push(dataUrls[i]);
          }
        }
      }
    },null);
  }

  // //////////////////////////////////筛选保管人和使用单位的方法/////////////////
  // changeManagerOrOrg(type: string) {
  //   this.type = type;
  //   this.menuCtrl.open("selectPerson");
  //   this.menuCtrl.toggle('right');
  //   this.menuCtrl.enable(true, 'selectPerson');
  //   this.menuCtrl.enable(false, 'sys');
  //   switch (type) {
  //     case "MANAGER":
  //       this.invService.queryListFromUserSimple().then((data) => {
  //         this.userList = data;
  //       }, (error) => {
  //         alert(error);
  //       });
  //       break;
  //     case "ORGANIZATION":
  //       this.invService.queryListFromOrgInfo().then((data) => {
  //         this.orgInfo = data;
  //         this.items = data;
  //       }, (error) => {
  //         alert(error);
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // }
  // public type: string;    //搜索类型，有两种，查询管理员："MANAGER",查询组织机构："ORGANIZATION"
  // public menu = "selectPerson";
  // orgInfo: Array<OrgInfo> = null;   //备份，查询后保存到这个列表中
  // userList: Array<UserSimple> = new Array<UserSimple>(); //备份，管理员
  // items: any = null;     //用于搜索查询用

  // /**
  //  * 搜索功能
  //  * @param ev 
  //  */
  // filterItems(ev: any) {
  //   let val = ev.target.value;
  //   switch (this.type) {
  //     case "MANAGER":
  //       if (val) {
  //         //点击叉号后val为undefined，不会执行里面的方法
  //         this.items = this.userList.filter(function (item) {
  //           let name = item.userName.includes(val);
  //           // let workerNumber=item.workerNumber.includes(val);      //防止重名，用员工编号查   不成功，跟数字有关系？
  //           return name;
  //         })
  //       }
  //       break;


  //     case "ORGANIZATION":
  //       if (val == undefined) {
  //         this.items = this.orgInfo;
  //       } else {
  //         this.items = this.orgInfo.filter(function (item) {
  //           return item.orgName.includes(val);
  //         })
  //       }
  //       break;


  //     default:

  //       break;
  //   }

  // }

  // /**
  //  * 点击某一项后关闭并退出
  //  * @param item 
  //  */
  // close(item) {
  //   if (this.type == "MANAGER") {
  //     this.invAsset.manager = item.userName;
  //     this.invAsset.workerNumber = item.workerNumber;
  //   } else if (this.type == "ORGANIZATION") {
  //     this.invAsset.useOrgName = item.orgName;
  //     this.invAsset.useOrg = item.orgCode;
  //   }

  //   //this.test3Page.invAsset.manager=item.userName;    
  //   this.menuCtrl.close();

  // }
  // //////////////////////////////////筛选保管人和使用单位的方法END/////////////////


}
