import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import THBText from 'thai-baht-text' // for ES6
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import * as _ from 'underscore'

@Injectable()

// tslint:disable-next-line:component-class-suffix
//รูป set ค่าใน variable ให้ใช้ ./assets/
//รูป set ค่าใน css ให้ใช้ url(../../assets/)
export class AppHelperCommponent {
  public loginBg = '';
  public mainBg = '';
  public effect = '';
  public menuHist = '';
  public isLoadBg = false;
  public showSnow = false;
  public showRain = false;
  public showGhost = false;

  //user login info
  public uiversion = '';
  public staffid = 'admin';
  public staffname = 'สุดหล่อ เกินใคร ใจเกินร้อย';
  public compid = 'VMD';
  public branchid = 'VMD001';
  public branchconfig: any;
  public compname = 'บริษัท วีเอ็มดี ออโต้เซลส์ จำกัด';
  public branchname = 'พิษณุโลก';
  public vatrate = 0;
  public carbrandaccesslist = ['B02'];
  // public apiurl = 'http://192.168.5.38:8300/api/';
  public apiurl = 'http://localhost:8300/api/';
  //public apiurl = 'http://localhost:85/api/';
  // // public apiuserurl = 'http://localhost:44400/api/';
  // public apiuserurl = 'http://192.168.5.38:81/IUserControlAPI/api/';


  public apiuserurl = '';

  public spinconfig: any = { type: 'timer', message: 'Loading...' };
  // tslint:disable-next-line:max-line-length
  public animationlist: Array<string> = ['timer', 'ball-scale-ripple-multiple', 'ball-fall', 'ball-pulse', 'ball-spin-clockwise-fade-rotating', 'line-scale-party', 'square-jelly-box', 'pacman'];

  public errorsidebarheader: string = '';
  public errorsidebardisplay: boolean = false;
  public mastermenudisplay: boolean = false;
  public errorsidebarmsg: string = '';
  public errorsidebarmsgarray = [];
  public errorsidebarmsg2: string = '';
  public gridrow = 11;

  public menutoggledisplay: boolean = true;
  public showmainbg: boolean = true;
  public currentdate: string = '';

  //message
  public Add = 'ADD';
  public Edit = 'EDIT';
  public Delete = 'DEL';
  public Cancel = 'CANCEL';
  public View = 'VIEW';
  public SaveMessage = 'บันทึกข้อมูลสำเร็จ';
  public enkey = CryptoJS.enc.Utf8.parse('7061737323313233');
  public eniv = CryptoJS.enc.Utf8.parse('7061737323313233');

  //
  public msAfterSlide = 600;

  constructor(private spinner: NgxSpinnerService, private messageService: MessageService, private http: HttpClient, private router: Router) {
    //console.log('apphelper');
    let paramChk = this.Decode(localStorage.getItem('apiurl_GuitarChord'));
    //console.log(paramChk);
    if (paramChk.success) {
      this.apiurl = paramChk.decodeText
    }

    paramChk = this.Decode(localStorage.getItem('apiuserurl_GuitarChord'));
    //console.log(paramChk);
    if (paramChk.success) {
      this.apiuserurl = paramChk.decodeText
    }

    paramChk = this.Decode(localStorage.getItem('currentdate_GuitarChord'));
    //console.log(paramChk);
    if (paramChk.success) {
      this.currentdate = paramChk.decodeText
    }
    //console.log(this.currentdate);

    //console.log(this.apiurl + ' ' + this.apiuserurl);
  }


  // GetConfig() {
  //   return new Promise<void>((resolve, reject) => {
  //     let result = this.ApiGet('./appconfig.json');
  //     console.log(result);
  //     this.apiurl = result.apiurl;
  //     this.apiuserurl = result.apiuserurl;
  //     console.log(this.apiurl + ' ' + this.apiuserurl);
  //     resolve();
  //   });
  // }

  ClearBackground() {
    this.loginBg = '';
    this.mainBg = '';
    this.effect = '';
    this.isLoadBg = false;
    this.showSnow = false;
    this.showRain = false;
    this.showGhost = false;
  }

