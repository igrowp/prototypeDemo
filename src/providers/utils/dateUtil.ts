export class dateUtil {
    static getCurrentDate(format = 'yyyy-MM-dd') {
        var date = new Date()
        var year = date.getFullYear()+""
        var month = date.getMonth() + 1
        var day = date.getDate()
        if (format.indexOf('yyyy') != -1) {
            format = format.replace('yyyy', year)
        }
        if (format.indexOf('MM') != -1) {
            format = format.replace('MM', this.getFormatDate(month))
        }
        if (format.indexOf('dd') != -1) {
            format = format.replace('dd', this.getFormatDate(day))
        }
        return format
    }


    // 日期月份/天的显示，如果是1位数，则在前面加上'0'
    static getFormatDate(arg) {
        if (arg == undefined || arg == '') {
            return ''
        }
        var re = arg + ''
        if (re.length < 2 || re.length == 0) {
            re = '0' + re
        }
        return re
    }
}