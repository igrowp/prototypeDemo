import { CvtNonNotice, CvtNonNoticeSub } from './../../providers/entity/cvt.entity.provider';
import { CvtService } from './../../providers/service/cvt.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular/components/slides/slides';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';


/**
 * Generated class for the TransformPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info * on Ionic pages and navigation. */

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
    this.cvtService.getCvtNoticeSubByNoticeId(this.cvtNotice.noticeId).then((data) => {
      this.dataTable = data;
      this.slideSize=data.length;
      
      // if (this.fixedAssets.length == 0) {
      //   //没有得到数据，说明不是领用人，一条一条插入
      //   this.workerType = 0;
      // } else {
      //   //领用人
      //   this.fixedAssets = fixedAssets;
      //   console.log(this.fixedAssets);
      //   this.workerType = 1;
      // }
    })
  }
  //点击详情
  handleDetail(noticeSub){
    this.cvtService.getCvtAssetBySubNoticeId(noticeSub.subNoticeId).then((data)=>{
      console.log(data);
      console.log(noticeSub);
      this.navCtrl.push("ConvertNonDetailPage",{
        fixedAssets:data,
        CvtNonNoticeSub:noticeSub
      })
      // this.modalCtrl.create("ConvertNonDetailPage",{
      //   fixedAssets:data,
      //   CvtNonNoticeSub:noticeSub
      // }).present();
    })
  }

  //签名确认
  handleSure(){
    this.showSelect();
  }


  showSelect(){
    this.alertCtrl.create({
      title:'提示',
      subTitle:'是否再次发放？',
      buttons:[
        // {
        //   text:'取消',
        //   role:'concel'
        // },
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
