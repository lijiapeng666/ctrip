import React from "react";
import { Modal, Form, Row, Col, Input, Select } from "antd";

import connect from "react-imvc/hoc/connect";
const { Option } = Select;
const withData = connect(({ state, handlers, props }) => {
  const {
    location: { params, query }
  } = state;
  return { state, handlers, props };
});

function InputOpModal({ state, handlers, props }) {
  const { ModalInputOpShow } = state;

  function hideModal() {
    handlers.handleInputOpModalState(false);
  }
  function SubmitOK() {
    const { handleIncomeSave } = handlers;
   
    validateFields((error, values) => {
      // console.log("error", error);
      console.log("所有控件的值", values);
      const { incomeMony } = values;
      if (error) return;
      console.log("验证成功");
      let saveData = {
        incomeMony
      };
      handleIncomeSave(saveData);
      handlers.handleInputOpModalState(false);
    });
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

  const { getFieldDecorator, validateFields } = props.form;
  const {language} = state
  return (
    <Form>
      <Modal
        title={<span className="modale-title">{language["Transfer_marketing_wallet"]||"从营销钱包转入"}</span>}
        visible={ModalInputOpShow}
        onOk={SubmitOK}
        onCancel={hideModal}
        okText={language["submission"]||"提交"}
        cancelText={language["cancel"]||"取消"}
        width="650px"
      >
        <div className="RechargeModal-Modal">
          <Row gutter={[16, 16]} type="flex" justify="start" align="middle">
            <Col span={15}>
              <Form.Item
                style={{ marginBottom: "unset" }}
                label={<span className="font-set">{language["amount_transferred"]||"转入金额"}</span>}
                className="flex-of-item"
              >
                {getFieldDecorator("incomeMony", {
                  initialValue: "",
                  rules: [
                    {
                      required: true,
                      message: language["please_fill_amount"]||"请填写金额"
                    }
                    // {
                    //   validator: customFixedAmountValidator
                    // }
                  ]
                })(
                  <Input
                    type="text"
                    placeholder={language["please_amount"]}
                    onChange={handleNumberChange}
                    style={{ width: 215 }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]} type="flex" justify="start" align="middle">
            <Col style={{ paddingTop: 0, marginLeft: "26%" }}>
              <span className="font-set" style={{ color: "808C9D" }}>
                {language["european_commission"]||"营销钱包中可转入余额为"}:
              </span>
              <span className="font-set" style={{ color: "#FF6F00 " }}>
                1000.00 CNY
              </span>
            </Col>
          </Row>
          <Row
            gutter={[16, 16]}
            type="flex"
            justify="start"
            align="middle"
            style={{ marginTop: 8 }}
          >
            <Col style={{ textAlign: "right", width: "27.3%" }}>
              <div className="font-set">{language["transfer_to"]||"转入至"}:</div>
            </Col>
            <Col span={10}>
              <div className="font-set">竞价专项账户</div>
            </Col>
          </Row>
        </div>
      </Modal>
    </Form>
  );
}
export default Form.create({})(withData(InputOpModal));
