import { DateUtil } from './../../providers/utils/dateUtil';
import { DataBaseUtil } from './../../providers/utils/dataBaseUtil';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { PubContanst } from './../../providers/entity/constant.provider';
import { CvtNonNotice } from './../../providers/entity/cvt.entity.provider';
import { BackButtonService } from '../../providers/service/backButton.service';
import { NoticeService } from './../../providers/service/notice.service';
import { CvtService } from './../../providers/service/cvt.service';
import { InvService } from './../../providers/service/inv.service';
import { LoginService } from './../../providers/service/login.service';
import { InvNotice } from './../../providers/entity/entity.provider';
import { AssetService } from './../../providers/service/asset.service';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { CvtDBProvider } from '../../providers/storage/cvt.db.provider';
declare let ReadRFID: any;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public isGranting: boolean = false; //判断是否发放
  public wFOAddress = "";
  public userName = "";
  private workForOrg = ""
  private workInOrg = "";
  private workerNumber = "";
  public badgeValueCvt;  //徽章，用于记录转产或者清点时的消息提醒
  public badgeValueInv;
  private invNotice: InvNotice = new InvNotice();   //清点的通知
  public cvtNotice: CvtNonNotice;  //转产通知ID


  constructor(public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    public loginService: LoginService,
    public assetService: AssetService,
    public invService: InvService,
    public navParams: NavParams,
    private platform: Platform,
    private alertCtrl: AlertController,
    private barcodeScanner: BarcodeScanner,
    private cvtService: CvtService,
    public noticeService: NoticeService,
    private cvtDbProvider: CvtDBProvider,
    private backButtonService: BackButtonService) {

    this.badgeValueCvt = 0;
    this.badgeValueInv = 0;

    this.platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(null);

      //初始化数据
      setTimeout(() => {
        this.loginService.getFromStorage("account").then(() => {

          this.loginService.getFromStorage("userName").then((userName) => {
            this.userName = userName;
            this.loginService.getFromStorage("wFOAddress").then((wFOAddress) => {
              this.wFOAddress = wFOAddress;
              this.loginService.getFromStorage("workerNumber").then((number) => {
                this.workerNumber = number;
                this.loginService.getFromStorage("workInOrg").then((workInOrg) => {
                  this.workInOrg = workInOrg;
                  this.loginService.getFromStorage("workForOrg").then((wForOrg) => {
                    this.workForOrg = wForOrg;
                    this.getNoticeFromServe();

                  });
                })
              })
            })
          })
        })
      }, 1000)
    })


  }

  ionViewDidEnter() {
    if (this.workForOrg) {
      this.getNoticeFromServe();  //每次进入主界面，从服务器获取一次数据
    }
  }
  test() {
    // alert( PubContanst.SIGNATURE_TYPE_CVT_RECEIVER);
    // alert( PubContanst.SIGNATURE_TYPE_CVT_RECEIVER_NO_GRANTING);
    this.cvtDbProvider.deleteFromCvtNonNoticeByNoticeId("a7abd4ce5653403694d1de0ea108333e");
    this.cvtDbProvider.deleteFromCvtNonNoticeSubByNoticeId("a7abd4ce5653403694d1de0ea108333e");
    this.cvtDbProvider.deleteFromCvtNonReceiveByNoticeId("a7abd4ce5653403694d1de0ea108333e").then(() => {
      alert("删除成功");
    });
  }

  //转到资产转产页面
  navToCvt() {
    //有通知，直接进入
    this.cvtService.queryFromCvtNonNoticeByWorkerNumber(this.workerNumber).then((cvtNotice) => {
      this.cvtNotice = cvtNotice;
      if (cvtNotice != null && cvtNotice.noticeState == "ISSUED") {
        //处于领用状态
        this.badgeValueCvt = 1;
        this.isGranting = false;
        this.navCtrl.push('ConvertPage', {
          workerNumber: this.workerNumber,
          cvtNotice: this.cvtNotice,
          custodian:this.userName,
        });
      } else if (cvtNotice != null && cvtNotice.noticeState == "GRANTING") {
        //处于发放状态
        this.badgeValueCvt = 0;
        this.isGranting = true;
        this.navCtrl.push("GrantingPage", {
          cvtNonNotice: this.cvtNotice,
          userName: this.userName,
        });
      } else {  //notice==null  统一进入到二维码界面
        //没有资产通知，说明1.没有领用通知，2.为资产保管人
        this.badgeValueCvt = 0;
        this.isGranting = false;
        this.loginService.getFromStorage("userId").then((userId) => {
          this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, userId).then((data) => {
            //进入页面
          }, error => {
            this.noticeService.showIonicAlert(error.message);
          })
        }, error => this.noticeService.showIonicAlert(error))
      }
    }, (error) => {
      this.noticeService.showIonicAlert(error);
    })
    // }

  }
  //转到资产盘点页面
  navToInv() {
    if (this.badgeValueInv == 0) {
      if (this.workForOrg == null) {
        this.loginService.getFromStorage("workForOrg").then((value) => {
          this.workForOrg = value;
        })
      }
      //从服务器中查询是否存在通知
      let loading = this.loadingCtrl.create({
        content: '正在从服务器获取数据！',
        duration: 30000
      });
      loading.present();
      this.invService.getInvNoticeByLeadingOrgOrFromServe(this.workForOrg).then((invNotice) => {
        if (invNotice != null) {
          this.badgeValueInv = 1;
          this.invNotice = invNotice;
          loading.dismiss();

          this.navCtrl.push("InventoryPage", {
            invNotice: this.invNotice,
            workerNumber: this.workerNumber
          })
        } else {
          //说明此时还不应该盘点呢
          loading.dismiss();
          this.noticeService.showNativeToast("未在盘点时间范围内！");
        }

      }, (error) => {
        loading.dismiss();
        this.noticeService.showNativeToast("网络连接超时，请确认当前为内网环境！");
      })
    } else if (this.badgeValueInv > 0) {
      this.navCtrl.push("InventoryPage", {
        invNotice: this.invNotice,
        workerNumber: this.workerNumber
      })
    }
  }
  //转到我的资产页面
  navToMyAsset() {
    this.navCtrl.push('MyAssetPage', {
      workerNumber: this.workerNumber
    });
  }
  //流程审批
  navToProcess() {
    alert("功能开发中");
  }

  

  //同步数据
  navToSynchro() {
    let synchroTitle = "";
    let synchroTime = "";
    this.loginService.getFromStorage("synchroTime").then((data) => {
      if (data == null || data == "") {
        //没有同步过
        synchroTitle = "";
        synchroTime = "";
      } else {
        synchroTitle = "上次同步时间";
        synchroTime = data;
      }
      let synchroAlert = this.alertCtrl.create({
        title: '是否同步数据？',
        subTitle: synchroTitle,
        message: synchroTime,
        cssClass: 'alert-synchro',
        buttons: [
          {
            text: '取消',
            role: 'concel',
            handler: () => {

            }
          },
          {
            text: '确定',
            cssClass: "border:1px",
            handler: () => {
              //需要同步的盘点数据
              this._synchroInvData();
              //需要同步转产数据
              this._synchroCvtData();
              //将时间保存到数据库中
              let time = DateUtil.formatDateToHMS(new Date())
              this.loginService.updateSynchroTimeToUserInfo(this.workerNumber, time);
              this.loginService.setInStorage("synchroTime", time);
            }
          }

        ]
      })
      synchroAlert.present();
    })

  }

  




  //用户信息
  userMessage() {
    this.noticeService.showIonicAlert("当前用户：" + this.userName);

  }

  download() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '正在从服务器获取信息...',
      duration: 30000
    });
    loading.present();
    this.getNoticeFromServe().then(() => {
      this.noticeService.showNativeToast("数据下载成功！");
      loading.dismiss();
    }, (error) => {
      this.noticeService.showIonicAlert(error);
      loading.dismiss();
    });
    this.assetService.downloadAndSaveData(this.workerNumber);
  }
  /**
   * 从服务器获取通知
   */
  getNoticeFromServe() {
    //获取通知
    return new Promise((resolve, reject) => {
      this.getInvNoticeFromServe().then(() => {
        this.getCvtNoticeFromServe().then(() => {
          resolve();
        }, error => {
          reject(error);
        })
      }, (error) => {
        reject(error);
      })
    })
  }

  getInvNoticeFromServe() {
    return new Promise((resolve, reject) => {
      if (this.badgeValueInv == 0 || this.invNotice == null) {
        //获取盘点通知
        this.invService.getInvNoticeByLeadingOrgOrFromServe(this.workForOrg).then((notice) => {
          if (notice != null) {
            //说明有通知了
            this.badgeValueInv = 1;
            this.invNotice = notice;
          } else {
            this.badgeValueInv = 0;
            this.invNotice = null;
          }
          resolve();
        }, (error) => {
          reject("网络连接超时，请确认当前为内网环境" + error);
          //this.noticeService.showNativeToast("网络连接超时，请确认当前为内网环境");
        })
      } else {
        resolve();
      }
    })
  }

  /**
   * 从服务器获取转产通知
   */
  getCvtNoticeFromServe() {
    return new Promise((resolve, reject) => {
      if (this.badgeValueCvt == 0 || this.cvtNotice == null || this.isGranting) {
        //获取转产通知
        this.cvtService.getCvtNonNoticeByWorkerNumberFromServe(this.workerNumber).then((notice) => {
          if (notice != null && notice.noticeState == "ISSUED") {
            this.badgeValueCvt = 1;
            this.isGranting = false;
            this.cvtNotice = notice;
            resolve();
          } else if (notice != null && notice.noticeState == "RECEIVED") {
            //判断通知单状态，判断是否需要获取资产数据，为了满足领用后换设备情况
            this.cvtService.saveCvtAssetsFromServe(this.workerNumber).then((receives) => {
              if (receives != null && receives.length != 0) {
                //有需要发放的资产
                this.cvtService.insertCvtNonNoticeSubFromServe(notice.noticeId).then(() => {
                  //修改状态
                  notice.noticeState = "GRANTING";
                  this.cvtService.updateStateToCvtNotice(notice).then(() => {
                    resolve();
                    this.isGranting = true;
                    this.badgeValueCvt = 0;
                    this.cvtNotice = notice;
                  }, (error) => this.noticeService.showIonicAlert(error))
                }, (error) => this.noticeService.showIonicAlert(error))
              }else{
                this.cvtService.deleteCvtNoticeAndSub(notice.noticeId);
              }
            }, (error) => this.noticeService.showIonicAlert(error))
          } else if (notice != null && notice.noticeState == "GRANTING") {
            this.isGranting = true;
            this.badgeValueCvt = 0;
            this.cvtNotice = notice;
            resolve();
          } else {//notice==null   此时是责任人去领料人那里领资产
            this.badgeValueCvt = 0;
            this.isGranting = false;
            this.cvtNotice = notice;
            resolve();
          }
        }, (error) => {
          reject("网络连接超时，请确认当前为内网环境" + error);
        })
      } else {
        resolve();
      }
    })
  }

  /**
   * 同步盘点数据
   */
  private _synchroInvData() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '正在同步资产盘点数据...',
      duration: 30000
    });
    loading.present();
    this.assetService.queryAssetsFromFixed(this.workerNumber, "2").then().then((fixedAssets) => {
      this.assetService.queryAssetsFromInv(this.workerNumber, "2").then().then((invAssets) => {
        this.assetService.queryListFromChangeRecord(this.workerNumber).then((changeRecords) => {
          //alert("fixed="+fixedAssets.length+"\n invAssets="+invAssets.length+"\n changeRecords="+changeRecords.length);
          this.assetService.syncDBToServer(fixedAssets, invAssets, changeRecords).then((data) => {
            loading.dismiss();
            this.noticeService.showNativeToast("同步成功！");
          }, (error) => {
            loading.dismiss();
            this.noticeService.showIonicAlert("同步失败！" + error);
          })
        }, err => {
          loading.dismiss();
          this.noticeService.showIonicAlert("获取日志表失败：" + err);
        })
      }, err => {
        loading.dismiss();
        this.noticeService.showIonicAlert("获取盘点记录失败：" + err);
      })
    }, err => {
      loading.dismiss();
      this.noticeService.showIonicAlert("获取台账失败：" + err);
    })
  }

  /**
   * 同步转产数据
   */
  private _synchroCvtData() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '正在同步资产转产数据...',
      duration: 30000
    });
    loading.present();
    //获取可以同步的领用单
    alert(this.cvtNotice.noticeId);
    this.cvtService.queryFromCvtNonReceive(this.cvtNotice.noticeId, 1).then((cvtNonReceives) => {
      this.cvtService.syncCvtDBToServer(cvtNonReceives, this.cvtNotice.noticeId).then((data) => {
        loading.dismiss();
        this.noticeService.showNativeToast("同步成功！");
      }, (error) => {
        loading.dismiss();
        this.noticeService.showIonicAlert("同步失败！" + error);
      })
    }, (error) => {
      loading.dismiss();
      this.noticeService.showIonicAlert("获取领用表失败：" + error);
    })
  }



  /**
     * 退出
     */
  exit() {
    this.loginService.getFromStorage("isRemember").then((isRemember) => {
      if (isRemember == "true") {
        //不清除数据，直接退出
        this.loginService.setInStorage("signIn", "false");
        this.navCtrl.setRoot("LoginPage");
      } else {
        //清楚本地存储的内容
        this.loginService.RemoveFromStorage("account").then((data) => {
          this.loginService.RemoveFromStorage("password").then((data2) => {
            this.loginService.RemoveFromStorage("workerNumber").then(() => {
              this.loginService.RemoveFromStorage("wFOAddress").then(() => {
                this.loginService.RemoveFromStorage("userName").then(() => {
                  this.loginService.RemoveFromStorage("workForOrg").then(() => {
                    this.loginService.RemoveFromStorage("workInOrg").then(() => {
                      this.loginService.RemoveFromStorage("userId").then(() => {
                        this.loginService.RemoveFromStorage("signIn").then(() => {
                          this.navCtrl.setRoot("LoginPage");
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      }
    });
  }










  /////////////测试RFID/////////////////////////

  test2() {
    ReadRFID.connect((success) => {
      alert("连接成功" + success);
    }, (err) => {
      alert("失败" + err);
    });
  }
  test1() {
    ReadRFID.start((success) => {
      alert("启动成功");
      alert(success);
    }, (error) => {
      alert("失败：" + error)
    })

  }

  test3() {
    ReadRFID.disconnect((data) => {
      alert("取消连接");
    }, (error) => {
      alert(error.message);
    });

  }
  test4() {
    ReadRFID.release((data) => {
      alert("释放资源");
    }, (err) => {
      alert(err);
    });

  }

  scanRFIDTest() {
    alert("点击事件");
    ReadRFID.connect((success) => {
      alert("连接成功");
      ReadRFID.start((success) => {
        alert("启动成功");
        alert(success);
        ReadRFID.disconnect((data) => {
          alert("取消连接");
        }, (error) => {
          alert(error.message);
        });
        ReadRFID.release((data) => {
          alert("释放资源");
        }, (err) => {
          alert(err);
        });
      }, (error) => {
        alert(error)
      })
    }, (err) => {
      alert(err);
    });
  }

}
