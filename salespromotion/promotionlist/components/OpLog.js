/* jshint esversion:6 */
import React from "react";
import connect from 'react-imvc/hoc/connect';
import { Table } from 'antd';
import {formatASPDate} from '../../../../lib/util'

const { Column } = Table;
const withData = connect( ( { state, handlers } ) => {
    const { location:{ params, query },language } = state;
    return { state, handlers,language };
} )
export default withData( OplogList )

function FormGroup  ({label,value,children}) {
    return (
        <div className="form-group">
            <div className="group-label">{label} :&nbsp;</div><div className="group-value">{value}{children}</div>
        </div>
    );
}

function OplogList ( { state, handlers,language } ) {
    console.log( state )

    let  {  opLogList = [],promotionId,promotionName} = state

    return (
        <div className="promotion-modal">
            <FormGroup label={language['promotion.list.ActivityID']} value={promotionId}/>
            <FormGroup label={language['promotion.list.Activityname']} value={promotionName}/>
            <Table dataSource={opLogList} rowKey={record => `${record.createTime}` }  >
                <Column
                    title={language['salespromotion.oper_time']}
                    width={150}
                    key="createTime"
                    render={(text,{createTime}) => (
                        <span>{formatASPDate(createTime,'YYYY-MM-DD HH:mm:ss')}</span>
                    )}
                />
                <Column
                    title={language['salespromotion.oper_user']}
                    dataIndex="opuser"
                    width={100}
                />
                <Column
                    title={language['salespromotion.oper_content']}
                    dataIndex="title"
                    width={280}
                />

            </Table>


        </div>
    );
}

