import React, { PureComponent } from 'react';
import {
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Icon,
    Input,
    message,
    Modal,
    Popover,
    Radio,
    Row,
    Select,
} from 'antd/lib/index';
import BasicLayout from "../../../component/BasicLayout";
import { Link } from "react-imvc/component";

const { confirm } = Modal;
const { TextArea } = Input;
//为布局美观默认form item栅格比例为6：18
const formItemLayout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 21,
    },
};
const innerFormItemLayout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 12,
    },
};
const proformItemLayout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 14,
    },
};
const formItemInputLayout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 10,
    },
};

@Form.create()
class BasicPage extends PureComponent {
    constructor(props) {
        super(props);
    }

    /*  componentDidMount() {
          ReactQuill =
      }*/

    changeDispaly = async (param) => {
        await this.props.handlers.handlerChangeDisplay(param);
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

    validateLimit = async (rule, value, callback) => {
        const { language } = this.props.state
        if (value === undefined || value === null || value === "") {
            callback(language["salespromotion.Please_fill_value"] + "!");
            return;
        }
        if (isNaN(Number(value))) {
            callback(language["salespromotion.fill_correct_value"] + "!");
            return;
        }
        if (value.indexOf('.') > -1) {
            callback(language["salespromotion.fill_correct_value"] + "!");
            return;
        }
        if (value < 0) {
            callback(language["salespromotion.fill_correct_value"] + "!");
            return;
        }
        callback();
        return;
    }

    validateInt = async (rule, value, callback) => {
        const { language } = this.props.state
        if (value === undefined || value === null || value === "") {
            callback(language["salespromotion.required_field"]);
            return;
        }
        if (isNaN(parseFloat(value))) {
            callback(language["salespromotion.Only_integers_supported"] + "!");
            return;
        }
        if (value.toString().indexOf('.') > -1) {
            callback(language["salespromotion.Only_integers_supported"] + "!");
            return;
        }
        if (value < 0) {
            callback(language["salespromotion.Only_integers_supported"] + "!");
            return;
        }
        callback();
        return;
    }

    validateBaseQty = async (rule, value, callback) => {
        const { language } = this.props.state
        if (value === undefined || value === null || value === "") {
            callback();
            return;
        }
        if (isNaN(Number(value))) {
            callback(language["salespromotion.Please_number_products"] + "!");
            return;
        }
        if (value.toString().indexOf('.') > -1) {
            callback(language["salespromotion.Please_number_products"] + "!");
            return;
        }
        if (value < 0) {
            callback(language["salespromotion.Please_number_products"] + "!");
            return;
        }
        callback();
        return;
    }

    validateNumber = async (rule, value, callback) => {
        const { language } = this.props.state
        if (value === undefined || value === null || value === "") {
            callback(language["salespromotion.required_field"]);
            return;
        }
        if (isNaN(parseFloat(value))) {
            callback(language["salespromotion.please_input_count"]);
            return;
        }
        callback();
        return;
    }

    validateQualityScore = async (rule, value, callback) => {
        const { language } = this.props.state
        if (value !== undefined && value !== null && value !== '') {
            if (isNaN(parseFloat(value.trim()))) {
                callback(language["salespromotion.fill_quality_score"] + "!");
                return;
            }
        }
        callback();
        return;
    }

    validateModalSet = async (rule, value, callback) => {
        const { language } = this.props.state
        let message = "";
        let field = rule.field;
        let promotionControl = this.props.state.promotionControl ? this.props.state.promotionControl : {};
        if (field === 'uncondiscountvalidate' && promotionControl.isuncon && promotionControl.uncon.indexOf('d') > -1 && !this.props.state.unconDiscountSet) {
            message = language["salespromotion.please_set_percentage_range"] + "!";
        } else if (field === 'unconreducevalidate' && promotionControl.isuncon && promotionControl.uncon.indexOf('r') > -1 && !this.props.state.unconReduceSet) {
            message = language["salespromotion.set_vertical_reduction_range"] + "!";
        } else if (field === 'fullscopevalidate' && promotionControl.isfull && !this.props.state.fullScopeSet) {
            message = language["salespromotion.set_number_copies"] + "!";
        } else if (field === 'fulldiscountvalidate' && promotionControl.isfull && promotionControl.full.indexOf('d') > -1 && !this.props.state.fullDiscountSet) {
            message = language["salespromotion.please_set_percentage_range"] + "!";
        } else if (field === 'fullreducevalidate' && promotionControl.isfull && promotionControl.full.indexOf('r') > -1 && !this.props.state.fullReduceSet) {
            message = language["salespromotion.set_vertical_reduction_range"] + "!";
        } else if (field === 'eachscopevalidate' && promotionControl.iseach && !this.props.state.eachScopeSet) {
            message = language["salespromotion.set_number_copies"] + "!";
        } else if (field === 'eachreducevalidate' && promotionControl.iseach && promotionControl.each.indexOf('r') > -1 && !this.props.state.eachReduceSet) {
            message = language["salespromotion.set_vertical_reduction_range"] + "!";
        } else if (field === 'ladderscopevalidate' && promotionControl.isladder && !this.props.state.ladderScopeSet) {
            message = language["salespromotion.set_number_copies"] + "!";
        } else if (field === 'ladderdiscountvalidate' && promotionControl.isladder && promotionControl.ladder.indexOf('d') > -1 && !this.props.state.ladderDiscountSet) {
            message = language["salespromotion.please_set_percentage_range"] + "!";
        } else if (field === 'ladderreducevalidate' && promotionControl.isladder && promotionControl.ladder.indexOf('r') > -1 && !this.props.state.ladderReduceSet) {
            message = language["salespromotion.set_vertical_reduction_range"] + "!";
        }
        if (message === "") {
            callback();
            return;
        } else {
            callback(message);
            return;
        }
    }

    saveSubmit = async () => {
        let values = this.props.form.getFieldsValue();
        let channel = values.channel;
        let businessLine = values.businessLine;
        let validateFields = ['name', 'tag', 'channel', 'businessLine', 'controlId', 'sort'];//需要校验的表单
        let promotionControl = this.props.state.promotionControl ? this.props.state.promotionControl : {};
        if (promotionControl.isuncon && promotionControl.uncon.indexOf('d') > -1) {
            validateFields.push('uncondiscountvalidate');
        }
        if (promotionControl.isuncon && promotionControl.uncon.indexOf('r') > -1) {
            validateFields.push('unconreducevalidate');
        }
        if (promotionControl.isfull) {
            validateFields.push('fullscopevalidate');
        }
        if (promotionControl.isfull && promotionControl.full.indexOf('d') > -1) {
            validateFields.push('fulldiscountvalidate');
        }
        if (promotionControl.isfull && promotionControl.full.indexOf('r') > -1) {
            validateFields.push('fullreducevalidate');
        }
        if (promotionControl.iseach) {
            validateFields.push('eachscopevalidate');
        }
        if (promotionControl.iseach && promotionControl.each.indexOf('r') > -1) {
            validateFields.push('eachreducevalidate');
        }
        if (promotionControl.isladder) {
            validateFields.push('ladderscopevalidate');
        }
        if (promotionControl.isladder && promotionControl.ladder.indexOf('d') > -1) {
            validateFields.push('ladderdiscountvalidate');
        }
        if (promotionControl.isladder && promotionControl.ladder.indexOf('r') > -1) {
            validateFields.push('ladderreducevalidate');
        }
        if (promotionControl.islimit && promotionControl.limit.indexOf('s') > -1) {
            validateFields.push('slimit');
        }
        if (promotionControl.islimit && promotionControl.limit.indexOf('t') > -1) {
            validateFields.push('tlimit');
        }
        if (channel === 2 && businessLine === 1) {
            validateFields.push('ruleFileds');
        }
        if (channel === 1 && businessLine === 1) {
            validateFields.push('productCategory', 'ruleFeature', 'ruleRemark', 'iconLink', 'baseQty', 'participant', 'qualityScore');
            if (values.frontendLocalList && values.frontendLocalList.length > 0) {
                for (let i = 0; i < values.frontendLocalList.length; i++) {
                    validateFields.push('frontendTitle_' + i, 'frontendLink_' + i);
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
        const { language } = this.props.state
        let templateId = this.props.state.promotionTemplate.templateId ? this.props.state.promotionTemplate.templateId : 0;
        let promotionControl = this.props.state.promotionControl ? this.props.state.promotionControl : {};
        let values = this.props.form.getFieldsValue();
        let qs = {}, ds = {}, rs = {};
        if (promotionControl.isuncon) {
            if (promotionControl.uncon.indexOf('d') > -1) {
                let unconDiscount = this.props.state.unconDiscount;
                let optional = [];
                if (unconDiscount.customDisList && unconDiscount.customDisList.length > 0) {
                    for (let i = 0; i < unconDiscount.customDisList.length; i++) {
                        optional.push(unconDiscount.customDisList[i]);
                    }
                }
                ds = {
                    ...ds,
                    non: {
                        optional: optional,
                        custom: unconDiscount.discountStart && unconDiscount.discountEnd
                            ? unconDiscount.discountStart + '-' + unconDiscount.discountEnd : ''
                    }
                }
            }
            if (promotionControl.uncon.indexOf('r') > -1) {
                let unconReduce = this.props.state.unconReduce;
                rs = {
                    ...rs,
                    non: [
                        {
                            currency: unconReduce.reduceCurrency,
                            amount: unconReduce.reduceMinAmount,
                        }
                    ]
                }
            }
        }
        if (promotionControl.isfull) {
            qs = {
                ...qs,
                full: this.props.state.fullScope.scopeStart + '-' + this.props.state.fullScope.scopeEnd,
            }
            if (promotionControl.full.indexOf('d') > -1) {
                let fullDiscount = this.props.state.fullDiscount;
                let optional = [];
                if (fullDiscount.customDisList && fullDiscount.customDisList.length > 0) {
                    for (let i = 0; i < fullDiscount.customDisList.length; i++) {
                        optional.push(fullDiscount.customDisList[i]);
                    }
                }
                ds = {
                    ...ds,
                    full: {
                        optional: optional,
                        custom: fullDiscount.discountStart && fullDiscount.discountEnd
                            ? fullDiscount.discountStart + '-' + fullDiscount.discountEnd : ''
                    }
                }
            }
            if (promotionControl.full.indexOf('r') > -1) {
                let fullReduce = this.props.state.fullReduce;
                rs = {
                    ...rs,
                    full: [
                        {
                            currency: fullReduce.reduceCurrency,
                            amount: fullReduce.reduceMinAmount,
                        }
                    ]
                }
            }
        }
        if (promotionControl.iseach) {
            qs = {
                ...qs,
                each: this.props.state.eachScope.scopeStart + '-' + this.props.state.eachScope.scopeEnd,
            }
            if (promotionControl.each.indexOf('r') > -1) {
                let eachReduce = this.props.state.eachReduce;
                rs = {
                    ...rs,
                    each: [
                        {
                            currency: eachReduce.reduceCurrency,
                            amount: eachReduce.reduceMinAmount,
                        }
                    ]
                }
            }
        }
        if (promotionControl.isladder) {
            qs = {
                ...qs,
                ladder: this.props.state.ladderScope.scopeStart + '-' + this.props.state.ladderScope.scopeEnd,
            }
            if (promotionControl.ladder.indexOf('d') > -1) {
                let ladderDiscount = this.props.state.ladderDiscount;
                let optional = [];
                if (ladderDiscount.customDisList && ladderDiscount.customDisList.length > 0) {
                    for (let i = 0; i < ladderDiscount.customDisList.length; i++) {
                        optional.push(ladderDiscount.customDisList[i]);
                    }
                }
                ds = {
                    ...ds,
                    ladder: {
                        optional: optional,
                        custom: ladderDiscount.discountStart && ladderDiscount.discountEnd
                            ? ladderDiscount.discountStart + '-' + ladderDiscount.discountEnd : ''
                    }
                }
            }
            if (promotionControl.ladder.indexOf('r') > -1) {
                let ladderReduce = this.props.state.ladderReduce;
                rs = {
                    ...rs,
                    ladder: [
                        {
                            currency: ladderReduce.reduceCurrency,
                            amount: ladderReduce.reduceMinAmount,
                        }
                    ]
                }
            }
        }
        let slimit = '', tlimit = '';
        if (promotionControl.islimit && promotionControl.limit.indexOf('s') > -1) {
            slimit = values.slimit;
        }
        if (promotionControl.islimit && promotionControl.limit.indexOf('t') > -1) {
            tlimit = values.tlimit;
        }
        let controlValueScope = {
            qs: qs,
            ds: ds,
            rs: rs,
            slimit: slimit,
            tlimit: tlimit,
        };

        let templateValue = {};
        if (values.channel === 2 && values.businessLine === 1) {
            templateValue = {
                mktCollectRuleField: values.ruleFileds,
            };
        }
        if (values.channel === 1 && values.businessLine === 1) {
            let frontendLocal = [];
            if (values.frontendLocalList && values.frontendLocalList.length > 0) {
                for (let i = 0; i < values.frontendLocalList.length; i++) {
                    frontendLocal.push({
                        imgTitle: values.frontendLocalList[i].imgTitle,
                        imgLink: values.frontendLocalList[i].imgLink,
                    });
                }
            }
            templateValue = {
                productCategory: values.productCategory,
                ruleFeature: values.ruleFeature,
                ruleRemark: values.ruleRemark,
                frontendLocal: frontendLocal,
                iconLink: values.iconLink,
                baseQty: values.baseQty,
                participant: values.participant,
                qualityScore: values.qualityScore,
            }
        }

        let saveParam = {
            templateId: templateId,
            name: values.name,
            controlId: values.controlId,
            businessLine: values.businessLine,
            tag: values.tag,
            channel: values.channel,
            sort: values.sort,
            controlValueScope: JSON.stringify(controlValueScope),
            templateValue: JSON.stringify(templateValue),
        }
        let result = await this.props.handlers.handlerSaveTemplate(saveParam);
        if (result.resultStatus.isSuccess) {
            message.success(language["salespromotion.saved_successfully"]);
            this.props.form.resetFields();
            this.props.handlers.handlerForward('/salespromotion/promotiontemplate');
        } else {
            Modal.warning({
                title: language["salespromotion.save_failed"],
                content: result.resultStatus.customerErrorMessage,
                onOk: this.onCancel,
            });
        }
    }

    changeChannel = (value) => {

        let resetFiled = ['slimit', 'tlimit', 'sort', 'controlId', 'qualityScore', 'participant',
            'baseQty', 'iconLink', 'frontendLocalList', 'ruleRemark', 'ruleFeature', 'productCategory', 'ruleFileds'];
        this.props.form.resetFields(resetFiled);
        this.props.handlers.handlerChangeChannel(value);
    }

    changeControlId = (value) => {
        let resetFiled = ['slimit', 'tlimit', 'sort', 'qualityScore', 'participant',
            'baseQty', 'iconLink', 'frontendLocalList', 'ruleRemark', 'ruleFeature', 'productCategory', 'ruleFileds'];
        this.props.form.resetFields(resetFiled);
        this.props.handlers.handlerChangeControl(value, this.props.state.promotionTemplate.promotionControl
            && this.props.state.promotionTemplate.promotionControl.controlId ? this.props.state.promotionTemplate.promotionControl.controlId : 0);
    }


    validateDisStart = async (rule, value, callback) => {
        let SwitchIngValue = Number(value)
        const { language } = this.props.state
        if (SwitchIngValue === undefined || SwitchIngValue === null || SwitchIngValue === "") {
            callback(language["salespromotion.please_fill_discount_percentage"] + "!");
            return;
        }
        if (isNaN(SwitchIngValue)) {
            callback(language["salespromotion.persentage_range"]);
            return;
        }
        if (SwitchIngValue <= 0 || SwitchIngValue >= 100) {
            callback(language["salespromotion.persentage_range"]);
            return;
        }
        if (SwitchIngValue % 1 !== 0) {
            callback(language["salespromotion.persentage_range"]);
            return;
        }
        let end = this.props.form.getFieldsValue().discountEnd;
        if (end !== undefined && end !== null && end !== '') {
            if (SwitchIngValue >= end) {
                callback(language["salespromotion.persentage_range"]);
                return;
            }
        }
        callback();
        return;
    }

    validateDisEnd = async (rule, value, callback) => {
        let SwitchIngValue = Number(value)
        const { language } = this.props.state
        if (value === undefined || value === null || value === "") {
            callback(language["salespromotion.please_fill_discount_percentage"] + "!");
            return;
        }
        if (isNaN(SwitchIngValue)) {
            callback(language["salespromotion.persentage_range"]);
            return;
        }
        if (SwitchIngValue <= 0 || SwitchIngValue >= 100) {
            callback(language["salespromotion.persentage_range"]);
            return;
        }
        if (SwitchIngValue % 1 !== 0) {
            callback(language["salespromotion.persentage_range"]);
            return;
        }
        let start = this.props.form.getFieldsValue().discountStart;
        if (start !== undefined && start !== null && start != '') {
            if (SwitchIngValue <= start) {
                callback(language["salespromotion.persentage_range"]);
                return;
            }
        }
        callback();
        return;
    }

    validateScopeStart = async (rule, value, callback) => {

        const { language } = this.props.state
        if (value === undefined || value === null || value === "") {
            callback(language["salespromotion.please_the_number_copies"] + "!");
            return;
        }
        if (isNaN(Number(value))) {
            callback(language["salespromotion.fill_correct_number_copies"] + "!");
            return;
        }
        if (value.indexOf(".") > -1) {
            callback(language["salespromotion.fill_correct_number_copies"] + "!");
            return;
        }
        if (value <= 1) {
            callback(language["salespromotion.fill_correct_number_copies"] + "!");
            return;
        }
        let end = this.props.form.getFieldsValue().scopeEnd;
        if (end !== undefined && end !== null && end !== '' && Number(value) >= Number(end)) {
            callback(language["salespromotion.please_input_range"]);
            return;
        }
        callback();
        return;
    }

    validateScopeEnd = async (rule, value, callback) => {
        const { language } = this.props.state
        if (value === undefined || value === null || value === "") {
            callback(language["salespromotion.please_the_number_copies"] + "!");
            return;
        }
        if (isNaN(Number(value))) {
            callback(language["salespromotion.fill_correct_number_copies"] + "!");
            return;
        }
        if (value.indexOf(".") > -1) {
            callback(language["salespromotion.fill_correct_number_copies"] + "!");
            return;
        }
        if (value <= 1) {
            callback(language["salespromotion.fill_correct_number_copies"] + "!");
            return;
        }
        let start = this.props.form.getFieldsValue().scopeStart;
        if (start !== undefined && start !== null && start !== '' && Number(value) <= Number(start)) {
            callback(language["salespromotion.please_input_range"]);
            return;
        }
        callback();
        return;
    }

    validateCustom = async (rule, value, callback) => {
        let SwitchIngValue = Number(value)
        const { language } = this.props.state
        this.refeshKeys('customDisList');
        if (SwitchIngValue === undefined || SwitchIngValue === null || SwitchIngValue === "") {
            callback(language["salespromotion.please_fill_discount_percentage"] + "!");
            return;
        }
        if (isNaN(Number(SwitchIngValue))) {
            callback(language["salespromotion.persentage_range"]);
            return;
        }
        if (SwitchIngValue <= 0 || SwitchIngValue >= 100) {
            callback(language["salespromotion.persentage_range"]);
            return;
        }
        // if (value.indexOf('.') > -1 && value.substr(value.indexOf('.') + 1).length > 1) {
        //     callback(language["salespromotion.Please_only_place"] + "!");
        //     return;
        // }
        if (SwitchIngValue % 1 !== 0) {
            callback(language["salespromotion.persentage_range"]);
            return;
        }
        let customDisList = this.props.form.getFieldValue('customDisList');

        let repeatcount = 0;
        for (let i = 0; i < customDisList.length; i++) {
            if (value === customDisList[i]) {
                repeatcount++;
            }
        }
        if (repeatcount > 1) {
            callback(language["salespromotion.not_discount_ranges"] + "!");
            return;
        }
        callback();
        return;
    }

    validateFrontend = async (rule, value, callback) => {
        const { language } = this.props.state
        this.refeshKeys('frontendLocalList');
        console.log(value)
        if (value === undefined || value === null || value === '') {
            callback(language["salespromotion.required"] + '！');
            return;
        }
        callback();
        return;
    }

    validateSelect = async (rule, value, callback) => {
        const { language } = this.props.state
        if (value === undefined || value === null || value === 0) {
            callback(language["salespromotion.required"] + '！');
            return;
        }
        callback();
        return;
    }

    refeshKeys = (listName) => {

        const { form } = this.props;
        if (listName === 'customDisList') {
            const len = form.getFieldValue('customDisList').length;
            if (len > 0) {
                let customDisList = [];
                for (let i = 0; i < len; i++) {
                    let key = 'custom_' + i;
                    customDisList.push(form.getFieldValue(key));
                }
                form.setFieldsValue({
                    customDisList: customDisList,
                });
            }
        } else if (listName === 'frontendLocalList') {
            const len = form.getFieldValue('frontendLocalList').length;
            let frontendLocalList = [];
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    let title = form.getFieldValue('frontendTitle_' + i);
                    let link = form.getFieldValue('frontendLink_' + i);
                    frontendLocalList.push({ imgTitle: title, imgLink: link });
                }
            }
            form.setFieldsValue({
                frontendLocalList: frontendLocalList,
            });
        }
    }

    modalSubmit = (modalName) => {
        let validatorFileds = [];
        if (modalName === 'discount') {
            if (this.props.state.discountCustomShowSwitch) {
                let length = this.props.form.getFieldsValue().customDisList.length;
                for (let i = 0; i < length; i++) {
                    validatorFileds.push('custom_' + i);
                }
            }
            if (this.props.state.discountCustomSwitch) {
                validatorFileds.push('discountStart', 'discountEnd');
            }
        } else if (modalName === 'reduce') {
            validatorFileds = ['reduceCurrency', 'reduceMinAmount'];
        } else if (modalName === 'scope') {
            validatorFileds = ['scopeStart', 'scopeEnd'];
        }
        this.props.form.validateFields(validatorFileds, (err, values) => {
            if (!err) {
                this.handlerModelSubmit(modalName);
            }
        })
    }

    handlerModelSubmit = (modalName) => {
        let modalValue = {};
        let values = this.props.form.getFieldsValue();
        if (modalName === 'discount') {
            if (this.props.state.discountCustomShowSwitch) {
                modalValue = {
                    ...modalValue,
                    discountCustom: values.discountCustom,
                    customDisList: values.customDisList,
                }
            }
            if (this.props.state.discountCustomSwitch) {
                modalValue = {
                    ...modalValue,
                    discountEnd: values.discountEnd,
                    discountStart: values.discountStart,
                }
            }
        } else if (modalName === 'reduce') {
            modalValue = {
                reduceCurrency: values.reduceCurrency,
                reduceMinAmount: values.reduceMinAmount,
            }
        } else if (modalName === 'scope') {
            modalValue = {
                scopeStart: values.scopeStart,
                scopeEnd: values.scopeEnd,
            }
        }
        this.props.handlers.handlerModalSet(modalName, modalValue);
        this.props.form.resetFields(['customDisList']);
    }

    getPopoverContent = (modalName) => {
        const { language } = this.props.state
        if (modalName.indexOf('discount') > -1) {
            let content = '';
            let content1 = '';
            let discount = modalName === 'uncondiscount' ? this.props.state.unconDiscount : (modalName === 'fulldiscount' ?
                this.props.state.fullDiscount : (modalName === 'ladderdiscount') ? this.props.state.ladderDiscount : {});
            if (this.props.state.discountCustomShowSwitch) {
                content += language["salespromotion.optional_offer_percentage_value"] + '：';
                let customDisList = discount.customDisList;
                for (let i = 0; i < customDisList.length; i++) {
                    content += customDisList[i] + "%" + ","
                }
                content = content.substr(0, content.length - 1);
            }
            if (!this.props.state.discountCustomShowSwitch || (discount.discountCustom !== undefined && discount.discountCustom)) {
                content1 += language["salespromotion.custom_fill_range"] + ":" + discount.discountStart + "%" + "-" + discount.discountEnd + "%";
            }
            return content === '' ? <span>{content1}</span> : (content1 === '' ? <span>{content}</span> : <span>{content}<br />{content1}</span>);
        } else if (modalName.indexOf('reduce') > -1) {
            let reduce = modalName === 'unconreduce' ? this.props.state.unconReduce
                : (modalName === 'fullreduce' ? this.props.state.fullReduce
                    : (modalName === 'eachreduce' ? this.props.state.eachReduce
                        : (modalName === 'ladderreduce' ? this.props.state.ladderReduce : '')));
            return <span>{language["ruletemplate.currency"]}：{reduce.reduceCurrency}；{language["ruletemplate.Verticalreduction"]} >= {reduce.reduceMinAmount}{language["salespromotion.yuan"]}</span>
        } else if (modalName.indexOf('scope') > -1) {
            let scope = modalName === 'fullscope' ? this.props.state.fullScope
                : (modalName === 'eachscope' ? this.props.state.eachScope
                    : (modalName === 'ladderscope' ? this.props.state.ladderScope : ''));
            let content = null
            content = language["ruletemplate.Fractionrange"] + parseInt(scope.scopeStart) + language["ruletemplate.one"] + "-" + parseInt(scope.scopeEnd) + language["ruletemplate.one"]
            // for (let i = parseInt(scope.scopeStart); i <= parseInt(scope.scopeEnd); i++) {
            //     content += i.toString() + ",";
            // }
            // content = content.substr(0, content.length - 1);
            return <span>{content}</span>;
        }
        return '';
    }

    removediscount = (idx) => {

        const { form } = this.props;
        const customDisList = form.getFieldValue('customDisList');
        if (customDisList.length > 1) {
            for (let i = customDisList.length - 1; i >= idx; i--) {
                form.resetFields('custom_' + i, []);
            }

            form.setFieldsValue({
                customDisList: customDisList.filter((item, index) => index !== idx),
            });
        }
    };

    adddiscount = () => {
        const { form } = this.props;
        const customDisList = form.getFieldValue('customDisList');
        if (customDisList.length < 10) {
            const nextCustomDisList = customDisList.concat(null);
            form.setFieldsValue({
                customDisList: nextCustomDisList,
            });
        }
        console.log(customDisList)
    };

    removefrontend = (idx) => {
        const { form } = this.props;
        const frontendLocalList = form.getFieldValue('frontendLocalList');
        for (let i = frontendLocalList.length - 1; i >= idx; i--) {
            form.resetFields(['frontendTile_' + i, 'frontendLink_' + i]);
        }

        form.setFieldsValue({
            frontendLocalList: frontendLocalList.filter((item, index) => index !== idx),
        });
    };

    addfrontend = () => {
        const { form } = this.props;
        const frontendLocalList = form.getFieldValue('frontendLocalList');
        if (frontendLocalList.length < 10) {
            const nextFrontendLocalList = frontendLocalList.concat({});
            form.setFieldsValue({
                frontendLocalList: nextFrontendLocalList,
            });
        }
    };

    customswitchChange = (e) => {
        this.props.handlers.handlerChangeShowSwitch('discountCustom', e.target.value);
    }

    closeModal = (modalName) => {
        if (modalName === 'discount') {
            this.props.form.resetFields(['customDisList']);
            this.props.handlers.handlerCloseModal(modalName);
        }
    }

    getFiledShow = (channel, businessLine) => {
        let values = this.props.form.getFieldsValue();
        let channelValue = values.channel;
        let businessLineValue = values.businessLine;
        if (channel === channelValue && businessLine === businessLineValue) {
            return 'block';
        } else {
            return 'none';
        }
    }
    YesOrNoDefalultValueSet = () => {
        const { discount } = this.props.state;
        if (discount.customDisList === undefined) {
            return true
        } else {
            if (discount.customDisList && discount.discountStart && discount.discountEnd) {
                return true
            } else {
                return false
            }
        }
    }
    validateOfDisplay=async(rule, value, callback) => {
        const { language } = this.props.state
        this.refeshKeys('frontendLocalList');
        console.log(value)
        if (value === -1) {
            callback(language["salespromotion.required"] + '！');
            return;
        }
        callback();
        return;
    }

    render() {
        const ReactQuill = require("react-quill")
        const {
            getFieldDecorator, getFieldValue,
        } = this.props.form;
        const { language, promotionTemplate, promotionControlList, promotionControl, controlValueScope, discount, reduce, reduceType, scope, scopeType,
            productCategoy, templateValue, siteLan, listResult ,config} = this.props.state;
        // const {commonSourceList} = listResult
    
        const { handlerShowModal, handlerCloseModal, handlerChangeShowSwitch } = this.props.handlers;
        const RangePicker = DatePicker.RangePicker;
        const discustom = [{ "label": language["common.map.yes"], "value": true }, { "label": language["ruletemplate.no"], "value": false }]
        const currency = [{ "label": language["salespromotion.rmb"], "value": 'CNY' }]
        const marketCon = [{ "label": language["ruletemplate.Productcategory"], "value": 'resourceCategory' }, { "label": language["salespromotion.departure_station"], "value": 'departureCity' }, { "label": language["salespromotion.destination"], "value": 'districtCity' },
        { "label": language["salespromotion.product_area"], "value": 'region' }, { "label": language["salespromotion.sales_channel"], "value": 'salesChannel' }, { "label": language["salespromotion.review_points"], "value": 'reviewScore' }, { "label": language["salespromotion.resource_status"], "value": 'resourceStatus' }]
        const participant = [{ "label": language["ruletemplate.Supplieroperations"], "value": 'salesVendor' }, { "label": language["ruletemplate.ctripoperations"], "value": 'salesBusiness' }];
        const channel = [{ "label": language["ruletemplate.Solicitation"], "value": 2 }, { "label": language["ruletemplate.tool"], "value": 1 }];
        const useDate = [{ "label": language["typedetails.Notlimited"], "value": 'n' }];
        const promotionType = [{ "label": language["salespromotion.destination"], "value": 'd' }, { "label": language["ruletemplate.Verticalreduction"], "value": 'r' }];
        const stock = [{ "label": language["ruletemplate.Unlimited"], "value": 'n' }, { "label": language["ruletemplate.Discounttimes"], "value": 't' }];
        const limitwarning = <span>1、{language["salespromotion.sentence_of_one"]}<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    {language["salespromotion.sentence_of_tow"]};<br />2、{language["salespromotion.sentence_of_three"]}</span>;
        const unconstockwarning = <span>{language["salespromotion.sentence_of_four"]}<br />{language["salespromotion.sentence_of_fives"]};<br />{language["salespromotion.sentence_of_six"]}<br />{language["salespromotion.sentence_of_seven"]}</span>;
        const qtystockwarning = <span>{language["salespromotion.Promotionalinventorytips2"]}</span>;
        const ruleFiledShow = this.getFiledShow(2, 1);
        const productRuleShow = this.getFiledShow(1, 1);
        { getFieldDecorator('customDisList', { initialValue: discount.customDisList ? discount.customDisList : [null] }) }
        const customDisList = getFieldValue('customDisList') ? getFieldValue('customDisList') : [];
        const customFormItems = customDisList.map((k, index) => (
            <Row className="promotiontemplate-discount" gutter={8} key={'custom' + index}>
                <Col span={18} offset={5} style={{ marginTop: index === 0 ? -55 : 0 }}>
                    <Form.Item required={false}>
                        {getFieldDecorator('custom_' + index, {
                            initialValue: k,
                            rules: [{ validator: this.validateCustom }],
                        })(<Input style={{ width: 100 }} />)}
                        &nbsp;&nbsp;%&nbsp;&nbsp;
                        {customDisList.length === 1 ? '' : <Button onClick={() => this.removediscount(index)}>{language["salespromotion.delete"]}</Button>}
                    </Form.Item>
                </Col>
            </Row>
        ));

        { getFieldDecorator('frontendLocalList', { initialValue: templateValue.frontendLocal ? templateValue.frontendLocal : [{}] }) }
        const frontendLocalList = getFieldValue('frontendLocalList') ? getFieldValue('frontendLocalList') : [];
        const frontendLocalItems = frontendLocalList.map((k, index) => (
            <Row gutter={8} id="promotiontemplate-delete-btn" key={'frontend' + index}>
                <Col span={3} style={{ width: "22%" }} >

                    <Form.Item required={false}  >
                        {/* {getFieldDecorator('frontendTitle_' + index, {
                            initialValue: k.imgTitle,
                            rules: [{ validator: this.validateFrontend }],
                        })(<Input placeholder={language["ruletemplate.suchasTNTlist"]} />)} */}
                        {getFieldDecorator('frontendTitle_' + index, {
                            initialValue: k.imgTitle?k.imgTitle:-1,
                            rules: [{ required: true, message: language["salespromotion.required"] + '!' }, { validator: this.validateOfDisplay }],
                        })(<Select style={{ width: 200 }} dropdownStyle={{ textAlign: "center" }}   >
                            <Select.Option key={-1} value={-1}>{language["common.option.pleaseselect"]}</Select.Option>
                            {listResult ? listResult.map((item, index) => <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>) : ''}
                        </Select>)}

                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item required={false} >
                        {getFieldDecorator('frontendLink_' + index, {
                            initialValue: k.imgLink,
                            rules: [{ validator: this.validateFrontend }],
                        })(<Input placeholder={language["salespromotion.fill_image_link"]} style={{ width: 554 }} />)}
                        <Button id="promotion-usually-btn" onClick={() => this.removefrontend(index)}>{language["salespromotion.delete"]}</Button>
                    </Form.Item>
                </Col>
            </Row>
        ));

        return (
            <BasicLayout
                siteName={language["salespromotion.marketing_tool_management"]}
                title={language["ruletemplate.tool"]}
                permissionCode="ttd_salespromotion_template_detail"
            >
                <div className="promotion-template-detail" >
                    <Card style={{ width: 1400 }} title={language["ruletemplate.Ruledetails"]}>
                        <Form id="promotion-template-form" >
                            <Row gutter={8}>
                                <Col span={24} style={{ marginTop: 10 }}>
                                    <Form.Item label={(<b>{language['promotion.list.Promotionrulename']}</b>)} {...formItemInputLayout}>
                                        {getFieldDecorator('name', {
                                            initialValue: promotionTemplate.name,
                                            rules: [{ required: true, message: language["salespromotion.required_field"] }, { max: 20, message: language["salespromotion.exceed_20_characters"] + "!" }],
                                        })(
                                            <Input style={{ width: 320 }} placeholder={language['ruletemplate.Rulenametips']} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <Form.Item label={(<b>{language['ruletemplate.Rulelabel']}</b>)} {...formItemInputLayout}>
                                        {getFieldDecorator('tag', {
                                            initialValue: promotionTemplate.tag,
                                            rules: [{ max: 5, message: language["salespromotion.exceed_5_characters"] + "!" }],
                                        })(
                                            <Input style={{ width: 320 }} placeholder={language['ruletemplate.Rulelabeltips']} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <Form.Item label={<b>{language['rule.Marketingtype']}</b>} {...formItemInputLayout}>
                                        {getFieldDecorator('channel', {
                                            initialValue: promotionTemplate.channel ? promotionTemplate.channel : 0,
                                            rules: [{ required: true, message: language["salespromotion.required"] + '!' }, { validator: this.validateSelect }],
                                        })(
                                            <Select style={{ width: 320 }} dropdownStyle={{ textAlign: "center" }} disabled={!promotionTemplate.canEdit} onChange={this.changeChannel}>
                                                <Select.Option key={0} value={0}>{language["common.option.pleaseselect"]}</Select.Option>
                                                <Select.Option key={1} value={1}>{language["ruletemplate.tool"]}</Select.Option>
                                                <Select.Option key={2} value={2}>{language["ruletemplate.Solicitation"]}</Select.Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <Form.Item label={<b>{language['promotion.search.Businesstype']}</b>} {...formItemInputLayout}>
                                        {getFieldDecorator('businessLine', {
                                            initialValue: promotionTemplate.businessLine ? promotionTemplate.businessLine : 0,
                                            rules: [{ required: true, message: language["salespromotion.required"] + '!' }, { validator: this.validateSelect }],
                                        })(
                                            <Select style={{ width: 320 }} dropdownStyle={{ textAlign: "center" }} disabled={!promotionTemplate.canEdit}>
                                                <Select.Option key={0} value={0}>{language["common.option.pleaseselect"]}</Select.Option>
                                                <Select.Option key={1} value={1}>{language["salespromotion.tour"]}</Select.Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <Form.Item label={<b>{language['ruletemplate.Promotiontype']}</b>} {...formItemInputLayout}>
                                        {getFieldDecorator('controlId', {
                                            initialValue: promotionTemplate.promotionControl ? promotionTemplate.promotionControl.controlId : 0,
                                            rules: [{ required: true, message: language["salespromotion.required"] + '!' }, { validator: this.validateSelect }],
                                        })(
                                            <Select style={{ width: 320 }} dropdownStyle={{ textAlign: "center" }} disabled={!promotionTemplate.canEdit} onChange={this.changeControlId}>
                                                <Select.Option key={0} value={0}>{language["common.option.pleaseselect"]}</Select.Option>
                                                {promotionControlList ? promotionControlList.map((item, index) => <Select.Option key={item.controlId} value={item.controlId}>{item.name}</Select.Option>) : ''}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row style={{ display: promotionControl && promotionControl.controlId ? 'block' : 'none' }}>
                                <Row gutter={8}>
                                    <Col span={24}>
                                        <Form.Item label={<b>{language['ruletemplate.locale']}</b>} {...formItemLayout}>
                                            {getFieldDecorator('siteLan', {
                                                initialValue: promotionControl.siteLan,
                                                rules: [],
                                            })(
                                                <Checkbox.Group options={siteLan} disabled={true} />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col span={24}>
                                        <Form.Item label={<b>{language['ruletemplate.usetime']}</b>} {...formItemLayout}>
                                            {getFieldDecorator('useDate', {
                                                initialValue: promotionControl.ud && promotionControl.ud.indexOf('n') > -1 ? ['n'] : [],
                                                rules: [],
                                            })(
                                                <Checkbox.Group options={useDate} disabled={true} />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={8} id="promotion-template-active-limit" >
                                    <Col span={24}>
                                        <Form.Item label={<b>
                                            <Popover placement="left" content={limitwarning}>

                                                <Icon type="question-circle" id="question-circle-blue" />
                                            </Popover>&nbsp;
                                        {language['ruletemplate.Activityrestriction']}
                                        </b>} {...formItemLayout}>
                                            {getFieldDecorator('prolimit', {
                                                initialValue: promotionControl.prolimit,
                                                rules: [],
                                            })(
                                                <Checkbox.Group disabled={true}>
                                                    <Col style={{ marginTop: 10, display: promotionControl.isnopro ? 'block' : 'none' }}>
                                                        <Checkbox value="nopro">{language["typedetails.Nodiscount"]}</Checkbox>
                                                    </Col>
                                                    <Col style={{ marginTop: 10, display: promotionControl.isuncon ? 'block' : 'none' }}>
                                                        <Checkbox value="uncon">{language["ruletemplate.Nothreshold"]}</Checkbox>
                                                        <Row gutter={8} style={{ backgroundColor: '#F9F9F9', marginTop: 10, width: 840, display: promotionControl.isuncon ? 'block' : 'none' }}>
                                                            <Row gutter={8}>
                                                                <Col span={8} style={{ marginTop: 10 }}>

                                                                    <Form.Item label={language["ruletemplate.Preferentialway"]} {...proformItemLayout}>

                                                                        {getFieldDecorator('unconpro', {
                                                                            initialValue: promotionControl.uncon,
                                                                            rules: [{ required: true }],
                                                                        })(
                                                                            <Checkbox.Group disabled={true}>
                                                                                <Col style={{ display: promotionControl.uncon && promotionControl.uncon.indexOf('d') > -1 ? 'block' : 'none' }}>
                                                                                    <Form.Item>
                                                                                        <Checkbox value="d">{language["salespromotion.Discountpercentage"]}</Checkbox>
                                                                                        {getFieldDecorator('uncondiscountvalidate', {
                                                                                            rules: [{ validator: this.validateModalSet }],
                                                                                        })(
                                                                                            this.props.state.unconDiscountSet ?

                                                                                                (<div style={{ display: "inline-block" }}>
                                                                                                    <a className="info-circle-countede" onClick={() => handlerShowModal('uncondiscount')}>{language["salespromotion.offer_percentage_set"]}</a>
                                                                                                    <Popover placement="right" content={this.getPopoverContent('uncondiscount')}>
                                                                                                        <Icon type="info-circle" id="info-circle-countede-icon" />
                                                                                                    </Popover>
                                                                                                </div>

                                                                                                )
                                                                                                :
                                                                                                (<a onClick={() => handlerShowModal('uncondiscount')}>{language["salespromotion.set_offer_percentage_range"]}</a>)
                                                                                        )}


                                                                                    </Form.Item>
                                                                                </Col>
                                                                                <Col style={{ display: promotionControl.uncon && promotionControl.uncon.indexOf('r') > -1 ? 'block' : 'none' }}>
                                                                                    <Form.Item><Checkbox value="r">{language["ruletemplate.Verticalreduction"]}</Checkbox>
                                                                                        {getFieldDecorator('unconreducevalidate', {
                                                                                            rules: [{ validator: this.validateModalSet }],
                                                                                        })(
                                                                                            this.props.state.unconReduceSet ?
                                                                                                (<Popover placement="right" content={this.getPopoverContent('unconreduce')}>
                                                                                                    <a onClick={() => handlerShowModal('unconreduce')}>{language["salespromotion.decreased_rangeof_set"]}</a><Icon type="info-circle" />
                                                                                                </Popover>)
                                                                                                :
                                                                                                (<a onClick={() => handlerShowModal('unconreduce')}>{language["ruletemplate.Verticalreductiontips"]}</a>)
                                                                                        )}
                                                                                    </Form.Item>
                                                                                </Col>
                                                                            </Checkbox.Group>
                                                                        )}
                                                                    </Form.Item>
                                                                </Col>
                                                            </Row>
                                                            <Row gutter={8} style={{ display: promotionControl.isunconstock ? 'block' : 'none' }}>
                                                                <Col span={8} className="promotiontemplate-inventory">
                                                                    <Form.Item label={<span>
                                                                        <span className="promition-must-full" >*</span>
                                                                        <Popover placement="left" content={unconstockwarning}>
                                                                            <Icon type="question-circle" id="question-circle-blue" />
                                                                        </Popover>&nbsp;
                                                                    {language['ruletemplate.Promotionalinventory']}
                                                                    </span>} {...proformItemLayout}>
                                                                        {getFieldDecorator('unconstock', {
                                                                            initialValue: promotionControl.unconstock,
                                                                            rules: [{ required: true }],
                                                                        })(
                                                                            <Checkbox.Group className="promotiontemplate-not-limit" options={stock} disabled={true} />
                                                                        )}
                                                                    </Form.Item>
                                                                </Col>
                                                            </Row>
                                                        </Row>
                                                    </Col>
                                                    <Col style={{ marginTop: 10, display: promotionControl.isqty ? 'block' : 'none' }}>
                                                        <Checkbox value="qty">{language["ruletemplate.Eachdiscount"]}</Checkbox>
                                                        <Row gutter={8} style={{ backgroundColor: '#F9F9F9', marginTop: 10, width: 840, display: promotionControl.isqty ? 'block' : 'none' }}>
                                                            <Row gutter={8}>
                                                                <Col span={8} style={{ marginTop: 10 }}>
                                                                    <Form.Item label={language["ruletemplate.Preferentialterms"]}{...proformItemLayout}>
                                                                        {getFieldDecorator('qtypro', {
                                                                            initialValue: promotionControl.byqty,
                                                                            rules: [{ required: true }],
                                                                        })(
                                                                            <Checkbox.Group disabled={true}>
                                                                                <Col style={{ marginTop: 10, display: promotionControl.isfull ? 'block' : 'none' }}>
                                                                                    <Checkbox value="full">{language["ruletemplate.Fullnoffers"]}</Checkbox>
                                                                                    <Row id="promotiontemplate-discount" gutter={8} style={{ backgroundColor: '#FDFDFD', marginLeft: 0, marginRight: 0, marginTop: 10, display: promotionControl.isfull ? 'block' : 'none' }}>
                                                                                        <Col span={16} style={{ marginTop: 10 }}>
                                                                                            <Form.Item label={language["ruletemplate.Concessionnumber"]} {...proformItemLayout}>
                                                                                                {getFieldDecorator('fullscopevalidate', {
                                                                                                    rules: [{ validator: this.validateModalSet }],
                                                                                                })(
                                                                                                    this.props.state.fullScopeSet ?
                                                                                                        (
                                                                                                            <div style={{ display: "inline-block" }}>
                                                                                                                <a onClick={() => handlerShowModal('fullscope')}>{language["salespromotion.copies_range_set"]}</a>
                                                                                                                <Popover placement="right" content={this.getPopoverContent('fullscope')}>
                                                                                                                    <Icon type="info-circle" id="info-circle-countede-icon" />
                                                                                                                </Popover>
                                                                                                            </div>)
                                                                                                        :
                                                                                                        (<a onClick={() => handlerShowModal('fullscope')}>{language["ruletemplate.Setnumberofoffers"]}</a>)
                                                                                                )}



                                                                                            </Form.Item>
                                                                                        </Col>
                                                                                        <Col span={16} className="promotiontemplate-percentage-range" >
                                                                                            <Form.Item label={language["ruletemplate.Preferentialway"]} {...proformItemLayout}>
                                                                                                {getFieldDecorator('fullpro', {
                                                                                                    initialValue: promotionControl.full,
                                                                                                    rules: [{ required: true, message: language["salespromotion.required"] + '!' }, { validator: this.validateModalSet }],
                                                                                                })(
                                                                                                    <Checkbox.Group disabled={true}>
                                                                                                        <Col style={{ display: promotionControl.full && promotionControl.full.indexOf('d') > -1 ? 'block' : 'none' }}>
                                                                                                            <Form.Item>
                                                                                                                <Checkbox value="d">{language["salespromotion.Discountpercentage"]}</Checkbox>
                                                                                                                {getFieldDecorator('fulldiscountvalidate', {
                                                                                                                    rules: [{ validator: this.validateModalSet }],
                                                                                                                })(
                                                                                                                    this.props.state.fullDiscountSet ?
                                                                                                                        (<div style={{ display: "inline-block" }}>
                                                                                                                            <a onClick={() => handlerShowModal('fulldiscount')}>{language["salespromotion.offer_percentage_set"]}</a>
                                                                                                                            <Popover placement="right" content={this.getPopoverContent('fulldiscount')}>
                                                                                                                                <Icon type="info-circle" id="info-circle-countede-icon" />
                                                                                                                            </Popover>
                                                                                                                        </div>)
                                                                                                                        :
                                                                                                                        (<a onClick={() => handlerShowModal('fulldiscount')}>{language["salespromotion.set_offer_percentage_range"]}</a>)
                                                                                                                )}




                                                                                                            </Form.Item>
                                                                                                        </Col>
                                                                                                        <Col style={{ display: promotionControl.full && promotionControl.full.indexOf('r') > -1 ? 'block' : 'none' }}>
                                                                                                            <Form.Item> <Checkbox value="r">{language["ruletemplate.Verticalreduction"]}</Checkbox>
                                                                                                                {getFieldDecorator('fullreducevalidate', {
                                                                                                                    rules: [{ validator: this.validateModalSet }],
                                                                                                                })(
                                                                                                                    this.props.state.fullReduceSet ?
                                                                                                                        (<Popover placement="right" content={this.getPopoverContent('fullreduce')}>
                                                                                                                            <a onClick={() => handlerShowModal('fullreduce')}>{language["salespromotion.decreased_rangeof_set"]}</a><Icon type="info-circle" />
                                                                                                                        </Popover>)
                                                                                                                        :
                                                                                                                        (<a onClick={() => handlerShowModal('fullreduce')}>{language["ruletemplate.Verticalreductiontips"]}</a>)
                                                                                                                )}
                                                                                                            </Form.Item>
                                                                                                        </Col>
                                                                                                    </Checkbox.Group>
                                                                                                )}
                                                                                            </Form.Item>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col style={{ marginTop: 10, display: promotionControl.iseach ? 'block' : 'none' }}>
                                                                                    <Checkbox value="each">{language["typedetails.Preferentialterms2"]}</Checkbox>
                                                                                    <Row gutter={8} id="promotiontemplate-discount" style={{ backgroundColor: '#FDFDFD', marginLeft: 0, marginRight: 0, marginTop: 10, display: promotionControl.iseach ? 'block' : 'none' }}>
                                                                                        <Col span={16} style={{ marginTop: 10 }}>
                                                                                            <Form.Item label={language["ruletemplate.Concessionnumber"]} {...proformItemLayout}>
                                                                                                {getFieldDecorator('eachscopevalidate', {
                                                                                                    rules: [{ validator: this.validateModalSet }],
                                                                                                })(
                                                                                                    this.props.state.eachScopeSet ?
                                                                                                        (
                                                                                                            <div style={{ display: "inline-block" }}>
                                                                                                                <a onClick={() => handlerShowModal('eachscope')}>{language["salespromotion.copies_range_set"]}</a>
                                                                                                                <Popover placement="right" content={this.getPopoverContent('eachscope')}>
                                                                                                                    <Icon type="info-circle" id="info-circle-countede-icon" />
                                                                                                                </Popover>
                                                                                                            </div>)
                                                                                                        :
                                                                                                        (<a onClick={() => handlerShowModal('eachscope')}>{language["ruletemplate.Setnumberofoffers"]}</a>)
                                                                                                )}



                                                                                            </Form.Item>
                                                                                        </Col>
                                                                                        <Col span={16} >
                                                                                            <Form.Item label={language["ruletemplate.Preferentialway"]} {...proformItemLayout}>
                                                                                                {getFieldDecorator('eachpro', {
                                                                                                    initialValue: promotionControl.each,
                                                                                                    rules: [{ required: true, message: language["salespromotion.required"] + '!' }, { validator: this.validateModalSet }],
                                                                                                })(
                                                                                                    <Checkbox.Group disabled={true}>
                                                                                                        <Form.Item>
                                                                                                            <Checkbox value="r">{language["ruletemplate.Verticalreduction"]}</Checkbox>
                                                                                                            {getFieldDecorator('eachreducevalidate', {
                                                                                                                rules: [{ validator: this.validateModalSet }],
                                                                                                            })(
                                                                                                                this.props.state.eachReduceSet ?
                                                                                                                    (<Popover placement="right" content={this.getPopoverContent('eachreduce')}>
                                                                                                                        <a onClick={() => handlerShowModal('eachreduce')}>{language["salespromotion.decreased_rangeof_set"]}</a><Icon type="info-circle" />
                                                                                                                    </Popover>)
                                                                                                                    :
                                                                                                                    (<a onClick={() => handlerShowModal('eachreduce')}>{language["ruletemplate.Verticalreductiontips"]}</a>)
                                                                                                            )}
                                                                                                        </Form.Item>
                                                                                                    </Checkbox.Group>
                                                                                                )}
                                                                                            </Form.Item>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col style={{ marginTop: 10, display: promotionControl.isladder ? 'block' : 'none' }}>
                                                                                    <Checkbox value="ladder">{language["typedetails.Preferentialterms3"]}</Checkbox>
                                                                                    <Row gutter={8} id="promotiontemplate-discount" style={{ backgroundColor: '#FDFDFD', marginLeft: 0, marginRight: 0, marginTop: 10, display: promotionControl.isladder ? 'block' : 'none' }}>
                                                                                        <Col span={16} style={{ marginTop: 10 }}>
                                                                                            <Form.Item label={language["ruletemplate.Concessionnumber"]} {...proformItemLayout}>
                                                                                                {getFieldDecorator('ladderscopevalidate', {
                                                                                                    rules: [{ validator: this.validateModalSet }],
                                                                                                })(
                                                                                                    this.props.state.ladderScopeSet ?
                                                                                                        (<div style={{ display: "inline-block" }}>
                                                                                                            <a onClick={() => handlerShowModal('ladderscope')}>{language["salespromotion.copies_range_set"]}</a>
                                                                                                            <Popover placement="right" content={this.getPopoverContent('ladderscope')}>
                                                                                                                <Icon type="info-circle" id="info-circle-countede-icon" />
                                                                                                            </Popover>
                                                                                                        </div>)
                                                                                                        :
                                                                                                        (<a onClick={() => handlerShowModal('ladderscope')}>{language["ruletemplate.Setnumberofoffers"]}</a>)
                                                                                                )}



                                                                                            </Form.Item>
                                                                                        </Col>
                                                                                        <Col span={16} className="promotiontemplate-percentage-range" >
                                                                                            <Form.Item label={language["ruletemplate.Preferentialway"]} {...proformItemLayout}>
                                                                                                {getFieldDecorator('ladderpro', {
                                                                                                    initialValue: promotionControl.ladder,
                                                                                                    rules: [{ required: true, message: language["salespromotion.required"] + '!' }, { validator: this.validateModalSet }],
                                                                                                })(
                                                                                                    <Checkbox.Group disabled={true}>
                                                                                                        <Col style={{ display: promotionControl.ladder && promotionControl.ladder.indexOf('d') > -1 ? 'block' : 'none' }}>
                                                                                                            <Form.Item>
                                                                                                                <Checkbox value="d">{language["salespromotion.Discountpercentage"]}</Checkbox>
                                                                                                                {getFieldDecorator('ladderdiscountvalidate', {
                                                                                                                    rules: [{ validator: this.validateModalSet }],
                                                                                                                })(
                                                                                                                    this.props.state.ladderDiscountSet ?
                                                                                                                        (<div style={{ display: "inline-block" }}>
                                                                                                                            <a onClick={() => handlerShowModal('ladderdiscount')}>{language["salespromotion.offer_percentage_set"]}</a>
                                                                                                                            <Popover placement="right" content={this.getPopoverContent('ladderdiscount')}>
                                                                                                                                <Icon type="info-circle" id="info-circle-countede-icon" />
                                                                                                                            </Popover>
                                                                                                                        </div>)
                                                                                                                        :
                                                                                                                        (<a onClick={() => handlerShowModal('ladderdiscount')}>{language["salespromotion.set_offer_percentage_range"]}</a>)
                                                                                                                )}
                                                                                                            </Form.Item>
                                                                                                        </Col>
                                                                                                        <Col style={{ display: promotionControl.ladder && promotionControl.ladder.indexOf('r') > -1 ? 'block' : 'none' }}>
                                                                                                            <Form.Item><Checkbox value="r">{language["ruletemplate.Verticalreduction"]}</Checkbox>
                                                                                                                {getFieldDecorator('ladderreducevalidate', {
                                                                                                                    rules: [{ validator: this.validateModalSet }],
                                                                                                                })(
                                                                                                                    this.props.state.ladderReduceSet ?
                                                                                                                        (<Popover placement="right" content={this.getPopoverContent('ladderreduce')}>
                                                                                                                            <a onClick={() => handlerShowModal('ladderreduce')}>{language["salespromotion.decreased_rangeof_set"]}</a><Icon type="info-circle" />
                                                                                                                        </Popover>)
                                                                                                                        :
                                                                                                                        (<a onClick={() => handlerShowModal('ladderreduce')}>{language["ruletemplate.Verticalreductiontips"]}</a>)
                                                                                                                )}
                                                                                                            </Form.Item>
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
                                                                <Col span={8} className="promotiontemplate-inventory" style={{ display: promotionControl.isbyQtystock ? 'block' : 'none' }}>
                                                                    <Form.Item label={<span>
                                                                        <span className="promition-must-full" >*</span>
                                                                        <Popover placement="left" content={qtystockwarning}>
                                                                            <Icon type="question-circle" id="question-circle-blue" />
                                                                        </Popover>&nbsp;
                                                                    {language['ruletemplate.Promotionalinventory']}
                                                                    </span>} {...proformItemLayout}>
                                                                        {getFieldDecorator('qtystock', {
                                                                            initialValue: promotionControl.byQtystock,
                                                                            rules: [{ required: true }],
                                                                        })(
                                                                            <Checkbox.Group className="promotiontemplate-not-limit" options={stock} disabled={true} />
                                                                        )}
                                                                    </Form.Item>
                                                                </Col>
                                                            </Row>
                                                        </Row>
                                                    </Col>
                                                </Checkbox.Group>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col span={8} id="promotion-template-claim" style={{ display: promotionControl.isstocklimit ? 'block' : 'none' }}>
                                        <Form.Item label={<b>{language['salespromotion.stocklimit']}</b>} {...formItemLayout}>
                                            {getFieldDecorator('stocklimit', {
                                                initialValue: promotionControl.stocklimit,
                                                rules: [],
                                            })(
                                                <Checkbox.Group disabled={true}>
                                                    <Col style={{ marginTop: 10, display: promotionControl.isnolimit ? 'block' : 'none' }}>
                                                        <Checkbox value="nolimit">{language["salespromotion.unlimited_stock"]}</Checkbox>
                                                    </Col>
                                                    <Col style={{ marginTop: 10, display: promotionControl.islimit ? 'block' : 'none' }}>
                                                        <Checkbox value="limit">{language["salespromotion.limited_stock"]}</Checkbox>
                                                        <Row gutter={8} style={{ backgroundColor: '#F9F9F9', marginTop: 10, alignItems: "unset", width: 840, display: promotionControl.islimit ? 'block' : 'none' }}>
                                                            <Col span={16} style={{ width: "100%" }}>
                                                                <Form.Item {...formItemLayout}>
                                                                    {getFieldDecorator('limit', {
                                                                        initialValue: promotionControl.limit,
                                                                        rules: [],
                                                                    })(
                                                                        <Checkbox.Group disabled={true}>
                                                                            <br />
                                                                            <Row gutter={8} style={{ display: promotionControl.limit && promotionControl.limit.indexOf('s') > -1 ? 'block' : 'none' }}>
                                                                                <Col style={{ width: 190 }} span={8}>
                                                                                    <Checkbox value="s">{language["typedetails.Dailyinventory"]}</Checkbox>
                                                                                </Col>
                                                                                <Col span={4}><span>{language["salespromotion.daily_stock"]} >=</span></Col>
                                                                                <Col span={8}>
                                                                                    <Form.Item>
                                                                                        {getFieldDecorator('slimit', {
                                                                                            initialValue: controlValueScope.slimit ? controlValueScope.slimit : '',
                                                                                            rules: [{ validator: this.validateLimit }],
                                                                                        })(
                                                                                            <Input />
                                                                                        )}
                                                                                    </Form.Item>
                                                                                </Col>
                                                                            </Row>
                                                                            <Row gutter={8} style={{ marginBottom: 11, display: promotionControl.limit && promotionControl.limit.indexOf('t') > -1 ? 'block' : 'none' }}>
                                                                                <Col style={{ width: 190 }} span={8}>
                                                                                    <Checkbox value="t">{language["typedetails.Totalinventory"]}</Checkbox>
                                                                                </Col>
                                                                                <Col span={4}><span>{language["salespromotion.total_inventory"]}>=</span></Col>
                                                                                <Col span={8} >
                                                                                    <Form.Item>
                                                                                        {getFieldDecorator('tlimit', {
                                                                                            initialValue: controlValueScope.tlimit ? controlValueScope.tlimit : '',
                                                                                            rules: [{ validator: this.validateLimit }],
                                                                                        })(
                                                                                            <Input />
                                                                                        )}
                                                                                    </Form.Item>
                                                                                </Col>
                                                                            </Row>
                                                                            <Col style={{ marginBottom: 24, display: promotionControl.limit && promotionControl.limit.indexOf('u') > -1 ? 'block' : 'none' }}>
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
                                <Row gutter={8} style={{ display: ruleFiledShow }}>
                                    <Col span={24}>
                                        <Form.Item label={<b>{language['salespromotion.other.field']}</b>} {...formItemLayout}>
                                            {getFieldDecorator('ruleFileds', {
                                                initialValue: templateValue.mktCollectRuleField ? templateValue.mktCollectRuleField : [],
                                                rules: [{ required: true, message: language["salespromotion.required"] + '!' }],
                                            })(
                                                <Checkbox.Group options={marketCon} style={{ width: 800 }} />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={8} style={{ display: productRuleShow }}>
                                    <Row gutter={8}>
                                        <Col span={24} >
                                            <Form.Item label={<b>{language['ruletemplate.Productcategory']}</b>} {...formItemInputLayout}>
                                                {getFieldDecorator('productCategory', {
                                                    initialValue: templateValue.productCategory ? templateValue.productCategory : [],
                                                    rules: [],
                                                })(
                                                    <Select mode={'tags'} dropdownStyle={{ textAlign: "center" }} placeholder={language["ruletemplate.Productcategorytips"]}>
                                                        {productCategoy.map(({ categoryId, categoryName }) => <Select.Option key={categoryId.toString()} value={categoryId.toString()}
                                                            disabled={templateValue.productCategory ? (templateValue.productCategory.length === 0 ? true : templateValue.productCategory.indexOf(categoryId.toString()) > -1) : false}>{categoryName}</Select.Option>)}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={8}>
                                        <Col span={24} >
                                            <Form.Item label={<b>{language['ruletemplate.Rulehighlights']}</b>} {...formItemInputLayout}>
                                                {getFieldDecorator('ruleFeature', {
                                                    initialValue: templateValue.ruleFeature ? templateValue.ruleFeature : '',
                                                    rules: [{ required: true, message: language["salespromotion.required"] + '!' }, { max: 50, message: language["salespromotion.exceed_50_characters"] + "!" }],
                                                })(
                                                    <TextArea placeholder={language["ruletemplate.Rulehighlightstips"]} autosize={{ minRows: 2, maxRows: 10 }} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={8}>
                                        <Col span={24} >
                                            <Form.Item label={<b>{language['ruletemplate.Ruledescription']}</b>} {...formItemInputLayout}>
                                                {getFieldDecorator('ruleRemark', {
                                                    initialValue: templateValue.ruleRemark ? templateValue.ruleRemark : '',
                                                    rules: [{ required: true, message: language["salespromotion.required"] + '!' }],
                                                })(
                                                    <ReactQuill style={{ height: 160 }}
                                                        placeholder={language["ruletemplate.Ruledescriptiontips1"] + '\n' +
                                                            language["ruletemplate.Ruledescriptiontips2"]} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={8}>
                                        <Col span={24} id="promotion-template-col" style={{ marginTop: 50 }}>
                                            <Form.Item style={{ marginTop: 15 }} label={<b>{language['salespromotion.Front-end_placement']}</b>} {...formItemLayout}>
                                                {frontendLocalItems}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {frontendLocalList.length === 10 ? '' :
                                        <Row gutter={8} style={{ marginBottom: 28, marginTop: 20 }}  >
                                            <Col span={2} style={{ width: "auto", marginLeft: 287, textAlign: "right" }}>
                                                <Button type="primary" id="primary-add-btn" onClick={this.addfrontend}>+{language["ruletemplate.new"]}</Button>
                                            </Col>
                                        </Row>
                                    }
                                    <Row gutter={8}>
                                        <Col span={24}>
                                            <Form.Item label={<b>{language['ruletemplate.Iconpicturelink']}</b>} {...formItemLayout}>
                                                {getFieldDecorator('iconLink', {
                                                    initialValue: templateValue.iconLink ? templateValue.iconLink : '',
                                                    rules: [{ required: true, message: language["salespromotion.required"] + '!' }],
                                                })(
                                                    <Input placeholder={language["salespromotion.fill_icon_link"]} style={{ width: 841 }} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={8}>
                                        <Col span={24}>
                                            <Form.Item label={<b>{language['ruletemplate.Numberofactiveproducts']}</b>} {...formItemLayout}>
                                                {getFieldDecorator('baseQty', {
                                                    initialValue: templateValue.baseQty ? templateValue.baseQty : '',
                                                    rules: [{ validator: this.validateBaseQty }],
                                                })(
                                                    <Input placeholder={language["ruletemplate.Numberofactiveproductstips"]} style={{ width: 841 }} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={8}>
                                        <Col span={24}>
                                            <Form.Item label={<b>{language['ruletemplate.Ruleparticipants']}</b>} {...formItemLayout}>
                                                {getFieldDecorator('participant', {
                                                    initialValue: templateValue.participant ? templateValue.participant : [],
                                                    rules: [{ required: true, message: language["salespromotion.required"] + '!' }],
                                                })(
                                                    <Checkbox.Group options={participant} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={8}>
                                        <Col span={24}>
                                            <Form.Item label={<b>{language['ruletemplate.Supplierqualityscore']}</b>} {...formItemLayout}>
                                                >=&nbsp;
                                            {getFieldDecorator('qualityScore', {
                                                    initialValue: templateValue.qualityScore,
                                                    rules: [{ validator: this.validateQualityScore }],
                                                })(
                                                    <Input style={{ width: 80 }} />
                                                )}&nbsp;{language["ruletemplate.Fraction"]}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Row>
                                <Row gutter={8}>
                                    <Col span={24} style={{ padding: 0 }} >
                                        <Form.Item label={<b>{language['rule.Rankingvalue']}</b>} {...formItemLayout}>
                                            {getFieldDecorator('sort', {
                                                initialValue: promotionTemplate.sort,
                                                rules: [{ required: true, message: ' ' }, { validator: this.validateInt }],
                                            })(
                                                <Input placeholder={language["ruletemplate.Rankingvaluetips"]} style={{ width: 550 }} />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Row>


                            <Modal width={600} className="promoriontempalte-discount-range-modal" title={language["salespromotion.please_discount_percentage_range"]} visible={this.props.state.discountModalSwitch} destroyOnClose={true}
                                onCancel={() => handlerCloseModal('discount')} onOk={() => this.modalSubmit('discount')}>
                                <div  >
                                    <span style={{ color: '#DBA652' }}>{language["salespromotion.rules_of_persentage"]}</span> <br></br>
                                    <span style={{ color: '#DBA652' }}>{language["salespromotion.not_than_discount"]}</span>
                                    <Row style={{ display: this.props.state.discountCustomShowSwitch ? 'block' : 'none' }}>
                                        <Row gutter={8}>
                                            <Col span={12}  >
                                                <Form.Item label={<b>{language['ruletemplate.Customornot']}</b>} {...innerFormItemLayout}>
                                                    {getFieldDecorator('discountCustom', {
                                                        // initialValue: discount.discountCustom ? discount.discountCustom : true,
                                                        rules: [],
                                                        initialValue: this.YesOrNoDefalultValueSet()
                                                    })(
                                                        <Radio.Group options={discustom} onChange={this.customswitchChange} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Row gutter={8}>
                                                <Col span={12}>

                                                    <Form.Item label={<b>{language["salespromotion.optional_offer_percentage_value"]}</b>} {...innerFormItemLayout}>
                                                    </Form.Item>

                                                </Col>
                                            </Row>
                                            {customFormItems}
                                            {customDisList.length === 10 ? '' :
                                                <Form.Item>
                                                    <Row gutter={8}>
                                                        <Col offset={5} span={9}>
                                                            <Button type="primary" id="primary-add-btn" onClick={this.adddiscount}>+{language["ruletemplate.new"]}</Button>
                                                        </Col>
                                                    </Row>
                                                </Form.Item>
                                            }
                                        </Row>
                                    </Row>
                                    <Row gutter={8} style={{ display: this.props.state.discountCustomSwitch ? 'block' : 'none' }}>
                                        <Col span={12} className="salespromotion-fillRange"  >
                                            <Form.Item label={<b>{language['salespromotion.custom_fill_range']}</b>} {...innerFormItemLayout}>
                                                {getFieldDecorator('discountStart', {
                                                    initialValue: discount.discountStart,
                                                    rules: [{ validator: this.validateDisStart }],
                                                })(
                                                    <Input style={{ width: 100 }} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} className="salespromotion-fillRange-percentage" ><Form.Item><span>%&nbsp;&nbsp;—</span></Form.Item></Col>
                                        <Col span={5} style={{ width: "auto" }} >
                                            <Form.Item>
                                                {getFieldDecorator('discountEnd', {
                                                    initialValue: discount.discountEnd,
                                                    rules: [{ validator: this.validateDisEnd }],
                                                })(
                                                    <Input style={{ width: 100 }} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} style={{ position: "absolute", left: 441 }} ><Form.Item><span>%</span></Form.Item></Col>
                                    </Row>
                                    {this.props.state.discountType === '' ? ''
                                        : (this.props.state.discountType === 'full' && this.props.state.fullDiscountSet ?
                                            (<Row style={{ backgroundColor: '#F2F2F2', height: 40 }}>
                                                <Col span={24}>
                                                    <span>{this.getPopoverContent('fulldiscount')}</span>
                                                </Col>
                                            </Row>)
                                            :
                                            (this.props.state.discountType === 'ladder' && this.props.state.ladderDiscountSet ?
                                                (<Row style={{ backgroundColor: '#F2F2F2', height: 40 }}>
                                                    <Col span={24}>
                                                        <span>{this.getPopoverContent('ladderdiscount')}</span>
                                                    </Col>
                                                </Row>)
                                                :
                                                (this.props.state.discountType === 'uncon' && this.props.state.unconDiscountSet ?
                                                    (<Row style={{ backgroundColor: '#F2F2F2', height: 40 }}>
                                                        <Col span={24}>
                                                            <span>{this.getPopoverContent('uncondiscount')}</span>
                                                        </Col>
                                                    </Row>)
                                                    : ''
                                                )
                                            )
                                        )
                                    }
                                </div>
                            </Modal>

                            <Modal width={600} className="promoriontempalte-Verticalreductiontips-modal" title={language["ruletemplate.Verticalreductiontips"]} visible={this.props.state.reduceModalSwitch} destroyOnClose={true}
                                onCancel={() => handlerCloseModal('reduce')} onOk={() => this.modalSubmit('reduce')}>
                                <div className="promoriontempalte-Verticalreductiontips-modal-row" >
                                    <span style={{ color: '#DBA652', display: "inline-block", marginBottom: 13 }}>*{language["ruletemplate.Customscopetips"]}</span>
                                    <Row gutter={8} >
                                        <Col span={12}  >
                                            <Form.Item label={<b>{language['ruletemplate.currency']}</b>} {...innerFormItemLayout}>
                                                {getFieldDecorator('reduceCurrency', {
                                                    initialValue: reduce.reduceCurrency === undefined ? 'CNY' : reduce.reduceCurrency,
                                                    rules: [{ required: true, message: language["salespromotion.required"] + '！' }],
                                                })(
                                                    <Select dropdownStyle={{ textAlign: "center" }} >
                                                        <Select.Option value='CNY'>{language["salespromotion.rmb"]}</Select.Option>
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Form.Item label={<b>{language['ruletemplate.Minimumamountofdeduction']}</b>} {...innerFormItemLayout}>
                                                {getFieldDecorator('reduceMinAmount', {
                                                    initialValue: reduce.reduceMinAmount === undefined ? '' : reduce.reduceMinAmount,
                                                    rules: [{ required: true, message: language["salespromotion.fill_minimum_amount"] + "!" }, { pattern: new RegExp(/^(?!(0[0-9]{0,}$))[0-9]{1,}[0-9]{0,}$/, "g"), message: language["salespromotion.please_minimum_amount"] }],
                                                })(
                                                    <Input />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {reduce.reduceCurrency === undefined || reduce.reduceMinAmount === undefined ? '' :
                                        (<Row style={{ backgroundColor: '#F2F2F2', height: 20 }}>
                                            <Col span={24}>
                                                <span>{this.getPopoverContent(reduceType + 'reduce')}</span>
                                            </Col>
                                        </Row>)
                                    }
                                </div>
                            </Modal>

                            <Modal className="promoriontempalte-Setnumberofoffers-modal" width={600} title={language["ruletemplate.Setnumberofoffers"]} visible={this.props.state.scopeModalSwitch} destroyOnClose={true}
                                onCancel={() => handlerCloseModal('scope')} onOk={() => this.modalSubmit('scope')}>
                                <div  >
                                    <span style={{ color: '#DBA652', display: "inline-block", marginBottom: 13 }}>*{language["ruletemplate.Numberofcopiestips"]}</span>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Form.Item label={<b>{language['salespromotion.number_of_copies']}</b>} {...innerFormItemLayout}>
                                                {getFieldDecorator('scopeStart', {
                                                    initialValue: scope.scopeStart,
                                                    rules: [{ validator: this.validateScopeStart }],
                                                })(
                                                    <Input style={{ width: 100 }} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} ><Form.Item><span>{language["ruletemplate.one"]}&nbsp;&nbsp;—</span></Form.Item></Col>
                                        <Col span={5}>
                                            <Form.Item>
                                                {getFieldDecorator('scopeEnd', {
                                                    initialValue: scope.scopeEnd,
                                                    rules: [{ validator: this.validateScopeEnd }],
                                                })(
                                                    <Input style={{ width: 100 }} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}><Form.Item><span>{language["ruletemplate.one"]}</span></Form.Item></Col>
                                    </Row>
                                    {scope.scopeStart === undefined || scope.scopeEnd === undefined ? '' :
                                        (<Row style={{ backgroundColor: '#F2F2F2' }}>
                                            <Col span={24}>
                                                <span>{this.getPopoverContent(scopeType + 'scope')}</span>
                                            </Col>
                                        </Row>)
                                    }
                                </div>
                            </Modal>
                        </Form>
                    </Card>
                    <Card style={{ width: 1400, border: "none" }}>
                        <Row gutter={8} id="promotion-template-save-btn" >
                            <Col span={2} offset={17}>
                                <Link to={`/salespromotion/promotionTemplate`}><Button style={{ minWidth: 90 }} size="large">{language["salespromotion.cancel"]}</Button></Link>
                            </Col>
                            <Col span={2}>
                                <Button type="primary" size="large" style={{ minWidth: 90 }} onClick={this.saveSubmit}>{language["salespromotion.save"]}</Button>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </BasicLayout>
        );
    }
}

export default BasicPage;