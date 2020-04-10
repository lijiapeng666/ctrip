/* jshint esversion:6 */

import Controller from '../../shared/PageController'
import View from './View'
import * as Model from './Model'
// import MockApi from '../api/mock'
import { message, Modal } from 'antd/lib';
const Confirm = Modal.confirm;


export default class extends Controller {
    SSR = false;
    pageId = this.location.params.type==1?10650025094:10650025097;
    View = View;
    Model = Model;
    requireLogin = true
    requireUserInfo = true
    pageName = ["salespromotion"]


    async componentDidMount() {
        this.getTemplateList()
        this.getProductInfoList();
    }

    async getTemplateList () {
        let res = await this.postApi('/marketing/getSalesProTemplates', {status:[10,20],participant:""} )
        console.log( 'getTemplateList', res )
        this.mergeToState( {
            templateSelectList:res.salesPromotionTemplateList
        } )
    }

    async getProductInfoList(searchParams={}) {

        const {pageSize,pageNo,promotionInfo:{productCateList=[]}={}} = this.store.getState()
        let searchData = {
            pageNo,
            pageSize,
            status:0,
            templateId: 0,
            businessLine:0,
            ...searchParams
        }

        let res = await this.postApi('/marketing/getOfflineProInfos', searchData )
        let { offlineProductInfos,totalCount } = res;
        this.mergeToState({ productList:offlineProductInfos,totalCount})
        setTimeout( () => this.mergeToState( { expandedRowKeys:[] } ), 100 )
    }

    handleSubmitSearchForm = async (data = {}) => {
        let { searchParams, pageSize,pageNo } = this.store.getState();
        searchParams = {
            ...searchParams,
            pageSize,
            pageNo,
            ...data,
        }

        this.mergeToState({ searchParams })

        await this.getProductInfoList(searchParams);
    }

    ////变更分页每页个数
    handleChangePageSize = (pageIndex, pageSize) => {
        this.mergeToState({ pageNo:pageIndex,pageSize })
        this.handleSubmitSearchForm()
    }

    // 变更上下页、指定页码
    handleChangeCurrentPage = (pageIndex, pageSize) => {
        this.mergeToState({ pageNo:pageIndex, pageSize})
        this.handleSubmitSearchForm()
    }

    handleChangeExpandedRows = (expandedRowKeys)=>{
        // console.log('表格上展开的行',expandedRowKeys)
        this.mergeToState({
            expandedRowKeys
        })
    }

    handleSetSingleSortNo = (e,record) =>{
        record.sort = e
        console.log(this.store.getState())
        let { productList } = this.store.getState();

        this.mergeToState( productList)
      /*  productList.filter(item=>item.productId == record.productId && item.promotionId == record.promotionId).map(item=>{
            item = record
        })*/
    }

    //保存产品排序
    handleSaveSortNo = () => {
        let { language } = this.store.getState()
        Confirm({
    		title:language["salespromotion.whether_save_sort"],
    		onOk:() =>{
                // console.log('已选择',this._getCurrentPageRelateProduct())
    			this.saveOfflineProductSort({
                    productSalesPros: this._getCurrentPageRelateProduct()
    			})
    		}
    	})
        
    }



    //获取已选择的 资源列表[{productId,optionId}]
    _getCurrentPageRelateProduct = () => {
        let { productList } = this.store.getState();

        let selectedList = productList.map((item=>{
                return {sort:item.sort,productId:item.productId,salesPromotionId:item.salesPromotionId}
        }))

        console.log(selectedList)
        let result = Array.prototype.concat.apply([], selectedList);
        return result
    }


    // 关联或取消关联产品
    saveOfflineProductSort = async (params) => {
        let { language } = this.store.getState()
        console.log('params',params)
        this.store.actions.setSpinning(true);

        const relatePromotionProduct = await this.resHandler(() => {
            return this.post('/marketing/saveOfflineProductSort', params)
        }, (res) => {
            let { productList } = this.store.getState();
            this.mergeToState({productList})
            this.handleSubmitSearchForm()
            message.success(language["salespromotion.saved_successfully"])
            return true
        }, (fail) => {
            console.log('saveSalesPromotionOption_fail', fail)
            const {customerErrorMessage} = fail
            message.error(customerErrorMessage)
            return false

        }, { name: 'saveOfflineProductSort' })

        this.store.actions.setSpinning(false);
        return relatePromotionProduct
    }


    handleGetOptionInfo = async (item)=>{
        const {productList,location:{params:{pid}}} = this.store.getState()
        const {optionIds} = item
        await this.resHandler(() => {
            return this.post('/marketing/getOptionInfos', {salesPromotionId:parseFloat(pid),optionIds})
        }, (res) => {
            let { optionInfos } = res;
            item.optionInfos = optionInfos
            this.mergeToState({ productList })

        }, (res) => {
            console.log('getOptionInfoList_err', res)
            message.error(res.customerErrorMessage)
        }, { name: 'getOptionInfoList' })
    }

    handleToggleLogModal = async ( optInfo ) => {
        const { modalShow } = this.store.getState()
        this.mergeToState( {
            modalShow:!modalShow
        } )
        if(optInfo){
            this.mergeToState({currentOptInfo:optInfo})
        }
    }



}