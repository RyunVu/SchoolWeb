import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services';
declare var Stimulsoft: any;

@Component({
  standalone: false,
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.scss']
})
export class ReportViewerComponent implements OnInit {
  viewer: any;

  constructor(
    private baseService: BaseService
  ) {
  }

  ngOnInit(): void {
    var options = new Stimulsoft.Viewer.StiViewerOptions();
    options.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Direct;
    options.appearance.interfaceType = Stimulsoft.Viewer.StiInterfaceType.Auto;
    options.height = "650px";
    options.appearance.scrollbarsMode = true;
    this.viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);
    
    this.viewer.renderHtml('viewReport');
    //
    //this.loadData();
  }

  public loadData() {

    var reportData = {
      Booking: [],
      BookingDetail: []
  }
  var report = new Stimulsoft.Report.StiReport();
  report.loadFile("assets/reports/BCReviewBooking.mrt");
  //
  //report.dictionary.variables.getByName("Header").valueObject = "";
  //report.dictionary.variables.getByName("HeaderDate").valueObject = "Ngày Giao Hàng " + this.datePipe.transform(this.filter.FromDate, 'dd/MM/yyyy');
  //
  report.regData("Data", "Data", reportData);
  this.viewer.report = report;

  }
}
