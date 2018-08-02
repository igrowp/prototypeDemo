import { PubConstant } from './../../providers/entity/constant.provider';
import { AssetWebProvider } from './../../providers/web/asset.web.provider';
import { AssetChgOwnerBill, AssetChgPropertyBill, Asset } from './../../providers/entity/pub.entity';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NoticeService } from '../../providers/service/notice.service';

/**
 * Generated class for the ProcessChgDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-process-chg-detail',
  templateUrl: 'process-chg-detail.html',
})
export class ProcessChgDetailPage {
  public title: string;
  public eventType = ""
  public chgState = ""

  //资产状态变更
  public techState=''
  public useState=''
  public securityState=''

  public isEdit = false;


  public assetChgOwnerBill: AssetChgOwnerBill = new AssetChgOwnerBill();   //资产责任人变更审批
  public assetChgPropertyBill: AssetChgPropertyBill = new AssetChgPropertyBill();   //资产责任人变更审批
  public assetList: Array<Asset> = new Array<Asset>()

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private assetWebProvider: AssetWebProvider,
    private noticeService: NoticeService,
  ) {


    //确定申请状态
    let state = this.navParams.get("bill").chgState

    this.eventType = this.navParams.get("eventType")
    if (this.eventType == '资产责任人变更') {
      this.assetChgOwnerBill = this.navParams.get("bill")
      this.title = "资产责任人变更确认"
      
      //确认状态
      if (state == PubConstant.CHG_STATE_INAPPROVAL) {
        //角色为第一审批人  审批
        this.chgState = "原责任人申请"
      } else if (state == PubConstant.CHG_STATE_FIRSTREJECT) {
        //角色为申请人      可编辑状态，重新提交
        this.chgState = "现责任人已驳回"
        this.isEdit = true;
      } else if (state == PubConstant.CHG_STATE_FIRSTPASS) {
        //角色为第二审批人  审批
        this.chgState = "现责任人已确认"
      } else if (state == PubConstant.CHG_STATE_LASTREJECT) {
        this.chgState = "资产管理人员已驳回"
      }

    }else if(this.eventType=='资产状态变更'){
      this.assetChgPropertyBill = this.navParams.get("bill")
      this.title = "资产状态变更确认"

      //确认状态
      if (state == PubConstant.CHG_STATE_INAPPROVAL) {
        //角色为第一审批人  审批
        this.chgState = "责任人申请"
      } else if (state == PubConstant.CHG_STATE_FIRSTREJECT) {
        //角色为申请人      可编辑状态，重新提交
        this.chgState = "技术人员已驳回"
        this.isEdit = true;
      } else if (state == PubConstant.CHG_STATE_FIRSTPASS) {
        //角色为第二审批人  审批
        this.chgState = "技术人员已确认"
      } else if (state == PubConstant.CHG_STATE_LASTREJECT) {
        this.chgState = "资产管理人员已驳回"
      }
    }
    this.assetList = this.navParams.get("assetList")
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProcessChgDetailPage');
  }


  handleDetail(item) {
    let loading = this.noticeService.showIonicLoading("正在获取数据", 10000);
    this.assetWebProvider.getFixedByAssetId(item.assetId).then((data) => {
      loading.dismiss();
      this.navCtrl.push("ProcessAssetMessagePage", {
        eventType: "资产详情页",
        fixedAsset: data,
      })
    }, error => {
      loading.dismiss();
      this.noticeService.showIonicAlert("获取详情页面失败")
    })
  }

  handleEdit() {
    switch (this.eventType) {
      case '资产责任人变更':
        this.navCtrl.push('ChangeCustodianPage', {
          assets: this.assetList,
          userName: this.assetChgOwnerBill.applicantName,
          workerNumber: this.assetChgOwnerBill.applicant,
          originalBill: this.assetChgOwnerBill
        })
        break;
      case '资产状态变更':
        this.navCtrl.push('ChangeAssetStatePage', {
          assets: this.assetList,
          userName: this.assetChgPropertyBill.applicantName,
          workerNumber: this.assetChgPropertyBill.applicant,
          originalBill: this.assetChgPropertyBill
        })

        break;
      default:
        break;
    }

  }


  /**
   * 跳转到审批页面
   */
  handleApprove() {
    switch (this.eventType) {
      case '资产责任人变更':
        this.navCtrl.push("ProcessChgApprovePage", {
          eventType: this.eventType,
          bill: this.navParams.get("bill")
        });
        break;
      case '资产状态变更':
        this.navCtrl.push("ProcessChgApprovePage", {
          eventType: this.eventType,
          bill: this.navParams.get("bill")
        });
        break;
      default:
        break;
    }
    
  }

}
