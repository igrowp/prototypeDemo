import { File,FileEntry } from "@ionic-native/file";

export class ConvertUtil{
    static file=new File();

    ///////////////时间转换方式///////////////
    /**
     * 将时间转化为YYYY-MM-DD
     * @param date 
     */
    static formatDate(date: Date) {
        // 格式化日期，获取今天的日期
        var year: number = date.getFullYear();
        var month: any = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        var day: any = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return year + '-' + month + '-' + day;
    };

    /**
     * 格式化时间为  YYYY-MM-DD hh:mm:ss
     * @param date 
     */
    static formatDateToHMS(date: Date) {
        // 格式化日期，获取今天的日期
        var year: number = date.getFullYear();
        var month: any = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        var day: any = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let h=(date.getHours()+8)%24;
        var hour:any= h < 10 ? '0' + h : h;
        var minutes:any= date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        var seconds:any= date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return year + '-' + month + '-' + day+" "+hour+":"+minutes+":"+seconds;
    };



    ////////文件格式转换方法/////////////////
    /**
     * blob to dataURL
     * @param blob 
     * @param callback 
     */
    static blobToDataURL(blob, callback) {
        var a = new FileReader();
        a.onload = function (e: any) { callback(e.target.result); }
        a.readAsDataURL(blob);
    }

    /**
     * Blob转canvas
     * @param blob 
     * @param cb 
     */
    static blobToCanvas(blob, cb) {
        this.blobToDataURL(blob, function (dataurl) {
            let canvas = <HTMLCanvasElement>document.getElementById("canvas-default");
            var ctx = canvas.getContext('2d');
            var img = new Image();
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                cb(canvas);
            };
            img.src = dataurl;
        });
    }




    /**
   * 通过本地文件路径返回base64编码
   * @param filePath 文件路径
   */
    static fileUrlToBase64(filePath: string) {
        return new Promise<string>((resolve, reject) => {
            if (!filePath.startsWith('file://')) {
                filePath = 'file://' + filePath;
            }
            this.file.resolveLocalFilesystemUrl(filePath).then(entry => {
                (<FileEntry>entry).file(file => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(file);
                });
            })
        })
    }
}