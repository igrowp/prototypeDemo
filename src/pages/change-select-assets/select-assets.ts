import { Checkbox } from 'ionic-angular/components/checkbox/checkbox';
import { AssetService } from './../../providers/service/asset.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, InfiniteScroll } from 'ionic-angular';
import { Content } from 'ionic-angular/components/content/content';
import { FixedAsset } from '../../providers/entity/entity.provider';
import { NoticeService } from '../../providers/service/notice.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

/**
 * 资产调拨，责任人变更，资产属性变更资产选择页面
 */

@IonicPage()
@Component({
  selector: 'page-select-assets',
  templateUrl: 'select-assets.html',
})
export class SelectAssetsPage {
  @ViewChild(Content) content: Content;
  public isMultiple=false

  public dataTable: Array<FixedAsset> = new Array<FixedAsset>();
  private pageIndex: number;
  private pageSize = 20;
  private workerNumber = "";
  private selectedItems:Array<FixedAsset>=[]; //记录点击盘点的资产索引号

  private handleType='';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private noticeService: NoticeService,
    private barcodeScanner: BarcodeScanner,
    private loadingCtrl: LoadingController,
    private assetService: AssetService,
    private modalCtrl: ModalController) {
    this.pageIndex = 1;
    this.workerNumber = this.navParams.get("workerNumber");
    this.handleType=this.navParams.get("handleType")

    this.dataTable = new Array<FixedAsset>();
    this.assetService.queryAssetsFormFixedByPage(this.pageSize, this.pageIndex, this.workerNumber).then((data) => {
      for (var i = 0; i < data.length; i++) {
        this.dataTable.push(data[i]);
      }
      this.pageIndex++;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectAssetsPage');
  }



  //当切换右上角单选和多选按钮
  handleChangeIsMultiple(){
    this.isMultiple=!this.isMultiple;
    this.selectedItems=[];

  }

  //提交按钮
  handleSubmit(){
    if(this.selectedItems.length>0){
      this.navTo()
    }else{
      this.noticeService.showIonicAlert("请选择资产")
    }

  }

  handleItemClick(item){
    if(!this.isMultiple){
      //单选情况，直接跳转页面
      this.selectedItems=[]
      this.selectedItems.push(item)
      this.navTo()
    }
  }

  /**
   * 跳转到相应页面
   */
  navTo(){
    switch(this.handleType){
      case '资产调拨':
        this.navCtrl.push('AlloPage',{
          assets:this.selectedItems,
          userName:this.navParams.get("userName"),
          wFOAddress:this.navParams.get("wFOAddress")
        })
        break;
      case '资产责任人':
        this.navCtrl.push('ChangeManagerPage',{
          assets:this.selectedItems,
          userName:this.navParams.get("userName"),
        })
        break;
      case '资产属性状态':
        this.navCtrl.push('ChangeAssetStatePage',{
          assets:this.selectedItems,
          userName:this.navParams.get("userName"),
          workerNumber:this.workerNumber
        })

        break;
      default:
        break;
    }
  }


  /**
   * CheckBox发生改变时执行的函数
   * @param asset 
   * @param check 
   */
  handleCheckBox(asset,check:Checkbox){
    if(check.checked==true){
      this.selectedItems.push(asset)
    }else{
      this.selectedItems.splice(this.selectedItems.indexOf(asset),1)
    }
  }


  //  上拉加载向服务获取数据
  doInfinite(infiniteScroll: InfiniteScroll) {
    setTimeout(() => {
      this.assetService.queryAssetsFormFixedByPage(this.pageSize, this.pageIndex, this.workerNumber).then((newData) => {
        for (var i = 0; i < newData.length; i++) {
          this.dataTable.push(newData[i]);
        }
        this.pageIndex++;
        infiniteScroll.complete();

        if (newData == null || newData.length < this.pageSize) {
          infiniteScroll.enable(false);
        }
      })
    }, 500);
  }



  ////////////////搜索////////////////
  isHiddenSearch = true;
  /**
   * 显示搜索窗体
   */
  doSearch() {
    this.content.scrollToTop(0);
    if (this.content.scrollTop < 50) {
      //开闭
      this.isHiddenSearch = !this.isHiddenSearch;
    } else if (this.isHiddenSearch == true) {
      this.isHiddenSearch = false;
    }
  }

  private recordData: Array<FixedAsset> = null;

  /**
  * 搜索功能
  * @param ev 
  */
  getItems(ev: any) {
    let val = ev.target.value;
    if (this.recordData == null) {
      let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: '正在加载中，请稍候'
      });
      loading.present();
      // 重新刷新
      this.assetService.queryAssetsFromFixed(this.workerNumber).then((data) => {
        //进行筛选
        this.recordData = data;
        // if(val&&val.trim!=""){
        console.log("val=" + val);
        this.dataTable = null;
        this.dataTable = data.filter((item) => {
          console.log(item.assetName.indexOf(val));
          return (item.assetName.indexOf(val) > -1);
        })
        loading.dismiss();
        // }
      }, err => {
        loading.dismiss();
      })
    } else {
      console.log("val=" + val);
      this.dataTable = null;
      this.dataTable = this.recordData.filter((item) => {
        console.log(item.assetName.indexOf(val));
        return (item.assetName.indexOf(val) > -1);
      })
    }
  }

  ////////////////搜索END////////////////

}
