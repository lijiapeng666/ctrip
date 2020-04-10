/* jshint esversion:6 */

import React from "react";
import connect from 'react-imvc/hoc/connect';
import { Link } from 'react-imvc/component';
import { Menu } from 'antd';
import querystring from "querystring";
const Item = Menu.Item;
const withData = connect(({ state }) => {
    const { location: { params ,query},language } = state;
    return {  params ,query,language};
})

export default withData(activityRuleList)
function activityRuleList({ params ,query,language}) {
    return (
        <Menu style={{margin:"0 28px"}} selectedKeys={["productlist"]} mode="horizontal">
            <Item key="promotionlist"><Link to={`/salespromotion/promotionlist?${querystring.stringify(query)}`}>{language["promotion.title.promotionlist"]}</Link></Item>
            <Item key="productlist"><Link to={`/salespromotion/productlist?${querystring.stringify(query)}`}>{language["promotion.title.Activeproductlist"]}</Link></Item>
        </Menu>
    );
}

