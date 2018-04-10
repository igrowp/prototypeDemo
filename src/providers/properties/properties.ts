/*
  配置一些常用的参数
*/
export class Properties {
  //应用基本信息
  static APP_VERSION_NUMBER=1.0;
  //数据库配置
  static dbConfig = {
    version: 1.0,           //当前版本号  （上次版本号 1.0）
    name: "gasaam.db",      //数据库名称
    location: "default",     //数据库位置
  }

  static webConfig={
    //address:"http://10.88.133.45",
    address:"http://11.10.97.76",
    port:8080+"",
    project:"eaam-app",

    //mas接口
    // address:"http://10.89.3.216",
    // port:9091+"",
    // project:"10000015/public/eaam-app",

    //本地https接口
    // address:"https://10.88.133.45",
    // port:8443+"",
    // project:"eaam-app",
  }


  static webConfigDefault={
    //address:"http://10.88.133.45",
    address:"http://11.10.97.76",
    port:8080+"",
    project:"eaam-app",

    //mas接口
    // address:"http://10.89.3.216",
    // port:9091+"",
    // project:"10000015/public/eaam-app",
    
     //本地https接口
    // address:"https://10.88.133.45",
    // port:8443+"",
    // project:"eaam-app",
  }

  /**
   * 文件上传地址
   */
  static fileUploadURL="http://11.10.97.76:8080/eaam-app";
  //static fileUploadURL="http://10.88.133.45:8080/eaam-app";

  static apkDownloadURL="http://10.88.133.45:8080/eaam-app/resources/apk/demo_signed.apk"

}
