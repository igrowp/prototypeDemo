import { UserSimple } from './../../providers/entity/entity.provider';
import { CvtService } from './../../providers/service/cvt.service';
import { ChangeWebProvider } from './../../providers/web/change.web.provider';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NoticeService } from '../../providers/service/notice.service';
import { PubConstant } from '../../providers/entity/constant.provider';

/**
 * Generated class for the ProcessChgApprovePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-process-chg-approve',
  templateUrl: 'process-chg-approve.html',
})
export class ProcessChgApprovePage {

  public outcome = ""          //审核结果
  public opinion = ""          //审核意见
  public nextAuditor = ""      //下一个审批人
  public nextAuditorName = ""  //下一个审批人姓名
  public isHaveNextAuditor = false;  //是否还有下一步审批人
  public eventType = ""
  public bill;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private menuCtrl: MenuController,
    private changeWebProvider: ChangeWebProvider,
    private cvtService: CvtService,
    private noticeService: NoticeService) {
    this.eventType = this.navParams.get("eventType")
    this.bill = this.navParams.get("bill")
    if (this.bill.chgState == PubConstant.CHG_STATE_INAPPROVAL || this.bill.chgState == PubConstant.CHG_STATE_LASTREJECT) {
      this.isHaveNextAuditor = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProcessChgApprovePage');
  }


  /**
   * 提交审批
   */
  handleSubmit() {
    if (!this.outcome) {
      this.noticeService.showIonicAlert("请选择审核结果");
      return;
    }
    if ((!this.nextAuditor || this.nextAuditor == "") && this.outcome == "同意" && this.isHaveNextAuditor) {
      this.noticeService.showIonicAlert("请选择下一步审批人");
      return;
    }



    if (this.bill.chgState == PubConstant.CHG_STATE_INAPPROVAL || this.bill.chgState == PubConstant.CHG_STATE_LASTREJECT) {
      //角色为第一审批人  审批
      if (this.outcome == "同意") {
        this.bill.chgState = PubConstant.CHG_STATE_FIRSTPASS
        this.bill.finalAuditor = this.nextAuditor
      } else {
        this.bill.chgState = PubConstant.CHG_STATE_FIRSTREJECT
      }
      this.bill.auditorOpinion = this.opinion  //审核意见
    } else if (this.bill.chgState == PubConstant.CHG_STATE_FIRSTREJECT) {
      //角色为申请人      可编辑状态，重新提交
    } else if (this.bill.chgState == PubConstant.CHG_STATE_FIRSTPASS) {
      //角色为第二审批人  审批
      if (this.outcome == "同意") {
        this.bill.chgState = PubConstant.CHG_STATE_LASTPASS
      } else {
        this.bill.chgState = PubConstant.CHG_STATE_LASTREJECT
      }
      this.bill.finalAuditOpinion = this.opinion  //审核意见
    }


    let process = this.noticeService.showIonicLoading("正在提交", 10000);
    process.present();
    if (this.eventType == "资产责任人变更") {
      this.changeWebProvider.submitCCBillToServe(this.bill).then((result) => {
        if (result) {
          process.dismiss();
          this.noticeService.showIonicAlert("提交成功");
          this.navCtrl.popToRoot();
        } else {
          this.noticeService.showIonicAlert("提交失败");
          process.dismiss();
        }
      }).catch(error => {
        process.dismiss();
        this.noticeService.showIonicAlert("提交失败，网络连接异常");
      })
    }else if (this.eventType == "资产状态变更") {
      this.changeWebProvider.submitCSBillToServe(this.bill).then((result) => {
        if (result) {
          process.dismiss();
          this.noticeService.showIonicAlert("提交成功");
          this.navCtrl.popToRoot();
        } else {
          this.noticeService.showIonicAlert("提交失败");
          process.dismiss();
        }
      }).catch(error => {
        process.dismiss();
        this.noticeService.showIonicAlert("提交失败，网络连接异常");
      })
    } else {
      this.noticeService.showIonicAlert("申请单有误")
      process.dismiss()
    }
  }


  //////////////////////////////////筛选保管人和使用单位的方法/////////////////
  handleSelectPerson() {
    this.menuCtrl.enable(true, 'grantingSelectPerson');
    this.menuCtrl.open("grantingSelectPerson");
    this.menuCtrl.toggle('right');
    this.cvtService.getUserSimpleList().then((data) => {
      this.userList = data;
    }, (error) => {
      alert(error);
    });

  }
  public type: string;    //搜索类型，有两种，查询管理员："MANAGER",查询组织机构："ORGANIZATION"
  public menu = "selectPerson";
  userList: Array<UserSimple> = new Array<UserSimple>(); //备份，管理员
  items: Array<UserSimple> = null;     //用于搜索查询用

  /**
   * 搜索功能
   * @param ev 
   */
  filterItems(ev: any) {
    let val = ev.target.value;
    if (val) {
      //点击叉号后val为undefined，不会执行里面的方法
      this.items = this.userList.filter(function (item) {
        let name = item.userName.includes(val);
        // let workerNumber=item.workerNumber.includes(val);      //防止重名，用员工编号查   不成功，跟数字有关系？
        return name;
      })
    }
  }

  /**
   * 点击某一项后关闭并退出
   * @param item 
   */
  close(item) {
    this.nextAuditorName = item.userName;
    this.nextAuditor = item.workerNumber;
    this.menuCtrl.close();
  }
  //////////////////////////////////筛选保管人和使用单位的方法END/////////////////

}
