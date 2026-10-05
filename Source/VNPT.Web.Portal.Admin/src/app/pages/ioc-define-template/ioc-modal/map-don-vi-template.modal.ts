import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage, BaseService, HttpService, ShowDialogService } from 'src/app/services';
import { Router } from '@angular/router';

import * as _ from "lodash";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
declare var $: any;
@Component({
    selector: "map-don-vi-template-modal",
    templateUrl: './map-don-vi-template.modal.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../ioc-list-template.component.scss']
})
export class MapDonViTemplateModal implements OnInit {
    context: any;
    // formData: FormGroup;
    organizations: any;
    documentTemplates: any;
    defaultOrganization: any;
    defaultOrganizationChuQuan: any;
    defaultDocumentTemplate: any;
    sendData: any = {};
    listOrganizationsNhapLieu: any;
    listDocumentKhaiThac: any;
    listDocumentChuQuan: any;
    listDocumentNhapLieu: any;
    listTongHopDocument: any = [];
    listTongHopOrganizationsNhapLieu: any = [];
    selectedDocument: any = [];
    listSelectedDocument: any = [];
    code: any = "";
    header: any = "";
    valid = 0;
    isDisabled: boolean = false;
    listTongHopDocumentChuQuan: any = [];
    listSelectedDocumentChuQuan: any = [];
    listSelectedOrganizationsNhapLieu: any = [];
    changeTab: any = "1";
    fields: any = [];
    kt_fields: any = [];
    defaultField: any;
    defaultField_kt: any;
    constructor(
        //nhan du lieu tu trang cha
        public http: HttpService,
        public formBuilder: FormBuilder,
        private router: Router,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public message: MessageService,
        private confirmationService: ConfirmationService
    ) {

        this.context = this.config.data;
    }

    ngOnInit() {
        this.getIocFields();
        this.GetListDonVi();
        this.loadData();
        // this.formData = this.formBuilder.group({
        //     organization_id: ""
        // });

        $(function () {
            var idTongHopTemplate = "#tong-hop-template";
            var dialog = $(idTongHopTemplate).closest(".modal-dialog")[0];
            $(dialog).addClass("modal-dialog-9");
            // set chiều cao cho modal
            $(idTongHopTemplate).height(window.innerHeight - 350);
            window.onresize = (e: any) => {
                $(idTongHopTemplate).height(window.innerHeight - 350);
            };

            var idTemplateChuQuan = "#danh-sach-template-chu-quan";
            $(idTemplateChuQuan).height(window.innerHeight - 350);
            window.onresize = (e: any) => {
                $(idTemplateChuQuan).height(window.innerHeight - 350);
            };

            var idTemplateKhaiThac = "#danh-sach-template";
            $(idTemplateKhaiThac).height(window.innerHeight - 350);
            window.onresize = (e: any) => {
                $(idTemplateKhaiThac).height(window.innerHeight - 350);
            };

            var idTemplateChuQuan = "#danh-sach-template-nhap-lieu";
            $(idTemplateChuQuan).height(window.innerHeight - 300);
            window.onresize = (e: any) => {
                $(idTemplateChuQuan).height(window.innerHeight - 300);
            };

            var idTongHop = "#danh-sach-tong-hop-chu-quan"
            $(idTongHop).height(window.innerHeight - 350);
            window.onresize = (e: any) => {
                $(idTongHop).height(window.innerHeight - 350);
            };

            var idKhaiThac = "#danh-sach-tong-hop-khai-thac"
            $(idKhaiThac).height(window.innerHeight - 350);
            window.onresize = (e: any) => {
                $(idKhaiThac).height(window.innerHeight - 350);
            };

            var idDonVi = "#danh-sach-tong-hop-don-vi"
            $(idDonVi).height(window.innerHeight - 300);
            window.onresize = (e: any) => {
                $(idDonVi).height(window.innerHeight - 300);
            };
        });

        var that = this;

        // $('a[data-toggle="tab"]').on('shown.bs.tab', function (e: { target: any; }) {
        //     var target = $(e.target).attr("href") // activated tab
        //     that.ChangTab(target);
        // });
    }

    ChangTab(e: any) {
        this.changeTab = e.index + 1;
        // if (target == "#donvichuquan") {
        //     this.changeTab = "1";
        // }
        // else {
        //     if (target == "#donvikhaithac") {
        //         this.changeTab = "2";
        //     }
        //     else {
        //         this.changeTab = "3";
        //     }

        // }
    }

