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
export default withData(PromotionTemplateList)

function PromotionTemplateList({ state, handlers }) {
    console.log(state)
    let { promotionTemplateList = [], searchData: { pageSize, pageNo } = {}, totalCount, language } = state

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
        showQuickJumper: true,

    };

    function opTemplate(templateId, type) {
        Confirm({
            title: type === 1 ? language["salespromotion.confirm_the_promotion_rules"] + "？" : (type === 2 ? language["salespromotion.confirm_promotion_rules"] + "？" : language["salespromotion.delete_promotion_rule"] + "？"),
            onOk: async () => {
                let result = await handlers.handlerOpTemplate({ templateId: templateId, opType: type });
                if (result.resultStatus.isSuccess) {
                    message.success(language["salespromotion.successfu_operation"]);
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
            <Table dataSource={promotionTemplateList}
                pagination={paginationSetting}
                rowKey={record => { record.templateId }}
            >
                <Column
                    title={language['rule.Promotionruleid']}
                    dataIndex="templateId"
                    width={160}
                />
                <Column
                    title={language['promotion.list.Promotionrulename']}
                    dataIndex="name"
                />
                <Column
                    title={language['promotion.search.Businesstype']}
                    dataIndex="businessLine"
                    render={(value, row, index) => {
                        return value === 1 ? language["salespromotion.tour"] : '';
                    }}
                />
                <Column
                    title={language['rule.Marketingtype']}
                    dataIndex="channel"
                    render={(value, row, index) => {
                        return value === 1 ? language["ruletemplate.tool"] : language["ruletemplate.Solicitation"];
                    }}
                />
                <Column
                    title={language['rule.state']}
                    dataIndex="status"
                    render={(value, row, index) => {
                        if (value === 0) {
                            return language["salespromotion.to_be_released"];
                        }
                        if (value === 10) {
                            return language["salespromotion.published"];
                        }
                        if (value === 20) {
                            return language["salespromotion.terminated"];
                        }
                        return "";
                    }}
                />
                <Column
                    title={language['promotion.list.sort']}
                    dataIndex="sort"
                />
                <Column
                    title={language['salespromotion.operate']}
                    key="operation"
                    width={250}
                    fixed="right"
                    render={(value, row, index) => (
                        <div className="promotion-list-operation">
                            <Link to={`/salespromotion/promotiontemplatedetail/` + row.templateId}>{language['salespromotion.detail_edit']}</Link>
                            {
                                row.status === 10 ? <a onClick={() => opTemplate(row.templateId, 2)}>{language["salespromotion.stop_use"]}</a> : ''
                            }
                            {
                                row.status === 0 || row.status === 20 ? <a onClick={() => opTemplate(row.templateId, 1)}>{language["salespromotion.release"]}</a> : ''
                            }
                            {
                                row.status === 0 ? <a onClick={() => opTemplate(row.templateId, 3)}>{language["salespromotion.delete"]}</a> : ''
                            }
                            <a onClick={() => handlers.handleToggleLogModal(row.templateId, row.name)}>{language["salespromotion.detail_log"]}</a>
                        </div>
                    )}
                />
            </Table>
        </div>
    );
}

