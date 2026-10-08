import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-home-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeMainComponent implements OnInit {
  public sidebarMenuOpened = true;
  @ViewChild('contentWrapper', { static: false }) contentWrapper: any;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {}
}
