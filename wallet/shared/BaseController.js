

import Controller from '../../shared/BaseController'
import _ from 'lodash'
import * as sharedActions from './sharedActions'
import service from './service'
import util from './util'
import route from './util/route'
import RouteStorage from './storage/RouteStorage'
import vbkNative from './util/vbknative'
import HistoryManager from './util/historymanager'
import {notification, message} from 'antd/lib';
import {ifShowHeader} from "../../lib/util"
import API from '../api'
import querystring from "querystring";

const UrlMap6381 = {
    fat:'//offline.fx.fws.qa.nt.ctripcorp.com',
    uat:'//offline.fx.uat.qa.nt.ctripcorp.com',
    prod:'//offline.fx.ctripcorp.com'
}
export default class extends Controller {

    API = API
    preload = {
        antCover:'/css/antCover.css',
        vbk:'/css/vbk.css',
        coupon:"/promotion/css/coupon.css",
        vbkHeader:'/css/common.css',
        promotion:'/promotion/css/promotion.css',
        wallet: '/wallet/css/wallet.css'
    };

    constructor(location, context) {
        super(location, context)
        const ua = this.getUserAgent()
        this.env = util.getEnvByUserAgent(ua)
        let query = {}
        for (let key of Object.keys(location.query)) {
            query[key.toLowerCase()] = location.query[key]
        }
        location.query = query
    }

    /**
     * 动态合并共享的 actions
     */
    getFinalActions(actions) {
        return {...actions, ...sharedActions}
    }

    async getInitialState(initialState) {
        let subMenu = {}
        let crumbMenuInfo = {}
        let permission = "all";
        initialState = await super.getInitialState(initialState)

        const {query:{logintype,headertype}={}} = this.location
        let userInfo;

        // console.log('context',this.context)
        if (ifShowHeader(logintype)) {  //根据自己的需要写判断条件
            userInfo = await this.getVacationUserInfo(logintype)
            if (!userInfo && this.context.isClient ) {
                message.error('请先登录!');//请先引入antd 的message组件
            }
        }else if(headertype==2||headertype==3) {
            userInfo = await this.getVbkUserInfo(logintype)
            console.log('客户端',this.context.isClient)
            if (!userInfo && this.context.isClient ) {
                message.error('请先登录!');//请先引入antd 的message组件
            }
        }

        if(logintype==3){//6381 offline
           if(!userInfo)
               userInfo = {}
            userInfo.menus = await this.getMenuFor6831();
        }


        // console.log('用户信息',userInfo)
        return {
            ...initialState,
            //query,
            env: this.env,
            userInfo: userInfo||{},
            layoutEnv:this.context.env,
            pageId: this.pageId,
            siteType:logintype == 5 ? 'vac' : 'ttd',  //站点类型，ttd门票 vac度假，默认为门票
            permission,
            crumbMenuInfo,
            subMenu,
        }
    }

    async getVbkUserInfo(logintype) {
        let result = await this.post('/16190/json/login',{loginType:logintype}) || {}
        // console.log("*******************登录登录**",result)

        const {loginResult={}} = result
        return loginResult.userInfo || null
    }

     handleLogout = async()=>{
        this.logout()
    }

    async getVacationUserInfo(logintype) {
        if(logintype =="3"){
            let url = `${UrlMap6381[this.context.env]}/tour/productinputservice/getCurrentUserInfo.json${this.context.env=='fat'?'?subEnv=fat66':''}`

            let result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({"contentType":"json","head":{"ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","extension":[]}}),
                credentials: "include",
            }).then(response=> response.json()).catch(err => {
                console.log(err)
            }) || {}

            console.log('结果',result)
            if (result.ResponseStatus && result.ResponseStatus.Ack == "Success" && result.user) {
                return {
                    offline: false,
                    user:{
                        providerName: result.user.name
                    }
                }
            }

