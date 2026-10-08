import { Component, ViewEncapsulation } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { HttpService } from 'src/app/services';
import { ResultCode, ResultModel } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { DialogService } from 'primeng/dynamicdialog';
import { hkdStatuses, loaiHinhs, traGiayPhepKDs } from 'src/app/shared/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/modules';
import { get } from 'lodash';

@Component({
    standalone: false,
    selector: 'giay-chung-nhan-modal',
    templateUrl: 'giay-chung-nhan.modal.html',
    styleUrls: ['./giay-chung-nhan.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GiayChungNhanModal {
    item: any = {};
    districts: any = [];
    wards: any = [];
    capQls: any = [];
    coQuans: any = [];
    canBos: any = [];
    linhvucs: any[] = [];
    entityForm: FormGroup = new FormGroup({});
    saving = false;
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        public dialogService: DialogService
    ) {

        this.item = this.config.data.item;

    }
    ngOnInit() {
        this.initForm();
        this.loadDistrict();
        this.linhVucs();
        this.coQuan();
        this.canBo();
        this.capQl();

    }

    loadDistrict() {
        this.http.post(
            'Location/GetCities',
            { ParentCode: 'LDG' },
            (res: any) => {
                this.districts = res.Result || [];
                if (!this.entityForm.value.MaQuanHuyen) {
                    this.entityForm.controls["MaQuanHuyen"].setValue(res.Result[0]?.Id);
                }
                this.loadWards();
            },
            (error: any) => {
                // throw error;
            }
        );
    }
    loadWards() {
        this.wards = [];
        this.http.post(
            'UserLocation/GetWards',
            { ParentId: this.entityForm.value.MaQuanHuyen },
            (res: any) => {
                this.wards = res.Result || [];
                if (!this.entityForm.value.MaPhuongXa) {
                    this.entityForm.controls["MaPhuongXa"].setValue(res.Result[0]?.Id);
                }
            },
            (error: any) => {
                // throw error;
            }
        );
    }
    coQuan() {
        this.http.post(
            'GeneralCategory/Items',
            {
                Code: "CoQuanQuanLy"
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.coQuans = result.Result;
                    if (!this.entityForm.value.DonViQuanLyId) {
                        this.entityForm.controls["DonViQuanLyId"].setValue(result.Result[0]?.Id);
                    }
                }
            },
            () => { }
        );
    }
    canBo() {
        this.http.post(
            'GeneralCategory/Items',
            {
                Code: "CanBoQuanLy"
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.canBos = result.Result;
                    if (!this.entityForm.value.CanBoQuanLyId) {
                        this.entityForm.controls["CanBoQuanLyId"].setValue(result.Result[0]?.Id);
                    }

                }
            },
            () => { }
        );
    }
    capQl() {
        this.http.post(
            'GeneralCategory/Items',
            {
                Code: "CapQuanLy"
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.capQls = result.Result;
                    if (!this.entityForm.value.CapQuanLyId) {
                        this.entityForm.controls["CapQuanLyId"].setValue(result.Result[0]?.Id);
                    }
                }
            },
            () => { }
        );
    }
    linhVucs() {
        this.http.post(
            'GeneralCategory/Items',
            {
                Code: "LinhVuc"
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.linhvucs = result.Result;
                }
            },
            () => { }
        );
    }
    cancel() {
        this.ref.close();
    }
    onKeyUp(event: any) {
        if (event.keyCode == 13) {
        }
    }
    private initForm(): void {
        const entity = get(this.config, 'data.item', {});
        this.entityForm = new FormGroup({
            Id: new FormControl(
                entity.Id || '',
            ),
            TenDoanhNghiep: new FormControl(
                entity.TenDoanhNghiep,
                Validators.compose([CustomValidators.required()])
            ),
            MaSoDoanhNghiep: new FormControl(
                entity.MaSoDoanhNghiep,
                Validators.compose([CustomValidators.required()])
            ),
            ChuCoSo: new FormControl(
                entity.ChuCoSo || '',
            ),
            SoNha: new FormControl(
                entity.SoNha || '',
            ),
            DienThoai: new FormControl(
                entity.DienThoai || '',
            ),
            Email: new FormControl(
                entity.Email || '',
            ),
            LinhVucIds: new FormControl(
                entity.LinhVucIds || [],
            ),
            MaPhuongXa: new FormControl(
                entity.MaPhuongXa,
                Validators.compose([CustomValidators.required()])
            ),
            MaQuanHuyen: new FormControl(
                entity.MaQuanHuyen,
                Validators.compose([CustomValidators.required()])
            ),
            DonViQuanLyId: new FormControl(
                entity.DonViQuanLyId,
                Validators.compose([CustomValidators.required()])
            ),
            CapQuanLyId: new FormControl(
                entity.CapQuanLyId,
                Validators.compose([CustomValidators.required()])
            ),
            CanBoQuanLyId: new FormControl(
                entity.CanBoQuanLyId,
            ),
        });
        this.loadDistrict();
    }

    submit() {
        if (this.entityForm.invalid) {
            this.entityForm.markAllAsTouched();
            return;
        }
        this.saving = true;
        const entity = this.entityForm.value;

        this.http.post('DoanhNghiep/add',
            entity,
            (res: any) => {
                this.saving = false;
                if (res.Code == 200) {
                    this.toastr.success('Lưu thành công', 'Thành công', {
                        timeOut: 3000,
                    });
                    entity.NoiDungBienBan = entity.BienBanTam;
                    entity.NoiDungBienBanQuyetToan = entity.BienBanQuyetToan;
                    this.ref.close(entity);
                } else {
                    this.toastr.error(res.Message, 'Thất bại', {
                        timeOut: 3000,
                    });
                }
            },
            (err: any) => {
                this.saving = false;
                this.toastr.error('Vui lòng kiểm tra kết nối!', 'Thất bại', {
                    timeOut: 3000,
                });
            }
        );
    }


}
