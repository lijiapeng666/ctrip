/* jshint esversion:6 */
import React from "react";
import { Link, Style } from 'react-imvc/component';
import { Spin, Menu, Button, Modal, Radio, Row } from 'antd';
import 'moment/locale/zh-cn';
import Layout from '../../../component/BasicLayout'
import TemplateList from './component/PromotionTemplateList';
import SearchForm from './component/SearchForm'
import OpLog from './component/OpLog'


export default function View({ state, handlers }) {
    const { logModalShow, status, language = {} } = state;
    const { handleToggleLogModal, handleStatusChange } = handlers
    const bList = [
        { name: language["salespromotion.marketing_tool_management"] },
        { name: language["rule."], href: '/salespromotion/promotiontemplate' },
    ]
    // console.log('语言包', state.language)
    return (
        <Layout siteName={language["salespromotion.marketing_tool_management"]}   breadcrumbList={bList}  permissionCode="ttd_salespromotion_template_list">
            <Style name="main" />
            <Style name="promotion" />
            <div className="promotion-rule" >
                <SearchForm></SearchForm>
                <Link to={`/salespromotion/promotiontemplatedetail/add`}>
                    <Button id="add-rule-of-promotion" type="primary">{language['rule.Addpromotionrule']}</Button>
                </Link>
                <TemplateList></TemplateList>
                <Modal
                    title={language['salespromotion.detail_log']}
                    visible={logModalShow}
                    onCancel={() => handleToggleLogModal()}
                    footer={null}
                    width={900}
                >
                    <OpLog></OpLog>
                </Modal>
            </div>
        </Layout>);
}

