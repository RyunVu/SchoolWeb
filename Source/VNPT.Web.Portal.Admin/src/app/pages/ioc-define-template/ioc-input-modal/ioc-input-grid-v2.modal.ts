import { Component, OnInit, AfterViewInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage, BaseService, HttpService, ShowDialogService } from 'src/app/services';
import { Router } from '@angular/router';

import * as _ from "lodash";
// import { IOCInputListModal } from "./ioc-input-list.modal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ConfirmationService, MessageService } from "primeng/api";
import * as moment from 'moment';
declare var $: any;

@Component({
    selector: "ioc-input-grid-v2-modal",
    templateUrl: './ioc-input-grid-v2.modal.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./ioc-input.component.scss']
})


export class InputGridV2Modal implements OnInit {
    context: any;
    public formData: any;
    units: any = [];
    templates: any = [];
    values: any = [];
    listCol: any = [];
    listMonth: any = [];
    valuesPast: any = [];
    listColPast: any = [];
    inputDate: any;
    frequencies: any = [];
    defaultFrequency: any;

    isDisabled: boolean = false;
    globalValue: any = {};

    nameTemplate: any;

    currentMonth: any;
    currentYear: any;

    defaultHasIns: any;
    organizations: any;
    defaultOrganization: any;

    currentRole: any;
    hasPermision: any;
    hasAdminPermision: any;

    currentMulRoleLevel: any;
    hasPermisionDetail: any;

    isTongHop: any;

    customers: any;
    
    balanceFrozen: boolean = false;
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
        this.nameTemplate = this.context.item.NameTemplate;
        this.isTongHop = this.context.item.IsTongHop;

        this.currentRole = localStorage.getItem("MulRole");
        this.hasPermision = false;
        this.hasAdminPermision = false;
        if (this.currentRole != "" && this.currentRole != null) {
            if (!this.currentRole.includes("NhapLieuIOC") && !this.currentRole.includes("AdminNhapLieuIOC")) {
                this.hasPermision = true;
            }
            if (this.currentRole.includes("AdminIOC")) {
                this.hasAdminPermision = true;
            }
        }

        this.hasPermisionDetail = false;
        this.currentMulRoleLevel = localStorage.getItem("MulRoleLevel");
        if (this.currentMulRoleLevel != "" && this.currentMulRoleLevel != null) {
            if (this.currentMulRoleLevel.includes("2")) {
                this.hasPermisionDetail = true;
            }
        }

