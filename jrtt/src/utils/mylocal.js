// 操作 localstorage
// 设置 localstorage
function setLocal (key, value) {
  // 将数据对象转为字符串,存储到localstorage中国
  window.localStorage.setItem(key, JSON.stringify(value))
}
// 获取 localstorage
function getLocal (key) {
  return JSON.parse(window.localStorage.getItem(key))
}
// 删除 localstorage
function removeLocal (key) {
  window.localStorage.removeItem(key)
}
// 暴露方法
export {
  setLocal,
  getLocal,
  removeLocal
}
