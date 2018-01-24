import { NoticeService } from './../../providers/service/notice.service';
import { FabContainer } from 'ionic-angular';
import { FixedAsset, InvNotice } from './../../providers/entity/entity.provider';
import { AssetService } from './../../providers/service/asset.service';
import { Component, ViewChild } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController, Platform, InfiniteScroll,ModalController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DateUtil } from '../../providers/utils/dateUtil';
import { Content } from 'ionic-angular/components/content/content';
declare let ReadRFID: any;
 
@IonicPage()
@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html'
})
export class InventoryPage {  
  @ViewChild(Content) content:Content
  public dataTable:Array<FixedAsset>=new Array<FixedAsset>();
  public searched:boolean=false;
  private pageIndex=1;
  private pageSize=20;
  public invNotice:InvNotice;   //通知单ID
  private workerNumber;
  public isHaveData;   //判断是否有数据

  public finishTime;  //通知终止时间

  private selectedIndex;  //记录点击盘点的资产索引号
  private isInToSignaturePage=false;  //记录是否进入了签名页，如果进入则全部数据进行刷新


  constructor(
    public navCtrl: NavController,
    private loadingCtrl:LoadingController,
    private platform:Platform,
    private noticeService:NoticeService,
    private navParams:NavParams,
    private barcodeScanner:BarcodeScanner,
    private alertCtrl:AlertController,
    private assetService:AssetService,
    public modalCtrl:ModalController
    ) {
    this.invNotice=this.navParams.get("invNotice");
    this.workerNumber=this.navParams.get("workerNumber");
    this.platform.ready().then(()=>{
      this.finishTime=DateUtil.formatDate(new Date(this.invNotice.timeFinish));
    })
    this.init();
  }
  init(){
    this.pageIndex=1;
    this.dataTable = new Array<FixedAsset>();
    this.assetService.queryAssetsFormFixedByPage(this.pageSize, this.pageIndex, this.workerNumber).then(data => {
      for (var i = 0; i < data.length; i++) {
        this.dataTable.push(data[i]);
      }
      this.pageIndex++;
      if (data.length == 0) {
        //说明没有数据
        this.isHaveData = false;
      } else {
        this.isHaveData = true;
      }
    })
  }
  
  
  //页面加载完成时调用的函数
  ionViewDidEnter(){
    // let loading=this.loadingCtrl.create({
    //   spinner:'bubbles',
    //   content:'正在加载中，请稍候！',
    //   duration:10000
    // });
    //  loading.present();
    if(this.isInToSignaturePage){
      this.init();
      this.isInToSignaturePage=false;
    }else if (this.selectedIndex!=null) {
      //更新具体的某一项状态
      this.assetService.queryAssetFromFixedById(this.dataTable[this.selectedIndex].assetId).then((data) => {
        if (data) {
          this.dataTable[this.selectedIndex].isChecked = data.isChecked;
        }
      })
    }
  }

    //进入手写签名页面
  signature(fab:FabContainer){
    if(fab!=null){
      setTimeout(()=>{
      fab.close();
    },200);
    }
    this.assetService.queryAssetsFromInv(this.workerNumber,"1").then((invAssets)=>{
      this.navCtrl.push("SignaturePage",{
        invAssets:invAssets,
        signatureType:"inv"
      });
    })
    this.isInToSignaturePage=true;
  }
 

   private recordData:Array<FixedAsset>=null;
   /**
   * 搜索功能
   * @param ev 
   */
  getItems(ev:any){
      let val=ev.target.value;
    if(this.recordData==null){
      let loading=this.loadingCtrl.create({
      spinner:'bubbles',
      content:'正在加载中，请稍候！'
    });
     loading.present();
    // 重新刷新
    this.assetService.queryAssetsFromFixed(this.workerNumber,"-1").then((data)=>{
      //进行筛选
      this.recordData=data;
    // if(val&&val.trim!=""){
      console.log("val="+val);
      this.dataTable=null;
      this.dataTable=data.filter((item)=>{
        console.log(item.assetName.indexOf(val));
        return (item.assetName.indexOf(val)>-1);
      })
      loading.dismiss();
    // }
    },err=>{
      loading.dismiss();
    })
    }else{
      console.log("val="+val);
      this.dataTable=null;
      this.dataTable=this.recordData.filter((item)=>{
        console.log(item.assetName.indexOf(val));
        return (item.assetName.indexOf(val)>-1);
      })
    }
  }
 
