import { FixedAsset } from './../../providers/entity/entity.provider';
import { AssetService } from './../../providers/service/asset.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Component, ViewChild } from '@angular/core';
import { AlertController, InfiniteScroll, IonicPage, NavController, LoadingController, NavParams, Platform, FabContainer } from 'ionic-angular';
import { ChangeDetectorRef } from '@angular/core';
import { Content } from 'ionic-angular/components/content/content';
import { NoticeService } from '../../providers/service/notice.service';
declare let ReadRFID: any;

/**
 * 我的资产页面
 */

@IonicPage()
@Component({
  selector: 'page-my-asset',
  templateUrl: 'my-asset.html',
})
export class MyAssetPage {
  @ViewChild(Content) content:Content;


  public dataTable:Array<FixedAsset>=new Array<FixedAsset>();
  private pageIndex:number;
  private pageSize=20;
  private workerNumber="";
  private selectedIndex; //记录点击盘点的资产索引号

  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private noticeService:NoticeService,
    private barcodeScanner: BarcodeScanner,
    private cd: ChangeDetectorRef,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private assetService: AssetService
  ) {
    this.pageIndex = 1;
    this.workerNumber = this.navParams.get("workerNumber");
    this.dataTable = new Array<FixedAsset>();
    this.assetService.queryAssetsFormFixedByPage(this.pageSize, this.pageIndex, this.workerNumber).then((data) => {
      for (var i = 0; i < data.length; i++) {
        this.dataTable.push(data[i]);
      }
      this.pageIndex++;
      // loading.dismiss();
    })
  }


  ionViewDidEnter(){
    if (this.selectedIndex) {
      this.assetService.queryAssetFromFixedById(this.dataTable[this.selectedIndex].assetId).then((data) => {
        if (data) {
          this.dataTable[this.selectedIndex].isChecked = data.isChecked;
        }
      })
    }
  }

  //盘点
  scan(item){
    let id=item.assetId;
    let code=item.twoDimensionCode;  //应该是扫码获得的ID
    //没有二维码标签，直接进入资产信息页
    this.platform.ready().then(()=>{
      this.assetService.queryAssetFromFixedById(id).then((fixedAsset)=>{
        if(fixedAsset==null){
          this.noticeService.showIonicAlert("查询资产失败，不存在该资产");
          return;
        }
        this.navCtrl.push("MyAssetMessagePage",{
             fixedAsset:fixedAsset
        })
      })
    })
    // if(code==""||code==null){
    //   //没有二维码标签，直接进入资产信息页
    //   this.platform.ready().then(()=>{
    //     this.assetService.queryAssetFromFixedById(id).then((fixedAsset)=>{
    //       if(fixedAsset==null){
    //         this.noticeService.showIonicAlert("查询资产失败，不存在该资产");
    //         return;
    //       }
    //       this.navCtrl.push("MyAssetMessagePage",{
    //            fixedAsset:fixedAsset
    //       })
    //     })
    //   })
    // }else{
    //   this.barcodeScanner.scan().then((result)=>{
    //     code=result.text;
    //     if(code==""){
    //       return;
    //     }
    //     this.platform.ready().then(()=>{
    //       this.assetService.queryAssetFromFixedByIdAndCode(id,code).then((fixedAsset)=>{
    //         if(fixedAsset==null){
    //           this.noticeService.showIonicAlert("查询资产失败,请确认二维码是否正确");
    //           return;
    //         }
    //         this.navCtrl.push("MyAssetMessagePage",{
    //            fixedAsset:fixedAsset
    //         })
    //       })
    //   });
    //  });
    // }
  }

  //重新绑定
  reBind(item,i){
    const alert=this.alertCtrl.create({
      title:'提示',
      subTitle:'该资产已绑定二维码，是否重新绑定？',
      cssClass:'alert-conform',
      buttons:[
        {
          text:'取消',
          role:'cancel',
        },
        {
          text:'确定',
          handler:()=>{
            this.bind(item,i);
          }
        }
      ]
    });
    alert.present();
  }

  //重新绑定
  reBindRFID(item){
    const alert=this.alertCtrl.create({
      title:'提示',
      subTitle:'该资产已绑定RFID，是否重新绑定？',
      cssClass:'alert-conform',
      buttons:[
        {
          text:'取消',
          role:'cancel',
        },
        {
          text:'确定',
          handler:()=>{
            this.bindRFID(item);
          }
        }
      ]
    });
    alert.present();
  }

  bindRFID(item){
    let id=item.assetId;
    let code="fffff";
    let loading=this.loadingCtrl.create({
      content:"正在从服务器获取数据..."
    })
    loading.present();
    
    // ReadRFID.connect((success)=>{
      ReadRFID.start((success)=>{
        loading.dismiss();
        var code=success;
        if(code!=""){
          this.assetService.queryAssetFromFixedByRFID(code).then((data)=>{
            if(data!=null){
              this.noticeService.showIonicAlert("请求失败已经存在该RFID，请重新选择!");
              return;
            }else{
              this.assetService.queryAssetFromFixedById(id).then((asset)=>{
                if(asset==null){
                  this.noticeService.showIonicAlert("不存在该资产，请确认资产编号")
                  return;
                }
                if(asset.rfid==""||asset.rfid==null){
                  asset.rfid=code;
                  this.assetService.updateToFixed(asset).then((data)=>{
                    //判断资产清点记录中是否有该资产，有的话进行更新
                    this.noticeService.showIonicAlert("RFID绑定成功");
                  })
                }else{
                  asset.rfid=code;
                  this.assetService.updateToFixed(asset).then((data)=>{
                    //判断资产清点记录中是否有该资产，有的话进行更新
                    this.noticeService.showIonicAlert("RFID重新绑定成功");
                  })
                }
              })
            }
          });
        }else{
          //二维码为空
          return;
        }
        // ReadRFID.disconnect();
        // ReadRFID.release();
      },(error)=>{
        alert("启动失败"+error)
      })
    // },(err)=>{
    //   alert("连接失败"+err);
    // });
  }
