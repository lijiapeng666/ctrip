import base64 from "./base64";

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement("iframe");
  WVJBIframe.style.display = "none";
  WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
}

export const getVersion = function() {
  var arr = navigator.userAgent.split("_");
  return arr[arr.length - 1].split(".").map(Number);
};

export function compareVersion(inputVersion) {
  inputVersion = inputVersion.split(".").map(Number);
  const version = getVersion();
  // 主版本
  if (version[0] > inputVersion[0]) {
    return true;
  } else if (version[0] === inputVersion[0]) {
    // 次版本
    if (version[1] > inputVersion[1]) {
      return true;
    } else if (version[1] === inputVersion[1]) {
      // 末版本
      if (version[2] >= inputVersion[2]) {
        return true;
      }
    }
  }

  return false;
}

/**
 *
 * @method 方法名
 * @param {*} 参数
 * @callback 回调
 */
export function callNative(options) {
  setupWebViewJavascriptBridge(function(bridge) {
    var param = JSON.stringify(options.param || {});
    param = base64.encode(param);
    bridge.callHandler(options.method, param, options.callback);
  });
}

export function registerNative(options) {
  setupWebViewJavascriptBridge(function(bridge) {
    bridge.registerHandler(options.method, function(data, responseCallback) {
      var jsonStr = base64.decode(data);
      var jsonData = JSON.parse(jsonStr);
      options.callback(jsonData);
    });
  });
}

function closeWebView() {
  var finalOptions = {method: 'closeWebView'};
  return callNative(finalOptions);
}

// 判断是否在 vbk 里
var isVBKApp = function () {
  //return navigator && (navigator.userAgent.indexOf('ctripVBKwireless') !== -1)
  return eval("navigator && navigator.userAgent.indexOf('ctripVBKwireless')") != -1

}

export default {
  isVBKApp: isVBKApp,
  closeWebView: closeWebView,
  callNative: callNative,
  compareVersion: compareVersion,
  getVersion: getVersion,
  registerNative: registerNative
};
