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




