import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import {
  gmDefaultStyles,
  gmDarkStyles,
  populateBusinessFullAddress,
  SearchEntity,
} from 'src/app/shared';
import { defaultLocation } from 'src/app/shared/constants';
import { Location } from '@angular/common';
import { HomePageService } from '../../services';
import { GalleriaModule } from 'primeng/galleria';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  standalone: false,
  selector: 'app-chitiet-page',
  templateUrl: './chitiet-page.component.html',
  styleUrls: ['./chitiet-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChiTietPageComponent implements OnInit, OnDestroy {

  type: any = 0;
  person: any = 0;
  subtitle = "Tiểu sử";
  images: any = [
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Các đ.c Chủ trì dự HN trực tuyến sơ kết 6 tháng năm 2021.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Các đ.c Chủ trì dự HN trực tuyến sơ kết 6 tháng năm 2021.jpg", title: "Các đ.c Chủ trì dự HN trực tuyến sơ kết 6 tháng năm 2021" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Chủ trì kỳ họp lần thứ 11 nhiệm kỳ XI.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Chủ trì kỳ họp lần thứ 11 nhiệm kỳ XI.jpg", title: "Chủ trì kỳ họp lần thứ 11 nhiệm kỳ XI" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/đ.c Đặng Đức Hiệp phát biểu tại hội nghị tổng kết công tác năm 2022.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/đ.c Đặng Đức Hiệp phát biểu tại hội nghị tổng kết công tác năm 2022.jpg", title: "đ.c Đặng Đức Hiệp phát biểu tại hội nghị tổng kết công tác năm 2022" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Hoạt động đền ơn đáp nghĩa.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Hoạt động đền ơn đáp nghĩa.jpg", title: "Hoạt động đền ơn đáp nghĩa" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Hoạt động động viên các chốt kiểm soát chống dịch Covid 19.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Hoạt động động viên các chốt kiểm soát chống dịch Covid 19.jpg", title: "Hoạt động động viên các chốt kiểm soát chống dịch Covid 19" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/images2426808_2b_01.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/images2426808_2b_01.jpg", title: "Nội dung" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Thăm hỏi các chốt kiểm soát chống dịch Covid.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Thăm hỏi các chốt kiểm soát chống dịch Covid.jpg", title: "Thăm hỏi các chốt kiểm soát chống dịch Covid" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Trao quà động viên các lực lượng tuyến đầu chống dịch Covid 19.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Trao quà động viên các lực lượng tuyến đầu chống dịch Covid 19.jpg", title: "Trao quà động viên các lực lượng tuyến đầu chống dịch Covid 19" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2022.1.UBKT TINH UY (105).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2022.1.UBKT TINH UY (105).jpg", title: "2022.1.UBKT TINH UY (105)" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2022.1.UBKT TINH UY (106).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2022.1.UBKT TINH UY (106).jpg", title: "2022.1.UBKT TINH UY (106)" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (115).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (115).jpg", title: "2022.12.UBKT TINH UY (115)" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (116).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (116).jpg", title: "2022.12.UBKT TINH UY (116)" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (118).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (118).jpg", title: "2022.12.UBKT TINH UY (118)" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2023.2.UBKT TINH UY (136).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2023.2.UBKT TINH UY (136).jpg", title: "2023.2.UBKT TINH UY (136)" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2023.4.UBKT TINH UY (130).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2023.4.UBKT TINH UY (130).jpg", title: "2023.4.UBKT TINH UY (130)" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2023.5.UBKT TINH UY (130).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2023.5.UBKT TINH UY (130).jpg", title: "2023.5.UBKT TINH UY (130)" },
  ];
  images_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/12. ĐẶNG ĐỨC HIỆP - Chủ nhiệm Khóa XI 2020-2025/ĐC Hiệp (avatar 1).jpg"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/12. ĐẶNG ĐỨC HIỆP - Chủ nhiệm Khóa XI 2020-2025/ĐC Hiệp (avatar 2).JPG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/12. ĐẶNG ĐỨC HIỆP - Chủ nhiệm Khóa XI 2020-2025/đồng chí Đặng Đức Hiệp 3.JPG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/12. ĐẶNG ĐỨC HIỆP - Chủ nhiệm Khóa XI 2020-2025/đồng chí Đặng Đức Hiệp 4.JPG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/12. ĐẶNG ĐỨC HIỆP - Chủ nhiệm Khóa XI 2020-2025/đồng chí Đặng Đức Hiệp 7.JPG"},
  ]

  images2: any = [
    { id: 1, previewImageSrc: "assets/template/images/MaiVanNgoc/1.PNG", thumbnailImageSrc: "assets/template/images/MaiVanNgoc/1.PNG", title: "Các đồng chí nguyên lãnh đạo UBKTTU các khoá chụp hình lưu niệm với hội nghị" },
    { id: 1, previewImageSrc: "assets/template/images/MaiVanNgoc/2.PNG", thumbnailImageSrc: "assets/template/images/MaiVanNgoc/2.PNG", title: "Lễ kỷ niệm 55 năm ngày truyền thống Ngành Kiểm tra Đảng (16.10.2023)" },
    { id: 1, previewImageSrc: "assets/template/images/MaiVanNgoc/3.PNG", thumbnailImageSrc: "assets/template/images/MaiVanNgoc/3.PNG", title: "Lễ kỷ niệm lần thứ 54 năm ngày thành lập Ngành Kiểm tra của Đảng" },
  ];
  images2_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/MaiVanNgoc/1.PNG", thumbnailImageSrc: "assets/template/images/MaiVanNgoc/1.PNG", title: "Các đồng chí nguyên lãnh đạo UBKTTU các khoá chụp hình lưu niệm với hội nghị" },
    { id: 1, previewImageSrc: "assets/template/images/MaiVanNgoc/2.PNG", thumbnailImageSrc: "assets/template/images/MaiVanNgoc/2.PNG", title: "Lễ kỷ niệm 55 năm ngày truyền thống Ngành Kiểm tra Đảng (16.10.2023)" },
    { id: 1, previewImageSrc: "assets/template/images/MaiVanNgoc/3.PNG", thumbnailImageSrc: "assets/template/images/MaiVanNgoc/3.PNG", title: "Lễ kỷ niệm lần thứ 54 năm ngày thành lập Ngành Kiểm tra của Đảng" },
  ];
  images5: any = [
    { id: 1, previewImageSrc: "assets/template/images/PhanHuuGian/img030.jpg", thumbnailImageSrc: "assets/template/images/PhanHuuGian/img030.jpg", title: "img030" },
    { id: 1, previewImageSrc: "assets/template/images/PhanHuuGian/ROM_5531.JPG", thumbnailImageSrc: "assets/template/images/PhanHuuGian/ROM_5531.JPG", title: "ROM_5531" },
    { id: 1, previewImageSrc: "assets/template/images/PhanHuuGian/ROM_5537.JPG", thumbnailImageSrc: "assets/template/images/PhanHuuGian/ROM_5537.JPG", title: "ROM_5537" },
    { id: 1, previewImageSrc: "assets/template/images/PhanHuuGian/ROM_5547.JPG", thumbnailImageSrc: "assets/template/images/PhanHuuGian/ROM_5547.JPG", title: "ROM_5547" },
    { id: 1, previewImageSrc: "assets/template/images/PhanHuuGian/ROM_5549.JPG", thumbnailImageSrc: "assets/template/images/PhanHuuGian/ROM_5549.JPG", title: "ROM_5549" },
  ];
  images6: any = [
    { id: 1, previewImageSrc: "assets/template/images/TranDinhPhac/img006.jpg", thumbnailImageSrc: "assets/template/images/TranDinhPhac/img006.jpg", title: "img006" },
    { id: 1, previewImageSrc: "assets/template/images/TranDinhPhac/img018.jpg", thumbnailImageSrc: "assets/template/images/TranDinhPhac/img018.jpg", title: "img018" },
    { id: 1, previewImageSrc: "assets/template/images/TranDinhPhac/img019.jpg", thumbnailImageSrc: "assets/template/images/TranDinhPhac/img019.jpg", title: "img019" },
  ];
  images7: any = [
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/img028.jpg", thumbnailImageSrc: "assets/template/images/PhamVanBon/img028.jpg", title: "img028" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/img029.jpg", thumbnailImageSrc: "assets/template/images/PhamVanBon/img029.jpg", title: "img029" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5465.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5465.JPG", title: "ROM_5465" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5469.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5469.JPG", title: "ROM_5469" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5470.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5470.JPG", title: "ROM_5470" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5471.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5471.JPG", title: "ROM_5471" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5473.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5473.JPG", title: "ROM_5473" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5484.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5484.JPG", title: "ROM_5484" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5485.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5485.JPG", title: "ROM_5485" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5489.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5489.JPG", title: "ROM_5489" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5491.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5491.JPG", title: "ROM_5491" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5495.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5495.JPG", title: "ROM_5495" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5498.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5498.JPG", title: "ROM_5498" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5506.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5506.JPG", title: "ROM_5506" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5507.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5507.JPG", title: "ROM_5507" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5519.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5519.JPG", title: "ROM_5519" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5598.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5598.JPG", title: "ROM_5598" },
    { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5606.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5606.JPG", title: "ROM_5606" },

  ];
  images8: any = [
    { id: 1, previewImageSrc: "assets/template/images/VuCongTien/2013.jpg", thumbnailImageSrc: "assets/template/images/VuCongTien/2013.jpg", title: "2013" },
    { id: 1, previewImageSrc: "assets/template/images/VuCongTien/Đồng chí Vũ Công Tiến phát biểu tại buổi làm việc với Đảng ủy xã Phú Hội 2012.jpg", thumbnailImageSrc: "assets/template/images/VuCongTien/Đồng chí Vũ Công Tiến phát biểu tại buổi làm việc với Đảng ủy xã Phú Hội 2012.jpg", title: "Đồng chí Vũ Công Tiến phát biểu tại buổi làm việc với Đảng ủy xã Phú Hội 2012" },
    { id: 1, previewImageSrc: "assets/template/images/VuCongTien/HN tổng kết năm 2011.jpg", thumbnailImageSrc: "assets/template/images/VuCongTien/HN tổng kết năm 2011.jpg", title: "HN tổng kết năm 201119" },
  ];
  images9: any = [
    { id: 1, previewImageSrc: "assets/template/images/HoThiNga/1.PNG", thumbnailImageSrc: "assets/template/images/HoThiNga/1.PNG", title: "đc Hồ Thị Nga - UVBTV, Chủ nhiệm UBKTTU khoá Ĩ nhận Cờ đơn vị dẫn đầu phong trào thi đua 5 năm (2005 - 2010)" },
    { id: 1, previewImageSrc: "assets/template/images/HoThiNga/7.Tỉnh ủy tặng Cờ thi đua cho Ủy ban Kiểm tra Tỉnh ủy nhiệm kỳ  2005-2010.jpg", thumbnailImageSrc: "assets/template/images/HoThiNga/7.Tỉnh ủy tặng Cờ thi đua cho Ủy ban Kiểm tra Tỉnh ủy nhiệm kỳ  2005-2010.jpg", title: "7.Tỉnh ủy tặng Cờ thi đua cho Ủy ban Kiểm tra Tỉnh ủy nhiệm kỳ  2005-2010" },
    { id: 1, previewImageSrc: "assets/template/images/HoThiNga/Hoạt động đền ơn đáp nghĩa của của đc Hồ Thị Nga - nguyên Chủ nhiệm.jpg", thumbnailImageSrc: "assets/template/images/HoThiNga/Hoạt động đền ơn đáp nghĩa của của đc Hồ Thị Nga - nguyên Chủ nhiệm.jpg", title: "Hoạt động đền ơn đáp nghĩa của của đc Hồ Thị Nga - nguyên Chủ nhiệm" },
    { id: 1, previewImageSrc: "assets/template/images/HoThiNga/img007.jpg", thumbnailImageSrc: "assets/template/images/HoThiNga/img007.jpg", title: "img007" },
  ];
  images10: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/10. ĐÀO NGỌC CẦN - Chủ nhiệm khóa IX 2014-2015/đồng chí Đào Ngọc Cần (avatar1).jpg",thumbnailImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/10. ĐÀO NGỌC CẦN - Chủ nhiệm khóa IX 2014-2015/đồng chí Đào Ngọc Cần (avatar1).jpg", title: "1" },
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/10. ĐÀO NGỌC CẦN - Chủ nhiệm khóa IX 2014-2015/1.PNG",thumbnailImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/10. ĐÀO NGỌC CẦN - Chủ nhiệm khóa IX 2014-2015/1.PNG", title: "2" },

  ];
  images11: any = [
    { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/Chủ trì kỳ họp lần thứ 20 nhiệm kỳ X.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/Chủ trì kỳ họp lần thứ 20 nhiệm kỳ X.jpg", title: "Chủ trì kỳ họp lần thứ 20 nhiệm kỳ X" },
    { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/dc Duong Cong Hiep phát biểu tại Đại hội Chi bộ cơ quan.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/dc Duong Cong Hiep phát biểu tại Đại hội Chi bộ cơ quan.jpg", title: "dc Duong Cong Hiep phát biểu tại Đại hội Chi bộ cơ quan" },
    { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/Khen thưởng con em.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/Khen thưởng con em.jpg", title: "Khen thưởng con em" },
    { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/Khen thưởng con em3.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/Khen thưởng con em3.jpg", title: "Khen thưởng con em3" },
    { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/ký kết quy chế phối hợp.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/ký kết quy chế phối hợp.jpg", title: "ký kết quy chế phối hợp" },
    { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/Trao giấy khen tập thể xuất sắc năm 2018.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/Trao giấy khen tập thể xuất sắc năm 2018.jpg", title: "Trao giấy khen tập thể xuất sắc năm 2018" },
    { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/1.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/1.jpg", title: "1" },
    { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/2.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/2.jpg", title: "2" },
  ];
  images11_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/11.DƯƠNG CÔNG HIỆP - Chủ nhiệm khóa X 2015-2020/Đồng chí Dương Công Hiệp (avatar 1).jpg"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/11.DƯƠNG CÔNG HIỆP - Chủ nhiệm khóa X 2015-2020/Đồng chí Dương Công Hiệp (avatar 2).jpg"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/11.DƯƠNG CÔNG HIỆP - Chủ nhiệm khóa X 2015-2020/1.PNG"},
  ]
  images10_3: any = [
    { id: 1, previewImageSrc: "assets/template/images/NhiemKy10/Dc Hoàng Xuân Hường - Bí thư Chi bộ, Phó Chủ nhiệm UBKT Tỉnh ủy phát biểu tại Đại hội Chi bộ Cơ quan UBKT Tỉnh ủy lần thứ XVII.JPG", thumbnailImageSrc: "assets/template/images/NhiemKy10/Dc Hoàng Xuân Hường - Bí thư Chi bộ, Phó Chủ nhiệm UBKT Tỉnh ủy phát biểu tại Đại hội Chi bộ Cơ quan UBKT Tỉnh ủy lần thứ XVII.JPG", title: "Dc Hoàng Xuân Hường - Bí thư Chi bộ, Phó Chủ nhiệm UBKT Tỉnh ủy phát biểu tại Đại hội Chi bộ Cơ quan UBKT Tỉnh ủy lần thứ XVII" },
    { id: 1, previewImageSrc: "assets/template/images/NhiemKy10/2a-10_20230718201748.jpg", thumbnailImageSrc: "assets/template/images/NhiemKy10/2a-10_20230718201748.jpg", title: "Dc Hoàng Xuân Hường" },
    { id: 1, previewImageSrc: "assets/template/images/NhiemKy10/images2319377_e4252bfec89536cb6f84.jpg", thumbnailImageSrc: "assets/template/images/NhiemKy10/images2319377_e4252bfec89536cb6f84.jpg", title: "Dc Hoàng Xuân Hường" },
    { id: 1, previewImageSrc: "assets/template/images/NhiemKy10/images2431781_3a_07.jpg", thumbnailImageSrc: "assets/template/images/NhiemKy10/images2431781_3a_07.jpg", title: "Dc Hoàng Xuân Hường" },
  ];
  images10_4: any = [
    { id: 1, previewImageSrc: "assets/template/images/NhiemKy10/ROM_5618.JPG", thumbnailImageSrc: "assets/template/images/NhiemKy10/ROM_5618.JPG", title: "ROM_5618" },
    { id: 1, previewImageSrc: "assets/template/images/NhiemKy10/ROM_5638.JPG", thumbnailImageSrc: "assets/template/images/NhiemKy10/ROM_5638.JPG", title: "ROM_5638" },
  ];
  images11_1: any = [
    { id: 1, previewImageSrc: "assets/template/images/DANGTHEHAI/đồng chí Đặng Thế Hải.jpg", thumbnailImageSrc: "assets/template/images/DANGTHEHAI/đồng chí Đặng Thế Hải.jpg", title: "đồng chí Đặng Thế Hải" },
    { id: 1, previewImageSrc: "assets/template/images/DANGTHEHAI/đồng chí Đặng Thế Hải nhận quyết định.jpg", thumbnailImageSrc: "assets/template/images/DANGTHEHAI/đồng chí Đặng Thế Hải nhận quyết định.jpg", title: "đồng chí Đặng Thế Hải nhận quyết định" },
    { id: 1, previewImageSrc: "assets/template/images/DANGTHEHAI/HN giao ban Cụm thi đua số 2. Bảo Lâm.jpg", thumbnailImageSrc: "assets/template/images/DANGTHEHAI/HN giao ban Cụm thi đua số 2. Bảo Lâm.jpg", title: "HN giao ban Cụm thi đua số 2, Bảo Lâm" },
    { id: 1, previewImageSrc: "assets/template/images/DANGTHEHAI/Lễ công bố QĐ PCN UBKTTU 2019.jpg", thumbnailImageSrc: "assets/template/images/DANGTHEHAI/Lễ công bố QĐ PCN UBKTTU 2019.jpg", title: "Lễ công bố QĐ PCN UBKTTU 2019" },
    
  ];

  images11_2: any = [
    { id: 1, previewImageSrc: "assets/template/images/LETHIXUANLIEN/Hoạt động nhận cờ luân lưu Khối trưởng khối thi đua năm 2021.jpg", thumbnailImageSrc: "assets/template/images/LETHIXUANLIEN/Hoạt động nhận cờ luân lưu Khối trưởng khối thi đua năm 2021.jpg", title: "Hoạt động nhận cờ luân lưu Khối trưởng khối thi đua năm 2021" },
    { id: 1, previewImageSrc: "assets/template/images/LETHIXUANLIEN/toanquocsoket6thang1.jpg", thumbnailImageSrc: "assets/template/images/LETHIXUANLIEN/toanquocsoket6thang1.jpg", title: "Đồng chí Lê Thị Xuân Liên" },
    { id: 1, previewImageSrc: "assets/template/images/LETHIXUANLIEN/Ban Chấp hành Công đoàn NK 2023-2028.jpg", thumbnailImageSrc: "assets/template/images/LETHIXUANLIEN/Ban Chấp hành Công đoàn NK 2023-2028.jpg", title: "Ban Chấp hành Công đoàn NK 2023-2028" },
    
  ];
  imagesDTH_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2020-2025.Đặng Thế Hải, Tỉnh ủy viên, Phó Chủ nhiệm Thường trực Khóa XI/1.PNG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2020-2025.Đặng Thế Hải, Tỉnh ủy viên, Phó Chủ nhiệm Thường trực Khóa XI/đồng chí Đặng Thế Hải 5 (ava2).JPG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2020-2025.Đặng Thế Hải, Tỉnh ủy viên, Phó Chủ nhiệm Thường trực Khóa XI/dth.jpg"},
  ]
  imagesLTXL_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2020-2025. Lê Thị Xuân Liên, Phó Chủ nhiệm Khóa XI/1.PNG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2020-2025. Lê Thị Xuân Liên, Phó Chủ nhiệm Khóa XI/Lê Thị Xuân Liên 4.JPG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2020-2025. Lê Thị Xuân Liên, Phó Chủ nhiệm Khóa XI/Lê Thị Xuân Liên 5.JPG"},
  ]
  imagesHXH_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2015-2020. Hoàng Xuân Hường - Phó Chủ nhiệm Khóa X/1.PNG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2015-2020. Hoàng Xuân Hường - Phó Chủ nhiệm Khóa X/Đồng chí Hoàng Xuân Hường (ava2).JPG"},
  ]
  imagesHTN_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/9. HỒ THỊ NGA - Chủ nhiệm khóa VIII, IX 2007-2014/Đồng chí Hồ Thị Nga (avatar1).png"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/9. HỒ THỊ NGA - Chủ nhiệm khóa VIII, IX 2007-2014/Đồng chí Hồ Thị Nga(avatar2).jpg"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/9. HỒ THỊ NGA - Chủ nhiệm khóa VIII, IX 2007-2014/dc_Ho_Nga_01.jpg"},
  ]
  imagesVCT_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/8. VŨ CÔNG TIẾN- Chủ nhiệm khóa VII, VIII 2003-2007/đồng chí Vũ Công Tiến (avatar1).png"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/8. VŨ CÔNG TIẾN- Chủ nhiệm khóa VII, VIII 2003-2007/đồng chí Vũ Công Tiến (avatar2).jpg"},
  ]
  imagesPHG_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/5. PHAN HỮU GIẢN - Chủ nhiệm khóa V 1993-1995/Đồng chí Phan Hữu Giản (avatar1).png"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/5. PHAN HỮU GIẢN - Chủ nhiệm khóa V 1993-1995/Đồng chí Phan Hữu Giản  (avatar2).JPG"},
  ]
  imagesTDP_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/6. TRẦN ĐÌNH PHÁC - Chủ nhiệm khóa VI 1996-2001/Đồng chí Trần Đình Phác (avatar1).JPG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/6. TRẦN ĐÌNH PHÁC - Chủ nhiệm khóa VI 1996-2001/Đồng chí Trần Đình Phác (avatar2).jpg"},
  ]
  imagesPVB_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/7. PHẠM VĂN BỔN - Chủ nhiệm khóa VII 2000-2005/Đồng chí Phạm Văn Bổn (avatar1).png"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/1. TRƯỞNG BAN - CHỦ NHIỆM/7. PHẠM VĂN BỔN - Chủ nhiệm khóa VII 2000-2005/Đồng chí Phạm Văn Bổn (avatar2).JPG"},
  ]
  imagesLTTA_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/1986-1991 LƯU THỊ THANH AN - Tỉnh ủy viên dự khuyết, Phó chủ nhiệm Khóa IV/1.PNG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/1986-1991 LƯU THỊ THANH AN - Tỉnh ủy viên dự khuyết, Phó chủ nhiệm Khóa IV/(avatar 2).jpg"},
  ]
  imagesHTTH_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/1996-2000. HOÀNG THỊ THU HỒNG - Tỉnh ủy viên, Phó Chủ nhiệm Khóa VI/đồng chí Hoàng Thị Thu Hồng (avatar 1).jpg"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/1996-2000. HOÀNG THỊ THU HỒNG - Tỉnh ủy viên, Phó Chủ nhiệm Khóa VI/1.PNG"},
  ]
  imagesDMT_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/1996-2000. ĐẶNG MINH TUYẾT - Phó Chủ nhiệm Khóa VI/1.PNG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/1996-2000. ĐẶNG MINH TUYẾT - Phó Chủ nhiệm Khóa VI/Đồng chí Đặng Minh Tuyết (ava2).JPG"},
  ]
  imagesNB_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2002-2003. Nguyễn Bạn - Tỉnh ủy viên, Phó Chủ nhiệm  Khóa VII/1.PNG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2002-2003. Nguyễn Bạn - Tỉnh ủy viên, Phó Chủ nhiệm  Khóa VII/Đồng chí Nguyễn Bạn (avatar2).JPG"},
  ]
  imagesPKK_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2003-2004. Phạm Kim Khang - Tỉnh ủy viên, Phó Chủ nhiệm  Khóa VII/đồng chí Phạm Kim Khang (ava1).png"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2003-2004. Phạm Kim Khang - Tỉnh ủy viên, Phó Chủ nhiệm  Khóa VII/1.PNG"},
  ]
  imagesHTH_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2015-2020. Hoàng Thanh Hải - Phó Chủ nhiệm Khóa X/1.PNG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2015-2020. Hoàng Thanh Hải - Phó Chủ nhiệm Khóa X/đồng chí Hoàng Thanh Hải (ava2).JPG"},
  ]
  imagesBT_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2015. Bùi Thắng - Phó Chủ nhiệm  Khóa IX/1.PNG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2015. Bùi Thắng - Phó Chủ nhiệm  Khóa IX/đồng chí Bùi Thắng (avatar2).jpg"},
  ]
  imagesTXV_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2010-2015. Trần Xuân Vượng - Phó Chủ nhiệm Khóa IX/đồng chí Trần Xuân Vượng (avatar1).jpg"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2010-2015. Trần Xuân Vượng - Phó Chủ nhiệm Khóa IX/1.PNG"},
  ]
  imagesTQL_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2010-2020. Trần Quốc Lập - Phó Chủ nhiệm Khóa IX, X/1.PNG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2010-2020. Trần Quốc Lập - Phó Chủ nhiệm Khóa IX, X/2.PNG"},
  ]
  imagesTDQ_avt: any = [
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2009. Trần Đức Quận - Tỉnh ủy viên, Phó Chủ nhiệm Thường trực  Khóa VIII/1.PNG"},
    { id: 1, previewImageSrc: "assets/template/images/3. LÃNH ĐẠO ỦY BAN KIỂM TRA TỈNH ỦY/2. PHÓ TRƯỞNG BAN - PHÓ CHỦ NHIỆM/2009. Trần Đức Quận - Tỉnh ủy viên, Phó Chủ nhiệm Thường trực  Khóa VIII/đồng chí Trần Đức Quận (avatar 2).jpg"},
  ]
  displayCustom: boolean = false;

  activeIndex: number = 0;

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    private location: Location,
    public spinner: NgxSpinnerService,
    private router: Router,

  ) {
  }

  ngOnInit(): void {
    this.spinner.show();

    if (HomePageService.isPlay) {
      HomePageService.pauseAudio1();
      HomePageService.resumeAudio2();
    } else {
      HomePageService.stopAudio1();
      HomePageService.stopAudio2();
    }

    $('#menu-mobile').css({ 'width': '0px' });
    $('#main').css({ 'margin-left': '0px' });
    $('#menu-mobile').removeClass("show");

    this.route.queryParams.subscribe((param: any) => {
      this.type = param.type;
      if (this.type == 1) {
        this.subtitle = "ỦY BAN KIỂM TRA TỈNH ỦY QUA CÁC THỜI KỲ "
      } else {
        this.type = 0;
      }
    })
    this.route.queryParams.subscribe((person: any) => {
      this.person = person.person;

    })
    setTimeout(() => {
      this.spinner.hide()
    }, 500);
    console.log(this.person)
  }

  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

  ngOnDestroy(): void {
  }

  backPage() {
    this.location.back();
  }

  showPerson() {

  }
  clickChiTietBaiPhatBieu(bai: number){
    this.router.navigate(['/tablet/chitiet-baiviet'], { queryParams: { baiviet: bai} });
  }
}
