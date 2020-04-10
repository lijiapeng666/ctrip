/* jshint esversion:6 */
import React from "react";
import { Style } from 'react-imvc/component';
import { Spin, Menu,Button,Modal,Radio } from 'antd';
import 'moment/locale/zh-cn';
import Layout from '../../components/Layout'
import Header from './component/Header'
import IncomeDetails from './component/IncomeDetails'
// import IncomeDetailsSelectHeader from './component/IncomeDetails.selectHeader'

export default function View ( { state, handlers } ) {
    // const { logModalShow,status,language={} } = state;
    // const {handleToggleLogModal,handleStatusChange} = handlers
    return (
        <Layout>
            <Style name="main" />
            <div className="wallte" >
            <Header/>
            <IncomeDetails/>
            </div>
        </Layout>);
}