            return null

        }
        else{
            try {
                let url = "/13953/getcurrentuserinfo.json"
                let result = await this.post(url) || {}
                //console.log('结果',JSON.stringify(result))
                //let result = await this.fetch(url)
                if (result.ResponseStatus && result.ResponseStatus.Ack == "Success" && result.user) {
                    let { ResponseStatus, ...others } = result

                    let menuJson = result.menuJson ? JSON.parse(result.menuJson) : {}
                    result.menuSetting = menuJson.menus || []
                    return {
                        ...others,
                        ...JSON.parse(result.menuJson)
                    }
                }
            }catch (e){
                console.log(e)
            }

        }
        return null
    }
    async getPermission() {
        let productId = this.location.query.productid || "";
        let result = await this.post("/15638/hasPermission.json", {
            type: "tourinfo",
            productID: productId
        });
        let res = true;
        if(result.ResponseStatus.Ack!="Success") {
            res = false;
        }
        res = result.result;
        return res ? "all" : "readonly";
    }

    async getMenuFor6831() {
        let url = `${UrlMap6381[this.context.env]}/tour/productinputservice/getMenu.json${this.context.env=='fat'?'?subEnv=fat66':''}`

        let result = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                "contentType":"json",
                "head":{"ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","extension":[]},
                from:"6831"
            }),
            credentials: "include",
        }).then(response=> response.json()).catch(err => {
            console.log(err)
        })||{}

        if (result.ResponseStatus && result.ResponseStatus.Ack == "Success" && result.menus) {
            return result.menus
        }
        return null
    }

    async getCrumbMenuInfoForVBK() {
        let url = '/13953/GetNavigatorMenuInfo.json'
        let productId = Number(this.location.query.productid)
        let params = {
            productId: productId
        }
        let result = await this.post(url, params)
        if (result.ResponseStatus && result.success) {
            return {
                menus: result.menuList
            }
        } else {
            return {}
        }
    }

    async getCrumbMenuInfoFor6381() {
        let url = '/15638/getSubMenu.json'
        let productId = Number(this.location.query.productid)

        let params = {
            from:"6381",
            productId: productId
        }
        let result = await this.post(url, params)
        if (result.ResponseStatus && result.ResponseStatus.Ack == "Success") {
            return {
                menus: result.menus
            }
        } else {
            return {}
        }
    }

    async componentDidFirstMount() {
        // console.log('***************进了base的componentDidFirstMount****************')

        super.componentDidFirstMount()

        this.historyManager = HistoryManager.getInstance();
        this.historyManager.setCurrentNodeByName(this.name)
        let pageOptions = RouteStorage.instance.getPageOptions() || null
        if (pageOptions) {
            this.store.actions.initPageOptions(pageOptions)
            //RouteStorage.instance.removePageOptions()
        }
        RouteStorage.instance.removePageOptions()

        const from = this.location.query.from
        if (from) {
            let location = {url: from}
            RouteStorage.instance.setUrl(this.location.pathname, location, false)
        }
        this.onComponentDidFirstMount && this.onComponentDidFirstMount()



        const {query:{headertype}={}} = this.location

        if(headertype==2||headertype==3){
            /**
             * 统一获取vbk头部menuList*/
            const {menuList = []}= this.store.getState()

            // console.log('内容',this.context)
            let vbkHeaderUrlMap = {
                fat:'//vbooking.ctrip.fat334.qa.nt.ctripcorp.com',
                uat:'//vbooking.ctrip.uat.qa.nt.ctripcorp.com',
                prod:'//vbooking.ctrip.com'
            }

            let vbkHeaderUrl = vbkHeaderUrlMap[this.context.env]+'/ttd/shop/getHeadMenuList'

           fetch(vbkHeaderUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
               credentials: "include",
            }).then(response=> response.json()).then( data => {
                console.log(data)
                if(data.operationResult.errorType==0){
                    if (!_.isEqual(menuList, data.menuList))
                        this.mergeToState({
                            menuList:data.menuList
                        })
                }else {
                    // console.log('vbk头部列表获取失败')
                }
            }).catch(err => {
                console.log(err)
            })

        }

    }


    componentDidMount() {
        this.historyManager = HistoryManager.getInstance();
        this.historyManager.setCurrentNodeByName(this.name)
    }

    removePageOptions() {
        RouteStorage.instance.removePageOptions()
    }

    setPageOptions(pageOptions) {
        RouteStorage.instance.setPageOptions(pageOptions)
    }

    viewDidAppear() {
        CtripEventListener.removeHybridEventListener(
            'onPageDidAppear',
            this.viewDidAppear
        )
        CtripEventListener.removeHybridEventListener(
            'onBackButtonClick',
            this.handleBackClick
        )

        let currentPageName = '/' + _.last(location.pathname.split('/'))
        let pageOptions = RouteStorage.instance.getPageOptions() || null
        if (pageOptions) {
            this.store.actions.initPageOptions(pageOptions)
            RouteStorage.instance.removePageOptions()
        }
        this.onViewDidAppear && this.onViewDidAppear()
    }

    handleBackClick = () => {
        this.back()
        return true
    }

    post(url, data = {}, options) {
        let hostName
        if (this.context.isServer) {
            hostName = this.context.req.hostname
        } else {
            hostName = location.hostname
        }

        if(this.store){
            let {location:{query:{logintype}={}}={}} = this.store.getState()||{}

            if(logintype.toLowerCase()=='domain'){
                logintype = 1
            }else if(logintype.toLowerCase()=='vbk'){
                logintype = 2
            }

            data.loginType = logintype //给 request拼接 loginType参数
        }

        let fullUrl = service.getUrl(url, this.context.env, hostName)
        return super.post(fullUrl, data, options)
    }

    asyncSetPageId(pageId) {
        this.pageId = pageId
        this.logpv()
        this.store.actions.updatePageId(pageId)
    }

    /*
     options:
     isHideNavBar 显示或隐藏多WebView打开时的Native头部默认显示与否
     isIgnore 在路由里面忽略该层结构，以实现 A－>B->C->A
     isMultiView hybird下是否多Webview打开，优先级高于route下的全局控制
     pageOptions 用来跨页面传值,用来解决跨页面传递大对象。非必要情况传参请使用params
     */
    forward(targetPageName = '', params = {}, options = {}) {
        let isMultiView = route.config.multiView
        if (_.has(options, 'isMultiView')) {
            isMultiView = options.isMultiView
        }
        if (this.env.isInCtripApp && !options.isIgnore) {
            //多Webview时默认隐藏Native头部
            if (options.isHideNavBar) {
                params.isHideNavBar = 'YES'
            }
        } else {
            isMultiView = false
        }

        //存储pageOptions
        if (options.pageOptions) {
            RouteStorage.instance.setPageOptions(options.pageOptions)
        }

        //保存from至Storage
        let currentPageName = '/' + _.last(location.pathname.split('/'))
        let currentLocation, isInternal
        if (options.isIgnore) {
            //假设a->b->c 目前页是b,如果跳c的时候设置了isIgnore,那么获取b的前一页a，并保存一条c from a的记录
            if (_.has(this.location.query, 'from_native_page')) {
                params.from_native_page = 1
            }
            let backOption = RouteStorage.instance.getUrl(currentPageName)
            currentLocation = backOption.location
            isInternal = backOption.isInternal
        } else {
            //假设a->b 目前页是a,保存一条b from a的记录
            currentLocation = {pathname: currentPageName, search: location.search}
            isInternal = true
        }
        RouteStorage.instance.setUrl(targetPageName, currentLocation, isInternal)
        let targetPageURI = this.prependBasename(targetPageName)
        if (this.env.isInWechat) {
            //微信下有单页JS加载时序导致的BUG，所以微信下必须为href
            this.jumpH5(targetPageURI, params, {isMultiView: false})
        } else if (isMultiView) {
            //多页打开
            this.jumpH5(targetPageURI, params, {isMultiView: true})
        } else {
            //单页跳转
            let queryString = _.isEmpty(params)
                ? ''
                : '?' + route.toQueryString(params)
            let targetLocation = {pathname: targetPageName, search: queryString}
            if (options.isIgnore) {
                this.history.replace(targetLocation)
            } else {
                this.history.push(targetLocation)
            }
        }
    }

    /*
     options:
     pageOptions 用来返回的时候传值
     */
    back(options = {}) {
        let currentPageName = '/' + _.last(location.pathname.split('/'))
        let backOption = RouteStorage.instance.getUrl(currentPageName)
        //存储pageOptions
        if (options.pageOptions) {
            if (backOption && backOption.isInternal) {
                let backLocation = backOption.location
                RouteStorage.instance.setPageOptions(options.pageOptions)
            }
        }

        if (_.has(this.location.query, 'from_native_page')) {
            if (this.env.isInCtripApp) {
                CtripUtil.app_back_to_last_page()
                return true
            }
        }

        // let currentPageName = "/" + _.last(location.pathname.split('/'))
        // let backOption = RouteStorage.instance.getUrl(currentPageName)
        if (backOption) {
            if (backOption.isInternal) {
                this.history.replace(backOption.location)
            } else {
                let url = backOption.location.url
                this.jumpH5(url, {}, {isMultiView: false})
            }
            return true
        }
        this.jumpToDefaultPage()
        return true
    }

    jumpToDefaultPage() {
        if (vbkNative.isVBKApp()) {
            vbkNative.closeWebView();
        }
        else if (this.env.isInCtripApp) {
            CtripUtil.app_back_to_last_page()
        } else {
            let url = this.prependBasename('/index')
            this.jumpH5(url, {}, {isMultiView: false})
        }
    }

    /*
     options:
     * @paramisHideNavBar 显示或隐藏多WebView打开时的Native头部默认显示与否
     isMultiView hybird下是否多Webview打开，优先级高于route下的全局控制
     */
    jumpH5(targetPageURI = '', params = {}, options = {}) {
        let isMultiView = route.config.multiView
        if (_.has(options, 'isMultiView')) {
            isMultiView = options.isMultiView
        }
        if (!this.env.isInCtripApp) {
            isMultiView = false
        } else {
            if (options.isHideNavBar) {
                params.isHideNavBar = 'YES'
            }
        }

        if (targetPageURI.indexOf('/webapp/') === 0) {
            targetPageURI = location.origin + targetPageURI
        }
        if (!_.isEmpty(params)) {
            let queryString = route.toQueryString(params)
            const hyphen = targetPageURI.indexOf('?') >= 0 ? '&' : '?'
            targetPageURI += hyphen + queryString
        }

        if (isMultiView) {
            //多webview打开新页面
            CtripEventListener.addHybridEventListener(
                'onPageDidAppear',
                this.viewDidAppear.bind(this)
            )
            CtripEventListener.addHybridEventListener(
                'onBackButtonClick',
                this.handleBackClick.bind(this)
            )
            CtripUtil.app_open_url(targetPageURI, 2)
        } else {
            location.href = targetPageURI
        }
    }

    jumpHybrid(targetPageURI = '', params = {}, options = {}) {
        if (!_.isEmpty(params)) {
            let queryString = route.toQueryString(params)
            const hyphen = targetPageURI.indexOf('?') >= 0 ? '&' : '?'
            targetPageURI += hyphen + queryString
        }
        CtripEventListener.addHybridEventListener(
            'onPageDidAppear',
            this.viewDidAppear.bind(this)
        )
        CtripEventListener.addHybridEventListener(
            'onBackButtonClick',
            this.handleBackClick.bind(this)
        )
        let paths = targetPageURI.split('/')
        if (paths[1] !== 'webapp') {
            CtripUtil.app_open_url(targetPageURI, 4)
        } else {
            targetPageURI = paths[2] + '/index.html#' + targetPageURI
            CtripUtil.app_open_url(targetPageURI, 4)
        }
    }

    jumpNative(targetPageURI = '', params = {}, options = {}) {
        if (!_.isEmpty(params)) {
            let queryString = route.toQueryString(params)
            const hyphen = targetPageURI.indexOf('?') >= 0 ? '&' : '?'
            targetPageURI += hyphen + queryString
        }
        targetPageURI = `ctrip://wireless` + targetPageURI
        CtripEventListener.addHybridEventListener(
            'onPageDidAppear',
            this.viewDidAppear.bind(this)
        )
        CtripEventListener.addHybridEventListener(
            'onBackButtonClick',
            this.handleBackClick.bind(this)
        )
        CtripUtil.app_open_url(targetPageURI, 1)
    }

    /*
     pageSetting
     */
    setupHeader(opt = {title: ''}) {
        this.store.actions.updateHeader(opt)
    }

    setBtnLoading(index, val) {
        this.store.actions.updateBtnLoading({index, val})
    }

    hideLoading = () => {
        let {updateLoading} = this.store.actions
        updateLoading(false)
    }

    showLoading = (loadingInfo = {}) => {
        let {updateLoading} = this.store.actions
        updateLoading(true)
    }

    //显示ant-design的toast
    openNotificationWithIcon = (type, message, description, placement) => {
        notification[type]({
            message: message,
            description: description,
            duration: 2,
            placement: placement

        });
    }

    showToast = (content = "", duration = 2000) => {
        let {updateToast} = this.store.actions;
        updateToast(content);
        this.toastTimeoutId = setTimeout(() => {
            updateToast("");
        }, duration);
    };

    hideToast = () => {
        let {updateToast} = this.store.actions;
        updateToast("");
        if (this.toastTimeoutId) {
            clearTimeout(this.toastTimeoutId);
        }
    };

    showErrorPage({callback}) {
        const {updateErrorInfo} = this.store.actions
        updateErrorInfo({
            showErrorPage: true,
            errorCallback: () => {
                callback && callback()
                updateErrorInfo({})
            }
        })
    }

    showConfirm = option => {
        return new Promise((resolve, reject) => {
            let opt = {...option}
            opt.show = true

            let {updateConfirm} = this.store.actions
            opt.onCancel = () => {
                opt.show = false
                updateConfirm(opt)
                resolve(false)
            }
            opt.onConfirm = () => {
                opt.show = false
                updateConfirm(opt)
                resolve(true)
            }
            updateConfirm(opt)
        })
    }


    handleBack = (options = {}, historyCount) => {
        //this.diyBackPage()

        // if (options.url && options.url !== _backUrl) {
        //   var pageName = options.pageName || this.historyManager.getPageNameByUrl(options.url);
        //   var node = this.historyManager.findNodeByName(pageName);
        //   _backUrl = options.url;
        //   node && (node.setData(_.extend(node.getData(), {url: _backUrl})));
        // }

        if (options.type == 'home' && vbkNative.isVBKApp()) {
            vbkNative.closeWebView()
            return
        }
        //存储pageOptions
        if (options.pageOptions) {
            RouteStorage.instance.setPageOptions(options.pageOptions)
        }
        var from = this.location.query.from
        if (/^(https|http|\/webapp\/)\S+/i.test(from)) {
            location.href = from
            return;
        }
        this.diyBackPage({}, historyCount)

        /*var _backUrl = this.historyManager.back()
         if (_backUrl) {
         this.jumpH5(_backUrl)
         } else {
         this.diyBackPage()
         }*/
    }

    /**
     * 页面离开的时候终止所有请求
     * 前提是需要在 每次调接口的时候 把实例push到this.requestList里
     */
    abortAllRequest() {
        if (this.requestList && this.requestList.length) {
            this.requestList.forEach(req => {
                req && req.abort && req.abort()
            })
        }
        this.requestList = []
    }

    prePageJump(options) {
        options = options || {}
        this.abortAllRequest()
        if (!isEmpty(options.pageOptions)) {
            this.context.pageOptions = options.pageOptions
        } else {
            this.context.pageOptions = null
        }
    }

    /**
     * 页面回退
     * @method backPage
     * @param {Object} options
     * @param {String} hostoryCount : 需要回退的历史记录数, 默认使用goBack返回上一个
     */
    diyBackPage(options = {}, historyCount = 0) {
        this.prePageJump(options)
        // console.log('历史记录', this.history)

        if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) { // IE
            if (history.length > 0) {
                _goBack(this)
            } else {
                window.opener = null;
                window.close();
            }
        } else { //非IE浏览器
            if (navigator.userAgent.indexOf('Firefox') >= 0 ||
                navigator.userAgent.indexOf('Opera') >= 0 ||
                navigator.userAgent.indexOf('Safari') >= 0 ||
                navigator.userAgent.indexOf('Chrome') >= 0 ||
                navigator.userAgent.indexOf('WebKit') >= 0) {

                if (window.history.length > 1) {
                    _goBack(this)
                } else {
                    window.opener = null;
                    window.close();
                }
            } else { //未知的浏览器
                _goBack(this)
            }
        }

        function _goBack(_self) {
            if (historyCount === 0) {
                _self.history.goBack()
            } else {
                _self.history.go(historyCount)
            }
        }

        // 保证回退的时候删除缓存，可以保证a页面去b页面的生命周期可以统一
        // 不清除页面缓存
        if (!options.keepCache) {
            this.removeFromCache()
        }
    }

    async toLogin() {
        let result = null
        await this.post("/14361/json/getUserInfo").then((res) => {
            if (res) {
                const {response, user, lineList} = res

                if (response.errorCode == 0) {
                    // console.log('用户', user)
                    result = {user, lineList}
                }
            }

        })
        return result
    }
    handleChangeReqTime= (resourceId,startTime,endTime) => {
        this.store.actions.updateReqTime(startTime)

        let params={
            resourceId
        }
        if(endTime){
            params.endTime = endTime.format('YYYY-MM-DD')
        }else {
            params.startTime= startTime.format('YYYY-MM-DD')
        }
        this.resHandler(()=>this.getResourcePriceCalendar(params),(res)=>{
            const {reqTime,...data} = res

            this.store.actions.updateCalendarData(data)
        },(e)=>{
            console.log(e)
        },{name:'getResourcePriceCalendar'})
    }


    getResourcePriceCalendar = async (params={}) => {
        return await this.post('/16190/json/getResourcePriceCalendar', params)
    }

    handleGetQuery = ()=>{
        const { location: {query} } = this.store.getState();
        return querystring.stringify(query)
    }


    /**
     * 请求结构处理
     * @method resHandler
     * @param {Function} func : api接口配置
     * @param {Function} success : 成功回调
     * @param {Function} fail : 失败回调
     * @param {Number} options.limit : 请求失败重试开关，调用方可根据实际场景设置失败后重试次数，默认1不重试
     * @param {String} options.name : 自定义埋点名称
     */
    async resHandler(func, success, fail, options = {}) {
        // console.log('***************请求开始****************')
        let {limit = 1, name = ''} = options;
        let {userInfo:{userId = '',userType=''}={}} = this.store.getState()
        if (limit < 1) {
            // console.log('网络出错,稍后再试试')
            return
        }
        try {

            let res = await func()

            const {ResponseStatus,resultStatus,loginResult={},...data} = res

            if(!loginResult.isSuccess){
                message.error('请先登录!');
                return fail(res);
            }else {
                const {userInfo={}} = loginResult
                userId = userInfo.userId ||''
                userType = userInfo.userType||''
            }

            if (ResponseStatus && ResponseStatus.Ack === "Success" && resultStatus && resultStatus.isSuccess) {

                console.log(data,data)
                return success({...data,loginResult,reqTime:ResponseStatus.Timestamp});

            } else {

                fetch('/ttdmarketing/localapi/createClog', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title:name+'_fail',
                        message: JSON.stringify({userId,userType,response:res}),
                        addInfo: {
                            time:new Date(),
                            userId,
                            userType,
                        },
                    })
                }).then( res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })

                return fail(resultStatus)
            }

        } catch (e) {
            // console.log(name, '***************请求异常****************', e.toString())
            this.tracelog("marketingVendor_resHandler_catchError", {
                name,
                userId,
                userType,
                'errmsg': e.toString()
            })

            fetch('/ttdmarketing/localapi/createClog', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title:name+'_catchError',
                    message: e.toString(),
                    addInfo: {
                        time:new Date(),
                        userId,
                        userType
                    },
                })
            }).then( res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })

            this.resHandler(func, success, fail, {'limit': limit - 1});
        }
    }

    /**
     * 将对象合并到state*/
    mergeToState(obj){
        this.store.actions.updateMergeState(obj)
    }
}

function isEmpty(obj) {
    return !obj || Object.keys(obj).length === 0
}
