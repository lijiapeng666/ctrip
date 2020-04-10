import BaseStorage from './BaseStorage';
let _instance = null;
//
export default class ModelStorage extends BaseStorage {
    constructor(){
        super('MODEL', 1)
    }
    static get instance() {
        if(!_instance) {
          _instance = new ModelStorage()
        }
        return _instance
    }
    getCache(key) {
      return this.get(key) || null
    }
    setCache(key, Cache) {
      if(!Cache) return
      this.set(key, Cache)
    }
    removeCache(key){
      this.set(key,null);
    }
}
