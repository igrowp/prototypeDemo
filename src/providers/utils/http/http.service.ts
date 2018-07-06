import { HttpUtils } from './../httpUtils';

/**
 * name:http服务
 * describe:对http请求做统一处理
 */
import {Injectable}    from '@angular/core';
import {Http, Headers,RequestOptions}   from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
import { NoticeService } from '../../service/notice.service';
 
@Injectable()
export class HttpService {
 
  constructor(private http: Http,
            private noticeService:NoticeService) {
  }

  private baseUrl(){
    return HttpUtils.getUrlFromProperties()
  }
  


  get(url:string,params={},timeout:number=30000):Promise<any>{
      if(url[0]!='/'){
        url='/'+url
      }
      return new Promise((resolve,reject)=>{
        this.http.get(this.baseUrl()+url,{params:params})
        .timeout(timeout)
        .map(res => res.json())
        .toPromise()
        .then((res)=>{
          if(res.status=='ok'){
            resolve(res.body)
          }else{
            this.noticeService.showToast(res.info)
            reject(res.info)
          }
        })
        .catch((error)=>{
          let msg=this.handleError(error)
          reject(msg)
        })

      })
      
  }

  /**
   * post请求
   * @param url 接口地址
   * @param params 参数
   * @returns {Promise<R>|Promise<U>}
   */
  public post(url: string, params: any={},timeout:number=30000):Promise<any> {
    if(url[0]!='/'){
      url='/'+url
    }

    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({
      headers: headers
    })
    
    return new Promise((resolve,reject)=>{
      this.http.post(this.baseUrl+url, HttpUtils.toQueryString(params),options)
      .timeout(timeout)
      .map(res => res.json())
      .toPromise()
      .then((res)=>{
        if(res.status=='ok'){
          resolve(res.body)
        }else{
          this.noticeService.showToast(res.info)
          reject(res.info)
        }
      })
      .catch((error)=>{
        let msg=this.handleError(error)
        reject(msg)
      })

    })
  }


  private handleSuccess(res){
    if(res.status="ok"){
      return "成功"
    }else{
      return "失败"
    }
  }



  /**
   * 处理请求错误
   * @param error
   * @returns {void|Promise<string>|Promise<T>|any}
   */
  private handleError(error){
    console.log(error);
    let msg = '请求失败';
    if(error.status==0){
      msg='访问被拒绝';
    }else if (error.status == 400) {
      msg='请求参数正确';
    }else if (error.status == 404) {
      msg='请检查路径是否正确404';
    }else if (error.status == 500) {
      msg='请求的服务器错误500';
    }else{
      
    }
    this.noticeService.showToast(msg)
    return msg
  }
}