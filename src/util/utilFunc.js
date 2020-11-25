export const saveCookie = (key,value) =>{
  document.cookie = key + '=' + JSON.stringify(value) + ';';
};
export const getCookie = (key) => {
  let name = key + "=";
  let ca = document.cookie.split(';');
  for(let i=0; i<ca.length; i++)
  {
    let c = ca[i].trim();
    if (c.indexOf(name)===0) return c.substring(name.length,c.length);
  }
  return ""
};
// 深复制的函数
export const deepCopy = (values) => {
  if (typeof values !== 'object' || values === null) { // 证明是普通的数据
    return;
  }
  let newValues = values.constructor === Array ? [] : {}; // 判断是对象还是数组
  for (let i in values) {
    let item = values[i];
    newValues[i] = (Object.prototype.toString.call(item) === '[object Object]') ? deepCopy(item) : item; // 是否值是引用类型， 是的话递归调用, 不是直接复制
  }
  return newValues;
}