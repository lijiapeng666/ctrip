/* jshint esversion:6 */
import Controller from '../../shared/PageController'
import View from './View'
import * as Model from './Model'
import { Map } from 'core-js'
import { config } from '../../../shared/util/route'

export default class extends Controller {
    SSR=false
    pageId = 10650025051
    View = View
    Model = Model
    requireLogin = true
    requireUserInfo = true
    shark = false
    pageName = ["salespromotion"]
    async componentDidMount () {
        await this.handlerInitProps();
        await this.handlerInitControlDetail();
    }

    filterDisplay(v){
        const {config}=this.store.getState()
        var result = v.filter(function (item) {
            if(config.includes(item.code)){
                  return item.code
            }
        });
        return result
    }

    handlerInitProps = async ()=> {
        let localeResult =  await this.postApi('/marketing/getCommonSource', {
            "group":"locale",
            
        });
        let listResult =  await this.postApi('/marketing/getCommonSource', {
            "group":"106",
        });
        await this.getTemplatesId();
        const displayRule= this.filterDisplay(listResult.commonSourceList)

        let siteLan = [];
        if(localeResult.commonSourceList !== undefined && localeResult.commonSourceList.length > 0){
            localeResult.commonSourceList.forEach(function (item, index) {
                //
                if(item.code !== undefined) {
                    siteLan.push({"label":item.code,"value":item.code})
                }
            })
        }

        let cateResult = await this.postApi('/marketing/getProductCates', {});

        this.mergeToState({siteLan:siteLan, productCategoy: cateResult ? cateResult.productCategoryList : [],listResult:displayRule} );

    }
    
    getTemplatesId = async () => {
        try {
          const config = await this.fetchQConfig(
            'filterCode',
          );
         await this.mergeToState({
            config:config.code
          })
         
        } catch (e) {
          console.log('error', e);
          let errmsg = e.toString();
          this.addClog(
            'warn',
            'fetchQConfig TemplatesId api catch error',
            { errmsg },
            { api: `qconfig/TemplatesId` }
          );
        }
      
      };


