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

  alloInOrgName = '' //调入单位名称
  private alloInOrgCode = '' //调入单位编码

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public noticeService:NoticeService,
    public pubDbProvider: PubDBProvider,
    public menuCtrl: MenuController, ) {
    this.userName = this.navParams.get('userName')
    this.wFOAddress = this.navParams.get('wFOAddress')
    this.assetList=this.navParams.get("assets")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlloPage');
  }


  handleSubmit(){
    if(this.alloInOrgCode==''){
      this.noticeService.showIonicAlert("请选择调入单位")
    }
    this.noticeService.showIonicAlert("提交")
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
   * @param item 
   */
  close(item) {
    this.alloInOrgName = item.orgFullName.replace("作业区", "");
    this.alloInOrgCode = item.orgCode;
    this.menuCtrl.close();

  }
  //////////////////////////////////筛选保管人和使用单位的方法END/////////////////

}
