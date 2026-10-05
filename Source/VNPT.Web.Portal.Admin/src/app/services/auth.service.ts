import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class AuthService { 
    get user(): any {
        var u = this.cookieService.get('user');
        var re = JSON.parse(u) ;
        if(re.AvatarUrl == null)
        {
            re.AvatarUrl = 'assets/img/user2-160x160.jpg';
        }
        return re;
    }


    constructor(
        private cookieService: CookieService,
        private router:Router
        ) {
    }
 
    isUserLoggedIn(): boolean {
        return this.cookieService.check('access_token')
    }

    loginUser(data: any)
    {
        var dateExpires = new Date(data['.expires']);
        this.cookieService.set('access_token', data.access_token, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('token_type', data.token_type, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('userName', data.userName, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('user', data.user, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('defaultMenu', data.DefaultMenu, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('MulRole', data.MulRole, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('MulRoleLevel', data.MulRoleLevel, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('TemplateUnitId', data.TemplateUnitId, { expires: dateExpires, sameSite: 'Lax' });
    }
    
    // isAdminUser():boolean {
    //     if (this.userName=='Admin') {
    //         return true; 
    //     }
    //     return false;
    // }
    
    logoutUser(autoRedirect: boolean = true): void{
        this.cookieService.delete('access_token');
        this.cookieService.delete('token_type');
        this.cookieService.delete('userName');
        if(autoRedirect)
            this.router.navigate(["login"]);
    }
 
} 