    handlerInitControlDetail = async ()=> {
        let {id} = this.location.params;
        if(id !== 'add'){
            let searchParam = {
                id: id,
                pageNo: 1,
                pageSize: 10,
                
            }
            let result = await this.postApi('/marketing/queryPromotionTemplate', searchParam);
            console.log(result,"11111")
            if(result && result.promotionTemplateList !== null && result.promotionTemplateList.length > 0){
                let template = result.promotionTemplateList[0];
                let control = template.promotionControl;
                let promotionControl = await this.buildControlValue(control);
                let controlValueScope = JSON.parse(template.controlValueScope);
                let templateValue = JSON.parse(template.templateValue);
                let promotionControlList = [];
                let channel = template.channel;
                if(channel && channel !== 0){
                    let result = await this.postApi('/marketing/queryPromotionControl', {channel : template.channel,});
                    console.log("result",result)
                    if(result && result.promotionControlList){
                        promotionControlList = result.promotionControlList;
                    }
                }
                this.mergeToState(
                    {
                        promotionTemplate: {
                            ...template,
                            canEdit: template.status === 0,
                        },
                        promotionControlList: promotionControlList,
                        promotionControl: promotionControl,
                        templateValue: templateValue,
                        controlValueScope: controlValueScope,
                    }
                )

                let ds = controlValueScope.ds ? controlValueScope.ds : {};
                let qs = controlValueScope.qs ? controlValueScope.qs : {};
                let rs = controlValueScope.rs ? controlValueScope.rs : {};
                if(promotionControl.isuncon){
                    if(promotionControl.uncon.indexOf('d') > -1){
                        if(ds.non){
                            this.mergeToState({
                                unconDiscountSet: true,
                                unconDiscount: {
                                    customDisList: ds.non.optional,
                                    discountCustom: ds.non.custom && ds.non.custom !== '' && ds.non.custom.indexOf('-') > -1 ? true : false,
                                    discountStart: ds.non.custom ? ds.non.custom.substr(0, ds.non.custom.indexOf('-')) : '',
                                    discountEnd: ds.non.custom ? ds.non.custom.substr(ds.non.custom.indexOf('-') + 1) : '',
                                },
                                discountCustomShowSwitch: channel && channel === 1,
                                discountCustomSwitch: ds.non.optional && ds.non.optional.length > 0,
                            })
                        }
                    }
                    if(promotionControl.uncon.indexOf('r') > -1){
                        if(rs.non && rs.non.length > 0){
                            this.mergeToState({
                                unconReduceSet: true,
                                unconReduce: {
                                    reduceCurrency: rs.non[0].currency,
                                    reduceMinAmount: rs.non[0].amount,
                                },
                            })
                        }
                    }
                }
                if(promotionControl.isfull){
                    this.mergeToState({
                        fullScopeSet: true,
                        fullScope: {
                            scopeStart: qs.full ? qs.full.substr(0, qs.full.indexOf('-')) : '',
                            scopeEnd: qs.full ? qs.full.substr(qs.full.indexOf('-') + 1) : '',
                        }
                    })
                    if(promotionControl.full.indexOf('d') > -1){
                        if(ds.full){
                            this.mergeToState({
                                fullDiscountSet: true,
                                fullDiscount: {
                                    customDisList: ds.full.optional,
                                    discountCustom: ds.full.custom && ds.full.custom !== '' && ds.full.custom.indexOf('-') > -1 ? true : false,
                                    discountStart: ds.full.custom ? ds.full.custom.substr(0, ds.full.custom.indexOf('-')) : '',
                                    discountEnd: ds.full.custom ? ds.full.custom.substr(ds.full.custom.indexOf('-') + 1) : '',
                                },
                                discountCustomShowSwitch: true,
                            })
                        }
                    }
                    if(promotionControl.full.indexOf('r') > -1){
                        if(rs.full && rs.full.length > 0){
                            this.mergeToState({
                                fullReduceSet: true,
                                fullReduce: {
                                    reduceCurrency: rs.full[0].currency,
                                    reduceMinAmount: rs.full[0].amount,
                                },
                            })
                        }
                    }
                }
                if(promotionControl.iseach){
                    this.mergeToState({
                        eachScopeSet: true,
                        eachScope: {
                            scopeStart: qs.each ? qs.each.substr(0, qs.each.indexOf('-')) : '',
                            scopeEnd: qs.each ? qs.each.substr(qs.each.indexOf('-') + 1) : '',
                        }
                    })
                    if(promotionControl.each.indexOf('r') > -1){
                        if(rs.each && rs.each.length > 0){
                            this.mergeToState({
                                eachReduceSet: true,
                                eachReduce: {
                                    reduceCurrency: rs.each[0].currency,
                                    reduceMinAmount: rs.each[0].amount,
                                },
                            })
                        }
                    }
                }
                if(promotionControl.isladder){
                    this.mergeToState({
                        ladderScopeSet: true,
                        ladderScope: {
                            scopeStart: qs.ladder ? qs.ladder.substr(0, qs.ladder.indexOf('-')) : '',
                            scopeEnd: qs.ladder ? qs.ladder.substr(qs.ladder.indexOf('-') + 1) : '',
                        }
                    })
                    if(promotionControl.ladder.indexOf('d') > -1){
                        if(ds.ladder){
                            this.mergeToState({
                                ladderDiscountSet: true,
                                ladderDiscount: {
                                    customDisList: ds.ladder.optional,
                                    discountCustom: ds.ladder.custom && ds.ladder.custom !== '' && ds.ladder.custom.indexOf('-') > -1 ? true : false,
                                    discountStart: ds.ladder.custom ? ds.ladder.custom.substr(0, ds.ladder.custom.indexOf('-')) : '',
                                    discountEnd: ds.ladder.custom ? ds.ladder.custom.substr(ds.ladder.custom.indexOf('-') + 1) : '',
                                },
                                discountCustomShowSwitch: true,
                            })
                        }
                    }
                    if(promotionControl.ladder.indexOf('r') > -1){
                        if(rs.ladder && rs.ladder.length > 0){
                            this.mergeToState({
                                ladderReduceSet: true,
                                ladderReduce: {
                                    reduceCurrency: rs.ladder[0].currency,
                                    reduceMinAmount: rs.ladder[0].amount,
                                },
                            })
                        }
                    }
                }
            }
        }else{
            this.resetControl({});
        }
    }


