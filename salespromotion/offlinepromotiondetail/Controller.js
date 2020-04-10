/* jshint esversion:6 */

import Controller from '../../shared/PageController'
import View from './View'
import * as Model from './Model'
import { message, Modal } from 'antd/lib';
const Confirm = Modal.confirm;


export default class extends Controller {
    SSR = false;
    pageId = this.location.params.type==1?10650025094:10650025097;
    View = View;
    Model = Model;
    requireLogin = true
    requireUserInfo = true
    shark = false
    pageName = ["salespromotion"]

    async componentDidMount() {
        this.getRelatedCount() //获取已关联的商品数
        this.getPromotionInfo();
        this.getProductInfoList();
    }

    async getPromotionInfo() {
        let { pid } = this.location.params

        let searchParams = {
            promotionIdOrName: pid,
            pageNo:1,
            pageSize:5,
            status: 0
        }

        let { salesPromotionList } = await this.postApi('/marketing/getSalesProInfos', searchParams )
        this.mergeToState({ promotionInfo:salesPromotionList[0]})
    }

    async getRelatedCount(){
        const { pid } = this.location.params
        const {promotionInfo:{productCateList=[]}={}} = this.store.getState()
        let res = await this.postApi('/marketing/getProductInfos', {productType: productCateList.map((item)=>item.categoryId),salesPromotionId:parseFloat(pid),} )
        let {totalCount } = res;
        this.mergeToState({ relatedCount:totalCount})
    }

    async getProductInfoList(searchParams={}) {
        const { pid } = this.location.params
        const {pageSize,pageNo,promotionInfo:{productCateList=[]}={}} = this.store.getState()

        let searchData = {
            pageNo,
            pageSize,
            productType: 0,
            salesPromotionId:0,
            ...searchParams
        }
        searchData.salesPromotionId =  parseFloat(pid)

        if(searchData.productType == 0){
            searchData.productType =  productCateList.map((item)=>item.categoryId)
        }else {
            searchData.productType = [searchData.productType]
        }
        let res = await this.postApi('/marketing/getProductInfos', searchData )
        let { productProInfos,totalCount } = res;
        this.mergeToState({ productList:productProInfos,totalCount})
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



    //批量关联已选择的资源
    handleRelateCurrentCoupons = () => {
        let { language } = this.store.getState()
        Confirm({
    		title:language["salespromotion.sure_you_want_cancel"],
    		onOk:() =>{
                // console.log('已选择',this._getCurrentPageRelateProduct())
    			this.handleRelatePromotionProduct({
                    relatetype: 1,
                    salesPromotionOptionList: this._getCurrentPageRelateProduct()
    			})
    		}
    	})
        
    }

    //批量取消关联当前页产品
    handlerUnbindCurrentCoupons = () => {
        let { language } = this.store.getState()
    	Confirm({
    		title:language["salespromotion.whether_cancel_selected"],
    		onOk:() =>{
    			this.handleRelatePromotionProduct({
                    relatetype: 0,
                    salesPromotionOptionList:this._getCurrentPageRelateProduct()
    			})
    		}
    	})   
    }

    //获取已选择的 资源列表[{productId,optionId}]
    _getCurrentPageRelateProduct = () => {
        let { productList } = this.store.getState();

        let selectedList = productList.filter((item)=>{
                return !!item.optionInfos
        }).map((item=>{
            return item.optionInfos.filter((opt)=>opt.selected).map((opt)=>{
                return {optionId:opt.optionId,productId:item.productId}
            })
        }))

        console.log(selectedList)
        let result = Array.prototype.concat.apply([], selectedList);
        return result
    }


    // 关联或取消关联产品
    handleRelatePromotionProduct = async (params,itemList) => {
        let { language } = this.store.getState()
        let { productList } = this.store.getState()
        // let { productRuleList } = params
        let { pid } = this.location.params
        console.log('params',params)
        params.salesPromotionOptionList = params.salesPromotionOptionList.map((item)=>{return{...item,salesPromotionId:parseFloat(pid)}})

        this.store.actions.setSpinning(true);

        const relatePromotionProduct = await this.resHandler(() => {
            return this.post('saveSalesPromotionOption', params)
        }, (res) => {
            // console.log('saveSalesPromotionOption成功',res)
            let { relatetype } = params //relatetype操作类型，	0取消关联 1关联

            message.success(`${!!relatetype?language["salespromotion.related"]:language["salespromotion.disassociate"]+language["salespromotion.success"]}`)
            if(itemList) {
                for(let item of itemList ){ //这里的item是 产品下面的 可选项对象
                    item.linkStatus = !!relatetype
                }
            }else {
                productList.forEach((item)=>{
                    if(!!item.optionInfos&&item.optionInfos.length>0){
                        item.optionInfos.forEach((opt)=>{
                            if(opt.selected)
                                item.linkStatus = !!relatetype
                        })
                    }
                })

                //this.getProductInfoList();
            }

            this.mergeToState({productList})
            return true
        }, (fail) => {
            console.log('saveSalesPromotionOption_fail', fail)
            const {customerErrorMessage} = fail
            message.error(customerErrorMessage)
            return false

        }, { name: 'saveSalesPromotionOption' })

        this.store.actions.setSpinning(false);
        return relatePromotionProduct
    }


    /*收起展开详情*/
    handleToggle = ()=>{
        const {panelShow} = this.store.getState()
        this.mergeToState({
            panelShow:!panelShow
        })
    }
    /*记录详情面板展开状态*/
    handleSaveExpand=()=>{
        const {panelShow} = this.store.getState()

        this.setPageOptions({panelShow})
    }

    handleGetOptionInfo = async (item)=>{
        const {productList,location:{params:{pid}}} = this.store.getState()
        const {optionIds} = item
        await this.resHandler(() => {
            return this.post('/marketing/getOptionInfos', {salesPromotionId:parseFloat(pid),optionIds})
        }, (res) => {
            // console.log('getVendorProduct_respon', res)

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
            await this.getRelatedPromoList(optInfo);
        }
    }

    async getRelatedPromoList({optionId,productId}){
        let { language } = this.store.getState()
        
        await this.resHandler(
            () => this.post( '/marketing/getSalesProInfos', { optionId,status:0,parentId:productId } ),
            ( res ) => {
                console.log( 'getSalesPromotionInfoList', res )
                this.mergeToState( {
                    relatedPromotionList:res.salesPromotionList,
                } )
            },
            ( fail ) => {
                console.log( fail )
                const {customerErrorMessage} = fail
                message.error(customerErrorMessage||language["salespromotion.failed_get_information"])
            },
            { name:'relate_getSalesPromotionInfoList' }
        )
    }

}