import React, { PureComponent } from 'react';
import {
    Form,
    Input,
    DatePicker,
    Select,
    Button,
    Card,
    InputNumber,
    Radio,
    Icon,
    Tooltip,
    Table,
    Row,
    Col,
    Checkbox,
    Popover,
    Modal, message,
} from 'antd/lib/index';

import BasicLayout from "../../../component/BasicLayout";
import { Link } from "react-imvc/component";
import { formatASPDate, getMoment } from "../../../lib/util";
import { redirect } from "../../../shared/User/util";
import Layout from "../promotioncontrol/View";
const { confirm } = Modal;
//为布局美观默认form item栅格比例为6：18
const formItemInputeLayout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 6,
    },
};
const formItemLayout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 21,
    },
};
const proformItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};
const pro2formItemLayout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 14,
    },
};

@Form.create()
class BasicPage extends PureComponent {
    constructor(props) {
        super(props);
    }

    changeDispaly = async (param) => {
        await this.props.handlers.handlerChangeDisplay(param);
    }

    unconchange = (e) => {
        let checked = e.target.checked;
        if (checked) {
            this.changeDispaly({ uncongroupdisplay: 'block' });
        } else {
            this.changeDispaly({ uncongroupdisplay: 'none' });
        }
    }

    qtychange = (e) => {
        let checked = e.target.checked;
        if (checked) {
            this.changeDispaly({ qtygroupdisplay: 'block' });
        } else {
            this.changeDispaly({ qtygroupdisplay: 'none' });
        }
    }

    stocklimitchange = (e) => {
        let checked = e.target.checked;
        if (checked) {
            this.changeDispaly({ stocklimitgroupdisplay: 'block' });
        } else {
            this.changeDispaly({ stocklimitgroupdisplay: 'none' });
        }
    }

    qtyfullchange = (e) => {
        let checked = e.target.checked;
        if (checked) {
            this.changeDispaly({ qtyfullgroupdisplay: 'block' });
        } else {
            this.changeDispaly({ qtyfullgroupdisplay: 'none' });
        }
    }

    qtyeachchange = (e) => {
        let checked = e.target.checked;
        if (checked) {
            this.changeDispaly({ qtyeachgroupdisplay: 'block' });
        } else {
            this.changeDispaly({ qtyeachgroupdisplay: 'none' });
        }
    }

    qtyladderchange = (e) => {
        let checked = e.target.checked;
        if (checked) {
            this.changeDispaly({ qtyladdergroupdisplay: 'block' });
        } else {
            this.changeDispaly({ qtyladdergroupdisplay: 'none' });
        }
    }

    channelchange = (values) => {

        if (values.length === 0) {
            this.changeDispaly({
                noprodisplay: 'block',//无优惠是否显示
                uncondisplay: 'block',//无门槛是否显示
                unconreddisplay: 'block',//无门槛立减是否显示
                qtydisplay: 'block',//按份是否显示
                unconstockdisplay: 'block',//无门槛参与促销库存是否显示
                stocklimitdisplay: 'block',//库存要求是否显示
            });
        } else if (values.indexOf(1) > -1 && values.indexOf(2) > -1) {
            this.changeDispaly({
                noprodisplay: 'none',//无优惠是否显示
                uncondisplay: 'block',//无门槛是否显示
                unconreddisplay: 'none',//无门槛立减是否显示
                qtydisplay: 'none',//按份是否显示
                unconstockdisplay: 'none',//无门槛参与促销库存是否显示
                stocklimitdisplay: 'none',//库存要求是否显示
            })
        } else if (values.indexOf(1) > -1) {
            this.changeDispaly({
                noprodisplay: 'none',//无优惠是否显示
                uncondisplay: 'block',//无门槛是否显示
                unconreddisplay: 'block',//无门槛立减是否显示
                qtydisplay: 'block',//按份是否显示
                unconstockdisplay: 'block',//无门槛参与促销库存是否显示
                stocklimitdisplay: 'none',//库存要求是否显示
            })
        } else if (values.indexOf(2) > -1) {
            this.changeDispaly({
                noprodisplay: 'block',//无优惠是否显示
                uncondisplay: 'block',//无门槛是否显示
                unconreddisplay: 'none',//无门槛立减是否显示
                qtydisplay: 'none',//按份是否显示
                unconstockdisplay: 'none',//无门槛参与促销库存是否显示
                stocklimitdisplay: 'block',//库存要求是否显示
            })
        }
    }