    handlerSaveTemplate = async (saveParam)=> {
        console.log("saveParam",saveParam)
        return await this.postApi('/marketing/savePromotionTemplate', saveParam);
    }

    handlerChangeDisplay = async (changeParam) =>{
        this.mergeToState({
            ...changeParam,
        })
    }

    handlerChangeChannel = async (channel)=> {
        let promotionControlList = [];
        if(channel && channel !== 0){
            let result = await this.postApi('/marketing/queryPromotionControl', {channel : channel,});
            if(result && result.promotionControlList){
                promotionControlList = result.promotionControlList;
            }
        }
        this.mergeToState({
            promotionControl: [],
            promotionControlList: promotionControlList,
            discountCustomShowSwitch: channel === 1,
        })
    }

    handlerChangeControl = async (controlId, recontrolId) => {
        let promotionControl = [];
        if(controlId && controlId !== 0){
            let result = await this.postApi('/marketing/queryPromotionControl', {id : controlId,});
            if(result && result.promotionControlList && result.promotionControlList.length > 0){
                let control = result.promotionControlList[0];
                promotionControl = await this.buildControlValue(control);
            }
            if(recontrolId !== 0 && controlId === recontrolId){
                this.mergeToState({
                    controlValueScope: JSON.parse(this.store.getState().promotionTemplate.controlValueScope),
                    templateValue: JSON.parse(this.store.getState().promotionTemplate.templateValue),
                })
            }else if(recontrolId !== 0 && controlId !== recontrolId){
                this.mergeToState({
                    controlValueScope: {},
                    templateValue: {},
                })
            }
        }
        this.resetControl(promotionControl);
    }

    resetControl = (promotionControl)=>{
        this.mergeToState({
            promotionControl: promotionControl,
            unconDiscountSet: false,
            unconDiscount: {},
            fullDiscountSet: false,
            fullDiscount: {},
            ladderDiscountSet: false,
            ladderDiscount: {},
            discountType: '',
            discount: {},
            discountModalSwitch: false,
            reduceModalSwitch: false,
            reduceType: '',
            reduce: {},
            unconReduceSet: false,
            unconReduce: {},
            fullReduceSet: false,
            fullReduce: {},
            eachReduceSet: false,
            eachReduce: {},
            ladderReduceSet: false,
            ladderReduce: {},
            scopeModalSwitch: false,
            scope: {},
            scopeType: '',
            fullScopeSet: false,
            fullScope: {},
            eachScopeSet: false,
            eachScope: {},
            ladderScopeSet: false,
            ladderScope: {},
            ruleFiledShow: false,
        })
    }

