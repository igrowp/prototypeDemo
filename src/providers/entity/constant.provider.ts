export class PubConstant{

	//上传方式
	/**
	 * 图片上传方式-base64
	 */
	static UPLOAD_TYPE_BASE64=0;
	/**
	 * 图片上传方式-blob
	 */
	static UPLOAD_TYPE_BLOB=1;


	//工作流驳回状态
	/**
	 * 工作流
	 * 驳回到申请者
	 */
	static WORKFLOW_REJECT_TO_APPLICANT="APPLICATE";
	/**
	 * 工作流
	 * 驳回到上一个审批人
	 */
	static WORKFLOW_REJECT_TO_PREVIOUS="PREVIOUS";


	//本地存储字段
	/**
	 * 同步时间(value:string)
	 * yyyy-MM-dd HH-mm-ss
	 */
	static LOCAL_STORAGE_KEY_SYNCHRO_TIME="synchroTime";
	/**
	 * 是否登陆(value:boolean) 
	 * value="true"/"false"
	 */
	static LOCAL_STORAGE_KEY_SIGN_IN="signIn";
	/**
	 * 是否记住密码 
	 * value="true"/"false"
	 */
	static LOCAL_STORAGE_KEY_IS_REMEMBER="isRemember";
	/**
	 * 账号(value:string)
	 */
	static LOCAL_STORAGE_KEY_ACCOUNT="account";
	/**
	 * 密码
	 */
	static LOCAL_STORAGE_KEY_PASSWORD="password";
	/**
	 * 同步时间
	 */
	static LOCAL_STORAGE_KEY_WORKER_NUMBER="workerNumber";
	/**
	 * 所属单位
	 */
	static LOCAL_STORAGE_KEY_WORK_FOR_ORG="workForOrg";
	/**
	 * 所属单位中文名称
	 */
	static LOCAL_STORAGE_KEY_WFO_ADDRESS="wFOAddress";
	/**
	 * 姓名
	 */
	static LOCAL_STORAGE_KEY_USER_NAME="userName";
	/**
	 * 所在单位
	 */
	static LOCAL_STORAGE_KEY_WORK_IN_ORG="workInOrg";
	/**
	 * 员工编号
	 */
	static LOCAL_STORAGE_KEY_USER_ID="userId";
	/**
	 * 服务器地址（如：http://11.10.97.76）
	 */
	static LOCAL_STORAGE_KEY_URL_ADDRESS="urlAddress";
	/**
	 * 服务器端口
	 */
	static LOCAL_STORAGE_KEY_URL_PORT="urlPort";
	/**
	 * 默认签名路径
	 */
	static LOCAL_STORAGE_KEY_DEFAULT_SIGNATURE_PATH="default-signature-path";
	/**
	 * 默认签名文件名
	 */
	static LOCAL_STORAGE_KEY_DEFAULT_SIGNATURE_NAME="default-signature-name";
	/**
	 * 上次数据下载时间
	 */
	static LOCAL_STORAGE_KEY_LAST_REQUEST_TIME="lastRequestTime";





	//日志表类型
	/**
	 * 领用
	 */
	static CHANGE_RECORD_TYPE_CONVERT="CONVERT";
	/**
	 * 发放
	 */
	static CHANGE_RECORD_TYPE_GRANTING="GRANTING";
	/**
	 * 盘点
	 */
	static CHANGE_RECORD_TYPE_INVENTORY="INVENTORY";


	///附件表类型
	/**
	 * 转产-资产保管人签名的附件类型
	 */
	static ATTACHMENT_TYPE_SIGNATURE_CVT_RECEIVER2="SIGNATURE_CVT_RECEIVER2";
	/**
	 * 转产-第一级领用人领用时签名的附件类型
	 */
	static ATTACHMENT_TYPE_SIGNATURE_CVT_RECEIVER="SIGNATURE_CVT_RECEIVER";
	/**
	 * 盘点时签名保存的附件类型
	 */
	static ATTACHMENT_TYPE_SIGNATURE_INV="SIGNATURE_INV";
	/**
	 * 盘点时图片保存的的附件类型
	 */
	static ATTACHMENT_TYPE_IMG_INV="IMG_INV";
	/**
	 * 闲置时的附件类型
	 */
	static ATTACHMENT_TYPE_IMG_IDLE="IMG_IDLE";
	/**
	 * 资产图片的附件类型
	 */
	static ATTACHMENT_TYPE_IMG_ASSET="IMG_ASSET";
	
	//更改责任人/资产状态审批状态
	/**
	 * 已申请
	 */
	static CHG_STATE_INAPPROVAL = "INAPPROVAL";
	/**
	 * 初次审核通过
	 */
	static CHG_STATE_FIRSTPASS = "FIRSTPASS";
	/**
	 * 初次审核驳回
	 */
	static CHG_STATE_FIRSTREJECT = "FIRSTREJECT";
	/**
	 * 最终审核通过
	 */
	static CHG_STATE_LASTPASS = "LASTPASS";
	/**
	 * 最终审核驳回
	 */
	static CHG_STATE_LASTREJECT = "LASTREJECT";


	//非安转产通知单状态
	/**
	 * 已接收
	 */
	static CVT_NON_NOTICE_STATE_RECEIVED="RECEIVED";
	/**
	 * 已完成
	 */
	static CVT_NON_NOTICE_STATE_COMPLETED="PASS";
	/**
	 * 非安转产验收单状态
	 * 已保存
	 */
	static CVT_NON_CHECK_STATE_SAVED="SAVED";

	//数据字典类型
	/**
	 * 使用状况
	 */
	static DICT_TYPE_USE_STATE="20";
	/**
	 * 技术状况
	 */
	static DICT_TYPE_TECH_STATE="21";
	/**
	 * 安全现状
	 */
	static DICT_TYPE_SECURITY_STATE="26";

	//数据字典名字
	/**
	 * 闲置
	 * 使用状况->闲置
	 */
	static DICT_SUB_TYPE_IDLE='0204';
	/**
	 * 报废
	 * 技术状况->报废
	 */
	static DICT_SUB_TYPE_SCRAP='99';
	


	//闲置/报废通知单状态
	/**
	 * 未提交
	 * value = 0
	 */
	static APPLY_STATE_UNSUBMIT='SAVED';
	/**
	 * 已提交
	 * value = 1
	 */
	static APPLY_STATE_SUBMIT='INAPPROVAL';
	/**
	 * 通过
	 * value = 2
	 */
	static APPLY_STATE_ADOPT='PASS';
	/**
	 * 驳回
	 * value = 3
	 */
	static APPLY_STATE_REJECT='REJECT';
	/**
	 * 没有状态
	 * value = -1
	 */
	static APPLY_STATE_NULL='-1';



	/**
	 * 设置http请求的超时时间(短)
	 */
	static HTTP_TIME_OUT_SHORT=5000;
	/**
	 * 设置http请求的超时时间(长)
	 */
	static HTTP_TIME_OUT_LONG=10000;

}

