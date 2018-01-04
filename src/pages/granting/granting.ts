import { NoticeService } from './../../providers/service/notice.service';
import { UserSimple } from './../../providers/entity/entity.provider';
import { ConvertService } from './../../providers/service/convert.service';
import { WebService } from './../../providers/service/web.service';
import { CvtNonNotice, CvtNonReceive, CvtNonNoticeSub } from './../../providers/entity/cvt.entity.provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { Checkbox } from 'ionic-angular/components/checkbox/checkbox';

/**
 * Generated class for the GrantingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-granting',
  templateUrl: 'granting.html',
})
export class GrantingPage {
  public checked=true;   //用于已经选择了的资产，显示不可选中状态
  public cvtNotice:CvtNonNotice;  //非安设备转产通知
  public isShow:boolean=true;  //是否显示通知单详细信息
  public noticeSubArray:Array<CvtNonNoticeSub>=new Array<CvtNonNoticeSub>(); //用于选择资产的数据记录
  public assets:Array<any>;  //用于存放某一项资产下的资产列表
  
  private assetArray:Array<CvtNonReceive>=new Array<CvtNonReceive>();  //用于数据备份，备份数据库查询得到的数据
  public cvtNonReceives:Array<CvtNonReceive>=new Array<CvtNonReceive>();   //记录某人勾选的所有资产

  public totalQuantity=0;  //全部资产数量
  public sentQuantity=0;   //已经确定发放的资产数量
  constructor( public navParams: NavParams,
              public navCtrl: NavController,
              public convertSer:ConvertService,
              public noticeSer:NoticeService,
              public menuCtrl:MenuController) {
    this.cvtNotice=this.navParams.get("cvtNonNotice");
    this.convertSer.queryFromCvtNonNoticeSubByNoticeId(this.cvtNotice.noticeId).then((noticeSub) => {
      if (noticeSub != null) {
        this.noticeSubArray = noticeSub;
      }
      this.init();
    })
    
  }
  clean(){
    this.convertSer.queryFromCvtNonReceive(this.cvtNotice.investplanId).then((data) => {
      data[0].receiveName="";
      data[0].receiveOrg="";
      data[0].receivePerson=null;
      data[0].receiveTime="";
      data[0].isChecked=false;
      this.convertSer.updateToCvtNonReceive(data).then((data)=>{
        alert("修改成功");
      });
  })
}
  //初始化
  init(){
    //初始化参数
    this.assetArray = new Array<CvtNonReceive>();
    this.cvtNonReceives=new Array<CvtNonReceive>();
    let totalQuantity=0;
    let sentQuantity=0;
    //得到数据
    this.convertSer.queryFromCvtNonReceive(this.cvtNotice.investplanId).then((data) => {
      if (data == null || data.length == 0) {
        this.assetArray = new Array<CvtNonReceive>();
      } else {
        //判断资产是否已经选择
        for (var i = 0; i < data.length; i++) {
          let receive: CvtNonReceive = data[i];
          if (receive.receivePerson == null || receive.receivePerson == "") {
            receive.isChecked = false;
          } else {
            receive.isChecked = true;
          }
          this.assetArray.push(receive);
        }
      }
      //计算资产剩余数量
      for (var j = 0; j < this.noticeSubArray.length; j++) {
        var item = this.noticeSubArray[j];
        var array = this.assetArray.filter((data) => {
          return data.assetName == item.assetName && data.isChecked == false;
        })
        this.noticeSubArray[j].residualQuantity = array.length;
        this.noticeSubArray[j].quantity = array.length;
        totalQuantity+=this.noticeSubArray[j].sentQuantity;
        sentQuantity+=this.noticeSubArray[j].sentQuantity-array.length;
      }
      this.totalQuantity=totalQuantity;
      this.sentQuantity=sentQuantity;
    })
  }

  ionViewDidEnter(){
    //计算各资产项的剩余数量
    // this.init();
  }

  /**
   * 显示侧边栏，展示某一资产下的详细资产项
   * @param item 
   */
  handleMenu(item){
    this.assets=this.assetArray.filter((data)=>{
      return data.assetName==item.assetName;
    })
    this.menuCtrl.open("grantingMenu");
  }

  /**
   * 清空
   */
  handleClean(){
    this.init();
  }

  handleCloseMenu(){
    this.menuCtrl.close();    
  }
 
  /**
   * 跳转到绑定界面
   * @param item 
   */
  navToBind(item){
    if(this.cvtNonReceives.length==0){
      this.noticeSer.showIonicAlert("未选定资产！");
      return;
    }else{
      this.navCtrl.push("GrantingBindPage",{
        cvtNonReceives:this.cvtNonReceives,
        totalQuantity:this.totalQuantity,
        sentQuantity:this.sentQuantity,
        cvtNonNotice:this.cvtNotice,
        userName: this.navParams.get("userName")
      });
    }
  }

  /**
   * CheckBox发生改变时执行的函数
   * @param asset 
   * @param check 
   */
  handleCheckBox(asset:CvtNonReceive,check:Checkbox){
    if(check.checked==true){
      this.cvtNonReceives.push(asset);
    }else{
      this.cvtNonReceives=this.cvtNonReceives.filter((data)=>{
        return data.assetId!=asset.assetId;
      })
    }
    //计算剩余数量
    for (var i = 0; i < this.noticeSubArray.length; i++) {
      if (this.noticeSubArray[i].noticeId = asset.noticeId) {
        var item = this.noticeSubArray[i];
        var array = this.assetArray.filter((data) => {
          return data.assetName == item.assetName && data.isChecked == false;
        })
        this.noticeSubArray[i].residualQuantity = array.length;
      }
    }
  }

   
}
