import { ConvertUtil } from './../../providers/utils/convertUtil';
import { PubConstant } from './../../providers/entity/constant.provider';
import { AttachmentService } from './../../providers/service/attachment.service';
import { FileService } from './../../providers/service/file.service';
import { Idle } from './../../providers/entity/pub.entity';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NoticeService } from '../../providers/service/notice.service';
import { AssetHandleService } from '../../providers/service/asset.handle.service';

/**
 * 资产闲置页面
 */

@IonicPage()
@Component({
  selector: 'page-idle',
  templateUrl: 'idle.html',
})
export class IdlePage {
  public photoBase64s: Array<string> = new Array<string>();  //选择图片列表——存储base64格式
  public photoPaths: Array<string> = new Array<string>();    //选择图片列表——存储图片路径
  public idle:Idle=new Idle();    //闲置信息
  private assetId="";             //资产ID
  constructor(public navCtrl: NavController,
    private assetHandleService:AssetHandleService,
    private fileService:FileService,
    private noticeService:NoticeService,
    private attachmentService:AttachmentService,
    private alertCtrl:AlertController,
     public navParams: NavParams) {
       this.idle=this.navParams.get("idle");
       this.assetId=this.navParams.get("assetId");
       //获取之前选择的图片信息
       this.attachmentService.getAttachments(this.assetId,PubConstant.ATTACHMENT_TYPE_IMG_IDLE).then((attachments)=>{
         if(attachments.length>0){
           for(let i=0;i<attachments.length;i++){
             let attachment=attachments[i];
             this.photoPaths.push(attachment.storagePath);
             ConvertUtil.fileUrlToBase64(attachment.storagePath).then((base64)=>{
               this.photoBase64s.push(base64);
             })
           }
         }
       })
  }

  //提交
  handleSubmit(){
    if(this.idle.installLocation&&this.idle.testResult&&this.idle.stopReason&&this.idle.assetDesc){
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
      this.attachmentService.uploadOrSavePhotos(this.idle.assetId,PubConstant.ATTACHMENT_TYPE_IMG_IDLE,null,this.photoPaths,PubConstant.UPLOAD_TYPE_BASE64);
      this.assetHandleService.synchroIdleToServe(this.idle).then((result) => {
        loading.dismiss();
        this.noticeService.showIonicAlert("提交成功");
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
  isDeleteImg(index) {
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
            this.photoBase64s.splice(index,1);
            this.photoPaths.splice(index,1);
            
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
    if (this.photoBase64s.length >= 3) {
      //只能上传三张照片
      this.noticeService.showIonicAlert("只能上传三张照片");
      return;
    } else {
      this.useASComponent();
    }
  }

  /**
   * 底部选择项
   */
  private useASComponent() {
    
    this.fileService.showActionSheetForImageSelect((fileUrl,dataUrl)=>{
      //拍照
      if (this.photoPaths.length < 3) {
        this.photoPaths.push(fileUrl);
        this.photoBase64s.push(dataUrl);
      }

    }, (fileUrls,dataUrls) => {
      //选择图片
      if(fileUrls.length>0){
        for(let i=0;i<fileUrls.length;i++){
          if(this.photoPaths.length<3){
            this.photoPaths.push(fileUrls[i]);
            this.photoBase64s.push(dataUrls[i]);
          }
        }
      }
    },null);
  }
}
