import { ConvertUtil } from './../../providers/utils/convertUtil';
import { NoticeService } from './../../providers/service/notice.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Scrap } from '../../providers/entity/pub.entity';
import { AssetHandleService } from '../../providers/service/asset.handle.service';
/**
 * 报废页面
 */

@IonicPage()
@Component({
  selector: 'page-scrap',
  templateUrl: 'scrap.html',
})
export class ScrapPage {
  public scrapType;//报废类型
  public dateNow = ConvertUtil.formatDate(new Date());

  public scrap:Scrap=new Scrap();

  constructor(public navCtrl: NavController,
    private assetHandleService:AssetHandleService,
    private noticeService:NoticeService,
     public navParams: NavParams) {
      this.scrap=this.navParams.get("scrap");
  }

  handleSubmit(){
    if(this.scrap.scrapCategory!=null&&this.scrap.unproductionTime&&this.scrap.storageLocation&&this.scrap.assetBrief&&this.scrap.scrapReason){

      if(this.scrap.storageLocation.trim()==""){
        this.noticeService.showIonicAlert("存放地点为空");
        return;
      }
      if(this.scrap.assetBrief.trim()==""){
        this.noticeService.showIonicAlert("资产简况为空");
        return;
      }
      if(this.scrap.scrapReason.trim()==""){
        this.noticeService.showIonicAlert("报废原因为空");
        return;
      }
      
      let loading=this.noticeService.showIonicLoading("正在提交",10000);
      loading.present();
      this.assetHandleService.synchroScrapToServe(this.scrap).then((result) => {
        loading.dismiss();
        this.noticeService.showIonicAlert(result);
        this.navCtrl.pop();
      }, error => {
        loading.dismiss();
        this.noticeService.showIonicAlert(error);
      })
    }else{
      this.noticeService.showIonicAlert("请补全信息");
    }

  }

}
