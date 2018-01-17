import { Camera } from '@ionic-native/camera';
import { Component} from '@angular/core';
import {
    App,
    IonicPage,
    NavController,
    NavParams,
    PopoverController,
    ViewController,
} from 'ionic-angular';
import {Loading} from "ionic-angular";
import { Http, Headers, RequestOptions } from '@angular/http';
import { DBService } from '../../providers/storage/db.service';




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
  public myPhotoURL: any;
  public error: string;
  public files:Array<string>=new Array<string>();
  public useOrgName="所属地点";
  public manager;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      public camera:Camera,
     public viewCtrl: ViewController,
      public appCtrl: App,
     private http:Http,
     public popoverCtrl:PopoverController,
     private dbService:DBService
    ) {
  }
  create(){
    this.dbService.onCreate();

  }
  deleteDb(){
    this.dbService.deleteDB();
  }
  openDb(){
    this.dbService.openDB();
  }
  closeDb(){
    this.dbService.closeDB();
  }
  upgradeDb(){
    this.dbService.onUpgrade();
  }

  Local_URL:String="http://10.88.133.45:8080/ionicApp";
  getNotice(){
    let headers=new Headers();
     headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded' );

    let options=new RequestOptions({
      headers:headers
    });
    let obj:any={
        leadingOrg:'1170000020003'
    }
    return new Promise((resolve,reject)=>{
      this.http.post(this.Local_URL+"/inv/getInvNoticeByOrg",obj,options)
        .map(res=>res.json())
        .subscribe((data)=>{
          resolve(data);   
          console.log(data);   
        },err=>{
          reject(err);
        });
    });
  }

  
}
