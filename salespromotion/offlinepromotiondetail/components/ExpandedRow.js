import React from 'react'
import { Table, Icon, Popover } from 'antd'

export default class ExpandedRow extends React.Component {

    state = {
        item: this.props.item,
        selectedRowKeys: []
    }


    componentWillReceiveProps(nextProps) {

        if (!nextProps.item.optionInfos)
            return

        let selectedRowKeys = nextProps.item.optionInfos.filter((item) => item.selected).map((item) => { return item.optionId.toString() })  //先以父组件置的selected状态为准  主要作用于展开收起的时候

        console.log("selectedRowKeys", selectedRowKeys)
        if (this.props.selectedAll != nextProps.selectedAll) { //如果全选状态改变，则重置子项的 selected状态
            this.props.item.optionInfos.forEach((item) => {
                item.selected = nextProps.selectedAll
            })
            selectedRowKeys = nextProps.selectedAll ? nextProps.item.optionIds.map((item) => item.toString()) : []
        }
        this.setState({
            selectedRowKeys
        })
    }

    render() {
        const content = ({ doingSize, unStartSize }) => <div>
            <div>{language["promotion.search.inprogress"]}：<span style={{ color: '#f81d22' }}>{doingSize}</span>个</div>
            <div>{language["promotion.search.Notyetbegun"]}：<span style={{ color: '#f81d22' }}>{unStartSize}</span>个</div>
        </div>
        const { item: { optionInfos, productId, productName } = {}, openModal, language } = this.props

        const columns = [
            {
                title: language["salespromotion.resources_name"],
                dataIndex: 'optionName',
                width: 400,
                render: (text, record) => <span>{language['salespromotion.resources']}：<span>{`${record.optionId}-${text}`}</span></span>
            },
            {
                title: language["salespromotion.resource_status"],
                dataIndex: 'optionStatus',
                render: (optionStatus) => <div>{language['type.state']}：<div style={{ display: 'inline-block', height: 6, width: 6, backgroundColor: optionStatus ? '#52C41A' : '#FF0000', borderRadius: '50%' }}></div> {optionStatus ? (language['type.valid'] ) : (language['type.invalid'] )}</div>
            },
            {
                title: language["salespromotion.total_promotions"],
                key: 'action',
                render: (text, { optionId, optionName, doingSize, unStartSize }) => <div>
                    {doingSize + unStartSize > 0 && <a onClick={() => openModal({ productId, productName, optionId, optionName, doingSize, unStartSize })}>{language['salespromotion.joined_promotion']}
                        <Popover content={content({ doingSize, unStartSize })} >
                            <Icon style={{ marginLeft: 3 }} type="info-circle" />
                        </Popover>
                    </a>}
                </div>

            },
            {
                title: language["salespromotion.association_status"],
                dataIndex: 'linkStatus',
                render: (linkStatus) => <span>{linkStatus ? (language['salespromotion.relateded'] ) : (language['salespromotion.unrelated'] )}</span>
            },
        ];

        const subRowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys: [].concat(selectedRowKeys)
                })
            },
            onSelect: (record, selected, selectedRows, nativeEvent) => {
                record.selected = selected
            },
            getCheckboxProps: record => ({}),
        };
        return (
            <Table style={{ margin: '0 0' }} showHeader={false} columns={columns} dataSource={optionInfos} pagination={false} rowKey={record => `${record.optionId}`} size="middle" />
        );
    }
}