    validateStockLimitChange = async (rule, value, callback) => {
        const { language } = this.props.state;
        if (value === undefined || value === null || value.length === 0) {
            callback(language["salespromotion.required"]);
            return;
        }
    }
    validateProLimitChange = async (rule, value, callback) => {
        const { language } = this.props.state;
        if (value === undefined || value === null || value.length === 0) {
            callback(language["salespromotion.required"]);
            return;
        }
        let channel = this.props.form.getFieldsValue().channel;
        if (channel && channel.indexOf(1) > -1 && channel.indexOf(2) > -1) {
            if (value.indexOf('uncon') < 0) {
                callback(language["salespromotion.required"]);
                return;
            }
        } else if (channel && channel.indexOf(1) > -1) {
            if (value.indexOf('uncon') < 0 && value.indexOf('qty') < 0) {
                callback(language["salespromotion.required"]);
                return;
            }
        } else if (channel && channel.indexOf(2) > -1) {
            if (value.indexOf('uncon') < 0 && value.indexOf('nopro') < 0) {
                callback(language["salespromotion.required"]);
                return;
            }
        }
    }
    validateUnconproChange = async (rule, value, callback) => {
        const { language } = this.props.state;
        if (value === undefined || value === null || value.length === 0) {
            callback(language["salespromotion.required"]);
            return;
        }
        let channel = this.props.form.getFieldsValue().channel;
        if (channel && channel.indexOf(2) > -1) {
            if (value.indexOf('d') < 0) {
                callback(language["salespromotion.required"]);
                return;
            }
        }
    }

    saveSubmit = async () => {
        const { language } = this.props.state;
        let values = this.props.form.getFieldsValue();
        let validateFields = ['name', 'channel', 'siteLan', 'useDate', 'prolimit'];//需要校验的表单
        let channel = values.channel ? values.channel : [];
        if (channel.indexOf(1) > -1 && channel.indexOf(2) > -1) {
            if (values.prolimit && values.prolimit.indexOf('uncon') > -1) {
                validateFields = validateFields.concat('unconpro');
            }
        } else if (channel.indexOf(2) > -1) {
            if (values.prolimit && values.prolimit.indexOf('uncon') > -1) {
                validateFields = validateFields.concat('unconpro');
            }
            if (values.stocklimit && values.stocklimit.indexOf('limit') > -1) {
                validateFields = validateFields.concat('limit');
            }
        } else if (channel.indexOf(1) > -1) {
            if (values.prolimit && values.prolimit.indexOf('uncon') > -1) {
                validateFields = validateFields.concat('unconpro', 'unconstock');
            }
            if (values.prolimit && values.prolimit.indexOf('qty') > -1) {
                validateFields = validateFields.concat('qtypro', 'qtystock');
                if (values.qtypro && values.qtypro.indexOf('full') > -1) {
                    validateFields = validateFields.concat('fullpro');
                }
                if (values.qtypro && values.qtypro.indexOf('each') > -1) {
                    validateFields = validateFields.concat('eachpro');
                }
                if (values.qtypro && values.qtypro.indexOf('ladder') > -1) {
                    validateFields = validateFields.concat('ladderpro');
                }
            }
        }
        this.props.form.validateFields(validateFields, (err, values) => {
            if (!err) {
                this.saveHandler();
            }
        })
    }

