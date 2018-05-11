import { NoticeService } from './../../providers/service/notice.service';
import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
declare let ReadRFID: any;
/**
 * Generated class for the ScanRFIDPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scanRFID',
  templateUrl: 'scanRFID.html',
})
export class ScanRFIDPage {
  private result="";
  constructor(private viewCtrl:ViewController,
    private noticeService:NoticeService,
  ) {
    setTimeout(()=>{
      // this.scanStart();  //测试
      this.scan();
    },200);
  }


  dismiss(){
    ReadRFID.disconnect((data) => {
    }, (error) => {
      this.noticeService.showIonicAlert("RFID断开连接异常");
    });
    ReadRFID.release((data) => {
    }, (err) => {
      this.noticeService.showIonicAlert("RFID释放资源异常");
    });
    let data = { result: this.result };
    this.viewCtrl.dismiss(data);
  }



  //扫描rfid——测试方法
  private scanStart() {
    ReadRFID.start((success) => {
      if(success){
        this.result=success;
      }else{
        this.result="";
        this.noticeService.showIonicAlert("扫描结果格式错误");
      }
      this.dismiss();
    }, (error) => {
      this.noticeService.showIonicAlert("扫描失败")
    })
  }


  //扫描rfid
  private scan(){
    ReadRFID.connect(()=>{
      ReadRFID.start((success)=>{
        if(success){
          this.result=success;
        }else{
          this.result="";
          this.noticeService.showIonicAlert("扫描结果格式错误");
        }
        this.dismiss();
      },(error)=>{
        this.noticeService.showIonicAlert("启动失败")
      })
    },(err)=>{
      this.noticeService.showIonicAlert("连接失败");
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
