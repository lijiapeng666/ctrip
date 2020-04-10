/* jshint esversion:6 */
import Controller from "../shared/BaseController";
import View from "./View";
import * as Model from "./Model";
// import MockApi from '../api/mock'
import { message, Modal } from "antd";
// const Confirm = Modal.confirm;

export default class extends Controller {
  SSR = false;
  pageId = 10650014579;
  View = View;
  Model = Model;
  requireLogin = false;
  pageName = ["wallet.page"];
  openShark = true;

  handleChangeIncomeOrFreezeList = async parmas => {
    // console.log(parmas)
    if (parmas === "income") {
      await this.mergeToState({
        WalletList: "income"
      });
    } else {
      await this.mergeToState({
        WalletList: "freeze"
      });
    }
  };
  handleJudgeRechargeModalState = async v => {
    await this.mergeToState({
      ModalRechargeShow: v
    });
  };
  handleJudgeWithdrawModalState = async v => {
    await this.mergeToState({
      ModalWithdrawShow: v
    });
  };
  handleOfflineTransferModalState = async v => {
    await this.mergeToState({
      ModalOfflineTransferShow: v
    });
  };
  handleInputOpModalState = async v => {
    await this.mergeToState({
      ModalInputOpShow: v
    });
  };
  handleOutputOpModalState = async v => {
    await this.mergeToState({
      ModalOutputOpShow: v
    });
  };
  handleShrink = async v => {
    // const newDataSouce=v
    const { Shrink } = this.store.getState();
    await this.mergeToState({
      Shrink: !Shrink
      //  newDataSouce:newDataSouce
    });
  };
  handleIncomeSave = async params => {
    console.log(params);
  };
  handleOutputSave = async params => {
    console.log(params);
  };
  handleRechargeSave = async params => {
    console.log(params);
  };
  handleOfflineSave = async params => {
    console.log(params);
  };
  handleWithdrawSave = async params =>{
    console.log(params);
  }
}
