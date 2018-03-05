import { DataBaseUtil } from './../../providers/utils/dataBaseUtil';
import { Idle } from './../../providers/entity/pub.entity';
import { Camera } from '@ionic-native/camera';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { NoticeService } from '../../providers/service/notice.service';
import { AssetHandleService } from '../../providers/service/asset.handle.service';

/**
 * Generated class for the IdlePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-idle',
  templateUrl: 'idle.html',
})
export class IdlePage {
  public photos: Array<string> = new Array<string>();
  public idle:Idle=new Idle();
  constructor(public navCtrl: NavController,
    private assetHandleService:AssetHandleService,
    private camera:Camera,
    private noticeService:NoticeService,
    private actionSheetCtrl:ActionSheetController,
    private alertCtrl:AlertController,
     public navParams: NavParams) {
       this.idle=this.navParams.get("idle");
       
       
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IdlePage');
  }

  //提交
  handleSubmit(){
    if(this.idle.installLocation&&this.idle.testResult&&this.idle.stopReason&&this.idle.assetDesc&&this.photos){
      if(this.idle.installLocation.trim()==""){
        this.noticeService.showIonicAlert("安装地点不能为空")
        return;
      }
      if(this.idle.testResult.trim()==""){
        this.noticeService.showIonicAlert("检定结果不能为空")
        return;
      }
      if(this.idle.stopReason.trim()==""){
        this.noticeService.showIonicAlert("停用原因及目前保护措施不能为空")
        return;
      }
      if(this.idle.assetDesc.trim()==""){
        this.noticeService.showIonicAlert("资产现状不能为空")
        return;
      }
      let loading=this.noticeService.showIonicLoading("正在提交",10000);
      loading.present();
      this.assetHandleService.synchroIdleToServe(this.idle).then((result) => {
        loading.dismiss();
        this.noticeService.showIonicAlert(result);
        this.navCtrl.pop();
      }, error => {
        loading.dismiss();
        this.noticeService.showIonicAlert(error);
      })
    } else {
      this.noticeService.showIonicAlert("请补全信息")
    }
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
