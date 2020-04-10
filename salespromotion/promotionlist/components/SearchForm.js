/* jshint esversion:6 */

import React from "react";
import connect from 'react-imvc/hoc/connect';
import { Card, Form, Row, Col, Input, Select, Button, DatePicker } from 'antd';

const Option = Select.Option;
const withData = connect(({ state, props, actions, handlers }) => {
    const { language, templateSelectList = [], siteLanList = [] } = state;
    return {
        templateSelectList,
        siteLanList,
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
        this.props.form.validateFields((err, { startDate, disableDate, ...others }) => {
            if (!err) {
                let params = {
                    ...others,
                    startDate: startDate ? startDate.format('YYYY/MM/DD') : undefined,
                    disableDate: disableDate ? disableDate.format('YYYY/MM/DD') : undefined,
                    pageNo: 1
                }

                // console.log('全部参数',params)
                this.props.handlers.handleSubmitSearchForm(params);
            }
        });
    }

    render() {

        const { getFieldDecorator, validateFields, getFieldsError } = this.props.form;
        const { language, templateSelectList, siteLanList } = this.props

        // console.log('语言包', language)
        return (
            <div className="active-list-search" >
                <Card className="promotion-list-search" >
                    <Form className="search-form" onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={6}>
                                <Form.Item label={language['promotion.list.Activityname']} className='custom-label'>
                                    {getFieldDecorator('promotionIdOrName', {
                                    })(
                                        <Input style={{ width: '90%' }} placeholder={language['salespromotion.event_ID_name']} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label={language["promotion.search.Businesstype"]} className='custom-label'>
                                    {getFieldDecorator('businessLine', {
                                        initialValue: 0,
                                    })(
                                        <Select style={{ width: '90%' }}  dropdownStyle={{textAlign:"center"}} placeholder="">
                                            <Option value={0}>{language["promotion.search.all"]}</Option>
                                            <Option value={1}>{language["salespromotion.tour"]}</Option>
                                            <Option value={2}>{language["salespromotion.tickets"]}</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Form.Item label={language['promotion.search.Promotionrules']} className='custom-label'>
                                    {getFieldDecorator('templateId', {
                                        initialValue: 0
                                    })(
                                        <Select style={{ width: '90%' }}  dropdownStyle={{textAlign:"center"}} placeholder="">
                                            <Option value={0}>{language["promotion.search.all"]}</Option>
                                            {templateSelectList.map((item, index) => <Option key={index} value={item.templateId}>{item.templateId}-{item.templateName}</Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>

                            <Col span={6} style={{ width: "22%" }} >
                                <Form.Item label={language["promotion.list.ActivityCreator"]} className='custom-label'>
                                    {getFieldDecorator('createStr', {
                                        initialValue: "",
                                    })(
                                        <Select style={{ width: '100%' }}  dropdownStyle={{textAlign:"center"}} placeholder="">
                                            <Option value={""}>{language["promotion.search.all"]}</Option>
                                            <Option value={"ctrip"}>{language["salespromotion.ctrip"]}</Option>
                                            <Option value={"vendor"}>{language["salespromotion.vendor"]}</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Form.Item label={language['salespromotion.linkoption_search_id']} className='custom-label'>
                                    {getFieldDecorator('parentId', {
                                    })(
                                        <Input style={{ width: '90%' }} placeholder={language['salespromotion.linkoption_search_id_placeholder'] } />
                                    )}
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Form.Item label={language['promotion.list.Activitytime']} className='custom-label'>
                                    <Form.Item
                                        style={{ display: 'inline-block', width: 'calc(45% - 12px)' }}
                                    >
                                        {getFieldDecorator('startDate', {
                                        })(
                                            <DatePicker />
                                        )}
                                    </Form.Item>
                                    <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                                    <Form.Item
                                        style={{ display: 'inline-block', width: 'calc(45% - 12px)' }}
                                    >
                                        {getFieldDecorator('disableDate', {
                                        })(
                                            <DatePicker />
                                        )}
                                    </Form.Item>
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Form.Item label={language['ruletemplate.locale']} className='custom-label'>
                                    {getFieldDecorator('siteLan', {
                                        initialValue: ''
                                    })(
                                        <Select style={{ width: '90%' }}  dropdownStyle={{textAlign:"center"}} placeholder="">
                                            <Option value={''}>{language["promotion.search.all"]}</Option>
                                            {siteLanList.map((item, index) => <Option key={index} value={item.code}>{item.code}-{item.name}</Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6} style={{ width: "22%" }} >
                                <Form.Item label={language['salespromotion.vendor_ID']} className='custom-label'>
                                    {getFieldDecorator('vendorId', {
                                    })(
                                        <Input style={{ width: '100%' }} placeholder={language['salespromotion.enter_vendor_ID']} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={24} >
                                <Form.Item label=" " colon={false} style={{ textAlign: "right" }}>
                                    <Button id="searchForm-btn" size="large" htmlType="submit" disabled={hasErrors(getFieldsError())} type="primary">{language['salespromotion.linkoption_search']}</Button>
                                </Form.Item>
                            </Col>
                        </Row>


                    </Form>
                </Card>
            </div>
        )
    }
}

export default Form.create({})(withData(SearchForm));