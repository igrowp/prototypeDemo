import { PubConstant } from './../../providers/entity/constant.provider';
import { HttpUtils } from './../../providers/utils/httpUtils';
import { LoginService } from './../../providers/service/login.service';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { NoticeService } from '../../providers/service/notice.service';

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
    private alertCtrl: AlertController,
    private noticeService: NoticeService,
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
    // this.Local_URL=HttpUtils.getUrlFromProperties();
    // var url=this.Local_URL.substring(0,this.Local_URL.lastIndexOf('/'));
    var address = HttpUtils.getUrlAddressFromProperties();
    var port = HttpUtils.getUrlPortFromProperties();
    this.alertCtrl.create({
      title: "设置服务器地址/端口",
      inputs: [
        {
          label: '地址',
          name: 'address',
          placeholder: '地址：' + address
        },
        {
          name: 'port',
          placeholder: '端口：' + port
        }
      ],
      buttons: [
        {
          text: '恢复默认值',
          handler: data => {
            HttpUtils.setDefaultUrlToProperties();
            this.noticeService.showNativeToast("设置成功");
          }
        },
        {
          text: '确定',
          handler: data => {
            if (data.address == "") {
              this.noticeService.showNativeToast("服务器地址为空");
            } else if (data.port == "") {
              this.noticeService.showNativeToast("服务器端口为空");
            } else {
              if (!data.address.includes("http://") && !data.address.includes("https://")) {
                data.address = "http://" + data.address;
              }
              HttpUtils.setUrlToProperties(data.address, data.port);
              //保存到本地
              this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_URL_ADDRESS, data.address);
              this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_URL_PORT, data.port);
              this.noticeService.showNativeToast("设置成功");
            }
          }
        }
      ]
    }).present();
  }

}
