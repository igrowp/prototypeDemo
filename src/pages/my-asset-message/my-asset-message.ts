import { FixedAsset } from './../../providers/entity/entity.provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AssetMessageTranPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-asset-message',
  templateUrl: 'my-asset-message.html',
})
export class MyAssetMessagePage {
  manufactureDate:any;   //出厂日期
  productionTime:any;    //投产日期      
  fixedAsset:FixedAsset=new FixedAsset();
   private workerNumber;

   constructor(public navCtrl: NavController,
            private navParams:NavParams) {
     //初始化数据
       this.fixedAsset=this.navParams.get("fixedAsset");
       this.workerNumber=this.navParams.get("workerNumber");
       if(this.fixedAsset==null){
         this.fixedAsset=new FixedAsset();
       }
        
       if(this.fixedAsset.techStatus==""||this.fixedAsset.techStatus==null){
         this.fixedAsset.techStatus="01";
       }
        if(this.fixedAsset.useState==""||this.fixedAsset.useState==null){
         this.fixedAsset.useState="01";
       }
     this.manufactureDate=this.formatDate(new Date(this.fixedAsset.manufactureDate));
     this.productionTime=this.formatDate(new Date(this.fixedAsset.productionTime));
  }


  formatDate( date: Date ){
      // 格式化日期，获取今天的日期
      var year: number = date.getFullYear();
      var month: any = ( date.getMonth() + 1 ) < 10 ? '0' + ( date.getMonth() + 1 ) : ( date.getMonth() + 1 );
      var day: any = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      return year + '-' + month + '-' + day;
    };



}
