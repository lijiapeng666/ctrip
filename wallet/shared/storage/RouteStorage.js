import BaseStorage from './BaseStorage';
let _instance = null;
//城市列表页 城市与搜索历史数据 缓存
export default class RouteStorage extends BaseStorage {
    constructor(){
        super('ROUTE')
    }

    static get instance() {
        if(!_instance) {
          _instance = new RouteStorage()
        }
        return _instance
    }

    getPageOptions() {
      return this.get('pageOptions') || null
    }

    setPageOptions(pageOptions) {
      if(!pageOptions) return
      this.set('pageOptions', pageOptions)
    }
    removePageOptions(){
      this.set('pageOptions',null);
    }
    getUrl(targetPageKey) {
      return this.get('fromUrl.' + targetPageKey) || null
    }

    setUrl(targetPageKey, location, isInternal) {
      let data = {
        location: location,
        isInternal: isInternal
      }
      this.set('fromUrl.' + targetPageKey, data)
    }
    removeUrl(){
      this.set('fromUrl',null);
    }
}
