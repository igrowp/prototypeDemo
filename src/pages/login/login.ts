import { AssetService } from './../../providers/service/asset.service';
import { BackButtonService } from './../../providers/service/backButton.service';
import { NoticeService } from './../../providers/service/notice.service';
import { LocalStorageService } from './../../providers/service/localStorage.service';
import { WebService } from './../../providers/service/web.service';
import { LoginService } from './../../providers/service/login.service';
import { Component, ViewChild } from '@angular/core';
import {
  AlertController,
    Content,
    IonicPage,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    Platform,
} from 'ionic-angular';
// declare var window;
/**
 * 登陆界面
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public isRemember="";
  public account;  //账户
  private accountCopy;  //复制账户
  public userPwd;  //密码
  public Local_URL:string="http://11.10.97.76:8080/ionicApp";  //设置服务器地址

  constructor(public modalCtrl: ModalController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loginService: LoginService,
    public webService:WebService,
    private alertCtrl:AlertController,
    private noticeService:NoticeService,
    private assetService:AssetService,
    private backButtonService: BackButtonService,
    private platform: Platform,
    private loadingCtrl:LoadingController,
    public storageService:LocalStorageService) {
      platform.ready().then(() => {
          this.backButtonService.registerBackButtonAction(null);
      });
        
      this.loginService.getFromStorage("isRemember").then((val)=>{
        if(val!=null&&val!=""){
          this.isRemember=val;
        }else{
          this.isRemember="false";
        }
      })

      this.loginService.getFromStorage("account").then((val)=>{
        if(val!=null&&val!=""){
          this.account=val;
          this.accountCopy=val;
          this.userPwd=this.loginService.getFromStorage("password").then((val)=>{
            this.userPwd=val;
          })
        }
      });
  }


  logIn(username: HTMLInputElement, password: HTMLInputElement) {
    if (username.value.length == 0) {
      this.noticeService.showNativeToast("请输入账号");
    } else if (password.value.length == 0) {
      this.noticeService.showNativeToast("请输入密码");
    } else {
      this.loginService.queryAccountByUserNameAndPWD(username.value,password.value).then((data)=>{
        if(data==null){
          //查询不到该人信息，账户密码错误
          this.noticeService.showIonicAlert("账号或密码错误，请确认后重试!");          //%%%%%%%%可以进行判断，是账户还是密码错误，做到更智能
        }else{
          let loading=this.loadingCtrl.create({
            content:'正在登陆中.....'
          });
          loading.present();
          //如果是否登陆状态发生改变，在本地数据库进行修改
          // this.loginService.getFromStorage("isRemember").then((val)=>{
          //   if(this.isRemember!=val){
          //     alert("执行方法");
          //     this.loginService.setInStorage("isRemember",this.isRemember+"");
          //   }
          // })
          this.loginService.setInStorage("isRemember",this.isRemember+"");

          // 在本地记录登陆账户信息
          this.loginService.setInStorage("account", username.value);
          this.loginService.setInStorage("password", password.value);
          this.loginService.setInStorage("workerNumber", data.workerNumber);

          //获取该员工信息
          loading.setContent('正在获取员工信息...');
          this.loginService.getUserMessageFromServer(data.userId).then((user) => {
            this.loginService.setInStorage("wFOAddress", user.wFOAddress);
            this.loginService.setInStorage("userName", user.userName);
            this.loginService.setInStorage("workForOrg", user.workForOrg);
            this.loginService.setInStorage("workInOrg",user.workInOrg);
            this.loginService.setInStorage("userId",user.userId);
            
            //查看数据库中是否有该员工的资产信息，没有的话从服务器中更新
            this.assetService.queryAssetsFormFixedByPage(2,1,user.workerNumber).then((data)=>{
              if(data.length==0){
                //没有数据，下载资产数据
                loading.setContent('正在获取资产数据...');
                this.assetService.downloadAndSaveData(user.workerNumber).then((data)=>{
                  //同步员工精简表到本地
                  //更新完可以登陆了
                  loading.dismiss();
                  this.navCtrl.setRoot("HomePage");
                },(error)=>{
                  loading.dismiss();
                  this.noticeService.showIonicAlert("连接超时，请检查网络状况");
                })
              }else{
                //数据库中有数据，登陆
                loading.dismiss();
                this.navCtrl.setRoot("HomePage");
              }
            })
          },(error)=>{
            loading.dismiss();
            this.noticeService.showIonicAlert(error);
          })
        }
      },(error)=>{
        this.noticeService.showIonicAlert(error);
      })
    }
  }


  setting(){
    this.Local_URL=this.webService.getURL();
    var url=this.Local_URL.substring(0,this.Local_URL.lastIndexOf('/'));
    url=url.substring(0,this.Local_URL.lastIndexOf('/'));
    let alert=this.alertCtrl.create({
      title:"设置服务器地址",
      inputs:[{
        name:'Local_URL',
        placeholder:url
      }],
      buttons:[
        {
          text:'恢复默认值',
          role:'cancel',
          handler:data=>{
            this.Local_URL="http://11.10.97.76:8080/ionicApp/";
            this.webService.setURL(this.Local_URL);
            this.loginService.getFromStorage("URL").then((val)=>{
              if(val!=null&&val!=""){
                this.loginService.RemoveFromStorage("URL").then(()=>{
                  this.loginService.setInStorage("URL",this.Local_URL);
                })
              }else{
                this.loginService.setInStorage("URL",this.Local_URL);
              }
            })
          }
        },
        {
          text:'确定',
          handler:data=>{
            if(data.Local_URL==""){
              this.noticeService.showIonicAlert("输入服务器地址为空！");
              return;
            }
            this.Local_URL=data.Local_URL+"/ionicApp/";
            this.webService.setURL(this.Local_URL);
            this.loginService.getFromStorage("URL").then((val)=>{
              if(val!=null&&val!=""){
                this.loginService.RemoveFromStorage("URL").then(()=>{
                  this.loginService.setInStorage("URL",this.Local_URL);
                })
              }else{
                this.loginService.setInStorage("URL",this.Local_URL);
              }
            })
          }
        }
      ]
      
    }).present();
  }



  //在输入框出现后向上移动，防止输入框被遮住
  @ViewChild(Content) content:Content;
  showDiv: boolean = false;
  height=0;
  
  // scrollToUp(){
  //   // this.showDiv = !this.showDiv;
  //   // this.content.resize();

  //   // var top =this.content.scrollTop;
  // //   var eleTop=this.content.contentHeight*0.2;   //为中间用户输入块高度的一半
  // //   var realTop=top+eleTop;
  //   var realTop=this.content.scrollTop+this.content.contentHeight*0.3;
  //   this.height=realTop;
  //   setTimeout(()=>{
  //     this.content.scrollTo(0,realTop,200);
  //   },200);
  // }
  // scrollToDown(){
  //   // this.showDiv = !this.showDiv;
  //   // this.content.resize();

  //   //var realTop=-(this.content.scrollTop+this.content.contentHeight*0.2);
  //   setTimeout(()=>{
  //     this.content.scrollTo(0,-this.height,200);
  //   },200);
    
  // }

}
