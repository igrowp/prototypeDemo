import { LoginService } from '../providers/service/login.service';
import { Component } from '@angular/core';
import { ModalController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any = "LoginPage";
  rootPage:any=null;
  //rootPage:any = "HomePage";
  //rootPage:any = "TransPage";
  wFOAddress="";
  userName="";


  
  constructor(platform: Platform,
     statusBar: StatusBar, 
     splashScreen: SplashScreen,
     private modalCtrl:ModalController,
     public loginService:LoginService,) {
      // platform.ready().then(() => {
      //   // Okay, so the platform is ready and our plugins are available.
      //   // Here you can do any higher level native things you might need.
      //   statusBar.styleDefault();
      //   statusBar.show();
      //    splashScreen.show();
      // });
    if(this.rootPage==null){

      //暂时不用
    let modal=this.modalCtrl.create("PopupPage");
    modal.present();

    this.loginService.getFromStorage("account").then((userName)=>{
        if(userName==null||userName==""){
          this.rootPage = "LoginPage";
          return;
        }else{
          //说明有账户在，直接登陆
          this.loginService.getFromStorage("password").then((password)=>{
            this.loginService.queryUserInfoByUserNameAndPWD(userName,password).then((data)=>{
              this.rootPage="HomePage";
            })
          })
        }
      })

    }
  }


}
