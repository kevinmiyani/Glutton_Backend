import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const options = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      endingShape: 'rounded',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      text: 'Amount',
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: (val) => `$${val}`,
    },
  },
};

const ChartTwo = ({ data }) => {
  const [state, setState] = useState({
    series: [
      {
        name: 'Sales',
        data: [],
      },
      {
        name: 'Revenue',
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (data && data.weeklyProfit) {
      const salesData = data.weeklyProfit.map(item => item.totalSales || 0);
      const revenueData = data.weeklyProfit.map(item => item.totalRevenue || 0);

      
      setState({
        series: [
          {
            name: 'Sales',
            data: salesData,
          },
          {
            name: 'Revenue',
            data: revenueData,
          },
        ],
      });
    }
  }, [data]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Weekly Profit Analysis
          </h4>
        </div>
      </div>

      <div>
        <div id="chartTwo">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
