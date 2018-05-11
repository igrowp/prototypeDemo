import { AlertController, LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';

/**
 * 提供关于提示框的封装方法
 */

@Injectable()
export class NoticeService {
    static TOAST_POS_BOTTOM: string = 'bottom';
    static TOAST_POS_MIDDLE: string = 'middle';

    constructor(private toastCtrl: ToastController,
        private loadingCtrl:LoadingController,
        private alertCtrl: AlertController) {
    }


    /**
     * 加载框
     * @param content 
     * @param duration 
     */
    showIonicLoading(content:string,duration?:number){
        // let options:LoadingOptions;
        let loading=this.loadingCtrl.create({
            content:content,
            duration:duration,
            spinner: 'bubbles',
            dismissOnPageChange:true,
          });
        return loading;
    }

    /**
     * 显示ionic提示框
     * @param message 
     */
    showIonicAlert(message: String,title?:string) {
        var titleString;
        if(title==null||title==""){
            titleString="提示";
        }else{
            titleString=title;
        }
        this.alertCtrl.create({
            title: titleString,
            subTitle: message + "",
            cssClass:'alert-alert',
            buttons: ["确定"]
        }).present();
    }

    /**
     * 显示ionic提示框（带回调函数）
     * @param message 
     */
    showIonicAlertWithCallBack(message: String,handleMethord,title?:string) {
        var titleString;
        if(title==null||title==""){
            titleString="提示";
        }else{
            titleString=title;
        }
        this.alertCtrl.create({
            title: titleString,
            subTitle: message + "",
            cssClass:'alert-alert',
            buttons:[
                {
                  text: '确定',
                  handler: handleMethord
                }
              ]
        }).present();
    }

    /**
     * 显示ionic确认框
     */
    showIoincAlertConform(message:string,callback?){
        this.alertCtrl.create({
            title:'提示',
            subTitle:message,
            cssClass:'alert-conform',
            buttons:[
              {
                text:'取消',
                role:'cancel',
              },
              {
                text:'确定',
                handler:()=>{
                    callback();
                }
              }
            ]
          }).present();
    }

    /**
     * 显示插件TOAST
     * @param message 
     * @param position 
     */
    showToast(message: string, position: string = NoticeService.TOAST_POS_BOTTOM) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });
        toast.present();
        return toast;
    }






}