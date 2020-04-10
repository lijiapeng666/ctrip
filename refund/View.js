import React, { PureComponent, Fragment } from 'react';
import BasicLayout from "../component/BasicLayout";
import { Style, Link } from 'react-imvc/component';
import { Form, Row, Col, Card, Input, Button, Table, Descriptions, Breadcrumb, message } from 'antd';
const { TextArea } = Input
// test

class Refund extends PureComponent {
    constructor(props) {
        super(props)

    }
    state = {
        inputMony: null,
        text: "",
    };
    //拿area区域的输入值
    handleTextChange = e => {
        this.setState({
            text: e.target.value
        })
    }
    //点击按钮提交时执行
    handleSubmit = async (e) => {
        const {language,paymentDetailList}=this.props.state
        console.log(e.paymentDetailList[0].refundAmountEnter)
        if(paymentDetailList.length!==0){
            if (e.paymentDetailList[0].refundAmountEnter != "") {
                await this.props.handlers.handleSubmitInput(e)
                const {errorMessage}=this.props.state
    
                message.error(errorMessage);
                this.setState({
                    inputMony: null,
                    text: ""
                })
            }
            else {
                message.warning(language["PleaseEnterTheCorrectAmount"]);
            }
        }else{
                await this.props.handlers.handleSubmitInput(e)        
                const {errorMessage}=this.props.state
                message.error(errorMessage);
                this.setState({
                    inputMony: null,
                    text: ""
                })
            
        }
      

    }
    //判断订单状态
    handleCaseJuge = v => {
        const {language}=this.props.state
        switch (v) {
            case 0:
                return language["unknown"];
            case 1:
                return language["Unprocessed"];
            case 2:
                return language["paidFor"];
            case 3:
                return language["Paid"];
            case 4:
                return language["Authorized"];
            case 5:
                return language["ConfirmCustomer"];
            case 6:
                return language["ConfirmProduct"];
            case 7:
                return language["NotOperated"];
            case 8:
                return language["ClosedUnsubscribeall"];
            case 9:
                return language["ClosedPartiallyunsubscribed"];
            case 10:
                return language["Closed"];
            case 11:
                return language["Cancelled"];
        }
    }
    handleOnclick = order => {
        window.open(`/v2/detail?orderid=${order}`);
    }
    //判断客户退款明细状态
    handleCaseJugeAuditStatus = v => {
        const {language}=this.props.state
        switch (v) {
            case -1:
                return language["PendingReview"];
            case 0:
                return language["Uncharged"];
            case 1:
                return language["Charged"];
            case 2:
                return language["DebitFailed"];
            case 3:
                return language["AuditNotPassed"];
        }
    }
   

