import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
declare var $: any;

import { DisableRightClickService } from '../tablet/services/disable-right-click.service';

@Component({
  selector: 'app-tablet-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TabletMainComponent implements OnInit {
  public sidebarMenuOpened = true;
  @ViewChild('contentWrapper', { static: false }) contentWrapper: any;

  constructor(private renderer: Renderer2, private rightClickDisable: DisableRightClickService) { }

  ngOnInit() {

    //this.rightClickDisable.disableRightClick();

  }

  onActive() {
    // window.scroll({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth'
    // });

    // document.body.scrollTop = 0;
    // document.querySelector('body')?.scrollTo(0, 0)
  }
}
