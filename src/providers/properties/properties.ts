/*
  配置一些常用的参数
*/
export class Properties {
  //数据库配置
  static dbConfig = {
    version: 1.0,           //当前版本号  （上次版本号 1.0）
    name: "gasaam.db",      //数据库名称
    location: "default",     //数据库位置
  }

  static webConfig={
    //本地
    //address:"http://10.88.133.45",
    //测试环境
    // address:"http://11.10.97.76",
    //正式环境
    address:"http://10.89.128.4",
    port:8080+"",
    project:"eaam-app",

    //mas接口
    // address:"https://119.4.40.57",
    // port:10443+"",
    // project:"cqzcfzmasin/10000015/public/eaam-app",
  }


  static webConfigDefault={
    //本地
    //address:"http://10.88.133.45",
    //测试环境
    // address:"http://11.10.97.76",
    //正式环境
    address:"http://10.89.128.4",
    port:8080+"",
    project:"eaam-app",

    //mas接口
    // address:"https://119.4.40.57",
    // port:10443+"",
    // project:"cqzcfzmasin/10000015/public/eaam-app",
  }

  /**
   * 文件上传地址
   */
  static fileUploadURL="http://11.10.97.76:8080/eaam-app";
  //static fileUploadURL="http://10.88.133.45:8080/eaam-app";

  static apkDownloadURL="http://11.10.97.76:8080/eaam-app/resources/apk/demo_signed.apk"

}
