import { AttachmentService } from './../../providers/service/attachment.service';
import { PubConstant } from './../../providers/entity/constant.provider';
import { AssetService } from './../../providers/service/asset.service';
import { FixedAsset } from './../../providers/entity/entity.provider';
import { Idle, Scrap } from './../../providers/entity/pub.entity';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * 流程审批中的资产详情页
 */

@IonicPage()
@Component({
  selector: 'page-process-asset-message',
  templateUrl: 'process-asset-message.html',
})
export class ProcessAssetMessagePage {
  public title="";
  public eventType="";

  //资产调拨
  public fixedAsset:FixedAsset=new FixedAsset();
  public techStatusDesc="";

  //闲置资产信息
  public idle:Idle=new Idle();
  public photoBase64s=new Array<string>();

  //资产报废申请
  public scrap:Scrap=new Scrap();

  constructor(public navCtrl: NavController,
         public navParams: NavParams,
         private attachmentService:AttachmentService,
        private assetService:AssetService) {
    this.eventType = this.navParams.get("eventType");
    switch(this.eventType){
      case "资产详情页":
        this.title="资产信息";
        this.fixedAsset=this.navParams.get("fixedAsset");
        this.assetService.queryFromDictDetailByCategoryAndDictCode(PubConstant.DICT_TYPE_TECH_STATE,this.fixedAsset.techStatus).then((dictDetail)=>{
          if(dictDetail){
            this.techStatusDesc=dictDetail.dictCodeDesc;
          }
        })
        this.addPhotos(this.fixedAsset.assetId,PubConstant.ATTACHMENT_TYPE_IMG_ASSET);
        break;
      case "资产闲置认定":
        this.title="闲置信息";
        this.idle=this.navParams.get("idle");
        if(this.idle.testResult==undefined||this.idle.testResult==""){
          this.idle.testResult="无";
        }
        if(this.idle.stopReason==undefined||this.idle.stopReason==""){
          this.idle.stopReason="无";
        }
        if(this.idle.assetDesc==undefined||this.idle.assetDesc==""){
          this.idle.assetDesc="无";
        }
        this.addPhotos(this.idle.assetId,PubConstant.ATTACHMENT_TYPE_IMG_IDLE);
        break;
      case "资产报废申请":
        this.title = "固定资产报废信息";
        this.scrap = this.navParams.get("scrap");
        if (this.scrap.scrapReason == undefined || this.scrap.scrapReason == "") {
          this.scrap.scrapReason = "无";
        }
        break;
      default:
        break;
    }
  }

  /**
   * 从服务器获取图片
   */
  addPhotos(assetId,attachementType){
    //从服务器获取资产图片
    this.attachmentService.getPhotosFromServe(assetId,attachementType).then((attachmentBase64s)=>{
      if(attachmentBase64s){
        for(let i=0;i<attachmentBase64s.length;i++){
          this.photoBase64s.push(attachmentBase64s[i].base64);
        }
      }
    })
  }

}