        this.customers = [
            {
                "id": 1001,
                "name": "Josephine Darakjy",
                "country": {
                    "name": "Egypt",
                    "code": "eg"
                },
                "company": "Chanay, Jeffrey A Esq",
                "date": "2019-02-09",
                "status": "proposal",
                "verified": true,
                "activity": 0,
                "representative": {
                    "name": "Amy Elsner",
                    "image": "amyelsner.png"
                },
                "balance": 82429
            },
            {
                "id": 1013,
                "name": "Graciela Ruta",
                "country": {
                    "name": "Chile",
                    "code": "cl"
                },
                "company": "Buckley Miller & Wright",
                "date": "2016-07-25",
                "status": "negotiation",
                "verified": false,
                "activity": 59,
                "representative": {
                    "name": "Amy Elsner",
                    "image": "amyelsner.png"
                },
                "balance": 45250
            },
            {
                "id": 1027,
                "name": "Ezekiel Chui",
                "country": {
                    "name": "Ireland",
                    "code": "ie"
                },
                "company": "Sider, Donald C Esq",
                "date": "2016-09-24",
                "status": "new",
                "verified": false,
                "activity": 76,
                "representative": {
                    "name": "Amy Elsner",
                    "image": "amyelsner.png"
                },
                "balance": 60454
            },
            {
                "id": 1036,
                "name": "Jose Stockham",
                "country": {
                    "name": "Italy",
                    "code": "it"
                },
                "company": "Tri State Refueler Co",
                "date": "2018-04-25",
                "status": "qualified",
                "verified": true,
                "activity": 77,
                "representative": {
                    "name": "Amy Elsner",
                    "image": "amyelsner.png"
                },
                "balance": 94909
            },
            {
                "id": 1037,
                "name": "Rozella Ostrosky",
                "country": {
                    "name": "Venezuela",
                    "code": "ve"
                },
                "company": "Parkway Company",
                "date": "2016-02-27",
                "status": "unqualified",
                "verified": true,
                "activity": 66,
                "representative": {
                    "name": "Amy Elsner",
                    "image": "amyelsner.png"
                },
                "balance": 57245
            },
            {
                "id": 1041,
                "name": "Dyan Oldroyd",
                "country": {
                    "name": "Argentina",
                    "code": "ar"
                },
                "company": "International Eyelets Inc",
                "date": "2017-02-02",
                "status": "qualified",
                "verified": false,
                "activity": 5,
                "representative": {
                    "name": "Amy Elsner",
                    "image": "amyelsner.png"
                },
                "balance": 50194
            },
            {
                "id": 1044,
                "name": "Erick Ferencz",
                "country": {
                    "name": "Belgium",
                    "code": "be"
                },
                "company": "Cindy Turner Associates",
                "date": "2018-05-06",
                "status": "unqualified",
                "verified": true,
                "activity": 54,
                "representative": {
                    "name": "Amy Elsner",
                    "image": "amyelsner.png"
                },
                "balance": 30790
            },
            {
                "id": 1010,
                "name": "Minna Amigon",
                "country": {
                    "name": "Romania",
                    "code": "ro"
                },
                "company": "Dorl, James J Esq",
                "date": "2018-11-07",
                "status": "qualified",
                "verified": false,
                "activity": 38,
                "representative": {
                    "name": "Anna Fali",
                    "image": "annafali.png"
                },
                "balance": 71169
            },
            {
                "id": 1015,
                "name": "Mattie Poquette",
                "country": {
                    "name": "Venezuela",
                    "code": "ve"
                },
                "company": "Century Communications",
                "date": "2017-12-12",
                "status": "negotiation",
                "verified": false,
                "activity": 52,
                "representative": {
                    "name": "Anna Fali",
                    "image": "annafali.png"
                },
                "balance": 64533
            },
            {
                "id": 1042,
                "name": "Roxane Campain",
                "country": {
                    "name": "France",
                    "code": "fr"
                },
                "company": "Rapid Trading Intl",
                "date": "2018-12-25",
                "status": "unqualified",
                "verified": false,
                "activity": 100,
                "representative": {
                    "name": "Anna Fali",
                    "image": "annafali.png"
                },
                "balance": 77714
            },
            {
                "id": 1002,
                "name": "Art Venere",
                "country": {
                    "name": "Panama",
                    "code": "pa"
                },
                "company": "Chemel, James L Cpa",
                "date": "2017-05-13",
                "status": "qualified",
                "verified": false,
                "activity": 63,
                "representative": {
                    "name": "Asiya Javayant",
                    "image": "asiyajavayant.png"
                },
                "balance": 28334
            },
            {
                "id": 1004,
                "name": "Donette Foller",
                "country": {
                    "name": "South Africa",
                    "code": "za"
                },
                "company": "Printing Dimensions",
                "date": "2016-05-20",
                "status": "proposal",
                "verified": true,
                "activity": 33,
                "representative": {
                    "name": "Asiya Javayant",
                    "image": "asiyajavayant.png"
                },
                "balance": 93905
            },
            {
                "id": 1014,
                "name": "Cammy Albares",
                "country": {
                    "name": "Philippines",
                    "code": "ph"
                },
                "company": "Rousseaux, Michael Esq",
                "date": "2019-06-25",
                "status": "new",
                "verified": true,
                "activity": 90,
                "representative": {
                    "name": "Asiya Javayant",
                    "image": "asiyajavayant.png"
                },
                "balance": 30236
            },
            {
                "id": 1022,
                "name": "Willard Kolmetz",
                "country": {
                    "name": "Tunisia",
                    "code": "tn"
                },
                "company": "Ingalls, Donald R Esq",
                "date": "2017-04-15",
                "status": "renewal",
                "verified": true,
                "activity": 94,
                "representative": {
                    "name": "Asiya Javayant",
                    "image": "asiyajavayant.png"
                },
                "balance": 75876
            },
            {
                "id": 1030,
                "name": "Ammie Corrio",
                "country": {
                    "name": "Hungary",
                    "code": "hu"
                },
                "company": "Moskowitz, Barry S",
                "date": "2016-06-11",
                "status": "negotiation",
                "verified": true,
                "activity": 56,
                "representative": {
                    "name": "Asiya Javayant",
                    "image": "asiyajavayant.png"
                },
                "balance": 49201
            },
            {
                "id": 1049,
                "name": "Blair Malet",
                "country": {
                    "name": "Finland",
                    "code": "fi"
                },
                "company": "Bollinger Mach Shp & Shipyard",
                "date": "2018-04-19",
                "status": "new",
                "verified": true,
                "activity": 92,
                "representative": {
                    "name": "Asiya Javayant",
                    "image": "asiyajavayant.png"
                },
                "balance": 65005
            },
            {
                "id": 1011,
                "name": "Abel Maclead",
                "country": {
                    "name": "Singapore",
                    "code": "sg"
                },
                "company": "Rangoni Of Florence",
                "date": "2017-03-11",
                "status": "qualified",
                "verified": true,
                "activity": 87,
                "representative": {
                    "name": "Bernardo Dominic",
                    "image": "bernardodominic.png"
                },
                "balance": 96842
            },
            {
                "id": 1018,
                "name": "Yuki Whobrey",
                "country": {
                    "name": "Israel",
                    "code": "il"
                },
                "company": "Farmers Insurance Group",
                "date": "2017-12-21",
                "status": "negotiation",
                "verified": true,
                "activity": 16,
                "representative": {
                    "name": "Bernardo Dominic",
                    "image": "bernardodominic.png"
                },
                "balance": 9257
            },
            {
                "id": 1033,
                "name": "Albina Glick",
                "country": {
                    "name": "Ukraine",
                    "code": "ua"
                },
                "company": "Giampetro, Anthony D",
                "date": "2019-08-08",
                "status": "proposal",
                "verified": true,
                "activity": 85,
                "representative": {
                    "name": "Bernardo Dominic",
                    "image": "bernardodominic.png"
                },
                "balance": 91201
            },
            {
                "id": 1038,
                "name": "Valentine Gillian",
                "country": {
                    "name": "Paraguay",
                    "code": "py"
                },
                "company": "Fbs Business Finance",
                "date": "2019-09-17",
                "status": "qualified",
                "verified": true,
                "activity": 25,
                "representative": {
                    "name": "Bernardo Dominic",
                    "image": "bernardodominic.png"
                },
                "balance": 75502
            },
            {
                "id": 1023,
                "name": "Maryann Royster",
                "country": {
                    "name": "Belarus",
                    "code": "by"
                },
                "company": "Franklin, Peter L Esq",
                "date": "2017-03-11",
                "status": "qualified",
                "verified": false,
                "activity": 56,
                "representative": {
                    "name": "Elwin Sharvill",
                    "image": "elwinsharvill.png"
                },
                "balance": 41121
            },
            {
                "id": 1000,
                "name": "James Butt",
                "country": {
                    "name": "Algeria",
                    "code": "dz"
                },
                "company": "Benton, John B Jr",
                "date": "2015-09-13",
                "status": "unqualified",
                "verified": true,
                "activity": 17,
                "representative": {
                    "name": "Ioni Bowcher",
                    "image": "ionibowcher.png"
                },
                "balance": 70663
            },
            {
                "id": 1021,
                "name": "Veronika Inouye",
                "country": {
                    "name": "Ecuador",
                    "code": "ec"
                },
                "company": "C 4 Network Inc",
                "date": "2017-03-24",
                "status": "renewal",
                "verified": false,
                "activity": 72,
                "representative": {
                    "name": "Ioni Bowcher",
                    "image": "ionibowcher.png"
                },
                "balance": 26565
            },
            {
                "id": 1026,
                "name": "Chanel Caudy",
                "country": {
                    "name": "Argentina",
                    "code": "ar"
                },
                "company": "Professional Image Inc",
                "date": "2018-06-24",
                "status": "new",
                "verified": true,
                "activity": 26,
                "representative": {
                    "name": "Ioni Bowcher",
                    "image": "ionibowcher.png"
                },
                "balance": 21304
            },
            {
                "id": 1029,
                "name": "Bernardo Figeroa",
                "country": {
                    "name": "Israel",
                    "code": "il"
                },
                "company": "Clark, Richard Cpa",
                "date": "2018-04-11",
                "status": "renewal",
                "verified": true,
                "activity": 81,
                "representative": {
                    "name": "Ioni Bowcher",
                    "image": "ionibowcher.png"
                },
                "balance": 17774
            },
            {
                "id": 1031,
                "name": "Francine Vocelka",
                "country": {
                    "name": "Honduras",
                    "code": "hn"
                },
                "company": "Cascade Realty Advisors Inc",
                "date": "2017-08-02",
                "status": "qualified",
                "verified": true,
                "activity": 94,
                "representative": {
                    "name": "Ioni Bowcher",
                    "image": "ionibowcher.png"
                },
                "balance": 67126
            },
            {
                "id": 1039,
                "name": "Kati Rulapaugh",
                "country": {
                    "name": "Puerto Rico",
                    "code": "pr"
                },
                "company": "Eder Assocs Consltng Engrs Pc",
                "date": "2016-12-03",
                "status": "renewal",
                "verified": false,
                "activity": 51,
                "representative": {
                    "name": "Ioni Bowcher",
                    "image": "ionibowcher.png"
                },
                "balance": 82075
            },
            {
                "id": 1005,
                "name": "Simona Morasca",
                "country": {
                    "name": "Egypt",
                    "code": "eg"
                },
                "company": "Chapman, Ross E Esq",
                "date": "2018-02-16",
                "status": "qualified",
                "verified": false,
                "activity": 68,
                "representative": {
                    "name": "Ivan Magalhaes",
                    "image": "ivanmagalhaes.png"
                },
                "balance": 50041
            },
            {
                "id": 1006,
                "name": "Mitsue Tollner",
                "country": {
                    "name": "Paraguay",
                    "code": "py"
                },
                "company": "Morlong Associates",
                "date": "2018-02-19",
                "status": "renewal",
                "verified": true,
                "activity": 54,
                "representative": {
                    "name": "Ivan Magalhaes",
                    "image": "ivanmagalhaes.png"
                },
                "balance": 58706
            },
            {
                "id": 1008,
                "name": "Sage Wieser",
                "country": {
                    "name": "Egypt",
                    "code": "eg"
                },
                "company": "Truhlar And Truhlar Attys",
                "date": "2018-11-21",
                "status": "unqualified",
                "verified": true,
                "activity": 76,
                "representative": {
                    "name": "Ivan Magalhaes",
                    "image": "ivanmagalhaes.png"
                },
                "balance": 65369
            },
            {
                "id": 1016,
                "name": "Meaghan Garufi",
                "country": {
                    "name": "Malaysia",
                    "code": "my"
                },
                "company": "Bolton, Wilbur Esq",
                "date": "2018-07-04",
                "status": "unqualified",
                "verified": false,
                "activity": 31,
                "representative": {
                    "name": "Ivan Magalhaes",
                    "image": "ivanmagalhaes.png"
                },
                "balance": 37279
            },
            {
                "id": 1025,
                "name": "Allene Iturbide",
                "country": {
                    "name": "Italy",
                    "code": "it"
                },
                "company": "Ledecky, David Esq",
                "date": "2016-02-20",
                "status": "qualified",
                "verified": true,
                "activity": 1,
                "representative": {
                    "name": "Ivan Magalhaes",
                    "image": "ivanmagalhaes.png"
                },
                "balance": 40137
            },
            {
                "id": 1034,
                "name": "Alishia Sergi",
                "country": {
                    "name": "Qatar",
                    "code": "qa"
                },
                "company": "Milford Enterprises Inc",
                "date": "2018-05-19",
                "status": "negotiation",
                "verified": false,
                "activity": 46,
                "representative": {
                    "name": "Ivan Magalhaes",
                    "image": "ivanmagalhaes.png"
                },
                "balance": 12237
            },
            {
                "id": 1007,
                "name": "Leota Dilliard",
                "country": {
                    "name": "Serbia",
                    "code": "rs"
                },
                "company": "Commercial Press",
                "date": "2019-08-13",
                "status": "renewal",
                "verified": true,
                "activity": 69,
                "representative": {
                    "name": "Onyama Limba",
                    "image": "onyamalimba.png"
                },
                "balance": 26640
            },
            {
                "id": 1009,
                "name": "Kris Marrier",
                "country": {
                    "name": "Mexico",
                    "code": "mx"
                },
                "company": "King, Christopher A Esq",
                "date": "2015-07-07",
                "status": "proposal",
                "verified": false,
                "activity": 3,
                "representative": {
                    "name": "Onyama Limba",
                    "image": "onyamalimba.png"
                },
                "balance": 63451
            },
            {
                "id": 1012,
                "name": "Kiley Caldarera",
                "country": {
                    "name": "Serbia",
                    "code": "rs"
                },
                "company": "Feiner Bros",
                "date": "2015-10-20",
                "status": "unqualified",
                "verified": false,
                "activity": 80,
                "representative": {
                    "name": "Onyama Limba",
                    "image": "onyamalimba.png"
                },
                "balance": 92734
            },
            {
                "id": 1020,
                "name": "Bette Nicka",
                "country": {
                    "name": "Paraguay",
                    "code": "py"
                },
                "company": "Sport En Art",
                "date": "2016-10-21",
                "status": "renewal",
                "verified": false,
                "activity": 100,
                "representative": {
                    "name": "Onyama Limba",
                    "image": "onyamalimba.png"
                },
                "balance": 4609
            },
            {
                "id": 1028,
                "name": "Willow Kusko",
                "country": {
                    "name": "Romania",
                    "code": "ro"
                },
                "company": "U Pull It",
                "date": "2020-04-11",
                "status": "qualified",
                "verified": true,
                "activity": 7,
                "representative": {
                    "name": "Onyama Limba",
                    "image": "onyamalimba.png"
                },
                "balance": 17565
            },
            {
                "id": 1035,
                "name": "Solange Shinko",
                "country": {
                    "name": "Cameroon",
                    "code": "cm"
                },
                "company": "Mosocco, Ronald A",
                "date": "2015-02-12",
                "status": "qualified",
                "verified": true,
                "activity": 32,
                "representative": {
                    "name": "Onyama Limba",
                    "image": "onyamalimba.png"
                },
                "balance": 34072
            },
            {
                "id": 1045,
                "name": "Fatima Saylors",
                "country": {
                    "name": "Canada",
                    "code": "ca"
                },
                "company": "Stanton, James D Esq",
                "date": "2019-07-10",
                "status": "renewal",
                "verified": true,
                "activity": 93,
                "representative": {
                    "name": "Onyama Limba",
                    "image": "onyamalimba.png"
                },
                "balance": 52343
            },
            {
                "id": 1017,
                "name": "Gladys Rim",
                "country": {
                    "name": "Netherlands",
                    "code": "nl"
                },
                "company": "T M Byxbee Company Pc",
                "date": "2020-02-27",
                "status": "renewal",
                "verified": true,
                "activity": 48,
                "representative": {
                    "name": "Stephen Shaw",
                    "image": "stephenshaw.png"
                },
                "balance": 27381
            },
            {
                "id": 1024,
                "name": "Alisha Slusarski",
                "country": {
                    "name": "Iceland",
                    "code": "is"
                },
                "company": "Wtlz Power 107 Fm",
                "date": "2018-03-27",
                "status": "qualified",
                "verified": true,
                "activity": 7,
                "representative": {
                    "name": "Stephen Shaw",
                    "image": "stephenshaw.png"
                },
                "balance": 91691
            },
            {
                "id": 1043,
                "name": "Lavera Perin",
                "country": {
                    "name": "Vietnam",
                    "code": "vn"
                },
                "company": "Abc Enterprises Inc",
                "date": "2018-04-10",
                "status": "qualified",
                "verified": false,
                "activity": 71,
                "representative": {
                    "name": "Stephen Shaw",
                    "image": "stephenshaw.png"
                },
                "balance": 35740
            },
            {
                "id": 1048,
                "name": "Emerson Bowley",
                "country": {
                    "name": "Finland",
                    "code": "fi"
                },
                "company": "Knights Inn",
                "date": "2018-11-24",
                "status": "new",
                "verified": false,
                "activity": 63,
                "representative": {
                    "name": "Stephen Shaw",
                    "image": "stephenshaw.png"
                },
                "balance": 78069
            },
            {
                "id": 1003,
                "name": "Lenna Paprocki",
                "country": {
                    "name": "Slovenia",
                    "code": "si"
                },
                "company": "Feltz Printing Service",
                "date": "2020-09-15",
                "status": "new",
                "verified": false,
                "activity": 37,
                "representative": {
                    "name": "Xuxue Feng",
                    "image": "xuxuefeng.png"
                },
                "balance": 88521
            },
            {
                "id": 1019,
                "name": "Fletcher Flosi",
                "country": {
                    "name": "Argentina",
                    "code": "ar"
                },
                "company": "Post Box Services Plus",
                "date": "2016-01-04",
                "status": "renewal",
                "verified": true,
                "activity": 19,
                "representative": {
                    "name": "Xuxue Feng",
                    "image": "xuxuefeng.png"
                },
                "balance": 67783
            },
            {
                "id": 1032,
                "name": "Ernie Stenseth",
                "country": {
                    "name": "Australia",
                    "code": "au"
                },
                "company": "Knwz Newsradio",
                "date": "2018-06-06",
                "status": "renewal",
                "verified": true,
                "activity": 68,
                "representative": {
                    "name": "Xuxue Feng",
                    "image": "xuxuefeng.png"
                },
                "balance": 76017
            },
            {
                "id": 1040,
                "name": "Youlanda Schemmer",
                "country": {
                    "name": "Bolivia",
                    "code": "bo"
                },
                "company": "Tri M Tool Inc",
                "date": "2017-12-15",
                "status": "negotiation",
                "verified": true,
                "activity": 49,
                "representative": {
                    "name": "Xuxue Feng",
                    "image": "xuxuefeng.png"
                },
                "balance": 19208
            },
            {
                "id": 1046,
                "name": "Jina Briddick",
                "country": {
                    "name": "Mexico",
                    "code": "mx"
                },
                "company": "Grace Pastries Inc",
                "date": "2018-02-19",
                "status": "unqualified",
                "verified": false,
                "activity": 97,
                "representative": {
                    "name": "Xuxue Feng",
                    "image": "xuxuefeng.png"
                },
                "balance": 53966
            },
            {
                "id": 1047,
                "name": "Kanisha Waycott",
                "country": {
                    "name": "Ecuador",
                    "code": "ec"
                },
                "company": "Schroer, Gene E Esq",
                "date": "2019-11-27",
                "status": "new",
                "verified": false,
                "activity": 80,
                "representative": {
                    "name": "Xuxue Feng",
                    "image": "xuxuefeng.png"
                },
                "balance": 9920
            }
        ];
    }

    LoadKyTruoc() {
        if (this.context.item.FrequencyTypeId != null) {
            var date = moment(new Date()).format('DD/MM/YYYY');
            var prevDate = "01/01/2019";
            switch (this.context.item.FrequencyTypeId) {
                case 6:
                    var mNumber = moment(date, "DD/MM/YYYY").week();
                    if (mNumber == 1) {
                        var mNumber = moment(date, "DD/MM/YYYY").add(-7, 'days').week();
                    }
                    this.frequencies = Array.from(Array(mNumber).keys()).slice(1);
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);
                    break;
                case 7:
                    var mNumber = 0;
                    if (moment(date, "DD/MM/YYYY").date() > 16) {
                        mNumber = moment(date, "DD/MM/YYYY").month() + 2;
                    } else {
                        mNumber = moment(date, "DD/MM/YYYY").month() + 1;
                    }
                    this.frequencies = Array.from(Array(mNumber).keys()).slice(1);
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);
                    break;
                case 3:
                    var mNumber = moment(date, "DD/MM/YYYY").month() + 1;
                    this.frequencies = Array.from(Array(mNumber).keys()).slice(1);
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);

                    var prevArr = Array.from(Array(13).keys()).slice(1);
                    prevArr = prevArr.htcConvert(this.context.item.FrequencyTypeId, prevDate);
                    this.frequencies = prevArr.concat(this.frequencies);
                    break;
                case 4:
                    var mNumber = moment(date, "DD/MM/YYYY").quarter();
                    this.frequencies = Array.from(Array(mNumber).keys()).slice(1);
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);
                    break;
                case 5:
                    var mNumber = moment(date, "DD/MM/YYYY").year();
                    this.frequencies = [mNumber - 2, mNumber - 1];
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);
                    break;
            }
        }
    }

    //  convertArrOjb(this){
    //     return this.map(function (e) {
    //         var obj = { Id: e, Name: e };
    //         return obj;
    //     });
    // }

    initScroll() {
        // $(document).ready(function () {
        //     $("#fixTable").tableHeadFixer({ "head": true, "left": 2 });
        // });

    }
    ngOnInit() {
        var that = this;
        $(document).ready(function () {

            $('body').tooltip({ selector: '[data-toggle="tooltip"]' })

            // $('#input-date').datetimepicker({
            //     format: 'YYYY',
            //     locale: 'vi',
            //     maxDate: new Date()
            // });
        });

        var date = new Date();

        this.currentMonth = moment(date, "DD/MM/YYYY").month() + 1;
        this.currentYear = moment(date).format('YYYY');

        this.inputDate = date;

        var that = this;
        $('#tableContent').on('change', '#numberInput', () => {
            var valueId = $(this).closest('div').attr('id');
            that.values.forEach((element: { MapValueId: any[]; }) => {
                element.MapValueId.forEach((element1: { ValueMapId: any; NumberValue: any; }) => {
                    if (element1.ValueMapId == valueId) {
                        element1.NumberValue = $('#numberInput').val();;
                    }
                });
            });
        });
        $('#tableContent').on('change', '#textInput', () => {
            var valueId = $(this).closest('div').attr('id');
            that.values.forEach((element: { MapValueId: any[]; }) => {
                element.MapValueId.forEach((element1: { ValueMapId: any; NumberValue: any; }) => {
                    if (element1.ValueMapId == valueId) {
                        element1.NumberValue = $('#textInput').val();;
                    }
                });
            });
        });
        $(function () {
            var id = "#ioc-input-modal";
            var dialog = $(id).closest(".modal-dialog")[0];
            $(dialog).addClass("modal-dialog-9");
            // set chiều cao cho modal
            $(id).height(window.innerHeight - 300);
            window.onresize = (e: any) => {
                $(id).height(window.innerHeight - 300);
            };
        });

        this.getDetailTemplate(this.context.item.Id);
    }

    getDetailTemplate(id: string) {
        var that = this;
        if (this.hasPermisionDetail) // Xem theo phòng --- GetPropertyValueByTemplateId_Phong --- Hồng kêu Phòng không lấy dữ liệu từ Phường nữa // NEW_PHUONG_HS - Thống kê hồ sơ một cửa (Tháng)
        {
            this.isDisabled = true;
            var data = {
                DocumentTemplateId: id,
                InputYear:  moment(this.inputDate).format('YYYY'),
                SelectedOrganizationId: this.defaultOrganization == undefined ? null : this.defaultOrganization.Id
            };
            this.http.post2('DocumentTemplateNew/GetPropertyValueByTemplateNewId', data, (kq: any) => {
                if (kq.Code == 200) {
                    this.isDisabled = false;
                    if (kq.Result != null) {
                        this.listMonth = kq.Result.ListMonth;
                        this.values = kq.Result.PropertyIdsNew;

                        this.defaultHasIns = kq.Result.HasIns;
                        if (this.defaultHasIns) {
                            // Load Đơn vị
                            this.organizations = kq.Result.ListIns;
                        }
                        that.initScroll();
                    }
                }
                else {
                    this.isDisabled = false;
                }
            }, (error: any) => {
                this.isDisabled = false;
            }
            );
        }
        else // Xem theo phường
        {
            this.isDisabled = true;
            var data = {
                DocumentTemplateId: id,
                InputYear:  moment(this.inputDate).format('YYYY'),
                SelectedOrganizationId: this.defaultOrganization == undefined ? null : this.defaultOrganization.Id
            };
            this.http.post2('DocumentTemplateNew/GetPropertyValueByTemplateNewId', data, (kq: { Code: number; Result: { ListMonth: any; PropertyIdsNew: any; HasIns: any; ListIns: any; } | null; }) => {
                if (kq.Code == 200) {
                    this.isDisabled = false;
                    if (kq.Result != null) {
                        this.values = kq.Result;
                      
                        that.initScroll();
                    }
                }
                else {
                    this.isDisabled = false;
                }
            }, (error: any) => {
                this.isDisabled = false;
            }
            );
        }


    }

    onChangeOrganizations(value: { value: { Id: any; }; }) {
        this.defaultOrganization = { Id: value.value.Id };
        this.getDetailTemplate(this.context.item.Id);
    }

    submit() {
        var id = "";
        if (this.context.item != null) {
            id = this.context.item.Id;
        }
        var listMapValue: any[] = [];
        var tempValues: any[] = [];

        this.values.forEach((el: { IsDocumentTemplate: any; ListMonth: any[]; }) => {
            if (!el.IsDocumentTemplate) {
                el.ListMonth.forEach((el1: { Month: any; ListMapValueId: any[]; }) => {
                    var month = el1.Month;
                    el1.ListMapValueId.forEach((el2: { Month: any; Year: any; DataType: number; RandomId: string; NumberValue: number; StringValue: string; }) => {
                        el2.Month = month;
                        el2.Year =  moment(this.inputDate).format('YYYY');
                        if (el2.DataType == 0) {
                            var nValue = $("#" + el2.RandomId).find("input").val();
                            el2.NumberValue = (nValue == undefined || nValue == "") ? 0 : $("#" + el2.RandomId).find("input").val();
                            el2.StringValue = "";
                        } else if (el2.DataType == 1) {
                            el2.StringValue = $("#" + el2.RandomId).find("input").val();
                            el2.NumberValue = 0;
                        }
                        listMapValue.push(el2);
                        tempValues.push(el2);
                    });
                });
            }
        });

        listMapValue.forEach(element1 => {
            // element1.InputDate =  moment(this.inputDate).format('YYYY');
            if (element1.DataType == 2 && element1.Recipe != null && element1.Recipe.indexOf("+")) {
                try {
                    var sum = 0;
                    var arrNo = element1.Recipe.split('+');
                    var month = element1.Month;
                    var year = element1.Year;
                    arrNo.forEach((arrN: string) => {
                        tempValues.forEach(element3 => {
                            if (element3.CodeId == arrN.trim() && element3.Month == month && element3.Year == year) {
                                sum += parseFloat(element3.NumberValue);
                            }
                        });
                    });
                    element1.NumberValue = sum;
                    element1.StringValue = element1.Recipe;
                } catch {
                    element1.NumberValue = 0;
                }
            }
        });

        var data = {
            DocumentTemplateId: id,
            Json: JSON.stringify(listMapValue)
        }

        this.isDisabled = true;

        this.http.post('IOC/SaveInputDocumentTemplate', data, (kq: { Result: { Code: number; } | null; }) => {
            if (kq.Result == null) {
                this.isDisabled = false;
                this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra" });
            }
            else {
                if (kq.Result.Code == 200) {
                    this.isDisabled = false;
                    this.message.add({ severity: 'success', summary: 'Error', detail: "Thêm thành công!" });
                    this.getDetailTemplate(id);
                } else {
                    this.isDisabled = false;
                    this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra" });
                }
            }

        }, (error: any) => {
            this.isDisabled = false;
            this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra" });
        }
        );
    }

    onChangeDate() {
        // if ($("#input-date").data("DateTimePicker").date() != undefined) {
        //     this.inputDate = $("#input-date").data("DateTimePicker").date().format('YYYY');
        //     if (this.context.item != undefined && this.context.item.Id != null) {
        //         this.getDetailTemplate(this.context.item.Id);
        //     }
        // }

        if (this.inputDate) {
            if (this.context.item != undefined && this.context.item.Id != null) {
                //this.LoadKyTruoc(this.inputDate);
                this.getDetailTemplate(this.context.item.Id);
            }
        }
    }

    setMaxWidth() {
        if (this.listMonth != null && this.listMonth.length > 1) {
            var maxW = (460 * this.listMonth.length) < 2000 ? 2000 : (460 * this.listMonth.length);
            return {
                'width': maxW + 'px'
            };
        } else {
            return {
                'max-width': '100%'
            };

        }
    }

    setPercentWidthSTT() {
        if (this.listMonth != null && this.listMonth.length > 3) {
            return {
                'width': '1%'
            };
        } else {
            return {
                'width': '5%'
            };

        }
    }

    setPercentWidthChiSo() {
        if (this.listMonth != null && this.listMonth.length > 3) {
            return {
                'width': '20%'
            };
        } else {
            return {
                'width': '40%'
            };

        }
    }

    setWidthColContent() {
        if (this.listMonth != null && this.listMonth.length > 1) {
            return {
                'width': '395px'
            };
        } else {
            return {
                'width': '30%'
            };

        }
    }

    setWidthContent() {
        if (this.listMonth != null && this.listMonth.length > 1) {
            return {
                'width': '200px'
            };
        } else {
            return {
                'width': '30%'
            };

        }
    }

    setColorButton(value: any) {
        if (!value) {
            return {
                'color': 'red'
            };
        }
        return {
            'color': 'black'
        };
    }

    iocInputList(randomId: any, propertyId: any, propertyName: any, property2Id: any, property2Name: any, dataType: any, unitId: any, month: string | number, year: string) {

        // var id = "";
        // if (this.context.item != null) {
        //     id = this.context.item.Id;
        // }

        // if (month < 10) {
        //     month = '0' + month;
        // }

        // this.modal.open(IOCInputListModal,
        //     overlayConfigFactory({
        //         item: {
        //             TemplateId: this.context.item.Id,
        //             InputDate: '01/' + month + '/' + year,
        //             PropertyId: propertyId,
        //             Property2Id: property2Id,
        //             Property2Name: property2Name,
        //             DataType: dataType,
        //             UnitId: unitId,
        //             PropertyName: propertyName
        //         },
        //         isAdd: true,
        //         code: ""
        //     },
        //         BSModalContext))
        //     .then((resultPromise: { result: Promise<any>; }) => {
        //         resultPromise.result.then((result: { Data: any; JsonDescription: any; }) => {
        //             var chooseValue = result.Data;
        //             this.values.forEach((element: { PropertyId: any; ListMonth: string | any[]; MapValueId: any[]; }) => {
        //                 if (element.PropertyId == chooseValue.PropertyId) {

        //                     for (var i = 0; i < element.ListMonth.length; i++) {
        //                         if (element.ListMonth[i].Month == month && element.ListMonth[i].Year == year) {
        //                             for (var j = 0; j < element.ListMonth[i].ListMapValueId.length; j++) {
        //                                 if (element.ListMonth[i].ListMapValueId[j].RandomId == randomId) {
        //                                     if (element.ListMonth[i].ListMapValueId[j].DataType == 1) {
        //                                         if (chooseValue.SValue[0] != undefined) {
        //                                             element.ListMonth[i].ListMapValueId[j].StringValue = chooseValue.SValue[0];
        //                                         }
        //                                     }
        //                                     else {
        //                                         if (chooseValue.NValue[0] != undefined) {
        //                                             element.ListMonth[i].ListMapValueId[j].NumberValue = chooseValue.NValue[0];
        //                                         }
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                     }

        //                     element.MapValueId.forEach((element1: { IsChooseValue: boolean; JsonDescription: any; }) => {
        //                         element1.IsChooseValue = true;
        //                         element1.JsonDescription = result.JsonDescription;
        //                     });
        //                 }
        //             });

        //         }).catch(() => {

        //         })
        //     },
        //         () => { }
        //     );
    }

    iocInputListDetail(documentTemplateId: any, randomId: any, propertyId: any, propertyName: any, property2Id: any, property2Name: any, dataType: any, unitId: any, month: string | number, year: string) {

        // var id = "";
        // if (this.context.item != null) {
        //     id = this.context.item.Id;
        // }

        // if (month < 10) {
        //     month = '0' + month;
        // }

        // this.modal.open(IOCInputListDetailModal,
        //     overlayConfigFactory({
        //         item: {
        //             DocumentTemplateId: documentTemplateId,
        //             TemplateId: this.context.item.Id,
        //             InputDate: '01/' + month + '/' + year,
        //             PropertyId: propertyId,
        //             Property2Id: property2Id,
        //             Property2Name: property2Name,
        //             DataType: dataType,
        //             UnitId: unitId,
        //             PropertyName: propertyName
        //         },
        //         isAdd: true,
        //         code: ""
        //     },
        //         BSModalContext))
        //     .then((resultPromise: { result: Promise<any>; }) => {
        //         resultPromise.result.then((result: any) => {
        //             this.getDetailTemplate(this.context.item.Id);

        //         }).catch(() => {

        //         })
        //     },
        //         () => { }
        //     );
    }

    cancel() {
        this.ref.close();
    }

    getToolTipData(mValue: { PropertyId: any; Property2Id: any; Property2Name: any; DataType: any; UnitId: any; PropertyName: any; }, abc: any): any {
        var value = {
            DocumentTemplateId: this.context.item.Id,
            InputDate:  moment(this.inputDate).format('YYYY'),
            PropertyId: mValue.PropertyId,
            Property2Id: mValue.Property2Id,
            Property2Name: mValue.Property2Name,
            DataType: mValue.DataType,
            UnitId: mValue.UnitId,
            PropertyName: mValue.PropertyName
        };

        var data = {
            Json: JSON.stringify(value)
        };
        this.http.post('IOC/GetToolTipByPropertyId', data, (kq: { Code: number; }) => {
            if (kq.Code == 200) {

            }
            else {
            }
        }, (error: any) => {
        }
        );
    }

    over(mValue: any) {
        var abc = "";
        this.globalValue = mValue;
    }

    editValue(month: string, year: string) {

        this.confirmationService.confirm({
            message: "Bạn có chắc chắn sửa dữ liệu tháng " + month + " năm " + year + " ?",
            accept: () => {
                $('.' + month + '_' + year).each(() => {
                    //test
                    $(this).removeAttr("readonly");
                });
            }
        });
    }

    retrieveKeyName(obj: any) {
        const results = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && !isNaN(+key)) {
                results.push(key);
            }
        }
        return results;
    }
}
