import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';
declare let ReadRFID: any;


@Injectable()
export class NoticeService {
    static TOAST_POS_BOTTOM: string = 'bottom';
    static TOAST_POS_MIDDLE: string = 'middle';

    constructor(private toastCtrl: ToastController,
        private alertCtrl: AlertController) {
    }

    /**
     * 显示安卓原生TOAST
     * @param message 
     */
    showNativeToast(message: string) {
        ReadRFID.showToast(message);

    }

    /**
     * 显示ionic自带TOAST
     * @param message 
     */
    showIonicAlert(message: String) {
        this.alertCtrl.create({
            title: "提醒",
            subTitle: message + "",
            buttons: ["确定"]
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
            duration: 1500,
            position: position
        });
        toast.present();
        return toast;
    }

    /**
     * 显示插件TOAST
     * @param code  1为提示 
     * @param msg   显示消息内容
     */
    showNoticeByToast(code: Number, msg: string) {
        let m = '';

        if (msg && msg.length > 0) {
            if (msg.charAt(msg.length - 1) == '!' || msg.charAt(msg.length - 1) == '！') {
                msg = msg.substr(0, msg.length - 1);
            }
        }

        if (code == 1) {
            m = "提示：" + msg + "！";
        } else {
            m = "错误" + code + "：" + msg + "！";
        }

        return this.showToast(m);
    }






}