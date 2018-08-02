import { PubConstant } from './../../providers/entity/constant.provider';
import { DataBaseUtil } from './../../providers/utils/dataBaseUtil';
import { dateUtil } from './../../providers/utils/dateUtil';
import { AssetChgOwnerBill } from './../../providers/entity/pub.entity';
import { UserSimple, FixedAsset } from './../../providers/entity/entity.provider';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CvtService } from '../../providers/service/cvt.service';
import { NoticeService } from '../../providers/service/notice.service';
import { ChangeWebProvider } from '../../providers/web/change.web.provider';

/**
 * Generated class for the ChangeCustodianPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-custodian',
  templateUrl: 'change-custodian.html',
})
export class ChangeCustodianPage {
  public newMangerName='' // 现责任人
  private newManger='' //现责任人员工编号
  public assetList:Array<FixedAsset>=[]
  public bill:AssetChgOwnerBill=new AssetChgOwnerBill()

  public isReedit=false;   //是否是再次编辑

  constructor(private navCtrl: NavController,
           private navParams: NavParams,
           private cvtService:CvtService,
           private changeWebProvider:ChangeWebProvider,
           private noticeService:NoticeService,
           private menuCtrl:MenuController,) {
    this.assetList=this.navParams.get("assets")

    if(this.navParams.get("originalBill")){
      this.bill=this.navParams.get("originalBill")
      this.newManger=this.bill.auditor
      this.newMangerName=this.bill.auditorName
      this.isReedit=true
    }else{
      this.bill.chgId=DataBaseUtil.generateUUID()
      this.bill.applicant=this.navParams.get('workerNumber')
      this.bill.applicantName=this.navParams.get('userName')
      this.bill.originalOwner=this.navParams.get('workerNumber')
      this.bill.originalOwnerName=this.navParams.get('userName')
      this.bill.applyTime=dateUtil.getCurrentDate()
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeManagerPage');
  }



  handleSubmit(){
    if(this.newManger==''){
      this.noticeService.showIonicAlert("请选择现责任人")
      return
    }
    let loading =this.noticeService.showIonicLoading('正在提交...')
    loading.present()
    
    this.bill.chgState=PubConstant.CHG_STATE_INAPPROVAL
    this.bill.auditor=this.newManger
    
    let list=new Array()
    for(let i=0;i<this.assetList.length;i++){
      list.push({
        'assetId':this.assetList[i].assetId
      })
    }
    this.changeWebProvider.submitChangeCustodianToServe(this.bill,list).then((data)=>{
      loading.dismiss()
      if(data=="success"){
        this.noticeService.showIonicAlert("提交成功")
        this.navCtrl.popToRoot()
      }else{
        this.noticeService.showIonicAlert("提交失败")
      }
    }).catch((error)=>{
      loading.dismiss()
      this.noticeService.showIonicAlert('网络异常')
    })

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
   * 取消申请
   */
  handleCancelSubmit(){
    let loading =this.noticeService.showIonicLoading('正在提交...')
    loading.present()
    this.bill.recordFlag=1
    this.changeWebProvider.submitCCBillToServe(this.bill).then((result)=>{
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


  //////////////////////////////////筛选保管人和使用单位的方法/////////////////
  handleSelectPerson(){
    this.menuCtrl.enable(true, 'grantingSelectPerson');
    this.menuCtrl.open("grantingSelectPerson");
    this.menuCtrl.toggle('right');
    this.cvtService.getUserSimpleList().then((data)=>{
      this.userList=data;
    },(error)=>{
      this.noticeService.showIonicAlert(error);
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
   * 点击某一项后关闭并退出
   * @param item 
   */
  close(item) {
    this.newMangerName = item.userName;
    this.newManger = item.workerNumber;
    this.menuCtrl.close();
  }
//////////////////////////////////筛选保管人和使用单位的方法END/////////////////

}
