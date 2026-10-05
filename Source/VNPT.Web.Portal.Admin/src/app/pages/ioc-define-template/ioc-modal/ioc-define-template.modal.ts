import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage, BaseService, HttpService, ShowDialogService } from 'src/app/services';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CookieService } from "ngx-cookie-service";

import {MessageService} from 'primeng/api';

declare var $: any;
@Component({
    selector: "ioc-define-template-modal",
    templateUrl: './ioc-define-template.modal.html',
    styleUrls: ['../ioc-list-template.component.scss'],
    providers: [MessageService]
})
export class IocDefineTemplateModal implements OnInit {

    context: any;
    units: any = [];
    fields: any = [];
    defaultUnit: any = {};
    defaultInputValue: any;
    radioSelected: any = "numberRadio";
    listControls: any = [];
    properites: any = [];
    tempProperites: any = [];
    sendData: any = {};
    formData: FormGroup;
    defaultField: any = {};
    frequencies: any = [];
    defaultFrequency: any;

    isDisabled: boolean = false;
    organizations: any;
    defaultOrganization: any;

    valid = 0;

    public formInfo: FormGroup[];

    checkRoleAdminIOC: boolean;
    accumulatedTypes: any = [];

    constructor(
        public router: Router,
        public http: HttpService,
        public formBuilder: FormBuilder,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public messageService: MessageService,
        private cookieService: CookieService,
    ) {
        // this.getTempatles();
        this.context = this.config.data;

        this.GetListDonVi();
        this.getIocFields();
        this.getIocUnits();
        this.getListProperties();
        this.formData = this.formBuilder.group({
            codeId: "",
            headerId: "",
            stepTimeId: "",
            frequency_type_id: "",
            organization_id: "",
            field_id: ""
        });
        this.frequencies = [
            // { Id: 0, Name: "Phút" },
            // { Id: 1, Name: "Giờ" },
            { Id: 2, Name: "Ngày" },
            { Id: 6, Name: "Tuần" },
            { Id: 7, Name: "Giữa tháng" },
            { Id: 3, Name: "Tháng" },
            { Id: 4, Name: "Quý" },
            { Id: 5, Name: "Năm" }
        ];
        this.accumulatedTypes = [{ Id: "Sum", Name: "Tổng" }, { Id: "Avg", Name: "Trung bình" }, { Id: "Empty", Name: "Để trống" }]

        this.sendData.FrequencyTypeId = 3;
        this.defaultFrequency = { Id: 3 }

        this.formInfo = [];

        var mulRole = this.cookieService.get('MulRole');

        this.checkRoleAdminIOC = false;

        if (mulRole != null && mulRole.indexOf(";")) {
            var splitRole = mulRole.split(";");
            splitRole.forEach(element => {
                if (element == "AdminIOC") {
                    this.checkRoleAdminIOC = true;
                }
            });

        }
    }

    ngOnInit(): void {
        this.listControls = [];
        this.defaultInputValue = true;
        if (!this.context.isAdd) {
            this.getTempalteById();
        } else {
            this.sendData = {
                Code: "",
                Header: "",
                FrequencyTypeId: 3,
                FieldId: "",
                OrganizationId: "",
                Properties: this.listControls,
            }
        }

        $(function () {
            var id = "#ioc-define-template";
            var dialog = $(id).closest(".modal-dialog")[0];
            $(dialog).addClass("modal-dialog-9");
            // set chiều cao cho modal
            $(id).height(window.innerHeight - 250);
            window.onresize = (e: any) => {
                $(id).height(window.innerHeight - 250);
            };
        });
    }

