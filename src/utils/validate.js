/**
 * 表单校验
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
//是否MAC地址
export function isMAC(rule, value, callback) {
  let reg = /[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/;
  if (!reg.test(value)) {
    callback(new Error('请输入正确的mac地址'));
  } else {
    callback();
  }
}

/**
 * 是否为读者证号
 */
export function isReaderNum(rule, value, callback) {
  let reg = /^[1-9][0-9]*$/;
  if (!reg.test(value)) {
    callback(new Error('请输入正确的读者证号'));
  } else {
    callback();
  }
}

/**
 * 是否为卡号
 */
export function isCardNum(rule, value, callback) {
  let reg = /^[1-9][0-9]*$/;
  if (!reg.test(value)) {
    callback(new Error('请输入正确的卡号'));
  } else {
    callback();
  }
}


//用户名不能空、空格
export function checkAccount(rule, value, callback) {
  let reg = /\s+/;
  if (value === '' || value.trim() == '') {
    callback(new Error('账号不能为空'));
  } else if (reg.test(value)) {
    callback(new Error('账号不能有空格'));
  } else {
    callback();
  }
}

export function checkPsw(rule, value, callback) {
  let reg = /\s+/;
  if (value === '' || value.trim() == '') {
    callback(new Error('密码不能为空'));
  } else if (reg.test(value)) {
    callback(new Error('密码不能有空格'));
  } else {
    callback();
  }
}

export function checkCode(rule, value, callback) {
  let reg = /^[A-Za-z0-9]+$/
  if (value === '' || value.trim() == '') {
    callback(new Error('请输入验证码'));
  } else if (!reg.test(value)) {
    callback(new Error('验证码格式不正确'));
  } else {
    callback();
  }
}

//数量：正整数
export function checkNumber(rule, value, callback) {
  let reg = /^[1-9][0-9]*$/;
  if (isNaN(value)) {
    callback(new Error('请输入数字'));
  } else {

    if (!reg.test(value)) {
      callback(new Error('请输入正整数'));
    } else {
      callback();
    }
  }
}

//手机号
export function checkMobile(rule, value, callback) {
  let reg = /^1\d{10}$/;
  if (value != '' && !reg.test(value)) {
    callback(new Error('手机号码格式不正确'));
  } else {
    callback();
  }
}

// 电话号码（固定电话/手机号）
export function mobile(rule, value, callback) {
  let reg = /^1\d{10}$/;
  let regTwo = /^((0\d{2,3})-?)?(\d{7,8})(-(\d{3,}))?$/;

  if (value != '' && !reg.test(value) && !regTwo.test(value)) {
    callback(new Error('电话号码格式不正确'));
  } else {
    callback();
  }
}


//邮箱
export function checkEmail(rule, value, callback) {
  let reg = /\w@\w*\.\w/;
  if (value != '' && !reg.test(value)) {
    callback(new Error('邮箱格式不正确'));
  } else {
    callback();
  }
}

//邮编
export function checkZcode(rule, value, callback) {
  let reg = /^[0-9]{6}$/;
  if (value != '' && !reg.test(value)) {
    callback(new Error('邮编格式不正确'));
  } else {
    callback();
  }
}

//固定电话
export function checkTel(rule, value, callback) {
  let reg = /^((0\d{2,3})-?)?(\d{7,8})(-(\d{3,}))?$/;
  if (value != '' && !reg.test(value)) {
    callback(new Error('固定电话格式不正确'));
  } else {
    callback();
  }
}

//传真
export function checkFax(rule, value, callback) {
  let reg = /^((\d{3,4})-?)?(\d{7,8})?$/;
  if (value != '' && !reg.test(value)) {
    callback(new Error('传真格式不正确'));
  } else {
    callback();
  }
}

//汉字
export function checkChinese(rule, value, callback) {
  let reg = /^[\u4e00-\u9fa5]+$/;
  if (value != '' && !reg.test(value)) {
    callback(new Error('请输入中文'));
  } else {
    callback();
  }
}

//经度
export function checkLong(rule, value, callback) {
  if (value != '' && isNaN(value)) {
    callback(new Error('请输入数字'));
  } else {
    callback();
  }
}

//纬度
export function checkLat(rule, value, callback) {
  if (value != '' && isNaN(value)) {
    callback(new Error('请输入数字'));
  } else {
    callback();
  }
}

//密码必须为数字和字母
export function chekPassReg(rule, value, callback) {
  if (!value) {
    return callback(new Error('请输入密码'));
  } else {
    if (value.length < 6) {
      return callback(new Error('密码至少6位数'));
    }
    var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
    if (!reg.test(value)) {
      return callback(new Error('密码必须包含数字和字母'));
    }
    else {
      callback();
    }
  }

}

//验证码
export function chekCodeReg(rule, value, callback) {
  if (!value) {
    return callback(new Error('请输入验证码'));
  }
  if (value.length != 4) {
    return callback(new Error('验证码必须为4位'));
  }
  if (value != '' && isNaN(value)) {
    callback(new Error('请输入数字'));
  } else {
    callback();
  }
}
//金额：保留1-2两位小数
export function checkMoney(rule, value, callback) {
  let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;

  if (isNaN(value)) {
    callback(new Error('请输入数字'));
  } else {
    if (value <= 0) {
      callback(new Error('金额需要大于0'));
    } else if (!reg.test(value)) {
      callback(new Error('请保留1-2位小数'));
    } else {
      callback();
    }
  }
}

// 大于0的数值
export function checkNumFloat(rule, value, callback) {
  let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
  if (isNaN(value)) {
    callback(new Error('请输入数字'));
  } else {
    if (value <= 0) {
      callback(new Error('需要大于0'));
    } else if (!reg.test(value)) {
      callback(new Error('请保留1-2位小数'));
    } else {
      callback();
    }
  }
}
// 包括0的数值
export function checkNumIncludeZero(rule, value, callback) {
  let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
  if (isNaN(value)) {
    callback(new Error('请输入数字'));
  } else {
    callback();
  }
}

// qq号码
export function QQcheck(rule, value, callback) {
  let reg = /^[1-9][0-9]{4,10}$/;
  if (value != '' && !reg.test(value)) {
    callback(new Error('请输入正确的QQ格式'));
  } else {
    callback();
  }
}
export function checkWechat(rule, value, callback) {
  let reg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
  if (value != '' && !reg.test(value)) {
    callback(new Error('请输入正确的微信号格式'));
  } else {
    callback();
  }
}
export function checkWechatQQ(rule, value, callback) {
  let reg1 = /^[1-9][0-9]{4,10}$/;
  let reg2 = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;

  if (isNaN(value)) {
    if (!reg2.test(value)) {
      callback(new Error('请输入正确的微信号格式'));
    } else {
      callback();
    }
  } else {
    if (!reg1.test(value)) {
      callback(new Error('请输入正确的QQ格式'));
    } else {
      callback();
    }
  }
}

