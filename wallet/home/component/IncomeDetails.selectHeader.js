import React from "react";
import { Menu, Radio, Row, Col, DatePicker, Form,Icon } from "antd";
import connect from "react-imvc/hoc/connect";
const { RangePicker } = DatePicker;
import moment from "moment";
const dateFormat = "YYYY/MM/DD";

const withData = connect(({ state, handlers }) => {
  const {
    location: { params, query }
  } = state;
  return { state, handlers };
});
class IncomeDetailsSelectHeader extends React.Component {
  state = {
    current: "income",
    SelectValue: "",
    SelectDate: [],
  };

  handleClick = async e => {

    const { state, handlers } = this.props;
    const { WalletList } = state
    const preCurrent = this.state.current
    // console.log(preCurrent)

    await this.setState({
      current: e.key
    });
    await handlers.handleChangeIncomeOrFreezeList(this.state.current);
    const nowCurrent = this.state.current
    if (preCurrent === nowCurrent) {
      return
    } else {
      this.setState({
        SelectValue: "",
        SelectDate: [],
      })
    }
  };


  SelectDayOnChange = async e => {
    let value = e.target.value;
    await this.setState({
      SelectValue: value
    })
    if (value !== '') {
      await this.setState({
        SelectDate: []
      })
    }
    if (value === "sevenDay") {
      console.log(
        moment()
          .startOf("day")
          .day(7)
          .unix()
      );
    }
    if (value === "oneMonth") {
      console.log(
        moment()
          .startOf("day")
          .month(1)
          .unix()
      );
    }
    if (value === "threeMonth") {
      console.log(
        moment()
          .startOf("day")
          .month(3)
          .unix()
      );
    }
  };
  dateRangeChange = async (dates, dateStrings) => {

    if (dates.length == 0) {
      await this.setState({
        SelectDate: []
      })
    } else {
      await this.setState({
        SelectValue: ""
      })
      let startDate = dates[0].startOf("day").unix();
      let endDate = dates[1].startOf("day").unix();
      await this.setState({
        SelectDate: dates
      })
      console.log(startDate, endDate);
    }
  };


  render() {
    const { state } = this.props;
    const { WalletList,language } = state
    console.log(this.state.SelectValue, this.state.SelectDate)

    function disabledDate(current) {
      return current > moment()
    }
    return (
      <div className="select-header">
        <Form>
          <Row gutter={[16, 16]} justify="start">
            <Col>
              <div>
                <Menu
                  onClick={this.handleClick}
                  selectedKeys={[this.state.current]}
                  mode="horizontal"
                >
                  <Menu.Item key="income" style={{marginLeft:16}}>{language["details_of_payments"]||"收支明细"}</Menu.Item>
                  <Menu.Item key="freeze">{language["freezing_details"]||"冻结明细"} </Menu.Item>
                </Menu>
              </div>
            </Col>
            <Col span={6} style={{width:"22%",marginLeft:16}} >
              <Radio.Group  value={this.state.SelectValue} onChange={this.SelectDayOnChange}>
                <Radio.Button className="search-day" value="sevenDay">{language["nearly_seven_days"]||"近七天"}</Radio.Button>
                <Radio.Button className="search-day" value="oneMonth">{language["nearly_a_month"]||"近一个月"}</Radio.Button>
                <Radio.Button className="search-day" value="threeMonth">{language["nearly_three_months"]||"近三个月"}</Radio.Button>
              </Radio.Group>
            </Col>
            <Col span={6} style={{width:"22%"}} >
              <RangePicker value={this.state.SelectDate} onChange={this.dateRangeChange} disabledDate={disabledDate} format={dateFormat} />
            </Col>
            <Col span={3} style={{marginTop:3,marginLeft:10}}  >
              <a className="search-day"  > <Icon type="download" style={{color:"#1890ff"}} />{language["download_details"]||"下载明细"} </a>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default Form.create({})(withData(IncomeDetailsSelectHeader));
