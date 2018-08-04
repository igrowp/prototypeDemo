import { ChangeWebProvider } from './../../providers/web/change.web.provider';
import { AssetHandleWebProvider } from './../../providers/web/asset.handle.web.provider';
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
  // public isMultiple = false

  public errorMessage="没有资产数据"

  public dataTable: Array<FixedAsset> = new Array<FixedAsset>();
  private workerNumber = "";
  private selectedItems: Array<FixedAsset> = []; //记录点击盘点的资产索引号

  private handleType = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private noticeService: NoticeService,
    private barcodeScanner: BarcodeScanner,
    private assetHandleWebProvider: AssetHandleWebProvider,
    private loadingCtrl: LoadingController,
    private changeWebProvider:ChangeWebProvider,
    private assetService: AssetService,
    private modalCtrl: ModalController) {
    this.dataTable = new Array<FixedAsset>();
    this.workerNumber = this.navParams.get("workerNumber");
    this.handleType = this.navParams.get("handleType")
    let loading=this.noticeService.showIonicLoading("正在获取数据",10000);
    loading.present();
    this.assetService.queryAssetsFromFixed(this.workerNumber).then((data) => {
      if (data.length == 0) {
        //没有资产项
        this.errorMessage = "没有资产数据"
      } else {
        this.errorMessage = "网络连接异常"
        if (this.handleType == '资产调拨') {
          this.assetHandleWebProvider.getAlloingListFromServe(this.workerNumber).then((alloing) => {
            loading.dismiss();
            for (let i = 0; i < data.length; i++) {
              let isHave = false;
              if (alloing.length > 0) {
                for (let j = 0; j < alloing.length; j++) {
                  if (data[i].assetId == alloing[j].assetId) {
                    isHave = true;
                    break
                  }
                }
              }
              if (isHave == true) {
                data[i].remark = 'applying';   //临时自定义  applying代表正在进行资产调拨的资产
              }
              this.dataTable.push(data[i])
            }
          }).catch(error => {
            loading.dismiss();
            this.errorMessage = "网络连接异常"
          })
        } else if (this.handleType == '资产责任人') {
          this.changeWebProvider.getCCApplyingListFromServe(this.workerNumber).then((applying) => {
            loading.dismiss();
            for (let i = 0; i < data.length; i++) {
              let isHave = false;
              if (applying.length > 0) {
                for (let j = 0; j < applying.length; j++) {
                  if (data[i].assetId == applying[j].assetId) {
                    isHave = true;
                    break
                  }
                }
              }
              if (isHave == true) {
                data[i].remark = 'applying';   //临时自定义  applying代表正在进行资产调拨的资产
              }
              this.dataTable.push(data[i])
            }
          }).catch(error => {
            this.errorMessage = "网络连接异常"
            loading.dismiss();
          })

        } else if (this.handleType == '资产属性状态') {
          this.changeWebProvider.getCSApplyingListFromServe(this.workerNumber).then((applying) => {
            loading.dismiss();
            for (let i = 0; i < data.length; i++) {
              let isHave = false;
              if (applying.length > 0) {
                for (let j = 0; j < applying.length; j++) {
                  if (data[i].assetId == applying[j].assetId) {
                    isHave = true;
                    break
                  }
                }
              }
              if (isHave == true) {
                data[i].remark = 'applying';   //临时自定义  applying代表正在进行资产调拨的资产
              }
              this.dataTable.push(data[i])
            }
          }).catch(error => {
            this.errorMessage = "网络连接异常"
            loading.dismiss();
          })

        }

      }
    })


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectAssetsPage');
  }





  // //当切换右上角单选和多选按钮
  // handleChangeIsMultiple() {
  //   this.isMultiple = !this.isMultiple;
  //   this.selectedItems = [];
  // }

  //提交按钮
  handleSubmit() {
    if (this.selectedItems.length > 0) {
      this.navTo()
    } else {
      this.noticeService.showIonicAlert("请选择资产")
    }

  }

  handleItemClick(item) {
    if(item.remark=='applying'){
      this.noticeService.showToast("该资产正在申请中")
      return
    }
    // if (!this.isMultiple) {
    //   //单选情况，直接跳转页面
    //   this.selectedItems = []
    //   this.selectedItems.push(item)
    //   this.navTo()
    // }
  }

  /**
   * 跳转到相应页面
   */
  navTo() {
    
    switch (this.handleType) {
      case '资产调拨':
        this.navCtrl.push('AlloPage', {
          assets: this.selectedItems,
          workerNumber: this.workerNumber,
          userName: this.navParams.get("userName"),
          wFOAddress: this.navParams.get("wFOAddress"),
          workForOrg: this.navParams.get("workForOrg")
        })
        break;
      case '资产责任人':
        this.navCtrl.push('ChangeCustodianPage', {
          assets: this.selectedItems,
          workerNumber: this.workerNumber,
          userName: this.navParams.get("userName"),
        })
        break;
      case '资产属性状态':
        this.navCtrl.push('ChangeAssetStatePage', {
          assets: this.selectedItems,
          userName: this.navParams.get("userName"),
          workerNumber: this.workerNumber
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
  handleCheckBox(asset, check: Checkbox) {
    if (check.checked == true) {
      this.selectedItems.push(asset)
    } else {
      this.selectedItems.splice(this.selectedItems.indexOf(asset), 1)
    }
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
