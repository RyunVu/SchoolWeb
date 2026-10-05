import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, BaseService, HttpService } from 'src/app/services';
import { OTPCheckModal } from '../../systems/user/otpcheck.modal';
import { UserModal } from '../../systems/user/user.modal';
import { FeedbackDetailModal } from './feedback-detail.modal';

import { HttpClient } from '@angular/common/http';
import * as JSZip from 'jszip';
import * as moment from 'moment';
import * as fs from 'file-saver';
import { FeedbackChiDaoModal } from './feedback-chidao.modal';
import { FeedbackChiaSeModal } from './feedback-chiase.modal';
import { FeedbackChuyenDonViModal } from './feedback-chuyendonvi.modal';
import { FeedbackQuaTrinhXuLyModal } from './feedback-quatrinhxuly.modal';
import { FeedbackBaoCaoModal } from './feedback-baocao.modal';
import { FeedbackPhatHanhModal } from './feedback-phathanh.modal';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-feedback-detail',
    templateUrl: './feedback-detail.component.html',
    styleUrls: ['./feedback-detail.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FeedbackDetailComponent extends BasePage {
    
    item: any;
    images: any;
    responsiveOptions: any[] = [
        {
            breakpoint: '4000px',
            numVisible: 5
        },
        {
            breakpoint: '1366px',
            numVisible: 4
        },
        {
            breakpoint: '1200px',
            numVisible: 2
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '450px',
            numVisible: 2
        }
    ];

    routeSub1: any;
    id: any;
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
        public httpClient: HttpClient
    ) {
        super(router, route, http, message);
        this.routeSub1 = this.route.params.subscribe(params => {
            this.id = params['id'];
        });
    }

    loadData() {
        this.http.post("FeedbackAdmin/Detail", {
            "Id": this.id
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.item = result.Result;
                this.images = this.item.ImageList;
            }
        }, () => {
        });
    }
    ngOnDestroy() {
        console.log('destroy');
        this.routeSub1.unsubscribe();
    }
    
    onInit(): void {
    }

    loadPage(): void {
        this.loadData();
    }
   
    openPopupInfo(item:any) {
        const ref = this.dialogService.open(FeedbackDetailModal, {
            data: {
                items: item
            },
            header: 'Thông tin cán bộ',
            width: '600px'
        }).onClose.subscribe((data: any) => {
            
        });
    }
    downloadFile(item: any) {
        console.log(item);
        this.httpClient.get(`${environment.mediaUrl}${item.Url}`, { responseType: 'blob' }).subscribe((data) => {
            if (data && data != undefined && data != null) {
                fs.saveAs(data, item.Name);
            }
        });
    }

    ldButton = false;
    downloadFiles() {
        var zip = new JSZip();
        var l = this.images.length;
        this.ldButton = true;
        this.images.forEach((element: any, index: any) => {
            this.httpClient.get(`${environment.mediaUrl}${element.Url}`, { responseType: 'blob' }).subscribe((data) => {
                zip.file(element.Name, data, {
                    binary: true
                });

                if(index == l - 1) {
                    setTimeout(() => {
                        zip
                        .generateAsync({
                            type: "blob"
                        })
                        .then((content) => {
                            fs.saveAs(content, moment().format('YYYYMMDD_HHmmss') + ".zip");
                            this.ldButton = false;
                        });
                    }, 500);
                }
            });
        });
    }

    ChiDao() {
        console.log(this.item);
        if(this.item != null) {
            const ref = this.dialogService.open(FeedbackChiDaoModal, {
                data: {
                    items: this.item.Id
                },
                header: 'Nội dung chỉ đạo',
                width: '70%'
            }).onClose.subscribe((data: any) => {
                this.loadData();
            });
        }
    }

    ChiaSe() {
        if(this.item != null) {
            const ref = this.dialogService.open(FeedbackChiaSeModal, {
                data: {
                    items: this.item.Id
                },
                header: 'Chia sẻ',
                width: '70%'
            }).onClose.subscribe((data: any) => {
                this.loadData();
            });
        }
    }

    ChuyenDonVi() {
        if(this.item != null) {
            const ref = this.dialogService.open(FeedbackChuyenDonViModal, {
                data: {
                    items: this.item.Id
                },
                header: 'Đổi đơn vị và lĩnh vực xử lý',
                width: '70%'
            }).onClose.subscribe((data: any) => {
                this.loadData();
            });
        }
    }

    BaoCao() {
        if(this.item != null) {
            const ref = this.dialogService.open(FeedbackBaoCaoModal, {
                data: {
                    items: this.item.Id
                },
                header: 'Báo cáo quá trình xử lý công việc',
                width: '70%',
                styleClass: 'custom-dialog'
            }).onClose.subscribe((data: any) => {
                this.loadData();
            });
        }
    }

    QuaTrinhXuLy() {
        if(this.item != null) {
            const ref = this.dialogService.open(FeedbackQuaTrinhXuLyModal, {
                data: {
                    items: this.item.Id
                },
                header: 'Quá trình xử lý',
                width: '70%'
            }).onClose.subscribe((data: any) => {
                this.loadData();
            });
        }
    }

    KetThuc() {
        if(this.item != null) {
            this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn kết thúc phản ánh ' + this.item.No + '?',
            accept: () => {
                this.http.post("FeedbackAdmin/Finish",
                {
                    FeedbackId: this.item.Id,
                },
                (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                    this.loadData();
                    }
                }, () => {
                });
            }
            });
        }
    }

    MoKetThuc() {
        if(this.item != null) {
            this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn mở kết thúc phản ánh ' + this.item.No + '?',
            accept: () => {
                this.http.post("FeedbackAdmin/unFinish",
                {
                    FeedbackId: this.item.Id,
                },
                (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                    this.loadData();
                    }
                }, () => {
                });
            }
            });
        }
    }

    ChuyenKhongDung() {
        if(this.item != null) {
            this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn chuyển không đúng phản ánh ' + this.item.No + '?',
            accept: () => {
                this.http.post("FeedbackAdmin/incorrect",
                {
                    FeedbackId: this.item.Id,
                },
                (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                    this.loadData();
                    }
                }, () => {
                });
            }
            });
        }
    }

    ChuyenDung() {
        if(this.item != null) {
            this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn chuyển đúng phản ánh ' + this.item.No + '?',
            accept: () => {
                this.http.post("FeedbackAdmin/correct",
                {
                    FeedbackId: this.item.Id,
                },
                (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                    this.loadData();
                    }
                }, () => {
                });
            }
            });
        }
    }

    ThuHoiPhatHanh() {
        if(this.item != null) {
            this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn thu hồi phát hành phản ánh ' + this.item.No + '?',
            accept: () => {
                this.http.post("FeedbackAdmin/RecallFeedback",
                {
                    FeedbackId: this.item.Id,
                },
                (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                    this.loadData();
                    }
                }, () => {
                });
            }
            });
        }
    }

    PhanAnhTieuBieu() {
        if(this.item != null) {
            this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn đưa phản ánh tiêu biểu ' + this.item.No + '?',
            accept: () => {
                this.http.post("FeedbackAdmin/RepresentativeFeedback",
                {
                    Id: this.item.Id,
                },
                (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                    this.loadData();
                    }
                }, () => {
                });
            }
            });
        }
    }
    
    ThuHoiPhanAnhTieuBieu() {
        if(this.item != null) {
            this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn thu hồi phản ánh tiêu biểu ' + this.item.No + '?',
            accept: () => {
                this.http.post("FeedbackAdmin/UnRepresentativeFeedback",
                {
                    Id: this.item.Id,
                },
                (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                    this.loadData();
                    }
                }, () => {
                });
            }
            });
        }
    }

    DuyetPhanAnh() {
        if(this.item != null) {
            this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn duyệt phản ánh ' + this.item.No + '?',
            accept: () => {
                this.http.post("FeedbackAdmin/ConfirmPublic",
                {
                    Id: this.item.Id,
                },
                (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                    this.loadData();
                    }
                }, () => {
                });
            }
            });
        }
    }

    ThuHoiDuyetPhanAnh() {
        if(this.item != null) {
            this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn thu hồi duyệt phản ánh ' + this.item.No + '?',
            accept: () => {
                this.http.post("FeedbackAdmin/UnConfirmPublic",
                {
                    FeedbackId: this.item.Id,
                },
                (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                    this.loadData();
                    }
                }, () => {
                });
            }
            });
        }
    }

    SoanThaoPhatHanh() {
        if(this.item != null) {
            const ref = this.dialogService.open(FeedbackPhatHanhModal, {
                data: this.item,
                header: 'Phát hành phản ánh',
                width: '70%'
            }).onClose.subscribe((data: any) => {
                this.loadData();
            });
        }
    }
}
