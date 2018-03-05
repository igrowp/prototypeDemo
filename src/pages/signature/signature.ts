import { AssetHandleService } from './../../providers/service/asset.handle.service';
import { PubConstant } from './../../providers/entity/constant.provider';
import { CvtNonNotice, CvtNonReceive } from './../../providers/entity/cvt.entity.provider';
import { NoticeService } from './../../providers/service/notice.service';
import { PhotoLibrary } from "@ionic-native/photo-library";
import { InvAsset, ChangeRecord } from './../../providers/entity/entity.provider';
import { AssetService } from './../../providers/service/asset.service';
import { CvtService } from './../../providers/service/cvt.service';
import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { LoginService } from '../../providers/service/login.service';
/// <reference path="plugin/SignaturePad.d.ts"/>
//import * as SignaturePad from 'signature_pad';
/**
 * 手写签名页面
 */
@IonicPage()
@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html',
})

export class SignaturePage {
  //转产
  private cvtNotice: CvtNonNotice;
  private workerType;  //用户类型，0代表责任人，1代表领用人(继续发放)，2代表领用人(不再发放)

  //end转产

  //发放
  private cvtNonReceives: Array<CvtNonReceive>;
  private totalQuantity;  //记录所有资产总数量
  private sentQuantity;   //记录之前已经确定的资产
  private cvtNonNotice;   //非安设备转产通知单
  //end发放

  private workerNumber;
  private signature;   //用于记录signaturePad
  private invAssets: Array<InvAsset>;
  private signatureType;   //签名类型，是转产(trans)还是盘点(inv)
  private signaturePath = "";  //用于存储签名返回路径，包括文件名。保存到手机中，
  private signatureName = "";  //签名的文件名
  private signatureFolderName = "signature";   //本地签名图片保存的文件名
  
  public isShowDefaultSignature=false;  //判断是否使用默认签名
  public buttonColor='primary';
  constructor(public navParams: NavParams,
    public navCtrl: NavController,
    public cvtService: CvtService,
    public alertCtrl: AlertController,
    private photoLibrary: PhotoLibrary,
    private loadingCtrl: LoadingController,
    private noticeService: NoticeService,
    private assetHandleService:AssetHandleService,
    private loginService: LoginService,
    public assetService: AssetService) {
    this.signatureType = navParams.get("signatureType");
    if (this.signatureType == "convert") {
      this.cvtNotice = navParams.get("cvtNotice");
      this.workerType = navParams.get("workerType");
      this.workerNumber = navParams.get("workerNumber");

    } else if (this.signatureType == "inv") {
      this.invAssets = navParams.get("invAssets");
      this.workerNumber = navParams.get("workerNumber");
    } else if (this.signatureType == "granting") {
      //发放
      this.cvtNonReceives = navParams.get("cvtNonReceives");
      this.totalQuantity = navParams.get("totalQuantity");
      this.cvtNonNotice = navParams.get("cvtNonNotice");
      this.sentQuantity = navParams.get("sentQuantity");
    }
  }

