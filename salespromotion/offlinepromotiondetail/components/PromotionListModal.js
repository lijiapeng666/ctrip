/* jshint esversion:6 */
import React from "react";
import connect from 'react-imvc/hoc/connect';
import { Table } from 'antd';
import {formatASPDate} from '../../../../lib/util'

const { Column } = Table;
const withData = connect( ( { state, handlers } ) => {
    return { state, handlers };
} )
export default withData( PromotionListModal )

function FormGroup  ({label,value,children}) {
    return (
        <div className="form-group">
            <div className="group-label">{label} :&nbsp;</div><div className="group-value">{value}{children}</div>
        </div>
    );
}

function PromotionListModal ( { state,handlers, } ) {

    const {  relatedPromotionList = [],currentOptInfo={},language} = state
    const {productId,productName,optionId,optionName,doingSize,unStartSize} = currentOptInfo

    console.log( currentOptInfo )

    return (
        <div className="promotion-modal">
            <div>
                <FormGroup label={language['promotion.list.ProductID']} value={productId}/>
                <FormGroup label={language['promotion.list.Productname'] } value={productName}/>
                <FormGroup label={language['salespromotion.linkoption_list_optionid']} value={optionId}/>
                <FormGroup label={language['salespromotion.resources_name']} value={optionName}/>
            </div>

            <div style={{margin:"32px 0 8px"}}>
                <span style={{color:'#222',fontWeight:'bold',marginRight:16}}>{language['']}{language['salespromotion.joined_list'] }</span>
                (<span>{language['promotion.search.inprogress']}：<span style={{color:'#f81d22'}}>{doingSize}</span>个</span>，<span>{language['promotion.search.Notyetbegun']}：<span style={{color:'#f81d22'}}>{unStartSize}</span>个</span>)
            </div>
            <Table dataSource={relatedPromotionList} rowKey={record => `${record.salesPromotionId}` } pagination={false}
            >
                <Column
                    title={language['promotion.list.ActivityID']}
                    dataIndex="salesPromotionId"
                    width={160}
                />
                <Column
                    title={language['promotion.list.Activitytime'] }
                    key="promotionDate"
                    render={(text,{startDate,disableDate}) => (
                        <span>{formatASPDate(startDate,'YYYY-MM-DD')}{language['common.map.to']}{formatASPDate(disableDate,'YYYY-MM-DD')}</span>
                    )}
                />
                <Column
                    title={language['promotion.list.Activityname'] }
                    dataIndex="salesPromotionName"
                    width={90}
                />
                <Column
                    title={language['promotion.search.Promotionrules'] }
                    dataIndex="templateName"
                    width={120}
                />

                <Column
                    title={language['promotion.list.Preferentialrules'] }
                    dataIndex="salesPromotionRuleStr"
                />

                <Column
                    title={language['ruletemplate.Promotionalinventory'] }
                    key="inventory"
                    width={120}
                    render={( text,{stockType,quantityTotal}) => (
                        <span>
		                      {stockType =='U'? (language['ruletemplate.Unlimited']) : `${quantityTotal}${language['common.map.times']}`}
                        </span>
                    )}
                />
                <Column
                    title={language['salespromotion.cost_brear'] }
                    key="assume"
                    width={120}
                    render={( text,{profitsAgainst,externalAssume}) => (
                        <span>
                            {`${language['salespromotion.vendor']}${externalAssume}%`}{profitsAgainst>0 ?`，${language['salespromotion.ctrip']}${profitsAgainst}%`:''}
                        </span>
                    )}
                />
                <Column
                    title={language['promotion.list.Activitystate'] }
                    dataIndex="status"
                    key="promotionStatus"
                    width={90}
                    render={status => (
                        <span>
                            {(()=>{
                                switch (status){
                                    case 1:
                                        return language['promotion.search.Notyetbegun'];
                                    case 10:
                                        return language['promotion.search.inprogress'];
                                    case 20:
                                        return language['promotion.search.Hasended'];
                                    case 30:
                                }       return language['promotion.search.Terminated'];
                            })()}
			            </span>
                    )}
                />

                <Column
                    title={language['promotion.search.ActivityCreator']}
                    dataIndex="sponser"
                    width={105}
                    render={( text ) => {
                        let name = text
                        switch(text){
                            case 'vendor':
                                name = language['salespromotion.vendor'] 
                                break
                            case 'ctrip':
                                name = language ['salespromotion.ctrip']
                                break
                        }
                        return (<span>{name}</span>)
                    }
                    }
                />


            </Table>


        </div>
    );
}