    getIocFields() {
        var data = {
        };
        this.http.post('IOC/GetListPropertyField', data, (kq: { Code: number; Result: any; }) => {
            if (kq.Code == 200) {
                this.fields = kq.Result;
                this.fields.unshift({ Name: '--Tất cả lĩnh vực--', Id: null });
                this.kt_fields = this.fields;
            }
        }, () => {
        }
        );
    }

    onChangeField(value: { value: { Id: any; }; }) {
        this.defaultField = { Id: value.value.Id };
        this.loadDataChuQuan();
    }

    onChangeField_kt(value: { value: { Id: any; }; }) {
        this.defaultField_kt = { Id: value.value.Id };
        this.loadDataKhaiThac();
    }

    GetListDonVi() {
        var data = {
        };
        this.http.post('IOC/GetListDonVi', data, (kq: { Code: number; Result: any; }) => {
            if (kq.Code == 200) {
                this.organizations = kq.Result;
                this.listOrganizationsNhapLieu = kq.Result;
                if (this.organizations.length > 0) {
                    this.defaultOrganization = this.organizations[0].Id;
                    this.defaultOrganizationChuQuan = this.organizations[0].Id;
                    this.loadSingleData();
                    this.loadSingleDataChuQuan();
                }
            }
        }, (error: any) => {
        }
        );
    }

    onChangeOrganization(value: { value: { Id: any; }; }) {
        this.defaultOrganization = value.value.Id;
        this.loadSingleData();
    }

    public loadData() {
        var fieldId = this.defaultField == undefined ? null : this.defaultField.Id;
        //use dataSearch for packaging the data
        var dataSearch = {
            FieldId: fieldId
        };

        this.http.post('IOC/GetListBieuMau', dataSearch, (data1: { Code: number; Result: any; }) => {
            if (data1.Code == 200) {
                this.listDocumentChuQuan = data1.Result;
                this.listDocumentKhaiThac = data1.Result;
                this.documentTemplates = data1.Result;
                if (this.documentTemplates.length > 0) {
                    this.defaultDocumentTemplate = this.documentTemplates[0].Id;
                    this.loadDonViNhapLieu();
                }
            }
        }, (error: any) => {
        }
        );
    }

    public loadDataChuQuan() {
        var fieldId = this.defaultField == undefined ? null : this.defaultField.Id;
        //use dataSearch for packaging the data
        var dataSearch = {
            FieldId: fieldId
        };

        this.http.post('IOC/GetListBieuMau', dataSearch, (data1: { Code: number; Result: any; }) => {
            if (data1.Code == 200) {
                this.listDocumentChuQuan = data1.Result;
            }
        }, (error: any) => {
        }
        );
    }

    public loadDataKhaiThac() {
        var fieldId = this.defaultField_kt == undefined ? null : this.defaultField_kt.Id;
        //use dataSearch for packaging the data
        var dataSearch = {
            FieldId: fieldId
        };

        this.http.post('IOC/GetListBieuMau', dataSearch, (data1: { Code: number; Result: any; }) => {
            if (data1.Code == 200) {
                this.listDocumentKhaiThac = data1.Result;
            }
        }, (error: any) => {
        }
        );
    }

    loadSingleData() {
        var sendData = {
            OrganizationId: this.defaultOrganization
        }

        this.http.post('IOC/GetBieuMauTheoDonVi', sendData, (data1: { Code: number; Result: { Code: any; Header: any; listTongHop: any; } | null; }) => {
            if (data1.Code == 200) {
                if (data1.Result != null) {
                    this.code = data1.Result.Code;
                    this.header = data1.Result.Header;
                    this.listTongHopDocument = data1.Result.listTongHop;
                    this.listSelectedDocument = data1.Result.listTongHop;
                }
            }
        }, (error: any) => {
        }
        );
    }

    cancel() {
        this.ref.close();
    }
    data: any = {};

