import { FixedAsset } from './../../providers/entity/entity.provider';
import { AssetService } from './../../providers/service/asset.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Component } from '@angular/core';
import { AlertController, InfiniteScroll, IonicPage, NavController, LoadingController,NavParams, Platform } from 'ionic-angular';
import { ChangeDetectorRef } from '@angular/core';

/**
 * 我的资产页面
 */

@IonicPage()
@Component({
  selector: 'page-my-asset',
  templateUrl: 'my-asset.html',
})
export class MyAssetPage {


  public dataTable:Array<FixedAsset>=new Array<FixedAsset>();
  private pageIndex:number;
  private pageSize=20;
  private workerNumber="";
  public isHaveData;   //判断是否有数据

  constructor(public navCtrl: NavController,
            private alertCtrl:AlertController,
          private platform:Platform,
          private barcodeScanner:BarcodeScanner,
          private cd:ChangeDetectorRef,
          private loadingCtrl:LoadingController,
          private navParams:NavParams,
          private assetService:AssetService
        ) {
          this.pageIndex=1;
          this.workerNumber=this.navParams.get("workerNumber");
  }


  ionViewDidEnter(){
    // let loading=this.loadingCtrl.create({
    //   spinner:'bubbles',
    //   content:'正在加载中，请稍候！',
    //   duration:10000
    // });
    //  loading.present();

     this.pageIndex=1;
     this.dataTable=new Array<FixedAsset>();
    this.assetService.queryAssetsFormFixedByPage(this.pageSize,this.pageIndex,this.workerNumber).then((data)=>{
      for(var i=0;i<data.length;i++){
        this.dataTable.push(data[i]);
      }
      this.pageIndex++;
      // loading.dismiss();
      if(data.length==0){
        //说明没有数据
        this.isHaveData=false;
      }else{
        this.isHaveData=true;
      }
    })
  }

  //盘点
  scan(item){
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
          this.navCtrl.push("MyAssetMessagePage",{
               fixedAsset:fixedAsset
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
            this.navCtrl.push("MyAssetMessagePage",{
               fixedAsset:fixedAsset
            })
          })
      });
     });
    }
  }

  //重新绑定
  reBind(item,isBind){
    const alert=this.alertCtrl.create({
      title:'提示',
      message:'该资产已绑定二维码，是否重新绑定？',
      buttons:[
        {
          text:'取消',
          role:'cancel',
        },
        {
          text:'确定',
          handler:()=>{
            this.bind(item,isBind);
          }
        }
      ]
    });
    alert.present();
  }

  showAlert(msg:String){
    this.alertCtrl.create({
      title:"提醒",
      subTitle:msg+"",
      buttons:["确定"]
    }).present();
  }
////////////////搜索////////////////
  /**
   * 显示搜索窗体
   */
  doSearch(){
    let searchbar=document.getElementById("searchbar");
    if(searchbar.style.display=="none"){
      searchbar.style.display="inline";
    }
    else{
      searchbar.style.display="none";
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
      content:'正在加载中，请稍候！'
    });
     loading.present();
    // 重新刷新
    this.assetService.queryAssetsFormFixed(this.workerNumber,"-1").then((data)=>{
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
  
  bind(item,isBind){
    let id=item.assetId;
    let code="fffff";
    this.barcodeScanner.scan().then((data)=>{
        code=data.text;
        if(code!=""){
          this.assetService.queryAssetFromFixedByCode(code).then((data)=>{
            if(data!=null){
              this.showAlert("请求失败！已经存在该二维码，请重新选择!");
              return;
            }else{
              this.assetService.queryAssetFromFixedById(id).then((asset)=>{
                if(asset==null){
                  this.showAlert("不存在该资产，请确认资产编号！")
                  return;
                }
                if(asset.twoDimensionCode==""||asset.twoDimensionCode==null){
                  asset.twoDimensionCode=code;
                  this.assetService.updateToFixed(asset).then((data)=>{
                    //判断资产清点记录中是否有该资产，有的话进行更新
                    this.showAlert("二维码绑定成功！");
                  })
                }else{
                  asset.twoDimensionCode=code;
                  this.assetService.updateToFixed(asset).then((data)=>{
                    //判断资产清点记录中是否有该资产，有的话进行更新
                    this.showAlert("二维码重新绑定成功！");
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
       
      if(isBind==false){   //对于新绑定的资产，绑定二维码后会重新刷新页面
        console.log("执行了false");
        //加载数据
        
    for(var i=1;i<=this.pageIndex;i++){
      this.assetService.queryAssetsFormFixedByPage(this.pageSize,i,this.workerNumber).then((data)=>{
        this.dataTable=new Array<FixedAsset>();
        for(var j=0;j<data.length;j++){
          this.dataTable.push(data[j]);
        }
      })
    }
        this.cd.detach();
      }
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
    })
    },500);
  }

  rfid(){
    this.showAlert("该设备没有硬件支持，不能扫描RFID码！");
  }
  

}
