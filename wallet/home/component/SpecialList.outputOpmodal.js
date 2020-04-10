import React from "react";
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
} from "antd";

import connect from "react-imvc/hoc/connect";
const { Option } = Select;
const withData = connect(({ state, handlers, props }) => {
  const {
    location: { params, query }
  } = state;
  return { state, handlers, props };
});

function OutputOpModal({ state, handlers, props }) {
  const { ModalOutputOpShow } = state;

  function hideModal() {
    handlers.handleOutputOpModalState(false);
  }
  function SubmitOK() {
    
    const { handleOutputSave } = handlers;
    validateFields((error, values) => {
      // console.log("error", error);
      console.log("所有控件的值", values);
      const { OutputMony } = values;
      if (error) return;
      console.log("验证成功");
      let saveData = {
        OutputMony
      };
      handleOutputSave(saveData);
      handlers.handleOutputOpModalState(false);
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

  const { getFieldDecorator,validateFields } = props.form;
  const {language} = state
  return (
    <Form>
      <Modal
        title={<span className="modale-title">{language["return_marketing_wallet"]||"退回到营销钱包"}</span>}
        visible={ModalOutputOpShow}
        onOk={SubmitOK}
        onCancel={hideModal}
        okText="提交"
        cancelText="取消"
        width="650px"
      >
        <div className="RechargeModal-Modal">
          <Row gutter={[16, 16]} type="flex" justify="start" align="middle">
            <Col span={15}>
              <Form.Item
                style={{ marginBottom: "unset" }}
                label={<span className="font-set">{language["refund_amount"]||"退回金额"}</span>}
                className="flex-of-item"
              >
                {getFieldDecorator("OutputMony", {
                  rules: [
                    {
                      required: true,
                      message:language["please_fill_amount"]||"请填写金额"
                    }
                    // {
                    //   validator: customFixedAmountValidator
                    // }
                  ]
                })(
                  <Input
                    type="text"
                    placeholder="请输入"
                    onChange={handleNumberChange}
                    style={{ width: 215 }}
                  />
                )}
              </Form.Item>
            </Col>

          </Row>
          <Row
            gutter={[16, 16]}
            type="flex"
            justify="start"
            style={{ marginTop: 20 }}
            align="middle"
          >
            <Col style={{ textAlign: "right", width: "27.3%" }}>
              <div className="font-set">{language["selected_account_balance"]||"所选账户余额"}</div>
            </Col>
            <Col span={10}>
              <div className="font-set">900 CNY</div>
            </Col>
          </Row>
          <Row
            gutter={[16, 16]}
            type="flex"
            justify="start"
            style={{ marginTop: 20 }}
            align="middle"
          >
            <Col style={{ textAlign: "right", width: "27.3%" }}>
              <div className="font-set">{language["refundable_balance"]||"可退回余额"}</div>
            </Col>
            <Col span={10}>
              <div className="font-set" style={{ color: "#FF6F00 " }}>
                600 CNY
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 16]} type="flex" justify="start" align="middle">
            <Col
              className="font-set"
              style={{ marginLeft: 172, color: "#808C9D" }}
            >
             {language["context_one"]}
            </Col>
          </Row>
        </div>
      </Modal>
    </Form>
  );
}
export default Form.create({})(withData(OutputOpModal));
