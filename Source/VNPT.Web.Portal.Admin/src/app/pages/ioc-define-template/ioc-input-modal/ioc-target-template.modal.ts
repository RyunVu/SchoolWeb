import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// import 'chartjs-plugin-labels';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage, BaseService, HttpService, ShowDialogService } from 'src/app/services';

import * as _ from "lodash";
import { ConfirmationService, MessageService } from "primeng/api";
import * as moment from 'moment';
import { CookieService } from "ngx-cookie-service";
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
declare var $: any;

@Component({
    selector: 'app-target-template',
    templateUrl: './ioc-target-template.modal.html'
})
export class IOCTargetTemplateModal implements  OnInit {
    context: any;
    units: any = [];
    defaultTemplate: any = {};
    templates: any = [];
    values: any = [];
    listCol: any = [];
    inputDate: any;

    isDisabled: boolean = false;
    templateName: any;

    ngOnInit(): void {

        $(function () {
            var id = "#target";
            var dialog = $(id).closest(".modal-dialog")[0];
            $(dialog).addClass("modal-dialog-9");
            // set chiều cao cho modal
            $(id).height(window.innerHeight - 300);
            window.onresize = (e: any) => {
                $(id).height(window.innerHeight - 300);
            };
        });

        $(document).ready(function () {
            $('#input-date').datetimepicker({
                format: 'DD/MM/YYYY',
                locale: 'vi',
            });
        });


        var date = new Date();
        $("#input-date").val(moment(date).format('DD/MM/YYYY'));
    }

    constructor(
        public http: HttpService,
        public formBuilder: FormBuilder,
        private router: Router,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public message: MessageService,
        private confirmationService: ConfirmationService,
        private cookieService: CookieService,
    ) {
        this.context = this.config.data;
        this.units = [
            { Id: 1, Value: "%" },
            { Id: 2, Value: "USD" },
            { Id: 2, Value: "VND" },
            { Id: 2, Value: "MM" },
        ];

        this.templateName = this.context.item.Name;
        this.defaultTemplate = { Id: this.context.item.Id };

        var date = new Date();
        $("#input-date").val(moment(date).format('DD/MM/YYYY'));

        this.getDetailTemplate(this.defaultTemplate.Id);
    }

    getDetailTemplate(id: any) {
        var data = {
            DocumentTemplateId: id,
            InputDate: $("#input-date").val() == undefined ? moment(new Date()).format('DD/MM/YYYY') : $("#input-date").val()
        };

        this.isDisabled = true;

        this.http.post('IOC/GetPropertyValueByTemplateId', data, (kq: any) => {
            if (kq.Code == 200) {

                this.isDisabled = false;

                if (kq.Result != null) {
                    this.listCol = kq.Result.ListCol;
                    this.values = kq.Result.PropertyIdsNew;
                }
            }
            else
            {
                this.isDisabled = false;
            }
        }, () => {
            this.isDisabled = false;
        }
        );
    }
    changeTemplate(value: any) {
        if (value != null) {
            var id = value.Id;
            this.getDetailTemplate(id);
        }
    }
   

    onChangeDate() {
        if ($("#input-date").data("DateTimePicker").date() != undefined) {
            this.inputDate = $("#input-date").data("DateTimePicker").date().format('DD/MM/YYYY');
            if (this.defaultTemplate != undefined && this.defaultTemplate.Id != null) {
                this.getDetailTemplate(this.defaultTemplate.Id);
            }
        }
    }

    setMaxWidth() {
        if (this.listCol != null && this.listCol.length > 3) {
            var maxW = 460 * this.listCol.length;
            return {
                'width': maxW + 'px'
            };
        } else {
            return {
                'max-width': '100%'
            };

        }
    }

    targetObj: any = {};
    addTarget(value: any, index: any) {
        var that = this;
        var mapValueId = value.ValueId[index];
        // this.modal.open(TargetTemplateModal,
        //     overlayConfigFactory({
        //         item: {
        //             PropertyId: value.PropertyId,
        //             PropertyFieldId: value.PropertyFieldId,
        //             MapValueId: mapValueId,
        //             ScheduleTaskTypeId: value.ScheduleTaskTypeId,
        //             // IsTarget: isTarget,
        //             OrganizationId: this.context.item.OrganizationId
        //         },
        //         isAdd: false,
        //         code: ""
        //     },
        //         BSModalContext))
        //     .then((resultPromise) => {
        //         resultPromise.result.then((result) => {
        //             if (result != null) {

        //                 that.values.forEach(element => {
        //                     if (element.PropertyId == result.PropertyId) {
        //                         element.MapValueId.forEach(element1 => {

        //                             // Htc che lai dung xoa
        //                             // if (element1.ValueMapId == result.MapValueId) {
        //                             //     element1.Value = result.Value;
        //                             //     element1.FromDate = result.FromDate;
        //                             //     element1.ToDate = result.ToDate;
        //                             // }

        //                             element1.Value = result.Value;
        //                             element1.FromDate = result.FromDate;
        //                             element1.ToDate = result.ToDate;
        //                         });

        //                     }
        //                 });
        //                 // that.getTempatles();
        //             }
        //             else
        //             {
        //                 if (this.defaultTemplate != undefined && this.defaultTemplate.Id != null) {
        //                     this.getDetailTemplate(this.defaultTemplate.Id);
        //                 }
        //             }
        //         }).catch((error) => {
        //         })
        //     },
        //         () => { }
        //     );
    }

    cancel() {
        this.ref.close();
    }

    themChiTieu(value: any, index: any, isTarget: any){
        // this.modal.open(IOCTargetTemplateV2Modal,
        //     overlayConfigFactory({
        //         item: {
        //             PropertyId: value.PropertyId,
        //             PropertyFieldId: value.PropertyFieldId,
        //             ScheduleTaskTypeId: value.ScheduleTaskTypeId,
        //             IsTarget: isTarget,
        //             OrganizationId: this.context.item.OrganizationId
        //         },
        //         isAdd: false,
        //         code: ""
        //     },
        //         BSModalContext))
        //     .then((resultPromise) => {
        //         resultPromise.result.then((result) => {
        //             //this.loadData();
        //         }).catch(() => {

        //         })
        //     },
        //         () => { }
        //     );
    }
}
