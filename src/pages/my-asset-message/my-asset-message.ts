import { FileService } from './../../providers/service/file.service';
import { ConvertUtil } from './../../providers/utils/convertUtil';
import { Scrap } from './../../providers/entity/pub.entity';
import { PubConstant } from './../../providers/entity/constant.provider';
import { DataBaseUtil } from './../../providers/utils/dataBaseUtil';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Camera } from '@ionic-native/camera';
import { AssetService } from './../../providers/service/asset.service';
import { FixedAsset } from './../../providers/entity/entity.provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NoticeService } from '../../providers/service/notice.service';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { Idle } from '../../providers/entity/pub.entity';
import { AssetHandleService } from '../../providers/service/asset.handle.service';
import { AttachmentService } from '../../providers/service/attachment.service';

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
  public photoPaths: Array<string> = new Array<string>();
  public photoBase64s: Array<string> = new Array<string>();
  isHiddenSearch = true;
  public handleType = "完善资产信息";
  public fixedAsset: FixedAsset = new FixedAsset();
  public dateNow = ConvertUtil.formatDate(new Date());

  constructor(public navCtrl: NavController,
    private noticeService: NoticeService,
    private fileService: FileService,
    private assetHandleService: AssetHandleService,
    private alertCtrl: AlertController,
    private assetService: AssetService,
    private attachmentService:AttachmentService,
    private navParams: NavParams) {
    //初始化数据
    this.fixedAsset = this.navParams.get("fixedAsset");
  }


  handleSubmit() {
    if (this.handleType == "完善资产信息") {
      //获取图片
      this.attachmentService.getAttachments(this.fixedAsset.assetId,PubConstant.ATTACHMENT_TYPE_ASSET).then((attachments)=>{
        this.photoPaths=new Array<string>();
        this.photoBase64s=new Array<string>();
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
      this.handleType = "提交";
    } else {
      this.fixedAsset.isSynchro = 1;
      this.assetService.updateToFixed(this.fixedAsset).then(() => {
        let fixedAssets = new Array<FixedAsset>();
        fixedAssets.push(this.fixedAsset);
        this.assetService.syncFixedToServer(fixedAssets).then(() => {
          this.fixedAsset.isSynchro = 2;
          this.assetService.updateToFixed(this.fixedAsset);
        })
        this.attachmentService.uploadOrSavePhotos(this.fixedAsset.assetId,PubConstant.ATTACHMENT_TYPE_ASSET,null,this.photoPaths,PubConstant.UPLOAD_TYPE_BASE64);
        this.noticeService.showIonicAlert("提交成功");
        this.navCtrl.pop();
      })
    }
  }


  handleIdle() {
    if (this.fixedAsset.useState == PubConstant.DICT_SUB_TYPE_IDLE) {
      //如果当前资产为闲置状态
      this.noticeService.showIonicAlert("该资产已经是闲置状态");
    } else {
      let loading = this.noticeService.showIonicLoading("正在获取资产状态", 100000);
      loading.present();
      this.assetHandleService.getIdleFromServe(this.fixedAsset.assetId).then((data) => {
        loading.dismiss();
        if (data) {
          if (data.applyState == PubConstant.APPLY_STATE_NULL || data.applyState == PubConstant.APPLY_STATE_UNSUBMIT || data.applyState == PubConstant.APPLY_STATE_REJECT) {
            //未提交或驳回，可以重新进行填写
            this.assetHandleService.getIdleByAssetId(this.fixedAsset.assetId).then((idle) => {
              this.navCtrl.push("IdlePage", {
                idle: idle,
                assetId: this.fixedAsset.assetId
              });
            })
          } else if (data.applyState == PubConstant.APPLY_STATE_SUBMIT) {
            this.noticeService.showIonicAlert("正在审批中");
          } else {
            this.noticeService.showIonicAlert("该资产已经是闲置状态");
          }
        } else {
          //不是闲置状态，并且没有提交过申请
          let idle: Idle = new Idle();
          idle.idleId = DataBaseUtil.generateUUID();
          idle.assetId = this.fixedAsset.assetId;
          idle.applyState = PubConstant.APPLY_STATE_NULL;
          idle.recordFlag = 0;
          this.navCtrl.push("IdlePage", {
            idle: idle,
            assetId: this.fixedAsset.assetId
          });
        }
      }, error => this.noticeService.showIonicAlert(error))
    }
  }

  handleScrap() {
    if (this.fixedAsset.techStatus == PubConstant.DICT_SUB_TYPE_SCRAP) {
      //如果当前资产为闲置状态
      this.noticeService.showIonicAlert("该资产已经是闲置状态");
    } else {
      let loading = this.noticeService.showIonicLoading("正在获取资产状态", 100000);
      loading.present();
      this.assetHandleService.getScrapFromServe(this.fixedAsset.assetId).then((data) => {
        loading.dismiss();
        if (data) {
          if (data.applyState == PubConstant.APPLY_STATE_NULL || data.applyState == PubConstant.APPLY_STATE_UNSUBMIT || data.applyState == PubConstant.APPLY_STATE_REJECT) {
            //未提交或驳回，可以重新进行填写
            this.navCtrl.push("ScrapPage", {
              scrap: data
            });
          } else if (data.applyState == PubConstant.APPLY_STATE_SUBMIT) {
            this.noticeService.showIonicAlert("正在审批中");
          } else {
            this.noticeService.showIonicAlert("该资产已经是闲置状态");
          }
        } else {
          //不是闲置状态，并且没有提交过申请
          let scrap: Scrap = new Scrap();
          scrap.scrapId = DataBaseUtil.generateUUID();
          scrap.assetId = this.fixedAsset.assetId;
          scrap.applyState = PubConstant.APPLY_STATE_NULL;
          scrap.recordFlag = 0;
          this.navCtrl.push("ScrapPage", {
            scrap: scrap
          });
        }
      }, error => this.noticeService.showIonicAlert(error))
    }
  }
  handleBack() {
    this.handleType = "完善资产信息";
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

    this.fileService.showActionSheetForImageSelect((fileUrl, dataUrl) => {
      //拍照
      if (this.photoPaths.length < 3) {
        this.photoPaths.push(fileUrl);
        this.photoBase64s.push(dataUrl);
      }

    }, (fileUrls, dataUrls) => {
      //选择图片
      if (fileUrls.length > 0) {
        for (let i = 0; i < fileUrls.length; i++) {
          if (this.photoPaths.length < 3) {
            this.photoPaths.push(fileUrls[i]);
            this.photoBase64s.push(dataUrls[i]);
          }
        }
      }
    }, null);
  }

}
