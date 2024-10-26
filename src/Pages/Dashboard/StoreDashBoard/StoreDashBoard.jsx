import React, { useState,useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";

import { common, order } from "../../../api/call";

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
    ArcElement,
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

const ManagerDashBoard = () => {
    const [salesData, setSalesData] = useState([]);
    const [compnayKw, setcompnayKw] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [barChartData, setBarChartData] = useState("");
    const [pieChartData, setPieChartData] = useState(null);
    const [topSalesData, setTopSalesData] = useState([]);
const fetchTopSales = async () => {
  try {
    const response = await common.topSales()      
    setTopSalesData(response.data || []);
  } catch (error) {
    console.error('Error fetching top sales:', error);
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
    
          setTotalOrders(CountResponse?.data?.data?.totalOrder)
          // setUserCount(data.length);
        } catch (error) {
          console.error("Error fetching user count:", error);
        }
      };
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
         // Function to fetch bar chart data (Sales by Month)
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
          fetchBarChartData();
          fetchPieChartData();
        fetchUserCount()
          fetchSalesData();
          fetchCompnayKWSales()
          fetchTopSales()
        } else {
          console.log("No token found, user might not be logged in");
        }
      }, []);

    const profiles = [
        {
            name: "John Doe",
            kilowatt: 150,
            imgSrc: "https://via.placeholder.com/150",
        },
        {
            name: "Jane Smith",
            kilowatt: 200,
            imgSrc: "https://via.placeholder.com/150",
        },
        {
            name: "Alice Johnson",
            kilowatt: 180,
            imgSrc: "https://via.placeholder.com/150",
        },
        {
            name: "Michael Brown",
            kilowatt: 220,
            imgSrc: "https://via.placeholder.com/150",
        },
        {
            name: "Linda Davis",
            kilowatt: 160,
            imgSrc: "https://via.placeholder.com/150",
        },
        {
            name: "Robert Wilson",
            kilowatt: 210,
            imgSrc: "https://via.placeholder.com/150",
        },
        {
            name: "Emily Clark",
            kilowatt: 190,
            imgSrc: "https://via.placeholder.com/150",
        },
        {
            name: "David Miller",
            kilowatt: 170,
            imgSrc: "https://via.placeholder.com/150",
        },
    ];

    return (
        <div className="p-6">
            {/* Total Kilowatt Display */}
            <div className="text-2xl font-bold mb-6">HYSUN Total Kilowatt: {compnayKw} KW</div>
            <h2 className="text-xl font-bold mb-2">Top Sales Executive</h2>

            {/* Profile Boxes */}
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
      <div className="mt-4">
        <h4 className="font-bold mb-2">Total Orders</h4>
        <p>Total Orders: {totalOrders}</p> {/* Dynamic total orders */}
      </div>
    </div>

        </div>
    );
}

export default ManagerDashBoard