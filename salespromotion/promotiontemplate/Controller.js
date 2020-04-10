/* jshint esversion:6 */
import Controller from '../../shared/PageController'
import View from './View'
import * as Model from './Model'


export default class extends Controller {

    pageId = 10650025051
    View = View
    Model = Model
    requireLogin = true
    requireUserInfo = true
    shark = false
    pageName = ["salespromotion"]

    async componentDidMount () {
        await this.handleSubmitSearchForm()
    }

    handleSubmitSearchForm = async (searchParam)=> {
        if(searchParam !== undefined){
            this.mergeToState({searchData: searchParam})
        }
        console.log("state", this.store.getState().searchData)
        let result = await this.postApi('/marketing/queryPromotionTemplate', this.store.getState().searchData);
        this.mergeToState(
            {
                promotionTemplateList: result.promotionTemplateList,
                totalPage: result.totalPage,
                totalCount: result.totalCount,
            }
        )
    }

    ////变更分页每页个数
    handleChangePageSize = (pageIndex, pageSize) => {
        this.mergeToState({
            searchData: {
                ...this.store.getState().searchData,
                pageNo: pageIndex,
                pageSize: pageSize,
            }
        })
        this.handleSubmitSearchForm()
    }

    // 变更上下页、指定页码
    handleChangeCurrentPage = (pageIndex, pageSize) => {
        this.mergeToState({
            searchData: {
                ...this.store.getState().searchData,
                pageNo: pageIndex,
                pageSize: pageSize,
            }
        })
        this.handleSubmitSearchForm()
    }

    handlerOpTemplate = async (opParam)=> {
        return await this.postApi('/marketing/opPromotionTemplate', opParam);
    }

    handleToggleLogModal = async ( promotionId,promotionName ) => {
        const { logModalShow } = this.store.getState()
        this.mergeToState( {
            logModalShow:!logModalShow
        } )
        if(promotionId)
            await this.queryLog(promotionId,promotionName);
    }

    async queryLog (templateId,templateName) {
        let res = await this.postApi('/marketing/querySalesProOplog', {salesPromotionoplog:{businessId:templateId,type:2 }} )
        console.log( 'getSalesPromotionOplogList', res )
        this.mergeToState( {
            opLogList: res.salesPromotionoplogList,
            templateId: templateId,
            templateName: templateName,
        } )

    }
}
