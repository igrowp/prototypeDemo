export class DateUtil {
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
}


