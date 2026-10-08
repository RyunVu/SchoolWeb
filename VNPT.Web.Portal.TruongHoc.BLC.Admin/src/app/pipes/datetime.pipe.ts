import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: false,
    name: 'datetimePipe',
})
export class datetimePipe implements PipeTransform {
    constructor(
        private datePipe: DatePipe
    ){

    }
    transform(value: string): any {
        if(value != null && value.length > 0)
        {
            if(value.length == 10)
            {
                var ls = value.split("/");
                return new Date(Number(ls[0]), Number(ls[1])-1, Number(ls[2]));
            }
            if(value.length == 19)
            {
                var ls = value.substr(0,10).split("/");
                var ls2 = value.substr(11,9).split(":");
                return new Date(Number(ls[0]), Number(ls[1])-1, Number(ls[2]),Number(ls2[0]), Number(ls2[1]), Number(ls2[2]));
            }
        }
        else
        return null;
    }
    transformBack(value: Date): any {
        if(value != null)
        {
            return this.datePipe.transform(value, 'yyyy/MM/dd', 'vi');
        }
        else
            return null;
    }
}
