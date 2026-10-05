import { Renderer2 } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.addClass(
      document.querySelector('body'),
      'hold-transition'
    );
  }

}
