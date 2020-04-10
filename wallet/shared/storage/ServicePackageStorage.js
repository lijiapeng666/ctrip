import BaseStorage from './BaseStorage'
let _instance = null
//城市列表页 城市与搜索历史数据 缓存
export default class ServicePackageStorage extends BaseStorage {
  constructor() {
    super('ServicePackageStorage')
  }

  static get instance() {
    if (!_instance) {
      _instance = new ServicePackageStorage()
    }
    return _instance
  }

  savePackage(data) {
    this.set(`package`, data)
  }

  getPackage() {
    return this.get(`package`)
  }

  getStockInventory() {
    return this.get('stock')
  }

  saveStockInventory(data) {
    this.set('stock', data)
  }

  getStockRenewList() {
    return this.get('stockrenewlist')
  }

  saveStockRenewList(data) {
    this.set('stockrenewlist', data)
  }

  getLinePrice() {
    return this.get('line')
  }

  saveLinePrice(data) {
    this.set('line', data)
  }

  getResourceList(resourceType){
    return this.get(resourceType)
  }

  saveResourceList(resourceType,data){
    this.set(resourceType, data)
  }

  saveCarPackage(data){
    this.set("carPackage", data)
  }

  getCarPackage(){
    return this.get("carPackage");
  }

  saveGuidePackage(data){
    this.set("guidePackage", data)
  }

  getGuidePackage(){
    return this.get("guidePackage");
  }

  saveCarInfo(data) {
    this.set("carInfo",data);
  }

  getCarInfo() {
    return this.get("carInfo");
  }

  saveAdvisorId(data) {
    this.set("advisorId",data);
  }

  getAdvisorId() {
    return this.get("advisorId");
  }

  saveDispatchManageInfo(data) {
    this.set("dispatchManageInfo",data);
  }

  getDispatchManageInfo() {
    return this.get("dispatchManageInfo");
  }
}
