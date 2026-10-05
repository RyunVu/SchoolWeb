import { ConstructionStatus, FeeStatus, HKDStatus } from './types';

export const constructionStatuses = [
    {
        label: 'Tất cả',
        value: '',
    },
    {
        label: 'Chưa xây',
        value: ConstructionStatus.NotBuild,
    },
    {
        label: 'Đã định vị móng',
        value: ConstructionStatus.Building,
    },
    {
        label: 'Đã xây',
        value: ConstructionStatus.Built,
    },
];

export const feeStatuses = [
    {
        label: 'Tất cả',
        value: '',
    },
    {
        label: 'Chưa thu',
        value: FeeStatus.NotPaid,
    },
    {
        label: 'Đang thu',
        value: FeeStatus.Collecting,
    },
    {
        label: 'Đã thu',
        value: FeeStatus.Paid,
    },
];
export const hkdStatuses = [
    {
        label: 'Tất cả',
        value: '',
        labelDBI: '',
    },
    {
        label: 'Đang hoạt động',
        value: HKDStatus.DangHoatDong,
        feildName: 'DangHoatDong',
        labelDBI: 'NNT đang hoạt động',
    },
    {
        label: 'Ngừng HĐ và đã hoàn thành thủ tục chấm dứt hiệu lực',
        value: HKDStatus.NgungHDXongThuTuc,
        feildName: 'NgungHDXongThuTuc',
        labelDBI: 'NNT ngừng hoạt động và đã hoàn thành thủ tục chấm dứt hiệu l',
    },
    {
        label: 'Ngừng HĐ nhưng chưa hoàn thành thủ tục chấm dứt hiệu lực',
        value: HKDStatus.NgungHDChuaThuTuc,
        feildName: 'NgungHDChuaThuTuc',
        labelDBI: 'NNT ngừng HĐ nhưng chưa hoàn thành thủ tục chấm dứt hiệu lực',
    },
    {
        label: 'Đang hoạt động (chưa đầy đủ thủ tục cấp MST)',
        value: HKDStatus.DangHDChuaThuTuc,
        feildName: 'DangHDChuaThuTuc',
        labelDBI: 'NNT đang hoạt động (chưa đầy đủ thủ tục cấp MST)',
    },
    {
        label: 'Tạm ngừng HĐ có thời hạn',
        value: HKDStatus.TamNgungHoatDong,
        feildName: 'TamNgungHoatDong',
        labelDBI: 'NNT tạm ngừng KD có thời hạn',
    },
    {
        label: 'Không hoạt động tại địa chỉ đã đăng ký',
        value: HKDStatus.KhongHDTaiDCDK,
        feildName: 'KhongHDTaiDCDK',
        labelDBI: 'NNT không hoạt động tại địa chỉ đã đăng ký',
    },
];
export const loaiHinhs = [
    {
        Id: '',
        Label: 'Tất cả',
    },
    // {
    //     Id: 0,
    //     Label: 'Chưa xác định',
    // },
    {
        Id: 1,
        Label: 'Hộ khoán',
    },
    {
        Id: 2,
        Label: 'Hộ thu nhập thấp',
    },
    {
        Id: 3,
        Label: 'Hộ kê khai',
    },
];
export const hinhThucThiCong = [
    {
        Id: 0,
        Label: 'Có bao thầu Nguyên vật liệu',
    },
    {
        Id: 1,
        Label: 'Không bao thầu Nguyên vật liệu',
    },
];
export const quyDinhTrachNhiem = [
    {
        Id: 0,
        Label: 'Chủ công trình',
    },
    {
        Id: 1,
        Label: 'Chủ nhận thầu',
    },
];
export const coGCN = [
    {
        Id: '',
        Label: 'Tất cả',
    },
    {
        Id: 0,
        Label: 'Chưa có GCN',
    },
    {
        Id: 1,
        Label: 'Đã có GCN',
    },
];
export const loaiMaSoThue = [
    {
        Id: '',
        Label: 'Tất cả',
    },
    {
        Id: 0,
        Label: 'Chưa có mã số thuế',
    },
    {
        Id: 1,
        Label: 'Đã có mã số thuế',
    },
];
export const traGiayPhepKDs = [
    // {
    //     Id: null,
    //     Name: 'Không chọn',
    // },
    {
        Id: 1,
        Name: 'Chưa thực hiên ĐKT',
    },
    {
        Id: 2,
        Name: 'Không KD (GP vay vốn…)',
    },
];
export const coGiayMoi = [
    {
        Id: '',
        Label: 'Tất cả',
    },
    {
        Id: 0,
        Label: 'Chưa gửi Giấy mời',
    },
    {
        Id: 1,
        Label: 'Đã gửi Giấy mời',
    },
];
export const lyDoGiayMoi = [
    {
        Id: 0,
        Label: 'Đăng ký thuế, kê khai thuế',
    },
];
export const nguoiKyGiayMoi = [
    {
        Id: 0,
        Label: 'CHI CỤC TRƯỞNG',
    },
    {
        Id: 1,
        Label: 'PHÓ CHI CỤC TRƯỞNG',
    },
];
export const tinhTrangGCN = [
    {
        id: '',
        label: 'Tất cả',
    },
    {
        id: 'Cấp mới',
        label: 'Cấp mới',
    },
    {
        id: 'Chấm dứt',
        label: 'Chấm dứt',
    },
    {
        id: 'Cấp lại',
        label: 'Cấp lại',
    },
    {
        id: 'Import',
        label: 'Import',
    },
    {
        id: 'Thay đổi',
        label: 'Thay đổi',
    },
];
export const tinhTrangXayDung = [
    {
        Id: 0,
        Name: "Chưa xây"
    },
    {
        Id: 1,
        Name: "Đã định vị móng"
    },
    {
        Id: 2,
        Name: "Đã xây"
    },
    {
        Id: 6,
        Name: "Chưa gửi Giấy mời"
    },
    {
        Id: 5,
        Name: "Gửi Giấy mời nhưng chưa lên"
    },
    {
        Id: 4,
        Name: "Không tìm ra địa chỉ"
    },
    {
        Id: 3,
        Name: "Doanh nghiệp XD"
    },
    {
        Id: 7,
        Name: "Chưa phân loại"
    },
    {
        Id: -1,
        Name: "Trùng do cấp lại Giấy phép"
    },
    {
        Id: -2,
        Name: "Không XD (vay vốn)"
    }
];
// Lam Dong location
export const defaultLocation = {
    lat: 11.940419,
    lng: 108.458313,
};
