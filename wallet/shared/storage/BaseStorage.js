import _ from "lodash"
import moment from 'moment'

let abResultStorage = null

class BaseStorage {
  constructor(storeName, expires) {
    this.domain = "ttd_vendor_product"
    this.storeName = storeName.toLocaleUpperCase()
    if (/^[PSU]_/.test(this.storeName)) {//老的项目，暂时先做一下兼容
      this._lsName = this.storeName
    } else {
      this._lsName = this.domain + "_" + this.storeName
    }
    this.expires = +expires || 30 * 24 * 60 * 60
  }

  static get abResultStorage() {
    if (!abResultStorage) {
      abResultStorage = new BaseStorage('AB_RESULT', 5 * 60);
    }
    return abResultStorage
  }

   get(propName) {
    try {
      let storedProps = JSON.parse(
        window.localStorage.getItem(this._lsName)
      )
      const {value, timeout} = storedProps
      if (new Date().getTime() > timeout) {
        this.clear()
        return undefined
      } else {
        if (propName) {
          return _.get(value, propName)
        } else {
          return value
        }
      }
    } catch (e) {
      // console.log(e)
      return undefined
    }
  }

   set(propName, value) {
    const savetime = new Date().getTime()
    const timeout = moment(savetime).add(this.expires, 's').valueOf()
    if (propName) {
      let storedProps =  this.get()
      let storeValue = storedProps || {}
      _.set(storeValue, propName, value)
      window.localStorage.setItem(
        this._lsName,
        JSON.stringify({value: storeValue, timeout, savetime})
      )
    } else {
      window.localStorage.setItem(
        this._lsName,
        JSON.stringify({value: value, timeout, savetime})
      )
    }
    return true
  }

  getAll() {
    return this.get()
  }

   clear() {
    window.localStorage.removeItem(this._lsName)
    return true
  }
}

export default BaseStorage
