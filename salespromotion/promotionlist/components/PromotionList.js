/* jshint esversion:6 */
import React from "react";
import connect from 'react-imvc/hoc/connect';
import { Link } from 'react-imvc/component';
import { Table, Divider, Tag, Switch, Button, Modal } from 'antd';
import { formatASPDate } from '../../../../lib/util'

const { Column } = Table;
const withData = connect( ( { state, handlers } ) => {
    const { location:{ params, query } } = state;
    return { state, handlers };
} )
export default withData( PromotionList )

function PromotionList ( { state, handlers } ) {
    console.log( state )
    let { location:{ query:{ logintype, headertype = '' } = {} } = {}, siteType, promotionList = [], searchData:{ pageSize, pageNo } = {}, totalCount, language } = state

    const paginationSetting = {
        total:totalCount,
        pageSize,
        current:pageNo,
        position:'bottom',
        showSizeChanger:true,
        defaultPageSize:20,
        pageSizeOptions:[ '5', '10', '20', '50', '100', '300' ],
        showTotal:( total ) => {
            return  language["salespromotion.total"]+` ${total} `+language["salespromotion.article"]
        },
        onShowSizeChange:handlers.handleChangePageSize,
        onChange:handlers.handleChangeCurrentPage,
        showQuickJumper: true,
    };
    return (
        <div>
            <Table dataSource={promotionList}
                   pagination={paginationSetting}
                   rowKey={record => `${record.salesPromotionId}`}
            >
                <Column
                    title={language[ 'promotion.list.ActivityID' ]}
                    dataIndex="salesPromotionId"
                    width={160}
                />
                <Column
                    title={language[ 'promotion.list.Activityname' ] }
                    dataIndex="salesPromotionName"
                />
                <Column
                    title={language[ 'promotion.list.Promotionrulename' ]}
                    dataIndex="templateName"
                />

                {/* <Column
                    title={language[ 'promotion.list.Preferentialrules' ]}
                    dataIndex="salesPromotionRuleStr"
                /> */}

                <Column
                    title={language[ 'ruletemplate.locale' ]}
                    dataIndex="siteLan"
                />
                <Column
                    title={language[ 'promotion.list.Activitytime' ]}
                    key="promotionDate"
                    render={( text, { startDate, disableDate } ) => (
                    <span>{formatASPDate( startDate, 'YYYY-MM-DD' )}{language["common.map.to"]}{formatASPDate( disableDate, 'YYYY-MM-DD' )}</span>
                    )}
                />

                <Column
                    title={language[ 'ruletemplate.Promotionalinventory' ]}
                    key="inventory"
                    render={( text, { stockType, quantityTotal } ) => (
                        <span>
		                      {stockType == 'U' ? (language[ 'ruletemplate.Unlimited' ]) : `${quantityTotal}`}
                        </span>
                    )}
                />

                <Column
                    title={language[ 'salespromotion.used_inventory' ]}
                    dataIndex="restStock"
                />
                <Column
                    title={language[ 'salespromotion.number_linked_products' ]}
                    dataIndex="relatedOptionQty"
                />

                <Column
                    title={language["promotion.search.ActivityCreator"]}
                    dataIndex="sponser"
                    render={( text ) => {
                        let name = text
                        switch(text){
                            case 'vendor':
                                name=language['salespromotion.vendor']  
                                break
                            case 'ctrip':
                                name = language ['salespromotion.ctrip']
                                break
                        }
                        return (<span>{name}</span>)
                    }
                    }
                />

                <Column
                    title={language[ 'promotion.list.Activitystate' ] }
                    dataIndex="status"
                    key="promotionStatus"
                    width={90}
                    render={status => (
                        <span>
                            {(() => {
                                switch ( status ) {
                                    case 1:
                                        return language[ 'promotion.search.Notyetbegun' ];
                                    case 10:
                                        return language[ 'promotion.search.inprogress' ];
                                    case 20:
                                        return language[ 'promotion.search.Hasended' ];
                                    case 30:
                                }
                                return language[ 'promotion.search.Terminated' ];
                            })()}
			            </span>
                    )}
                />


                <Column
                    title={language[ 'salespromotion.operate' ] }
                    key="operation"
                    render={( text, { status, salesPromotionId, salesPromotionName, templateId } ) => (

                        <div className="promotion-list-operation">
                            <a onClick={() => handlers.handleToRelateInfo( salesPromotionId )}>{language[ 'salespromotion.view' ]}</a>
                            <a onClick={() => handlers.handleToggleLogModal( salesPromotionId, salesPromotionName )}>{language[ 'salespromotion.detail_log' ]}</a>
                        </div>
                    )}
                />

            </Table>


        </div>
    );
}