  CloneObject(src) {
    return JSON.parse(JSON.stringify(src));
  }

  SetGridPage(grid: any, data: any) {
    //console.log(this.thailocationsearchtable.first);
    // if (this.thailocationsearchtable.first >= this._dataList.length && this.thailocationsearchtable.first > 0) {
    //   console.log(this.thailocationsearchtable.first - this.thailocationsearchtable.rows);
    //   this.thailocationsearchtable.first = this.thailocationsearchtable.first - this.thailocationsearchtable.rows;
    // }
    //console.log(grid);

    if (!this.IsNull(grid)) {
      while (grid.first >= data.length && grid.first > 0) {
        grid.first = grid.first - grid.rows;
      }
    }
  }

  public Sort(list, property, direction = 'asc', property2 = undefined) {
    if (direction == 'asc') {
      if (property2 != undefined) {
        return _.sortBy((_.sortBy(list, property)), property2);
      } else {
        return _.sortBy(list, property);
      }
    } else {
      if (property2 != undefined) {
        return _.sortBy((_.sortBy(list, property).reverse()), property2);
      } else {
        return _.sortBy(list, property).reverse();
      }
    }
  }

  public BahtText(amount: number): string {
    return THBText(amount);
  }

  public SetBranchConfig() {
    this.branchconfig = JSON.parse(localStorage.getItem('branchconfig_GuitarChord'));
  }

  public Encryption(text: string): any {
    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), this.enkey,
      {
        keySize: 128 / 8,
        iv: this.eniv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    return encrypted;
  }