    submit() {
        this.valid = 0;

        if (this.changeTab == "1") // đơn vị chủ quản
        {
            if (this.listTongHopDocumentChuQuan.length <= 0) {
                $('#listDocumentChuQuanError').html('Vui lòng chọn biểu mẫu!');
                this.valid++;
            }
            else {
                $('#listDocumentChuQuanError').html('');
                this.valid = this.valid > 0 ? this.valid : 0;
            }

            if (this.valid <= 0) {
                this.isDisabled = true;

                this.data.Id = this.defaultOrganizationChuQuan;
                this.data.listTongHop = this.listTongHopDocumentChuQuan;
                var sendData = {
                    Json: JSON.stringify(this.data)
                }
                this.http.post('IOC/SaveBieuMauDonViChuQuan', sendData, (data1: { Code: number; }) => {
                    if (data1.Code == 200) {
                        this.isDisabled = false;
                        this.message.add({ severity: 'success', summary: 'Error', detail: "Thêm thành công!" });
                        //this.dialog.close();
                    } else {
                        this.isDisabled = false;
                        this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
                    }
                }, (error: any) => {
                    this.isDisabled = false;
                    this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
                }
                );
            }
        }
        else {
            if (this.changeTab == "2") // đơn vị khai thác
            {
                if (this.listTongHopDocument.length <= 0) {
                    $('#listDocumentError').html('Vui lòng chọn biểu mẫu!');
                    this.valid++;
                }
                else {
                    $('#listDocumentError').html('');
                    this.valid = this.valid > 0 ? this.valid : 0;
                }

                if (this.valid <= 0) {
                    this.isDisabled = true;

                    this.data.Id = this.defaultOrganization;
                    this.data.listTongHop = this.listTongHopDocument;
                    var sendData = {
                        Json: JSON.stringify(this.data)
                    }
                    this.http.post('IOC/SaveBieuMauDonVi', sendData, (data1: { Code: number; }) => {
                        if (data1.Code == 200) {
                            this.isDisabled = false;
                            this.message.add({ severity: 'success', summary: 'Error', detail: "Thêm thành công!" });
                            //this.dialog.close();
                        } else {
                            this.isDisabled = false;
                            this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
                        }
                    }, (error: any) => {
                        this.isDisabled = false;
                        this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
                    }
                    );
                }
            }
            else // Đơn vị nhập liệu
            {
                if (this.listTongHopOrganizationsNhapLieu.length <= 0) {
                    $('#listOrganizationError').html('Vui lòng chọn đơn vị!');
                    this.valid++;
                }
                else {
                    $('#listOrganizationError').html('');
                    this.valid = this.valid > 0 ? this.valid : 0;
                }

                if (this.valid <= 0) {
                    this.isDisabled = true;

                    this.data.Id = this.defaultDocumentTemplate;
                    this.data.ListOrganization = this.listTongHopOrganizationsNhapLieu;
                    var sendData = {
                        Json: JSON.stringify(this.data)
                    }
                    console.log("adsfasdfasdfasdf" + JSON.stringify(this.data));
                    this.http.post('IOC/SaveDonViNhapLieu', sendData, (data1: { Code: number; }) => {
                        if (data1.Code == 200) {
                            this.isDisabled = false;
                            this.message.add({ severity: 'success', summary: 'Error', detail: "Thêm thành công!" });
                            //this.dialog.close();
                        } else {
                            this.isDisabled = false;
                            this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
                        }
                    }, (error: any) => {
                        this.isDisabled = false;
                        this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
                    }
                    );
                }
            }
        }
    }

    getHeight() {
        return window.innerHeight - 170;
    }

    // onChangeField(value) {
    //     this.data.FieldId = value.value.Id;
    // }

    onChangeDocument(list: { value: string | any[] | undefined; }) {
        this.listTongHopDocument = [];
        if (list.value != undefined && list.value.length > 0) {
            this.listTongHopDocument = list.value;
        }
    }

    removeLi(event: any, id: any) {
        this.listTongHopDocument = _.filter(this.listTongHopDocument, row => row.Id != id);
        this.listSelectedDocument = _.filter(this.listSelectedDocument, row => row.Id != id);
        event.target.closest("li").remove();
    }

