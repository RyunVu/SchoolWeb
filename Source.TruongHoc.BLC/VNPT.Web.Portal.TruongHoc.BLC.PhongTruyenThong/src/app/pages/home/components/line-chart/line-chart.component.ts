import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Chart } from 'chart.js';

const monthLabels = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];
const yearOptions = [
  { value: null, label: 'Tất cả' },
  { value: 1, label: 'Đang hoạt động' },
  { value: 2, label: 'Tạm ngưng hoạt động' },
  { value: 3, label: 'Ngừng hoạt động' },
];

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() title = '';
  @Input() data: any[] = [];
  @Output() yearChange = new EventEmitter<number>();
  @Output() alLvChange = new EventEmitter<number>();
  isAllLinhVuc: boolean = false;

  chartData: any;
  basicOptions: any;
  year: any | undefined;
  yearOptions = yearOptions;
  pieOPtions: any = {};
  constructor() { }
  pluginsOfflineOnline: any = {};
  ngOnInit(): void {
    // Get current year
    this.year = null;
    this.pluginsOfflineOnline = {
      labels: {
        render: 'percentage',
        fontColor: ['green', 'white', 'red'],
        precision: 0,
        arc: true,
      },
      datalabels: {
        formatter: function (value: any, context: any) {
          return context.chart.data.labels[context.dataIndex];
        }
      }
    };
    this.pieOPtions = {
      tooltips: {
        enabled: true
      },
      plugins: this.pluginsOfflineOnline,
      responsive: true,
      legend: {
        position: 'bottom',
        display: true,
        labels: {
          // This more specific font property overrides the global property
          font: {
              size: "24px"
          }
      }
      },
      title: {
        display: true,
        text: this.title
      },
      animation: {
        duration: 500,
        easing: "easeOutQuart",
        onComplete: function (e: any) {
          var ctx = e.chart.ctx;
          ctx.font = 'bold 15px "Helvetica Neue", "Helvetica", "Arial", sans-serif';//Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          e.chart.tooltip._data.datasets.forEach(function (dataset: any) {

            for (var i = 0; i < dataset.data.length; i++) {
              var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                start_angle = model.startAngle,
                end_angle = model.endAngle,
                mid_angle = start_angle + (end_angle - start_angle) / 2;

              var x = mid_radius * Math.cos(mid_angle);
              var y = mid_radius * Math.sin(mid_angle);

              ctx.fillStyle = '#fff';
              var total = dataset.data.reduce((partialSum: any, a: any) => partialSum + a, 0);
              var percent = "(" + String(Math.round(dataset.data[i] / total * 10000) / 100) + ")%";
              // var pcent = Math.round(dataset.data[0] / dataset.data[1] * 10000) / 100;
              ctx.fillText(dataset.data[i].toLocaleString('en', { maximumSignificantDigits: 21 }), model.x + x, model.y + y);
              ctx.fillText(percent, model.x + x + 5, model.y + y + 20);
              // Display percent in another line, line break doesn't work for fillText
            }
          });
        }
      }
    };

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.chartData = changes.data.currentValue;//this.populateChartData(changes.data.currentValue);
      if (this.pieOPtions.legend)
        this.pieOPtions.legend.display = this.chartData.labels.length < 20;

    }
  }

  onYearChange(event: any): void {
    this.yearChange.emit(event.value);
  }
  onAllLvChange(event: any): void {
    this.alLvChange.emit(event.checked);
  }

  private populateChartData(data: any[]): any {
    return {
      labels: monthLabels,
      datasets: data,
    };
  }
}