    addRow() {
        var tieuChiErrorEl = document.getElementById('tieuChiError');
        if (tieuChiErrorEl != null) {
            tieuChiErrorEl.innerHTML = '';
        }

        var max = 0;
        var maxSort = 1;
        if (this.listControls != null && this.listControls.length > 0) {
            this.listControls.forEach((element: any) => {
                if (element.hiddenNo > max) {
                    max = element.hiddenNo;
                }
                if (element.sort > max) {
                    maxSort = element.sort;
                }
            });
            ++max;
            ++maxSort;
        }
        let newAccu = {
            AccumulatedType: "Sum",
            HideApp: false,
            LinkDetail: ""
        }
        let strAccu = JSON.stringify(newAccu);

        this.listControls.push({
            hiddenNo: max,
            selectedNumber: "optNumber" + max,
            showRecipeInput: true,
            idSTT: "stt_" + max,
            idHeader1: "header_1_" + max,
            idHeader2: "header_2_" + max,
            sort: maxSort,
            stt: "",
            header1: "",
            header2: "",
            type: 0,
            delete: 0,
            recipe: "",
            unit: this.units != null ? this.units[0].Id : "",
            accumulatedType: strAccu,
            accumulatedTypeDto: null,
            hideApp: false,
            linkDetail: ""
        });

        this.formInfo.push(this.formBuilder.group({
            checkValidate: "stt_" + max
        })
        );

        this.formInfo.push(this.formBuilder.group({
            checkValidate: "header_1_" + max
        })
        );

        this.formInfo.push(this.formBuilder.group({
            checkValidate: "header_2_" + max
        })
        );
    }



    deleteRow(index: any, i: number) {
        this.listControls.forEach((element: { hiddenNo: any; delete: number; }) => {
            if (element.hiddenNo == index) {
                element.delete = -1;
            }
        });
        //event.target.closest("tr").remove();

        for (var j = 0; j < this.formInfo.length; j++) {
            if (this.formInfo[j].value.checkValidate.includes("stt_" + i)) {
                this.formInfo.splice(j, 1);
            }
            if (this.formInfo[j].value.checkValidate.includes("header_1_" + i)) {
                this.formInfo.splice(j, 1);
            }
            if (this.formInfo[j].value.checkValidate.includes("header_2_" + i)) {
                this.formInfo.splice(j, 1);
            }
        }
        var tieuChiErrorEl = document.getElementById('tieuChiError');
        if (tieuChiErrorEl != null) {
            if (this.formInfo.length == 0) {
                tieuChiErrorEl.innerHTML = 'Vui lòng thêm tiêu chí!';
            }
            else {
                tieuChiErrorEl.innerHTML = '';
            }
        }

    }

    GetListDonVi() {
        var that = this;

        var data = {
        };
        this.http.post('IOC/GetListDonVi', data, (kq: { Code: number; Result: any; }) => {
            if (kq.Code == 200) {

                that.organizations = kq.Result;
                if (that.organizations.length > 0 && that.context.isAdd) {
                    that.sendData.OrganizationId = this.cookieService.get("TemplateUnitId");
                    that.defaultOrganization = { Id: this.cookieService.get("TemplateUnitId") };
                }
            }
            else {

            }
        }, (error: any) => {

        }
        );
    }

    onChangeOrganization(value: { value: { Id: any; }; }) {
        this.sendData.OrganizationId = value.value.Id;
    }

    getIocUnits() {
        var data = {
        };
        this.http.post('IOC/GetIocUnits', data, (kq: { Code: number; Result: any; }) => {
            if (kq.Code == 200) {
                this.units = kq.Result;
            }
        }, (error: any) => {
        }
        );
    }

    getIocFields() {
        var that = this;
        var data = {
        };
        this.http.post('IOC/GetListPropertyField', data, (kq: { Code: number; Result: any; }) => {
            if (kq.Code == 200) {
                that.fields = kq.Result;
                if (that.fields.length > 0 && that.context.isAdd) {
                    that.sendData.FieldId = that.fields[0].Id;
                    that.defaultField = { Id: that.fields[0].Id };
                }
            }
        }, (error: any) => {
        }
        );
    }

    onTitleRadio(index: any) {
        this.listControls.forEach((element: { hiddenNo: any; showRecipeInput: string; type: number; }) => {
            if (element.hiddenNo == index) {
                element.showRecipeInput = "htc";
                element.type = 3;
            }
        });
    }
    onNumberRadio(index: any) {
        this.listControls.forEach((element: { hiddenNo: any; showRecipeInput: boolean; type: number; }) => {
            if (element.hiddenNo == index) {
                element.showRecipeInput = true;
                element.type = 0;
            }
        });

    }
    onTextRadio(index: any) {
        this.listControls.forEach((element: { hiddenNo: any; showRecipeInput: string; type: number; }) => {
            if (element.hiddenNo == index) {
                element.showRecipeInput = "htc";
                element.type = 1;
            }
        });

    }
    onRecipeRadio(index: any) {
        this.listControls.forEach((element: { hiddenNo: any; showRecipeInput: boolean; type: number; }) => {
            if (element.hiddenNo == index) {
                element.showRecipeInput = false;
                element.type = 2;
            }
        });

    }

