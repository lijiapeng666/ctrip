import bridge from "../../../lib/bridge"
import _ from 'lodash'
const { CtripStorage } = bridge
const ONE_DAY_MILLISECOND = 1 * 24 * 60 * 60
const SHA = {
    saleCityName: "上海",
    saleCityId: 2,
    departureCityId: 2,
    departureCityName: "上海",
    locationCityId: 2,
    locationCityName: "上海"
}
let instance = null
export default class TourStorage {
    constructor() {
        this.domain = "tour"
        this.tourCommonKey = "TOUR_COMMON"
        this.tourCity = "TOUR_CITY_MODEL"
        this.IMKey="TOUR_CHAT_ROBOT_V2"
    }
    static get instance() {
        if (!instance) {
            instance = new TourStorage()
        }
        return instance
    }
    get(key){
        return new Promise(resolve => {
            CtripStorage.app_storage_get(
                key,
                this.domain,
                res => {
                    try{
                        let value = JSON.parse(res.value)
                        resolve(value)
                    }catch(e){
                        resolve(res&&res.value)
                    }
                }
            )
        })
    }
    set(key,value,expires){
        return new Promise(resolve => {
            CtripStorage.app_storage_save(
                key,
                value,
                this.domain,
                expires,
                res => {
                    resolve(true)
                }
            )
        })
    }
    clear(key){
        CtripStorage.app_storage_delete(key, this.domain)
    }

    async getTourCommon() {
        let res = await this.get(this.tourCommonKey,this.domain)
        return res
    }

    async getTourCity() {
        let res = await this.get(this.tourCity)
        return _.isObject(res) ?res:SHA
    }

    //存IM信息
    async setIMParams(params) {
        let res = await this.set(this.IMKey,params)
        return res
    }
}
