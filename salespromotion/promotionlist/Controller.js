/* jshint esversion:6 */
import Controller from '../../shared/PageController'
import View from './View'
import * as Model from './Model'
import { message } from 'antd';
import { lang } from 'moment';

export default class extends Controller {

    pageId = 10650025051
    View = View
    Model = Model
    requireLogin = true
    requireUserInfo = true
    shark = false
    pageName = ["salespromotion"]
    async componentDidMount() {
        this.getTemplateList()
        this.handlerInitSiteLan()
        await this.initPage()
    }

    JudgeList(v) {
        const { language } = this.store.getState()
        if ((v.deductionStrategyTypeID == 1 || v.deductionStrategyTypeID == 2) && v.deductionList[0].deductionType == 0) {
            //  无门槛优惠立减v.currency+v.deductionList[0].deductionAmount
            let str = language["salespromotion.threshold_reduction_fix"]
            str=str.replace("${0}",v.currency).replace("${1}",v.deductionList[0].deductionAmount)
            return str
        }
        if ((v.deductionStrategyTypeID == 1 || v.deductionStrategyTypeID == 2) && v.deductionList[0].deductionType == 1) {
            // 无门槛优惠v.deductionList[0].deductionAmount+"%"
            let str = language['salespromotion.threshold_discount_percentage']
            str=str.replace("${0}",v.deductionList[0].deductionAmount)
            return str
        }
        if (v.deductionStrategyTypeID == 101 && v.deductionList[0].deductionType == 0) {
            //  满v.deductionList[0].startAmount份立减v.currency + v.deductionList[0].deductionAmount
            let str = language['salespromotion.for_subsequent_discounts']
            str = str.replace("${0}",v.deductionList[0].startAmount).replace("${1}",v.currency).replace("${2}",v.deductionList[0].deductionAmount)
            return str
        }
        if (v.deductionStrategyTypeID == 101 && v.deductionList[0].deductionType == 1) {
            //  满v.deductionList[0].startAmount份优惠v.deductionList[0].deductionAmount +"%"
            let str = language['salespromotion.for_full_discount']
            str = str.replace("${0}",v.deductionList[0].startAmount).replace("${1}",v.deductionList[0].deductionAmount)
            return str
        }
        if (v.deductionStrategyTypeID == 102 && v.deductionList[0].deductionType == 0) {
            // 第v.deductionList[0].startAmount份立减v.currency + v.deductionList[0].deductionAmount
            let str = language["salespromotion.for_the_first_reduction"]
            str = str.replace("${0}",v.deductionList[0].startAmount).replace("${1}",v.currency).replace("${2}",v.deductionList[0].deductionAmount)
            return str
        }
        if (v.deductionStrategyTypeID == 102 && v.deductionList[0].deductionType == 1) {
            // 第v.deductionList[0].startAmount份优惠v.deductionList[0].deductionAmount +"%"
            let str = language['salespromotion.for_first_discount']
            str = str.replace("${0}",v.deductionList[0].startAmount).replace("${1}",v.deductionList[0].deductionAmount)
            return str
        }
        if (v.deductionStrategyTypeID == 103 && v.deductionList[0].deductionType == 0) {
            // 每v.deductionList[0].startAmount份立减v.currency + v.deductionList[0].deductionAmount
            let str = language["salespromotion.for_every_few_copies"]
            str = str.replace("${0}",v.deductionList[0].startAmount).replace("${1}",v.currency).replace("${2}",v.deductionList[0].deductionAmount)
            return str
        }
        if (v.deductionStrategyTypeID == 103 && v.deductionList[0].deductionType == 1) {
            // 每v.deductionList[0].startAmount份优惠v.deductionList[0].deductionAmount +"%"
            let str = language['salespromotion.every_few_discounts']
            str = str.replace("${0}",v.deductionList[0].startAmount).replace("${1}",v.deductionList[0].deductionAmount)
            return str
        }

    }

