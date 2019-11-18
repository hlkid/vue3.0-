/**
 * 输入校验格式
 * 必填@change="对象，属性，校验方法"
 * */
//非负整数
function nonnegativeInteger(val){
  //判断是否非负整数
  let reg = /^[0-9]\d*$/ ;
  if (!reg.test(val)){
    let r = parseInt(val.replace(/\D/g,''));
    if (r > 1){
      return r
    }else {
      return 0
    }
  }else{
    return val
  }
}

//正整数
function positiveInteger(val){
  //判断是否正整数
  let reg = /^[1-9]\d*$/ ;
  if (!reg.test(val)){
    let r = parseInt(val.replace(/\D/g,''));
    if (r > 1){
      return r
    }else {
      return 1
    }
  }else{
    return val
  }
}

//保留小数点后两位的正数
function positiveToFixed2 (val){
  let num = parseFloat(val);
  let reg = /^[0-9]+.?[0-9]*$/;
  if (isNaN(val)) {
    return 0.00
  }else{
    if (!reg.test(val)){
      return 0.00
    }else{
      return num.toFixed(2)
    }
  }
}

export default {
  positiveInteger,
  positiveToFixed2,
  nonnegativeInteger
}
