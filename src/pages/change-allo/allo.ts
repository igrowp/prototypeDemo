import { AssetHandleWebProvider } from './../../providers/web/asset.handle.web.provider';
import { AllocateBill } from './../../providers/entity/pub.entity';
import { PubDBProvider } from './../../providers/storage/pub.db.provider';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { dateUtil } from '../../providers/utils/dateUtil';
import { OrgInfo } from '../../providers/entity/entity.provider';
import { NoticeService } from '../../providers/service/notice.service';

/**
 * Generated class for the AlloPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-allo',
  templateUrl: 'allo.html',
})
export class AlloPage {
  currentDate = dateUtil.getCurrentDate();
  userName = ''
  wFOAddress = ''
  scrapReason = ''
  assetList = []  //资产列表
  alloType=''
  private workForOrg=''
  private workerNumber=''

  alloInOrgName = '' //调入单位名称
  private alloInOrgCode = '' //调入单位编码

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public noticeService:NoticeService,
    public pubDbProvider: PubDBProvider,
    private assetHandleWebProvider:AssetHandleWebProvider,
    public menuCtrl: MenuController, ) {
    this.userName = this.navParams.get('userName')
    this.wFOAddress = this.navParams.get('wFOAddress')
    this.assetList=this.navParams.get("assets")
    this.workForOrg=this.navParams.get('workForOrg')
    this.workerNumber=this.navParams.get('workerNumber')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlloPage');
  }


  handleSubmit(){
    if(this.alloInOrgCode==''){
      this.noticeService.showIonicAlert("请选择调入单位")
      return;
    }
    let loading =this.noticeService.showIonicLoading('正在提交...')
    loading.present()

    let allocateBill=new AllocateBill()
    allocateBill.appDate=this.currentDate
    allocateBill.allocateType=this.alloType
    allocateBill.appInOrg=this.alloInOrgCode
    allocateBill.appOutOrg=this.workForOrg
    allocateBill.appOrg=this.workForOrg
    allocateBill.agent=this.workerNumber
    let list=new Array()
    for(let i=0;i<this.assetList.length;i++){
      list.push({
        'assetId':this.assetList[i].assetId
      })
    }
    this.assetHandleWebProvider.submitAllocateToServe(allocateBill,list).then(()=>{
      loading.dismiss()
      this.noticeService.showIonicAlert("提交成功")
      this.navCtrl.popToRoot()
    }).catch((error)=>{
      loading.dismiss()
      this.noticeService.showIonicAlert('提交失败')
    })
  }




  //////////////////////////////////筛选保管人和使用单位的方法/////////////////
  handleSelectAlloInOrg() {
    this.menuCtrl.open("selectOrg");
    this.menuCtrl.toggle('right');
    this.menuCtrl.enable(true, 'selectOrg');
    this.menuCtrl.enable(false, 'sys');
    if (!this.orgInfo) {
      this.pubDbProvider.queryListFromOrgInfo().then((data) => {
        this.orgInfo = data;
        this.items = data;
      }, (error) => {
        alert(error);
      });
    }
  }
  public type: string;    //搜索类型，有两种，查询管理员："MANAGER",查询组织机构："ORGANIZATION"
  public menu = "selectPerson";
  orgInfo: Array<OrgInfo> = null;   //备份，查询后保存到这个列表中
  items: any = null;     //用于搜索查询用

  /**
   * 搜索功能
   * @param ev 
   */
  filterItems(ev: any) {
    let val = ev.target.value;

    if (val == undefined) {
      this.items = this.orgInfo;
    } else {
      this.items = this.orgInfo.filter(function (item) {
        return item.orgFullName.includes(val);
      })
    }
  }

  /**
   * 点击某一项后关闭并退出
   * @param inOrg 
   */
  close(inOrg:OrgInfo) {
    this.menuCtrl.close();
    if(inOrg.orgCode==this.workForOrg){
      this.noticeService.showIonicAlert('调入单位和调出单位不能相同')
      return
    }
    let a=new OrgInfo()
    a.parentOrgId
    this.alloInOrgName = inOrg.orgFullName.replace("作业区", "");
    this.alloInOrgCode = inOrg.orgCode;

    //自动识别调拨类型
    this.pubDbProvider.queryFromOrgInfoByOrgCode(this.workForOrg).then((outOrg)=>{
      if(inOrg.parentOrgId&&outOrg.parentOrgId){
        if(inOrg.parentOrgId==outOrg.parentOrgId){
          console.log(inOrg.parentOrgId.length)
          if(inOrg.parentOrgId.length==9){
            this.alloType='70001'
          }else if(inOrg.parentOrgId.length==13){
            this.alloType='70002'
          }
        }else{
          this.alloType='70001'
        }
      }else{
        if(!outOrg.parentOrgId&&outOrg.orgName!="重庆气矿"){
          this.alloType='70004'
        }else if(!inOrg.parentOrgId&&inOrg.orgName!="重庆气矿"){
          this.alloType='70003'
        }else{
          this.alloType='70001'
        }
      }
    })
  }
  //////////////////////////////////筛选保管人和使用单位的方法END/////////////////

}
