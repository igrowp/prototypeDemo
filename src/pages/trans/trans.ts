import { CvtNonNotice } from './../../providers/entity/cvt.entity.provider';
import { LoginService } from './../../providers/service/login.service';
import { CvtService } from './../../providers/service/cvt.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NoticeService } from '../../providers/service/notice.service';
import { PubConstant } from '../../providers/entity/constant.provider';


/**
 * Generated class for the TransPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 
@IonicPage()
@Component({
  selector: 'page-trans',
  templateUrl: 'trans.html',
})
export class TransPage {
  public listConvert:Array<CvtNonNotice>=new Array<CvtNonNotice>();
  public listGranting:Array<CvtNonNotice>=new Array<CvtNonNotice>();
  private workerNumber;
  private userName;

  constructor(public navCtrl: NavController,
    private loginService:LoginService,
    private barcodeScanner:BarcodeScanner,
    private navParams: NavParams,
    private noticeService:NoticeService,) {
      this.listConvert=navParams.get("listConvert");
      this.listGranting=navParams.get("listGranting");
      this.workerNumber=this.navParams.get("workerNumber");
      this.userName=this.navParams.get("userName");
  }


  navTo(cvtNotice:CvtNonNotice){
    if (cvtNotice != null && cvtNotice.noticeState == "ISSUED") {
      //处于领用状态
      this.navCtrl.push('ConvertPage', {
        workerNumber: this.userName,
        cvtNotice: cvtNotice,
        custodian: this.userName,
      });
    } else if (cvtNotice != null && cvtNotice.noticeState == "GRANTING") {
      //处于发放状态
      this.navCtrl.push("GrantingPage", {
        cvtNonNotice: cvtNotice,
        userName: this.userName,
      });
    } else {  //notice==null  统一进入到二维码界面
      //没有资产通知，说明1.领用人没有领用通知，2.为资产保管人
      this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_USER_ID).then((userId) => {
        this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, userId).then((data) => {
          //进入页面
        }, error => {
          this.noticeService.showIonicAlert(error.message);
        })
      }, error => this.noticeService.showIonicAlert(error))
    }

  }

}
