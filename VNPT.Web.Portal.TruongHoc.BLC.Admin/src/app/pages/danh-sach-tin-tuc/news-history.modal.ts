import { Component, ViewEncapsulation } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ResultCode, ResultModel } from "src/app/models";
import { HttpService } from "src/app/services";

/** Một đoạn của kết quả so sánh văn bản */
interface DiffPart {
    type: 'eq' | 'ins' | 'del';
    text: string;
}

/** Một trường bị thay đổi giữa 2 phiên bản */
interface FieldChange {
    key: string;
    label: string;
    oldText: string;
    newText: string;
    parts: DiffPart[] | null;   // so sánh theo từng từ (với trường văn bản)
    isHtml: boolean;
    oldHtml?: string;
    newHtml?: string;
}

/** Nhãn hiển thị các trường của bảng News (theo thứ tự hiển thị) */
const FIELD_LABELS: { [key: string]: string } = {
    Title: 'Tiêu đề',
    Alias: 'Alias (đường dẫn)',
    Code: 'Chuyên mục',
    NewTypeId: 'Loại tin',
    ShortContent: 'Tóm tắt',
    Content: 'Nội dung',
    Title_En: 'Tiêu đề (EN)',
    Content_En: 'Nội dung (EN)',
    ImageUrl: 'Ảnh đại diện',
    OtherUrl: 'Link liên kết',
    AudioUrl: 'Audio',
    Description: 'Mô tả',
    CreateDate: 'Ngày đăng',
    Status: 'Trạng thái',
    IsOpenBlankPage: 'Mở trang mới',
    IsNewsImage: 'Tin ảnh',
    IsOpenImageOnly: 'Chỉ mở ảnh',
    Order: 'Thứ tự',
    UnitCode: 'Đơn vị',
    Tag: 'Tag',
};
/** Trường kỹ thuật, không đưa vào phần so sánh */
const IGNORED_FIELDS = ['Id', 'UpdateDate', 'UpdateUserId', 'CreateUserId', 'LanguageId', 'CountView'];
const HTML_FIELDS = ['Content', 'Content_En', 'ShortContent', 'Description'];
const STATUS_LABELS: { [key: string]: string } = { '1': 'Đã duyệt / hiển thị', '0': 'Chưa duyệt', '-1': 'Đã xoá' };
const ACTIONS: { [key: number]: { label: string; css: string } } = {
    1: { label: 'Thêm mới', css: 'badge-success' },
    2: { label: 'Cập nhật', css: 'badge-info' },
    3: { label: 'Xoá', css: 'badge-danger' },
    4: { label: 'Khác', css: 'badge-secondary' },
    5: { label: 'Đăng nhập', css: 'badge-secondary' },
    6: { label: 'Xem', css: 'badge-light' },
};
/** Giới hạn ô so sánh LCS để tránh treo trình duyệt với bài rất dài */
const MAX_DIFF_CELLS = 2_500_000;

