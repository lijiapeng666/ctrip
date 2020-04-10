import React from "react";
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  Popover,
  Icon,
  DatePicker,
  Upload,
  Button
} from "antd";
import connect from "react-imvc/hoc/connect";
const { Option } = Select;
const { TextArea } = Input;
const withData = connect(({ state, handlers, props }) => {
  const {
    location: { params, query }
  } = state;
  return { state, handlers, props };
});

function OfflineTransferModal({ state, handlers, props }) {
  const { ModalOfflineTransferShow } = state;
  const iconStyle = { fontSize: "14px", color: "#808C9D" };
  function hideModal() {
    handlers.handleOfflineTransferModalState(false);
  }
  function SubmitOk() {
    const { handleOfflineSave } = handlers;
    validateFields((error, values) => {
      // console.log("error", error);
      console.log("所有控件的值", values);
      const {
        rechargeMony,
        RechargeTime,
        RechargeComfirm,
        RechargeText
      } = values;
      if (error) return;
      console.log("验证成功");
      let saveData = {
        rechargeMony,
        RechargeTime,
        RechargeComfirm,
        RechargeText
      };
      handleOfflineSave(saveData);
      handlers.handleOfflineTransferModalState(false);
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
  function textAreaChange() {}
  function triggerChange(changedValue) {}
  function DatePickerChange() {}
  const { getFieldDecorator, validateFields } = props.form;
  const {language} = state
  return (
    <Form>
      <Modal
        title={language["submit_recharge_record"]||"提交充值记录"}
        visible={ModalOfflineTransferShow}
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
            <Col style={{ textAlign: "right", width: "23.5%" }}>
              <div className="font-set">{language["advertising_position"]+":"||"广告位:"}</div>
            </Col>
            <Col span={10}>
              <div className="font-set">竞价-搜索页结果推荐位</div>
            </Col>
          </Row>
          <Row gutter={[16, 16]} type="flex" justify="start" align="middle">
            <Col style={{ width: "50%" }}>
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
                })(
                  <Input
                    type="text"
                    style={{ width: 153 }}
                    onChange={handleNumberChange}
                  />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Popover
                placement="bottom"
                className="font-set"
                content="优惠币种：指携程外网对客优惠的币种，例如：选择人民币时，则只有在以人民币售卖时才会有优惠；选择全币种时，则以用户下单时的币种优惠。"
              >
                <Icon style={iconStyle} type="exclamation-circle" />
              </Popover>
            </Col>
          </Row>
          <Row gutter={[16, 16]} type="flex" justify="start" align="middle">
            <Col style={{ width: "50%" }}>
              <Form.Item
                style={{ marginBottom: "unset" }}
                label={<span className="font-set">{language["recharge_time"]||"充值时间"}</span>}
                className="flex-of-item"
              >
                {getFieldDecorator("RechargeTime", {
                  rules: [
                    {
                      required: true,
                      message: language["select_recharge_time"]||"请选择充值时间"
                    }
                  ]
                })(
                  <DatePicker
                    style={{ width: "153px" }}
                    onChange={DatePickerChange}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]} type="flex" align="middle">
            <Col style={{ width: "100%" }}>
              <Form.Item
                style={{ marginBottom: "unset", display: "flex" }}
                label={<span className="font-set">{language["voucher"]||"凭证:"}</span>}
                className="set-Width"
              >
                {getFieldDecorator("RechargeComfirm", {
                  initialValue: "",
                  rules: [
                    {
                      required: true,
                      message: language["please_upload_voucher"]||"请上传凭证"
                    }
                  ]
                })(
                  <Upload>
                    <Button className="font-set">
                      <Icon type="upload" /> {language["please_upload"]||"请上传"}
                    </Button>
                  </Upload>
                )}
              </Form.Item>
              <span className="font-set position-set">
                {language["context_five"]}
              </span>
            </Col>
          </Row>
          <Row gutter={[16, 16]} type="flex" justify="start">
            <Col style={{ width: "90%" }}>
              <Form.Item
                style={{ marginBottom: "unset" }}
                label={<span className="font-set">{language["remarks"]||"备注"}</span>}
                className="flex-of-item"
              >
                {getFieldDecorator("RechargeText", {
                  initialValue: "",
                  rules: [
                    {
                      required: true,
                      message: language["please_fill_remarks"]||"请填写备注"
                    }
                  ]
                })(
                  <TextArea
                    onChange={textAreaChange}
                    placeholder={language["please_enter_notes"]||"请输入备注内容"}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    style={{ width: 400 }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Modal>
    </Form>
  );
}
export default Form.create({})(withData(OfflineTransferModal));
