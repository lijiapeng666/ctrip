import moment from 'moment';
import Controller from '../shared/BaseController'
import View from './View'
import * as Model from './Model'
import api from './../api';



export default class extends Controller {
	// SSR = this.location.query.ssr !== '0';
	SSR = false;
	pageId = 0;
	View = View
	Model = Model
	requireLogin = true;
	requireUserInfo = true;
	pageName = 'refund';
	modulePagename = unescape("%u9000%u6B3E%u5BA1%u6838");
	

	constructor(location, context) {
		super(location, context)
	}
	preload = {
		...this.preload,
		antdCss: "/pages/css/descriptions.css",
		table: "/pages/css/table.css"
	}
	//给url后面加&callId
	urlQuery = (paramName, replaceWith) => {
		let oUrl = window.location.href.toString();
		// let re = eval('/(' + paramName + '=)([^&]*)/gi');
		let nUrl = oUrl += '&callId=';
		history.pushState(null, null, nUrl);
	}
	//初始化数据
	async getInitialState(initialState) {
		this.urlQuery()
		initialState = await super.getInitialState(initialState)
		return {
			...initialState,
			isInCtripApp: this.isInCtripApp(),
			userAgent: this.getUserAgent(),
			pageName: this.pageName,
			isNewChangeLocale: true
		}
	}
	//发送请求拉取数据
	async componentWillCreate() {
		this.location.raw = this.location.raw + "&callId"
		let params = Number(this.handleQueryUrl("orderid"))
		const res = await this.postApi(api.getOnlyRefundMoney, { orderId: params })
	
		// this.store.actions.setState({ totalAmount: res.totalAmount, orderId: res.orderId, orderDate: res.orderDate, contactName: res.contactName, actualAmount: res.actualAmount, orderName: res.orderName, orderRefundStatus: res.orderRefundStatus, paymentDetailList: res.paymentDetailList, refundMoneyList: res.refundMoneyList })
		// res.refundMoneyList.map((item,index)=>{
		// 	  return {item,index}
	
		// })
		
		this.store.actions.setState({
			...res,
			
		})
		console.log(this.store.actions.setState({
			
			
		}))
	
	}
	//截取url中指定数据
	handleQueryUrl(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}
	//input，textArea输入内容获取处理结果
	async handleSubmitInput(e) {
		console.log(e)
		const res = await this.postApi(api.saveCustomerRefund, e)
		await this.store.actions.setState({ errorMessage: res.returnStatus.errorMessage })
	}
	handleStateChange = (data) => {
		//state更新
		let { setState } = this.store.actions
		setState(data)
	}
	handlerCallShark = async (locale = 'zh-CN') => {
		this.store.actions.setState({ locale, language: await this.callShark(locale) });
	};
	handleSubmitInput = this.handleSubmitInput
}
