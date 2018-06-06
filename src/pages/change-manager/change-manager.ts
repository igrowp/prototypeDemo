import { UserSimple, FixedAsset } from './../../providers/entity/entity.provider';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CvtService } from '../../providers/service/cvt.service';
import { dateUtil } from '../../providers/utils/dateUtil';
import { NoticeService } from '../../providers/service/notice.service';

/**
 * Generated class for the ChangeManagerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-manager',
  templateUrl: 'change-manager.html',
})
export class ChangeManagerPage {
  public newManger='' // 现责任人
  public assetList:Array<FixedAsset>=[]
  public userName=''
  public currentDate=dateUtil.getCurrentDate()
  public changeReason=''  //变更说明


  private newMangerWorkerNumber='' //现责任人员工编号

  constructor(private navCtrl: NavController,
           private navParams: NavParams,
           private cvtService:CvtService,
           private noticeService:NoticeService,
           private menuCtrl:MenuController,) {
    this.userName = this.navParams.get('userName')
    this.assetList=this.navParams.get("assets")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeManagerPage');
  }



  handleSubmit(){
    if(this.newMangerWorkerNumber==''){
      this.noticeService.showIonicAlert("请选择现责任人")
    }
    this.noticeService.showIonicAlert("提交")
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
   * 点击某一项后关闭并退出
   * @param item 
   */
  close(item) {
    this.newManger = item.userName;
    this.newMangerWorkerNumber = item.workerNumber;
    this.menuCtrl.close();
  }
//////////////////////////////////筛选保管人和使用单位的方法END/////////////////

}