@Component({
    standalone: false,
    selector: "news-history-modal",
    templateUrl: "news-history.modal.html",
    styleUrls: ["news-history.modal.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class NewsHistoryModal {
    news: any;
    versions: any[] = [];
    selected: any = null;
    changes: FieldChange[] = [];
    comparedWithPrevious = false;
    hasOldVersion = false;
    loadingList = false;
    loadingDetail = false;
    showRendered: { [key: string]: boolean } = {};

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private http: HttpService
    ) {
        this.news = this.config.data.item;
    }

    ngOnInit() {
        this.loadingList = true;
        this.http.post("News/Histories", { Id: this.news.Id }, (result: ResultModel) => {
            this.loadingList = false;
            if (result.Code == ResultCode.Success) {
                this.versions = result.Result || [];
                if (this.versions.length) {
                    this.select(this.versions[0]);
                }
            }
        }, () => {
            this.loadingList = false;
        });
    }

    action(version: any) {
        return ACTIONS[version?.Action] || { label: 'Khác', css: 'badge-secondary' };
    }

    select(version: any) {
        if (this.selected === version) {
            return;
        }
        this.selected = version;
        this.changes = [];
        this.showRendered = {};
        this.loadingDetail = true;
        this.http.post("News/HistoryDetail", { Id: version.Id }, (result: ResultModel) => {
            this.loadingDetail = false;
            if (result.Code == ResultCode.Success && this.selected === version) {
                const detail = result.Result;
                this.comparedWithPrevious = detail.ComparedWithPrevious;
                this.hasOldVersion = !!detail.OldVersion;
                this.changes = this.compare(this.parse(detail.OldVersion), this.parse(detail.NewVersion));
            }
        }, () => {
            this.loadingDetail = false;
        });
    }

    cancel() {
        this.ref.close();
    }

    private parse(json: string | null): any {
        if (!json) {
            return {};
        }
        try {
            return JSON.parse(json) || {};
        } catch {
            return {};
        }
    }

    private compare(oldObj: any, newObj: any): FieldChange[] {
        const keys = Array.from(new Set([...Object.keys(FIELD_LABELS), ...Object.keys(oldObj), ...Object.keys(newObj)]))
            .filter(k => !IGNORED_FIELDS.includes(k) && (k in oldObj || k in newObj));
        const changes: FieldChange[] = [];
        for (const key of keys) {
            const oldText = this.format(key, oldObj[key]);
            const newText = this.format(key, newObj[key]);
            if (oldText === newText) {
                continue;
            }
            const isHtml = HTML_FIELDS.includes(key);
            const oldPlain = isHtml ? this.htmlToText(oldObj[key]) : oldText;
            const newPlain = isHtml ? this.htmlToText(newObj[key]) : newText;
            const isText = typeof (newObj[key] ?? oldObj[key]) === 'string' && key !== 'NewTypeId' && key !== 'CreateDate';
            changes.push({
                key,
                label: FIELD_LABELS[key] || key,
                oldText: oldPlain,
                newText: newPlain,
                parts: isText ? this.diffWords(oldPlain, newPlain) : null,
                isHtml,
                oldHtml: isHtml ? (oldObj[key] || '') : undefined,
                newHtml: isHtml ? (newObj[key] || '') : undefined,
            });
        }
        return changes;
    }

    private format(key: string, value: any): string {
        if (value === null || value === undefined || value === '') {
            return '';
        }
        if (typeof value === 'boolean') {
            return value ? 'Có' : 'Không';
        }
        if (key === 'Status') {
            return STATUS_LABELS[String(value)] || String(value);
        }
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) {
                const p = (n: number) => String(n).padStart(2, '0');
                return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
            }
        }
        return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }

    private htmlToText(html: string | null | undefined): string {
        if (!html) {
            return '';
        }
        const doc = new DOMParser().parseFromString(html, 'text/html');
        doc.querySelectorAll('br, p, div, li, tr, h1, h2, h3, h4, h5, h6').forEach(el => el.append('\n'));
        return (doc.body.textContent || '').replace(/[ \t ]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
    }

    /** So sánh theo từng từ: cắt phần giống ở đầu/cuối, phần giữa dùng LCS */
    private diffWords(oldText: string, newText: string): DiffPart[] {
        const a = oldText ? oldText.split(/(\s+)/) : [];
        const b = newText ? newText.split(/(\s+)/) : [];
        let start = 0;
        while (start < a.length && start < b.length && a[start] === b[start]) {
            start++;
        }
        let endA = a.length, endB = b.length;
        while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
            endA--;
            endB--;
        }
        const parts: DiffPart[] = [];
        const push = (type: DiffPart['type'], text: string) => {
            if (!text) {
                return;
            }
            const last = parts[parts.length - 1];
            if (last && last.type === type) {
                last.text += text;
            } else {
                parts.push({ type, text });
            }
        };
        push('eq', a.slice(0, start).join(''));

        const midA = a.slice(start, endA), midB = b.slice(start, endB);
        const n = midA.length, m = midB.length;
        if (n * m > MAX_DIFF_CELLS) {
            push('del', midA.join(''));
            push('ins', midB.join(''));
        } else {
            // dp[i][j] = độ dài LCS của midA[i..] và midB[j..]
            const dp: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
            for (let i = n - 1; i >= 0; i--) {
                for (let j = m - 1; j >= 0; j--) {
                    dp[i][j] = midA[i] === midB[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
                }
            }
            let i = 0, j = 0;
            while (i < n && j < m) {
                if (midA[i] === midB[j]) {
                    push('eq', midA[i]); i++; j++;
                } else if (dp[i + 1][j] >= dp[i][j + 1]) {
                    push('del', midA[i]); i++;
                } else {
                    push('ins', midB[j]); j++;
                }
            }
            while (i < n) { push('del', midA[i++]); }
            while (j < m) { push('ins', midB[j++]); }
        }
        push('eq', a.slice(endA).join(''));
        return parts;
    }
}
