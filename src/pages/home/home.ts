import { DateUtil } from './../../providers/utils/dateUtil';
import { DataBaseUtil } from './../../providers/utils/dataBaseUtil';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { PubContanst } from './../../providers/entity/constant.provider';
import { CvtNonNotice } from './../../providers/entity/cvt.entity.provider';
import { BackButtonService } from '../../providers/service/backButton.service';
import { NoticeService } from './../../providers/service/notice.service';
import { ConvertService } from './../../providers/service/convert.service';
import { InvService } from './../../providers/service/inv.service';
import { LoginService } from './../../providers/service/login.service';
import { InvNotice } from './../../providers/entity/entity.provider';
import { AssetService } from './../../providers/service/asset.service';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
declare let ReadRFID: any;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public isGranting:boolean=false; //判断是否发放
  public isSynchro:boolean=false; //判断是否同步
  public wFOAddress = "";
  public userName = "";
  private workForOrg = ""
  private workInOrg="";
  private workerNumber = "";
  public badgeValueCvt;  //徽章，用于记录转产或者清点时的消息提醒
  public badgeValueInv;
  private invNotice: InvNotice = new InvNotice();   //清点的通知
  private cvtNotice:CvtNonNotice;  //转产通知ID


  constructor(public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    public loginService: LoginService,
    public assetService: AssetService,
    public invService: InvService,
    public navParams: NavParams,
    private platform: Platform,
    private alertCtrl:AlertController,
    private barcodeScanner:BarcodeScanner,
    private convertSer:ConvertService,
    public noticeService: NoticeService,
    private backButtonService: BackButtonService,
    public convertService: ConvertService) {

    this.badgeValueCvt = 0;
    this.badgeValueInv = 0;
    
    this.platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(null);

      //初始化数据
      setTimeout(() => {
        this.loginService.getFromStorage("account").then(()=>{
          
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
    if(this.workForOrg){
      this.getNoticeFromServe();  //每次进入主界面，从服务器获取一次数据
    }    
  }

  //转到资产转产页面
  navToCvt() {
      //有通知，直接进入
      this.convertService.queryFromCvtNonNoticeByWorkerNumber(this.workerNumber).then((cvtNotice)=>{
        this.cvtNotice=cvtNotice;
        if(cvtNotice!=null&&cvtNotice.noticeState=="ISSUED"){
          //处于领用状态
          this.badgeValueCvt=1;
          this.isGranting=false;
          this.navCtrl.push('ConvertPage', {
            workerNumber: this.workerNumber,
            custodian: this.userName,
            cvtNotice: this.cvtNotice,
            workInOrg:this.workInOrg
          });
        }else if(cvtNotice!=null&&cvtNotice.noticeState=="GRANTING"){
          //处于发放状态
          this.badgeValueCvt = 0;
          this.isGranting = true;
          this.isSynchro = false;
          this.navCtrl.push("GrantingPage",{
            cvtNonNotice:this.cvtNotice,
            userName: this.userName,
          });
        }else if(cvtNotice != null&&cvtNotice.noticeState=="SYNCHRONIZE"){
          this.isSynchro=true;
          this.isGranting=false;
          this.badgeValueCvt=0;
          this.cvtNotice=cvtNotice;
        }else{  //notice==null  统一进入到二维码界面
          //没有资产通知，说明1.没有领用通知，2.为资产保管人
          this.badgeValueCvt=0;
          this.isGranting=false;
          this.isSynchro=false;
          this.loginService.getFromStorage("userId").then((userId)=>{
            this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE,userId).then((data)=>{
              //进入页面
            },error=>{
              this.noticeService.showIonicAlert(error.message);
            })
          },error=>this.noticeService.showIonicAlert(error))
        }
      },(error)=>{
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
    // this.navCtrl.push("MinePage");
    //this.navCtrl.push("Test1Page");
    //this.scanRFIDTest();
  }

  handleCvtSynchro(){
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '正在同步中...',
      duration: 30000
    });
    loading.present();
    this.convertSer.queryFromCvtNonReceive(this.cvtNotice.noticeId).then((cvtNonReceives) => {
      this.convertSer.queryFromCvtNonChecks(this.cvtNotice.investplanId).then((cvtNonChecks) => {
        this.convertSer.queryListFromChangeRecordByChangeTypes(PubContanst.ChangeRecord.CONVERT).then((record1) => {
          this.convertSer.queryListFromChangeRecordByChangeTypes(PubContanst.ChangeRecord.GRANTING).then((record2) => {
            // let changeRecords= new Array<ChangeRecord>();
            // if(record1){
            //   changeRecords= changeRecords.concat(record1);
            // }
            let changeRecords=record1;
            if(record2){
              changeRecords= changeRecords.concat(record2);
            }
            this.convertSer.syncCvtDBToServer(cvtNonReceives, cvtNonChecks, changeRecords,this.cvtNotice.noticeId).then((data) => {
              loading.dismiss();
              this.noticeService.showNativeToast("同步成功！");
              this.isSynchro=false;
            }, (error) => {
              loading.dismiss();
              this.noticeService.showIonicAlert("同步失败！" + error);
            })
          }, (error) => {
            loading.dismiss();
            this.noticeService.showIonicAlert("获取日志表失败：" + error);
          })
        }, (error) => {
          loading.dismiss();
          this.noticeService.showIonicAlert("获取日志表失败：" + error);
        })
      }, (error) => {
        loading.dismiss();
        this.noticeService.showIonicAlert("获取验收表失败：" + error);
      })
    }, (error) => {
      loading.dismiss();
      this.noticeService.showIonicAlert("获取领用表失败：" + error);
    })
  }

  //同步数据
  navToSynchro() {
    let synchroTitle="";
    let synchroTime="";
    this.loginService.getFromStorage("synchroTime").then((data)=>{
      if(data==null||data==""){
        //没有同步过
        synchroTitle="";
        synchroTime="";
      }else{
        synchroTitle="上次同步时间";
        synchroTime=data;
      }
      let synchroAlert=this.alertCtrl.create({
        title:'是否同步数据？',
        subTitle:synchroTitle,
        message:synchroTime,
        cssClass:'alert-synchro',
        buttons:[
          {
            text:'取消',
            role:'concel',
            handler:()=>{
  
            }
          },
          {
            text:'确定',
            cssClass:"border:1px",
            handler:()=>{
              this._synchro();
              //将时间保存到数据库中
              let time=DateUtil.formatDateToHMS(new Date())
              this.loginService.updateSynchroTimeToUserInfo(this.workerNumber,time);
              this.loginService.setInStorage("synchroTime",time); 
            }
          }
  
        ]
      })
      synchroAlert.present();
    })

  }

  private _synchro(){

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '正在同步中...',
      duration: 30000
    });
    loading.present();
    this.assetService.queryAssetsFormFixed(this.workerNumber, "2").then().then((fixedAssets) => {
      this.assetService.queryAssetsFormInv(this.workerNumber, "2").then().then((invAssets) => {
        this.assetService.queryListFormChangeRecord(this.workerNumber).then((changeRecords) => {
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
    //需要同步转产数据
    if(this.isSynchro){
      this.handleCvtSynchro();
    }
  }

  /**
   * 退出
   */
  exit() {
    this.loginService.getFromStorage("isRemember").then((isRemember) => {
      if (isRemember == "true") {
        //不清除数据，直接退出
        this.loginService.setInStorage("signIn","false");
        this.navCtrl.setRoot("LoginPage");
      } else {
        //清楚本地存储的内容
        this.loginService.RemoveFromStorage("account").then((data) => {
          this.loginService.RemoveFromStorage("password").then((data2) => {
            this.loginService.RemoveFromStorage("workerNumber").then(() => {
              this.loginService.RemoveFromStorage("wFOAddress").then(() => {
                this.loginService.RemoveFromStorage("userName").then(() => {
                  this.loginService.RemoveFromStorage("workForOrg").then(() => {
                    this.loginService.RemoveFromStorage("workInOrg").then(()=>{
                      this.loginService.RemoveFromStorage("userId").then(()=>{
                        this.loginService.RemoveFromStorage("signIn").then(()=>{
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

  test33() {

    //this.webService.testPost("1170000020003");
    // this.webService.testhttp().then((data)=>{
    //   alert(data.length);
    // })

    //this.navCtrl.push("ReceivePage");

    // alert(new Date("2017-01-01 12:00:01").getTime());

    // this.storageService.deleteFromCvtNonNotice().then(()=>{
    //   this.storageService.deleteFromCvtNonNoticeSub().then(()=>{
    //     this.storageService.deleteFromCvtNonCheck().then(()=>{
    //       this.storageService.deleteFromCvtNonReceive().then(()=>{
    //         this.storageService.deleteFromChangeRecordByChangeType(PubContanst.ChangeRecord.CONVERT).then(()=>{
    //           this.storageService.deleteFromChangeRecordByChangeType(PubContanst.ChangeRecord.GRANTING).then(()=>{
    //             alert("删除成功");
    //           })
    //         })
    //       })
    //     })
    //   })
    // })
  }
  

  getInvNotice() {
  }

  //用户信息
  userMessage(){
    this.noticeService.showIonicAlert("当前用户："+this.userName);

  }

  download() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '正在从服务器获取信息...',
      duration: 30000
    });
    loading.present();
    this.getNoticeFromServe().then(()=>{
      this.noticeService.showNativeToast("获取通知成功！");
      loading.dismiss();
    },(error)=>{
      this.noticeService.showIonicAlert(error);
      loading.dismiss();
    });
  }
  /**
   * 从服务器获取通知
   */
  getNoticeFromServe() {
    //获取通知
    // if (this.workForOrg == null) {
    //   this.loginService.getFromStorage("workForOrg").then((wfo) => {
    //     this.workForOrg = wfo;
    //   }, (error) => {
    //     this.workForOrg = null;
    //   });
    // }
    return new Promise((resolve,reject)=>{
      this.getInvNoticeFromServe().then(()=>{
        this.getCvtNoticeFromServe().then(()=>{
          resolve();
        },error=>{
          reject(error);
        })
      },(error)=>{
        reject(error);
      })
  })
  }

  getInvNoticeFromServe(){
    return new Promise((resolve,reject)=>{
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
          reject("网络连接超时，请确认当前为内网环境"+error);
          //this.noticeService.showNativeToast("网络连接超时，请确认当前为内网环境");
        })
      }else{
        resolve();
      }
    })
  }

  /**
   * 从服务器获取转产通知
   */
  getCvtNoticeFromServe(){
    return new Promise((resolve,reject)=>{
    if (this.badgeValueCvt == 0 || this.cvtNotice == null||!this.isGranting||!this.isSynchro) {
      //获取转产通知
      this.convertService.getFromCvtNonNoticeByWNAndOrgOrFromServe(this.workerNumber, this.workInOrg).then((notice) => {
        if (notice != null&&notice.noticeState=="ISSUED") {
          this.badgeValueCvt = 1;
          this.isGranting=false;
          this.isSynchro=false;
          this.cvtNotice = notice;
        }else if(notice != null&&notice.noticeState=="GRANTING"){
          this.isGranting=true;
          this.isSynchro=false;
          this.badgeValueCvt=0;
          this.cvtNotice=notice;
        }else if(notice != null&&notice.noticeState=="SYNCHRONIZE"){
          this.isSynchro=true;
          this.isGranting=false;
          this.badgeValueCvt=0;
          this.cvtNotice=notice;
        }else {//notice==null   此时是责任人去领料人那里领资产
          this.badgeValueCvt = 0;
          this.isSynchro=false;
          this.isGranting=false;
          this.cvtNotice = null;
        }
        resolve();
      }, (error) => {
        reject("网络连接超时，请确认当前为内网环境"+error);
        //this.noticeService.showIonicAlert(error.toString());
        //this.noticeService.showNativeToast("网络连接超时，请确认当前为内网环境");
      })
    }else{
      resolve();
    }
  })
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
