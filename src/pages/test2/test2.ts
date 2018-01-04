import { InvService } from './../../providers/service/inv.service';
import { OrgInfo, UserSimple } from './../../providers/entity/entity.provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
/**
 * Generated class for the Test2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test2',
  templateUrl: 'test2.html',
  
})
export class Test2Page {
  useOrgName:any;
  orgInfo:Array<OrgInfo>=null;   //备份，查询后保存到这个列表中
  userList:Array<UserSimple>=null; //备份，管理员
  items:any=null;     //用于搜索查询用

  public type:string;    //搜索类型，有两种，查询管理员："MANAGER",查询组织机构："ORGANIZATION"

  constructor(
    public viewCtrl:ViewController,
    public navCtrl: NavController,
    private InvService:InvService,
              public navParams: NavParams,) {
    if(this.navParams.data){
      this.type=this.navParams.data.type;
    }
    switch(this.type){
      case "MANAGER":
      this.InvService.queryListFromUserSimple().then((data)=>{
        this.userList=data;
      },(error)=>{
        alert(error);
      });
      break;
      case "ORGANIZATION":
      this.InvService.queryListFromOrgInfo().then((data)=>{
        this.orgInfo=data;
        this.items=data;
      },(error)=>{
        alert(error);
      });
      break;

      default:
      break;
    }
  }
  

  /**
   * 搜索功能
   * @param ev 
   */
  filterItems(ev: any) {
    let val = ev.target.value;
    switch(this.type){
      case "MANAGER":
      if(val){
        //点击叉号后val为undefined，不会执行里面的方法
        this.items=this.userList.filter(function(item){
          let name=item.userName.includes(val);
          // let workerNumber=item.workerNumber.includes("0044");      //防止重名，用员工编号查
          return name;
        })
      }
      break;

      case "ORGANIZATION":
      if(val==undefined){
        this.items=this.orgInfo;
      }else{
        this.items=this.orgInfo.filter(function(item){
          return item.orgName.includes(val);
        })
      }
      break;


      default:

      break;
    }
  }
  
  /**
   * 点击某一项后关闭并退出
   * @param item 
   */
  close(item){
    this.viewCtrl.dismiss(item);
  }

}