  ionViewDidEnter() {
    var canvas = document.getElementById("canvas");
    var signaturePad = new SignaturePad(canvas, {
      backgroundColor: 'rgb(255,255,255)',
      velocityFilterWeight: 0.7
    });
    this.signature = signaturePad;

    var clearButton = document.getElementById("clear");
    var undoButton = document.getElementById("undo");
    //  var savePNGButton =document.getElementById("save-png");


    //清除
    clearButton.addEventListener("click", function (event) {
      signaturePad.clear();
    });
    //撤销
    undoButton.addEventListener("click", function (event) {
      var data = signaturePad.toData();
      if (data) {
        data.pop();
        signaturePad.fromData(data);
      }
    });
    // //保存
    // savePNGButton.addEventListener("click",function(event){
    //   if(signaturePad.isEmpty()){
    //     alert("请先签名");
    //   }else{
    //     var dataURL=signaturePad.toDataURL();
    //     console.log(dataURL);
    //     // var download(dataURL,"ceshi.png");
    //   }
    // }); 
    this.resizeCanvas(signaturePad);
  }

  
  /**
   * 保存并提交
   */
  save() {
    if (this.signature.isEmpty()&&(this.signaturePath==null||this.signaturePath=="")) {
      this.noticeService.showIonicAlert("请先签名");
    } else {
      var dataURL = this.signature.toDataURL();
      //保存到本地
      this.saveTolocal(dataURL, this.signatureFolderName).then(() => {
        //判断签名类型
        if (this.signatureType == "inv") {
          let lastAssetId = this.invAssets[this.invAssets.length - 1].assetId;
          for (var i = 0; i < this.invAssets.length; i++) {
            let invAsset = this.invAssets[i];
            if (invAsset.isSignatured == 1) {
              this.assetService.queryAssetFromFixedById(invAsset.assetId).then((fixedAsset) => {
                fixedAsset.isSynchro = 1;
                fixedAsset.isChecked = 2;
                this.assetService.updateToFixed(fixedAsset).then((data) => {
                  invAsset.isSignatured = 2;
                  invAsset.signaturePath = this.signaturePath;
                  invAsset.signature = this.signatureName;
                  this.assetService.updateToInv(invAsset).then(() => {
                    if (invAsset.assetId == lastAssetId) {
                      //同步数据
                      this.assetService.synchroInvData(this.workerNumber);
                      //同步报废和闲置资产信息
                      this.assetHandleService.synchroIdleListToServe(this.workerNumber);
                      this.assetHandleService.synchroScrapListToServe(this.workerNumber);
                    }
                  })
                })
              }, error => {
                this.noticeService.showIonicAlert(error);
              })
            }
          }
          this.noticeService.showIonicAlert("提交成功");
          this.navCtrl.pop();


        } else if (this.signatureType == "convert") {
          //转产时的签名
          if (this.workerType == 1) {
            //领用人领用签名
            let loading = this.loadingCtrl.create({
              spinner: 'bubbles',
              content: '正在提交...',
              duration: 30000
            });
            loading.present();
            this.cvtService.saveCvtAssetsFromServe(this.cvtNotice.recipient, this.cvtNotice.noticeId).then(() => {
              this.cvtService.uploadSignature(this.workerNumber, this.signaturePath, this.signatureName, null, null, this.cvtNotice.noticeId, PubConstant.SIGNATURE_TYPE_CVT_RECEIVER).then((data) => {
                this.cvtService.insertCvtNonNoticeSubFromServe(this.cvtNotice.noticeId).then(() => {
                  //修改状态
                  this.cvtNotice.noticeState = "GRANTING";
                  this.cvtService.updateStateToCvtNotice(this.cvtNotice).then(() => {
                    this.noticeService.showIonicAlert("提交成功");
                    loading.dismiss();
                    this.navCtrl.popToRoot();
                  }, (error) => {
                    loading.dismiss();
                    this.noticeService.showIonicAlert(error);
                  })
                }, (error) => {
                  loading.dismiss();
                  this.noticeService.showIonicAlert(error);
                })
              }, (error) => {
                loading.dismiss();
                this.noticeService.showIonicAlert(error);
              })
            }, (error) => {
              loading.dismiss();
              this.noticeService.showIonicAlert("上传签名失败，请检查网络是否通畅");
            })


          } else if (this.workerType == 2) {
            //领用人，不在发放
            this.cvtService.receiverNoGranting(this.cvtNotice, this.cvtNotice.recipient, this.signaturePath, this.signatureName).then((data) => {
              this.noticeService.showIonicAlert("提交成功");
              this.navCtrl.popToRoot();
            }, (error) => {
              this.noticeService.showIonicAlert(error);
            })
          }



        } else if (this.signatureType == "granting") {
          //用于发放时候的手写签名,签名后将本地领用表和验收表数据更新，同时保存签名信息
          for (var m = 0; m < this.cvtNonReceives.length; m++) {
            this.cvtNonReceives[m].recordFlag = 1;
            this.cvtNonReceives[m].signaturePath = this.signaturePath;
            this.cvtNonReceives[m].signatureName = this.signatureName;
          }
          this.cvtService.updateToCvtNonReceive(this.cvtNonReceives).then(() => {
            //判断是否全部发放完成
            if (this.sentQuantity + this.cvtNonReceives.length >= this.totalQuantity && this.cvtNonNotice) {
              //说明发放完成，修改本地通知的状态
              this.cvtNonNotice.noticeState = "SYNCHRONIZE";//待同步状态
              this.cvtService.updateStateToCvtNotice(this.cvtNonNotice).then(() => {
                this.noticeService.showIonicAlert("提交成功,资产发放完成");
                this.navCtrl.popToRoot();
              }, (error) => {
                this.noticeService.showIonicAlert(error);
              })
            } else {
              //没有发放完成，继续发放
              this.noticeService.showIonicAlert("提交成功");
              this.navCtrl.popToRoot();
            }
            //同步资产
            let cvtNoticeList = new Array<CvtNonNotice>();
            cvtNoticeList.push(this.cvtNonNotice);
            this.cvtService.synchroCvtData(cvtNoticeList).then(()=>{

            },error=>{
              //同步失败
               
            })
          }, (error) => {
            this.noticeService.showIonicAlert(error);
          })
        }
      }, (error) => {
        this.noticeService.showIonicAlert("签名失败，请重新尝试!<br>" + error);
      })
    }
  }

