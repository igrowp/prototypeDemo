import { Content } from 'ionic-angular/components/content/content';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
/**
 * Generated class for the Test2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test2',
  templateUrl: 'test2.html',
  
})
export class Test2Page {
  

  constructor(public popoverCtrl: PopoverController,
           private alertCtrl:AlertController) {

  }
  navToMyAsset(){
    alert("测试");
  }


}





