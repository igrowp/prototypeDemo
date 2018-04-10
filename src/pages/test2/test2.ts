import { Camera } from '@ionic-native/camera';
import { Content } from 'ionic-angular/components/content/content';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { IonicPage, ActionSheetController } from 'ionic-angular';
import { Component } from '@angular/core';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { ImagePicker } from '@ionic-native/image-picker';
import { AttachmentWebProvider } from '../../providers/web/attachment.web.provider';
/**
 * Generated class for the Test2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-test2',
  templateUrl: 'test2.html',

})
export class Test2Page {
  public arry:Array<any>=new Array<any>();

  public imgfile;


  constructor(public popoverCtrl: PopoverController,
    private actionSheetCtrl:ActionSheetController,
    private imagePicker:ImagePicker,
    private camera:Camera,
    private attachmentWebProvider:AttachmentWebProvider,
    private alertCtrl: AlertController) {

  }
  navToMyAsset() {
    alert("测试");
  }

  upload(){
    // alert("正在上传中"+this.arry.length);
    // this.attachmentWebProvider.uploadBase64("123","sig",this.arry[0]).then(()=>{
    //   alert("提交成功");
    // },(error)=>{
    //   alert(error);
    // })
    
  }

  click() {
    //下面的代码写在一个公用的方法

    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '从imagepicker选择',
          handler: () => {
            const options = {//options表示选取的图片参数
              maximumImagesCount: 5,//一次性最多只能选5张，ios系统无效，android上面有效
              width: 500,//图片的宽度
              height: 500,//图片的高度
              quality: 50,//图片的质量0-100之间选择
              outputType: 1 // default .FILE_URI返回影像档的，0表示FILE_URI返回影像档的也是默认的，1表示返回base64格式的图片
            }
            this.imagePicker.getPictures(options).then((results) => {
              for (var i = 0; i < results.length; i++) {
                //this.arry.push(results[i]);
                alert("data:image/jpeg;base64," + results[i]);
                this.imgfile="data:image/jpeg;base64," + results[i];
                this.arry.push("data:image/jpeg;base64," + results[i]);//处理图片的格式，用于向服务器传输
              }
            }, (err) => { });
          }
        },
        {
          text: '从相册选择',
          handler: () => {
            this.selectPhoto();
          //   const options = {//options表示选取的图片参数
          //     maximumImagesCount: 5,//一次性最多只能选5张，ios系统无效，android上面有效
          //     width: 500,//图片的宽度
          //     height: 500,//图片的高度
          //     quality: 50,//图片的质量0-100之间选择
          //     outputType: 1 // default .FILE_URI返回影像档的，0表示FILE_URI返回影像档的也是默认的，1表示返回base64格式的图片
          //   }
          //   this.imagePicker.getPictures(options).then((results) => {
          //     for (var i = 0; i < results.length; i++) {
          //       //this.arry.push(results[i]);
          //       this.arry.push("data:image/jpeg;base64," + results[i]);//处理图片的格式，用于向服务器传输
          //     }
          //   }, (err) => { });
          }
        }, {
          text: '拍照',
          handler: () => {
            this.takePhoto();
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  /**
   * 从图库选择照片
   */
  selectPhoto(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 50,
      targetWidth: 500,//照片的宽度
      targetHeight: 500,//照片的高度
      encodingType: this.camera.EncodingType.JPEG,
    }).then(results => {
      alert(results);
          //this.arry.push(results[i]);
          this.arry.push("data:image/jpeg;base64," + results);//处理图片的格式，用于向服务器传输
      // var startIndex = imageData.lastIndexOf("/");
      // var lastIndex = imageData.indexOf('?');
      // var imgName = imageData.substring(startIndex + 1, lastIndex);
      // var isExis: boolean = false;
      // this.arry.forEach(file => {
      //   var name = file.substring(file.lastIndexOf("/") + 1, file.indexOf('?'));
      //   if (name == imgName) {
      //     alert("改图pain已经选择");
      //     isExis = true;
      //   }
      // });
      // if (!isExis && this.arry.length < 3) {
      //   this.arry.push(imageData);
      // }
    }, error => {
      //没选图片也会报错，所以这里就不选了
      //alert(JSON.stringify(error));
    });
  }


  takePhoto1(){
    const options = {
      quality: 99,////相片质量
      sourceType: this.camera.PictureSourceType.CAMERA,//从哪里选择图片，PHOTOLIBRARY=0(相册选择)，PHOTOLIBRARY=1(相机拍照)，PHOTOLIBRARY=2(相册选择)
      destinationType: this.camera.DestinationType.DATA_URL,//返回类型，DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
      // allowEdit: true,//在选择之前允许修改截图
      encodingType: this.camera.EncodingType.JPEG,//保存的图片格式： JPEG = 0, PNG = 1
      targetWidth: 900,//照片的宽度
      targetHeight: 900,//照片的高度
      mediaType: this.camera.MediaType.PICTURE,//可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
      // saveToPhotoAlbum: true,//保存到相册
      cameraDirection: 0,//摄像头类型Back= 0,Front-facing = 1
      // popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, this.camera.PopoverArrowDirection.ARROW_ANY)
    }
    this.camera.getPicture(options).then((imageData) => {
      this.arry.push("data:image/jpeg;base64," + imageData);
      
    }, (err) => {
    });
  }


  /**
   * 照照片
   */
  takePhoto() {
    this.camera.getPicture({
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      // encodingType: this.camera.EncodingType.PNG,
      encodingType: this.camera.EncodingType.JPEG,//保存的图片格式： JPEG = 0, PNG = 1
      targetWidth: 900,//照片的宽度
      targetHeight: 900,//照片的高度
      mediaType: this.camera.MediaType.PICTURE,//可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
      // saveToPhotoAlbum: true,//保存到相册
      cameraDirection: 0,//摄像头类型Back= 0,Front-facing = 1
      saveToPhotoAlbum: true
    }).then(imageData => {
        this.arry.push("data:image/jpeg;base64," + imageData);
        alert("data:image/jpeg;base64," + imageData);
    }, error => {
    });
  }
  

}




