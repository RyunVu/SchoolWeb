import { Pipe, PipeTransform } from '@angular/core';
import { BaseService } from '../services';

@Pipe({
    standalone: false,
    name: 'statusPipe',
})
export class statusPipe implements PipeTransform {
    constructor(
        private baseService: BaseService
    ){

    }
    transform(status: any, type: any = "Booking") {
        var re = '';
        switch(type)
        {
            case "Booking":
              
                break;
            default:
                break;
        }
        return re;
    }
}
