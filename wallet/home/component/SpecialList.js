/* jshint esversion:6 */
import React from "react";
import { Row, Col, Table, Card, Popover, Button, Icon } from "antd";
import { render } from "react-dom";
import connect from "react-imvc/hoc/connect";
import InputOpModal from './SpecialList.inputOpModal'
import OutputOpModal from './SpecialList.outputOpmodal'
import { tuple } from "antd/lib/_util/type";


const withData = connect(({ state, handlers }) => {
  const {
    location: { params, query }
  } = state;
  return { state, handlers };
});

class WalletSpecialList extends React.Component {

  constructor(props) {
    super(props)
  }
  state = {
    dataSouse: [
      { key: "1", price: "900", currcy: "CNY", activePrice: "700", activeGetPrice: "100", freezePrice: "100", id: "1008123123" },
      { key: "2", price: "100", currcy: "CNY", activePrice: "700", activeGetPrice: "100", freezePrice: "100", id: "1008123123" },
      { key: "3", price: "100", currcy: "CNY", activePrice: "700", activeGetPrice: "100", freezePrice: "100", id: "1008123123" },
    ]
  }
  componentDidMount() {
    this.state.dataSouse.forEach(item => {
      item.checked = false;
    })
  }
  render() {
    const { state, handlers } = this.props
    const { Shrink, AIndex,language } = state
    const iconStyle = { fontSize: "12px",  color: "#808C9D",marginLeft:4 };
    const yellowiconStyle = { fontSize: "12px",  color: "orange",marginRight:4 };

    function showInputOpModal() {
      handlers.handleInputOpModalState(true)
    }
    function showOutputOpModal() {
      handlers.handleOutputOpModalState(true)
    }
    return (
      <div className="special-wallet" >
        {
          this.state.dataSouse.map((item, index) =>
            <div key={item.key}  >
              <Card style={{borderRadius:8,}} >
                <Row>
                  <Col span={16}>
                    <Row>
                      <Col className="font-header-mony" style={{ display: "flex" }} ><div className="blue-bar" ></div> <p>{language["special_bidding_account"]}</p> </Col><Col className="font-header-mony" > <p> {item.price} CNY</p></Col>
                    </Row>
                    <Row>
                      <Col> <span className="wallet-header-text" >{language["available_for_withdrawal"]||"可用可提现"}</span><span className="font-header-monyNumber" >500CNY</span></Col>
                      <Col>
                      <Popover placement="bottom"  content="可用于提交出价的金额，其中参与活动的金额不可退回钱包余额且不可提现">
                          <Icon style={iconStyle}  type="exclamation-circle" />
                        </Popover>
                      </Col>
                      
                      <Col style={{ marginLeft: 24 }} > <span className="wallet-header-text" >{language["freezing_amount"]}400.00&nbsp;CNY</span></Col>
                    </Row>
                    <Row>
                      <Col className="yellow-alert">
                        
                        <Popover 
                        placement="bottom" 
                        content="可用于提交出价的金额，其中参与活动的金额不可退回钱包余额且不可提现">
                          <Icon style={yellowiconStyle} type="exclamation-circle" theme="filled" />

                        </Popover>
                   

                        <span className="yellow-text" >{language["replace_tow"]}</span>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={8} className="special-button-group" >
                    <Button onClick={showInputOpModal} >{language["Transfer_marketing_wallet"]||"从营销钱包转入"}</Button>
                    <Button onClick={showOutputOpModal} >{language["return_marketing_wallet"]||"退回到营销钱包"}</Button>
                  </Col>
                </Row>

              </Card>
            </div>
          )
        }
        <InputOpModal />
        <OutputOpModal />
      </div>
    )
  }

}

export default withData(WalletSpecialList)

