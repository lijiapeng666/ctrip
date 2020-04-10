import React from "react";
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  Popover,
  Radio,
  Icon
} from "antd";
import OfflineTransferModal from "./Header.offlineTransferModal";
import connect from "react-imvc/hoc/connect";
const { Option } = Select;
const withData = connect(({ state, handlers, props }) => {
  const {
    location: { params, query }
  } = state;
  return { state, handlers, props };
});

function RechargeModal({ state, handlers, props }) {
  const iconStyle = { fontSize: "14px", color: "#808C9D" };
  const { ModalRechargeShow } = state;
  function hideModal() {
    handlers.handleJudgeRechargeModalState(false);
  }
  function handleNumberChange(e) {
    const number = parseInt(e.target.value || 0, 10);
    if (isNaN(number)) {
      return;
    }
    triggerChange({ number });
  }

  function handleCurrencyChange(currency) {
    triggerChange({ currency });
  }

  function triggerChange(changedValue) {
    // const { onChange, value } = this.props;
    // if (onChange) {
    //   onChange({
    //     ...value,
    //     ...changedValue
    //   });
    // }
  }
  async function judgeToWhere() {
    const { handleRechargeSave } = handlers;
    
    validateFields((error, values) => {
      console.log("所有控件的值", values);
      const { rechargeMony, selectCurrency, radioGroup } = values;
      if (error) return;
      if (radioGroup === "b") {
        let saveData = {
          rechargeMony,
          selectCurrency
        };
        handleRechargeSave(saveData);
        handlers.handleOfflineTransferModalState(true);
      }
      if(radioGroup==="a"){
        

      }

      console.log("验证成功");
      handlers.handleJudgeRechargeModalState(false);
    });
  
  }

  const { getFieldDecorator, validateFields } = props.form;
  const {language} = state
  return (
    <div>
      <Form>
        <Modal
          title={<span className="modale-title">{language["recharge"]||"充值"}</span>}
          visible={ModalRechargeShow}
          onOk={judgeToWhere}
          onCancel={hideModal}
          okText="确认"
          cancelText={language["cancel"]||"取消"}
          width="730px"
        >
          <div className="RechargeModal-Modal">
            <Row gutter={[16, 16]} type="flex" justify="start" >
              <Col style={{ width: "48.8%" }}>
                <Form.Item
                  style={{ marginBottom: "unset" }}
                  label={<span className="font-set">{language["recharge_amount"]||"充值金额"}</span>}
                  className="flex-of-item"
                >
                  {getFieldDecorator("rechargeMony", {
                    initialValue: "",
                    rules: [
                      {
                        required: true,
                        message: language["please_fill_amount"]||"请填写金额"
                      }
                    ]
                  })(<Input type="text" onChange={handleNumberChange} />)}
                </Form.Item>
              </Col>

              <Col style={{ padding: "8px 0px 8px 0px " }}>
                <Form.Item style={{ marginBottom: "unset" }}>
                  {getFieldDecorator("selectCurrency", {
                    initialValue: "rmb",
                    rules: [
                      {
                        message: language["please_fill_amount"]||"请填写金额"
                      }
                    ]
                  })(
                    <Select
                      style={{ width: 80 }}
                      onChange={handleCurrencyChange}
                    >
                      <Option value="rmb">RMB</Option>
                      <Option value="dollar">Dollar</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Popover content="可用于提交出价的金额，其中参与活动的金额不可退回钱包余额且不可提现" placement="bottom" >
                  <Icon style={iconStyle ,{ marginTop:12}} type="exclamation-circle" />
                </Popover>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={22} style={{ paddingTop: 0 }}>
                <Form.Item
                  style={{ marginBottom: "unset", display: "flex" }}
                  label={<span className="font-set">{language["payment_method"]||"支付方式"}</span>}
                  className="lable-set"
                >
                  {getFieldDecorator("radioGroup", {
                    initialValue: "a",
                    rules: [
                      {
                        required: true,
                        message: language["please_select_method"]
                      }
                      // {
                      //   validator: customFixedAmountValidator
                      // }
                    ]
                  })(
                    <Radio.Group className="font-set">
                      <Radio value="a" className="font-set">
                        {language['alipay_weChat_banking']||"支付宝/微信支付/网银"}
                      </Radio>

                      <div className="rechargeModal-modal-radio-text">
                        {language["context_four"]}
                      </div>

                      <Radio value="b" className="font-set">
                        {language["offline_transfer"]||"线下转账"}
                      </Radio>

                      <div className="rechargeModal-modal-radio-text">
                      {language["context_tree"]}
                      </div>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Modal>
      </Form>
      <OfflineTransferModal />
    </div>
  );
}
export default Form.create({})(withData(RechargeModal));
