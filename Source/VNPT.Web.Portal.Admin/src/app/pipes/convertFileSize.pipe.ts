import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'convertFileSize'
})
export class ConvertFileSizePipe implements PipeTransform {
    transform(value: number): string {
        if (value < 1024) {
            return value + ' KB';
        } else if (value < 1024 * 1024) {
            return (value / 1024).toFixed(2) + ' MB';
        } else if (value < 1024 * 1024 * 1024) {
            return (value / (1024 * 1024 )).toFixed(2) + ' GB';
        } else  {
            return (value / (1024 * 1024 * 1024 )).toFixed(2) + ' TB';
        }
    }
}