    onChangeDocumentChuQuan(list: any) {
        var that = this;
        let listTongHop = this.listTongHopDocumentChuQuan;

        let notIntersection = this.listTongHopDocumentChuQuan.filter((x: any) => !list.value.includes(x));

        let deleteDocument = false;

        if (notIntersection.length > 0) {
            notIntersection.forEach((element: { OrganizationId: any; }) => {
                if (element.OrganizationId == this.defaultOrganizationChuQuan) {
                    deleteDocument = true;
                    return;
                }
            });
            if (deleteDocument) {

                this.confirmationService.confirm({
                    message: 'Bạn có chắc chắn xóa biểu mẫu này không?',
                    accept: (result: any) => {
                        if (result) {
                            notIntersection.forEach((element: { OrganizationId: any; Id: string; }) => {
                                if (element.OrganizationId == that.defaultOrganizationChuQuan) {

                                    var templistTongHopDocumentChuQuan = that.listTongHopDocumentChuQuan.filter(
                                        (elem: { Id: any; }) => elem.Id != element.Id
                                    );

                                    that.listTongHopDocumentChuQuan = [];
                                    that.listTongHopDocumentChuQuan = templistTongHopDocumentChuQuan;

                                    var templistSelectedDocumentChuQuan = that.listSelectedDocumentChuQuan.filter(
                                        (elem: { Id: any; }) => elem.Id != element.Id
                                    );

                                    that.listSelectedDocumentChuQuan = [];
                                    that.listSelectedDocumentChuQuan = templistSelectedDocumentChuQuan;
                                    $('#' + element.Id).closest('li').remove();

                                    that.deleteItemConfirm(element.Id);
                                }
                            });
                        } else {
                            that.listTongHopDocumentChuQuan = [];
                            that.listTongHopDocumentChuQuan = listTongHop;
                            that.listSelectedDocumentChuQuan = [];
                            that.listSelectedDocumentChuQuan = listTongHop;
                            return;
                        }
                    }
                });
            }
            else {
                this.listTongHopDocumentChuQuan = [];
                if (list.value != undefined && list.value.length > 0) {
                    this.listTongHopDocumentChuQuan = list.value;
                }
            }
        }
        else {
            this.listTongHopDocumentChuQuan = [];
            if (list.value != undefined && list.value.length > 0) {
                this.listTongHopDocumentChuQuan = list.value;
            }
        }
    }

    deleteItemConfirm(documentTemplateId: any) {
        var data = {
            DocumentTemplateId: documentTemplateId
        }
        this.http.post('IOC/DeleteDocumentTemplate', data, (data: { Code: number; }) => {
            if (data.Code == 200) {
                this.message.add({ severity: 'success', summary: 'Error', detail: "Thành công!" });
            } else {
                this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
            }
        },
            (error: any) => {
                this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
            }
        );
    }

    removeLiChuQuan(event: any, id: any) {
        this.listTongHopDocumentChuQuan = _.filter(this.listTongHopDocumentChuQuan, row => row.Id != id);
        this.listSelectedDocumentChuQuan = _.filter(this.listSelectedDocumentChuQuan, row => row.Id != id);
        event.target.closest("li").remove();
    }

    onChangeOrganizationChuQuan(value: { value: { Id: any; }; }) {
        this.defaultOrganizationChuQuan = value.value.Id;
        this.loadSingleDataChuQuan();
    }

    loadSingleDataChuQuan() {
        var sendData = {
            OrganizationId: this.defaultOrganizationChuQuan
        }

        this.http.post('IOC/GetBieuMauTheoDonViChuQuan', sendData, (data1: { Code: number; Result: { Code: any; Header: any; listTongHop: any; } | null; }) => {
            if (data1.Code == 200) {
                if (data1.Result != null) {
                    this.code = data1.Result.Code;
                    this.header = data1.Result.Header;
                    this.listTongHopDocumentChuQuan = data1.Result.listTongHop;
                    this.listSelectedDocumentChuQuan = data1.Result.listTongHop;
                }
            }
        }, (error: any) => {
        }
        );
    }

    onChangeDocumentNhapLieu(list: { value: string | any[] | undefined; }) {
        this.listTongHopOrganizationsNhapLieu = [];
        if (list.value != undefined && list.value.length > 0) {
            this.listTongHopOrganizationsNhapLieu = list.value;
        }
    }

    onChangeDocumentTemplate(value: { value: { Id: any; }; }) {
        this.defaultDocumentTemplate = value.value.Id;
        this.loadDonViNhapLieu();
    }

    loadDonViNhapLieu() {
        var sendData = {
            DocumentTemplateId: this.defaultDocumentTemplate
        }

        this.http.post('IOC/GetDonViNhapLieu', sendData, (data1: any) => {
            if (data1.Code == 200) {
                if (data1.Result != null) {
                    this.code = data1.Result.Code;
                    this.header = data1.Result.Header;
                    this.listTongHopOrganizationsNhapLieu = data1.Result.ListOrganization;
                    this.listSelectedOrganizationsNhapLieu = data1.Result.ListOrganization;
                }
            }
        }, (error: any) => {
        }
        );
    }

    removeLiNhapLieu(event: any, id: any) {
        this.listTongHopOrganizationsNhapLieu = _.filter(this.listTongHopOrganizationsNhapLieu, row => row.Id != id);
        this.listSelectedOrganizationsNhapLieu = _.filter(this.listSelectedOrganizationsNhapLieu, row => row.Id != id);
        event.target.closest("li").remove();
    }
}
