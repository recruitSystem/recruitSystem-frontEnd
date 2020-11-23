import axios from 'axios'
import {getCookie} from '../util/utilFunc'
let instance = axios.create({
  baseURL: ''
});
let headers = {}
const methodList = ['post', 'put', 'patch',];
const stringifyData = (data) => {
  let res = []
  Object.keys(data).forEach((key) => {
    if (data[key] === null || data[key] === undefined) {
      // 呵呵
    } else {
      res.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    }
  })
  return res.join('&')
}

const toFormData = (data) => {
  var formData = new FormData();
  Object.keys(data).forEach(key => {
    let dataKey = data[key];
    if (Array.isArray(dataKey)) { // 发送数组
      for (let i = 0; i < dataKey.length; i++) {
        formData.append(`${key}`, dataKey[i]);
      }
    } else {
      formData.append(key, dataKey);
    }
  })
  return formData;
}
// 获取请求头
const fetch = (option) => {
  if (!option.url) {
    console.error('使用_fetch时请先填入url');
    return
  }

  let requestPromise
  methodList.forEach((method) => {

    if (option.type && option.type.toLowerCase() === method) {
      let finalData = {};
      // 如果_fetch请求有带请求头,则覆盖原来的默认请求头
      if (option.headers) {
        // newHeader =
        headers = Object.assign(headers, option.headers)
        // 如果请求是application/json,则把对象转为json字符串
        if (headers['Content-Type'] === 'application/json') {
          finalData = option.data ? JSON.stringify(option.data) : {}
          // console.log(finalData, option.data, 123)
        }

        //如果请求是multipart/form-data，则把json对象转换为formData对象,当然也可以直接发
        if (headers['Content-Type'] === 'multipart/form-data') {
          if (option.data) {
            if (Object.prototype.toString.call(option.data) === '[object FormData]') {
              finalData = option.data
            } else {
              finalData = toFormData(option.data);
            }
          }
        }

        if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
          finalData = option.data ? stringifyData(option.data) : {}
        }
      } else {
        headers = Object.assign(headers, {
          'Content-Type': 'application/x-www-form-urlencoded'
        })
        finalData = option.data ? stringifyData(option.data) : {}
      }
      // console.log(headers)
      if (getCookie('usermessage')) {
        headers.Authorization = JSON.parse(getCookie('usermessage')).token   // 获取请求头
      }
      requestPromise = instance.request({
        headers: headers,
        url: option.url,
        method: option.type.toLowerCase(),
        data: finalData,
        responseType: option.responseType ? option.responseType : 'json'
      })
    }
  })
//除了那三种方法之外的方法
  if (!requestPromise) {

    var finalData = option.data
    let headers = {}
    if (JSON.parse(getCookie('usermessage'))) {
      headers.Authorization = JSON.parse(getCookie('usermessage')).token   // 获取请求头
    }

    let type = option.type || 'get'
    type = type.toLowerCase()
    requestPromise = instance.request({
      headers,
      url: option.url,
      method: type,
      params: finalData || {}
    })
  }
  return requestPromise.then(
    (res) => {
      if (res.data.success) {
        return res
      } else {
        return res
      }
    }
  )
};
export default fetch