import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from 'src/app/services';

@Injectable({
    providedIn: 'root',
})
export class MenuSidebarService {
    constructor(private httpService: HttpService) { }

    // Define an observable subject and when I emit this observable, it will emit the menu
    menu = new Subject<void>();

    reloadMenu() {
        this.menu.next();
    }
}
