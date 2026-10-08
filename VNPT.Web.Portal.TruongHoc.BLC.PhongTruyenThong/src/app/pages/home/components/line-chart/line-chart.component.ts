import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

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
  standalone: false,
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
    // Chart.js 4: legend/title/tooltip nằm trong "plugins" (Chart.js 2 để ở cấp gốc).
    this.pieOPtions = {
      plugins: {
        ...this.pluginsOfflineOnline,
        tooltip: {
          enabled: true
        },
        legend: {
          position: 'bottom',
          display: true,
          labels: {
            // This more specific font property overrides the global property
            font: {
              size: 24
            }
          }
        },
        title: {
          display: true,
          text: this.title
        }
      },
      responsive: true,
      animation: {
        duration: 500,
        easing: "easeOutQuart",
        onComplete: function (e: any) {
          const chart = e.chart;
          const ctx = chart.ctx;
          ctx.font = 'bold 15px "Helvetica Neue", "Helvetica", "Arial", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          chart.data.datasets.forEach(function (dataset: any, datasetIndex: number) {
            const total = dataset.data.reduce((partialSum: any, a: any) => partialSum + a, 0);
            // tooltipPosition() = điểm giữa cung (bán kính giữa, góc giữa) như cách tính cũ
            chart.getDatasetMeta(datasetIndex).data.forEach(function (arc: any, i: number) {
              const { x, y } = arc.tooltipPosition();
              ctx.fillStyle = '#fff';
              const percent = "(" + String(Math.round(dataset.data[i] / total * 10000) / 100) + ")%";
              ctx.fillText(dataset.data[i].toLocaleString('en', { maximumSignificantDigits: 21 }), x, y);
              // Display percent in another line, line break doesn't work for fillText
              ctx.fillText(percent, x + 5, y + 20);
            });
          });
        }
      }
    };

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.chartData = changes.data.currentValue;//this.populateChartData(changes.data.currentValue);
      if (this.pieOPtions.plugins?.legend)
        this.pieOPtions.plugins.legend.display = this.chartData.labels.length < 20;

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
