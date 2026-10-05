import { Component, Input, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class WidgetComponent implements OnInit {
  @Input() title = '';
  @Input() subTitle = '';
  @Input() leftIcon = '';

  constructor() {}

  ngOnInit(): void {}
}
