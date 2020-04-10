/* jshint esversion:6 */
import React from "react";
import { Link, Style } from 'react-imvc/component';
import { Spin, Menu, Card, Button, Modal, Radio, Row } from 'antd';
import 'moment/locale/zh-cn';
import Layout from '../../../component/BasicLayout'
import ControlList from './component/PromotionControlList';
import SearchForm from './component/SearchForm'
import OpLog from './component/OpLog'


export default function View({ state, handlers }) {
    const { logModalShow, status, language = {} } = state;
    const { handleToggleLogModal, handleStatusChange } = handlers
    const bList = [
        {name:language["salespromotion.marketing_tool_management"]},
        {name:language["type.Typemanagement"],href:'/salespromotion/promotioncontrol'},
    ]
    // console.log('语言包', state.language)
    return (
        <Layout siteName={language["salespromotion.marketing_tool_management"]}  breadcrumbList={bList}  permissionCode="ttd_salespromotion_control_list">
            

            <Style name="main" />
            <Style name="promotion" />

            <div className="promotion-view" >
               

                <SearchForm></SearchForm>
                <Link to={`/salespromotion/promotioncontroldetail/add`}>
                    <Button id="add-type-of-promotion" type="primary">{language['type.Newtype'] }</Button>
                </Link>
                <ControlList></ControlList>
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

