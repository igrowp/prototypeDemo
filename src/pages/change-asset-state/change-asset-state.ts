import { CvtService } from './../../providers/service/cvt.service';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { AssetHandleService } from './../../providers/service/asset.handle.service';
import { ConvertUtil } from './../../providers/utils/convertUtil';
import { PubConstant } from './../../providers/entity/constant.provider';
import { DictDetail, Scrap, Idle, AssetChgPropertyBill } from './../../providers/entity/pub.entity';
import { FixedAsset, UserSimple } from './../../providers/entity/entity.provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { dateUtil } from '../../providers/utils/dateUtil';
import { NoticeService } from '../../providers/service/notice.service';
import { AssetService } from '../../providers/service/asset.service';
import { DataBaseUtil } from '../../providers/utils/dataBaseUtil';
import { ChangeWebProvider } from '../../providers/web/change.web.provider';

/**
 * Generated class for the ChangeAssetStatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-asset-state',
  templateUrl: 'change-asset-state.html',
})
export class ChangeAssetStatePage {
  public assetList: Array<FixedAsset> = []
  
  public isIdle: boolean = false;   //判断该资产是否已经是闲置资产
  public isScrap: boolean = false;  //判断该资产是否已经是报废资产

  public techStates: Array<DictDetail>;  //技术状况的列表
  public useStates: Array<DictDetail>;  //技术状况的列表
  public securityStates: Array<DictDetail>;  //技术状况的列表
  public scrap: Scrap = new Scrap();  //报废记录信息
  public idle: Idle = new Idle();     //闲置记录信息
  public dateNow = ConvertUtil.formatDate(new Date());

  public isReedit=false;   //是否是再次编辑

  private workerNumber='';
  private auditor=''   //下一步审批人信息
  public  auditorName=''

  public bill:AssetChgPropertyBill=new AssetChgPropertyBill()


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl:MenuController,
    private cvtService:CvtService,
    private assetHandleService: AssetHandleService,
    private changeWebProvider:ChangeWebProvider,
    private assetService: AssetService,
    private noticeService: NoticeService,
  ) {
    this.assetList=this.navParams.get("assets")
    this.workerNumber=this.navParams.get('workerNumber')

    
    if(this.navParams.get("originalBill")){
      this.bill=this.navParams.get("originalBill")
      this.auditor=this.bill.auditor
      this.auditorName=this.bill.auditorName
      this.isReedit=true
    }else{
      this.bill.chgId=DataBaseUtil.generateUUID()
      this.bill.applicant=this.navParams.get('workerNumber')
      this.bill.applicantName=this.navParams.get('userName')
      this.bill.applyTime=dateUtil.getCurrentDate()
    }


    this.initSelectOptions();

    if(this.assetList.length==1){
      //判断是否为闲置或报废资产
      if (this.assetList[0].useState == PubConstant.DICT_SUB_TYPE_IDLE) {
        this.isIdle = true;
      }
      if (this.assetList[0].techStatus == PubConstant.DICT_SUB_TYPE_SCRAP) {
        this.isScrap = true;
      }
      this.bill.techStatus=this.assetList[0].techStatus
      this.bill.useState=this.assetList[0].useState
      this.bill.securityState=this.assetList[0].securityState
    }
  }



  //从数据字典中读取数据，展示在页面中
  initSelectOptions() {
    this.assetService.queryListFromDictDetailByCategoryCode(PubConstant.DICT_TYPE_TECH_STATE).then((techs) => {
      if (techs) {
        this.techStates = techs;
      }
    })
    this.assetService.queryListFromDictDetailByCategoryCode(PubConstant.DICT_TYPE_USE_STATE).then((techs) => {
      if (techs) {
        this.useStates = techs;
      }
    })
    this.assetService.queryListFromDictDetailByCategoryCode(PubConstant.DICT_TYPE_SECURITY_STATE).then((techs) => {
      if (techs) {
        this.securityStates = techs;
      }
    })
  }

  /**
   * 如果有报废或者闲置表，保留下来
   */
  initIdleOrScrap() {
    //初始化闲置表,保留到本地
    if (this.isIdle == false && this.bill.useState == PubConstant.DICT_SUB_TYPE_IDLE) {
      this.assetList.forEach(item => {
        this.assetHandleService.getIdleByAssetId(item.assetId).then((data) => {
          this.idle.assetId = item.assetId;
          this.idle.applyState = PubConstant.APPLY_STATE_NULL;
          this.idle.recordFlag = 0;
          if (data == null) {
            //没有，插入
            this.idle.idleId = DataBaseUtil.generateUUID();
            this.assetHandleService.addToIdle(this.idle);
          } else {
            this.idle.idleId = data.idleId;
            this.assetHandleService.updateToIdle(this.idle);
          }
        })
      });
    }
    //初始化报废表,保留到本地
    if (this.isScrap == false && this.bill.techStatus == PubConstant.DICT_SUB_TYPE_SCRAP) {
      this.assetList.forEach(item => {
        this.assetHandleService.getScrapByAssetId(item.assetId).then((data) => {
          this.scrap.assetId = item.assetId;
          this.scrap.applyState = PubConstant.APPLY_STATE_NULL;
          this.scrap.recordFlag = 0;
          if (data == null) {
            //没有，插入
            this.scrap.scrapId = DataBaseUtil.generateUUID();
            this.assetHandleService.addToScrap(this.scrap);
          } else {
            this.scrap.scrapId = data.scrapId;
            this.assetHandleService.updateToScrap(this.scrap);
          }
        })
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeAssetStatePage');
  }


  handleSubmit() {
    if(this.auditor==''||!this.auditor){
      this.noticeService.showIonicAlert("请选择下一步审批人")
      return
    }
    if(this.bill.techStatus==''){
      this.noticeService.showIonicAlert("请选择技术状态")
      return
    }
    if(this.bill.useState==''){
      this.noticeService.showIonicAlert("请选择使用状态")
      return
    }

    let loading =this.noticeService.showIonicLoading('正在提交...')
    loading.present()

    this.initIdleOrScrap()
    setTimeout(()=>{
      if(this.isIdle == false && this.bill.useState == PubConstant.DICT_SUB_TYPE_IDLE){
        //同步闲置资产数据
        this.assetHandleService.synchroIdleListToServe(this.workerNumber);
      }
      if(this.isScrap == false && this.bill.techStatus == PubConstant.DICT_SUB_TYPE_SCRAP){
        //同步报废资产数据
        this.assetHandleService.synchroScrapListToServe(this.workerNumber);
      }
    },5000)

    
    
    this.bill.chgState=PubConstant.CHG_STATE_INAPPROVAL
    this.bill.auditor=this.auditor

    let list=new Array()
    for(let i=0;i<this.assetList.length;i++){
      list.push({
        'assetId':this.assetList[i].assetId
      })
    }
    this.changeWebProvider.submitChangeAssetStateToServe(this.bill,list).then((data)=>{
      loading.dismiss()
      if(data=="success"){
        this.noticeService.showIonicAlert("提交成功")
        this.navCtrl.popToRoot()
      }else{
        this.noticeService.showIonicAlert("提交失败")
      }
    })
    .catch((error)=>{
      loading.dismiss()
      this.noticeService.showIonicAlert('提交失败'+error)
    })
  }



  //////////////////////////////////筛选保管人和使用单位的方法/////////////////
  handleSelectPerson(){
    this.menuCtrl.enable(true, 'grantingSelectPerson');
    this.menuCtrl.open("grantingSelectPerson");
    this.menuCtrl.toggle('right');
    this.cvtService.getUserSimpleList().then((data)=>{
      this.userList=data;
    },(error)=>{
      alert(error);
    });
    
  }
  public type:string;    //搜索类型，有两种，查询管理员："MANAGER",查询组织机构："ORGANIZATION"
  public menu="selectPerson";
  userList:Array<UserSimple>=new Array<UserSimple>(); //备份，管理员
  items:Array<UserSimple>=null;     //用于搜索查询用

  /**
   * 搜索功能
   * @param ev 
   */
  filterItems(ev: any) {
    let val = ev.target.value;
      if(val){
        //点击叉号后val为undefined，不会执行里面的方法
        this.items=this.userList.filter(function(item){
          let name=item.userName.includes(val);
          // let workerNumber=item.workerNumber.includes(val);      //防止重名，用员工编号查   不成功，跟数字有关系？
          return name;
        })
      }
  }

  /**
   * 删除其中的一项
   * @param asset 
   */
  handleRemove(asset){
    this.noticeService.showIoincAlertConform("是否要删除该资产？",(data)=>{
      this.assetList=this.assetList.filter((data)=>{
        return data.assetId!=asset.assetId;
      })
    })
  }

  /**
   * 点击某一项后关闭并退出
   * @param item 
   */
  close(item) {
    this.auditorName = item.userName;
    this.auditor = item.workerNumber;
    this.menuCtrl.close();
  }
//////////////////////////////////筛选保管人和使用单位的方法END/////////////////


/**
   * 取消申请
   */
  handleCancelSubmit(){
    let loading =this.noticeService.showIonicLoading('正在提交...')
    loading.present()
    this.bill.recordFlag=1
    this.changeWebProvider.submitCSBillToServe(this.bill).then((result)=>{
      loading.dismiss()
      if(result=="success"){
        this.noticeService.showIonicAlert("取消申请成功")
        this.navCtrl.popToRoot()
      }else{
        this.noticeService.showIonicAlert("取消申请失败")
      }
    }).catch((error)=>{
      loading.dismiss()
      this.noticeService.showIonicAlert('网络异常')
    })
  }

}
