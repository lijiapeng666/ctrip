/**
 * @author zy.jiang@Ctrip.com
 * @description 现阶段因为同时存在Lizard与nodejs
 */

import BaseStorage from '../storage/BaseStorage'

class Node {
  constructor(options) {
    this.next = options.next;
    this.preview = options.preview;
    this.data = options.data;
    this.historyList = options.historyList;
  }

  getNext() {
    return this.next;
  }

  setNext(node) {
    this.next = node;
  }

  getPreview() {
    return this.preview;
  }

  setPreview(node) {
    this.preview = node;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
    this.historyList.saveNodes();
  }

  remove() {
    this.historyList.remove(this);
  }

  equal(node) {
    return this.getData().name === node.getData().name;
  }
}


class LinkList {
  constructor(options) {
    this.store = options.store;
    this.historyList = options.historyList;
    this.createNodes();
  }

  findNodeByName(name) {
    if (!this.head) {
      return;
    }
    var curNode = this.head;
    if (curNode.getData().name === name) {
      return curNode;
    }
    while (curNode.getNext()) {
      curNode = curNode.getNext();
      if (curNode.getData().name === name) {
        return curNode;
      }
    }
  }

  insertBefore(oldNode, newNode) {
    var preview = oldNode.getPreview();
    newNode.setNext(oldNode);
    oldNode.setPreview(newNode);
    if (preview) {
      preview.setNext(newNode);
      newNode.setPreview(preview);
    }
    oldNode.equal(this.head) && this.setHead(newNode);
    this.saveNodes();
  }

  insertAfter(oldNode, newNode) {
    var next = oldNode.getNext();
    newNode.setPreview(oldNode);
    oldNode.setNext(newNode);
    if (next) {
      next.setPreview(newNode);
      newNode.setNext(next);
    }
    this.saveNodes();
  }

  replace(oldNode, newNode) {
    !newNode && this.remove(oldNode);
    var preview = oldNode.getPreview(),
      next = oldNode.getNext();
    newNode.setNext(next);
    newNode.setPreview(preview);
    preview && preview.setNext(newNode);
    next && next.setPreview(newNode);
    this.saveNodes();
  }

  remove(node) {
    if (!node) {
      return;
    }
    var preview = node.getPreview(),
      next = node.getNext();
    preview && preview.setNext(next);
    next && next.setPreview(preview);
    node.equal(this.head) && this.setHead(next);
    this.saveNodes();
  }

  getHead() {
    return this.head;
  }

  setHead(node) {
    this.head = node;
    this.saveNodes();
  }

  getLast() {
    var curNode = this.head;
    while (curNode.getNext()) {
      curNode = curNode.getNext();
    }
    return curNode;
  }

  append(node) {
    var last = this.getLast();
    if (last) {
      last.setNext(node);
      node.setPreview(last);
    } else {
      this.head = node;
    }
    this.saveNodes();
  }

   saveNodes() {
    var tmp = [];
    var curNode = this.head;
    while (curNode) {
      tmp.push(curNode.getData());
      curNode = curNode.getNext();
    }
     this.store.set(null, tmp);
  }

   createNodes() {
    var tmp =  this.store.get();


    if (!tmp || !tmp.length) {
      return;
    }
    for (var i = 0, l = tmp.length; i < l; i++) {
      tmp[i] = new Node({data: tmp[i], historyList: this.historyList});
    }
    for (i = 0; i < l; i++) {
      tmp[i].setPreview(tmp[i - 1]);
      tmp[i].setNext(tmp[i + 1]);
    }
    this.head = tmp[0];
  }
}


class Service {

  //@abstract
  getHistoryStore() {
    throw new Error('abstract method');
    // @example:
    // return TicketStore.TicketHistory.getInstance();//门票
    // return ActivityStore.ActivityHistory.getInstance();//玩乐
  }

  //@abstract
  getPageNameRegs() {
    throw new Error('abstract method');
    // example:
    // return {
    //	    list: /dest\/[a-z]+-\S+-[0-9]+\/s-tickets/gi,
    //	    detail: /dest\/t[0-9]+\.html/gi,
    //	    jianjie: /jianjie\/[0-9]+\.html/gi,
    //	    comment: /dest\/t[0-9]+\/p[0-9]+\/comment.html/gi
    // }
  }

