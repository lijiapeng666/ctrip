/* jshint esversion:6 */
import React from "react";
import { Row, Col, Table, Card, Popover, Button, Icon, Select } from "antd";
import { render } from "react-dom";
const { Option } = Select;
import IncomeDetailsSelectHeader from "./IncomeDetails.selectHeader";
import connect from "react-imvc/hoc/connect";

const withData = connect(({ state, handlers }) => {
  const {
    location: { params, query }
  } = state;
  return { state, handlers };
});
export default withData(WalletSpecialList);

function WalletSpecialList({ state, handlers }) {
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  const { language } = state;
  const columns1 = [
    {
      title: language["time"] || "时间",
      dataIndex: "date",
      width: 168
    },
    {
      title: (
        <span>
          <Select defaultValue="jack" onChange={handleChange}>
            <Option value="jack">全部账户</Option>
            <Option value="lucy">营销钱包</Option>
            <Option value="Yiminghe">竞价专项钱包</Option>
          </Select>
        </span>
      ),

      dataIndex: "wallet",
      width: 130,
      className: "income-table-item"
    },

    {
      title: language["amount_of_money"] || "金额",
      dataIndex: "balance",
      width: 150
    },

    {
      title: language["state"] || "状态",
      dataIndex: "state",
      width: 128
    },
    {
      title: language["remarks"] || "备注",
      dataIndex: "note"
    }
  ];
  const columns = [
    {
      title: language["time"] || "时间",
      dataIndex: "time",
      width: 170
    },
    {
      title: (
        <span>
          <Select defaultValue="jack" onChange={handleChange}>
            <Option value="jack">全部钱包</Option>
            <Option value="lucy">营销钱包</Option>
            <Option value="Yiminghe">竞价专项钱包</Option>
          </Select>
        </span>
      ),

      dataIndex: "wallet",
      width: 210,
      className: "income-table-item"
    },
    {
      title: (
        <span>
          <Select defaultValue="jack" onChange={handleChange}>
            <Option value="jack">全部事项</Option>
            <Option value="lucy">充值</Option>
            <Option value="2">支出</Option>
          </Select>
        </span>
      ),
      dataIndex: "thing",
      width: 140
    },
    {
      title: language["amount_of_money"] || "金额",
      dataIndex: "balance",
      width: 120
    },
    {
      title: language["actual_payment"] || "实付",
      dataIndex: "actualPayment",

      width: 120
    },
    {
      title: language["event_presentation"] || "活动赠送",
      dataIndex: "eventPresentation"
    },
    {
      title: (
        <span>
          <Select defaultValue="jack" onChange={handleChange}>
            <Option value="jack">全部状态</Option>
            <Option value="lucy">充值成功</Option>
          </Select>
        </span>
      ),
      dataIndex: "state",
      width: 220
    }
  ];
  const data = [];
  const data1 = [];
  for (let i = 0; i < 2; i++) {
    data.push({
      key: i,
      time: `2020-06-28 19:51:23`,
      wallet: "营销钱包",
      thing: "充值",
      balance: "500 CNY",
      actualPayment: "350 CNY",
      eventPresentation: "_",
      state: "充值成功"
    });
    data1.push({
      key: i,
      date: `2020-06-28 00:00:00`,
      wallet: "玩乐竞价",
      balance: "50",
      state: "解冻成功",
      note: "竞价成功，解冻金额并扣款"
    });
  }

  const { WalletList } = state;

  return (
    <div className="income-list">
      <Card
        title={
          WalletList === "income"
            ? language["details_of_payments"] || "收支明细"
            : language["freezing_details"] || "冻结明细"
        }
        bordered={false}
        style={{ width: "100%", borderRadius: 8 }}
      >
        <IncomeDetailsSelectHeader />
        <div className="income-list-table">
          <Table
            style={
              WalletList === "income"
                ? { display: "block" }
                : { display: "none" }
            }
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 50 }}
            scroll={{ y: 240 }}
          ></Table>
          <Table
            style={
              WalletList === "income"
                ? { display: "none" }
                : { display: "block" }
            }
            columns={columns1}
            dataSource={data1}
            pagination={{ pageSize: 50 }}
            scroll={{ y: 240 }}
          ></Table>
        </div>
      </Card>
    </div>
  );
}
