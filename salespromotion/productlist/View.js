/* jshint esversion:6 */
import React from "react";
import { Style } from 'react-imvc/component';
import { Spin, Modal } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import SearchForm from './components/SearchForm';
import ProductList from './components/ProductList';
import Oprate from './components/Oprate'; 
import Layout from '../../../component/BasicLayout'
import MenuGroup from './components/MenuGroup'


export default function View({ state, handlers }) {
    const { spinning, location: { params: { type } }, modalShow, language } = state;
    const bList = [
        {name:language["salespromotion.marketing_tool_management"]},
        {name:language["salespromotion.promotion_management"],href:'/salespromotion/productlist'},
    ]
    console.log('state', state)
    return (
        <Layout siteName={language["salespromotion.marketing_tool_management"]} breadcrumbList={bList}  permissionCode="ttd_salespromotion_product_list">
            <Style name="main" />
            <Style name="promotion" />
            <div className="active-management" >
                <MenuGroup></MenuGroup>

                <div className="relate-wrapper">
                    <Spin delay={200} spinning={spinning} size='large'>
                        <SearchForm></SearchForm>
                        {type == 1 && <Oprate></Oprate>}
                        <ProductList></ProductList>
                    </Spin>
                </div>
            </div>
        </Layout>
    );
}

