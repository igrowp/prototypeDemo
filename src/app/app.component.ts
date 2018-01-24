import { HttpUtils } from './../providers/utils/httpUtils';
import { Component } from '@angular/core';
import { ModalController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DBService } from '../providers/storage/db.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any = "LoginPage";
  rootPage:any=null;
  //rootPage:any = "HomePage";
  //rootPage:any = "Test2Page";

 
  constructor(platform: Platform,
     statusBar: StatusBar, 
     splashScreen: SplashScreen,
     private modalCtrl:ModalController,
     private dbService:DBService,
    ) {
      //创建数据库
      this.dbService.initDB().then(()=>{
        //初始化一些数据
        this.init();
      });

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

    


    this.dbService.getFromStorage("account").then((userName)=>{
        if(userName==null||userName==""){
          this.rootPage = "LoginPage";
          return;
        }else{
          //说明有账户在，直接登陆
          this.dbService.getFromStorage("password").then((password)=>{
            this.dbService.getFromStorage("signIn").then((isSigned)=>{
              if(isSigned=="true"){
                this.rootPage="HomePage";
              }else{
                this.rootPage="LoginPage";
              }
            })
            // this.loginService.queryUserInfoByUserNameAndPWD(userName,password).then((data)=>{
              
            // })
          })
        }
      })

    }
  }

  init(){
    //初始化服务器地址
    this.dbService.getFromStorage("urlAddress").then((address)=>{
      if(address==null||address==""){
        //本地没有服务器设置，服务器设为默认值
        HttpUtils.setDefaultUrlToProperties();
      }else{
        this.dbService.getFromStorage("urlPort").then((port)=>{
          HttpUtils.setUrlToProperties(address,port);
        })
      }
    })

  }


}
