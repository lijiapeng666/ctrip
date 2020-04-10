/* jshint esversion:6 */

import React from "react";
import connect from 'react-imvc/hoc/connect';
import { Row, Col, Button } from 'antd';

const withData = connect(({ state,handlers }) => {
    const { location: { params ,query},language } = state;
    
    return {  language,params ,handlers};
})

export default withData(Oprate)

function Oprate({language, params, handlers}) {
    const { handleRelateCurrentCoupons, handlerUnbindCurrentCoupons } = handlers;
    return (
        <Row>
            <Col style={{paddingLeft:20}}>
                <Button icon="plus-square"  onClick={handleRelateCurrentCoupons} type="primary" style={{marginRight:10}}>{language['salespromotion.batchlink']}</Button>
                <Button icon="minus-square"  onClick={handlerUnbindCurrentCoupons} type="default">{language['salespromotion.canel_batchlinkoption']}</Button>
            </Col>
        </Row>
    );
}