    changeSort(value: any, index: any) {
        this.listControls.forEach((element: { hiddenNo: any; sort: any; }) => {
            if (element.hiddenNo == index) {
                element.sort = value.target.value;
            }
        });
    }

    changeStt(value: any, index: any) {
        this.listControls.forEach((element: { hiddenNo: any; stt: any; }) => {
            if (element.hiddenNo == index) {
                element.stt = value.target.value;
            }
        });
    }

    onChangeUnit(value: { value: { Id: any; }; }, index: any) {
        this.listControls.forEach((element: { hiddenNo: any; unit: any; }) => {
            if (element.hiddenNo == index) {
                element.unit = value.value.Id;
            }
        });
    }

    onChangeAcc(value: { value: { Id: any; }; }, index: any) {

        let newAccu = {
            AccumulatedType: value.value.Id
        }
        this.listControls.forEach((element: { hiddenNo: any; hideApp: boolean; accumulatedType: string; }) => {
            if (element.hiddenNo == index) {
                const newObj = {
                    ...newAccu, HideApp: element.hideApp == true
                }
                element.accumulatedType = JSON.stringify(newObj);
            }
        });
    }
    onChangeHideApp(value: any, index: any) {
        this.listControls.forEach((element: any) => {
            if (element.hiddenNo == index) {

                element.accumulatedType = element.accumulatedType.replace(/'/g, '"');
                var obj = JSON.parse(element.accumulatedType);

                const newRemoveHideApp = (attrs: any) => {
                    const cloneAttrs = { ...attrs };
                    delete cloneAttrs.HideApp;
                    return cloneAttrs;
                }
                let afterRm = newRemoveHideApp(obj);
                const newObj = {
                    ...afterRm, HideApp: value
                }
                element.accumulatedType = JSON.stringify(newObj);
                element.hideApp = value;
            }
        });
    }

    changeLinkDetail(value: any, index: any) {
        this.listControls.forEach((element: { hiddenNo: any; accumulatedType: string; linkDetail: any; }) => {
            if (element.hiddenNo == index) {
                var obj = JSON.parse(element.accumulatedType);
                const newRemoveLinkDetail = (attrs: any) => {
                    const cloneAttrs = { ...attrs };
                    delete cloneAttrs.LinkDetail;
                    return cloneAttrs;
                }
                let afterRm = newRemoveLinkDetail(obj);
                const newObj = {
                    ...afterRm, LinkDetail: value.target.value
                }
                element.accumulatedType = JSON.stringify(newObj);
                element.linkDetail = value.target.value;
            }
        });
    }

    onSelectHeader1(value: any, index: any) {
        this.listControls.forEach((element: { hiddenNo: any; header1: any; }) => {
            if (element.hiddenNo == index) {
                element.header1 = value.target.value;
            }
        });

        // this.listControlsTemp = [];
        // this.listControls.forEach(element => {
        //     this.listControlsTemp.push({
        //         hiddenNo: element.hiddenNo,
        //         selectedNumber: element.selectedNumber,
        //         showRecipeInput: element.showRecipeInput,
        //         stt: element.stt,
        //         header1: element.hiddenNo == index ? value.target.value : element.header1,
        //         header2: element.header2,
        //         type: element.type,
        //         delete: element.delete,
        //         recipe: element.recipe,
        //         unit: element.unit
        //     });
        //     if (element.hiddenNo == index) {
        //         element.header1 = value.target.value;
        //     }
        // });
    }

    onSelectHeader2(value: any, index: any) {

        this.listControls.forEach((element: { hiddenNo: any; header2: any; }) => {
            if (element.hiddenNo == index) {
                element.header2 = value.target.value;
            }
        });

        // this.listControlsTemp = [];
        // this.listControls.forEach(element => {
        //     this.listControlsTemp.push({
        //         hiddenNo: element.hiddenNo,
        //         selectedNumber: element.selectedNumber,
        //         showRecipeInput: element.showRecipeInput,
        //         stt: element.stt,
        //         header1: element.header1,
        //         header2: element.hiddenNo == index ? value.target.value : element.header2,
        //         type: element.type,
        //         delete: element.delete,
        //         recipe: element.recipe,
        //         unit: element.unit
        //     });
        //     if (element.hiddenNo == index) {
        //         element.header2 = value.target.value;
        //     }
        // });
    }

    onChangeField(value: { value: { Id: any; }; }) {
        this.sendData.FieldId = value.value.Id;
    }

    changeRecipe(value: any, index: any) {
        this.listControls.forEach((element: { hiddenNo: any; recipe: any; }) => {
            if (element.hiddenNo == index) {
                element.recipe = value.target.value;
            }
        });
    }

    changeMin(value: any, index: any) {
        this.listControls.forEach((element: { hiddenNo: any; min: any; }) => {
            if (element.hiddenNo == index) {
                element.min = value.target.value;
            }
        });
    }

    changeMax(value: any, index: any) {
        this.listControls.forEach((element: { hiddenNo: any; max: any; }) => {
            if (element.hiddenNo == index) {
                element.max = value.target.value;
            }
        });
    }

    getListProperties() {
        this.properites = [];
        // this.properites = [{ Id: 1, Name: "ahihi" }, { Id: 2, Name: "ccccc" }, { Id: 3, Name: "ddddd" }]
        var data = {
        };
        this.http.post('IOC/GetListPropertiesByStatus', data, (kq: { Code: number; Result: any; }) => {
            if (kq.Code == 200) {
                this.properites = kq.Result;
                this.tempProperites = [];
                this.properites.forEach((element: any) => {
                    this.tempProperites.push(element);
                });
            }
        }, (error: any) => {
        }
        );
    }

    filterSingle1(event: { query: any; }, index: any) {
        let query = event.query;
        this.properites = this.tempProperites;
        this.properites = this.filterCountry(query, this.properites);

        this.listControls.forEach((element: { hiddenNo: any; header1: any; }) => {
            if (element.hiddenNo == index) {
                element.header1 = query;
            }
        });
    }
    filterSingle2(event: { query: any; }, index: any) {
        let query = event.query;
        this.properites = this.tempProperites;
        this.properites = this.filterCountry(query, this.properites);

        this.listControls.forEach((element: { hiddenNo: any; header2: any; }) => {
            if (element.hiddenNo == index) {
                element.header2 = query;
            }
        });
    }

    filterCountry(query: string, countries: any[]): any[] {
        let filtered: any[] = [];
        for (let i = 0; i < countries.length; i++) {
            let country = countries[i];
            if (country.Name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country.Name);
            }
        }
        return filtered;
    }

