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
        await this.handlerInitSiteLan()
        await this.handlerInitControlDetail()
    }

    handlerInitSiteLan = async ()=> {
        let result =  await this.postApi('/marketing/getCommonSource', {
            "group":"locale"
        });
        let siteLan = [];
        if(result.commonSourceList !== undefined && result.commonSourceList.length > 0){
            result.commonSourceList.forEach(function (item, index) {
                if(item.code !== undefined) {
                    siteLan.push({"label":item.code,"value":item.code})
                }
            })
        }
        this.mergeToState({siteLan:siteLan} );

    }
    handlerInitControlDetail = async ()=> {
        let {id} = this.location.params;
        if(id !== 'add'){
            let searchParam = {
                id: id,
                pageNo: 1,
                pageSize: 10,
            }
            let result = await this.postApi('/marketing/queryPromotionControl', searchParam);
            console.log(result)
            console.log( JSON.parse(result.promotionControlList[0].controlValue).pc.byQty)
            if(result.promotionControlList !== undefined && result.promotionControlList.length > 0){
                let control = result.promotionControlList[0];
                let value = control.controlValue ? JSON.parse(control.controlValue) : {};
                let promotionControl = {
                    ...control,
                    canEdit: !(control.templateIdList && control.templateIdList.length > 0),
                    channel1: control.channel ? control.channel.indexOf(1) > -1 : false,
                    channel2: control.channel ? control.channel.indexOf(2) > -1 : false,
                    siteLan: value.siteLan ,
                    ud: value.ud && value.ud.indexOf('n') > -1 ? ['n'] : [],//一期只有不限时间，排除其他值
                }

                let pc = value.pc ? value.pc : {};
                if(promotionControl.channel1 && promotionControl.channel2){//取并集，只有无门槛折扣
                    let isuncon = pc.uncon && pc.uncon.indexOf('d') > -1;
                    promotionControl = {
                        ...promotionControl,
                        isuncon: isuncon,
                        uncon: isuncon ? ['d'] : [],
                        prolimit : isuncon ? ['uncon'] : [],
                    }
                }
                else if(promotionControl.channel2){
                    let isnopro = pc.nopro && pc.nopro.indexOf('y') > -1;
                    let isuncon = pc.uncon && pc.uncon.indexOf('d') > -1;
                    let prolimit = [];
                    if(isnopro){
                        prolimit = prolimit.concat('nopro');
                    }
                    if(isuncon){
                        prolimit = prolimit.concat('uncon');
                    }

                    let productstocklimit = value.productstocklimit ? value.productstocklimit : [];
                    let nolimit, limit;
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
                        uncon: isuncon ? ['d'] : [],
                        prolimit: prolimit,
                        isnolimit: isnolimit,
                        islimit: islimit,
                        limit: limit,
                        stocklimit: stocklimit,
                    }
                }else if(promotionControl.channel1){
                    let isuncon = pc.uncon && pc.uncon.length > 0;
                    let qty = pc.byQty ? pc.byQty : [];
                    let full, each, ladder;
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
                    if(isqty){
                        prolimit = prolimit.concat('qty');
                    }
                    if(isuncon){
                        prolimit = prolimit.concat('uncon');
                    }
                    promotionControl = {
                        ...promotionControl,
                        isuncon: isuncon,
                        uncon: pc.uncon,
                        isfull: isfull,
                        full: full,
                        iseach: iseach,
                        each: each,
                        isladder: isladder,
                        ladder: ladder,
                        unconstock: pc.unconstock,
                        byQtystock: pc.byQtystock,
                        isqty: isqty,
                        byqty: byqty,
                        prolimit: prolimit,
                    }
                }
                this.mergeToState(
                    {
                        promotionControl: promotionControl,
                        noprodisplay: (!promotionControl.channel1 && promotionControl.channel2) ? 'block' : 'none',
                        uncondisplay: 'block',
                        unconreddisplay: (promotionControl.channel1 && !promotionControl.channel2) ? 'block' : 'none',
                        unconstockdisplay: (promotionControl.channel1 && !promotionControl.channel2) ? 'block' : 'none',
                        qtydisplay: (promotionControl.channel1 && !promotionControl.channel2) ? 'block' : 'none',
                        stocklimitdisplay: (!promotionControl.channel1 && promotionControl.channel2) ? 'block' : 'none',
                        uncongroupdisplay: promotionControl.isuncon ? 'block' : 'none',
                        qtygroupdisplay: promotionControl.isqty ? 'block' : 'none',
                        qtyfullgroupdisplay: promotionControl.isfull ? 'block' : 'none',
                        qtyeachgroupdisplay: promotionControl.iseach ? 'block' : 'none',
                        qtyladdergroupdisplay: promotionControl.isladder ? 'block' : 'none',
                        stocklimitgroupdisplay: promotionControl.islimit ? 'block' : 'none',
                    }
                )
            }
        }
        else{
            this.mergeToState({
                promotionControl: {
                    canEdit: true,
                },
                promotionControlList: [],
                noprodisplay: 'block',
                uncondisplay: 'block',
                unconreddisplay: 'block',
                unconstockdisplay: 'block',
                qtydisplay: 'block',
                stocklimitdisplay: 'block',
                uncongroupdisplay: 'none',
                qtygroupdisplay: 'none',
                qtyfullgroupdisplay: 'none',
                qtyeachgroupdisplay: 'none',
                qtyladdergroupdisplay: 'none',
                stocklimitgroupdisplay: 'none',
            })
        }
    }

    handlerSaveControl = async (saveParam)=> {
        return await this.postApi('/marketing/savePromotionControl', saveParam);
    }

    handlerChangeDisplay = async (changeParam) =>{
        this.mergeToState({
            ...changeParam,
        })
    }


    handlerForward = async (path)=> {
        this.forward(path, {});
    }
}
