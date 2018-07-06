import { HttpService } from './../utils/http/http.service';
import { PubConstant } from './../entity/constant.provider';
import { AppInfo } from './../entity/pub.entity';
import { Injectable } from '@angular/core';
/**
 * 公共的服务器数据请求
 */
@Injectable()
export class PubWebProvider {
  constructor(private httpService: HttpService) {
  }
  private baseUrl="/pub"
  
  /**
   * 从服务器获取最新的app版本信息
   */
  getRecentAppVersion():Promise<AppInfo>{
    return this.httpService.get(this.baseUrl + "/app/version", {},PubConstant.HTTP_TIME_OUT_SHORT)
  }

}