/* jshint esversion:6 */
import React from "react";
import connect from 'react-imvc/hoc/connect';
import { Link } from 'react-imvc/component';
import { Table, Divider, Tag, Switch, Button, Modal, Popover, message } from 'antd';
const Confirm = Modal.confirm;
const { Column } = Table;
const withData = connect(({ state, handlers }) => {
    const { location: { params, query } } = state;
    return { state, handlers };
})
export default withData(PromotionControlList)

function PromotionControlList({ state, handlers }) {
    console.log(state)
    let { promotionControlList = [], searchData: { pageSize, pageNo } = {}, totalCount, language } = state

    const paginationSetting = {
        total: totalCount,
        pageSize,
        current: pageNo,
        position: 'bottom',
        showSizeChanger: true,
        defaultPageSize: 20,
        pageSizeOptions: ['5', '10', '20', '50', '100', '300'],
        showTotal: (total) => {
            return language["salespromotion.total"] + ` ${total} ` + language["salespromotion.article"]
        },
        onShowSizeChange: handlers.handleChangePageSize,
        onChange: handlers.handleChangeCurrentPage,
        showQuickJumper: true
    };

    function opControl(controlId, type) {
        Confirm({
            title: type === 1 ? language["salespromotion.confirm_valid"] + '？' : (type === 2 ? language["salespromotion.confirm_promotion_invalid"] + '？' : language["salespromotion.confirm_delete_type"] + '？'),
            onOk: async () => {
                let result = await handlers.handlerOpControl({ controlId: controlId, opType: type });
                if (result.resultStatus.isSuccess) {
                    message.success(language["salespromotion.successfu_ operation"]);
                    handlers.handleSubmitSearchForm();
                } else {
                    message.error(result.resultStatus.customerErrorMessage);
                    handlers.handleSubmitSearchForm();
                }
            }
        })
    }

    return (
        <div>
            <Table dataSource={promotionControlList}
                pagination={paginationSetting}
                rowKey={record => { record.controlId }}
            >
                <Column
                    title={language['type.TypeID']}
                    dataIndex="controlId"
                    width={160}
                />
                <Column
                    title={language['type.typename']}
                    dataIndex="name"
                />
                <Column
                    title={language['ruletemplate.locale']}
                    dataIndex="controlValue"
                    render={(value, row, index) => {
                        let siteLan = JSON.parse(value).siteLan;
                        let siteLanName = '';
                        if (siteLan !== undefined) {
                            siteLan.forEach(function (item, index) {
                                siteLanName += item + ',';

                            })
                        }
                        if (siteLanName !== '') {
                            siteLanName = siteLanName.substr(0, siteLanName.length - 1);
                        }
                        return siteLanName;
                    }}
                />
                <Column
                    title={language['rule.state']}
                    dataIndex="status"
                    render={(value, row, index) => {
                        return value === 1 ? language["type.valid"] : language["type.invalid"];
                    }}
                />
                <Column
                    title={language['salespromotion.operate']}
                    key="operation"
                    width={250}
                    fixed="right"
                    render={(value, row, index) => (
                        <div className="promotion-list-operation">
                            <Link to={`/salespromotion/promotioncontroldetail/` + row.controlId}>{language['salespromotion.detail_edit']}</Link>
                            {
                                row.status === 1 ?
                                    row.activeTemplateIdList && row.activeTemplateIdList.length > 0 ?
                                        <Popover placement="top" content={(<span>{language["salespromotion.promotion_promotion_rule"]}id[{row.activeTemplateIdList.join(',')}]{language["salespromotion.before_setting_invalid"]}</span>)}>
                                            <a style={{ color: '#CFD0DB' }}>{language["type.invalid"]}</a>
                                        </Popover>
                                        :
                                        <a onClick={() => opControl(row.controlId, 2)}>{language["type.invalid"]}</a>
                                    :
                                    <a onClick={() => opControl(row.controlId, 1)}>{language["type.valid"]}</a>
                            }
                            {
                                row.templateIdList && row.templateIdList.length > 0 ?
                                    <Popover placement="top" content={(<span>{language["salespromotion.promotion_promotion_rule"]}id[{row.templateIdList.join(',')}]{language["salespromotion.rules_before_deleting"]}</span>)}>
                                        <a style={{ color: '#CFD0DB',display:"none" }}>{language["salespromotion.delete"]}</a>
                                    </Popover>
                                    :
                                    <a onClick={() => opControl(row.controlId, 3)}>{language["salespromotion.delete"]}</a>
                            }
                            <a onClick={() => handlers.handleToggleLogModal(row.controlId, row.name)}>{language["salespromotion.detail_log"]}</a>
                        </div>
                    )}
                />
            </Table>
        </div>
    );
}

