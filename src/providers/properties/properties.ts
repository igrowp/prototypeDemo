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
    //address:"http://10.88.133.45",
    //address:"http://11.10.97.76",
    address:"http://192.168.1.33",
    port:8080+"",
    project:"eaam-app",
  }


  static webConfigDefault={
    address:"http://11.10.97.76",
    port:8080+"",
    project:"eaam-app",
  }

}
