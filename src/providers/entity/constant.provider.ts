export class PubConstant{
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


	///签字类型
	/**
	 * 转产领用人签名的类型
	 */
	static SIGNATURE_TYPE_CVT_SIGNATURE="CVT_SIGNATURE";
	/**
	 * 转产保管人签名的类型
	 */
	static SIGNATURE_TYPE_CVT_RECEIVER="CVT_RECEIVER";
	/**
	 * 转产领用人签名的类型-未下发情况
	 */
	static SIGNATURE_TYPE_CVT_RECEIVER_NO_GRANTING="CVT_RECEIVER_NO_GRANTING";
	/**
	 * 盘点时的签名的类型
	 */
	static SIGNATURE_TYPE_INV_SIGNATURE="INV_SIGNATURE";



	//非安转产通知单状态
	/**
	 * 已接收
	 */
	static CVT_NON_NOTICE_STATE_RECEIVED="RECEIVED";
	/**
	 * 已完成
	 */
	static CVT_NON_NOTICE_STATE_COMPLETED="COMPLETED";
	/**
	 * 非安转产验收单状态
	 * 已保存
	 */
	static CVT_NON_CHECK_STATE_SAVED="SAVED";

	//数据字典类型
	/**
	 * 使用状况
	 */
	static DICT_TYPE_USE_STATE=20;
	/**
	 * 技术状况
	 */
	static DICT_TYPE_TECH_STATE=21;
	/**
	 * 安全现状
	 */
	static DICT_TYPE_SECURITY_STATE=26;

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
	static APPLY_STATE_UNSUBMIT='0';
	/**
	 * 已提交
	 * value = 1
	 */
	static APPLY_STATE_SUBMIT='1';
	/**
	 * 通过
	 * value = 2
	 */
	static APPLY_STATE_ADOPT='2';
	/**
	 * 驳回
	 * value = 3
	 */
	static APPLY_STATE_REJECT='3';
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

