import { Component, ElementRef, HostListener, ViewChild, ViewEncapsulation } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { ToastrService } from "ngx-toastr";
import moment from 'moment';

declare var $: any;

@Component({
    standalone: false,
    selector: "fm-mini-window-modal",
    templateUrl: 'fm-mini-window.modal.html',
    styleUrls: ['./fm-mini-window.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class FMMiniWindowModal {
    @ViewChild('imageCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasContainer', { static: false }) containerRef!: ElementRef<HTMLDivElement>;

    item: any = {};
    objectType: any;
    folderId: any;
    filetype: any;

    uploadFile: any[] = [];
    isImageMode: boolean = false;
    activeTab: 'crop' | 'resize' | 'quality' | 'transform' = 'resize';

    // Source selection & URL loading
    inputSourceType: 'file' | 'url' = 'file';
    imageUrlInput: string = "";
    isLoadingUrl: boolean = false;
    showUrlPromptInEditor: boolean = false;
    urlInputInEditor: string = "";

    // Original image data
    originalFile: File | null = null;
    originalImage: HTMLImageElement | null = null;
    originalWidth: number = 0;
    originalHeight: number = 0;
    originalSizeText: string = "";

    // Working canvas & state
    workingCanvas: HTMLCanvasElement | null = null;
    currentWidth: number = 0;
    currentHeight: number = 0;

    // Resize controls
    resizeWidth: number = 0;
    resizeHeight: number = 0;
    aspectRatioLocked: boolean = true;
    aspectRatio: number = 1;

    // Crop controls
    isCropping: boolean = false;
    cropRatio: string = 'free'; // 'free', '1:1', '4:3', '16:9', '3:2', '2:3'
    cropBox = { x: 0, y: 0, width: 0, height: 0 };
    displayScale: number = 1;
    displayOffset = { x: 0, y: 0 };
    activeDragHandle: string | null = null;
    dragStartPos = { mouseX: 0, mouseY: 0, cropX: 0, cropY: 0, cropW: 0, cropH: 0 };

    // Quality & Output controls
    quality: number = 85; // 10 to 100
    outputFormat: string = 'image/jpeg'; // 'image/jpeg', 'image/webp', 'image/png'
    outputFileName: string = "";
    compressedBlob: Blob | null = null;
    compressedSizeText: string = "";
    savedPercentText: string = "";
    isUploading: boolean = false;
    isExpandedCanvas: boolean = false;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService
    ) {
        this.objectType = config.data.objectType;
        this.folderId = config.data.folderId || "";
        this.filetype = config.data.type || "image";
    }

    ngOnInit() {
        if (this.config.data?.initialFile) {
            this.loadImageFile(this.config.data.initialFile);
        }
    }

    @HostListener('window:paste', ['$event'])
    onWindowPaste(event: ClipboardEvent) {
        if (this.objectType !== 'file') return;

        const clipboardData = event.clipboardData || (window as any).clipboardData;
        if (!clipboardData || !clipboardData.items) return;

        const items = clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type && item.type.startsWith('image/')) {
                const blob = item.getAsFile();
                if (blob) {
                    event.preventDefault();
                    event.stopPropagation();
                    const ext = item.type === 'image/png' ? 'png' : (item.type === 'image/webp' ? 'webp' : 'jpg');
                    const fileName = `pasted_${moment().format('YYYYMMDD_HHmmss')}.${ext}`;
                    const file = new File([blob], fileName, { type: item.type });
                    this.loadImageFile(file);
                    this.toastr.success(`Đã nhận hình ảnh dán từ bộ nhớ tạm! Bạn có thể chỉnh sửa trước khi tải lên.`, 'Thành công');
                    return;
                }
            }
        }
    }

    cancel() {
        this.ref.close();
    }

    // --- File Selection & Image Initialization ---

    changeImage(event: any) {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        this.handleSelectedFiles(files);
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer && event.dataTransfer.files.length > 0) {
            this.handleSelectedFiles(event.dataTransfer.files);
        }
    }

    handleSelectedFiles(files: FileList | File[]) {
        this.uploadFile = Array.from(files);
        const firstFile = this.uploadFile[0];

        if (firstFile && firstFile.type && firstFile.type.startsWith('image/')) {
            this.loadImageFile(firstFile);
        } else {
            this.isImageMode = false;
        }
    }

    async loadImageFromUrl(urlToLoad?: string) {
        const rawUrl = urlToLoad || this.imageUrlInput;
        if (!rawUrl || !rawUrl.trim()) {
            this.toastr.warning('Vui lòng nhập đường dẫn URL hình ảnh!', 'Cảnh báo');
            return;
        }

        const url = rawUrl.trim();
        this.isLoadingUrl = true;
        const defaultFileName = this.extractFileNameFromUrl(url);

        // 1. Trường hợp là Data URL Base64 (data:image/...)
        if (url.startsWith('data:image/')) {
            try {
                const mimeType = url.substring(5, url.indexOf(';')) || 'image/jpeg';
                const blob = this.base64ToBlob(url, mimeType);
                const file = new File([blob], defaultFileName, { type: mimeType });
                this.loadImageFile(file);
                this.finishUrlLoading();
                return;
            } catch (e: any) {
                this.isLoadingUrl = false;
                this.toastr.error('Lỗi khi đọc chuỗi Base64 hình ảnh!', 'Thông báo lỗi');
                return;
            }
        }

        // 2. Thử fetch trực tiếp ở client thành Blob
        try {
            const response = await fetch(url);
            if (response.ok) {
                const blob = await response.blob();
                if (blob && (blob.type.startsWith('image/') || blob.size > 0)) {
                    let mimeType = blob.type;
                    if (!mimeType || !mimeType.startsWith('image/')) {
                        mimeType = this.getMimeTypeFromFileName(defaultFileName);
                    }
                    const file = new File([blob], defaultFileName, { type: mimeType });
                    this.loadImageFile(file);
                    this.finishUrlLoading();
                    return;
                }
            }
        } catch (err) {
            console.warn('Direct fetch failed, loading via HTML Image element at client...', err);
        }

        // 3. Tải và xử lý trực tiếp qua HTML Image Element ở client
        try {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const mimeType = this.getMimeTypeFromFileName(defaultFileName);
                try {
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = img.naturalWidth;
                    tempCanvas.height = img.naturalHeight;
                    const ctx = tempCanvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        tempCanvas.toBlob((blob) => {
                            if (blob) {
                                const file = new File([blob], defaultFileName, { type: mimeType });
                                this.loadImageFile(file);
                            } else {
                                this.initImageEditorFromImg(img, defaultFileName, mimeType);
                            }
                            this.finishUrlLoading();
                        }, mimeType, 0.95);
                        return;
                    }
                } catch (canvasErr) {
                    // Nếu dính CORS canvas, vẫn nạp thẳng Image object vào canvas editor ở client
                    this.initImageEditorFromImg(img, defaultFileName, mimeType);
                    this.finishUrlLoading();
                    return;
                }
            };
            img.onerror = () => {
                this.isLoadingUrl = false;
                this.toastr.error('Không thể tải hình ảnh từ URL ở client. Vui lòng kiểm tra lại liên kết hoặc quyền truy cập của ảnh!', 'Thông báo lỗi');
            };
            img.src = url;
        } catch (error: any) {
            this.isLoadingUrl = false;
            this.toastr.error('Lỗi khi tải hình ảnh ở client: ' + (error?.message || 'Không xác định'), 'Thông báo lỗi');
        }
    }

    private finishUrlLoading() {
        this.isLoadingUrl = false;
        this.showUrlPromptInEditor = false;
        this.toastr.success('Đã tải hình ảnh thành công! Bạn có thể chỉnh sửa trước khi tải lên.', 'Thành công');
    }

    private initImageEditorFromImg(img: HTMLImageElement, fileName: string, mimeType: string) {
        this.originalFile = null;
        this.originalSizeText = 'Ảnh trực tuyến';
        this.outputFileName = fileName;
        this.outputFormat = mimeType === 'image/png' ? 'image/png' : (mimeType === 'image/webp' ? 'image/webp' : 'image/jpeg');

        this.originalImage = img;
        this.originalWidth = img.naturalWidth;
        this.originalHeight = img.naturalHeight;
        this.aspectRatio = img.naturalWidth / img.naturalHeight;

        this.workingCanvas = document.createElement('canvas');
        this.workingCanvas.width = img.naturalWidth;
        this.workingCanvas.height = img.naturalHeight;
        const ctx = this.workingCanvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0);
        }

        this.currentWidth = img.naturalWidth;
        this.currentHeight = img.naturalHeight;
        this.resizeWidth = img.naturalWidth;
        this.resizeHeight = img.naturalHeight;

        this.isImageMode = true;
        this.isCropping = false;
        this.activeTab = 'resize';

        setTimeout(() => {
            this.renderDisplayCanvas();
            this.initCropBox();
            this.updateCompressionPreview();
        }, 100);
    }

    private getMimeTypeFromFileName(fileName: string): string {
        const lower = fileName.toLowerCase();
        if (lower.endsWith('.png')) return 'image/png';
        if (lower.endsWith('.webp')) return 'image/webp';
        if (lower.endsWith('.gif')) return 'image/gif';
        if (lower.endsWith('.svg')) return 'image/svg+xml';
        return 'image/jpeg';
    }

    extractFileNameFromUrl(url: string): string {
        try {
            const cleanUrl = url.split('?')[0].split('#')[0];
            const parts = cleanUrl.split('/');
            let name = decodeURIComponent(parts[parts.length - 1] || '');
            if (!name || name.trim().length === 0) {
                name = 'image_' + Date.now() + '.jpg';
            }
            if (!/\.(jpg|jpeg|png|webp|gif|svg|bmp)$/i.test(name)) {
                name += '.jpg';
            }
            return name;
        } catch (e) {
            return 'image_' + Date.now() + '.jpg';
        }
    }

    base64ToBlob(base64Data: string, contentType: string = 'image/jpeg'): Blob {
        const parts = base64Data.split(',');
        const byteString = atob(parts.length > 1 ? parts[1] : parts[0]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: contentType });
    }

    loadImageFile(file: File) {
        this.originalFile = file;
        this.originalSizeText = this.formatFileSize(file.size);
        this.outputFileName = file.name;

        // Auto select format
        if (file.type === 'image/png') {
            this.outputFormat = 'image/png';
        } else if (file.type === 'image/webp') {
            this.outputFormat = 'image/webp';
        } else {
            this.outputFormat = 'image/jpeg';
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.originalWidth = img.naturalWidth;
                this.originalHeight = img.naturalHeight;
                this.aspectRatio = img.naturalWidth / img.naturalHeight;

                // Create working canvas
                this.workingCanvas = document.createElement('canvas');
                this.workingCanvas.width = img.naturalWidth;
                this.workingCanvas.height = img.naturalHeight;
                const ctx = this.workingCanvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                }

                this.currentWidth = img.naturalWidth;
                this.currentHeight = img.naturalHeight;
                this.resizeWidth = img.naturalWidth;
                this.resizeHeight = img.naturalHeight;

                this.isImageMode = true;
                this.isCropping = false;
                this.activeTab = 'resize';

                setTimeout(() => {
                    this.renderDisplayCanvas();
                    this.initCropBox();
                    this.updateCompressionPreview();
                }, 100);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // --- Canvas Rendering & Display ---

    renderDisplayCanvas() {
        if (!this.canvasRef || !this.workingCanvas) return;
        const canvas = this.canvasRef.nativeElement;
        const container = this.containerRef ? this.containerRef.nativeElement : null;

        const maxDisplayWidth = container ? Math.min(container.clientWidth - 40, 750) : 700;
        const maxDisplayHeight = this.isExpandedCanvas ? 380 : 210;

        let scale = 1;
        if (this.currentWidth > maxDisplayWidth || this.currentHeight > maxDisplayHeight) {
            scale = Math.min(maxDisplayWidth / this.currentWidth, maxDisplayHeight / this.currentHeight);
        }

        this.displayScale = scale;
        const displayW = Math.round(this.currentWidth * scale);
        const displayH = Math.round(this.currentHeight * scale);

        canvas.width = displayW;
        canvas.height = displayH;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, displayW, displayH);
            ctx.drawImage(this.workingCanvas, 0, 0, displayW, displayH);
        }
    }

    toggleCanvasSize() {
        this.isExpandedCanvas = !this.isExpandedCanvas;
        setTimeout(() => {
            this.renderDisplayCanvas();
            if (this.activeTab === 'crop') {
                this.adjustCropBoxForRatio();
            }
        }, 50);
    }

    // --- Crop Features ---

    initCropBox() {
        if (!this.canvasRef) return;
        const canvas = this.canvasRef.nativeElement;
        const canvasW = canvas.width || 400;
        const canvasH = canvas.height || 300;

        // Default crop box: FULL frame (khung đầy đủ 100%)
        this.cropRatio = 'free';
        this.cropBox = {
            x: 0,
            y: 0,
            width: canvasW,
            height: canvasH
        };
    }

    setCropRatio(ratio: string) {
        this.cropRatio = ratio;
        this.adjustCropBoxForRatio();
    }

    adjustCropBoxForRatio() {
        if (!this.canvasRef) return;
        const canvas = this.canvasRef.nativeElement;
        if (this.cropRatio === 'free') {
            this.cropBox = {
                x: 0,
                y: 0,
                width: canvas.width,
                height: canvas.height
            };
            return;
        }

        let targetRatio = 1;
        switch (this.cropRatio) {
            case '1:1': targetRatio = 1; break;
            case '4:3': targetRatio = 4 / 3; break;
            case '16:9': targetRatio = 16 / 9; break;
            case '3:2': targetRatio = 3 / 2; break;
            case '2:3': targetRatio = 2 / 3; break;
            case '9:16': targetRatio = 9 / 16; break;
        }

        const canvasW = canvas.width;
        const canvasH = canvas.height;
        let newW = canvasW;
        let newH = newW / targetRatio;

        if (newH > canvasH) {
            newH = canvasH;
            newW = newH * targetRatio;
        }

        this.cropBox.width = Math.round(newW);
        this.cropBox.height = Math.round(newH);
        this.cropBox.x = Math.round((canvasW - newW) / 2);
        this.cropBox.y = Math.round((canvasH - newH) / 2);
    }

    startCropDrag(event: MouseEvent | TouchEvent, handle: string) {
        event.preventDefault();
        event.stopPropagation();
        this.activeDragHandle = handle;

        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

        this.dragStartPos = {
            mouseX: clientX,
            mouseY: clientY,
            cropX: this.cropBox.x,
            cropY: this.cropBox.y,
            cropW: this.cropBox.width,
            cropH: this.cropBox.height
        };

        const onMove = (e: MouseEvent | TouchEvent) => this.onCropDragMove(e);
        const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onUp);
            this.activeDragHandle = null;
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', onUp);
    }

    onCropDragMove(event: MouseEvent | TouchEvent) {
        if (!this.activeDragHandle || !this.canvasRef) return;
        const canvas = this.canvasRef.nativeElement;
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

        const dx = clientX - this.dragStartPos.mouseX;
        const dy = clientY - this.dragStartPos.mouseY;

        const minSize = 30;

        if (this.activeDragHandle === 'move') {
            let newX = this.dragStartPos.cropX + dx;
            let newY = this.dragStartPos.cropY + dy;

            newX = Math.max(0, Math.min(newX, canvas.width - this.cropBox.width));
            newY = Math.max(0, Math.min(newY, canvas.height - this.cropBox.height));

            this.cropBox.x = newX;
            this.cropBox.y = newY;
        } else {
            let { cropX, cropY, cropW, cropH } = this.dragStartPos;

            if (this.activeDragHandle.includes('e')) {
                cropW = Math.max(minSize, Math.min(cropW + dx, canvas.width - cropX));
            }
            if (this.activeDragHandle.includes('s')) {
                cropH = Math.max(minSize, Math.min(cropH + dy, canvas.height - cropY));
            }
            if (this.activeDragHandle.includes('w')) {
                const maxDx = cropW - minSize;
                const clampedDx = Math.min(dx, maxDx);
                const newX = Math.max(0, cropX + clampedDx);
                cropW = cropW + (cropX - newX);
                cropX = newX;
            }
            if (this.activeDragHandle.includes('n')) {
                const maxDy = cropH - minSize;
                const clampedDy = Math.min(dy, maxDy);
                const newY = Math.max(0, cropY + clampedDy);
                cropH = cropH + (cropY - newY);
                cropY = newY;
            }

            this.cropBox.x = cropX;
            this.cropBox.y = cropY;
            this.cropBox.width = cropW;
            this.cropBox.height = cropH;
        }
    }

    applyCrop() {
        if (!this.workingCanvas || this.displayScale <= 0) return;

        // Convert cropBox display coords to source bitmap coords
        const sourceX = Math.round(this.cropBox.x / this.displayScale);
        const sourceY = Math.round(this.cropBox.y / this.displayScale);
        const sourceW = Math.round(this.cropBox.width / this.displayScale);
        const sourceH = Math.round(this.cropBox.height / this.displayScale);

        if (sourceW <= 0 || sourceH <= 0) return;

        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = sourceW;
        croppedCanvas.height = sourceH;

        const ctx = croppedCanvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(this.workingCanvas, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW, sourceH);
        }

        this.workingCanvas = croppedCanvas;
        this.currentWidth = sourceW;
        this.currentHeight = sourceH;
        this.aspectRatio = sourceW / sourceH;
        this.resizeWidth = sourceW;
        this.resizeHeight = sourceH;

        this.renderDisplayCanvas();
        this.initCropBox();
        this.updateCompressionPreview();
        this.toastr.success("Đã cắt hình ảnh (" + sourceW + "x" + sourceH + " px)");
    }

    resetCrop() {
        if (!this.canvasRef) return;
        const canvas = this.canvasRef.nativeElement;
        this.cropBox = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        };
    }

    // --- Resize Features ---

    onResizeWidthChange() {
        if (this.aspectRatioLocked && this.aspectRatio > 0) {
            this.resizeHeight = Math.round(this.resizeWidth / this.aspectRatio);
        }
    }

    onResizeHeightChange() {
        if (this.aspectRatioLocked && this.aspectRatio > 0) {
            this.resizeWidth = Math.round(this.resizeHeight * this.aspectRatio);
        }
    }

    setResizePreset(scaleOrPx: number | string) {
        if (typeof scaleOrPx === 'number') {
            // Relative scale (e.g. 0.5 for 50%)
            this.resizeWidth = Math.round(this.currentWidth * scaleOrPx);
            this.resizeHeight = Math.round(this.currentHeight * scaleOrPx);
        } else {
            // Absolute max dimension (e.g. "1920", "1280", "800", "400")
            const maxDimension = parseInt(scaleOrPx, 10);
            if (this.currentWidth >= this.currentHeight) {
                this.resizeWidth = Math.min(this.currentWidth, maxDimension);
                this.resizeHeight = Math.round(this.resizeWidth / this.aspectRatio);
            } else {
                this.resizeHeight = Math.min(this.currentHeight, maxDimension);
                this.resizeWidth = Math.round(this.resizeHeight * this.aspectRatio);
            }
        }
        this.applyResize();
    }

    applyResize() {
        if (!this.workingCanvas || this.resizeWidth <= 0 || this.resizeHeight <= 0) return;

        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = this.resizeWidth;
        resizedCanvas.height = this.resizeHeight;

        const ctx = resizedCanvas.getContext('2d');
        if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(this.workingCanvas, 0, 0, this.resizeWidth, this.resizeHeight);
        }

        this.workingCanvas = resizedCanvas;
        this.currentWidth = this.resizeWidth;
        this.currentHeight = this.resizeHeight;
        this.aspectRatio = this.resizeWidth / this.resizeHeight;

        this.renderDisplayCanvas();
        this.initCropBox();
        this.updateCompressionPreview();
        this.toastr.success("Đã đổi kích thước thành " + this.resizeWidth + "x" + this.resizeHeight + " px");
    }

    // --- Transform Features (Rotate / Flip) ---

    rotate(deg: number) {
        if (!this.workingCanvas) return;
        const srcCanvas = this.workingCanvas;
        const newCanvas = document.createElement('canvas');

        if (Math.abs(deg) === 90 || Math.abs(deg) === 270) {
            newCanvas.width = srcCanvas.height;
            newCanvas.height = srcCanvas.width;
        } else {
            newCanvas.width = srcCanvas.width;
            newCanvas.height = srcCanvas.height;
        }

        const ctx = newCanvas.getContext('2d');
        if (ctx) {
            ctx.translate(newCanvas.width / 2, newCanvas.height / 2);
            ctx.rotate((deg * Math.PI) / 180);
            ctx.drawImage(srcCanvas, -srcCanvas.width / 2, -srcCanvas.height / 2);
        }

        this.workingCanvas = newCanvas;
        this.currentWidth = newCanvas.width;
        this.currentHeight = newCanvas.height;
        this.aspectRatio = newCanvas.width / newCanvas.height;
        this.resizeWidth = newCanvas.width;
        this.resizeHeight = newCanvas.height;

        this.renderDisplayCanvas();
        this.initCropBox();
        this.updateCompressionPreview();
    }

    flip(h: boolean, v: boolean) {
        if (!this.workingCanvas) return;
        const srcCanvas = this.workingCanvas;
        const newCanvas = document.createElement('canvas');
        newCanvas.width = srcCanvas.width;
        newCanvas.height = srcCanvas.height;

        const ctx = newCanvas.getContext('2d');
        if (ctx) {
            ctx.translate(h ? newCanvas.width : 0, v ? newCanvas.height : 0);
            ctx.scale(h ? -1 : 1, v ? -1 : 1);
            ctx.drawImage(srcCanvas, 0, 0);
        }

        this.workingCanvas = newCanvas;
        this.renderDisplayCanvas();
        this.initCropBox();
        this.updateCompressionPreview();
    }

    resetToOriginal() {
        if (!this.originalImage) return;
        const img = this.originalImage;
        this.workingCanvas = document.createElement('canvas');
        this.workingCanvas.width = img.naturalWidth;
        this.workingCanvas.height = img.naturalHeight;
        const ctx = this.workingCanvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0);
        }

        this.currentWidth = img.naturalWidth;
        this.currentHeight = img.naturalHeight;
        this.aspectRatio = img.naturalWidth / img.naturalHeight;
        this.resizeWidth = img.naturalWidth;
        this.resizeHeight = img.naturalHeight;
        this.quality = 85;
        this.activeTab = 'resize';
        this.isCropping = false;

        this.renderDisplayCanvas();
        this.initCropBox();
        this.updateCompressionPreview();
        this.toastr.info("Đã đặt lại ảnh gốc");
    }

    // --- Quality & Compression Preview ---

    onQualityOrFormatChange() {
        this.updateCompressionPreview();
    }

    updateCompressionPreview() {
        if (!this.workingCanvas) return;
        const qualityRatio = Math.max(0.1, Math.min(1.0, this.quality / 100));

        this.workingCanvas.toBlob((blob) => {
            if (blob) {
                this.compressedBlob = blob;
                this.compressedSizeText = this.formatFileSize(blob.size);

                if (this.originalFile && this.originalFile.size > 0) {
                    const saved = ((1 - (blob.size / this.originalFile.size)) * 100);
                    if (saved > 0) {
                        this.savedPercentText = '-' + saved.toFixed(0) + '%';
                    } else {
                        this.savedPercentText = '+' + Math.abs(saved).toFixed(0) + '%';
                    }
                }
            }
        }, this.outputFormat, qualityRatio);
    }

    // --- Submit / Upload Action ---

    submit() {
        if (this.objectType === 'file') {
            if (this.isImageMode && this.workingCanvas) {
                // Upload edited image
                this.uploadEditedImage();
            } else {
                // Standard file upload
                this.uploadStandardFiles();
            }
        } else {
            // Create folder
            if (!this.item.Name || this.item.Name.trim() === '') {
                this.toastr.warning("Thông báo", "Vui lòng nhập tên thư mục");
                return;
            }
            const data = {
                Name: this.item.Name,
                ParentId: this.folderId
            };
            this.http.post("media/AddFolder", data, (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.toastr.success("Tạo thư mục thành công");
                    this.ref.close({ confirm: 'yes' });
                }
            }, () => {
                this.toastr.error("Không thể tạo thư mục");
            });
        }
    }

    uploadEditedImage() {
        if (!this.workingCanvas) return;
        this.isUploading = true;
        const qualityRatio = Math.max(0.1, Math.min(1.0, this.quality / 100));

        this.workingCanvas.toBlob((blob) => {
            if (!blob) {
                this.isUploading = false;
                this.toastr.error("Không thể xử lý hình ảnh");
                return;
            }

            // Ensure proper file extension
            let fileName = this.outputFileName || 'image.jpg';
            if (this.outputFormat === 'image/jpeg' && !/\.(jpe?g)$/i.test(fileName)) {
                fileName = fileName.replace(/\.[^/.]+$/, '') + '.jpg';
            } else if (this.outputFormat === 'image/png' && !/\.png$/i.test(fileName)) {
                fileName = fileName.replace(/\.[^/.]+$/, '') + '.png';
            } else if (this.outputFormat === 'image/webp' && !/\.webp$/i.test(fileName)) {
                fileName = fileName.replace(/\.[^/.]+$/, '') + '.webp';
            }

            const editedFile = new File([blob], fileName, { type: this.outputFormat });
            const form: FormData = new FormData();
            form.append('Files[]', editedFile, fileName);
            form.append("FolderId", this.folderId);
            form.append("FileType", this.filetype);
            form.append("HasThumb", "true");

            this.http.upload("media/UploadFile", form, (result: ResultModel) => {
                this.isUploading = false;
                if (result.Code == ResultCode.Success) {
                    this.toastr.success("Tải lên hình ảnh thành công");
                    this.ref.close({ confirm: 'yes', uploadedFiles: result.Result });
                } else {
                    this.toastr.error("Tải lên thất bại: " + result.Message);
                }
            }, () => {
                this.isUploading = false;
                this.toastr.error("Vui lòng kiểm tra kết nối Internet");
            });
        }, this.outputFormat, qualityRatio);
    }

    uploadStandardFiles() {
        if (this.uploadFile == null || this.uploadFile.length == 0) {
            this.toastr.warning("Thông báo", "Vui lòng chọn file");
            return;
        }
        this.isUploading = true;
        const form: FormData = new FormData();
        for (let i = 0; i < this.uploadFile.length; i++) {
            form.append('Files[]', this.uploadFile[i], this.uploadFile[i].name);
        }
        form.append("FolderId", this.folderId);
        form.append("FileType", this.filetype);
        form.append("HasThumb", "true");

        this.http.upload("media/UploadFile", form, (result: ResultModel) => {
            this.isUploading = false;
            if (result.Code == ResultCode.Success) {
                this.toastr.success("Tải lên tập tin thành công");
                this.ref.close({ confirm: 'yes', uploadedFiles: result.Result });
            } else {
                this.toastr.error("Tải lên thất bại: " + result.Message);
            }
        }, () => {
            this.isUploading = false;
            this.toastr.error("Vui lòng kiểm tra kết nối Internet");
        });
    }
}