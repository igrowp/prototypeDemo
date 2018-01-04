/**
 * 非安设备转产通知单
 */
export class CvtNonNotice{
    noticeId:string;         //通知单主键
    investplanId:string;     //计划表主键
    orgName:string;          //用料单位
    workOrderNumber:string;  //发料单号
    recipient:string;        //领料人
    storeroomKeeper:string;         //库房保管员
    noticeState:string;      //通知单状态
    recordFlag:number=0;   //逻辑删除标志
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
	recordFlag:number=0;   //逻辑删除标志
	isChecked:boolean=false;  //用于在发放时判断是否勾选
	receiveName;  //领用人姓名
	signaturePath; //签名文件路径
	signatureName; //签名文件名称
}
/**
 * 非安设备转产验收
 */
export class CvtNonCheck{
    checkId;       //主键
	investplanId;  //计划表主键
	receiveId;     //领用表主键
	checkBillNum;  //验收申请单号
	checkOrg;      //验收单位
	checkDate;     //验收日期
	checkPerson;   //责任人
    checkLeader;   //验收单位负责人
	checkOpinion;  //验收单位意见
	checkState;    //验收状态
	assetId;       //资产台账主键
	fundChannel;   //资金渠道
	assetCode;     //资金渠道
	assetName;     //资产名称
	specModel;     //规格型号
	selfNumber;    //自编码
	manufacturer;  //制造单位
	manufactureDate; //出厂日期
	workInOrg;     //使用单位
	serialNumber;  //出厂编号
	unit;    //计量单位
	quantity;      //数量
	originalValue; //资产原值
	isReadyForUse; //是否达到预定使用状态
	componentToolDesc; //随机部件/工具
	technicalData; //技术资料
	recordFlag:number=0;    //逻辑删除标志
}
