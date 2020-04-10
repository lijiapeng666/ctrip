/* jshint esversion:6 */

import React from "react";
import connect from 'react-imvc/hoc/connect';
import { Card, Form, Row, Col, Input, Select, Button } from 'antd';

const Option = Select.Option;
const withData = connect(({ state, props, actions, handlers }) => {
    // console.log('withData',state)
    const {promotionInfo,language} = state;
    return {
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

        this.props.form.validateFields((err, values) => {
            let postSearchParams = {
                ...values
            }
            // console.log('onSubmit', postSearchParams)
            if (!err) {
                // console.log('表单内容',postSearchParams)
                this.props.handlers.handleSubmitSearchForm({...postSearchParams,pageNo:1});
            }
        });
    }

    render() {
        // console.log('render',this.props)
        const { promotionInfo:{productCateList=[]}={},language } = this.props;

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
            <Card className="promotion-list-search search-card bg-white">
                <Form className="search-form" onSubmit={this.handleSubmit}>
                    <Row>

                        <Col span={6}>
                            <Form.Item label={language['salespromotion.linkoption_search_id']} className='custom-label'>
                                {getFieldDecorator('productIdOrName', {
                                })(
                                    <Input style={{width:'90%'}}  placeholder={language['salespromotion.linkoption_search_id_placeholder']} />
                                )}
                            </Form.Item>
                        </Col>

                        <Col span={6} >
                            <Form.Item  colon={false} style={{textAlign:"right"}}>
                                <Button icon="search" size="large" style={{ marginRight: 10 }} htmlType="submit" disabled={hasErrors(getFieldsError())} type="primary">{language['salespromotion.linkoption_search']}</Button>
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Card>
        )
    }
}

export default Form.create({})(withData(SearchForm));