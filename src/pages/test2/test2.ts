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

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create("Test3Page");
    popover.present({
      ev: myEvent
    });
  }

  
  webTest(){
      // this.dbService.getSqliteObject().then((db)=>{
      //   alert(db);
      // })
      alert();
  }
  alert(){
    var a=this.alertCtrl.create({
      title:'同步数据',
      message:"上次同步时间：2017年7月10日",
      cssClass:"text-align: center",
      buttons:[
        {
          text:'取消',
          role:'concel',
          handler:()=>{

          }
        },
        {
          text:'确定',
          cssClass:"border:1px",
          handler:()=>{
            
            
          }
        }

      ]
    }).present();
  }


}