  judge=true;
  /**
   * 显示搜索窗体
   */
  doSearch(){
    this.content.scrollToTop(0);
    if(this.content.scrollTop<50){
      //开闭
      this.judge=!this.judge;
    }else if(this.judge==true){
      this.judge=false;
    }
    // let searchbar=document.getElementById("searchbar");
    // if(searchbar.style.display=="none"){
    //   searchbar.style.display="inline";
    // }
    // else{
    //   searchbar.style.display="none";
    // }
  }


  scanTwoDimensionCode(fab:FabContainer){
    if(fab!=null){
      setTimeout(()=>{
      fab.close();
    },200);
    }
    this.barcodeScanner.scan().then((result)=>{
        var code=result.text;
        if(code==""){
          return;
        }
        this.platform.ready().then(()=>{
          this.assetService.queryAssetFromFixedByCode(code).then((fixedAsset)=>{
            if(fixedAsset==null){
              this.showAlert("查询资产失败,请确认二维码是否正确！");
              return;
            }
            this.assetService.queryAssetFromInvByIdAndNoticeId(fixedAsset.assetId,this.invNotice.noticeId).then((invAsset)=>{
              this.navCtrl.push("InvAssetMessagePage",{
                fixedAsset:fixedAsset,
                invAsset:invAsset,
                invNoticeId:this.invNotice.noticeId,
                workerNumber:this.workerNumber
              })
            })
          })
      });
     });
  }
   

  //盘点
  scan(item,i){
    this.selectedIndex=i;
    let id=item.assetId;
    let code=item.twoDimensionCode;  //应该是扫码获得的ID
    if(code==""||code==null){
      //没有二维码标签，直接进入资产信息页
      this.platform.ready().then(()=>{
        this.assetService.queryAssetFromFixedById(id).then((fixedAsset)=>{
          if(fixedAsset==null){
            this.showAlert("查询资产失败，不存在该资产！");
            return;
          }
          this.assetService.queryAssetFromInvByIdAndNoticeId(id,this.invNotice.noticeId).then((invAsset)=>{
            this.navCtrl.push("InvAssetMessagePage",{
              fixedAsset:fixedAsset,
              invAsset:invAsset,
              invNoticeId:this.invNotice.noticeId,
                workerNumber:this.workerNumber
            })
          })
        })
      })
    }else{
      this.barcodeScanner.scan().then((result)=>{
        code=result.text;
        if(code==""){
          return;
        }
        this.platform.ready().then(()=>{
          this.assetService.queryAssetFromFixedByIdAndCode(id,code).then((fixedAsset)=>{
            if(fixedAsset==null){
              this.showAlert("查询资产失败,请确认二维码是否正确！");
              return;
            }
            this.assetService.queryAssetFromInvByIdAndNoticeId(id,this.invNotice.noticeId).then((invAsset)=>{
              this.navCtrl.push("InvAssetMessagePage",{
                fixedAsset:fixedAsset,
                invAsset:invAsset,
                invNoticeId:this.invNotice.noticeId,
                workerNumber:this.workerNumber
              })
            })
          })
      });
     });
    }
  }
  showAlert(msg:String){
    this.alertCtrl.create({
      title:"提醒",
      subTitle:msg+"",
      buttons:["确定"]
    }).present();
  }

 
  //重新盘点
  reScan(item,i){
    var alert=this.alertCtrl.create({
      title:'提示',
      message:'该资产已经盘点，是否重新进行盘点？',
      buttons:[
        {
          text:'取消',
          role:'cancel',
        },
        {
          text:'确定',
          handler:()=>{
            this.scan(item,i);
          }
        }
      ]
    });
    alert.present();
  }


