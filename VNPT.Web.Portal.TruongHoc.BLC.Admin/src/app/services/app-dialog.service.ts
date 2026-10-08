import { Injectable, Type } from "@angular/core";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

/**
 * Giữ hành vi DynamicDialog của PrimeNG 11 sau khi nâng cấp lên PrimeNG 21:
 *  - duplicate: true  -> v21 trả về null nếu cùng component đang mở (v11 luôn mở dialog mới).
 *  - closable: true   -> v21 mặc định ẩn nút đóng (X) trên header, v11 luôn hiển thị.
 *  - styleClass 'p-dynamic-dialog' -> v21 không còn class này trên .p-dialog, trong khi
 *    styles.scss dựa vào nó để chừa chỗ cho footer (.p-footer) của các modal.
 */
@Injectable()
export class AppDialogService extends DialogService {
    override open<T, DataType = any, InputValuesType extends Record<string, any> = {}>(
        componentType: Type<T>,
        config: DynamicDialogConfig<DataType, InputValuesType>
    ): DynamicDialogRef<T> | null {
        return super.open(componentType, {
            duplicate: true,
            closable: true,
            closeOnEscape: true,
            ...config,
            styleClass: ['p-dynamic-dialog', config?.styleClass].filter(Boolean).join(' ')
        });
    }
}
