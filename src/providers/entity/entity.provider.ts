//资产盘点记录表对应类
export class InvAsset{
    assetId;
    noticeId;    //不进行读取
    useState;
    techStatus;
    installLocation="";
    securityState;
    useOrg;
    handleScrapMode;
    handleDate;
    handleReason;
    timeStamp;   //不进行读取
    manager;
    workerNumber;
    assetName;
    assetType;
    invRecordId;  
    securityStateDesc;
    useOrgName;
    profitLoss;
    profitLossCause;
    isSignatured;   //是否签名   0未签名，未确认；1未签名，已确认；2已签名，已确认
    remark;
    photoPath;
    signaturePath;
    signature;   //signature的名字
    preWorkerNumber;  //记录原来是属于谁的，如果保管人不变则和workerNumber一样


    constructor(){
      this.installLocation="";

    }
}


export class FixedAsset{
    assetId;          //主键
	  assetName;        //资产名称
	  assetType;        //资产类型
	  assetCategory;    //资产类别
	  assetClass;       //资产分类
	  specModel;        //规格型号
	  licenseplatWellno;//车牌井号
	  workForOrg;       //所属单位
	  workInOrg;        //所在单位
	  subordinateBlock; //所属区块
    productionTime;   //投产时间
  	techStatus;       //技术状况
	  useState;         //使用状况
	  manufactureDate;    //出产日期
  	increaseDate;       //增加日期
	  increaseReason;     //增加原因
  	unit;               //计量单位
	  quantity;           //附件数量
	  yardStatus;         //贴码状态      贴码状态怎么标识   目前0未贴，1贴了
	  assetGroup;         //资产组
	  remainingLife;      //尚可使用月数
    netWorth;           //净值
    workerNumber;       //员工编号
    custodian;          //使用（保管）人
	  installLocation;    //安装地点
	  remark;             //备注
	  twoDimensionCode;   //二维码
	  rfid;               //RFID码
    recordFlag;         //删除标志      怎么标识   目前0未删，1删了
    isChecked;          //标志位，是否被盘点 ，0未签名，未确认；1未签名，已确认；2已签名，已确认
    isTrans;            //标志位，是否被转产，0为转产，1代签字，2转产完成
    selfNumber;         //自编码
    assetCode;          //资产编码
    originalValue;      //资产原值
    singleQuantity;     //单台数量
    complexQuantity;    //复合数量
    certificateNumber;  //产权证号
    securityState;      //安全状况
    changeCustodian="";    //修改后的保管人
    changeWorkerNumber=""; //修改后的员工编号
    manufacturer;       //生产厂家
    serialNumber;      //出厂编号  
    fundChannel;       //资金渠道
}

export class User{
  userId;        //用户ID
  userName;      //用户姓名
  gender;        //性别
  age;           //年龄  int型，0是男，1是女
  workerNumber;   //员工编号
  workForOrg;     //所属机构
  wFOAddress;     //所属机构中文名 
  workInOrg;      //所在机构
  wIOAddress;     //所在机构中文名
  telePhone;      //座机号
  callPhone;      //手机号
  eMail;          //邮箱
  nationatily;    //国家
  nativePlace;    //所在地址
  education;      //学历
  profession;     //专业
  job;            //工作
  presentAddress; //现居地
  remark;         //备注
}

/**
 * 账户对象
 */
export class UserAccount{
  userId;         //登陆ID
  loginName;       //登录账号
  loginPWD;        //登录密码
  acctStatus;      //账户状态，是否锁定
  workerNumber;    //员工编号
}

/**
 * 账户对象
 */
export class OrgInfo{
  orgId;        //主键
	orgFullName;  //机构名称
	orgCode;      //机构编码
	orgName;      //机构简称
	parentOrgId;  //父机构
	recordFlag;   //逻辑删除标识
}

/**
 * 简单用户表
 * 为了方便后续根据员工编号查询员工数据
 */
export class UserSimple{
  userName;      //用户名
  workerNumber;  //员工编号
  workInOrg;     //所在单位编码
  userId;   //用户ID
}

/**
 * 盘点通知
 */
export class InvNotice{
  noticeId;    //通知ID
	title;       //标题
	content;     //内容
	leadingOrg;  //主导单位
	initiator;   //发起人
	timeStart;     //开始时间
  timeFinish;    //结束时间
  state;       //状态 ISSUED/FINISH
}

/**
 * 日志表
 */

export class ChangeRecord{
  assetId;       //资产ID
	changeType;    //变更类型
	changeDetail;  //转产凭证、资产附件、转产照片、盘点
	dutyOrg;       //责任单位
	changePerson;  //变更人
  changeTime;    //变更时间
  state;         //记录状态，用于是否要像服务器上传数据，ENABLE/DISABLE
}