  showPopup(fab:FabContainer){
    setTimeout(()=>{
      fab.close();
    },200);
    
    let contactModal = this.modalCtrl.create("PopupPage");
    contactModal.onDidDismiss(data => {
     if(data.type=="twoDimensionCode"){
       //alert("扫描二维码");
       //this.scan(item);
       this.scanTwoDimensionCode(fab);
     }else if(data.type=="RFID"){
       alert("扫描RFID");
     }

   });
   contactModal.present();
  }



scanrfid(fab: FabContainer) {
  if(fab!=null){
      setTimeout(()=>{
      fab.close();
    },200);
    }
  this.noticeService.showIonicAlert("该设备没有硬件支持，不能扫描RFID码！");
}

  scanRFID(){
     let loading=this.loadingCtrl.create({
      spinner:'bubbles',
      content:'正在读取RFID码，请稍后！',
      duration:10000
    });
     loading.present();

    ReadRFID.connect((success)=>{
      ReadRFID.start((success)=>{
        var rfid=success;
        alert(rfid);
        if(rfid==""){
          return;
        }
        this.platform.ready().then(()=>{
          this.assetService.queryAssetFromFixedByRFID(rfid).then((fixedAsset)=>{
            if(fixedAsset==null){
              this.showAlert("查询资产失败,请确认二维码是否正确！");
              return;
            }
            this.assetService.queryAssetFromInvByIdAndNoticeId(fixedAsset.assetId,this.invNotice.noticeId).then((invAsset)=>{
              this.navCtrl.push("InvAssetMessagePage",{
                fixedAsset:fixedAsset,
                invAsset:invAsset,
                invNoticeId:this.invNotice.noticeId
              })
            })
          })
        })
        ReadRFID.disconnect();
        ReadRFID.release();
        loading.dismiss();
      },(error)=>{
        this.showAlert("启动失败"+error)
      })
    },(err)=>{
      this.showAlert("连接失败"+err);
    });
  }

  //进入手写签名页面
  // signature(){
  //   this.navCtrl.push("SignaturePage",{
  //     transNoticeId:this.transNoticeId,
  //     workerType:this.workerType,
  //     workerNumber:this.workerNumber,
  //     data:this.dataTable
  //   });
  // }


  //下拉刷新
  // doRefresh(refresher){
  //   setTimeout(()=>{
  //   this.assetService.queryAssetsFormFixedByPage(this.pageSize,this.pageIndex,this.workerNumber).then(data=>{
  //    for(var i=0;i<data.length;i++){
  //      this.dataTable.push(data[i]);
  //    }
  //     this.pageIndex++;
  //   })
  //   refresher.complete();
  //   },1000);
  // }

  //  init(){
  //   this.assetService.queryAssetsFormFixedByPage(this.pageSize,this.pageIndex,this.workerNumber).then(data=>{
  //    for(var i=0;i<data.length;i++){
  //      this.dataTable.push(data[i]);
  //    }
  //     this.pageIndex++;
  //   })
  //   // this.dataTable=new Array<FixedAsset>();
  //   // for(var i=1;i<=this.pageIndex;i++){
  //   //   this.assetService.queryAssetsFormFixedByPage(this.pageSize,i,this.workerNumber).then((data)=>{
  //   //     for(var j=0;j<data.length;j++){
  //   //       this.dataTable.push(data[j]);
  //   //     }
  //   //   })
  //   // }
  // }




  //  上拉加载向服务获取数据
  doInfinite(infiniteScroll:InfiniteScroll){
    setTimeout(()=>{
    this.assetService.queryAssetsFormFixedByPage(this.pageSize,this.pageIndex,this.workerNumber).then((newData)=>{
      for(var i=0;i<newData.length;i++){
        this.dataTable.push(newData[i]);
      }
      this.pageIndex++;
      infiniteScroll.complete();
    })
    },500);
  }

}