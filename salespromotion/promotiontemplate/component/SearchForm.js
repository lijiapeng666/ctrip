/* jshint esversion:6 */

import React from "react";
import connect from 'react-imvc/hoc/connect';
import { Card, Form, Row, Col, Input, Select, Button, DatePicker } from 'antd';

const Option = Select.Option;
const withData = connect(({ state, props, actions, handlers }) => {
    const { language } = state;
    return {
        language,
        actions,
        handlers
    };
});

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class SearchForm extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        const { form } = this.props;
        let values = form.getFieldsValue();
        let params = {
            idOrname: values.templateIdOrName,
            channel: values.channel === 0 ? null : values.channel,
            businessType: values.businessType === 0 ? null : values.businessType,
            status: values.status === -1 ? null : values.status,
            pageNo: 1,
            pageSize: 10,
        }
        this.props.handlers.handleSubmitSearchForm(params);
    }

    render() {

        const { getFieldDecorator, validateFields, getFieldsError } = this.props.form;
        const { language } = this.props

        // console.log('语言包', language)
        return (
            <Card className="promotion-list-search">
                <Form className="search-form" onSubmit={this.handleSubmit}>
                    <Row >
                        <Col span={6} style={{ width: "35%" }}>
                            <Form.Item label={language['promotion.search.Promotionrules']} className='custom-label'>
                                {getFieldDecorator('templateIdOrName', {
                                })(
                                    <Input style={{ width: "90%" }} placeholder={language['rule.Ruleinputtips']} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6} style={{ width: "35%" }}>
                            <Form.Item label={language["rule.Marketingtype"]} className='custom-label'>
                                {getFieldDecorator('channel', {
                                    initialValue: 0,
                                })(
                                    <Select  dropdownStyle={{textAlign:"center"}} style={{ width: "90%" }}>
                                        <Option value={0}>{language["promotion.search.all"]}</Option>
                                        <Option value={1}>{language["ruletemplate.tool"]}</Option>
                                        <Option value={2}>{language["ruletemplate.Solicitation"]}</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6} style={{ width: "30%" }}>
                            <Form.Item label={language["promotion.search.Businesstype"]} className='custom-label'>
                                {getFieldDecorator('businessType', {
                                    initialValue: 0,
                                })(
                                    <Select  dropdownStyle={{textAlign:"center"}} style={{ width: "100%" }}>
                                        <Option value={0}>{language["promotion.search.all"]}</Option>
                                        <Option value={1}>{language["salespromotion.tour"]}</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row id="promotion-list-search-rule">
                        <Col span={6} style={{ width: "35%" }}>
                            <Form.Item label={language["rule.state"]} className='custom-label'>
                                {getFieldDecorator('status', {
                                    initialValue: -1,
                                })(
                                    <Select  dropdownStyle={{textAlign:"center"}} style={{ width: '90%' }}>
                                        <Option value={-1}>{language["promotion.search.all"]}</Option>
                                <Option value={0}>{language["salespromotion.to_be_released"]}</Option>
                                <Option value={10}>{language["salespromotion.published"]}</Option>
                                <Option value={20}>{language["salespromotion.terminated"]}</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={9} style={{ width: '65%' }}>
                            <Form.Item label=" " colon={false} style={{ textAlign: "right" }}>
                                <Button id="searchForm-btn" size="large" htmlType="submit" disabled={hasErrors(getFieldsError())} type="primary">{language['salespromotion.linkoption_search']}</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        )
    }
}

export default Form.create({})(withData(SearchForm));