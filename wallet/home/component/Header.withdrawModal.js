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

function WithdrawModal({ state, handlers, props }) {
  const { ModalWithdrawShow } = state;
  function hideModal() {
    handlers.handleJudgeWithdrawModalState(false);
  }


  function SubmitOk() {
    const { handleWithdrawSave } = handlers;
    validateFields((error, values) => {
      // console.log("error", error);
      console.log("所有控件的值", values);
      const { withdrawMony } = values;
      if (error) return;
      console.log("验证成功");
      let saveData = {
        withdrawMony
      };
      handleWithdrawSave(saveData);
      handlers.handleJudgeWithdrawModalState(false);
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
        title={<span className="modale-title">{language["language"]||"申请提现"}</span>}
        visible={ModalWithdrawShow}
        onOk={SubmitOk}
        onCancel={hideModal}
        okText={language["submission"]||"提交"}
        cancelText={language["cancel"]||"取消"}
        width="650px"
      >
        <div className="RechargeModal-Modal">
          <Row
            gutter={[16, 16]}
            type="flex"
            style={{ backgroundColor: "grey" }}
            justify="start"
            align="middle"
          >
            <Col span={8} style={{ margin: "16px 16px 16px 16px" }}>
              <div className="font-set">{language["payment_account"]||"付款账号"}</div>
              <div className="font-set">231 005 1997 0628 0531</div>
            </Col>
            <Col span={3} style={{ margin: "16px 16px 16px 16px" }}></Col>
            <Col span={8} style={{ margin: "16px 16px 16px 16px" }}>
              <div className="font-set">{language["receiving_account"]||"收款账号"}</div>
              <div className="font-set">**** **** **** **** ****</div>
            </Col>
          </Row>
          <Row
            gutter={[16, 16]}
            type="flex"
            justify="start"
            align="middle"
            style={{ marginTop: 20 }}
          >
            <Col span={5} style={{ textAlign: "right" }}>
              <div className="font-set">{language["advertising_position"]||"广告位"}:</div>
            </Col>
            <Col span={10}>
              <div className="font-set">竞价-搜索页结果推荐位</div>
            </Col>
          </Row>
          <Row
            gutter={[16, 16]}
            type="flex"
            justify="start"
            align="middle"
            style={{ marginTop: 10 }}
          >
            <Col span={12}>
              <Form.Item
                style={{ marginBottom: "unset" }}
                label={<span className="font-set">{language["cash_withdrawal_amount"]||"提现金额"}</span>}
                className="flex-of-item"
              >
                {getFieldDecorator("withdrawMony", {
                  initialValue: "",
                  rules: [
                    {
                      required: true,
                      message: language["please_fill_amount"]||"请填写金额"
                    }
                  ]
                })(
                  <Input
                    type="text"
                    placeholder="请输入"
                    onChange={handleNumberChange}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={5}>
              <span className="font-set">CNY</span>
            </Col>
          </Row>
          <Row gutter={[16, 16]} type="flex" justify="start" align="middle">
            <Col offset={5} style={{ paddingTop: 0 }}>
              <span style={{ color: "orange" }} className="font-set">
                {language["replace_one"]}
              </span>
              <br />
              <span className="font-set">{language["context_tow"]}</span>
            </Col>
          </Row>
        </div>
      </Modal>
    </Form>
  );
}
export default Form.create({})(withData(WithdrawModal));
