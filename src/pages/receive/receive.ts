import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// declare let qrcode:any;
  
/**
 * Generated class for the ReceivePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html',
})
export class ReceivePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private barcodeScanner:BarcodeScanner) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceivePage');
  }

  scan(){
    let options={
      // showTorchButton:true,
      preferFrontCamera : true, // iOS and Android
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: true, // Android, launch with the torch switched on (if available)
          saveHistory: true, // Android, save scan history (default false)
          prompt : "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
    }
    this.barcodeScanner.scan(options).then((data)=>{
      alert(data.text);
    });

  }
  encode(input){
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE,input.value).then((data)=>{
      alert(data);
    },error=>{
      alert(error.message);
    })

  }

  // jQencode(code){
  //   code.qrcode("this plugin is great");
  // }


}
