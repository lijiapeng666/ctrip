/* jshint esversion:6 */

import React from "react";
import connect from 'react-imvc/hoc/connect';
import { Link } from 'react-imvc/component';
import { Menu } from 'antd';
import querystring from "querystring";

const Item = Menu.Item;
const withData = connect(({ state,handlers }) => {
    const { location: { params ,query},language,relatedCount } = state;
    const {handleSaveExpand} = handlers
    return {  language,params ,query,relatedCount,handleSaveExpand};
})

export default withData(activityRuleList)
function activityRuleList({language={},params:{type,pid=1} ,query,relatedCount,handleSaveExpand}) {
    const selectedKeys = [type];
    return (
        <div style={{margin:"0 28px" ,fontSize:'20px',fontWeight:'bold'}}>
            <Menu selectedKeys={selectedKeys} mode="horizontal"   >
                <Item key="2"><Link to={`/promotion/relate/2/${pid}?${querystring.stringify(query)}`} onClick={handleSaveExpand}>{language['salespromotion.linkedoption']}（{relatedCount}）</Link></Item>
            </Menu>
        </div>
    );
}