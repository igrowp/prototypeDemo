import { ActionSheetController } from 'ionic-angular';
import { AssetService } from './../../providers/service/asset.service';
import { Component } from '@angular/core';
import {Camera,CameraOptions} from "@ionic-native/camera";
import { AlertController, IonicPage, NavController, Platform } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@IonicPage()
@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html'
})
export class MinePage {
  Local_URL:String="http://10.88.133.45:8080/ionicApp";

  public dataTable:any;
  public path;
  profilePicture: any="./assets/imgs/inv.png";

  constructor(public navCtrl: NavController,
          private platform:Platform,
          private assetService:AssetService,
          private actionSheetCtrl:ActionSheetController,
          private camera:Camera,
          private imagePicker: ImagePicker,
          private transfer:FileTransfer
        ) {
  }

  ionViewDidEnter(){
    //加载数据
    //  this.service.getAssets().then((data)=>{
    //    this.dataTable=data;
    //  });
    this.assetService.queryAssetsFormFixed("1","-1").then(data=>{
      this.dataTable=null;
      this.dataTable=data;
    })
    
  }

actionSheet(){
    this.useASComponent();
    
  }

private useASComponent(){
      let actionSheet =this.actionSheetCtrl.create({
          title:"选择",
          buttons:[
              {
                  text:"拍照",
                  handler:()=>{
                    this.startCamera();
                    //alert("拍照");startCamera
                  }
              },
                {
                  text:"从手机相册选择",
                  handler:()=>{
                    this.choosePhoto2();
                    //alert("拍照");choosePhoto
                  }
              },
              {
                  text:"从手机相册选择",
                  handler:()=>{
                    this.choosePhoto();
                    //alert("相册");
                  }
              },
                {
                  text:"换图",
                  handler:()=>{
                    this.profilePicture="./assets/imgs/avatar.png";
                    //alert("相册");
                  }
              },
              {
                  text:"取消",
                  role:'cancel',
                  handler:()=>{

                  }
              }
          ]
      });
      actionSheet.present();
  }

  takePhoto(){
    const options: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.DATA_URL,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE
}

this.camera.getPicture(options).then((imageData) => {
 // imageData is either a base64 encoded string or a file URI
 // If it's base64:
 let base64Image = 'data:image/jpeg;base64,' + imageData;
 alert(base64Image);
}, (err) => {
 // Handle error
 alert(err);
});

  }


 options = {
  quality: 100,
  destinationType: this.camera.DestinationType.DATA_URL,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE,
  saveToPhotoAlbum:true,
      sourceType:this.camera.PictureSourceType.CAMERA,//拍照时，此参数必须有，否则拍照之后报错，照片不能保存
}

  takePhotos(){
    

this.camera.getPicture(this.options).then((imageData) => {
 // imageData is either a base64 encoded string or a file URI
 // If it's base64:
 let base64Image = 'data:image/jpeg;base64,' + imageData;
 alert(imageData);
 alert(base64Image);
}, (err) => {
 alert(err);
});
  }
    
  public photos="";
   // 调用相册时传入的参数
  private imagePickerOpt = {
    maximumImagesCount: 1,//选择一张图片
    width: 80,
    height: 80,
    quality: 80
  };
  choosePhoto(){
    this.imagePicker.getPictures(this.imagePickerOpt).then((results) => {
  for (var i = 0; i < results.length; i++) {
      console.log('Image URI: ' + results[i]);
      this.photos='Image URI: ' + results[i];
      alert('Image URI:'+results[i]);
  }
}, (err) => {alert(err); });
  }

  
  choosePhoto2() {
    var options = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType:0,//0对应的值为PHOTOLIBRARY ，即打开相册
      encodingType: this.camera.EncodingType.JPEG,
      mediaType:this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true  //Corrects Android orientation quirks
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image =  imageData;
      this.path = base64Image;
      this.profilePicture=base64Image;
      alert(base64Image);
    }, (err) => {
      // Handle error
      alert(err);
    });

  }

   private cameraOpt = {
    quality: 50,
    destinationType: 0, // Camera.DestinationType.FILE_URI,  注意FILE_URI返回的是图片的路径，DATA_URI返回的是base64数据
    sourceType: 1, // Camera.PictureSourceType.CAMERA,
    encodingType: 0, // Camera.EncodingType.JPEG,
    mediaType: 0, // Camera.MediaType.PICTURE,
    allowEdit: true,
    correctOrientation: true
  };
  // 启动拍照功能
  private startCamera() {
    this.camera.getPicture(this.cameraOpt).then((imageData) => {

       let base64Image =  imageData;
      alert(imageData);
      //this.uploadImg(imageData);
      this.profilePicture=base64Image;//给image设置source。

    }, (err) => {
      alert('ERROR:' + err); //错误：无法使用拍照功能！
    });
  }



  upload: any = {
    url: "http://10.88.133.45:8080/ionicApp/inv/uploadSignature",           //接收图片的url
    fileKey: 'image',  //接收图片时的key
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' //不加入 发生错误！！
    },
    params: {},        //需要额外上传的参数
    success: (data) => {}, //图片上传成功后的回调
    error: (err) => {},   //图片上传失败后的回调
    listen: () => {}   //监听上传过程
  };



   // 上传图片
  private uploadImg(path: string) {
    if(!path) {
      return;
    }
    alert("进入方法");

    var fileTransfer:FileTransferObject = this.transfer.create();

    let options: any;
    options = {
      fileKey: this.upload.fileKey,
      headers: this.upload.headers,
      params: this.upload.params
    };
    fileTransfer.upload(path, this.upload.url, options)
      .then((data) => {
        if(this.upload.success) {
          this.upload.success(JSON.parse(data.response));
          alert("上传成功");
        }else{
          alert("上传失败");
        }

      }, (err) => {
        if(this.upload.error) {
          this.upload.error(err);
        } else {
          alert('错误：上传失败！');
        }
      });
  }


  



}
