import { Message, MessageBox } from 'element-ui'

/**
 * 字符串是否为空
 * @param  {obj} source 时间对象
 */
export function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}

/**
 * 格式化时间
 * @param  {Datetime} source 时间对象
 * @param  {String} format 格式
 * @return {String}        格式化过后的时间
 */
export function formatDate(source, format){
  const o = {
    'Y+': source.getFullYear(), // 年
    'M+': source.getMonth() + 1, // 月份
    'd+': source.getDate(), // 日
    'H+': source.getHours(), // 小时
    'm+': source.getMinutes(), // 分
    's+': source.getSeconds(), // 秒
    'q+': Math.floor((source.getMonth() + 3) / 3), // 季度
    'f+': source.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (source.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return format
}


/*
* 生成树
* params:{arr:数据列表，parentId:根级树的parentId,sortName:用于同级树排序}
* */
export function outputTree(arr,parentId,sortName){
  var result = [] , temp = [];
  for(var i in arr){
    if(arr[i].parentId == parentId){
      result.push(arr[i]);
      temp = outputTree(arr,arr[i].id,sortName);
      if(temp.length>0){
        //对同级树排序
        if (sortName) {
          arr[i].children = temp.sort(function(a,b){
            return a[sortName] - b[sortName]
          });
        }else{
          arr[i].children = temp
        }

      }
    }
  }
  return result;
}

/*
 * 判断数据类型
 * 输入：obj:参数，type:数据类型
 * 输出：Boolean
 * */
export function isDataType(obj,type) {
  let a = Object.prototype.toString.call(obj);
  let r = '';
  switch (a) {
    case '[object Object]':
      r = 'object';
      break;
    case '[object Array]':
      r = 'array';
      break;
    case '[object Boolean]':
      r = 'boolean';
      break;
    case '[object Null]':
      r = 'null';
      break;
    case '[object Undefined]':
      r = 'undefined';
      break;
    case '[object Number]':
      r = 'number';
      break;
    case '[object String]':
      r = 'string';
      break;
  };
  return r === (type.toLowerCase());
}


/*对象数组根据某一属性去重*/
export function uniqueArr(arr,attr) {
  let obj = {};
  return arr.reduce((item,next)=>{
    obj[next[attr]] ? '' : obj[next[attr]] = true && item.push(next);
    return item;
  },[])
}
 // 饼状颜色表
export const getColors = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];


/**
 * 首页 比较两个时间是否为同一天
 * @param date1
 * @param date2
 */
export const isTimeDay = (date1, date2) => {
  let nndate = new Date(date1);
  let nndate1 = new Date(date2);
  var s1 = Date.parse(nndate),
    s2 = Date.parse(nndate1);
  var total = (s2 - s1) / 1000;

  var day = parseInt(total / (24 * 60 * 60)); //计算整数天数

  var timeStr = true;
  if (day != 0) {
    timeStr = true;
  } else {
    timeStr = false;
  }
  return timeStr;
}


/**
 *  限制上传图片大小
 * @param width 限制宽度
 * @param height 限制高度
 * @param file
 */
export const uploadSize = (width,height,file) => {
  let imgWidth = "";
  let imgHight = "";
  return  new Promise(function (resolve, reject) {
    let _URL = window.URL || window.webkitURL;
    let img = new Image();
    img.onload = function () {
      imgWidth = img.width;
      imgHight = img.height;
      let valid = (img.width/img.height) - (width/height);

      if(Math.abs(valid) <= 0.05){//
        resolve()
      }else{
        reject()
      }
    }
    img.src = _URL.createObjectURL(file);
  }).then(() => {
    return file;
  }, () => {
    Message.warning({
      message: `上传文件的图片大小不合符标准,宽高度比${width} * ${height}。`,
      btn: false
    });
    return Promise.reject();
  });
}

export function downloading(res,title) {
  // console.log(res)
  if (!res) {
    return
  }

  let headers = res.headers;
  let blob = new Blob([res.data], {
    type: headers['content-type']
  });

  let link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);

  if (!title) {
    const fileName = headers['content-disposition'];
    title = fileName.includes('filename=') ? fileName.split('=')[1] : '下载的表单文件';
  }

  link.download = decodeURI(title);
  link.click();
}
