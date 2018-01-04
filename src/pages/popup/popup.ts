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
  public message:string="";

  constructor(public navCtrl: NavController,
    public loadingCtrl:LoadingController,
     public navParams: NavParams,
     private loginService:LoginService,
  public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    //同步员工精简表到本地
    let loading=this.loadingCtrl.create({
      content:"正在从服务器获取数据..."
    })
    loading.present();
    this.loginService.initDB().then(()=>{
      this.loginService.downloadOrgInfoIfEmpty().then(()=>{
      loading.setContent("同步组织机构数据中......")
      this.loginService.downloadUserSimpleIfEmpty().then(()=>{
        //更新完成可以退出了
        loading.setContent("同步成功");
        loading.dismiss();
        this.viewCtrl.dismiss();
      },(error)=>{
        this.message="同步失败,请检查网络是否通畅!";
        loading.dismiss();
      })
     },(error)=>{
      this.message="同步失败,请检查网络是否通畅!";
      loading.dismiss();
    })

    })
    
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }

}
