import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';

/**
 * Ảnh thu nhỏ trong bảng: giữ đúng tỉ lệ (cắt vừa khung, không méo), bấm vào để phóng to (p-image preview).
 * <app-thumb [src]="rowData.ImageUrl | imageUrlPipe" [empty]="!rowData.ImageUrl"></app-thumb>
 */
@Component({
    standalone: false,
    selector: 'app-thumb',
    template: `
        @if (src && !empty && !failed) {
            <p-image [src]="src" [alt]="alt" [preview]="true" appendTo="body" styleClass="app-thumb"
                imageClass="app-thumb-img" [imageStyle]="{ width: width + 'px', height: height + 'px' }"
                (onImageError)="failed = true"></p-image>
        } @else {
            <img class="app-thumb-img app-thumb-empty" src="/assets/img/noimage.png" alt="Không có ảnh"
                [style.width.px]="width" [style.height.px]="height" />
        }
    `,
    styles: [`
        app-thumb { display: inline-block; line-height: 0; vertical-align: middle; }
        app-thumb .app-thumb-img {
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid #dee2e6;
            background: #f8f9fa;
        }
        app-thumb .app-thumb { border-radius: 4px; overflow: hidden; cursor: zoom-in; }
        app-thumb .app-thumb-empty { object-fit: contain; opacity: .6; }
        /* Khung xem ảnh phóng to (gắn vào body): nền tối, ảnh vừa màn hình có lề */
        .p-image-mask { background: rgba(0, 0, 0, .85) !important; }
        .p-image-mask .p-image-original { max-width: 92vw; max-height: 88vh; object-fit: contain; }
    `],
    encapsulation: ViewEncapsulation.None,
})
export class ThumbComponent implements OnChanges {
    @Input() src: string | null | undefined;
    /** true khi bản ghi không có ảnh (pipe trả về ảnh mặc định) */
    @Input() empty = false;
    @Input() alt = 'Ảnh đại diện';
    /** Khung 3:2 */
    @Input() width = 120;
    @Input() height = 80;

    failed = false;

    ngOnChanges(): void {
        this.failed = false;
    }
}