    validateForm(index: string, errId: string, fromFile: string, leng: number) {
        var fields: any = [];
        fields.push(this.formData.value);

        for (var j = 0; j <= fields.length; j++) {
            for (const field in fields[j]) {
                if ($('#' + field + index).val() == undefined || field == 'frequency_type_id' || field == 'field_id' || field == 'organization_id') {
                    continue;
                }
                if ($('#' + field + index).val() == "") {
                    $('#' + field + errId).html('Bắt buộc nhập!')
                    this.valid++;
                } else {
                    $('#' + field + errId).html('')
                    this.valid = this.valid > 0 ? this.valid : 0;
                }
            }
        }

        fields = [];

        for (var j = 0; j < this.listControls.length; j++) {
            if (this.listControls[j].delete == "-1") {
                continue;
            }

            if (this.listControls[j].stt == "") {
                $('#' + this.listControls[j].idSTT + errId).html('Bắt buộc nhập!');
                this.valid++;
            }
            else {
                $('#' + this.listControls[j].idSTT + errId).html('');
                this.valid = this.valid > 0 ? this.valid : 0;
            }
            if (this.listControls[j].header1 == "") {
                $('#' + this.listControls[j].idHeader1 + errId).html('Bắt buộc nhập!');
                this.valid++;
            }
            else {
                $('#' + this.listControls[j].idHeader1 + errId).html('');
                this.valid = this.valid > 0 ? this.valid : 0;
            }
            if (this.listControls[j].header2 == "") {
                $('#' + this.listControls[j].idHeader2 + errId).html('Bắt buộc nhập!');
                this.valid++;
            }
            else {
                $('#' + this.listControls[j].idHeader2 + errId).html('');
                this.valid = this.valid > 0 ? this.valid : 0;
            }
        }

        // // Check
        // for (var i = 0; i < this.formInfo.length; i++) {
        //     fields.push(this.formInfo[i].value);
        // }

        // for (var j = 0; j < fields.length; j++) {
        //     if ($('#' + fields[j].checkValidate + index).val() == undefined) {
        //         continue;
        //     }
        //     if (fields[j].checkValidate.includes("stt")) {
        //         if ($('#' + fields[j].checkValidate + index).val() == "") {
        //             document.getElementById(fields[j].checkValidate + errId).innerHTML = 'Bắt buộc nhập!';
        //             this.valid++;
        //         }
        //         else {
        //             document.getElementById(fields[j].checkValidate + errId).innerHTML = "";
        //             this.valid = this.valid > 0 ? this.valid : 0;
        //         }
        //     }
        //     else {
        //         console.log(this.listControls);
        //         console.log(this.listControls[j].property1);
        //         if ($('#' + fields[j].checkValidate + index).attr("ng-reflect-model") == undefined || $('#' + fields[j].checkValidate + index).attr("ng-reflect-model") == "") {
        //             document.getElementById(fields[j].checkValidate + errId).innerHTML = 'Bắt buộc nhập!';
        //             this.valid++;
        //         }
        //         else {
        //             document.getElementById(fields[j].checkValidate + errId).innerHTML = "";
        //             this.valid = this.valid > 0 ? this.valid : 0;
        //         }
        //     }
        // }
    }

