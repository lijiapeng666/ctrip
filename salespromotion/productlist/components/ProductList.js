/* jshint esversion:6 */
import React from "react";
import Connect from 'react-imvc/hoc/connect'
import { Table, InputNumber, Divider, Tag, Switch, Button, Modal,Input } from 'antd';
import ExpandedRow from './ExpandedRow'
import {formatASPDate} from "../../../../lib/util";
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
            title:language["salespromotion.whether_determine_association"]+'?',
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
        let {state:{pageSize,pageNo,totalCount, modalVisible, language,productList,expandedRowKeys}={},handlers={} } = this.props
        let  {handleChangeExpandedRows,handleSaveSortNo,handleSetSingleSortNo} = handlers

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
            showQuickJumper: true,
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
                       rowKey={record => `${record.productId + record.salesPromotionId}`}
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
                       expandedRowKeys={expandedRowKeys}
                       onExpandedRowsChange={handleChangeExpandedRows}
                       rowClassName={record => (!record.optionIds || record.optionIds.length === 0)  ? 'noExpand' : ''}
                >
                    <Column
                        title={language['promotion.list.ProductID']}
                        dataIndex="productId"
                        width={30}
                    />
                    <Column
                        title={language['promotion.list.Productname']}
                        dataIndex="productName"
                        width={200}
                    />
                    <Column
                        title={language['promotion.list.Activityname']}
                        dataIndex="salesPromotionName"
                        width={100}
                        render={( text,record ) => <span>{`${record.salesPromotionId}-${text}`}</span>}
                    />
                    <Column
                        title={language["promotion.list.Activitytime"]}
                        dataIndex="promotionDate"
                        width={150}
                        render={( text, { startTime, endTime } ) => (
                        <span>{formatASPDate( startTime, 'YYYY-MM-DD' )}{language["common.map.to"]}{formatASPDate( endTime, 'YYYY-MM-DD' )}</span>
                        )}
                    />
                    <Column
                        title={language['promotion.list.category']}
                        dataIndex="productTypeStr"
                        width={110}
                    />


                    <Column
                        title={language['promotion.list.Largearea']}
                        dataIndex="regionStr"
                        width={50}
                    />

                    <Column
                        title={language['promotion.list.Destinationcity']}
                        dataIndex="destCity"
                        width={100}
                    />

                    <Column
                        title={language["promotion.list.Suppliername"]}
                        dataIndex="vendorName"
                        width={150}
                        render={( text,record ) => <span>{`${record.vendorId}-${text}`}</span>}
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

                    <Column
                        title={<Button  id="searchForm-btn" size="large"  htmlType="submit" onClick={handleSaveSortNo} type="primary">{language["promotion.list.sort"]}</Button>}
                        dataIndex="sort"
                        width={100}
                        render={( text, record ) => <InputNumber min={0} style={{ width:90 }}  onChange={(e) => handleSetSingleSortNo(e,record)} value={text} />
                        }
                    />

                </Table>
            </section>
        )
    }
}

export default withData( ItemList )