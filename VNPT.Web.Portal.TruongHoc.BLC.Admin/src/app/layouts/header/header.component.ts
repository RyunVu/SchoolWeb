import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HistoryLoginModal } from 'src/app/pages/systems/user/historylogin.modal';
import { ResultCode, ResultModel } from 'src/app/models';
import { AuthService, HttpService } from 'src/app/services';
import { NewsLinkService } from 'src/app/services/news-link.service';
import { DialogService } from "primeng/dynamicdialog";
@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleMenuSidebar: EventEmitter<any> = new EventEmitter<any>();
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl(null),
  });
  searching = false;

  constructor(
    private authService: AuthService,
    public dialogService: DialogService,
    private http: HttpService,
    private router: Router,
    private toastr: ToastrService,
    private newsLink: NewsLinkService
    ) { }

  ngOnInit() {
  }

  /** Dán link bài viết / chuyên mục ngoài portal -> mở menu quản trị và bài viết tương ứng */
  searchLink() {
    const text = (this.searchForm.value.search || '').trim();
    if (!text || this.searching) {
      return;
    }
    const link = this.newsLink.parse(text);
    if (!link || !link.param) {
      this.toastr.warning('Hãy dán link "chi-tiet-tin-tuc" hoặc "danh-sach-tin-tuc" có tham số ?param=...', 'Link không hợp lệ');
      return;
    }

    if (link.site === this.newsLink.listSite) {
      // ?param={maChuyenMuc}.{loaiTin}
      this.router.navigate(['/quan-ly-tin-tuc', link.param.split('.')[0]]);
      return;
    }

    this.searching = true;
    this.http.post('News/FindByAlias', {
      Alias: link.param,
      UnitCode: link.portalCode
    }, (result: ResultModel) => {
      this.searching = false;
      if (result.Code != ResultCode.Success || !result.Result) {
        this.toastr.warning(result.Message || 'Không tìm thấy bài viết', 'Tìm bài viết');
        return;
      }
      const news = result.Result;
      this.newsLink.request({
        code: news.Code,
        id: news.Id,
        title: news.Title,
        unitCode: news.UnitCode
      });
      this.router.navigate(['/quan-ly-tin-tuc', news.Code]);
    }, () => {
      this.searching = false;
      this.toastr.error('Không tìm được bài viết, vui lòng thử lại', 'Tìm bài viết');
    });
  }

  historyLogin() {
    const ref = this.dialogService
      .open(HistoryLoginModal, {
        data: {
          isUserLogin: true,
        },
        header: "Lịch sử đăng nhập",
        width: "70%",
      })!
      .onClose.subscribe((data: any) => {});
  }
  // logout() {
  //   //this.appService.logout();
  //   this.authService.logoutUser();
  // }
}
