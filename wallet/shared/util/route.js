import _ from "lodash"
export const config = {
  multiView: true
}

export function toQueryString (params) {
  let queryStrArr = [], queryStr = "", hyphen = ""
  //From 放最后以避免其他参数呗from里面的链接影响
  _.each(params || {}, function(val,key) {
    if(key !== "from"){
      queryStrArr.push(key + "=" + encodeURIComponent(val))
    }
  })
  if(params && _.has(params,"from")){
    let val = params["from"]
    queryStrArr.push("from=" + encodeURIComponent(val))
  }
  if (queryStrArr.length > 0) {
    queryStr = queryStrArr.join('&')
  }
  return queryStr
}

export default {
  config: config,
  toQueryString: toQueryString
}
