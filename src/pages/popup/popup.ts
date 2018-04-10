import { PubConstant } from './../../providers/entity/constant.provider';
import { LoginService } from './../../providers/service/login.service';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';


/**
 * Generated class for the PopupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popup',
  templateUrl: 'popup.html',
})
export class PopupPage {
  public hidden = true;
  public message: string = "";
  public messageSub = "";

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    private loginService: LoginService,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.init();
  }

  init() {
    this.hidden = true;
    //同步员工精简表到本地
    let loading = this.loadingCtrl.create({
      content: "正在同步数据字典...",
      duration:300000,
      dismissOnPageChange:true,
    })
    
    loading.present();
    this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_LAST_REQUEST_TIME).then((lastRequestTime) => {
      if (lastRequestTime == null) {
        lastRequestTime = "";
        this.loginService.downloadDictIfEmpty().then(() => {
          this.loginService.getAndSaveDictDetailFromServe(lastRequestTime).then(() => {
            loading.setContent("正在从服务器获取数据...")
            this.loginService.getAndSaveOrgInfoFromServe(lastRequestTime).then(() => {
              // this.loginService.getAndSaveUserSimpleFromServe(lastRequestTime).then(() => {
              //更新完成可以退出了
              this.loginService.getAndSaveCurrentTimeFromServe();
              loading.setContent("同步成功");
              loading.dismiss();
              this.viewCtrl.dismiss();
              // }, (error) => {
              //   this.uploadFailed(error);
              //   loading.dismiss();
              // })
            }, (error) => {
              this.uploadFailed(error);
              loading.dismiss();
            })
          }, (error) => {
            this.uploadFailed(error);
            loading.dismiss();
          })
        }, (error) => {
          this.uploadFailed(error);
          loading.dismiss();
        })
      } else {
        loading.dismiss();
        this.viewCtrl.dismiss();
      }
    })
  }

  uploadFailed(error) {
    this.message = "同步失败,请检查网络是否通畅!";
    this.hidden = false;
    this.messageSub = error;
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  //重试
  handleReTry() {
    this.hidden = !this.hidden;
    this.init();
  }


  setting() {
    this.loginService.settingHttpAddressAndPort();
  }

}
