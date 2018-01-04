import { OrgInfo } from './../../providers/entity/entity.provider';
import { ConvertService } from './../../providers/service/convert.service';
import { File,FileEntry } from '@ionic-native/file';
import { ForkJoinObservable } from 'rxjs/observable/ForkJoinObservable';
import { Camera } from '@ionic-native/camera';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
    ActionSheetController,
    AlertController,
    App,
    IonicPage,
    NavController,
    NavParams,
    PopoverController,
    ViewController,
} from 'ionic-angular';
import {LoadingController, Loading, ToastController} from "ionic-angular";
import {Observable} from "rxjs";
import { Http, Headers, RequestOptions } from '@angular/http';




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
  private loading: Loading;
  public files:Array<string>=new Array<string>();
  public useOrgName="所属地点";
  public manager;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      public camera:Camera,
      private actionSheetCtrl:ActionSheetController,
       private readonly toastCtrl: ToastController,
     private readonly loadingCtrl: LoadingController,
     private file:File,
     public viewCtrl: ViewController,
      public appCtrl: App,
     private http:Http,
     public popoverCtrl:PopoverController,
     private alertCtrl:AlertController,
     private convertService:ConvertService
    ) {
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
        .map(res=>res.json)
        .subscribe((data)=>{
          resolve(data);   
          console.log(data);   
        },err=>{
          reject(err);
        });
    });
  }

  
}
