import { CvtNonNotice, CvtNonNoticeSub } from './../../providers/entity/cvt.entity.provider';
import { CvtService } from './../../providers/service/cvt.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular/components/slides/slides';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';


/**
 * 资产领用页面
 */

@IonicPage()
@Component({
  selector: 'page-convert',
  templateUrl: 'convert.html',
})
export class ConvertPage {
  public dataTable: Array<CvtNonNoticeSub> = new Array<CvtNonNoticeSub>();
  public cvtNotice:CvtNonNotice;
  public workerType: number = 1; //员工类型，0代表普通员工，1代表领用人
  public isShow=false;
  public custodian;
  private workerNumber;
  public slideActivityIndex=1;
  public slideSize=0;
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public cvtService: CvtService,
    private alertCtrl:AlertController,) {
    this.cvtNotice = navParams.get("cvtNotice");
    this.custodian=navParams.get("custodian");
    this.workerNumber=navParams.get("workerNumber");
  }

  ionViewDidLoad() {
    //获取资产领用附加表信息
    this.cvtService.getCvtNoticeSubByNoticeId(this.cvtNotice.noticeId).then((data) => {
      this.dataTable = data;
      this.slideSize=data.length;
    })
  }


  //点击详情
  handleDetail(noticeSub){
    this.cvtService.getCvtAssetListBySubNoticeId(noticeSub.subNoticeId).then((data)=>{
      this.navCtrl.push("ConvertNonDetailPage",{
        fixedAssets:data,
        CvtNonNoticeSub:noticeSub
      })
    })
  }

  //签名确认
  handleSignature(){
    this.alertCtrl.create({
      title:'提示',
      subTitle:'是否再次发放？',
      cssClass:'alert-conform',
      buttons:[
        {
          text:'否',
          handler:data=>{
            this.navCtrl.push("SignaturePage",{
              signatureType:"convert",
              cvtNotice:this.cvtNotice,
              workerType:2,
              workerNumber:this.workerNumber
            });
          }
        },
        {
          text:'是',
          handler:data=>{
            this.navCtrl.push("SignaturePage",{
              signatureType:"convert",
              cvtNotice:this.cvtNotice,
              workerType:1,
              workerNumber:this.workerNumber,
            });
          }
        }
      ]
    }).present();

  }


  /////////////轮播图方法///////////////
  //点击详情
  // handleDetail(){
  //   let activeIndex=this.slides.getActiveIndex();
  //   let noticeSub=this.dataTable[activeIndex];
  //   this.convertService.getCvtAssetByAssetName(noticeSub.specModel,noticeSub.purchasingId,this.workInOrg).then((data)=>{
  //     console.log(data);
  //     this.modalCtrl.create("ConvertNonDetailPage",{
  //       fixedAssets:data
  //     }).present();
  //   })
  // }
  // //显示当前页签
  // handleSlideChanged(){
  //   let currentIndex = this.slides.getActiveIndex()+1;
  //   if(currentIndex>this.slideSize){
  //     currentIndex=this.slideSize;
  //   }
  //   this.slideActivityIndex=currentIndex;
  // }
}
