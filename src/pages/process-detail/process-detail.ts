import { CvtNonNoticeSub, CvtNonNotice } from './../../providers/entity/cvt.entity.provider';
import { TodoEvent } from './../../providers/entity/pub.entity';
import { FixedAsset } from './../../providers/entity/entity.provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CvtWebProvider } from '../../providers/web/cvt.web.provider';

/**
 * Generated class for the ProcessDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-process-detail',
  templateUrl: 'process-detail.html',
})
export class ProcessDetailPage {
  public message="测试";
  public assets:Array<FixedAsset>=new Array<FixedAsset>();
  public cvtNonNotice:CvtNonNotice=new CvtNonNotice();
  public cvtNonNoticeSubList:Array<CvtNonNoticeSub>


  private userName;
  private workerNumber;
  private todoEvent:TodoEvent;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private cvtWebProvider:CvtWebProvider) {
      this.userName=this.navParams.get("userName");
      this.workerNumber=this.navParams.get("workerNumber");
      this.todoEvent=this.navParams.get("todoEvent");
      if(!this.todoEvent){
        this.todoEvent=new TodoEvent();
      }
      this.init();
  }

  init(){
    this.cvtWebProvider.getCvtNoticeByNoticeId(this.todoEvent.eventId).then((notice) => {
      if (notice == null) {
        alert("获取通知单失败");
      } else {
        this.cvtWebProvider.getCvtNonNoticeSub(notice.noticeId).then((noticeSubList) => {
          this.cvtNonNotice = notice;
          this.cvtNonNoticeSubList = noticeSubList;
        })

      }
    })
  }
  

  ionViewDidLoad() {
  }

  handleApprove(){
    this.navCtrl.push("ProcessApprovePage",{
      userName:this.userName,
      todoEvent:this.todoEvent,
    });

  }

  handleDetail(noticeSub){
    this.cvtWebProvider.getCvtAssetBySubNoticeId(noticeSub.subNoticeId).then((data)=>{
      this.navCtrl.push("ConvertNonDetailPage",{
        fixedAssets:data,
        CvtNonNoticeSub:noticeSub
      })
    })

  }

}
