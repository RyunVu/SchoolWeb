 import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewerModalComponent } from './report-viewer-modal.component';

describe('ReportViewerComponent', () => {
  let component: ReportViewerModalComponent;
  let fixture: ComponentFixture<ReportViewerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportViewerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportViewerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