    buildControlValue = async (control)=> {
        let promotionControl = [];
        let value = control.controlValue ? JSON.parse(control.controlValue) : {};
        promotionControl = {
            ...control,
            channel1: control.channel ? control.channel.indexOf(1) > -1 : false,
            channel2: control.channel ? control.channel.indexOf(2) > -1 : false,
            siteLan: value.siteLan,
            ud: value.ud && value.ud.indexOf('n') > -1 ? ['n'] : [],//一期只有不限时间，排除其他值
        }

        let pc = value.pc ? value.pc : {};
        let isnopro = pc.nopro && pc.nopro.indexOf('y') > -1;
        let isuncon = pc.uncon && pc.uncon.length > 0;
        let qty = pc.byQty ? pc.byQty : [];
        let full = [], each = [], ladder = [];
        qty.forEach(function (item, index) {
            if(item.full !== undefined){
                full = item.full;
            }else if(item.each !== undefined){
                each = item.each;
            }else if(item.ladder !== undefined){
                ladder = item.ladder;
            }
        })
        let isfull = full && full.length > 0;
        let iseach = each && each.length > 0;
        let isladder = ladder && ladder.length > 0;
        let isqty = isfull || iseach || isladder;
        let byqty = [];
        if(isfull){
            byqty = byqty.concat('full');
        }
        if(iseach){
            byqty = byqty.concat('each');
        }
        if(isladder){
            byqty = byqty.concat('ladder');
        }
        let prolimit = [];
        if(isnopro){
            prolimit = prolimit.concat('nopro');
        }
        if(isuncon){
            prolimit = prolimit.concat('uncon');
        }
        if(isqty){
            prolimit = prolimit.concat('qty');
        }

        let productstocklimit = value.productstocklimit ? value.productstocklimit : [];
        let nolimit, limit = [];
        productstocklimit.forEach(function (item, index) {
            if(item.nolimit !== undefined){
                nolimit = item.nolimit;
            }else if(item.limit !== undefined){
                limit = item.limit;
            }
        })
        let isnolimit = nolimit && nolimit.indexOf('y') > -1;
        let islimit = limit && limit.length > 0;
        let stocklimit = [];
        if(isnolimit){
            stocklimit = stocklimit.concat('nolimit');
        }
        if(islimit){
            stocklimit = stocklimit.concat('limit');
        }

        promotionControl = {
            ...promotionControl,
            isnopro: isnopro,
            isuncon: isuncon,
            uncon: pc.uncon,
            isqty: isqty,
            isfull: isfull,
            iseach: iseach,
            isladder: isladder,
            full: full,
            each: each,
            ladder: ladder,
            byqty: byqty,
            prolimit: prolimit,
            isnolimit: isnolimit,
            islimit: islimit,
            limit: limit,
            stocklimit: stocklimit,
            isstocklimit: isnolimit || islimit,
            isunconstock: pc.unconstock && pc.unconstock.length > 0,
            isbyQtystock: pc.byQtystock && pc.byQtystock.length > 0,
            unconstock: pc.unconstock,
            byQtystock: pc.byQtystock,
        }
        return promotionControl;
    }

    handlerShowModal = async (modalName) => {
        if(modalName === 'uncondiscount'){
            this.mergeToState({
                discountModalSwitch: true,
                discountType: 'uncon',
                discount: {...this.store.getState().unconDiscount},
                discountCustomSwitch: this.store.getState().unconDiscount.discountCustom === undefined || this.store.getState().unconDiscount.discountCustom,
            })
        }else if(modalName === 'fulldiscount'){
            this.mergeToState({
                discountModalSwitch: true,
                discountType: 'full',
                discount: {...this.store.getState().fullDiscount},
                discountCustomSwitch: this.store.getState().fullDiscount.discountCustom === undefined || this.store.getState().fullDiscount.discountCustom,
            })
        }else if(modalName === 'ladderdiscount'){
            this.mergeToState({
                discountModalSwitch: true,
                discountType: 'ladder',
                discount: {...this.store.getState().ladderDiscount},
                discountCustomSwitch: this.store.getState().ladderDiscount.discountCustom === undefined || this.store.getState().ladderDiscount.discountCustom,
            })
        }else if(modalName === 'unconreduce'){
            this.mergeToState({
                reduceModalSwitch: true,
                reduceType: 'uncon',
                reduce: {...this.store.getState().unconReduce},
            })
        }else if(modalName === 'fullreduce'){
            this.mergeToState({
                reduceModalSwitch: true,
                reduceType: 'full',
                reduce: {...this.store.getState().fullReduce},
            })
        }else if(modalName === 'eachreduce'){
            this.mergeToState({
                reduceModalSwitch: true,
                reduceType: 'each',
                reduce: {...this.store.getState().eachReduce},
            })
        }else if(modalName === 'ladderreduce'){
            this.mergeToState({
                reduceModalSwitch: true,
                reduceType: 'ladder',
                reduce: {...this.store.getState().ladderReduce},
            })
        }else if(modalName === 'fullscope'){
            this.mergeToState({
                scopeModalSwitch: true,
                scopeType: 'full',
                scope: {...this.store.getState().fullScope},
            })
        }else if(modalName === 'eachscope'){
            this.mergeToState({
                scopeModalSwitch: true,
                scopeType: 'each',
                scope: {...this.store.getState().eachScope},
            })
        }else if(modalName === 'ladderscope'){
            this.mergeToState({
                scopeModalSwitch: true,
                scopeType: 'ladder',
                scope: {...this.store.getState().ladderScope},
            })
        }
    }

