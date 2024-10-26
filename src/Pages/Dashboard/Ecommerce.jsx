import React from "react";
import CardDataStats from "../../components/CardDataStats";
import ChartOne from "../../components/Charts/ChartOne";
// import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from "../../components/Charts/ChartTwo";
import ChatCard from "../../components/Chat/ChatCard";
import "./ECommerce.css";
import { useState, useEffect } from "react";
import { common, order } from "../../api/call";
import SalesDashboard from "./SalesDashBoard/SalesDashBoard";
import MaintenanceDashBoard from "./MaintenanceDashBoard/MaintenanceDashBoard";
import LicesingDashBoard from "./LicesingDashBoard/LicesingDashBoard";
import ProjectDashBoard from "./ProjectDashBoard/ProjectDahBoard";
import StoreDashBoard from "./StoreDashBoard/StoreDashBoard";
import DesignerDashBoard from "./DesignerDashBoard/DesignerDashBoard";
import AccountDashBoard from "./AccountDashBoard/AccountDashBoard";
import StateDashBoard from "./stateDashboard/StateDashBoard";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement

} from "chart.js";

// Register the chart components with ChartJS
ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ECommerce = () => {
  const [Count, setCount] = useState({
    totalCustomer: 0,
    totalOrder: 0,
    totalProfit: 0,
  });
  const [MonthandWeekProfit, setMonthandWeekProfit] = useState([]);
  const role = localStorage.getItem("role");
  const [barChartData, setBarChartData] = useState("");
  const [pieChartData, setPieChartData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [compnayKw, setcompnayKw] = useState(0);
  const [topSalesData, setTopSalesData] = useState([]);


  const fetchTopSales = async () => {
    try {
      const response = await common.topSales()      
      setTopSalesData(response.data || []); // Ensure data is an array
    } catch (error) {
      console.error('Error fetching top sales:', error);
    }
  };


  // Fetch sales data by state
  const fetchSalesData = async () => {
    try {
      const response = await order.getsalesstates();
      setSalesData(response.data); // Assuming the data is in response.data
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const fetchCompnayKWSales = async () => {
    try {
      const response = await order.getCompnayKWSales();
      
      // Ensure the value is rounded to 2 decimal places
      const roundedKW = parseFloat(response.data?.totalConformKilowatt).toFixed(2);
  
      setcompnayKw(roundedKW);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };
  
  

  const fetchUserCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      const CountResponse = await common.getUserandCustomerCount();

      setCount(CountResponse.data.data);
      setTotalOrders(CountResponse?.data?.data?.totalOrder);
      // setUserCount(data.length);
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };
  const fetchMonthandWeekProfit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const ProfitResponse = await order.getMonthandWeekProfit({
        year: year,
        month: month,
      });

      setMonthandWeekProfit(ProfitResponse.data.data);

      // setUserCount(data.length);
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  const barData2 = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Kilowatt Sales",
        data: [65, 59, 80, 81, 56, 55, 35, 40, 90, 21, 22, 36],
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["Sales in State A", "Sales in State B", "Sales in State C"],
    datasets: [
      {
        label: "Sales by State",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 206, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };



  const fetchBarChartData = async () => {
    try {
      const currentYear = new Date().getFullYear();

      const response = await order.getsalesofeverymonths({year:currentYear});
      const salesData = response.data.result || [];
      
      const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Kilowatt Sales",
            data: [
              salesData.January.totalConfirmedKilowatt,
              salesData.February.totalConfirmedKilowatt,
              salesData.March.totalConfirmedKilowatt,
              salesData.April.totalConfirmedKilowatt,
              salesData.May.totalConfirmedKilowatt,
              salesData.June.totalConfirmedKilowatt,
              salesData.July.totalConfirmedKilowatt,
              salesData.August.totalConfirmedKilowatt,
              salesData.September.totalConfirmedKilowatt,
              salesData.October.totalConfirmedKilowatt,
              salesData.November.totalConfirmedKilowatt,
              salesData.December.totalConfirmedKilowatt,
            ],
            backgroundColor: "rgb(75, 192, 192)",
            borderColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
          },
        ],
      };
      console.log("chartData",chartData);
      
      setBarChartData(chartData);
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  // Function to fetch pie chart data (Top 3 Sales by State)
  const fetchPieChartData = async () => {
    try {
      const response = await order.gettop3states();
      const pieData = response.data || [];

      const chartData = {
        labels: pieData.map((item) => `Sales in ${item.state}`),
        datasets: [
          {
            label: "Sales by State",
            data: pieData.map((item) => item.orderCount),
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 206, 86)",
            ],
            hoverOffset: 4,
          },
        ],
      };


      setPieChartData(chartData);
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserCount();
      fetchMonthandWeekProfit();
      fetchBarChartData();
      fetchPieChartData();
      fetchSalesData();
      fetchCompnayKWSales();
      fetchTopSales();

    } else {
      console.log("No token found, user might not be logged in");
    }
  }, []);

  return (
    <>
      {role === "ADMIN" && (
        <div>
          <div>
            {/* Total Kilowatt Display */}
            <div className="text-2xl font-bold mb-6">
              HYSUN Total Kilowatt: {compnayKw} KW
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
              <CardDataStats
                title="Total Profit"
                total={Count.totalProfit}
                rate={`${Count.totalOrder}%`}
                levelUp
              >
                <svg
                  className="fill-green-600 dark:fill-white"
                  width="20"
                  height="22"
                  viewBox="0 0 20 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.7531 16.4312C10.3781 16.4312 9.27808 17.5312 9.27808 18.9062C9.27808 20.2812 10.3781 21.3812 11.7531 21.3812C13.1281 21.3812 14.2281 20.2812 14.2281 18.9062C14.2281 17.5656 13.0937 16.4312 11.7531 16.4312ZM11.7531 19.8687C11.2375 19.8687 10.825 19.4562 10.825 18.9406C10.825 18.425 11.2375 18.0125 11.7531 18.0125C12.2687 18.0125 12.6812 18.425 12.6812 18.9406C12.6812 19.4219 12.2343 19.8687 11.7531 19.8687Z"
                    fill=""
                  />
                  <path
                    d="M5.22183 16.4312C3.84683 16.4312 2.74683 17.5312 2.74683 18.9062C2.74683 20.2812 3.84683 21.3812 5.22183 21.3812C6.59683 21.3812 7.69683 20.2812 7.69683 18.9062C7.69683 17.5656 6.56245 16.4312 5.22183 16.4312ZM5.22183 19.8687C4.7062 19.8687 4.2937 19.4562 4.2937 18.9406C4.2937 18.425 4.7062 18.0125 5.22183 18.0125C5.73745 18.0125 6.14995 18.425 6.14995 18.9406C6.14995 19.4219 5.73745 19.8687 5.22183 19.8687Z"
                    fill=""
                  />
                  <path
                    d="M19.0062 0.618744H17.15C16.325 0.618744 15.6031 1.23749 15.5 2.06249L14.95 6.01562H1.37185C1.0281 6.01562 0.684353 6.18749 0.443728 6.46249C0.237478 6.73749 0.134353 7.11562 0.237478 7.45937C0.237478 7.49374 0.237478 7.49374 0.237478 7.52812L2.36873 13.9562C2.50623 14.4375 2.9531 14.7812 3.46873 14.7812H12.9562C14.2281 14.7812 15.3281 13.8187 15.5 12.5469L16.9437 2.26874C16.9437 2.19999 17.0125 2.16562 17.0812 2.16562H18.9375C19.35 2.16562 19.7281 1.82187 19.7281 1.37499C19.7281 0.928119 19.4187 0.618744 19.0062 0.618744ZM14.0219 12.3062C13.9531 12.8219 13.5062 13.2 12.9906 13.2H3.7781L1.92185 7.56249H14.7094L14.0219 12.3062Z"
                    fill=""
                  />
                </svg>
              </CardDataStats>
              <CardDataStats
                title="Total Order"
                total={Count.totalOrder}
                rate={`${Count.totalOrder}%`}
                levelUp
              >
                <svg
                  className="fill-green-600 dark:fill-white"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
                    fill=""
                  />
                  <path
                    d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
                    fill=""
                  />
                </svg>
              </CardDataStats>
              {/* levelDown */}
              <CardDataStats
                title="Total Users"
                total={Count.totalCustomer}
                rate={`${Count.totalCustomer}%`}
                levelUp
              >
                <svg
                  className="fill-green-600 dark:fill-white"
                  width="22"
                  height="18"
                  viewBox="0 0 22 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                    fill=""
                  />
                  <path
                    d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                    fill=""
                  />
                  <path
                    d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                    fill=""
                  />
                </svg>
              </CardDataStats>
            </div>
            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
              <ChartOne data={MonthandWeekProfit} />
              <ChartTwo data={MonthandWeekProfit} />

              <div className="col-span-12 xl:col-span-8"></div>
            </div>
          </div>
          <div className="p-6">
            {/* Profile Boxes */}

            <h2 className="text-xl font-bold mb-2">Top Sales Executive</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 m-2">
      {(topSalesData || []).map((profile, index) => (
        <div
          key={index}
          className="bg-white dark:bg-boxdark shadow-md rounded-lg p-4 flex flex-col items-center"
        >
          <img
            src={`data:image/png;base64,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`} 
            alt={profile?.SalesManagerInfo?.name}
            className="w-16 h-16 rounded-full mb-2"
          />
          <div className="text-center">
            <h4 className="font-bold">{profile?.SalesManagerInfo?.name}</h4>
            <p>{profile?.totalConformKilowatt} kW</p>

          </div>
        </div>
      ))}
    </div>

            {/* Graphs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {barChartData !== "" ? (
                <div className="bg-gray-800 rounded-lg p-4 relative">
                  <Bar data={barChartData} />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-300 via-green-400 to-green-300 opacity-30 rounded-lg"></div>
                  <h1 className="mt-3 items-center flex mx-auto w-full">
                    Graph By Months
                  </h1>
                </div>
              ) : (
                <>        <p>Loading Chart...</p>
</>
              )}

<div className="bg-white dark:bg-boxdark shadow-md rounded-lg p-4">
      {pieChartData ? (
        <Pie data={pieChartData} className="mx-auto" />
      ) : (
        <p>Loading Chart...</p>
      )}
    </div>
            </div>
            {/* Sales by State */}
            <div className="bg-white dark:bg-boxdark shadow-md rounded-lg p-4">
              <h4 className="font-bold mb-2">Sales by State</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Render state sales dynamically */}
                {salesData.map((stateData, index) => (
                  <p key={index}>
                    {stateData.state}: {stateData.totalFinalAmount} KW
                  </p>
                ))}
              </div>

              {/* Total Order Number */}
              <div className="mt-4">
                <h4 className="font-bold mb-2">Total Orders</h4>
                <p>Total Orders: {totalOrders}</p> {/* Dynamic total orders */}
              </div>
            </div>
          </div>
        </div>
      )}
      {role === "SALESMANAGER" && <SalesDashboard />}
      {role === "STATEMANAGER" && <StateDashBoard />}
      {role === "MAINTAINANECEMANAGER" && <MaintenanceDashBoard />}
      {role === "LICENSEMANAGER" && <LicesingDashBoard />}
      {role === "PROJECTHANDLER" && <ProjectDashBoard />}
      {role === "STOREMANAGER" && <StoreDashBoard />}
      {role === "DESIGNER" && <DesignerDashBoard />}
      {role === "ACCOUNTS" && <AccountDashBoard />}
    </>
  );
};

export default ECommerce;
