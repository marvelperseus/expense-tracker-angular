import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-monthly-summary-chart',
  templateUrl: './monthly-summary-chart.component.html',
  styleUrls: ['./monthly-summary-chart.component.less']
})
export class MonthlySummaryChartComponent implements OnInit, OnChanges {

  @Input() data: any;
  currentData: any;
  originalData: any;
  date: Date = new Date();


  chart: any;
  options = {
    chart: {
      type: 'column'
    },
    title: {
      text: ''
    },
    subtitle: {
      text: 'Click the columns to view month details'
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Total monthly expense amount'
      }

    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '${point.y:.2f}'
        }
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>${point.y:.2f}</b> <br/>'
    },

    series: [{
      name: 'Months',
      colorByPoint: true,
      data: []
    }],
    drilldown: {
      series: []
    }
  };


  constructor(private router: Router) {
  }

  ngOnInit() {
    this.originalData = [...this.data];
    this.currentData = this.data;
  }

  ngOnChanges(changes: any) {
    if (!changes.data.firstChange) {
      if (this.chart) {
        this.originalData = [...this.data];
        this.currentData = this.data;
        this.setDataForMonthRange();
      }
    }
  }

  saveInstance(chartInstance: any) {
    this.chart = chartInstance;
    this.setDataForMonthRange();
  }

  isDataEmpty(): boolean {
    return this.data.length === 0;
  }

  checkDate(e: any) {
    this.setDataForMonthRange();
  }

  setDataForMonthRange() {
    let monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    let monthRange = this.getDateRange();

    let monthSummary = [];
    let drillDown = [];
    for (let month of monthRange) {
      let monthSum = 0;
      let drillDownData = [];

      for (let expense of this.currentData) {

        let currentDate = new Date(expense.date);
        if (month.getMonth() === currentDate.getMonth() && month.getFullYear() === currentDate.getFullYear()) {
          monthSum += expense.amount;
          drillDownData.push(expense);
        }
      }
      let parsedSum;
      if (monthSum !== 0) {
        parsedSum = monthSum.toFixed(2);
      }
      monthSummary.push({
        name: monthNames[month.getMonth()],
        y: parseFloat(parsedSum),
        drilldown: monthNames[month.getMonth()]
      });
      drillDown.push({
        name: monthNames[month.getMonth()],
        id: monthNames[month.getMonth()],
        data: this.getDrillDownData(drillDownData)
      });
    }
    this.chart.series[0].setData(monthSummary);
    this.chart.options.drilldown.series = drillDown;
  }

  getDrillDownData(data: any) {

    let summaryData = [];
    const categories = data.map(item => item.category)
      .filter((value, index, self) => self.indexOf(value) === index);

    for (let category of categories) {
      let categorySum = 0;
      for (let expense of data) {
        if (category === expense.category) {
          categorySum += expense.amount;
        }
      }
      summaryData.push([category, categorySum]);
    }
    return summaryData;
  }

  getDateRange() {
    let monthRange = [this.date];
    for (let i = 1; i < 6; i++) {
      let month = new Date(this.date.getTime());
      month.setMonth(this.date.getMonth() + i);
      monthRange.push(month);
    }
    return monthRange;
  }


}
