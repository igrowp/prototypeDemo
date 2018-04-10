import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CvtNonNoticeSub } from '../../providers/entity/cvt.entity.provider';

/**
 * 资产领用详情页
 */

@IonicPage()
@Component({
  selector: 'page-convert-non-detail',
  templateUrl: 'convert-non-detail.html',
})
export class ConvertNonDetailPage {
  public fixedAssets;
  public isShow=false;
  public item:CvtNonNoticeSub;

  constructor(public navCtrl: NavController,
    private viewCtrl:ViewController,
     public navParams: NavParams) {
    this.fixedAssets=navParams.get("fixedAssets");
    this.item=navParams.get("CvtNonNoticeSub");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConvertNonDetailPage');
  }

  handleBack(){
    this.viewCtrl.dismiss();
  }
}