    submit() {
        this.valid = 0;

        this.validateForm('', 'Error', 'reflect-profile', 2);

        if (this.formInfo.length == 0) {
            $('#tieuChiError').html('Vui lòng thêm tiêu chí!');
        }
        else {
            if (this.valid <= 0) {
                $('#tieuChiError').html('');

                this.sendData.Code = $("#codeId").val();
                this.sendData.Header = $("#headerId").val();
                this.sendData.StepTime = $("#stepTimeId").val();
                this.sendData.property1 = null;
                this.sendData.property2 = null;
                this.sendData.unitDto = null;

                this.listControls.forEach((element: any) => {
                    element.property1 = null;
                    element.property2 = null;
                    element.unitDto = null;
                    element.accumulatedTypeDto = null;


                    let newAccu = {
                        AccumulatedType: "Sum",
                        HideApp: false,
                        LinkDetail: ""
                    }
                    if (element.accumulatedType != null && element.accumulatedType != "") {
                        element.accumulatedType = element.accumulatedType.replace(/'/g, '"');
                        element.accumulatedType = JSON.parse(element.accumulatedType);
                        newAccu.AccumulatedType = element.accumulatedType.AccumulatedType;
                    }
                    if (element.hideApp != null && element.hideApp != "") {
                        newAccu.HideApp = element.hideApp;
                    }

                    if (element.linkDetail != null && element.linkDetail != "") {
                        newAccu.LinkDetail = element.linkDetail;
                    }
                    let strAccu = JSON.stringify(newAccu);
                    element.accumulatedType = strAccu;

                });
                this.sendData.Properties = this.listControls;
                this.sendData.FieldId = this.defaultField.Id;
                this.sendData.OrganizationId = this.defaultOrganization == undefined ? null : this.defaultOrganization.Id;
                this.sendData.FrequencyTypeId = this.defaultFrequency.Id;
                var data = {
                    Json: JSON.stringify(this.sendData)
                }
                this.isDisabled = true;
                if (this.context.isAdd) {
                    this.http.post('IOC/SaveDocumentTemplate', data, (kq: { Result: { Code: number; } | null; }) => {
                        if (kq.Result == null) {
                            this.isDisabled = false;
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
                        }
                        else {
                            if (kq.Result.Code == 405) {
                                this.listControls.forEach((element: any) => {
                                    element.unitDto = { Id: element.unit };
                                    element.hideApp = element.hideApp;
                                    element.linkDetail = element.linkDetail;
                                    element.accumulatedTypeDto = this.accumulatedTypes.filter((row: { Id: any; }) => row.Id == element.accumulatedType)[0];
                                });
                                this.isDisabled = false;

                                $('#codeIdError').html('Mã biểu mẫu ' + this.sendData.Code + ' bị trùng. Vui lòng nhập mã biểu mẫu khác!');
                                $("#codeId").focus();
                            } else {
                                if (kq.Result.Code == 200) {
                                    this.isDisabled = false;
                                    this.messageService.add({ severity: 'success', summary: 'Error', detail: "Thêm thành công!" });
                                    this.cancel();
                                } else {
                                    this.isDisabled = false;
                                    this.messageService.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
                                }
                            }
                        }
                    }, (error: any) => {
                        this.isDisabled = false;
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
                    }
                    );
                }
                else {
                    this.http.post('IOC/EditDocumentTemplate', data, (kq: { Result: { Code: number; } | null; }) => {
                        if (kq.Result == null) {
                            this.isDisabled = false;
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
                        }
                        else {
                            if (kq.Result.Code == 200) {
                                this.isDisabled = false;

                                this.messageService.add({ severity: 'success', summary: 'Success', detail: "Lưu thành công!" });
                                this.cancel();
                            } else {
                                this.isDisabled = false;
                                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
                            }
                        }
                    }, (error: any) => {
                        this.isDisabled = false;
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
                    }
                    );
                }
            }
        }
    }

    submitLinhVuc() {

        this.sendData.Code = $("#codeId").val();
        this.sendData.Header = $("#headerId").val();
        this.sendData.property1 = null;
        this.sendData.property2 = null;
        this.sendData.unitDto = null;
        this.listControls.forEach((element: { property1: null; property2: null; unitDto: null; accumulatedType: string; }) => {
            element.property1 = null;
            element.property2 = null;
            element.unitDto = null;
            element.accumulatedType = "";
        });
        this.sendData.Properties = this.listControls
        var data = {
            Json: JSON.stringify(this.sendData)
        }
        this.http.post('IOC/SaveFieldDocumentTemplate', data, (kq: { Result: { Code: number; }; }) => {
            if (kq.Result.Code == 200) {
                this.messageService.add({ severity: 'success', summary: 'Error', detail: "Thêm thành công!" });
                this.cancel();
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
            }
        }, (error: any) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
        }
        );
    }

