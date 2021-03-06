/* jshint esversion:6 */
import React from "react";
import { Style } from 'react-imvc/component';
import { Spin,Modal } from 'antd';
import SearchForm from './components/SearchForm';
import ProductList from './components/ProductList';
import Oprate from './components/Oprate';
import Details from './components/Details'
import MenuList from './components/MenuList';
import PromotionListModal from './components/PromotionListModal'

export default function View ( { state, handlers } ) {
    const { spinning,location:{params:{type}},modalShow,language } = state;
    const { handleToggleLogModal } = handlers;
    console.log('state',state)
    return (
        <div className="relate-wrapper">
            <Style name="antd" />
            <Style name="promotion" />
            <Details />
            <MenuList/>
            <div className="relate-wrapper">
                <Spin delay={200} spinning={spinning} size='large'>
                    <SearchForm></SearchForm>
                    {type == 1 && <Oprate></Oprate>}
                    <ProductList></ProductList>
                </Spin>
            </div>
            <Modal
                title={language['salespromotion.list_of_promotion']}
                visible={modalShow}
                onCancel={e=>handleToggleLogModal()}
                footer={null}
                width={1180}
                bodyStyle={{padding:'16px 24px'}}
            >
                <PromotionListModal></PromotionListModal>
            </Modal>
        </div>
    );
}