    saveHandler = async () => {
        const { language } = this.props.state;
        let controlId = this.props.state.promotionControl.controlId ? this.props.state.promotionControl.controlId : 0;
        let values = this.props.form.getFieldsValue();
        let controlValue = {
            siteLan: values.siteLan,
            ud: values.useDate,
        }
        if (values.channel.indexOf(1) > -1 && values.channel.indexOf(2) > -1) {
            controlValue = {
                ...controlValue,
                pc: {
                    uncon: values.unconpro ? values.unconpro : [],
                }
            }
        } else if (values.channel.indexOf(2) > -1) {
            controlValue = {
                ...controlValue,
                pc: {
                    nopro: values.prolimit.indexOf('nopro') > -1 ? 'y' : 'n',
                    uncon: values.prolimit.indexOf('uncon') > -1 && values.unconpro ? values.unconpro : [],
                },
                productstocklimit: [
                    { nolimit: values.stocklimit && values.stocklimit.indexOf('nolimit') > -1 ? 'y' : 'n' },
                    { limit: values.stocklimit && values.stocklimit.indexOf('limit') > -1 && values.limit ? values.limit : [] }
                ]
            }
        } else if (values.channel.indexOf(1) > -1) {
            let unconstock = [];
            let byQtystock = [];
            if (values.prolimit.indexOf('uncon') > -1 && values.unconstock && values.unconstock.indexOf('n') > -1) {
                unconstock.push('n');
            }
            if (values.prolimit.indexOf('uncon') > -1 && values.unconstock && values.unconstock.indexOf('t') > -1) {
                unconstock.push('t');
            }
            if (values.prolimit.indexOf('qty') > -1 && values.qtystock && values.qtystock.indexOf('n') > -1) {
                byQtystock.push('n');
            }
            if (values.prolimit.indexOf('qty') > -1 && values.qtystock && values.qtystock.indexOf('t') > -1) {
                byQtystock.push('t');
            }
            let byqty = [];
            if (values.prolimit.indexOf('qty') > -1) {
                if (values.qtypro.indexOf('full') > -1 && values.fullpro) {
                    console.log(values.fullpro)
                    await byqty.push({ full: values.fullpro });
                }
                if (values.qtypro.indexOf('each') > -1 && values.eachpro) {
                    console.log(values.eachpro)
                    await byqty.push({ each: values.eachpro });
                }
                if (values.qtypro.indexOf('ladder') > -1 && values.ladderpro) {
                    console.log(values.ladderpro)
                    await byqty.push({ ladder: values.ladderpro });
                }
            }
            
            controlValue = {
                ...controlValue,
                pc: {
                    uncon: values.prolimit.indexOf('uncon') > -1 ? values.unconpro : [],
                    byQty: byqty,
                    unconstock: unconstock,
                    byQtystock: byQtystock,
                },
            }
        }
        let saveParam = {
            controlId: controlId,
            name: values.name,
            channel: values.channel,
            controlValue: JSON.stringify(controlValue),
        }
        let result = await this.props.handlers.handlerSaveControl(saveParam);
        if (result.resultStatus.isSuccess) {
            message.success(language["salespromotion.saved_successfully"]);
            this.props.form.resetFields();
            this.props.handlers.handlerForward('/salespromotion/promotioncontrol');
        } else {
            Modal.warning({
                title: language["salespromotion.save_failed"],
                content: result.resultStatus.customerErrorMessage,
                onOk: this.onCancel,
            });
        }
    }

