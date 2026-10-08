import { Pipe, PipeTransform } from '@angular/core';
import { BaseService } from '../services';

@Pipe({
    standalone: false,
    name: 'imageUrlPipe',
})
export class imageUrlPipe implements PipeTransform {
    constructor(
        private baseService: BaseService
    ) {

    }
    transform(value: any, args: string = "") {
        if (!value) {
            return "assets/img/noimage.png";
        }

        var url = "";
        if (typeof value === 'string' || value instanceof String) {
            url = value + "";
        }
        else {
            if (args == "thumb"){
                value = value.ThumbUrl;
            }else{
                value = value.Url;
            }
        }


        if (!value) {
            return "assets/img/noimage.png";
        }
        var regExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        if (!regExp.test(value)) {
            return this.baseService.mediaUrl + value;
        } else {
            return value;
        }
    }
}
