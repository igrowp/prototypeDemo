import { ConvertService } from './../../providers/service/convert.service';
import { DateUtil } from './../../providers/utils/dateUtil';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { NoticeService } from './../../providers/service/notice.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CvtNonReceive } from './../../providers/entity/cvt.entity.provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InvService } from '../../providers/service/inv.service';
import { UserSimple } from '../../providers/entity/entity.provider';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';


@IonicPage()
@Component({
  selector: 'page-granting-bind',
  templateUrl: 'granting-bind.html',
})
export class GrantingBindPage {
  public segment="basicMassage";
  public cvtNonReceives:Array<CvtNonReceive>;
  public receiveOrg="";
  public receivePerson="";
  private receiveWorkerNumber="";
  private totalQuantity;
  private sentQuantity;
  private cvtNonNotice;

  constructor(public navCtrl: NavController,
              public invService:InvService,
              private convertSer:ConvertService,
              private alertCtrl:AlertController,
              private noticeSer:NoticeService,
              private ModalCtrl:ModalController,
              private barcodeScanner:BarcodeScanner,
              public menuCtrl:MenuController,
               public navParams: NavParams) {
    this.cvtNonReceives=this.navParams.get("cvtNonReceives");
    this.totalQuantity=this.navParams.get("totalQuantity");
    this.sentQuantity=this.navParams.get("sentQuantity");
    this.cvtNonNotice=this.navParams.get("cvtNonNotice");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GrantingBindPage');
  }

  /**
   * 没有输入领用人时提示信息
   */
  handleSignatureNoManager(){
    this.noticeSer.showIonicAlert("请选择领用人姓名");
  }

  handleSignature(){
    //将领用人信息添加入领用表中
    for(var i=0;i<this.cvtNonReceives.length;i++){
      this.cvtNonReceives[i].receiveOrg=this.receiveOrg;
      this.cvtNonReceives[i].receiveName=this.receivePerson;
      this.cvtNonReceives[i].receivePerson=this.receiveWorkerNumber;
      this.cvtNonReceives[i].receiveTime=DateUtil.formatDateToHMS(new Date());
      this.cvtNonReceives[i].reveiveStyle="0";
      this.cvtNonReceives[i].recordFlag=1;
    }
    this.navCtrl.push("SignaturePage",{
      signatureType:"granting",
      cvtNonReceives:this.cvtNonReceives,
      totalQuantity:this.navParams.get("totalQuantity"),
      sentQuantity:this.navParams.get("sentQuantity"),
      cvtNonNotice:this.navParams.get("cvtNonNotice"),
      userName: this.navParams.get("userName")
    });
  }

  /**
   * 处理扫描的
   */
  handleBindScan(){
    let code="";
      this.barcodeScanner.scan().then((result)=>{
        code=result.text;
        if(code==""){
          return;
        }
        this.convertSer.queryFromUserSimpleByUserId(code).then((userSimple)=>{
          if(userSimple==null){
            this.noticeSer.showIonicAlert("无法识别该二维码！");
          } else {
            this.receiveOrg = userSimple.workInOrg;
            this.receivePerson = userSimple.userName;
            this.receiveWorkerNumber = userSimple.workerNumber;
          }
        })
     });
  }

  /**
   * 删除其中的一项
   * @param asset 
   */
  handleRemove(asset){
    this.alertCtrl.create({
      title:'提示',
      subTitle:'是否要删除该资产？',
      buttons:[
        {
          text:'取消',
          role:'concel'
        },
        {
          text:'确定',
          handler:data=>{
            this.cvtNonReceives=this.cvtNonReceives.filter((data)=>{
              return data.assetId!=asset.assetId;
            })
          }
        }
      ]
    }).present();
  }

  //////////////////////////////////筛选保管人和使用单位的方法/////////////////
  handleBindInput(){
    this.menuCtrl.enable(true, 'grantingSelectPerson');
    this.menuCtrl.open("grantingSelectPerson");
    this.menuCtrl.toggle('right');
    this.invService.queryListFromUserSimple().then((data)=>{
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
    this.receiveOrg = item.workInOrg;
    this.receivePerson = item.userName;
    this.receiveWorkerNumber = item.workerNumber;
    this.menuCtrl.close();
  }
//////////////////////////////////筛选保管人和使用单位的方法END/////////////////
}
