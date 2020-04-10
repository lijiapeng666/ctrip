import _ from 'lodash'

export const initialState = {
    spinning: false,
    count: 0,
    loginType: null,
    totalCount:0,
    relatedCount:0,
    searchParams: {},
    productList: [],
    pageSize:10, //每页条数
    pageNo: 1, //当前页数
    hotelCityList: [],
    destinationCityList: [],
    departureCityList: [],
    categoryIdList:[],
    productRule:{},//弹层产品规则信息
    modalVisible:false,//是否显示弹层
    searchTempResult: [], //搜索联想结果
    cityAll:true,
    scheduleDaysCheckAll:true,
    status:0,
    productType:0,
    promotionInfo:{},
    modalShow:false,
    currentOptInfo:{}

}

export const setSearchData = (state, searchData) => {
    return {
        ...state,
        searchData
    }
}
export const setSpinning = (state, spinning) => {
    return {
        ...state,
        spinning
    }
}

export const concatProductList = (state, productItem) => {
    if(state.productList){
        return {
            ...state,
            productList:_.uniqBy(state.productList.concat(productItem),function (value) {
                return value.productId
            })
        }
    }else {
        return false
    }
}

export const updateHotelCityList = (state, hotelCityList)=>{
    return {
        ...state,
        hotelCityList
    }
}

export const updateDestinationCityList = (state, destinationCityList)=>{
    return {
        ...state,
        destinationCityList
    }
}

export const updateDepartureCityList = (state, departureCityList)=>{
    return {
        ...state,
        departureCityList
    }
}

export const updateCategoryIdList = (state, categoryIdList)=>{
    // console.log('updateCategoryIdList',categoryIdList)
    return {
        ...state,
        categoryIdList
    }
}

export const setModalVisible = (state, modalVisible)=>{
    return {
        ...state,
        modalVisible
    }
}

export const setCityAll = (state, cityAll)=>{
    return {
        ...state,
        cityAll
    }
}

export const setScheduleDaysCheckAll = (state, scheduleDaysCheckAll)=>{
    return {
        ...state,
        scheduleDaysCheckAll
    }
}