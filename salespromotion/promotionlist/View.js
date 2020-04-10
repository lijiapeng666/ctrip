/* jshint esversion:6 */
import React from "react";
import { Style } from 'react-imvc/component';
import { Spin, Menu,Button,Modal,Radio } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

const Item = Menu.Item;
const ButtonGroup = Button.Group
import { formatASPDate } from '../../../../lib/util';
import Layout from '../../../component/BasicLayout'
import PromotionList from './components/PromotionList';
import SearchForm from './components/SearchForm'
import MenuGroup from './components/MenuGroup'
import OpLog from './components/OpLog'

export default function View ( { state, handlers } ) { 
    const { logModalShow,status,language={} } = state;
    const {handleToggleLogModal,handleStatusChange} = handlers
    const bList = [
        { name: language["salespromotion.marketing_tool_management"] },
        { name: language["salespromotion.promotion_management"], href: '/salespromotion/promotionlist' },
    ]

    // console.log('语言包',state.language)
    return (
        <Layout siteName={language["salespromotion.marketing_tool_management"]} breadcrumbList={bList}  permissionCode="ttd_salespromotion_list">
            <Style name="main" />
            <Style name="promotion" />

            <MenuGroup></MenuGroup>

            <div className="promotion-list-wrapper">
                <Radio.Group value={status} onChange={handleStatusChange}  style={{marginTop:16,marginLeft:23}}>
                    <Radio.Button value={0}>{language['promotion.search.all']}</Radio.Button>
                    <Radio.Button value={10}>{language['promotion.search.inprogress']}</Radio.Button>
                    <Radio.Button value={1}>{language['promotion.search.Notyetbegun']}</Radio.Button>
                    <Radio.Button value={20}>{language['promotion.search.Hasended']}</Radio.Button>
                    <Radio.Button value={30}>{language['promotion.search.Terminated']}</Radio.Button>
                </Radio.Group>
                <SearchForm></SearchForm>
                <PromotionList></PromotionList>
                <Modal
                    title={language['salespromotion.detail_log']}
                    visible={logModalShow}
                    onCancel={()=>handleToggleLogModal()}
                    footer={null}
                    width={900}
                >
                    <OpLog></OpLog>
                </Modal>
            </div>
        </Layout>);
}

