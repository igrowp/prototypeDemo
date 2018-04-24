import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CvtNonNoticeSub } from '../../providers/entity/cvt.entity.provider';
import { FixedAsset } from '../../providers/entity/entity.provider';

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

  handleBack(){
    this.viewCtrl.dismiss();
  }

  handleDetail(item:FixedAsset){
    this.navCtrl.push("ProcessAssetMessagePage", {
      eventType: "资产详情页",
      fixedAsset: item
    })
    // this.assetWebProvider.getFixedByAssetId(item.assetId).then((data)=>{
    //   this.navCtrl.push("ProcessAssetMessagePage", {
    //     eventType: "资产详情页",
    //     fixedAsset: data,
    //   })
    // })
  }
}
