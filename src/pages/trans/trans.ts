import { CvtNonNotice, CvtNonNoticeSub } from './../../providers/entity/cvt.entity.provider';
import { ConvertService } from './../../providers/service/convert.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FixedAsset } from './../../providers/entity/entity.provider';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular/components/slides/slides';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

/**
 * Generated class for the TransPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trans',
  templateUrl: 'trans.html',
})
export class TransPage {
  public dataTable: Array<CvtNonNoticeSub> = new Array<CvtNonNoticeSub>();
  public cvtNotice:CvtNonNotice;
  public workerType: number = 1; //员工类型，0代表普通员工，1代表领用人
  public isShow=false;
  public custodian;
  private workerNumber;
  public slideActivityIndex=1;
  public slideSize=0;
  private workInOrg;
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public convertService: ConvertService,
    private alertCtrl:AlertController,
    private modalCtrl:ModalController,
    private barcodeScanner: BarcodeScanner) {
    this.cvtNotice = navParams.get("cvtNotice");
    this.custodian=navParams.get("custodian");
    this.workInOrg=navParams.get("workInOrg");
    this.workerNumber=navParams.get("workerNumber");
    console.log(this.cvtNotice.noticeId);
    

  }

  ionViewDidLoad() {
    this.convertService.getCvtNoticeSubByNoticeId(this.cvtNotice.noticeId).then((data) => {
      console.log(data);
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
    this.convertService.getCvtAssetByAssetName(noticeSub.specModel,noticeSub.purchasingId,this.workInOrg).then((data)=>{
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
              workInOrg:this.workInOrg,
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
              workInOrg:this.workInOrg,
              workerNumber:this.workerNumber,
              userName:this.custodian
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