    cancel() {
        this.ref.close();
    }

    getTempalteById() {
        this.isDisabled = true;
        var data = {
            DocumentTemplateId: this.context.item.Id
        };
        this.http.post('IOC/GetDefineTemplateById', data, (kq: { Code: number; Result: { Code: any; Header: any; StepTime: any; Properties: any; FieldId: any; OrganizationId: any; FrequencyTypeId: any; }; }) => {
            if (kq.Code == 200) {
                this.sendData.Code = kq.Result.Code;
                this.sendData.Header = kq.Result.Header;
                this.sendData.StepTime = kq.Result.StepTime;
                this.listControls = kq.Result.Properties;

                var max = 0;

                this.listControls.forEach((element: { idSTT: string; idHeader1: string; idHeader2: string; type: string; hiddenNo: any; }) => {

                    element.idSTT = "stt_" + max;
                    element.idHeader1 = "header_1_" + max
                    element.idHeader2 = "header_2_" + max

                    if (element.type == "0") {
                        this.onNumberRadio(element.hiddenNo);
                    }
                    if (element.type == "1") {
                        this.onTextRadio(element.hiddenNo)
                    }
                    if (element.type == "2") {
                        this.onRecipeRadio(element.hiddenNo)
                    }
                    if (element.type == "3") {
                        this.onTitleRadio(element.hiddenNo)
                    }

                    this.formInfo.push(this.formBuilder.group({
                        checkValidate: "stt_" + max
                    })
                    );

                    this.formInfo.push(this.formBuilder.group({
                        checkValidate: "header_1_" + max
                    })
                    );

                    this.formInfo.push(this.formBuilder.group({
                        checkValidate: "header_2_" + max
                    })
                    );

                    max++;
                });

                this.sendData.FieldId = kq.Result.FieldId;
                this.sendData.OrganizationId = kq.Result.OrganizationId;
                this.sendData.FrequencyTypeId = kq.Result.FrequencyTypeId;

                this.defaultField = { Id: kq.Result.FieldId };
                this.defaultOrganization = { Id: kq.Result.OrganizationId };
                this.defaultFrequency = { Id: kq.Result.FrequencyTypeId };

                this.isDisabled = false;
            }
        }, (error: any) => {
            this.isDisabled = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra!" });
        }
        );
    }

    onChangeFrequency(value: { value: { Id: any; }; }) {
        this.sendData.FrequencyTypeId = value.value.Id;
    }
}
