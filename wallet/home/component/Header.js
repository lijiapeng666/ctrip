import React from "react";
import { Row, Col, Card, Button, Tooltip } from "antd";

import connect from "react-imvc/hoc/connect";
import RechargeModal from './Header.rechargeModal'
import WithdrawModal from './Header.withdrawModal'
import WalletSpecialList from './SpecialList'
const withData = connect(({ state, handlers }) => {
  const {
    location: { params, query }
  } = state;
  return { state, handlers };
});
export default withData(WalletHeader)
function WalletHeader({ state, handlers }) {
  function showRechargeModal() {
    handlers.handleJudgeRechargeModalState(true)
  }
  function showWithdrawModal() {
    handlers.handleJudgeWithdrawModalState(true)
  }
  const {language} = state
  return (
    <div className="wallet-header">
      <Card
        title={<span className="modale-title">{language["marketing_wallet"]||"营销钱包"}：1500CNY</span>}
        bordered={false} style={{ width: "100%", borderRadius: 8 }}>
        <Card style={{ marginBottom: 8, borderRadius: 8 }}  >
          <Row gutter={[16, 16]} justify="start">
            <Col span={16}>
              <Row> <Col style={{ display: "flex" }} > <div className="blue-bar" ></div> <p className="font-header-mony">{language["account_balance"]||"账户余额："}500.00&nbsp;CNY</p></Col> </Row>
              <Row> <Col> <span className="wallet-header-text" >{language["available_for_withdrawal"]||"可用可提现："}</span><span className="font-header-monyNumber" >500CNY</span></Col> <Col style={{ marginLeft: 24 }} > <span className="wallet-header-text" >{language["freezing_amount"]||"冻结金额："}400.00&nbsp;CNY</span></Col></Row>
            </Col>
            <Col span={8} className="header-button-group">
              <Tooltip placement="left" title="每月仅限提现一次，最近一次提现日期为：{z年y月x日}，请于次月{x日}后申请提现。">
                <Button onClick={showWithdrawModal} >
                  <div>{language["cash_withdrawal"]||"提现"}</div>
                  <p className="wallet-header-info" >{language["once_month_only"]||"（每月仅限一次）"}</p>
                </Button>
              </Tooltip>
              <Button type="primary" onClick={showRechargeModal} >{language["recharge"]||"充值"}</Button>
              
            </Col>
          </Row>
        </Card>
        <WalletSpecialList />
      </Card>
      <RechargeModal />
      <WithdrawModal />
    </div>
  );
}
