/* jshint esversion:6 */

import React from "react";
import connect from 'react-imvc/hoc/connect';
import {Card, Form, Row, Col, Input, Select, Button, DatePicker} from 'antd';

const Option = Select.Option;
const withData = connect(({ state, props, actions, handlers }) => {
    const {promotionInfo,language,templateSelectList=[]} = state;
    return {
        templateSelectList,
        promotionInfo,
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

        this.props.form.validateFields((err, {startDate,disableDate,...others}) => {
            let postSearchParams = {
                ...others,
                startDate:startDate?startDate.format('YYYY/MM/DD'):undefined,
                disableDate:disableDate?disableDate.format('YYYY/MM/DD'):undefined,
                pageNo:1
            }
            // console.log('onSubmit', postSearchParams)
            if (!err) {
                // console.log('表单内容',postSearchParams)
                this.props.handlers.handleSubmitSearchForm({...postSearchParams});
            }
        });
    }

    render() {
        // console.log('render',this.props)
        const { promotionInfo:{productCateList=[]}={},language,templateSelectList } = this.props;

        const { getFieldDecorator, validateFields, getFieldsError } = this.props.form;

        // console.log('cityIdList',cityIdList)
        const formItemLayout = {
            labelCol: {
                span: 10
            },
            wrapperCol: {
                span: 14
            }
        };

        return (
            <div className="promotion-list-search-from">
            <Card className="promotion-list-search search-card bg-white">
                <Form className="search-form" onSubmit={this.handleSubmit}>
                    <Row>

                        <Col span={6}>
                            <Form.Item label={language["promotion.search.Businesstype"]} className='custom-label'>
                                {getFieldDecorator('businessLine', {
                                    initialValue: 0,
                                })(
                                    <Select style={{width:'90%'}} dropdownStyle={{textAlign:"center"}}  placeholder="">
                                        <Option value={0}>{language["promotion.search.all"]}</Option>
                                        <Option value={1}>{language["salespromotion.tour"]}</Option>
                                        <Option value={2}>{language["salespromotion.tickets"]}</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={language['salespromotion.linkoption_search_id']} className='custom-label'>
                                {getFieldDecorator('productIdOrName', {
                                })(
                                    <Input style={{width:'90%'}}  placeholder={language['salespromotion.linkoption_search_id_placeholder']} />
                                )}
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item label={language['promotion.search.Promotionrules']} className='custom-label'>
                                {getFieldDecorator('templateId', {
                                    initialValue: 0
                                })(
                                    <Select style={{width:'90%'}} dropdownStyle={{textAlign:"center"}}  placeholder="">
                                        <Option value={0}>{language["promotion.search.all"]}</Option>
                                        {templateSelectList.map((item,index)=><Option key={index} value={item.templateId}>{item.templateId}-{item.templateName}</Option>)}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>

                        <Col span={6} style={{width:"22%"}} >
                            <Form.Item  label={language["promotion.list.Activitystate"]} className='custom-label'>
                                {getFieldDecorator('status', {
                                    initialValue: 0,
                                })(
                                    <Select style={{width:'100%'}} dropdownStyle={{textAlign:"center"}}  placeholder="">
                                        <Option value={0}>{language['promotion.search.all']}</Option>
                                        <Option value={10}>{language['promotion.search.inprogress']}</Option>
                                        <Option value={1}>{language['promotion.search.Notyetbegun']}</Option>
                                    </Select>
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
                                        <DatePicker/>
                                    )}
                                </Form.Item>
                                <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                                <Form.Item
                                    style={{ display: 'inline-block', width: 'calc(45% - 12px)' }}
                                >
                                    {getFieldDecorator('disableDate', {
                                    })(
                                        <DatePicker/>
                                    )}
                                </Form.Item>
                            </Form.Item>
                        </Col>


                        <Col span={18} >
                            <Form.Item label=" " colon={false} lassName='custom-label' style={{textAlign:"right"}}>
                                <Button id="searchForm-btn"  size="large"  htmlType="submit" disabled={hasErrors(getFieldsError())} type="primary">{language['salespromotion.linkoption_search']}</Button>
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