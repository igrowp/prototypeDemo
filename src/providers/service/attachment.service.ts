import { Attachment } from './../entity/pub.entity';
import { PubDBProvider } from './../storage/pub.db.provider';
import { Injectable } from '@angular/core';
import { AttachmentWebProvider } from '../web/attachment.web.provider';

@Injectable()
export class AttachmentService {
    constructor(private attachmentWebProvider: AttachmentWebProvider,
                private pubDbProvider:PubDBProvider) {

    }


    /**
     * 将选择的图片上传或者保存到本地
     * @param recordId 主键ID
     * @param attachmentType 附件类型
     * @param workerNumber 员工编号
     * @param photoPaths 图片路径，字符串数组
     * @param uploadType 上传类型
     */
    uploadOrSavePhotos(assetId:string, attachmentType:string, workerNumber:string, photoPaths:Array<string>, uploadType:number){
        return new Promise((resolve,reject)=>{
            this.attachmentWebProvider.uploadFile(assetId,attachmentType,workerNumber,photoPaths,this.attachmentWebProvider.UploadType.BASE64).then((data)=>{
                //存储到本地
                if(data.result==false){
                    //上传失败
                    this.addNewestAttachment(assetId,attachmentType,workerNumber,photoPaths,0);
                }else{
                    this.addNewestAttachment(assetId,attachmentType,workerNumber,photoPaths,1);
                }
                resolve("提交成功");
            }, error => {
                //网络连接失败
                //存储到本地
                this.addNewestAttachment(assetId,attachmentType,workerNumber,photoPaths,0);
                resolve("提交成功");
            })
        })
    }


    /**
     * 同步附件表到服务器
     * @param attachments 
     */
    synchroAttachmentToServe(){
        return new Promise((resolve,reject)=>{
            this.getUnSynchroAttachments().then((attachments)=>{
                if(attachments.length==0||!attachments){
                    resolve("同步成功");
                }else{
                    let lastPath=attachments[attachments.length-1].storagePath;
                    for(let i=0;i<attachments.length;i++){
                        let attachment=attachments[i];
                        let photoPaths=new Array<string>();
                        photoPaths.push(attachment.storagePath);
                        this.attachmentWebProvider.uploadFile(attachment.assetId,attachment.attachmentType,attachment.workerNumber,photoPaths,this.attachmentWebProvider.UploadType.BASE64).then(()=>{
                            attachment.isUpload=1;
                            this.pubDbProvider.updateToAttachment(attachment);
                            if(attachment.storagePath==lastPath){
                                resolve("同步成功");
                            }
                        },error=>{
                            reject("上传文件失败，请检查网络问题")
                        })
                    }
                }
            },error=>{
                reject("获取附件表数据失败");
            })
        })
    }


    /**
     * 获取未同步的附件信息
     */
    getUnSynchroAttachments(){
        return this.pubDbProvider.queryFromAttachmentsByIsUpload(0);
    }

    /**
     * 获取附件表信息
     * @param assetId 
     * @param attachmentType 
     */
    getAttachments(assetId,attachmentType){
        return this.pubDbProvider.queryFromAttachments(assetId,attachmentType);
    }

    /**
     * 向附件表中添加最新的图片信息
     * @param assetId 
     * @param attachmentType 
     * @param workerNumber 
     * @param photoPaths 
     * @param isUpload 
     */
    private addNewestAttachment(assetId:string, attachmentType:string, workerNumber:string, photoPaths:Array<string>,isUpload:number){
        //存储到本地
        this.pubDbProvider.deleteFromAttachment(assetId, attachmentType).then((data) => {
            //插入附件信息
            for(let i=0;i<photoPaths.length;i++){
                let photoPath=photoPaths[i];
                let attachment = new Attachment();
                attachment.assetId = assetId;
                attachment.attachmentType = attachmentType;
                attachment.workerNumber=workerNumber;
                attachment.storagePath=photoPath;
                attachment.isUpload=isUpload;
                this.pubDbProvider.insertToAttachment(attachment);
            }
        })
    }




}