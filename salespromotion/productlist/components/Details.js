import React from 'react'
import connect from 'react-imvc/hoc/connect'
import Timer from '../../components/Timer'
import {formatASPDate} from '../../../../lib/util'
import {Icon} from 'antd/lib'
import { Link } from 'react-imvc/component';

const Details = ( {type,origin,loginType,state, props, handlers, } ) => {
    const { language,panelShow, promotionInfo:{ salesPromotionId,startDate,disableDate, externalAssume, profitsAgainst, salesPromotionName, salesPromotionRuleStr, stockType, quantityTotal, productCategory, remark }={} } = state
    const { handleTimerEnd,handleToggle} = handlers

    const formatDate = (date) => {
        return formatASPDate(date,'YYYY/MM/DD')
    }

    /** 方便以后拓展*/
    function getInventory (  ) {
        if(stockType=='U'){
            return language['ruletemplate.Unlimited']
        }else{
            return `${language['salespromotion.discounttimes']}：${quantityTotal}`
        }
    }
    return (
        <div className="activity-entry-info">

            <div className="tab-name">{language['promotion.detail']}</div>
            <div className=" info-details">
                <div className="collapse-panel" style={panelShow ? {height: 'auto'} : {height: 54}}>
                    <section className="modules">
                        <FormGroup label={language['promotion.list.ActivityID']} value={salesPromotionId}/>
                        <FormGroup label={language['promotion.list.Activitytime']} value={`${formatDate(startDate)} - ${formatDate(disableDate)}`}/>
                        <FormGroup label={language['salespromotion.pay_brear']} value={`${!!externalAssume?`${language['salespromotion.vendor']}${language['salespromotion.bear']}：${externalAssume}%`:''}${!!profitsAgainst?`，${language['salespromotion.ctrip']}${language['salespromotion.bear']}：${profitsAgainst}%`:''}`}/>
                    </section>
                    <section className="modules">
                        <FormGroup label={language['promotion.list.Activityname']} value={salesPromotionName}/>
                        <FormGroup label={language['promotion.list.Preferentialrules']} value={salesPromotionRuleStr|| language['salespromotion.nolimit']}/>
                        <FormGroup label={language['ruletemplate.Promotionalinventory']} value={getInventory()}/>
                    </section>
                    <section className="com-modules">
                        <FormGroup label={language['salespromotion.productrange']} value={ productCategory||language['salespromotion.nolimit']}></FormGroup>
                        <FormGroup label={language['ruletemplate.Ruledescription']} ><div className="group-value" dangerouslySetInnerHTML={{__html:remark}}></div></FormGroup>
                        {/*<div className="form-group">
                            <div className="group-label">{language['joined.list.ruleremark']||'规则说明'} :&nbsp;</div><div className="group-value" dangerouslySetInnerHTML={{__html:remark}}></div>
                        </div>*/}

                    </section>
                </div>
                <div className="expand-btn"><Icon type={panelShow?'up':'down'} /><a onClick={handleToggle} >{panelShow?(language['salespromotion.collapse']):(language['salespromotion.expand'])}</a></div>
            </div>
        </div>
    )
}

function FormGroup  (props) {
    const {label,value,children} = props
    return (
        <div className="form-group">
            <div className="group-label">{label} :&nbsp;</div><div className="group-value">{value}{children}</div>
        </div>
    );
}


export default connect( ( { state, handlers, props } ) => {
    const {location:{params:{type}={},query:{logintype,origin}={}}} = state

    return {
        type,
        origin:origin,
        loginType:logintype,
        state,
        props,
        handlers,
    }
} )( Details )
