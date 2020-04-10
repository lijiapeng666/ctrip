import {subEnvConfig} from "./config"

function getUrl (url,env, hostName) {
  //解决测试环境Subenv配置不走FWS问题
  let prefixs=[],hyphen
  if(env == "fat"){
    let keys = Object.keys(subEnvConfig)
    for(let i=0; i< keys.length; i++){
      if(url.indexOf(keys[i])> -1){
        prefixs.push("subEnv=" + subEnvConfig[keys[i]])
        break
      }
    }
  }
  //const hostName = (location && location.host) || ""
  if(hostName.match(/^h5seo.mobile.ctripcorp.com/i)){
      prefixs.push("isBastion=true")
      prefixs.push("isSlbBastion=true")
  }

  if (prefixs.length > 0) {
      let hyphen = url.indexOf("?") > -1 ? "&" : "?"
      url += hyphen + prefixs.join("&")
  }
  return url
}

export default {
  getUrl: getUrl
}
