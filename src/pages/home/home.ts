import { AttachmentService } from './../../providers/service/attachment.service';
import { HttpUtils } from './../../providers/utils/httpUtils';
import { WorkflowWebProvider } from './../../providers/web/workflow.web.provider';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { PubConstant } from './../../providers/entity/constant.provider';
import { CvtNonNotice, CvtNonReceive } from './../../providers/entity/cvt.entity.provider';
import { BackButtonService } from '../../providers/service/backButton.service';
import { NoticeService } from './../../providers/service/notice.service';
import { CvtService } from './../../providers/service/cvt.service';
import { InvService } from './../../providers/service/inv.service';
import { LoginService } from './../../providers/service/login.service';
import { InvNotice } from './../../providers/entity/entity.provider';
import { AssetService } from './../../providers/service/asset.service';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { AssetHandleService } from '../../providers/service/asset.handle.service';

import { TransferObject, Transfer } from '@ionic-native/transfer';
import { AppVersion } from '@ionic-native/app-version';
import { FileOpener } from '@ionic-native/file-opener';
import { PubWebProvider } from '../../providers/web/pub.web.provider';
import { ConvertUtil } from '../../providers/utils/convertUtil';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
declare let ReadRFID: any;

/**
 * 首页
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public wFOAddress = "";  //所属单位中文名称
  public userName = "";    //用户名
  private workForOrg = ""  //所属单位编码
  private workInOrg = "";  //所在单位编码
  private workerNumber = "";  //员工编号
  public badgeValueInv;  //徽章，用于记录转产或者清点时的消息提醒
  public badgeValuePro;  //徽章，用于流程审批时的消息提醒


  public listConvert:Array<CvtNonNotice>;  //需要领用的通知
  public listGranting:Array<CvtNonNotice>; //需要发放的通知

  public invNotice: InvNotice = new InvNotice();   //清点的通知
  public cvtNoticeList: Array<CvtNonNotice>;       //转产通知ID
  public finishTime="";    //用于记录盘点通知结束时间

  private fileTransfer: TransferObject;

  constructor(public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private menuCtrl:MenuController,
    public loginService: LoginService,
    public assetService: AssetService,
    public invService: InvService,
    private workflowWebProvider:WorkflowWebProvider,
    public navParams: NavParams,
    private platform: Platform,
    private alertCtrl: AlertController,
    private barcodeScanner: BarcodeScanner,
    private assetHandleService:AssetHandleService,
    private cvtService: CvtService,
    private noticeService: NoticeService,
    private attachmentService:AttachmentService,
    private backButtonService: BackButtonService,
    private appVersion: AppVersion,
    private fileOpener: FileOpener,
    private pubWebProvider:PubWebProvider,
    private screenOrientation:ScreenOrientation,
    private transfer: Transfer) {
      //控制屏幕方向（当前为强制横屏）
    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.badgeValueInv = 0;
    this.fileTransfer = this.transfer.create();
    this.checkAppVersion(false);

    this.platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(null);

      //初始化数据
      setTimeout(() => {
        this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_ACCOUNT).then(() => {
          this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_USER_NAME).then((userName) => {
            this.userName = userName;
            this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_WFO_ADDRESS).then((wFOAddress) => {
              this.wFOAddress = wFOAddress;
              this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_WORKER_NUMBER).then((number) => {
                this.workerNumber = number;
                this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_WORK_IN_ORG).then((workInOrg) => {
                  this.workInOrg = workInOrg;
                  this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_WORK_FOR_ORG).then((wForOrg) => {
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
    //每次进入页面调用此方法

    //初始化转产信息
    this.initCvt();
    //获取审批任务
    this.getTaskListFromServe();
    // if (this.workForOrg) {
    //   this.getNoticeFromServe();  //每次进入主界面，从服务器获取一次数据
    // }
  }
  test() {
    this.navCtrl.push("Test2Page");
    //this.checkAppVersion();
    // this.invWebProvider.test().then(()=>{

    // })
    // let modal=this.modalCtrl.create("Test1Page");
    // modal.onDidDismiss(data=>{
    //   alert(data);
    // })
    // modal.present();

  }

  //初始化转产状态
  initCvt(){
    this.cvtService.queryFromCvtNonNoticeByWorkerNumber(this.workerNumber).then((cvtNoticeList) => {
      this.cvtNoticeList = cvtNoticeList;
      this.listConvert = new Array<CvtNonNotice>();
      this.listGranting = new Array<CvtNonNotice>();
      if (cvtNoticeList != null && cvtNoticeList.length != 0) {
        for(let i=0;i<cvtNoticeList.length;i++){
          let cvtNotice=cvtNoticeList[i];
          if(cvtNotice.noticeState=="ISSUED"){
            this.listConvert.push(cvtNotice);
          }else if(cvtNotice.noticeState=="GRANTING"){
            this.listGranting.push(cvtNotice);
          }
        }
      }
    })
  }

  //转到资产转产页面
  navToCvt() {
    //有通知，直接进入
    this.cvtService.queryFromCvtNonNoticeByWorkerNumber(this.workerNumber).then((cvtNoticeList) => {
      this.cvtNoticeList = cvtNoticeList;
      if (cvtNoticeList.length == 1) {
        //只有一个通知的情况
        let cvtNotice = cvtNoticeList[0];
        this.navTo(cvtNotice);
      }else if(cvtNoticeList.length>1){
        //有多个通知的情况
        this.navCtrl.push("ConvertListPage",{
          listConvert:this.listConvert,
          listGranting: this.listGranting,
          workerNumber: this.workerNumber,
          userName: this.userName
        });

      } else {
        //没有资产通知，说明1.领用人没有领用通知，2.为资产保管人
        this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_USER_ID).then((userId) => {
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
  }

  //判断转产通知单跳往那个页面
  navTo(cvtNotice:CvtNonNotice){
    if (cvtNotice != null && cvtNotice.noticeState == "ISSUED") {
      //处于领用状态
      this.navCtrl.push('ConvertPage', {
        workerNumber: this.workerNumber,
        cvtNotice: cvtNotice,
        custodian: this.userName,
      });
    } else if (cvtNotice != null && cvtNotice.noticeState == "GRANTING") {
      //处于发放状态
      this.navCtrl.push("GrantingPage", {
        cvtNonNotice: cvtNotice,
        userName: this.userName,
      });
    } else {  //notice==null  统一进入到二维码界面
      //没有资产通知，说明1.领用人没有领用通知，2.为资产保管人
      this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_USER_ID).then((userId) => {
        this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, userId).then((data) => {
          //进入页面
        }, error => {
          this.noticeService.showIonicAlert(error.message);
        })
      }, error => this.noticeService.showIonicAlert(error))
    }
  }
  //转到资产盘点页面
  navToInv() {
    if (this.badgeValueInv == 0) {
      if (this.workForOrg == null) {
        this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_WORK_FOR_ORG).then((value) => {
          this.workForOrg = value;
        })
      }
      //从服务器中查询是否存在通知
      let loading = this.loadingCtrl.create({
        content: '正在从服务器获取数据',
        duration: 30000
      });
      loading.present();
      this.invService.getInvNoticeByLeadingOrgFromServe(this.workForOrg,this.workerNumber).then((invNotice) => {
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
          this.noticeService.showToast("未在盘点时间范围内");
        }

      }, (error) => {
        loading.dismiss();
        this.noticeService.showToast("网络连接超时，请确认当前为内网环境");
      })
    } else if (this.badgeValueInv > 0) {
      this.navCtrl.push("InventoryPage", {
        invNotice: this.invNotice,
        workerNumber: this.workerNumber
      })
    }
  }
  //转到我的资产页面
  navToMyAsset(param?:boolean) {
    //用于在侧边栏点击完成后退出侧边栏
    if(param){
      setTimeout(()=>{
        this.menuCtrl.close();
      },400);
    }
    this.navCtrl.push('MyAssetPage', {
      workerNumber: this.workerNumber
    });
  }
  //流程审批
  navToProcess(param?:boolean) {
    this.navCtrl.push("ProcessPage",{
      workerNumber:this.workerNumber
    });

    if(param){
      setTimeout(()=>{
        this.menuCtrl.close();
      },400);
    }
  }

  //设置页面
  navToSetting(param?:boolean) {
    if(param){
      setTimeout(()=>{
        this.menuCtrl.close();
      },400);
    }
    this.navCtrl.push("SettingPage");

  }

  /**
   * 设置服务器的地址和端口
   */
  setting(){
    this.loginService.settingHttpAddressAndPort();
  }

  /**
   * 得到需要同步的数据
   */
  getSynchroCount() {
    return new Promise((resolve, reject) => {
      let cvtNonReceiveList = Array<CvtNonReceive>();
      this.assetHandleService.getScrapListByWorkerNumber(this.workerNumber).then((scrapList) => {
        this.assetHandleService.getIdleListByWorkerNumber(this.workerNumber).then((idleList) => {
          this.attachmentService.getUnSynchroAttachments().then((attachments) => {
            this.assetService.queryAssetsFromFixed(this.workerNumber, 1).then().then((fixedAssets) => {
              if (this.cvtNoticeList == null || this.cvtNoticeList.length == 0) {
                //没有转产通知
                resolve(fixedAssets.length + idleList.length + scrapList.length+attachments.length);
              } else {
                let lastNoticeId = this.cvtNoticeList[this.cvtNoticeList.length - 1].noticeId;
                for (let i = 0; i < this.cvtNoticeList.length; i++) {
                  let cvtNotice = this.cvtNoticeList[i];
                  this.cvtService.queryFromCvtNonReceive(cvtNotice.noticeId, 1).then((cvtNonReceives) => {
                    if (cvtNonReceives) {
                      cvtNonReceiveList = cvtNonReceiveList.concat(cvtNonReceives);
                    }
                    if (cvtNotice.noticeId == lastNoticeId) {
                      resolve(fixedAssets.length + cvtNonReceives.length + idleList.length + scrapList.length+attachments.length);
                    }
                  }, (error) => {
                    reject("获取领用表失败：<br>" + error);
                  })
                }
              }
            }, (error) => {
              reject("获取台账失败：<br>" + error);
            })

          }, (error) => {
            reject("获取附件表失败：<br>" + error)
          })
        }, (error) => {
          reject("获取闲置表失败：<br>" + error)
        })
      }, (error) => {
        reject("获取报废表失败：<br>" + error)
      })
    })
  }

  //同步数据
  navToSynchro() {
    let synchroTitle = "";
    let synchroTime = "";
    this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_SYNCHRO_TIME).then((data) => {
      if (data == null || data == "") {
        //没有同步过
        synchroTitle = "";
        synchroTime = "";
      } else {
        synchroTitle = "上次同步时间：";
        synchroTime = data;
      }
      this.getSynchroCount().then((count) => {
        let synchroNumber = count;
        let synchroAlert = this.alertCtrl.create({
          title: '数据同步',
          subTitle: "未同步：" + synchroNumber,
          message: synchroTitle + "<br/>&emsp;" + synchroTime,
          cssClass: 'alert-conform',
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
                //同步数据
                this._synchroData();
                //将时间保存到数据库中
                let time = ConvertUtil.formatDateToHMS(new Date())
                this.loginService.updateSynchroTimeToUserInfo(this.workerNumber, time);
                this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_SYNCHRO_TIME, time);
              }
            }
          ]
        })
        synchroAlert.present();
      }, (error) => {
        this.noticeService.showIonicAlert(error);
      })
    })

  }

  //用户信息
  userMessage() {
    this.noticeService.showIonicAlert("当前用户：" + this.userName);
  }

  /**
   * 下载数据
   */
  download() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      duration:20000,
      content: '正在从服务器获取数据',
    });
    loading.present();
    this.loginService.downloadBasicData().then(() => {
      loading.setContent("正在从服务器获取通知单信息");
      this.getNoticeFromServe().then(() => {
        loading.setContent("正在从服务器获取资产信息");
        this.assetService.downloadAndSaveData(this.workerNumber).then(()=>{
          this.noticeService.showToast("数据下载成功");
          loading.dismiss();
        }, (error) => {
          this.noticeService.showIonicAlert(error);
          loading.dismiss();
        });
      }, (error) => {
        this.noticeService.showIonicAlert(error);
        loading.dismiss();
      });
    }, (error) => {
      this.noticeService.showIonicAlert(error);
      loading.dismiss();
    });
  }
  /**
   * 从服务器获取通知
   */
  getNoticeFromServe() {
    //获取通知
    return new Promise((resolve, reject) => {
      this.getInvNoticeFromServe().then(() => {
        this.getCvtNoticeFromServe().then(() => {
          this.getTaskListFromServe().then(()=>{
            resolve();
          }, error => {
            reject(error);
          })
        }, error => {
          reject(error);
        })
      }, (error) => {
        reject(error);
      })
    })
  }

  /**
   * 从服务器获取审批任务列表
   */
  getTaskListFromServe() {
    return new Promise((resolve, reject) => {
      //获取流程审批数据
      this.workflowWebProvider.getTaskListFromServe(this.workerNumber).subscribe((taskList)=>{
        resolve();
        if(taskList!=null&&taskList.length>=0){
          this.badgeValuePro=taskList.length;
        }
      }, error => {
        reject(error);
      })
    })
  }

  /**
   * 从服务器获取盘点通知
   */
  getInvNoticeFromServe() {
    return new Promise((resolve, reject) => {
      if (this.badgeValueInv == 0 || this.invNotice == null) {
        //获取盘点通知
        this.invService.getInvNoticeByLeadingOrgFromServe(this.workForOrg,this.workerNumber).then((notice) => {
          if (notice != null) {
            //说明有通知了
            this.badgeValueInv = 1;
            this.invNotice = notice;
            this.finishTime=ConvertUtil.formatDate(new Date(notice.timeFinish));
          } else {
            this.badgeValueInv = 0;
            this.invNotice = null;
          }
          resolve();
        }, (error) => {
          reject(error);
          //this.noticeService.showToast("网络连接超时，请确认当前为内网环境");
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
      //获取转产通知
      this.cvtService.getCvtNonNoticeByWorkerNumberFromServe(this.workerNumber).then((noticeList) => {
        if (noticeList == null) {
          //没有成功接收到通知的情况：1.员工编号为空；2.没网的情况，或请求失败
          resolve(null);
        } else if (noticeList.length == 0) {
          //说明已经没有通知了
          this.listConvert = new Array<CvtNonNotice>();
          this.listGranting = new Array<CvtNonNotice>();
          resolve(null);
        } else {
          //有通知，需要处理
          this.listConvert = new Array<CvtNonNotice>();
          this.listGranting = new Array<CvtNonNotice>();
          this.cvtNoticeList = noticeList;
          let lastNoticeId=noticeList[noticeList.length-1].noticeId;
          for (let i = 0; i < noticeList.length; i++) {
            let notice = noticeList[i];
            if (notice != null && notice.noticeState == "ISSUED") {
              //需要领用的情况
              this.listConvert.push(notice);
              if(notice.noticeId==lastNoticeId){ 
                resolve();
              }
            } else if (notice != null && notice.noticeState == "RECEIVED") {
              //判断通知单状态，判断是否需要获取资产数据，为了满足领用后换设备情况，
              this.cvtService.saveCvtAssetsFromServe(this.workerNumber, notice.noticeId).then((receives) => {
                if (receives != null && receives.length != 0) {
                  //有需要发放的资产
                  this.cvtService.insertCvtNonNoticeSubFromServe(notice.noticeId).then(() => {
                    //修改状态
                    notice.noticeState = "GRANTING";
                    this.cvtService.updateStateToCvtNotice(notice).then(() => {
                      this.listGranting.push(notice);
                      if(notice.noticeId==lastNoticeId){ 
                        resolve();
                      }
                    }, (error) => this.noticeService.showIonicAlert("修改转产通知单状态失败："+error))
                  }, (error) => this.noticeService.showIonicAlert("获取转产数据失败："+error))
                } else {
                  this.cvtService.deleteCvtNoticeAndSub(notice.noticeId);
                }
              }, (error) => this.noticeService.showIonicAlert("获取转产数据失败："+error))
            } else if (notice != null && notice.noticeState == "GRANTING") {
              this.listGranting.push(notice);
              if(notice.noticeId==lastNoticeId){ 
                resolve();
              }
            } else {//notice==null   此时是责任人去领料人那里领资产
              if(notice.noticeId==lastNoticeId){ 
                resolve();
              }
            }
          }
        }
      }, (error) => {
        reject(error);
      })
    })
  }

  /**
   * 同步盘点数据
   */
  private _synchroData() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: '正在同步资产盘点数据...',
      duration: 30000
    });
    loading.present();
    this.assetService.synchroInvData(this.workerNumber).then(() => {
      loading.setContent("正在同步资产转产数据...");
      this.cvtService.synchroCvtData(this.cvtNoticeList).then(() => {
        loading.setContent("正在同步闲置资产数据...");
        this.assetHandleService.synchroIdleListToServe(this.workerNumber).then(() => {
          loading.setContent("正在同步报废资产数据...");
          this.assetHandleService.synchroScrapListToServe(this.workerNumber).then(() => {
            loading.setContent("正在同步附件表...")
            this.attachmentService.synchroAttachmentToServe().then(()=>{
              loading.dismiss();
              this.noticeService.showToast("同步成功");
            }, error => {
              loading.dismiss();
              this.noticeService.showIonicAlert(error);
            })
          }, error => {
            loading.dismiss();
            this.noticeService.showIonicAlert(error);
          })
        }, error => {
          loading.dismiss();
          this.noticeService.showIonicAlert(error);
        })
      }, error => {
        loading.dismiss();
        this.noticeService.showIonicAlert(error);
      })
    }, error => {
      loading.dismiss();
      this.noticeService.showIonicAlert(error);
    })
  }


  //软件更新
  /**
   * 判断当前版本是否需要更新
   * @param showResult 不需要更新时是否进行提示， true提示 false不提示
   */
  checkAppVersion(showResult:boolean){
    if(showResult){
      var loading=this.noticeService.showIonicLoading("正在获取数据...");
      loading.present();
    }
    this.pubWebProvider.getRecentAppVersion().subscribe((appInfo)=>{
      this.appVersion.getVersionNumber().then((version)=>{
        if(showResult){
          loading.dismiss();
        }
        if(appInfo.appVersion>version){
          let alert = this.alertCtrl.create({
            title: '版本更新',
            cssClass:"alert-conform",
            subTitle: '发现最新版本, 是否更新?',
            buttons: [
              {
                text: '取消',
                role: 'cancel',
                handler: () => {
                  console.log('取消');
                }
              },
              {
                text: '更新',
                handler: () => {
                  console.log('更新');
                  this.loadAPP();
                }
              }
            ]
          });
          alert.present();
  
        }else if(showResult){
          this.noticeService.showIonicAlert("当前已经是最新版本");
          return;
        }
      })
      
    },(error)=>{
      if(showResult){
        loading.dismiss();
        this.noticeService.showIonicAlert("网络连接超时");
      }
    })

  }

  // 下载app
  private loadAPP(){
    let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: '安装包正在下载...',
        dismissOnPageChange: false
    });
    loading.present();
    // 下载 
    this.fileTransfer.download(HttpUtils.getApkDownloadURLFromProperties(), "file:///storage/sdcard0/Download/qdg.apk").then((entry) => {
      loading.dismiss();
      this.fileOpener.open("file:///storage/sdcard0/Download/qdg.apk",'application/vnd.android.package-archive').then(()=>{});
    }, (error) => {
      // handle error
      console.log('download error');
      alert("下载失败"+error.message);
      loading.dismiss();
    });
    // 进度
    this.fileTransfer.onProgress((event) => {
      //进度，这里使用文字显示下载百分比
      var downloadProgress = (event.loaded / event.total) * 100;
      loading.setContent("已经下载：" + Math.floor(downloadProgress) + "%");
      if (downloadProgress > 99) {
          loading.dismiss();
      }
    });
  }



  /**
     * 退出
     */
  exit() {
    this.loginService.getFromStorage(PubConstant.LOCAL_STORAGE_KEY_IS_REMEMBER).then((isRemember) => {
      if (isRemember == "true") {
        //不清除数据，直接退出
        this.loginService.setInStorage(PubConstant.LOCAL_STORAGE_KEY_SIGN_IN, "false");
        this.navCtrl.setRoot("LoginPage");
      } else {
        //清楚本地存储的内容
        this.loginService.RemoveFromStorage(PubConstant.LOCAL_STORAGE_KEY_ACCOUNT).then((data) => {
          this.loginService.RemoveFromStorage(PubConstant.LOCAL_STORAGE_KEY_PASSWORD).then((data2) => {
            this.loginService.RemoveFromStorage(PubConstant.LOCAL_STORAGE_KEY_WORKER_NUMBER).then(() => {
              this.loginService.RemoveFromStorage(PubConstant.LOCAL_STORAGE_KEY_WFO_ADDRESS).then(() => {
                this.loginService.RemoveFromStorage(PubConstant.LOCAL_STORAGE_KEY_USER_NAME).then(() => {
                  this.loginService.RemoveFromStorage(PubConstant.LOCAL_STORAGE_KEY_WORK_FOR_ORG).then(() => {
                    this.loginService.RemoveFromStorage(PubConstant.LOCAL_STORAGE_KEY_WORK_IN_ORG).then(() => {
                      this.loginService.RemoveFromStorage(PubConstant.LOCAL_STORAGE_KEY_USER_ID).then(() => {
                        this.loginService.RemoveFromStorage(PubConstant.LOCAL_STORAGE_KEY_SIGN_IN).then(() => {
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

    //sso直接退出
    // let alert = this.alertCtrl.create({
    //   title: '提示',
    //   cssClass:"alert-conform",
    //   subTitle: '是否确认退出?',
    //   buttons: [
    //     {
    //       text: '取消',
    //       role: 'cancel',
    //       handler: () => {
    //         console.log('取消');
    //       }
    //     },
    //     {
    //       text: '退出',
    //       handler: () => {
    //         this.platform.exitApp();
    //       }
    //     }
    //   ]
    // });
    // alert.present();
  }