  public Decryption(encryp: any): any {
    let decrypted = CryptoJS.AES.decrypt(encryp, this.enkey, {
      keySize: 128 / 8,
      iv: this.eniv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted;
  }

  public CheckParams(param: any, page: string = ''): any {
    if (!this.IsNull(param)) {
      let paramChk = this.Decode(param);
      if (!paramChk.success) {
        localStorage.setItem("errortext_GuitarChord", paramChk.decodeText);
        this.router.navigate(['frmerror']);
        return null;
      }
      //console.log(paramChk.decodeText);
      return JSON.parse(paramChk.decodeText);
    } else {
      if (page.length > 0)
        this.router.navigate([page]);

      return null;
    }

  }

  public Encode(text: string): any {
    //return btoa(unescape(encodeURIComponent(text)));
    //console.log(encodeURI(text))
    ////return encodeURI(text);
    //return text;
    //console.log(text);
    return CryptoJS.AES.encrypt(JSON.stringify(text), 'secret key 4256');
  }

  public Decode(text: any): any {
    //console.log(text);
    try {
      //console.log(decodeURI(text))
      //return {success : true , decodeText:  decodeURIComponent(escape(window.atob(text))) };
      ////return  {success : true , decodeText:  decodeURI(text) };
      //return  {success : true , decodeText:  text };
      var bytes = CryptoJS.AES.decrypt(text.toString(), 'secret key 4256');
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      //console.log( decryptedData);
      return { success: true, decodeText: decryptedData };
    }
    catch {
      return { success: false, decodeText: 'ไม่พบ URL ที่ต้องการ' };
    }

  }

  public sendSubscriptionToTheServer(subscription: PushSubscription) {
    console.log('sub add');
    console.log(subscription);
    this.http.post('http://192.168.5.34:8300/api/notification/add', subscription).subscribe();
  }

  // public ApiGetObserve(url: string): Observable<any> {
  //   return this.httpObserve.get(url).map(response => { return response.json(); });
  // }

  public ApiGet(url: string): any {
    //     return this._httpClient.get(url, { responseType: 'blob' as 'json' })
    //     .map(res => {
    //     return new Blob([res], { type: 'application/pdf', });
    // });
    //console.log(url);
    this.errorsidebardisplay = false;

    const _promise = new Promise((resolve, reject) => {
      //console.log(url);
      this.http.get(url).subscribe(dataapi => {
        //console.log(dataapi);
        resolve(dataapi);
      }, err => {
        // console.log(err);
        resolve(err);
      });
    });

    return _promise;
  }

  public ApiGetBlob(url: string): any {
    const _promise = new Promise((resolve, reject) => {
      //console.log('http://192.168.5.34:8300/api/car/list');
      this.http.get(url).subscribe(dataapi => {
        resolve(dataapi);
      }, err => {
        // console.log(err);
        resolve(err);
      });
    });

    return _promise;
  }

  public ApiPost(url: string, param: any): any {
    this.errorsidebardisplay = false;

    const _promise = new Promise((resolve, reject) => {
      //console.log(url);
      this.http.post(url, param, { headers: new HttpHeaders({ timeout: `${10000}` }) })
        .subscribe(dataapi => {
          //console.log(dataapi);
          resolve(dataapi);
        }, err => {
          // console.log(err);
          resolve(err);
        });
    });

    return _promise;
  }

  public ApiGetListResult(result: any, hideload: boolean = true): any {
    //console.log(result);
    if ((!result.ok && result.ok != null) || !result.success) {
      //console.log(result.message.indexOf("<br/>")); 
      if (result.message != null)
        if (result.message.indexOf("<br/>") <= 0) {
          this.errorsidebarmsg = result.message + ' | ' + this.NullToString(result.query);
          this.errorsidebarmsgarray = [];
        } else {
          this.errorsidebarmsgarray = result.message.split("<br/>");
          this.errorsidebarmsg = '';
        }

      //console.log(this.errorsidebarmsg.length);
      //console.log(this.errorsidebarmsg);
      this.HideLoading();
      this.errorsidebardisplay = true;
      return { success: false };
    }
    //console.log(dataapi);
    if (hideload)
      this.HideLoading();

    return { success: true, data: result.data };
  }

  public ApiPostDBResult(result: any): any {
    if ((!result.ok && result.ok != null) || !result.success) {
      this.ShowError(result.message, result.query);
      this.HideLoading();
      return { success: false };
    }

    if (!this.IsNull(result.successlog) && !result.successlog) {
      this.ShowError('log error : ' + result.messagelog, result.querylog);
      this.HideLoading();
      return { success: false };
    }

    this.HideLoading();
    if (!this.IsNull(result.data))
      return { success: true, data: result.data, message: result.message };
    else
      return { success: true, message: result.message };
  }

  public ShowToast(message: string, messagetye: ToastMessage = ToastMessage.info, life: number = 3000) {
    switch (messagetye) {
      case ToastMessage.info:
        this.messageService.add({ key: 'nr', severity: 'info', summary: 'Info Message', detail: message, life: life });
        break;
      case ToastMessage.success:
        this.messageService.add({ key: 'nr', severity: 'success', summary: 'Success Message', detail: message, life: life });
        break;
      case ToastMessage.error:
        this.messageService.add({ key: 'nr', severity: 'error', summary: 'Error Message', detail: message, life: life });
        break;
      case ToastMessage.warning:
        this.messageService.add({ key: 'nr', severity: 'warn', summary: 'Warning Message', detail: message, life: life });
        break;
      default:
        break;
    }
  }

  public ShowLoadingAutoHide(messagetye: ModalMessage = ModalMessage.empty, interval: number = 2000) {
    switch (messagetye) {
      case ModalMessage.empty:
        this.spinconfig.message = '';
        break;
      case ModalMessage.loading:
        this.spinconfig.message = 'Loading...';
        break;
      case ModalMessage.saving:
        this.spinconfig.message = 'Saving...';
        break;
      case ModalMessage.processing:
        this.spinconfig.message = 'Processing...';
        break;
      default:
        break;
    }

    this.spinconfig.type = this.animationlist[Math.floor(Math.random() * 7)];

    // console.log(this.spinconfig);

    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, interval);
  }

  public async CurrentDateServerFormat() {
    let result = await this.ApiGet(this.apiurl + 'date/currentdate');
    return moment(result).format('DD/MM/YYYY');
  }

  public CurrentDate(): string {
    return this.currentdate;
    //return moment().format('YYYYMMDD');
  }

  public CurrentDateFormat(): string {
    console.log(moment(this.currentdate).format('DD/MM/YYYY'));
    return moment(this.currentdate).format('DD/MM/YYYY');
  }

  public CurrentYYYYDate(): string {
    let s = this.currentdate;

    return moment(s).format('YYYY');
    //return moment().format('YYYYMMDD');
  }

  public CurrentDateTime(): string {
    return moment().format('YYYYMMDDHHmmss');
  }

  public DateTimeSaveDB(chk: any): string {
    if (this.IsNull(chk))
      return '';

    return moment(chk).format('YYYYMMDD');
  }

  //sang
  public DateYearSaveDB(chk: any): string {
    if (this.IsNull(chk))
      return '';

    return moment(chk).format('YYYY');
  }
  public DateMonthsSaveDB(chk: any): string {
    if (this.IsNull(chk))
      return '';

    return moment(chk).format('MM');
  }
  //sang



  public DateFormatSaveDB(chk: string): string {
    if (this.IsNull(chk))
      return '';

    return chk.substr(6, 4) + chk.substr(3, 2) + chk.substr(0, 2);
  }

  public FormatDate(chk: any): any {
    ///console.log(chk);
    if (this.IsNullOrEmty(chk))
      return '';

    try {
      //console.log(moment(chk).format('DD/MM/YYYY'));
      return moment(chk).format('DD/MM/YYYY');
    } catch (e) {
      return moment().format('DD/MM/YYYY');
    }

  }

  public DateDBToDateTime(chk: string): any {
    //console.log(chk);
    if (chk == '' || chk == null || chk == undefined)
      return null;

    try {
      //console.log(moment(chk).format('DD/MM/YYYY'));
      return new Date(moment(chk).format('MM/DD/YYYY'));
    } catch (e) {
      return moment();
    }

  }

  public DbToBool(chk: any): boolean {
    return chk == "Y" || chk == 'y' || chk == true || chk == 'true';
  }

  public BoolToDb(chk: boolean): string {
    if (chk)
      return 'Y';
    else
      return 'N';
  }

  public IsNull(chk: any): boolean {
    if (chk == null) {
      return true;
    }

    if (chk === null) {
      return true;
    }

    if (typeof chk === 'undefined') {
      return true;
    }

    return false;
  }

  public IsNullOrEmty(chk: any): boolean {
    if (chk == null) {
      return true;
    }

    if (chk === null) {
      return true;
    }

    if (typeof chk === 'undefined') {
      return true;
    }

    if ((typeof chk) == 'string')
      if (chk.trim() == '') {
        return true;
      }

    return false;
  }

  public ToNumber(numberText: any): number {
    try {
      let number = Number((String(numberText).replace(new RegExp(',', 'g'), '')));
      if (isNaN(number))
        return 0;
      else
        return number;
    } catch (err) {
      //console.log('number error');
      return 0;
    }
  }

  public NullToString(text: any): string {
    return (this.IsNull(text) ? '' : text);
  }

  public InitFormatNumber(list: any) {
    list.forEach(element => {
      element.FormatText();
    });
  }

  public Sum(items, prop) {
    //console.log(items);
    if (items == null) {
      return 0;
    }

    return items.reduce(function (a, b) {
      //console.log(a);
      //console.log(b);
      b[prop] = Number((String(b[prop]).replace(new RegExp(',', 'g'), '')));
      if (isNaN(b[prop]))
        b[prop] = 0;

      return b[prop] == null ? a : a + b[prop];
    }, 0);
  };
  
  ShowSpin() {
    return new Promise(resolve => setTimeout(() => { this.spinner.show(); }, 100));
  }

  async ShowLoading(messagetye: ModalMessage = ModalMessage.empty, random: boolean = false) {
    //console.log('show');

    switch (messagetye) {
      case ModalMessage.empty:
        this.spinconfig.message = '';
        break;
      case ModalMessage.loading:
        this.spinconfig.message = 'Loading...';
        break;
      case ModalMessage.saving:
        this.spinconfig.message = 'Saving...';
        break;
      case ModalMessage.deleting:
        this.spinconfig.message = 'Deleting...';
        break;
      case ModalMessage.processing:
        this.spinconfig.message = 'Processing...';
        break;
      default:
        break;
    }

    if (random)
      this.spinconfig.type = this.animationlist[Math.floor(Math.random() * 7)];

    //console.log(this.spinconfig.type);
    this.spinner.show();

  }

  public async LoadBackGround() {

    if (!this.isLoadBg) {
      this.isLoadBg = true;
      this.loginBg = localStorage.getItem('loginBg_GuitarChord');
      this.mainBg = localStorage.getItem('mainBg_GuitarChord');
      this.effect = localStorage.getItem('effect_GuitarChord');

      switch (this.effect) {
        case "SNOW":
          this.showSnow = true;
          break;
        case "RAIN":
          this.showRain = true;
          break;
        case "GHOST":
          this.showGhost = true;
          break;
        default:
          break;
      }
      //console.log(this.mainBg);
    }

    //console.log(this.loginBg + ' ' + this.mainBg)
  }

  public getBackgroundImageLogin(): string {
    //console.log(this.CurrentDate().substr(4, 4));
    // switch (this.CurrentDate().substr(4, 4)) {
    //   case '1225': {
    //     //console.log('txt');
    //     return "url('../../assets/images/festival/christmas-3884891_1280.jpg')";
    //   }
    //   case '1226': {
    //     //console.log('txt');
    //     return "url('../../assets/images/festival/christmas-3884891_1280.jpg')";
    //   }
    //   case '1227': {
    //     //console.log('txt');
    //     return "url('../../assets/images/festival/christmas-3884891_1280.jpg')";
    //   }
    //   default: {
    //     // return "url('../../assets/images/lgBackgroundImg.png')";
    //     return "url('../../assets/images/festival/christmas-3884891_1280.jpg')";
    //   }
    // }

    return this.loginBg;
  }

  public getBackgroundImage(): string {
    //console.log(this.CurrentDate().substr(4, 4));
    // switch (this.CurrentDate().substr(4, 4)) {
    //   case '1225': {
    //     //console.log('txt');
    //     return "url('../../assets/images/festival/733818_christmas-night-wallpaper.jpg')";
    //   }
    //   case '1226': {
    //     //console.log('txt');
    //     return "url('../../assets/images/festival/christmas-3864540_1280.jpg')";
    //   }
    //   case '1227': {
    //     //console.log('txt');
    //     return "url('../../assets/images/festival/733818_christmas-night-wallpaper.jpg')";
    //   }
    //   default: {
    //     // return "url('')"
    //     return "url('../../assets/images/festival/733818_christmas-night-wallpaper.jpg')";
    //   }
    // }

    return this.mainBg;
  }

  ShowError(message: string, message2: string = '') {
    this.errorsidebardisplay = true;

    if (message.indexOf("<br/>") <= 0) {
      this.errorsidebarmsg = message;
      this.errorsidebarmsgarray = [];
    } else {
      this.errorsidebarmsgarray = message.split("<br/>");
      this.errorsidebarmsg = '';
    }

    this.errorsidebarmsg2 = message2;
  }

  HideLoading() {
    //console.log('hide');

    this.spinner.hide();
  }

  RecNoIndex: number;

  ResetRecNoIndex() {
    this.RecNoIndex = 0;
  }

  GenRecNo(type: string = '') {
    if (this.IsNull(this.RecNoIndex))
      this.ResetRecNoIndex();

    this.RecNoIndex += 1;

    switch (type) {
      default:
        return this.CurrentDateTime() + this.RecNoIndex.toString().padStart(3, '0') + UUID.UUID();
    }
  }

  PermissionDummy() {
    return { success: true, permission: { AddPermissionBool: true, EditPermissionBool: true, DelPermissionBool: true, CancelPermissionBool: true, PrintPermissionBool: true, ApprovePermissionBool: true, EditDatePermissionBool: true } };
  }
}

export enum ModalMessage {
  empty = 0,
  loading = 1,
  saving = 2,
  processing = 3,
  deleting = 4
}

export enum ToastMessage {
  success = 0,
  warning = 1,
  error = 2,
  info = 3
}


