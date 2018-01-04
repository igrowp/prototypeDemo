import { ConvertService } from './../../providers/service/convert.service';
import { FixedAsset } from './../../providers/entity/entity.provider';
import { Component, ViewChild } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Content } from 'ionic-angular';


/**
 * Generated class for the TransformPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info * on Ionic pages and navigation. */

@IonicPage()
@Component({
  selector: 'page-convert',
  templateUrl: 'convert.html',
})
export class ConvertPage {
  public dataTable: Array<FixedAsset> = new Array<FixedAsset>();
  private pageIndex: number;
  private pageSize = 10;
  private workerNumber;
  private custodian; //保管人
  public workerType: number = 1; //员工类型，0代表普通员工，1代表领用人
  private transNoticeId;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public convertService: ConvertService,
    private barcodeScanner: BarcodeScanner) {
    this.workerNumber = navParams.get("workerNumber");
    this.custodian = navParams.get("custodian");
    this.transNoticeId = navParams.get("transNoticeId");
  }

  ionViewDidLoad() {
    // this.convertService.(this.transNoticeId).then((fixedAssets) => {
    //   this.dataTable = fixedAssets;
    //   if (this.dataTable.length == 0) {
    //     //没有得到数据，说明不是领用人，一条一条插入
    //     this.workerType = 0;
    //   } else {
    //     //领用人
    //     this.workerType = 1;
    //   }
    // })

    console.log('ionViewDidLoad TransPage');
    // 测试添加数据
    // this.dataTable=new Array<FixedAsset>();
    // for(var i=0;i<20;i++){
    //   var fixedAsset:FixedAsset=new FixedAsset();
    //   fixedAsset.assetName="电脑"+i;
    //   fixedAsset.assetType="ThinkPad";
    //   fixedAsset.isTrans="0";
    //   fixedAsset.assetCode="10100002019"+i;
    //   fixedAsset.selfNumber="渝K0086967";
    //   fixedAsset.specModel="格力KFR-35w/(35596)1.5p";
    //   if(i%2==0){
    //     fixedAsset.isChecked="0";
    //   }else{
    //     fixedAsset.isChecked="1";
    //   }

    //   this.dataTable.push(fixedAsset);
    // }

  }
  showAlert(msg) {
    alert(msg);
  }

  /**
     * @param item 进入转产页面
     */
  // trans(item) {
  //   //领用人在列表中获取信息
  //   let assetCode = item.assetCode;
  //   let twoDimensionCode = "";
  //   this.barcodeScanner.scan().then((result) => {
  //     twoDimensionCode = result.text;
  //     if (twoDimensionCode == "" || twoDimensionCode == null) {
  //       return;
  //     }
  //     this.convertService.getAssetFromServerFixedByIdAndCode(assetCode, twoDimensionCode).then((data) => {
  //       if (data == null) {
  //         alert("二维码和资产编码不一致，请确认后重试");
  //         return;
  //       }
  //       this.navCtrl.push("AssetMessageTranPage", {
  //         fixedAsset: data,
  //         workerNumber: this.workerNumber,
  //         custodian: this.custodian
  //       })
  //     })
  //   })
  // }

  //进入手写签名页面
  signature() {
    this.navCtrl.push("SignaturePage", {
      transNoticeId: this.transNoticeId,
      workerType: this.workerType,
      workerNumber: this.workerNumber,
      data: this.dataTable,
      signatureType: "trans"
    });
  }


  // //扫描二维码
  // scanTwoDimensionCode() {
  //   let twoDimensionCode = "";
  //   this.barcodeScanner.scan().then((result) => {
  //     twoDimensionCode = result.text;
  //     if (twoDimensionCode == "" || twoDimensionCode == null) {
  //       return;
  //     }
  //     this.convertService.getAssetFromServerFixedByCode(twoDimensionCode).then((data) => {
  //       if (data == null) {
  //         alert("不存在该二维码，请确认后重试");
  //         return;
  //       }
  //       if (this.workerType == 0) {
  //         //普通员工
  //         this.dataTable.push(data);
  //       } else {
  //         //保管员，不做处理，直接跳转。
  //       }
  //       this.navCtrl.push("AssetMessageTranPage", {
  //         fixedAsset: data,
  //         workerNumber: this.workerNumber,
  //         custodian: this.custodian
  //       })
  //     })
  //   })

  // }
  scanRFID() {
    //功能测试中......
  }
}