    handlerCloseModal = async (modalName) => {
        if(modalName === 'discount'){
            this.mergeToState({
                discountModalSwitch: false,
                discountCustomSwitch: true,
            })
        }else if(modalName === 'reduce'){
            this.mergeToState({
                reduceModalSwitch: false,
            })
        }else if(modalName === 'scope'){
            this.mergeToState({
                scopeModalSwitch: false,
            })
        }
    }

    handlerModalSet = async (modalName, modalValue)=>{
        if(modalName === 'discount'){
            if(this.store.getState().discountType === 'full'){
                this.mergeToState({
                    discountModalSwitch: false,
                    discountType: '',
                    fullDiscountSet: true,
                    fullDiscount: modalValue,
                })
            }else if(this.store.getState().discountType === 'ladder'){
                this.mergeToState({
                    discountModalSwitch: false,
                    discountType: '',
                    ladderDiscountSet: true,
                    ladderDiscount: modalValue,
                })
            }else if(this.store.getState().discountType === 'uncon'){
                this.mergeToState({
                    discountModalSwitch: false,
                    discountType: '',
                    unconDiscountSet: true,
                    unconDiscount: modalValue,
                })
            }
        }else if(modalName === 'reduce'){
            let reduceType = this.store.getState().reduceType;
            if(reduceType === 'uncon'){
                this.mergeToState({
                    reduceModalSwitch: false,
                    reduceType: '',
                    unconReduceSet: true,
                    unconReduce: modalValue,
                })
            }else if(reduceType === 'full'){
                this.mergeToState({
                    reduceModalSwitch: false,
                    reduceType: '',
                    fullReduceSet: true,
                    fullReduce: modalValue,
                })
            }else if(reduceType === 'each'){
                this.mergeToState({
                    reduceModalSwitch: false,
                    reduceType: '',
                    eachReduceSet: true,
                    eachReduce: modalValue,
                })
            }else if(reduceType === 'ladder'){
                this.mergeToState({
                    reduceModalSwitch: false,
                    reduceType: '',
                    ladderReduceSet: true,
                    ladderReduce: modalValue,
                })
            }
        }else if(modalName === 'scope') {
            let scopeType = this.store.getState().scopeType;
            if (scopeType === 'full') {
                this.mergeToState({
                    scopeModalSwitch: false,
                    scopeType: '',
                    fullScopeSet: true,
                    fullScope: modalValue,
                })
            } else if (scopeType === 'each') {
                this.mergeToState({
                    scopeModalSwitch: false,
                    scopeType: '',
                    eachScopeSet: true,
                    eachScope: modalValue,
                })
            } else if (scopeType === 'ladder') {
                this.mergeToState({
                    scopeModalSwitch: false,
                    scopeType: '',
                    ladderScopeSet: true,
                    ladderScope: modalValue,
                })
            }
        }
    }

    handlerChangeShowSwitch = async (showName, value) =>{
        if(showName === 'discountCustom'){
            this.mergeToState({
                discountCustomSwitch: value,
            })
        }
    }

    handlerForward = async (path)=> {
        this.forward(path, {});
    }
}
