/* jshint esversion:6 */
import React from "react";
import Connect from 'react-imvc/hoc/connect'
import { Table, Divider, Tag, Switch, Button, Modal } from 'antd';
import ExpandedRow from './ExpandedRow'
const { Column } = Table;
const Confirm = Modal.confirm;
//高阶函数connect返回controller里的state、handlers和actions对象
const withData = Connect( ( { state, handlers, actions } ) => {
    // console.log('withData',state)
    return {
        state,
        handlers,
        actions
    }
} )

class ItemList extends React.Component {
    state = {
        currentProductId:null,
    }

    constructor ( props ) {
        super( props );
    }

    /** 单个创建关联*/
    handleCreateRelate=(record,productId)=>{
        let {state:{language}={}} = this.props
        // console.log('处理器',this.props)
        Confirm( {
            title:language["salespromotion.whether_determine_association"]+ '?',
            onOk:() => {
                let { optionId } = record
                record.loading = true;
                this.props.handlers.handleRelatePromotionProduct( {
                    salesPromotionOptionList:[{productId,optionId}],
                    relatetype:1,
                }, [ record ] )
            }
        } )
    }

    /** 单个取消关联*/
    handleCancelRelate =(record,productId)=> {
        let {state:{language}={}} = this.props
        Confirm( {
            title:language["salespromotion.you_want_cancelrelated"]+'?',
            onOk:() => {
                let { optionId } = record
                record.loading = true;
                this.props.handlers.handleRelatePromotionProduct( {
                    salesPromotionOptionList:[{productId,optionId}],
                    relatetype:0,
                }, [ record ] )
            }
        } )
    }


    render () {
        let {state:{iteType, pageSize,pageNo,totalCount, modalVisible, language,productList}={},handlers } = this.props
        const paginationSetting = {
            total:totalCount,
            pageSize,
            position:'bottom',
            showSizeChanger:true,
            defaultPageSize:5,
            pageSizeOptions:[ '5', '10', '20', '50', '100', '300' ],
            showTotal:( total ) => {
                return language["salespromotion.total"]+` ${total} `+language["salespromotion.article"]
            },
            onShowSizeChange:handlers.handleChangePageSize,
            onChange:handlers.handleChangeCurrentPage,
        };

        const rowSelection = {
            onSelectAll:(selected, selectedRows, changeRows)=>{

                let selectedAll = true
                let reset = false

                if(selectedRows.length===0){ //全不选时触发
                    selectedRows = productList
                    selectedAll = false
                    reset = true
                }

                selectedRows.forEach((item)=>{
                    if(item.expand){
                        item.selectedAll = selectedAll
                        item.reset = true
                    }

                    console.log('item','selected')
                })
            },
            onChange: (selectedRowKeys, selectedRows) => {
            },

            getCheckboxProps: record => ({
               style:{display:'none'}

            }),
        };

        return (

            <section className="item-list">
                <Table dataSource={productList}
                       pagination={paginationSetting}
                       rowKey={record => `${record.productId}`}
                       expandedRowRender={(record,index,indent,expanded )=>{

                           record.expand = expanded
                           if(!expanded)
                               record.selectedAll=false

                           return(<ExpandedRow item={record}
                                               language={language}
                                               selectedAll={record.selectedAll}
                                               handleCreateRelate={this.handleCreateRelate}
                                               handleCancelRelate={this.handleCancelRelate}
                                               openModal={handlers.handleToggleLogModal}
                           />)
                       }}
                       onExpand={(expanded, record)=>{
                           if(expanded&&!record.optionInfos)
                               handlers.handleGetOptionInfo(record)

                           if(!expanded&&record.optionInfos)
                               record.optionInfos.forEach((item)=> item.selected = false)
                       }}
                       rowClassName={record => (!record.optionIds || record.optionIds.length === 0)  ? 'noExpand' : ''}
                >
                    <Column
                        title={language['promotion.list.ProductID']}
                        dataIndex="productId"
                        width={132}
                    />
                    <Column
                        title={language['promotion.list.Productname']}
                        dataIndex="productName"
                        render={(text,record)=> <a href={record.productRedirectUrl} target="_blank">{text}</a>
                        }
                    />
                    <Column
                        title={language['promotion.list.category']}
                        dataIndex="productTypeStr"
                        width={112}
                    />


                    <Column
                        title={language['promotion.list.Largearea']}
                        dataIndex="regionStr"
                        width={112}
                    />

                    <Column
                        title={language['promotion.list.Destinationcity']}
                        dataIndex="destCity"
                        width={112}
                    />

                    <Column
                        title={language['salespromotion.total_promotions']}
                        key="promotionNum"
                        width={122}
                        render={(text,record)=> <div>
                        <div>{language["promotion.search.inprogress"]}：{record.doingSize}个</div>
                        <div>{language["promotion.search.Notyetbegun"]}：{record.unStartSize}个</div>
                            </div>
                        }
                    />
                    <Column
                        title={language['promotion.list.Onlinestate']}
                        dataIndex="status"
                        key="status"
                        width={92}
                        render={status => (
                            <span>
		                      {status ? (language['salespromotion.online']): (language['salespromotion.offline'])}
		                    </span>
                        )}
                    />


                </Table>
            </section>
        )
    }
}

export default withData( ItemList )