////////////////搜索////////////////
  isHiddenSearch=true;
  /**
   * 显示搜索窗体
   */
  doSearch(){
    this.content.scrollToTop(0);
    if(this.content.scrollTop<50){
      //开闭
      this.isHiddenSearch=!this.isHiddenSearch;
    }else if(this.isHiddenSearch==true){
      this.isHiddenSearch=false;
    }
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
      content:'正在加载中，请稍候'
    });
     loading.present();
    // 重新刷新
    this.assetService.queryAssetsFromFixed(this.workerNumber).then((data)=>{
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

  ////////////////搜索END////////////////
  
  bind(item,index){
    this.selectedIndex=index;
    let id=item.assetId;
    let code="fffff";
    this.barcodeScanner.scan().then((data)=>{
        code=data.text;
        if(code!=""){
          this.assetService.queryAssetFromFixedByCode(code).then((data)=>{
            if(data!=null){
              this.noticeService.showIonicAlert("请求失败已经存在该二维码，请重新选择!");
              return;
            }else{
              this.assetService.queryAssetFromFixedById(id).then((asset)=>{
                if(asset==null){
                  this.noticeService.showIonicAlert("不存在该资产，请确认资产编号")
                  return;
                }
                if(asset.twoDimensionCode==""||asset.twoDimensionCode==null){
                  asset.twoDimensionCode=code;
                  this.assetService.updateToFixed(asset).then((data)=>{
                    //判断资产清点记录中是否有该资产，有的话进行更新
                    this.noticeService.showIonicAlert("二维码绑定成功");
                  })
                }else{
                  asset.twoDimensionCode=code;
                  this.assetService.updateToFixed(asset).then((data)=>{
                    //判断资产清点记录中是否有该资产，有的话进行更新
                    this.noticeService.showIonicAlert("二维码重新绑定成功");
                  })
                }
              })
            }
          });
        }else{
          //二维码为空
          return;
        }
        })
  }

   //  上拉加载向服务获取数据
  doInfinite(infiniteScroll:InfiniteScroll){
    setTimeout(()=>{
    this.assetService.queryAssetsFormFixedByPage(this.pageSize,this.pageIndex,this.workerNumber).then((newData)=>{
      for(var i=0;i<newData.length;i++){
        this.dataTable.push(newData[i]);
      }
      this.pageIndex++;
      infiniteScroll.complete();

      if(newData==null||newData.length<this.pageSize){
        infiniteScroll.enable(false);
      }
    })
    },500);
  }

  rfid(){
    this.noticeService.showIonicAlert("该设备没有硬件支持，不能扫描RFID码");
  }

  scanTwoDimensionCode(fab:FabContainer){
    if (fab != null) {
      setTimeout(() => {
        fab.close();
      }, 200);
    }
    this.barcodeScanner.scan().then((result) => {
      var code = result.text;
      if (code == "") {
        return;
      }
      this.platform.ready().then(() => {
        this.assetService.queryAssetFromFixedByCode(code).then((fixedAsset) => {
          if (fixedAsset == null) {
            this.noticeService.showIonicAlert("查询资产失败,请确认二维码是否正确");
            return;
          } else {
            this.navCtrl.push("MyAssetMessagePage", {
              fixedAsset: fixedAsset
            })
          }
        })
      });
    });
  }


}
