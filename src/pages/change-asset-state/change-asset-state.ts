import { AssetHandleService } from './../../providers/service/asset.handle.service';
import { ConvertUtil } from './../../providers/utils/convertUtil';
import { PubConstant } from './../../providers/entity/constant.provider';
import { DictDetail, Scrap, Idle } from './../../providers/entity/pub.entity';
import { FixedAsset } from './../../providers/entity/entity.provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { dateUtil } from '../../providers/utils/dateUtil';
import { NoticeService } from '../../providers/service/notice.service';
import { AssetService } from '../../providers/service/asset.service';
import { DataBaseUtil } from '../../providers/utils/dataBaseUtil';

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
  public userName = ''
  public currentDate = dateUtil.getCurrentDate()
  public changeReason = ''
  public assetList: Array<FixedAsset> = []
  public techStatus = ''  //技术状况
  public useState = ''   //使用状况
  public securityState = '' //安全现状
  public isIdle: boolean = false;   //判断该资产是否已经是闲置资产
  public isScrap: boolean = false;  //判断该资产是否已经是报废资产
  public techStates: Array<DictDetail>;  //技术状况的列表
  public useStates: Array<DictDetail>;  //技术状况的列表
  public securityStates: Array<DictDetail>;  //技术状况的列表
  public scrap: Scrap = new Scrap();  //报废记录信息
  public idle: Idle = new Idle();     //闲置记录信息
  public dateNow = ConvertUtil.formatDate(new Date());

  private workerNumber='';


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private assetHandleService: AssetHandleService,
    private assetService: AssetService,
    private noticeService: NoticeService,
  ) {
    this.userName = this.navParams.get('userName')
    this.assetList = this.navParams.get("assets")
    this.workerNumber = this.navParams.get("workerNumber")
    this.initSelectOptions();
    if(this.assetList.length==1){
      this.techStatus=this.assetList[0].techStatus
      this.useState=this.assetList[0].useState
      this.securityState=this.assetList[0].securityState

      //判断是否为闲置或报废资产
      if (this.assetList[0].useState == PubConstant.DICT_SUB_TYPE_IDLE) {
        this.isIdle = true;
      }
      if (this.assetList[0].techStatus == PubConstant.DICT_SUB_TYPE_SCRAP) {
        this.isScrap = true;
      }

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
    if (this.isIdle == false && this.useState == PubConstant.DICT_SUB_TYPE_IDLE) {
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
    if (this.isScrap == false && this.techStatus == PubConstant.DICT_SUB_TYPE_SCRAP) {
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
    // if(this.newMangerWorkerNumber==''){
    //   this.noticeService.showIonicAlert("请选择现责任人")
    // }

    if(this.isIdle == false && this.useState == PubConstant.DICT_SUB_TYPE_IDLE){
      //同步闲置资产数据
      this.assetHandleService.synchroIdleListToServe(this.workerNumber);
    }
    if(this.isScrap == false && this.techStatus == PubConstant.DICT_SUB_TYPE_SCRAP){
      //同步报废资产数据
      this.assetHandleService.synchroScrapListToServe(this.workerNumber);
    }
    if(this.techStatus==''||this.useState==''||this.securityState==''){
      this.noticeService.showIonicAlert("请选择设备状态")
    }
    this.noticeService.showIonicAlert("提交")
  }

}
