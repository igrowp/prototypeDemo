//数据字典
export class Dict{
    dictId:string;       //数据字典主键
    categoryCode:string; //编码分类
    categoryDesc:string; //分类描述
    recordFlag:number;   //逻辑删除标志
}

//数据字典明细
export class DictDetail{
    dictDetailId:string;  //数据字典明细主键
    categoryCode:string;  //编码分类
    dictCode:string;      //编码
    dictCodeDesc:string; //编码描述
    codeType:string;      //编码类型
    codeSize:string;      //编码大小
    remark:string;        //备注
    record_flag:number;   //逻辑删除标识
}

/**
 * 闲置
 */
export class Idle{
    idleId:string;  //主键
    assetId;        //资产id
    specModel;      //规格型号
    assetName;      //资产名称
    assetCode;      //资产编号
    installLocation;  //现存放地点
    oldInstallLocation; //停用前安装地点及位置
    stopReason;   //停用原因及目前保护措施
    assetDesc;    //资产现状描述
    testResult;   //检定结果
    testOrg;      //检定单位
    photoPath;    //照片路径
    applyState:string;   //申请状态  0未提交，1审批中，2审批通过，3驳回
    recordFlag;   //删除标识
}
/**
 * 闲置申请单
 */
export class IdleBill{
    appId;     //申请ID
    appTitle;  //申请标题
    appNo;     //申请单号
    appOrg;    //申请单位
    appDate;   //申请日期
    appPerson;    //申请人
}

/**
 * 报废
 */
export class Scrap{
    scrapId;   //主键
    assetId;   //资产主键
    specModel;      //规格型号
    assetName;      //资产名称
    assetCode;      //资产编号
    scrapCategory; //报废类别
    unproductionTime;  //停产日期
    storageLocation;  //存放地点（安装地点）
    assetBrief;   //资产简况
    scrapReason;   //报废原因
    applyState:string;   //申请状态  0未提交，1审批中，2审批通过，3驳回
    recordFlag;    //删除标识

    approveNumber; //批复文号
    approveDate;  //批复日期
    isHandle;     //是否处置
}

/**
 * 闲置申请单
 */
export class ScrapBill{
    applyId;     //申请ID
    appTitle;  //申请标题
    appNo;     //申请单号
    appOrg;    //申请单位
    appDate;   //申请日期
    appPerson;    //申请人
}

/**
 * post请求服务器传回的结果
 */
export class PostRequestResult{
    result:boolean;  //结果  true:成功  , false:失败
    applyState:string;    //申请单状态, 详情见常量类

}

/**
 * 工作流事件信息
 */
export class TodoEvent{
    eventType;  //审批类型（如发放通知单审批）
    eventName;  //审批名称
    eventPerson;//发起人
    eventDate;  //发起时间
    eventId;    //业务ID，即通知单ID
    loginName;
    taskId;     //工作流任务ID
    eventOrg;   //通知单作用单位
}

/**
 * 下一步审批人信息
 */
export class NextStepApprover{
    processInstanceId;  //流程实例ID  格式：nodeID_姓名|员工编号  例如"sid-73BD84F3-E8DA-49FD-98BF-8A2D55B0EFEC_王宇|80420935"
    approverName; //审批人姓名
}

/**
 * 下一步审批信息
 */
export class NextStepInfo{
    nodeId;  //节点ID
    nextStepName;  //下一步审批名称
    nextStepApprovers:Array<NextStepApprover>;
}

/**
 * 提交审批结果的Bean参数
 */
export class WorkflowBean{
    workerNumber; //审批人员工编号
    outcome;  //审批结果  同意/驳回
    comment;  //审批意见
    taskId;   //流程ID
    rejectTo; //驳回到
    nextStepApprovers;  //下一个审核人    //用于涉及到并行的情况，如果是单行的审批则值为""
    approveType;  //审批类型
}

/**
 * 资产调拨申请单
 */
export class AllocateBill{
    allocateId; //申请单Id
    allocateType; //申请单类型（气矿内部调拨、作业区内部调动、分公司调入气矿、气矿调入分公司）
    appNo;     //申请单号
    appOrg;    //申请单位
    agent;    //申请人员工编号
    appDate;   //申请日期
    appOutOrg; //调出单位
    appInOrg;  //调入单位
    appPerson; //申请人姓名
}

/**
 * 资产处置申请单
 */
export class HandleBill{
    applyId; //申请单Id
    handleCategory; //申请单类型
    appNo;     //申请单号
    appOrg;    //申请单位
    userId;   //申请人员工编号
    appDate;   //申请日期
    appTitle;  //申请单标题
    appPerson; //申请人姓名
}

/**
 * 简单资产信息
 */
export class Asset{
    assetCode;  //资产编码
    assetId;  //资产ID
    assetName;  //资产名称
    selfNumber;  //自编码
    specModel;   //规格型号
}

/**
 * 手机版本信息
 */
export class AppInfo{
    appVersion;
    appRemark;
}

/**
 * 附件类
 */
export class Attachment{
    assetId;  //资产id
    workerNumber;   //员工编号
    attachmentType; //附件类型
    storagePath;  //存储路径
    isUpload;   //是否上传 0未上传，1已上传
}

export class AttachmentBase64{
    assetId;  //资产ID
    attachmentType; //图片类型
    base64;  //图片base64格式
}




/**
 * 资产责任人变更申请表
 */
export class AssetChgOwnerBill{
    chgId;          //申请单Id
    applicant;      //申请人员工编号
    applicantName;      //申请人姓名
    applyReason;    //申请原因
    applyTime;      //申请日期
    originalOwner;  //原责任人
    originalOwnerName;  //原责任人姓名
    auditor;        //第一级审批人
    auditorName;    //第一级审批人姓名
    auditorOpinion; //第一级审批人意见
    auditTime;    //第一级审批人时间
    finalAuditor;        //第二级审批人
    finalAuditorName;    //第二级审批人姓名
    finalAuditOpinion; //第二级审批人意见
    finalAuditTime;    //第二级审批人时间
    chgState;       //申请状态
    recordFlag;
}
/**
 * 资产属性变更申请表
 */
export class AssetChgPropertyBill{
    chgId;          //申请单Id
    applicant;      //申请人员工编号
    applicantName;      //申请人姓名
    applyReason;    //申请原因
    applyTime;      //申请日期
    auditor;        //第一级审批人
    auditorName;    //第一级审批人姓名
    auditorOpinion; //第一级审批人意见
    auditTime;    //第一级审批人时间
    finalAuditor;        //第二级审批人
    finalAuditorName;    //第二级审批人姓名
    finalAuditOpinion; //第二级审批人意见
    finalAuditTime;    //第二级审批人时间
    chgState;       //申请状态
    useState;       //使用状况
    techStatus;     //技术状况
    securityState;  //油气水井安全现状
    useStateDesc;       //使用状况
    techStatusDesc;     //技术状况
    securityStateDesc;  //油气水井安全现状
    recordFlag;
}






