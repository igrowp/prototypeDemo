import { PubConstant } from './../../providers/entity/constant.provider';
import { Properties } from './../../providers/properties/properties';
import { AssetService } from './../../providers/service/asset.service';
import { BackButtonService } from './../../providers/service/backButton.service';
import { NoticeService } from './../../providers/service/notice.service';
import { LoginService } from './../../providers/service/login.service';
import { Component } from '@angular/core';
import {
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
  public isRemember = "";  //是否记住密码
  public account;  //账户
  private accountCopy;  //复制账户
  public userPwd;  //密码
  public Local_URL: string = Properties.webConfig.address + ":" + Properties.webConfig.port + "/" + Properties.webConfig.project;
  constructor(public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loginService: LoginService,
    private noticeService: NoticeService,
    private assetService: AssetService,
    private backButtonService: BackButtonService,
    private platform: Platform,
    private loadingCtrl: LoadingController) {
    this.platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(null);
    });
    this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_ACCOUNT).then((val) => {
      if (val != null && val != "") {
        this.account = val;
        this.accountCopy = val;
        this.userPwd = this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_PASSWORD).then((val) => {
          this.userPwd = val;
        })
      }
    });
  }
  ionViewWillEnter() {
    this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_IS_REMEMBER).then((val) => {
      if (val != null && val != "") {
        this.isRemember = val;
      } else {
        this.isRemember = "false";
      }
    })
  }


  logIn(username: HTMLInputElement, password: HTMLInputElement) {
    if (username.value.length == 0) {
      this.noticeService.showToast("请输入账号");
    } else if (password.value.length == 0) {
      this.noticeService.showToast("请输入密码");
    } else {
      this.loginService.queryAccountByUserNameAndPWD(username.value, password.value).then((data) => {
        if (data == null) {
          //查询不到该人信息，账户密码错误
          this.noticeService.showIonicAlert("账号或密码错误，请确认后重试!");          //%%%%%%%%可以进行判断，是账户还是密码错误，做到更智能
        } else {
          let loading = this.loadingCtrl.create({
            content: '正在登陆中.....',
            dismissOnPageChange: true
          });
          loading.present();
          //如果是否登陆状态发生改变，在本地数据库进行修改
          this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_IS_REMEMBER, this.isRemember + "");

          // 在本地记录登陆账户信息
          this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_ACCOUNT, username.value);
          this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_PASSWORD, password.value);
          this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_WORKER_NUMBER, data.workerNumber);

          //获取该员工信息
          loading.setContent('正在获取员工信息...');
          this.loginService.getUserMessageFromServer(data.userId).then((user) => {
            this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_WORK_FOR_ORG, user.workForOrg);
            this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_WFO_ADDRESS, user.wfoAddress);
            this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_USER_NAME, user.userName);
            this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_WORK_IN_ORG, user.workInOrg);
            this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_USER_ID, user.userId);
            this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_SIGN_IN, "true");
            this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_SYNCHRO_TIME, user.synchroTime);

            //查看数据库中是否有该员工的资产信息，没有的话从服务器中更新
            this.assetService.queryAssetsFormFixedByPage(2, 1, user.workerNumber).then((data) => {
              if (data.length == 0) {
                //没有数据，下载资产数据
                loading.setContent('正在获取资产数据...');
                this.assetService.downloadAndSaveData(user.workerNumber).then((data) => {
                  //同步员工精简表到本地
                  //更新完可以登陆了
                  loading.dismiss();
                  this.navCtrl.setRoot("HomePage");
                }, (error) => {
                  loading.dismiss();
                  this.noticeService.showIonicAlert("连接超时，请检查网络状况");
                })
              } else {
                //数据库中有数据，登陆
                loading.dismiss();
                this.navCtrl.setRoot("HomePage");
              }
            })
          }, (error) => {
            loading.dismiss();
            this.noticeService.showIonicAlert(error);
          })
        }
      }, (error) => {
        this.noticeService.showIonicAlert(error);
      })
    }
  }



  /**
   * 设置服务器地址和端口
   */
  setting() {
    this.loginService.settingHttpAddressAndPort();
  }

  //在输入框出现后向上移动，防止输入框被遮住
  // @ViewChild(Content) content:Content;
  // showDiv: boolean = false;
  // height=0;

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
