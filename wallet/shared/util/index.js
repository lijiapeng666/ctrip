export function getEnvByUserAgent(userAgent) {
  return {
    isInCtripApp: !!userAgent.match(/ctripwireless/i),
    isInWechat: !!userAgent.match(/MicroMessenger/i),
    isInVbk: !!userAgent.match(/ctripVBKwireless/i)
  }
}

export function dateAdd(dtTmp, strInterval, Number) {
  switch (strInterval) {
    case 's':
      return new Date(Date.parse(dtTmp) + 1000 * Number)
    case 'n':
      return new Date(Date.parse(dtTmp) + 60000 * Number)

    case 'h':
      return new Date(Date.parse(dtTmp) + 3600000 * Number)

    case 'd':
      return new Date(Date.parse(dtTmp) + 86400000 * Number)
    case 'm':
      return new Date(
        dtTmp.getFullYear(),
        dtTmp.getMonth() + Number,
        dtTmp.getDate(),
        dtTmp.getHours(),
        dtTmp.getMinutes(),
        dtTmp.getSeconds()
      )
    case 'y':
      return new Date(
        dtTmp.getFullYear() + Number,
        dtTmp.getMonth(),
        dtTmp.getDate(),
        dtTmp.getHours(),
        dtTmp.getMinutes(),
        dtTmp.getSeconds()
      )
  }
}

export function getServerDate(obj) {
  let temp = null;
  if (typeof(obj) === "string") {
      if (new RegExp("^/Date[(][-]?[0-9]+[+-][0-9]{4}[)]/$").test(obj)) {
        temp = Number(obj.match(/[-]?\d+/g)[0]);
      } else {
        return null
      }
  }
  return new Date(temp)
}

export function dateFormatWithTimezone(dtTmp, str ="yyyy-MM-dd", timeZone=8){
  let timeStamp = dtTmp.getTime()
  timeStamp +=  timeZone * 3600 * 1000
  let deltaDate = new Date(timeStamp)
  return dateFormat(deltaDate, str)
}

export function dateFormat(dtTmp, str ="yyyy-MM-dd") {
  str = str.replace(/yyyy|YYYY/, dtTmp.getFullYear())
  str = str.replace(
    /MM/,
    (dtTmp.getMonth()+1) > 9 ? (dtTmp.getMonth()+1).toString() : '0' + (dtTmp.getMonth()+1)
  )
  str = str.replace(/M/g, (dtTmp.getMonth()+1))
  str = str.replace(
    /dd|DD/,
    dtTmp.getDate() > 9 ? dtTmp.getDate().toString() : '0' + dtTmp.getDate()
  )
  str = str.replace(/d|D/g, dtTmp.getDate())
  str = str.replace(
    /hh|HH/,
    dtTmp.getHours() > 9 ? dtTmp.getHours().toString() : '0' + dtTmp.getHours()
  )
  str = str.replace(/h|H/g, dtTmp.getHours())
  str = str.replace(
    /mm/,
    dtTmp.getMinutes() > 9
      ? dtTmp.getMinutes().toString()
      : '0' + dtTmp.getMinutes()
  )
  str = str.replace(/m/g, dtTmp.getMinutes())
  str = str.replace(
    /ss|SS/,
    dtTmp.getSeconds() > 9
      ? dtTmp.getSeconds().toString()
      : '0' + dtTmp.getSeconds()
  )
  str = str.replace(/s|S/g, dtTmp.getSeconds())
  return str
}

export function sleep (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
}

export default {
  sleep: sleep,
  getEnvByUserAgent: getEnvByUserAgent,
  dateAdd: dateAdd,
  dateFormat: dateFormat,
  getServerDate: getServerDate,
  dateFormatWithTimezone: dateFormatWithTimezone
}
