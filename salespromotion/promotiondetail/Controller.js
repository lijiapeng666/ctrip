/* jshint esversion:6 */

import Controller from '../../shared/PageController'
import View from './View'
import * as Model from './Model'
// import MockApi from '../api/mock'
import { message, Modal } from 'antd/lib';
const Confirm = Modal.confirm;


export default class extends Controller {
    SSR = false;
    pageId = this.location.params.type == 1 ? 10650025094 : 10650025097;
    View = View;
    Model = Model;
    requireLogin = true
    requireUserInfo = true
    shark = false
    pageName = ["salespromotion"]
    async componentDidMount() {
        this.getPromotionInfo();
        this.getProductInfoList();
    }

    async getPromotionInfo() {
        let { pid } = this.location.params

        let searchParams = {
            promotionIdOrName: pid,
            pageNo: 1,
            pageSize: 5,
            status: 0
        }

        let { salesPromotionList } = await this.postApi('/marketing/getSalesProInfos', searchParams)
        salesPromotionList = this.FormatPromitionList(salesPromotionList)

        let { relatedOptionQty = 0 } = salesPromotionList[0] || {}
        this.mergeToState({ promotionInfo: salesPromotionList[0], relatedCount: relatedOptionQty })
    }

    async getProductInfoList(searchParams = {}) {
        const { pid } = this.location.params
        const { pageSize, pageNo, promotionInfo: { productCateList = [] } = {} } = this.store.getState()

        let searchData = {
            pageNo,
            pageSize,
            productType: 0,
            salesPromotionId: 0,
            ...searchParams
        }
        searchData.salesPromotionId = parseFloat(pid)

        if (searchData.productType == 0) {
            searchData.productType = productCateList.map((item) => item.categoryId)
        } else {
            searchData.productType = [searchData.productType]
        }
        let res = await this.postApi('/marketing/getProductInfos', searchData)
        let { productProInfos, totalCount } = res;
        this.mergeToState({ productList: productProInfos, totalCount })

        setTimeout(() => this.mergeToState({ expandedRowKeys: [] }), 100)
    }

    handleSubmitSearchForm = async (data = {}) => {
        let { searchParams, pageSize, pageNo } = this.store.getState();

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
        this.mergeToState({ pageNo: pageIndex, pageSize })
        this.handleSubmitSearchForm()
    }

    // 变更上下页、指定页码
    handleChangeCurrentPage = (pageIndex, pageSize) => {
        this.mergeToState({ pageNo: pageIndex, pageSize })
        this.handleSubmitSearchForm()
    }



    //批量关联已选择的资源
    handleRelateCurrentCoupons = () => {
        let { language } = this.store.getState()

        Confirm({
            title: language["salespromotion.sure_you_want_cancel"],
            onOk: () => {
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
            title: language["salespromotion.whether_cancel_selected"],
            onOk: () => {
                this.handleRelatePromotionProduct({
                    relatetype: 0,
                    salesPromotionOptionList: this._getCurrentPageRelateProduct()
                })
            }
        })
    }

    //获取已选择的 资源列表[{productId,optionId}]
    _getCurrentPageRelateProduct = () => {
        let { productList } = this.store.getState();

        let selectedList = productList.filter((item) => {
            return !!item.optionInfos
        }).map((item => {
            return item.optionInfos.filter((opt) => opt.selected).map((opt) => {
                return { optionId: opt.optionId, productId: item.productId }
            })
        }))

        console.log(selectedList)
        let result = Array.prototype.concat.apply([], selectedList);
        return result
    }


    // 关联或取消关联产品
    handleRelatePromotionProduct = async (params, itemList) => {
        let { productList, language } = this.store.getState()
        // let { productRuleList } = params
        let { pid } = this.location.params
        console.log('params', params)
        params.salesPromotionOptionList = params.salesPromotionOptionList.map((item) => { return { ...item, salesPromotionId: parseFloat(pid) } })

        this.store.actions.setSpinning(true);

        const relatePromotionProduct = await this.resHandler(() => {
            return this.post('saveSalesPromotionOption', params)
        }, (res) => {
            // console.log('saveSalesPromotionOption成功',res)
            let { relatetype } = params //relatetype操作类型，	0取消关联 1关联

            message.success(`${!!relatetype ? language["salespromotion.related"] : language["salespromotion.disassociate"] + language["salespromotion.success"]}`)
            if (itemList) {
                for (let item of itemList) { //这里的item是 产品下面的 可选项对象
                    item.linkStatus = !!relatetype
                }
            } else {
                productList.forEach((item) => {
                    if (!!item.optionInfos && item.optionInfos.length > 0) {
                        item.optionInfos.forEach((opt) => {
                            if (opt.selected)
                                item.linkStatus = !!relatetype
                        })
                    }
                })

                //this.getProductInfoList();
            }

            this.mergeToState({ productList })
            return true
        }, (fail) => {
            console.log('saveSalesPromotionOption_fail', fail)
            const { customerErrorMessage } = fail
            message.error(customerErrorMessage)
            return false

        }, { name: 'saveSalesPromotionOption' })

        this.store.actions.setSpinning(false);
        return relatePromotionProduct
    }


    /*收起展开详情*/
    handleToggle = () => {
        const { panelShow } = this.store.getState()
        this.mergeToState({
            panelShow: !panelShow
        })
    }
    /*记录详情面板展开状态*/
    handleSaveExpand = () => {
        const { panelShow } = this.store.getState()

        this.setPageOptions({ panelShow })
    }

    handleChangeExpandedRows = (expandedRowKeys) => {
        // console.log('表格上展开的行',expandedRowKeys)
        this.mergeToState({
            expandedRowKeys
        })
    }

    handleGetOptionInfo = async (item) => {
        const { productList, location: { params: { pid } } } = this.store.getState()
        const { optionIds } = item
        await this.resHandler(() => {
            return this.post('/marketing/getOptionInfos', { salesPromotionId: parseFloat(pid), optionIds })
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

    handleToggleLogModal = async (optInfo) => {
        const { modalShow } = this.store.getState()
        this.mergeToState({
            modalShow: !modalShow
        })
        if (optInfo) {
            this.mergeToState({ currentOptInfo: optInfo })
            await this.getRelatedPromoList(optInfo);
        }
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

    async getRelatedPromoList({ optionId, productId }) {
        let { language } = this.store.getState()

        await this.resHandler(
            () => this.post('/marketing/getSalesProInfos', { optionId, status: 0, parentId: productId }),
            (res) => {
                const { salesPromotionList, totalCount, loginResult: { userInfo: { userType } = {} } = {} } = res
                console.log('getSalesPromotionInfoList', res)
                this.mergeToState({
                    relatedPromotionList: salesPromotionList,
                })
                console.log("relatedPromotionList", relatedPromotionList)
            },
            (fail) => {
                console.log(fail)
                const { customerErrorMessage } = fail
                message.error(customerErrorMessage || language["salespromotion.failed_get_information"])
            },
            { name: 'relate_getSalesPromotionInfoList' }
        )
    }

}