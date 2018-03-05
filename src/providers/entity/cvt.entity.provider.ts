/**
 * 非安设备转产通知单
 */
export class CvtNonNotice{
    noticeId:string;         //通知单主键
    investplanId:string;     //计划表主键
    orgName:string;          //用料单位
    workOrderNumber:string;  //发料单号
    recipient:string;        //领料人员工编号
    recipientName:string;        //领料人名称
    storeroomKeeper:string;         //库房保管员
    noticeState:string;      //通知单状态
	recordFlag:number=0;   //逻辑删除标志
	createTime;  //制单日期
	docNumber;  //计划文号
}

/**
 * 非安设备转产通知单详情
 */
export class CvtNonNoticeSub {
	subNoticeId;  //通知单主键
    noticeId;     //发放通知单主键
    purchasingId; //采购表主键
    materialCode; //物资编码
    assetName; //物资名称
    specModel;  //规格型号
    unit;  //计量单位
    sentQuantity; //实发数量
    price;  //单价
    amount; //金额
    storageDate;  //入库时间
	outDate;   //出库时间
	recordFlag:number=0;  //逻辑删除标志
	residualQuantity;  //剩余数量
	quantity;    //记录每次进入界面时的数量，用于计算已选数量
}
interface a{

}



/**
 * 非安资产领用    
 */
export class CvtNonReceive {
	receiveId;  //主键
	noticeId;   //通知单主键
	assetId;    //资产台账主键
	assetCode;  //资产编码
	assetName;  //资产名称
	specModel;  //规格型号
	receiveOrg; //领用单位
	receivePerson;  //领用人员工编号
	receiveTime;  //领用时间
	reveiveStyle; //领用方式
	recordFlag:number=0;   //逻辑删除标志  0代表未分发，1代表已经分发,2代表已同步
	isChecked:boolean=false;  //用于在发放时判断是否勾选
	receiveName;  //领用人姓名
	signaturePath; //签名文件路径
	signatureName; //签名文件名称
}

