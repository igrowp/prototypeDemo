import { AttachmentWebProvider } from './../web/attachment.web.provider';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { ConvertUtil } from './../utils/convertUtil';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { Injectable } from "@angular/core";
import { NoticeService } from './notice.service';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';

@Injectable()
export class FileService {
    static TOAST_POS_BOTTOM: string = 'bottom';
    static TOAST_POS_MIDDLE: string = 'middle';

    constructor(private camera:Camera,
             private noticeService:NoticeService,
             private imagePicker:ImagePicker,
             private photoLibrary:PhotoLibrary,
             private attachmentWebProvider:AttachmentWebProvider,
             private actionSheetCtrl:ActionSheetController) {
    }



    /**
     * 弹出底部选项，选择图片或拍照
     * @param takePhoto 拍照的回调函数
     * @param selectPhoto 选择图片的回调函数
     * @param cancel 取消的回调函数
     */
    showActionSheetForImageSelect(takePhotoCallBack, selectPhotoCallback, cancelCallBack) {
        let actionSheet = this.actionSheetCtrl.create({
            title: "选择",
            buttons: [
                {
                    text: "拍照",
                    handler: () => {
                        this.takePhoto(takePhotoCallBack);
                    }
                },
                {
                    text: "从手机相册选择",
                    handler: () => {
                        this.selectPhotoByImagePicker(selectPhotoCallback);
                    }
                },
                {
                    text: "取消",
                    role: 'cancel',
                    handler: () => {
                        cancelCallBack;
                    }
                }
            ]
        });
        actionSheet.present();
    }

    /**
     * 调用相机拍照片
     * @param callBack 回调函数 
     */
    takePhoto(callBack) {
        this.camera.getPicture({
            quality: 50,////相片质量
            sourceType: this.camera.PictureSourceType.CAMERA,//从哪里选择图片，PHOTOLIBRARY=0(相册选择)，PHOTOLIBRARY=1(相机拍照)，PHOTOLIBRARY=2(相册选择)
            destinationType: this.camera.DestinationType.FILE_URI,//返回类型，DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
            // allowEdit: true,//在选择之前允许修改截图
            encodingType: this.camera.EncodingType.JPEG,//保存的图片格式： JPEG = 0, PNG = 1
            // targetWidth: 500,//照片的宽度
            targetHeight: 500,//照片的高度
            mediaType: this.camera.MediaType.PICTURE,//可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
            saveToPhotoAlbum: true,//保存到相册
            cameraDirection: 0,//摄像头类型Back= 0,Front-facing = 1
            // popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, this.camera.PopoverArrowDirection.ARROW_ANY)
        }).then(fileUrl => {
            if (!fileUrl.startsWith('file://')) {
                fileUrl = 'file://' + fileUrl;
            }
            ConvertUtil.fileUrlToBase64(fileUrl).then((dataUrl) => {
                callBack(fileUrl, dataUrl)
            })
            //callBack("data:image/jpeg;base64," + imageData);
        }, error => {
            // this.noticeService.showIonicAlert("调用相机失败");
        });
    }


    /**
     * 从图库选择照片
     * @param callBack 回调函数 
     */
    selectPhotoByCamera(callBack) {
        this.camera.getPicture({
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.FILE_URI,
            quality: 50,
            //targetWidth: 500,//照片的宽度
            targetHeight: 500,//照片的高度
            encodingType: this.camera.EncodingType.JPEG,
        }).then(fileUrl => {
            if (!fileUrl.startsWith('file://')) {
                fileUrl = 'file://' + fileUrl;
            }
            ConvertUtil.fileUrlToBase64(fileUrl).then((dataUrl) => {
                callBack(fileUrl, dataUrl)
            })

        //    callBack("data:image/jpeg;base64," + imageData);
        }, error => {
            //没选图片也会报错，所以这里就不选了
            //alert(JSON.stringify(error));
            // this.noticeService.showIonicAlert("选择照片失败");
        });
    }

    selectPhotoByImagePicker(callBack){
        const options = {//options表示选取的图片参数
            maximumImagesCount: 3,//一次性最多只能选5张，ios系统无效，android上面有效
            //width: 500,//图片的宽度
            height: 500,//图片的高度
            quality: 50,//图片的质量0-100之间选择
            outputType: 0 // default .FILE_URI返回影像档的，0表示FILE_URI返回影像档的也是默认的，1表示返回base64格式的图片
          }
          this.imagePicker.getPictures(options).then((fileUrls:string[]) => {
            let dataUrls=new Array<string>();
            for (var i = 0; i < fileUrls.length; i++) {
                if (!fileUrls[i].startsWith('file://')) {
                    fileUrls[i] = 'file://' + fileUrls[i];
                }
                ConvertUtil.fileUrlToBase64(fileUrls[i]).then((dataUrl) => {
                    dataUrls.push(dataUrl);
                    if(dataUrls.length==fileUrls.length){
                        callBack(fileUrls,dataUrls);
                    }
                })
            }
          }, (err) => { 
              this.noticeService.showIonicAlert("选择图片失败");
          });
    }

    // selectPhotoByImagePicker(callBack){
    //     const options = {//options表示选取的图片参数
    //         maximumImagesCount: 5,//一次性最多只能选5张，ios系统无效，android上面有效
    //         //width: 500,//图片的宽度
    //         height: 500,//图片的高度
    //         quality: 50,//图片的质量0-100之间选择
    //         outputType: 1 // default .FILE_URI返回影像档的，0表示FILE_URI返回影像档的也是默认的，1表示返回base64格式的图片
    //       }
    //       this.imagePicker.getPictures(options).then((results:string[]) => {
    //         for (var i = 0; i < results.length; i++) {
    //           results[i]="data:image/jpeg;base64," + results[i];
    //         }
    //         callBack(results);
    //       }, (err) => { 
    //           this.noticeService.showIonicAlert("选择图片失败");
    //       });
    // }
}