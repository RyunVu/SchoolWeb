import { environment } from "src/environments/environment";

export class BaseService {

    get apiUrl(): string {
        return environment.apiUrl;
        //return "/Hub/";
    }
    get apiIocUrl(): string {
        return environment.iocUrl;
        //return "/Hub/";
    }

    get mediaUrl(): string {
        //return "https://media.dalat.vn/";
        return environment.mediaUrl;
        //return "https://localhost:44381/";
        // return "/Hub/";
    }

    public static convertToUnsignChar(text: string): string {
        if (text == undefined || text == '')
            return '';
        text = text.toLowerCase();
        text = text.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        text = text.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        text = text.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        text = text.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        text = text.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        text = text.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        text = text.replace(/đ/g, "d");
        //text = text.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, "-");
        //text = text.replace(/-+-/g, "-"); //thay thế 2- thành 1-
        //text = text.replace(/^\-+|\-+$/g, "");
        return text;
    }

    public static setLogin(data: any) {

        var valueData = JSON.parse(data.user);

        localStorage.setItem('OrganizationId', valueData.OrganizationId);
        localStorage.setItem('LocationNationalId', valueData.LocationNationalId);
        localStorage.setItem('LocationProvinceId', valueData.LocationProvinceId);
        localStorage.setItem('LocationDistrictId', valueData.LocationDistrictId);
        localStorage.setItem('LocationWardId', valueData.LocationWardId);
        localStorage.setItem('LocationStreetId', valueData.LocationStreetId);
        
        localStorage.setItem('OrganizationName', data.OrganizationName);
        localStorage.setItem('MulRole', data.MulRole);
        localStorage.setItem('userId', data.userId);
    }

    get OrganizationName(): any {
        return localStorage.getItem("OrganizationName") != "null" ? localStorage.getItem("OrganizationName") : null;
    }
    get MulRole(): any {
        return localStorage.getItem("MulRole") != "null" ? localStorage.getItem("MulRole") : null;
    }
    get UserId(): any {
        return localStorage.getItem("userId") != "null" ? localStorage.getItem("userId") : null;
    }
    get OrganizationId(): any {
        return localStorage.getItem("OrganizationId") != "null" ? localStorage.getItem("OrganizationId") : null;
    }
    get LocationNationalId(): any {
        return localStorage.getItem("LocationNationalId") != "null" ? localStorage.getItem("LocationNationalId") : null;
    }
    get LocationProvinceId(): any {
        return localStorage.getItem("LocationProvinceId") != "null" ? localStorage.getItem("LocationProvinceId") : null;
    }
    get LocationDistrictId(): any {
        return localStorage.getItem("LocationDistrictId") != "null" ? localStorage.getItem("LocationDistrictId") : null;
    }
    get LocationWardId(): any {
        return localStorage.getItem("LocationWardId") != "null" ? localStorage.getItem("LocationWardId") : null;
    }
    get LocationStreetId(): any {
        return localStorage.getItem("LocationStreetId") != "null" ? localStorage.getItem("LocationStreetId") : null;
    }

    public static removeLogin() {
        localStorage.clear();
    }
}