    FormatPromitionList(salesPromotionList) {

        const analysisList = [...salesPromotionList]
        analysisList.map((item) => {
            item.salesPromotionName = this.JudgeList(item)
        })
        return salesPromotionList
    }

    async initPage() {
        const { searchData, status } = this.store.getState()
        let res = await this.postApi('/marketing/getSalesProInfos', { ...searchData, status })
        console.log('getSalesProInfos', res)
        const { salesPromotionList, totalCount, loginResult: { userInfo: { userType } = {} } = {} } = res
        this.mergeToState(
            {
                promotionList: this.FormatPromitionList(salesPromotionList),
                totalPage: res.totalPage,
                totalCount: res.totalCount,
            }
        )
    }

    handlerInitSiteLan = async () => {
        let result = await this.postApi('/marketing/getCommonSource', { "group": "locale" });
        this.mergeToState({ siteLanList: result.commonSourceList })
        console.log('state', this.store.getState())
    }

    async getTemplateList() {
        let res = await this.postApi('/marketing/getSalesProTemplates', { status: [10, 20], participant: "" })
        console.log('getTemplateList', res)
        this.mergeToState({
            templateSelectList: res.salesPromotionTemplateList
        })
    }

    async queryLog(promotionId, promotionName) {
        let res = await this.postApi('/marketing/querySalesProOplog', { salesPromotionoplog: { businessId: promotionId, type: 3 } })
        console.log('getSalesPromotionOplogList', res)
        this.mergeToState({
            opLogList: res.salesPromotionoplogList,
            promotionId: promotionId,
            promotionName: promotionName
        })

    }


    handleStatusChange = e => {
        const { searchData } = this.store.getState()

        this.mergeToState({
            status: e.target.value,
            searchData: { ...searchData, pageNo: 1 }
        })
        console.log('state', this.store.getState())
        this.initPage()
    }

    handleSubmitSearchForm = async (params) => {
        const { searchData } = this.store.getState()
        this.mergeToState({
            searchData: { ...searchData, ...params }
        })

        await this.initPage()
    }
    handleToggleLogModal = async (promotionId, promotionName) => {
        const { logModalShow } = this.store.getState()
        this.mergeToState({
            logModalShow: !logModalShow
        })
        if (promotionId)
            await this.queryLog(promotionId, promotionName);
    }

    ////变更分页每页个数
    handleChangePageSize = (pageIndex, pageSize) => {
        const { searchData } = this.store.getState()

        this.mergeToState({ searchData: { ...searchData, pageNo: pageIndex, pageSize } })
        this.handleSubmitSearchForm()
    }

    // 变更上下页、指定页码
    handleChangeCurrentPage = (pageIndex, pageSize) => {
        const { searchData } = this.store.getState()

        this.mergeToState({ searchData: { ...searchData, pageNo: pageIndex, pageSize } })
        this.handleSubmitSearchForm()
    }

    handleToRelateResource = (pid) => {

        const { location: { query = {} } } = this.store.getState()
        this.forward(`/promotion/relate/1/${pid}`, { ...query })
    }

    handleToRelateInfo = (pid) => {
        const { location: { query = {} } } = this.store.getState()
        this.forward(`/salespromotion/promotiondetail/${pid}`, { ...query })
    }

    handleToStop = async (pid) => {
        const { searchData, status, language } = this.store.getState()
        await this.resHandler(
            () => this.postApi('/marketing/stopSalesPromotion', { salesPromotionId: parseFloat(pid), isActive: false }),
            (res) => {
                console.log('stopSalesPromotion', res)
                message.success(language["salespromotion.successfu_operation"])
            },
            (fail) => {
                console.log(fail)
            },
            { name: 'stopSalesPromotion' }
        )
    }

    handleToEdit = (tid, pid) => {
        const { location: { query = {} } } = this.store.getState()
        this.forward(`/promotion/edit/${tid}/${pid}`, { ...query })
    }

}
