import { Scrap } from './../../providers/entity/pub.entity';
import { PubConstant } from './../../providers/entity/constant.provider';
import { DataBaseUtil } from './../../providers/utils/dataBaseUtil';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Camera } from '@ionic-native/camera';
import { AssetService } from './../../providers/service/asset.service';
import { DateUtil } from './../../providers/utils/dateUtil';
import { FixedAsset } from './../../providers/entity/entity.provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NoticeService } from '../../providers/service/notice.service';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { Idle } from '../../providers/entity/pub.entity';
import { AssetHandleService } from '../../providers/service/asset.handle.service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

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
  public photos: Array<string> = new Array<string>();
  isHiddenSearch=true;
  public handleType="完善资产信息";
  public fixedAsset:FixedAsset=new FixedAsset();
  public dateNow = DateUtil.formatDate(new Date());

   constructor(public navCtrl: NavController,
    private noticeService:NoticeService,
    private camera:Camera,
    private loadingCtrl:LoadingController,
    private assetHandleService:AssetHandleService,
    private actionSheetCtrl:ActionSheetController,
    private alertCtrl:AlertController,
    private assetService:AssetService,
            private navParams:NavParams) {
     //初始化数据
       this.fixedAsset=this.navParams.get("fixedAsset");
  }


  handleSubmit(){
    if(this.handleType=="完善资产信息"){
      this.handleType="提交";
    }else{
      this.fixedAsset.isSynchro=1;
      this.assetService.updateToFixed(this.fixedAsset).then(()=>{
        let fixedAssets=new Array<FixedAsset>();
        fixedAssets.push(this.fixedAsset);
        this.assetService.syncFixedToServer(fixedAssets).then(()=>{
          this.fixedAsset.isSynchro=2;
          this.assetService.updateToFixed(this.fixedAsset);
        })
        this.noticeService.showIonicAlert("提交成功");
        this.navCtrl.pop();
      })
    }
  }

  
  handleIdle(){
    if(this.fixedAsset.useState==PubConstant.DICT_SUB_TYPE_IDLE){
      //如果当前资产为闲置状态
      this.noticeService.showIonicAlert("该资产已经是闲置状态");
    }else{
      let loading=this.noticeService.showIonicLoading("正在获取资产状态",100000);
      loading.present();
      this.assetHandleService.getIdleFromServe(this.fixedAsset.assetId).then((data)=>{
        loading.dismiss();
        if(data){
          if(data.applyState==PubConstant.APPLY_STATE_NULL||data.applyState==PubConstant.APPLY_STATE_UNSUBMIT||data.applyState==PubConstant.APPLY_STATE_REJECT){
            //未提交或驳回，可以重新进行填写
            this.assetHandleService.getIdleByAssetId(this.fixedAsset.assetId).then((idle)=>{
              this.navCtrl.push("IdlePage",{
                idle:idle
              });
            })
          }else if(data.applyState==PubConstant.APPLY_STATE_SUBMIT){
            this.noticeService.showIonicAlert("正在审批中");
          }else{
            this.noticeService.showIonicAlert("该资产已经是闲置状态");
          }
        }else{
          //不是闲置状态，并且没有提交过申请
          let idle:Idle=new Idle();
          idle.idleId=DataBaseUtil.generateUUID();
          idle.assetId=this.fixedAsset.assetId;
          idle.applyState=PubConstant.APPLY_STATE_NULL;
          idle.recordFlag=0;
          this.navCtrl.push("IdlePage",{
            idle:idle
          });
        }
      },error=>this.noticeService.showIonicAlert(error))
    }
  }

  handleScrap(){
    if(this.fixedAsset.techStatus==PubConstant.DICT_SUB_TYPE_SCRAP){
      //如果当前资产为闲置状态
      this.noticeService.showIonicAlert("该资产已经是闲置状态");
    }else{
      let loading=this.noticeService.showIonicLoading("正在获取资产状态",100000);
      loading.present();
      this.assetHandleService.getScrapFromServe(this.fixedAsset.assetId).then((data)=>{
        loading.dismiss();
        if(data){
          if(data.applyState==PubConstant.APPLY_STATE_NULL||data.applyState==PubConstant.APPLY_STATE_UNSUBMIT||data.applyState==PubConstant.APPLY_STATE_REJECT){
            //未提交或驳回，可以重新进行填写
              this.navCtrl.push("ScrapPage",{
                scrap:data
              });
          }else if(data.applyState==PubConstant.APPLY_STATE_SUBMIT){
            this.noticeService.showIonicAlert("正在审批中");
          }else{
            this.noticeService.showIonicAlert("该资产已经是闲置状态");
          }
        }else{
          //不是闲置状态，并且没有提交过申请
          let scrap:Scrap=new Scrap();
          scrap.scrapId=DataBaseUtil.generateUUID();
          scrap.assetId=this.fixedAsset.assetId;
          scrap.applyState=PubConstant.APPLY_STATE_NULL;
          scrap.recordFlag=0;
          this.navCtrl.push("ScrapPage",{
            scrap:scrap
          });
        }
      },error=>this.noticeService.showIonicAlert(error))
    }
  }
  handleBack(){
    this.handleType="完善资产信息";
  }


  /**
   * 确认是否删除按钮
   * @param file 
   */
  private isDeleteImg(index) {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: '是否要删除该照片?',
      cssClass: 'alert-conform',
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
            this.photos.splice(index);
          }
        }
      ]
    });

    alert.present();
  }


  /**
* 添加图片
*/
  add() {
    if (this.photos.length >= 3) {
      //只能上传三张照片
      this.noticeService.showIonicAlert("只能上传三张照片哦");
      return;
    } else {
      this.useASComponent();
    }
  }

  /**
   * 底部选择项
   */
  private useASComponent() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "选择",
      buttons: [
        {
          text: "拍照",
          handler: () => {
            this.takePhoto();
            //alert("拍照");startCamera
          }
        },
        {
          text: "从手机相册选择",
          handler: () => {
            this.selectPhoto();
            //alert("拍照");choosePhoto
          }
        },
        {
          text: "取消",
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }

  /**
   * 照照片
   */
  takePhoto() {
    this.camera.getPicture({
      quality: 10,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.PNG,
      saveToPhotoAlbum: true
    }).then(imageData => {
      if (this.photos.length < 3) {
        this.photos.push(imageData);
      }
    }, error => {
    });
  }


  /**
   * 从图库选择照片
   */
  selectPhoto(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 10,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
      var startIndex = imageData.lastIndexOf("/");
      var lastIndex = imageData.indexOf('?');
      var imgName = imageData.substring(startIndex + 1, lastIndex);
      var isExis: boolean = false;
      this.photos.forEach(file => {
        var name = file.substring(file.lastIndexOf("/") + 1, file.indexOf('?'));
        if (name == imgName) {
          this.noticeService.showIonicAlert("该图片已选择");
          isExis = true;
        }
      });
      if (!isExis && this.photos.length < 3) {
        this.photos.push(imageData);
      }
    }, error => {
      //没选图片也会报错，所以这里就不选了
      //alert(JSON.stringify(error));
    });
  }

}
