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
            idOrname: values.controlIdOrName,
            status: values.status,
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

            <Card className="promotion-list-search" bodyStyle={{ padding: '24px 0 20px 0' }}>
                <Form className="search-form" onSubmit={this.handleSubmit}>
                    <Row>
                        <Col span={6} className="SearchForm-col" >
                            <Form.Item label={language['ruletemplate.Promotiontype']} className='custom-label'>
                                {getFieldDecorator('controlIdOrName', {
                                })(
                                    <Input style={{ width: '90%' }} placeholder={language['type.Fillintypetips']} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={language["rule.state"]} className='custom-label'>
                                {getFieldDecorator('status', {
                                    initialValue: -1,
                                })(
                                    <Select dropdownStyle={{textAlign:"center"}} style={{ width: '90%' }}>
                                        <Option value={-1}>{language["promotion.search.all"]}</Option>
                                        <Option value={1}>{language["type.valid"]}</Option>
                                        <Option value={0}>{language["type.invalid"]}</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={11} >
                            <Form.Item label=" " colon={false} style={{ textAlign: "right" }}>
                                <Button id="searchForm-btn" htmlType="submit" disabled={hasErrors(getFieldsError())} type="primary">{language['salespromotion.linkoption_search']}</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        )
    }
}

export default Form.create({})(withData(SearchForm));