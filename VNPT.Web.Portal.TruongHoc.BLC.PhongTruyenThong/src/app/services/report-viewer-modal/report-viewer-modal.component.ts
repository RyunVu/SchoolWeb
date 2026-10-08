import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { HttpService } from 'src/app/services';
declare var Stimulsoft: any;

@Component({
  standalone: false,
  selector: 'app-report-viewer-modal',
  templateUrl: './report-viewer-modal.component.html',
  styleUrls: ['./report-viewer-modal.component.scss']
})
export class ReportViewerModalComponent implements OnInit {
  item: any;

  viewer: any;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public http: HttpService) {

    this.item = this.config.data;

    var options = new Stimulsoft.Viewer.StiViewerOptions();
    options.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Direct;
    options.appearance.scrollbarsMode = true;
    this.viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
    var report = new Stimulsoft.Report.StiReport();
    report.loadFile(this.item.ReportFile);
    report.regData("Data", "Data", this.item.ReportData);
    this.viewer.report = report;
    this.viewer.renderHtml('viewReport');
  }

}
