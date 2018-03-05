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
 * 报废
 */
export class Scrap{
    scrapId;   //主键
    assetId;   //资产主键
    scrapCategory; //报废类别
    unproductionTime;  //停产日期
    storageLocation;  //存放地点（安装地点）
    assetBrief;   //资产简况
    scrapReason;   //报废原因
    applyState:string;   //申请状态  0未提交，1审批中，2审批通过，3驳回
    recordFlag;    //删除标识
}


export class HttpResult{
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
    nextApprovalPersonName;  //下一个审批人
    nextApprovalPersonGroup;  //下一个审批人列表，与上面只能有一个存在
    nextStepName;  //下一个审批步骤
}

export class WorkflowBean{
    userName; //审批人
    outcome;  //审批结果  同意/驳回
    comment;  //审批意见
    taskId;   //流程ID
    nextApprovePerson;  //下一个审核人    //用于涉及到并行的情况，如果是单行的审批则值为""
    approveType;  //审批类型
}




