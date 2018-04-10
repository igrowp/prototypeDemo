import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
declare let ReadRFID: any;
/**
 * Generated class for the Test1Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test1',
  templateUrl: 'test1.html',
})
export class Test1Page {
  constructor(private viewCtrl:ViewController,

    ) {
  }


  dismiss(){
    let data = { result: 'bar' };
   this.viewCtrl.dismiss(data);
  }


  test1() {
    ReadRFID.start((success) => {
      alert("启动成功");
      alert(success);
    }, (error) => {
      alert("失败：" + error)
    })

  }
  
}
