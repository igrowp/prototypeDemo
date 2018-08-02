This is a starter template for [Ionic](http://ionicframework.com/docs/) projects.

## How to use this template

*This template does not work on its own*. The shared files for each starter are found in the [ionic2-app-base repo](https://github.com/ionic-team/ionic2-app-base).

To use this template, either create a new ionic project using the ionic node.js utility, or copy the files from this repository into the [Starter App Base](https://github.com/ionic-team/ionic2-app-base).

### With the Ionic CLI:

Take the name after `ionic2-starter-`, and that is the name of the template to be used when using the `ionic start` command below:

```bash
$ sudo npm install -g ionic cordova
$ ionic start myTabs tabs
```asdf

Then, to run it, cd into `myTabs` and run:

```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

Substitute ios for android if not on a Mac.

项目整体结构（src目录下）
/app
    /app.scss  定义了一些公共的样式
    /app.component.ts 定义了进入app时初始的操作以及单点登录进入
/pages   各个页面
    /change-allo  调拨申请
    /change-asset-state  资产属性变更
    /change-custodian  资产责任人变更
    /change-idle  闲置申请
    /change-scrap  报废申请
    /change-select-assets  选择资产页面
    /convert   转产页面
    /convert-list   转产列表（多个转产申请时）
    /convert-non-detail 转产明细
    /granting  资产发放页面
    /granting-bind 资产发放绑定页面
    /home   主页
    /inv-asset-message  盘点资产详细页
    /inventory    资产盘点列表页
    /login    登录页面
    /my-asset  我的资产页面
    /my-asset-message 我的资产详情页
    /popup  起始加载数据页面
    /process  流程列表页面
    /process-approve 流程审批页面
    /process-asset-message 资产信息页面
    /process-chg-approve 资产变更（责任人/资产属性）审批页面
    /process-chg-detail 资产变更（责任人/资产属性）申请详情页
    /process-detail 流程审批详情页
    /scanRFID  扫描RFID页面
    /setting  设置页（未用）
    /signature   手写签名页
    /tabs      底部标签页（未用）  


/providers   提供数据服务
    /entity  各种类的定义（类似于java中的bean）
    /properties  配置文件
    /service  处理各种数据操作
    /storage  存储到手机数据库中的方法（sql定义位置）
    /utils    一些工具方法定义位置
    /web      与后台交互的方法（http访问后台）





项目中考虑了app更新（西南油气田中自带升级，所以没有使用，pad版会用）
      考虑了数据库版本升级（并未使用）