  /**
   * 保存到本地
   * @param dataURL 
   * @param albumName 文件夹的名字
   */
  saveTolocal(dataURL, albumName) {
    return new Promise((resolve, reject) => {
      this.photoLibrary.saveImage(dataURL, albumName).then((res) => {
        if (res != null) {
          this.signaturePath = res.id;
          this.signatureName = res.fileName;
          resolve();
        } else {
          reject();
        }
      }).catch(e => {
        reject(e);
      })
    })
  }

  //下载
  download(dataURL, filename) {
    var blob = this.dataURLToBlob(dataURL);
    var url = window.URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    console.log(url);
    window.URL.revokeObjectURL(url);
  }

  /**
  * 将base64图片转成blob
  * @param dataURL 
  */
  private dataURLToBlob(dataURL) {
    var parts = dataURL.split(";base64,");
    var contentType = parts[0].split(":")[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; i++) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {
      type: contentType
    });
  }


  //调整画布大小
  resizeCanvas(signaturePad) {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    var wrapper = document.getElementById("signature-pad");
    var canvas = wrapper.querySelector("canvas");
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    signaturePad.clear();
  }

  /**
   * 返回按钮
   */
  handleBack() {
    this.navCtrl.pop();
  }



  handleSetting() {
    this.alertCtrl.create({
      title: '提示',
      subTitle: '是否设为默认签名？',
      cssClass: 'alert-conform',
      buttons: [
        {
          text: '取消',
          role: 'concel'
        },
        {
          text: '确定',
          handler: data => {
            var dataURL = this.signature.toDataURL();
            if (this.signature.isEmpty()) {
              this.noticeService.showIonicAlert("请先签名");
            }else{
              this.saveTolocal(dataURL, this.signatureFolderName).then(() => {
                this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_DEFAULT_SIGNATURE_PATH, this.signaturePath);
                this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_DEFAULT_SIGNATURE_NAME, this.signatureName);
                this.noticeService.showNativeToast("设置成功");
              })
            }
          }
        }
      ]
    }).present();
  }

  //取消默认签名
  handleRemoveDefaultSignature(){
    this.isShowDefaultSignature=false;
    this.buttonColor="primary";
    //刷新画布
    this.ionViewDidEnter();

  }

  //使用默认签名
  handleGetDefaultSignature() {
    this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_DEFAULT_SIGNATURE_PATH).then((defalutSignaturePath) => {
      if (defalutSignaturePath == null || defalutSignaturePath == "") {
        this.noticeService.showIonicAlert("未设定默认签名");
      } else {
        this.isShowDefaultSignature=true;
        this.buttonColor="danger";
        this.photoLibrary.getPhoto(defalutSignaturePath).then((blob) => {
          this.BlobToCanvas(blob, (canvas) => {
            //获取默认签名文件名称
            this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_DEFAULT_SIGNATURE_NAME).then((defalutSignatureName)=>{
              this.signatureName=defalutSignatureName;
              this.signaturePath=defalutSignaturePath;
            })
          })
        })
      }
    })
  }
  // Blob转canvas
  BlobToCanvas(blob, cb) {
    this.fileOrBlobToDataURL(blob, function (dataurl) {
      let canvas = <HTMLCanvasElement>document.getElementById("canvas-default");
      var ctx = canvas.getContext('2d');
      var img = new Image();
      img.onload = function () {
        canvas.width=img.width;
        canvas.height=img.height;
        ctx.drawImage(img, 0, 0);

        cb(canvas);
      };
      img.src = dataurl;
    });
  }

  // File/Blob对象转DataURL
  fileOrBlobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function (e:any) {
      callback(e.target.result);
    };
    a.readAsDataURL(blob);
  }



}