    render() {
      
        //向父组件拉数据
        // const { paymentDetailList = [], refundMoneyList = [], language, totalAmount, orderId, orderDate, contactName, actualAmount, orderName, orderRefundStatus, } = this.props.state;
        // console.log(this.props.state.refundMoneyList)
        const { paymentDetailList , refundMoneyList , language, totalAmount, orderId, orderDate, contactName, actualAmount, orderName, orderRefundStatus, } = this.props.state;
      
        // paymentDetailList.length==0?[{maxRefundAmount:0}]:paymentDetailList
        // console.log(paymentDetailList)
        //客户退款明细表格表头
        const refundColumns = [{ title: language["Numbering"], dataIndex: 'auditId', }, { title: language["Amount"], className: 'column-money', dataIndex: 'refundAmount', }, { title: language["operator"], dataIndex: 'eid', }, { title: language["time"], dataIndex: 'sendAuditDate', }, { title: language["status"], dataIndex: 'auditStatus', }, { title: language["2.15.12.6_Remarks"], dataIndex: 'refundRemark', },];
        //客户退款明细表格内容
        // const refundData = [{ key: '1', refundId:refundMoneyList.length==0?"":refundMoneyList[0].auditId, refundMoney: refundMoneyList.length==0?"":refundMoneyList[0].refundAmount, refundOperator:refundMoneyList.length==0?"":refundMoneyList[0].eid, refundTime:refundMoneyList.length==0?"": refundMoneyList[0].sendAuditDate, refundState:refundMoneyList.length==0?"": this.handleCaseJugeAuditStatus(refundMoneyList[0].auditStatus), refundNote:refundMoneyList.length==0?"":refundMoneyList[0].refundRemark }];
        //扣款明细表头
        if(refundMoneyList.length!=0&&paymentDetailList.length!=0){
            for(let i=0;i<refundMoneyList.length;i++){
                refundMoneyList[i]["key"]=i
                paymentDetailList[i]["key"]=i
            }
        }
        console.log(paymentDetailList)
        const deductionsColumns = [{ title: language["paymentMethod"], dataIndex: 'prepayType', width: 300, }, { title: language["TotalReceipts"], className: 'column-money', dataIndex: 'payAmount', width: 300, },
        {
            title: language["EnterRefundAmount"],
            dataIndex: 'refundAmount',
            render: () =><Fragment> <Input value={this.state.inputMony} style={{ width: 200 }} onChange={e => {
                this.setState({
                    inputMony: e.target.value
                }, function () {
                 
                    if (!isNaN(this.state.inputMony)) {
                        if (Number(this.state.inputMony) > Number(paymentDetailList[0].maxRefundAmount)) {
                            message.warning(language["TheAmountEnteredCannotBeGreaterThanTheRefundAmount"]);
                            this.setState({
                                inputMony: null
                            })
                        }
                        if (Number(this.state.inputMony) < 0) {
                            message.warning(language["PleaseEnterTheCorrectAmount"]);

                            this.setState({
                                inputMony: null
                            })
                        }
                    }
                    else {
                        message.warning(language["PleaseEnterTheCorrectAmount"]);
                        this.setState({
                            inputMony: null
                        })

                    }
                  

                })
            }} /> <span style={{ color: "red" }}>{language["RefundableCap"]}：</span> {paymentDetailList.length===0?"":paymentDetailList[0].maxRefundAmount} &nbsp;<span style={{ color: "red" }}>{language["InsuranceAmount"]}：</span> {paymentDetailList.length==0?"":paymentDetailList[0].insuranceAmount} </Fragment>
        },
        ];
        //扣款明细内容
        
        // const deductionsData = [
        //     {
        //         key: '1',
        //         deductionsWay:paymentDetailList.length==0?"":paymentDetailList[0].prepayType,
        //         totalOf: paymentDetailList.length==0?"":paymentDetailList[0].payAmount,
        //         refundAmount: '',
        //     }, {
        //         key: '2',
        //         deductionsWay:paymentDetailList.length==0?"":paymentDetailList[0].prepayType,
        //         totalOf: paymentDetailList.length==0?"":paymentDetailList[0].payAmount,
        //         refundAmount: '',
        //     }
            
        // ];
        
        //订单基本信息内容
        const BasicInformation = {
            orderNumber: orderId,
            orderContent: orderName,
            dueDate: orderDate,
            orderStatus: this.handleCaseJuge(orderRefundStatus),
            contactMan: contactName,
            accountsReceivable: totalAmount,
            hasBeenReceiving: actualAmount,
            OperationNote: "",
        }
        
        //输入数据保存给后台
        const SubmitRequreData = { orderId, remark: this.state.text, paymentDetailList: [{ prepayType:paymentDetailList.length==0?"":paymentDetailList[0].prepayType, refundAmountEnter: Number(this.state.inputMony), insuranceAmount:paymentDetailList.length==0?"":paymentDetailList[0].insuranceAmount, maxRefundAmount:paymentDetailList.length==0?"":paymentDetailList[0].maxRefundAmount, payAmount:paymentDetailList.length==0?"": paymentDetailList[0].payAmount, relatedBillItemNos:paymentDetailList.length==0?"": paymentDetailList[0].relatedBillItemNos }], }

        console.log(SubmitRequreData)
        return (
            <BasicLayout>
                <Style name="antdCss" />
                <Style name="table" />
                <div className="refund-view" >
                    <Form>
                        <Breadcrumb style={{ marginBottom: 10 }} >
                        </Breadcrumb>
                        <Row style={{ marginTop: 5, backgroundColor: '#fff' }}>
                            <Col span={24}>
                                <Table
                                    columns={refundColumns}
                                    // dataSource={refundData}
                                    dataSource={refundMoneyList}
                                    bordered
                                    title={() => [language["CustomerRefundDetails"]]}
                                    pagination={false}
                                />
                                <Table
                                    columns={deductionsColumns}
                                    dataSource={paymentDetailList}
                                    // dataSource={deductionsData} 
                                    bordered
                                    title={() => [language["ChargeDetails"]]}
                                    pagination={false}
                                />
                                <Descriptions title={language["OrderBasicInformation"]} bordered>
                                    <Descriptions.Item label={language["orderNumber"]}> <Link onClick={() => this.handleOnclick(BasicInformation.orderNumber)} >{BasicInformation.orderNumber}</Link> </Descriptions.Item>
                                    <Descriptions.Item label={language["OrderContent"]} >{BasicInformation.orderContent}</Descriptions.Item>
                                    <Descriptions.Item label={language["ScheduledDate"]}>{BasicInformation.dueDate}</Descriptions.Item>
                                    <Descriptions.Item label={language["OrderStatus"]}>{BasicInformation.orderStatus}</Descriptions.Item>
                                    <Descriptions.Item label={language["ContactPerson"]} ContactPerson span={2}>
                                        {BasicInformation.contactMan}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={language["Receivables"]} >
                                        {BasicInformation.accountsReceivable}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={language["paidFor"]} >{BasicInformation.hasBeenReceiving}</Descriptions.Item>
                                    <Descriptions.Item label={language["OperationNotes"]}>{BasicInformation.OperationNote}</Descriptions.Item>
                                    <Descriptions.Item label={language["2.15.12.6_Remarks"]}> <TextArea rows={4} value={this.state.text} onChange={this.handleTextChange} /> </Descriptions.Item>
                                </Descriptions>
                                <Card style={{ width: 100 + "%", boxShadow: "none" }}>
                                    <Button type="primary" onClick={() => this.handleSubmit(SubmitRequreData)} style={{ width: 200, marginLeft: 500 }} block>{language["SaveCustomerRefund"]} </Button>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </BasicLayout>

        )
    }
}
export default Refund;