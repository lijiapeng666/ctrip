import Mock from 'mockjs'

const Random = Mock.Random

export default class MockApi {
    // 查询供应商产品信息
    static getVendorProduct = (params={}) => {

        const {pageSize = 20} = params;

        // const totalCount = Random.integer(100,500);

        const item = {
            'productId': '@integer(10000,999999)',
            'productName': '@cword(5,20)',
            'categoryName': '@cword(4,6)',
            'categoryId': '@integer(1,999)',
            'isOnline|1': true,
            'bookingContact': '@cname',
            'destinationCityName': '@city(false)(中国)',
            'departureCityName': '@city(false)(中国)',
            'isRelated|1': false,
            'loading':false,
            'optionList|0-2': [
                {
                    'optionId':'@integer(10000,999999)',
                    'optionName':'@cword(5,30)',
                    'optionType|0-1':0
                }
            ]
        }

        let template = {
            'totalPage':'@integer(1,5)',
            'totalCount':999, 
            [`productList|${pageSize}`]:[item], //根据pageSize随机数生成对应数量item
        }

        return Mock.mock(template)
    }


    // 创建、取消优惠券产品关联信息
    static relatePromotionProduct = (params={}) => {
        // type资源类型，1-资源品类/产品形态，2-大区，3-酒店目的地联想，4-景点联想，5-供应商度假品牌 6-供应商玩乐产品品类  7-攻略目的地联想
        const {type} = params

        let template = {
            'resultStatus':{
                'IsSuccess|1-9':false,
                'CustomerErrorMessage':'这里是错误提示@cword(5,10)',
            }
        }

        if(type == 3){
            template = {
                ...template,
                'sourceList':{
                    'sourceContent|10':[
                        {'value':'@integer(1,999)',
                        'name':'@city(false)'}
                    ]
                }
            }
        }

        return Mock.mock(template)
    }

    // 获取公共资源
    static getPublicSource = (params={}) => {
        let template = {
            'resultStatus':{
                'IsSuccess|1-9':false,
                'CustomerErrorMessage':'这里是错误提示@cword(5,10)',
            },
            'sourceList':{

            }
        }

        return Mock.mock(template)
    }


    static getVendorPromotionList = (params = {}) => {

        const totalCount = Random.integer(1, 100);

        const item = {
            'id': '@integer(10000,999999)',
            'name': '@cword(5,7)',//供应商填写名称
            'displayName': '@cword(4,6)',//优惠活动显示名称
            'promotionId': '@integer(10000,999999)',
            'startDisplayDate': '@date()',
            'endDisplayDate': '@date()',
            'total': '@integer(0,10)',
            'vendorId': '@integer(10000,999999)',
            'type': '@pick(["Product", "Vendor"])',
            'remark': '@cword(5,30)',
            'limitTimeTypeId': '@integer(0,2)',
            'unitTypeId': '@integer(1,2)',
            'deductionStrategyTypeId': '@integer(1,3)',
            'uidUseCount': '@integer(0,100)',
            'isDispaly': '@boolean()',
            'closeReasonCode': '@integer(0,3)',//不明确
            'lineType': '@integer(0,3)',
            'brandId': '@integer(10000, 999999)',
            'brandName': '@cword(4,6)',
            'isActive': '@boolean()',
            'status': '@integer(1,4)',
            'createUser': '@cname()',
            'createTime': '@date()',
        }

        let template = {
            'totalPage': Math.ceil(totalCount / 20),
            'totalCount': totalCount,
            // 'productList|50-200':[item],
            // 'testt':function(){
            //     let data = Mock.mock(item)
            //     return data
            // }
        }
        template[`vendorPromotionList|${totalCount}`] = [item] //根据totalCount随机数生成对应数量item

        return Mock.mock(template)
    }
}