    render() {
        const {
            getFieldDecorator, getFieldValue,
        } = this.props.form;
        const { language, promotionControl, siteLan } = this.props.state;
        const RangePicker = DatePicker.RangePicker;
        const channel = [{ "label": language["ruletemplate.Solicitation"], "value": 2 }, { "label": language["ruletemplate.tool"], "value": 1 }];
        const useDate = [{ "label": language["typedetails.Notlimited"], "value": 'n' }];
        const promotionType = [{ "label": language["salespromotion.Discountpercentage"], "value": 'd' }, { "label": language["ruletemplate.Verticalreduction"], "value": 'r' }];
        const stock = [{ "label": language["ruletemplate.Unlimited"], "value": 'n' }, { "label": language["ruletemplate.Discounttimes"], "value": 't' }];
        const limitwarning = <span >1、{language["salespromotion.sentence_of_one"]} <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    {language["salespromotion.sentence_of_tow"]};<br />2、{language["salespromotion.sentence_of_three"]}</span>;
        const unconstockwarning = <span>{language["salespromotion.sentence_of_four"]}<br />{language["salespromotion.sentence_of_fives"]};<br />{language["salespromotion.sentence_of_six"]}<br />{language["salespromotion.sentence_of_seven"]}</span>;
        const qtystockwarning = <span>{language["salespromotion.sentence_of_eight"]}</span>;

        return (
            <BasicLayout
                siteName={language["salespromotion.marketing_tool_management"]}
                title={language["ruletemplate.tool"]}
                permissionCode="ttd_salespromotion_control_detail"
            >
                <div className="promotion-control-detail">
                    <Card bodyStyle={{ padding: '24px 0px' }} style={{ width: 1400 }}
                        title={promotionControl.canEdit ? language["typedetails.Typedetails"] : <span>{language["typedetails.Typedetails"]}<span style={{ color: '#FF0000' }}>{language["salespromotion.sentence_of_nine"]}</span></span>}
                    >
                        <Form>
                            <Row gutter={8}>
                                <Col span={24} style={{ marginTop: 10 }}>
                                    <Form.Item label={(<b>{language['type.typename']}</b>)} {...formItemInputeLayout}>
                                        {getFieldDecorator('name', {
                                            initialValue: promotionControl.name,
                                            rules: [{ required: true, message: language["salespromotion.required_field"] }],
                                        })(
                                            <Input style={{ width: 373 }} placeholder={language['typedetails.Fillinthenametips']} disabled={!promotionControl.canEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <Form.Item label={<b>{language['rule.Marketingtype']}</b>} {...formItemLayout}>
                                        {getFieldDecorator('channel', {
                                            initialValue: promotionControl.channel,
                                            rules: [{ required: true, message: language["salespromotion.required"] + '!' }],
                                        })(
                                            <Checkbox.Group options={channel} onChange={this.channelchange} disabled={!promotionControl.canEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <Form.Item label={<b>{language['ruletemplate.locale']}</b>} {...formItemLayout}>
                                        {getFieldDecorator('siteLan', {
                                            initialValue: promotionControl.siteLan,
                                            rules: [{ required: true, message: language["salespromotion.required"] + '!' }],
                                        })(
                                            <Checkbox.Group options={siteLan} disabled={!promotionControl.canEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <Form.Item label={<b>{language['ruletemplate.usetime']}</b>} {...formItemLayout}>
                                        {getFieldDecorator('useDate', {
                                            initialValue: promotionControl.ud && promotionControl.ud.indexOf('n') > -1 ? ['n'] : ['n'],
                                            rules: [{ required: true, message: language["salespromotion.required"] + '!' }],
                                        })(
                                            <Checkbox.Group options={useDate} disabled={!promotionControl.canEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={8}>
                                <Col span={24}  >

                                    <Form.Item label={
                                        <b className="promotion-active-limit" >
                                            <Popover placement="left" content={limitwarning}>
                                                <Icon type="question-circle" />
                                            </Popover>
                                            {language['typedetails.Activityrestriction']}
                                        </b>} {...formItemLayout}>
                                        {getFieldDecorator('prolimit', {
                                            initialValue: promotionControl.prolimit,
                                            rules: [{ required: true, message: ' ' }, { validator: this.validateProLimitChange }],
                                        })(
                                            <Checkbox.Group style={{ width: 677,marginTop:10 }} disabled={!promotionControl.canEdit}>
                                                <Col style={{ marginBottom: 36,  display: this.props.state.noprodisplay }}>
                                                    <Checkbox value="nopro">{language["typedetails.Nodiscount"]}</Checkbox>
                                                </Col>
                                                <Col style={{ marginBottom: 36, display: this.props.state.uncondisplay }}>
                                                    <Checkbox value="uncon" onChange={this.unconchange}>{language["ruletemplate.Nothreshold"]}</Checkbox>
                                                    <Row gutter={8} style={{ backgroundColor: '#F9F9F9', marginTop: 10, width: 677, marginLeft: 0, marginRight: 0, display: this.props.state.uncongroupdisplay }}>
                                                        <Row gutter={8}>
                                                            <Col span={12} style={{ marginTop: 10 }}>
                                                                <Form.Item label={language["ruletemplate.Preferentialway"]} {...proformItemLayout}>
                                                                    {getFieldDecorator('unconpro', {
                                                                        initialValue: promotionControl.uncon,
                                                                        rules: [{ required: true, message: ' ' }, { validator: this.validateUnconproChange }],
                                                                    })(
                                                                        <Checkbox.Group disabled={!promotionControl.canEdit}>
                                                                            <Col style={{ marginTop: 10 }}>
                                                                                <Checkbox value="d">{language["salespromotion.Discountpercentage"]}</Checkbox>
                                                                            </Col>
                                                                            <Col style={{ marginTop: 20, display: this.props.state.unconreddisplay }}>
                                                                                <Checkbox value="r">{language["ruletemplate.Verticalreduction"]}</Checkbox>
                                                                            </Col>
                                                                        </Checkbox.Group>
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Row gutter={8} style={{ display: this.props.state.unconstockdisplay }}>
                                                            <Col span={12}>
                                                                <div className="promotion-control-detail-form">
                                                                    <Form.Item label={<span>
                                                                        <span className="promition-must-full" >*</span>
                                                                        <Popover placement="left" content={unconstockwarning}>
                                                                            <Icon type="question-circle" />
                                                                        </Popover>&nbsp;
                                                                                {language['ruletemplate.Promotionalinventory']}
                                                                    </span>} {...proformItemLayout}>
                                                                        {getFieldDecorator('unconstock', {
                                                                            initialValue: promotionControl.unconstock,
                                                                            rules: [{ required: true, message: language["salespromotion.required"] + '！' }],
                                                                        })(
                                                                            <Checkbox.Group className="promiotion-detail-unlimit" options={stock} disabled={!promotionControl.canEdit} />
                                                                        )}
                                                                    </Form.Item>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Row>
                                                </Col>
                                                <Col style={{ display: this.props.state.qtydisplay }}>
                                                    <Checkbox value="qty" onChange={this.qtychange}>{language["ruletemplate.Eachdiscount"]}</Checkbox>
                                                    <Row gutter={8} style={{ backgroundColor: '#F9F9F9', marginTop: 10, width: 677, marginLeft: 0, marginRight: 0, display: this.props.state.qtygroupdisplay }}>
                                                        <Row gutter={8}>
                                                            <Col span={12} style={{ marginTop: 10 }}>
                                                                <Form.Item label={language["ruletemplate.Preferentialterms"]} {...proformItemLayout}>
                                                                    {getFieldDecorator('qtypro', {
                                                                        initialValue: promotionControl.byqty,
                                                                        rules: [{ required: true, message: language["salespromotion.required"] + '' }],
                                                                    })(
                                                                        <Checkbox.Group disabled={!promotionControl.canEdit}>
                                                                            <Col style={{ marginTop: 10 }}>
                                                                                <Checkbox value="full" onChange={this.qtyfullchange}>{language["ruletemplate.Fullnoffers"]}</Checkbox>
                                                                                <Row gutter={8} style={{ backgroundColor: '#FDFDFD', marginTop: 10, width: 411, marginLeft: 0, marginRight: 0, display: this.props.state.qtyfullgroupdisplay }}>
                                                                                    <Col span={10} style={{ marginTop: 10, width: "100%" }}>
                                                                                        <Form.Item label={language["ruletemplate.Preferentialway"]} {...pro2formItemLayout}>
                                                                                            {getFieldDecorator('fullpro', {
                                                                                                initialValue: promotionControl.full,
                                                                                                rules: [{ required: true, message: language["salespromotion.required"] + '!' }],
                                                                                            })(
                                                                                                <Checkbox.Group disabled={!promotionControl.canEdit}>
                                                                                                    <Col style={{ marginTop: 10 }}>
                                                                                                        <Checkbox value="d">{language["salespromotion.Discountpercentage"]}</Checkbox>
                                                                                                    </Col>
                                                                                                    <Col style={{ marginTop: 20 }}>
                                                                                                        <Checkbox value="r">{language["ruletemplate.Verticalreduction"]}</Checkbox>
                                                                                                    </Col>
                                                                                                </Checkbox.Group>
                                                                                            )}
                                                                                        </Form.Item>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>
                                                                            <Col style={{ marginTop: 10 }}>
                                                                                <Checkbox value="each" onChange={this.qtyeachchange}>{language["typedetails.Preferentialterms2"]}</Checkbox>
                                                                                <Row gutter={8} style={{ backgroundColor: '#FDFDFD', marginTop: 10, width: 411, marginLeft: 0, marginRight: 0, display: this.props.state.qtyeachgroupdisplay }}>
                                                                                    <Col span={10} style={{ marginTop: 10, width: "100%" }}>
                                                                                        <Form.Item label={language["ruletemplate.Preferentialway"]} {...pro2formItemLayout}>


                                                                                            {getFieldDecorator('eachpro', {
                                                                                                initialValue: promotionControl.each,
                                                                                                rules: [{ required: true, message: language["salespromotion.required"] + '!' }],
                                                                                            })(
                                                                                                <Checkbox.Group disabled={!promotionControl.canEdit}>
                                                                                                    <Checkbox value="r">{language["ruletemplate.Verticalreduction"]}</Checkbox>
                                                                                                </Checkbox.Group>
                                                                                            )}







                                                                                        </Form.Item>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>
                                                                            <Col style={{ marginTop: 10 }}>
                                                                                <Checkbox value="ladder" onChange={this.qtyladderchange}>{language["typedetails.Preferentialterms3"]}</Checkbox>
                                                                                <Row gutter={8} style={{ backgroundColor: '#FDFDFD', marginTop: 10, marginLeft: 0, marginRight: 0, width: 411, display: this.props.state.qtyladdergroupdisplay }}>
                                                                                    <Col span={10} style={{ marginTop: 10, width: "100%" }}>
                                                                                        <Form.Item label={language["ruletemplate.Preferentialway"]} {...pro2formItemLayout}>
                                                                                            {getFieldDecorator('ladderpro', {
                                                                                                initialValue: promotionControl.ladder,
                                                                                                rules: [{ required: true, message: language["salespromotion.required"] + '!' }],
                                                                                            })(
                                                                                                <Checkbox.Group disabled={!promotionControl.canEdit}>
                                                                                                    <Col style={{ marginTop: 10 }}>
                                                                                                        <Checkbox value="d">{language["salespromotion.Discountpercentage"]}</Checkbox>
                                                                                                    </Col>
                                                                                                    <Col style={{ marginTop: 20 }}>
                                                                                                        <Checkbox value="r">{language["ruletemplate.Verticalreduction"]}</Checkbox>
                                                                                                    </Col>
                                                                                                </Checkbox.Group>
                                                                                            )}
                                                                                        </Form.Item>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>
                                                                        </Checkbox.Group>
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Row gutter={8}>
                                                            <Col span={12}>
                                                                <div className="promotion-control-detail-form">
                                                                    <Form.Item label={<span>
                                                                        <span className="promition-must-full" >*</span>
                                                                        <Popover placement="left" content={qtystockwarning}>
                                                                            <Icon type="question-circle" />
                                                                        </Popover>&nbsp;
                                                                                {language['ruletemplate.Promotionalinventory']}
                                                                    </span>} {...proformItemLayout}>
                                                                        {getFieldDecorator('qtystock', {
                                                                            initialValue: promotionControl.byQtystock,
                                                                            rules: [{ required: true, message: language["salespromotion.required"] + '！' }],
                                                                        })(
                                                                            <Checkbox.Group className="promiotion-detail-unlimit" options={stock} disabled={!promotionControl.canEdit} />
                                                                        )}
                                                                    </Form.Item>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Row>
                                                </Col>
                                            </Checkbox.Group>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={8} style={{ margin: 0, display: this.props.state.stocklimitdisplay }}>
                                <Col span={24} style={{ borderBottom: "1px solid #ECECEC", padding: 0 }} >
                                    <Form.Item style={{ marginBottom: 30 }} label={<b>{language['salespromotion.stocklimit']}</b>} {...formItemLayout}>
                                        {getFieldDecorator('stocklimit', {
                                            initialValue: promotionControl.stocklimit,
                                            rules: [],
                                        })(
                                            <Checkbox.Group disabled={!promotionControl.canEdit}>
                                                <Col style={{ marginTop: 10 }}>
                                                    <Checkbox value="nolimit">{language["salespromotion.unlimited_stock"]}</Checkbox>
                                                </Col>
                                                <Col style={{ marginTop: 24 }}>
                                                    <Checkbox value="limit" onChange={this.stocklimitchange}>{language["salespromotion.limited_stock"]}</Checkbox>
                                                    <Row gutter={8} style={{ backgroundColor: '#F9F9F9', marginTop: 10, width: 677, marginLeft: 0, marginRight: 0, display: this.props.state.stocklimitgroupdisplay }}>
                                                        <Col span={10} style={{ width: "100%" }} >
                                                            <Form.Item {...formItemLayout}>
                                                                {getFieldDecorator('limit', {
                                                                    initialValue: promotionControl.limit,
                                                                    rules: [{ validator: this.validateStockLimitChange }],
                                                                })(
                                                                    <Checkbox.Group style={{ marginLeft: 26 }} disabled={!promotionControl.canEdit}>
                                                                        <Col style={{ marginTop: 20 }}>
                                                                            <Checkbox value="s">{language["typedetails.Dailyinventory"]}</Checkbox>
                                                                        </Col>
                                                                        <Col style={{ marginTop: 20 }}>
                                                                            <Checkbox value="t">{language["typedetails.Totalinventory"]}</Checkbox>
                                                                        </Col>
                                                                        <Col style={{ marginTop: 20 }}>
                                                                            <Checkbox value="u">{language["typedetails.Unlimitedinventory"]}</Checkbox>
                                                                        </Col>
                                                                    </Checkbox.Group>
                                                                )}
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Checkbox.Group>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={8} style={{ marginTop: 23 }}>
                                <Col span={2} offset={13}>
                                    <Link to={`/salespromotion/promotioncontrol`}><Button size="large">{language["common.map.cancel"]}</Button></Link>
                                </Col>
                                <Col span={2}>
                                    <Button type="primary" size="large" style={{ color: '#FFFFFF' }} onClick={this.saveSubmit} disabled={!promotionControl.canEdit}>{language["salespromotion.save"]}</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            </BasicLayout>
        );
    }
}

export default BasicPage;