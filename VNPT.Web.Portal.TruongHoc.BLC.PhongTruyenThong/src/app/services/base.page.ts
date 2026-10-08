import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ResultModel } from '../models/resultModel';
import { HttpService } from './http.service';
import { Subscription } from 'rxjs';
import moment from 'moment';


@Injectable()
export abstract class BasePage implements OnInit, OnDestroy {
    public permissions: any[];
    public params: any;
    public queryParams: any;
    public parameter: any;
    public setting: any[] = [];
    private routeSubParent: Subscription | undefined;
    public titlePage: any;
    public pageTitle: any = "";
    public otherRole: any = "";
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService
    ) {
        this.permissions = [];
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
        });
    }
    ngOnDestroy(): void {
        if (this.routeSubParent) {
            this.routeSubParent.unsubscribe();
        }
    }
    async ngOnInit() {
        this.routeSubParent = this.route.params.subscribe((params) => {
            this.params = params;
            this.getPermission();
        });
        
    }
    /**
     * Chạy khi load xong thay thế cho ngOnInit
     */
    abstract onInit(): void;

    /**Chạy nếu như check permission thành công */
    abstract loadPage(): void;

    setDate(event: any, name: any) {
        var value = (event.target.value);
        if (value && value.length == 6) {
            var item = moment(value, 'DDMMYY');
            if (item.isValid()) {
                var that: any = this;
                that[name] = item.toDate();
            }

        }
    }
    async getPermission() {
        var action = this.router.url;
        var data = {
            Action: action
        };
        this.http.post("Menu/CheckPermission", data,
            (kq: ResultModel) => {
                if (kq.Code == 200) {
                    this.permissions = kq.Result.Permissions;
                    this.parameter = kq.Result.Parameter;
                    this.otherRole = kq.Result.OtherRole;
                    try {
                        this.setting = JSON.parse(kq.Result.Description);
                        if (!this.setting) {
                            this.setting = [];
                        }
                    } catch (error) {
                        this.setting = [];
                    }
                    this.loadPage();
                    this.onInit();
                    document.title = this.titlePage = kq.Result.Title;
                } else {
                    this.message.add({ severity: 'error', summary: 'Error', detail: 'Phiên làm việc hết hạn hoặc bạn không có quyền truy cập!' });
                    this.router.navigate(['/login']);
                }
            },
            (error: any) => {
                this.message.add({ severity: 'error', summary: 'Error', detail: "Vui lòng kiểm tra kết nối internet!" });
                console.error(error);
                //this.router.navigate(['/dang-nhap']);
            });
    }
    historyEdit(item: any) {
        window.open(`/#/system/lich-su-nguoi-dung/${item.Id}`, '_blank');
    }
    history(item: any) {
        window.open(`/#/system/lich-su/${item.Id}`, '_blank');
    }
    public checkPermission(command: string): boolean {
        command = command.toLowerCase();
        var fullRole = this.permissions.filter(s => s.Command.toLowerCase() == "fullrole");
        if (fullRole.length > 0) {
            return true;
        }
        var permission = this.permissions.filter(s => s.Command.toLowerCase() == command);
        if (permission.length > 0) {
            return permission[0].Value;
        } else {
            return false;
        }
    }
}
