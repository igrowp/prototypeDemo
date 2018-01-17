import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

/**
 * Generated class for the Test3Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test3',
  templateUrl: 'test3.html',
})
export class Test3Page {
  constructor(public viewCtrl: ViewController) {}
  
    close() {
      this.viewCtrl.dismiss();
    }
  

}