  //@abstract
  getDefaultNode() {
    return new Node({
      data: {url: '/webapp/ttd/vbkorder/orderlist', name: 'orderlist'},
      // data: {url: Lizard.appBaseUrl + 'index', name: 'index'},
      historyList: this.historyList
    });
  }

  constructor() {
    this.historyList = new LinkList({store: this.getHistoryStore(), historyList: this});
  }

  getPageNameByUrl(url) {
    var regs = this.getPageNameRegs();
    var pathName = url.split('?')[0];
    // pathName = pathName.replace(Lizard.appBaseUrl, '');
    pathName = pathName.replace(/\/webapp\/\w+\//, '');
    for (var pageName in regs) {
      if ((_.isFunction(regs[pageName]) && regs[pageName].call(null, pageName))
        || ( _.isRegExp(regs[pageName]) && pathName.match(regs[pageName]))
        || regs[pageName] === pageName) {
        return pageName;
      }
    }
    return pathName.split('/')[0] || 'index';
  }

  reset() {
    this.historyList.setHead();
  }

  setCurrentNodeByName(name) {
    var node = this.historyList.findNodeByName(name);
    this.setCurrentNode(node);
  }

  setCurrentNode(node) {
    this.curNode = node;
    if (!this.curNode) {
      var url = location.href.replace(location.origin, '');
      this.curNode = new Node({
        data: {
          url: url,
          name: this.getPageNameByUrl(url)
        },
        historyList: this.historyList
      });
      this.historyList.setHead(this.curNode);
    }
  }

  getCurrentNode() {
    return this.curNode;
  }

  getPreviewNodeName() {
    var previewNode = this.getCurrentNode().getPreview();
    if (previewNode) {
      return previewNode.getData().name;
    }
  }

  getNextNodeName() {
    var nextNode = this.getCurrentNode().getNext();
    if (nextNode) {
      return nextNode.getData().name;
    }
  }

  findNodeByName(name) {
    return this.historyList.findNodeByName(name);
  }

  saveNodes() {
    this.historyList.saveNodes();
  }

  forward(options) {
    var data;
    if (options.replace) {
      this.getCurrentNode().getData().url = options.url;
    } else if (!!options.crntype) {
      var urlObject = TicketUrlUtil.query2json(options.url) || {};
      data = {
        url: options.url,
        name: urlObject.initialPage || 'ticket'
      };
    } else {
      data = {
        url: options.url,
        name: options.pageName || this.getPageNameByUrl(options.url)
      };
    }
    var next = new Node({data: data, historyList: this.historyList});
    this.curNode.setNext(next);
    next.setPreview(this.curNode);
    this.historyList.saveNodes();
  }

  back() {
    if (this.curNode.equal(this.getDefaultNode())) {//当前页为首页，则没有上一页url了
      this.historyList.setHead();
      return '';
    }
    var preview = this.curNode.getPreview();
    if (preview) {//有上一页，返回上一页url
      return preview.getData().url;
    } else {//没有上一页，就默认上一页为首页
      this.historyList.insertBefore(this.curNode, this.getDefaultNode());
      return this.historyList.getHead().getData().url;
    }
  }

  backToPageName(name) {
    var targetNode = this.historyList.findNodeByName(name);
    if (targetNode) {
      return targetNode.getData().url;
    }
  }

  static getInstance() {
    return this.instance || (this.instance = new this());
    // return Service.instance || (Service.instance = new Service())
  }

  static instance = null;
}

export default class extends Service {

  //@override
  getHistoryStore() {
    return new BaseStorage('P_TICKET_HISTORY', 10 * 60)// 以秒为单位, 暂时先写这里，玩乐暂时还没有用到
    // return TicketStore.TicketHistory.getInstance();
  }

  //@override
  getPageNameRegs() {
    return {
      list: /dest\/[a-z]+-[\S\s]+-[0-9]+\/s-tickets/gi,
      detail: /dest\/t[0-9]+\.html/gi,
      detailattr: /jianjie\/[0-9]+\.html/gi,
      comment: /dest\/t[0-9]+\/comment.html/gi
    }
  }
}





