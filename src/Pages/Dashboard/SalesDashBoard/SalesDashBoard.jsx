import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { common, order } from "../../../api/call";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const salesTeamsData = [
  { team: 1, kw: 150 },
  { team: 2, kw: 130 },
  { team: 3, kw: 180 },
  { team: 4, kw: 120 },
  { team: 5, kw: 140 },
  { team: 6, kw: 110 },
  { team: 7, kw: 160 },
  { team: 8, kw: 170 }
];

const totalKW = salesTeamsData.reduce((sum, team) => sum + team.kw, 0);

const SalesDashboard = () => {
  const [selectedState, setSelectedState] = React.useState('Gujarat');
  const [barChartData, setBarChartData] = useState(null);
  const [barChartDataYearly, setBarChartDataYearly] = useState(null);
  const [compnayKw, setcompnayKw] = useState(0);
  const [totalorder, settotalorder] = useState(0);
  const [totalmanagerKw, settotalmanagerKw] = useState(0);
  const [orderData, setOrderData] = useState({ totalOrderCount: 0, totalConformKilowatt: 0 });
  const [topSalesData, setTopSalesData] = useState([]);
  const fetchTopSales = async () => {
    try {
      const response = await common.topSales()
      setTopSalesData(response.data || []);
    } catch (error) {
      console.error('Error fetching top sales:', error);
    }
  };
  const uid = localStorage.getItem("uid")
  const position = localStorage.getItem("position")
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await order.getOrderCountByState(selectedState, "SalesManager");
        if (response.data) {
          console.log("response.data", response.data);

          setOrderData(response.data[0] || { totalOrderCount: 0, totalConformKilowatt: 0 });
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchTopSales()
    fetchOrderData();
  }, [selectedState]);

  const indianStates = [
    "Gujrat",
    "Maharashtra",
    "Delhi",
    "Karnataka",
    "Tamil Nadu",
    "Uttar Pradesh",
    "West Bengal",
    "Bihar",
    "Rajasthan",
    "Madhya Pradesh",
    "Punjab",
    "Haryana",
    "Gujarat",
    "Assam",
    "Odisha",
    "Jharkhand",
    "Chhattisgarh",
    "Himachal Pradesh",
    "Uttarakhand",
    "Tripura",
    "Meghalaya",
    "Nagaland",
    "Arunachal Pradesh",
    "Manipur",
    "Mizoram",
    "Sikkim",
    "Andaman and Nicobar Islands",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Puducherry",
    "Ladakh",
    "Jammu and Kashmir",
  ];

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
  const fetchBarChartData = async () => {
    try {
      const currentYear = new Date().getFullYear();

      const response = await order.getsalesofeverymonths({ year: currentYear });
      const salesData = response.data.result || {};

      // Prepare chart data for monthly sales
      const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Kilowatt Sales",
            data: [
              salesData.January?.totalConfirmedKilowatt || 0,
              salesData.February?.totalConfirmedKilowatt || 0,
              salesData.March?.totalConfirmedKilowatt || 0,
              salesData.April?.totalConfirmedKilowatt || 0,
              salesData.May?.totalConfirmedKilowatt || 0,
              salesData.June?.totalConfirmedKilowatt || 0,
              salesData.July?.totalConfirmedKilowatt || 0,
              salesData.August?.totalConfirmedKilowatt || 0,
              salesData.September?.totalConfirmedKilowatt || 0,
              salesData.October?.totalConfirmedKilowatt || 0,
              salesData.November?.totalConfirmedKilowatt || 0,
              salesData.December?.totalConfirmedKilowatt || 0,
            ],
            backgroundColor: "rgb(75, 192, 192)",
            borderColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
          },
        ],
      };

      setBarChartData(chartData);
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  // Fetch yearly sales data
  const fetchYearlyBarChartData = async () => {
    try {
      const currentYear = new Date().getFullYear();

      // Fetch the data from the API
      const response = await order.getyearlyKWsbyCompnay({ year: currentYear });
      const salesData = response.data.yearlyTotals || [];

      // Prepare chart data for yearly sales
      const chartData = {
        labels: salesData.length > 0 ? salesData.map((item) => item.year) : [], // Safe check
        datasets: [
          {
            label: salesData.length > 0 ? salesData.map((item) => item.year) : [],
            data: salesData.length > 0 ? salesData.map((item) => item.totalConfirmedKilowatt) : [], // Safe check
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 1,
          },
        ],
      };

      setBarChartDataYearly(chartData);
    } catch (error) {
      console.error("Error fetching yearly bar chart data:", error);
    }
  };

  const countOrderByManagerId = async () => {
    try {
      const currentYear = new Date().getFullYear();

      // Fetch the data from the API
      const response = await order.getcountOrderByManagerId(uid);
      const salesData = response.data;
      if (response.data) {
        settotalorder(salesData.totalOrderCount)
        settotalmanagerKw(salesData.totalConformKilowatt)
      } else {
        settotalorder(0)
        settotalmanagerKw(0)
      }

      // Set the chart data
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchBarChartData();
      fetchCompnayKWSales()
      fetchYearlyBarChartData()
      countOrderByManagerId()
    } else {
      console.log("No token found, user might not be logged in");
    }
  }, []);



  // Sample profile data
  const profiles = [
    { name: "John Doe", kilowatt: 150, imgSrc: "https://via.placeholder.com/150" },
    { name: "Jane Smith", kilowatt: 200, imgSrc: "https://via.placeholder.com/150" },
    { name: "Alice Johnson", kilowatt: 180, imgSrc: "https://via.placeholder.com/150" },
    { name: "Michael Brown", kilowatt: 220, imgSrc: "https://via.placeholder.com/150" },
    { name: "Linda Davis", kilowatt: 160, imgSrc: "https://via.placeholder.com/150" },
    { name: "Robert Wilson", kilowatt: 210, imgSrc: "https://via.placeholder.com/150" },
    { name: "Emily Clark", kilowatt: 190, imgSrc: "https://via.placeholder.com/150" },
    { name: "David Miller", kilowatt: 170, imgSrc: "https://via.placeholder.com/150" },
  ];

  return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div className="text-2xl font-bold mb-6">HYSUN Total Kilowatt: {compnayKw} kW</div>
        <div className="text-2xl font-bold mb-6">Total Orders: {totalmanagerKw} kW</div>
        <div className="text-2xl font-bold mb-6">Confirmed Order: {totalorder}</div>
      </div>
      <div>
        <h1 className="text-xl font-bold mb-2">Top Sales Executive</h1>
      </div>

      {/* Profile Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 m-2">
        {(topSalesData || []).map((profile, index) => (
          <div
            key={index}
            className="bg-white dark:bg-boxdark shadow-md rounded-lg p-4 flex flex-col items-center"
          >
            <img
              src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACUCAMAAAAqEXLeAAAAh1BMVEX///8wMzj8/PwAAAAuMTciJiwqLTP19fXy8vL4+PgxMjQoLDEsLzQfIynt7e3n5+fU1NQkJScVGiGjo6SysrMZGx6cnZ5+f4APFR0rLC43OT0eHyEABhHd3d7Ly8y8vL12d3lgYmROT1GKi4w/QEJWV1lGSEuUlZYTFRlpamtucHQDEBcLDBC5tgIlAAAKTklEQVR4nO1c53bqvBJFxqKouMi9NzCmvP/z3TEkJ4Ui2TjJt+5i/8oKWN6Wps+Y2eyFF1544YUXXnjhhRf+HGsjswqnKattu9m026psnMLKjDV8pP01twvMwi+r2Ou8hGO6AGDMRdclcVX6hfnX7GCT1pm/RRRjygiJIvjjDBotCGGs/z/a+hlsqPZnG6pZfj33KEKIYeFFm211KANAeajq2BYhZwjp1JvXvrX+A3bnfXH3saCwY/g4xwc/tzLTWK41wHppmJmV+wc2P9oRQVTEe/f3WYIg+rZHdUQTUgeFce9bRhHUMcdIxyLyf1c8NaC4CeEsudj6+V2GFyxzfxty2PAw/lWamrOxF2jBw9JaqXx/ZZXd+YLY+S390YpNF8Eda1+J4QUrv+YU6cdN8Qs0tZnRgD7D2bkDz850446BDjXmzxv4gthE5/FuOfxWSz/GTOek+BFiHzAa0BdqNyM1wGzAIrGwMX5yL80tR7pAuTbqJnCNlseerifbn1JzuEUBsr+IgufWCaIIrOuPHbkTMcTj59Szf9QYoyjyp2L1Fb5gJKmz5xcy6wSx7idYas0JIS9YTrDSbBkInXTBxEEHHFIjEEl3E6273qUIJc3UBrMBpbSd6dZzsE6SZlqOfkJQOGm0VZwI8nZTruh6OjpNLOlOCnI54XMXHkF84qhVm7kcEW8ye2m2FJ2aybMUDbSHtlP5ni1G3n49vbvVSkHs7SQrzXYdopUk/B4Ho6IonER5coj8haX23VXu7ADu/aTnK6xER4t8PLd3GDVFnYp4r7PdhnN+zrt5Eu8yFcNfdBFtnz+lpkM8kIujlh8g89bRG0gk+D6XXQafB4neNc9yzLhONvKgwiwj/o/hGzAtTam2ZRuGEus5pVyDaJ+kh625c5ug79CRPXclZ67NiiOKqmfCFljC1rnUSGhNX0+5CQX3DAYOP2XS122kY6lml949jogkpexqC+u0fia6clPEZXuhgWqh7/L4gU56/Q6j1B0vlVoNWyTTGhff3cczbBmBLGZRPZYjhAC2Lh7bB22Wpfd38Qx2lD1mwxEdHb4sD7Z+fBwAaFrFH3NE4FMl22SECB/GKrhFES8l3ymkHJGOZQcecN1WdLw3rkVUcm0fIkhBtw8dnwYKzpKR2fyaM7qXFM7yKz9zayuFJIZY7Snj40iCL8CPUy+t32wFSIXGweg4zqCXGDFZ3KyykaDgiWQZk4HqDGeoQYwWRTKPaM5VOCI0lz3slrJ6TCJRkD6Ze6yWbqhGUpoVwkJ0+HlD1sDRSfZwOyWRBK8jCxmNo85H5BHLPaa1zMIGWJGkzMBASIj3w+25iZj82Q6KJOVasUsYGi6UVoiE1KFOR7LwUDrc6ThCj6VXKR93KVvJivVweD2sxApGoVFTHCJVnJm5XYywlG1k76VB3mQmaKaBZ9wMJmkTqUpCvKpqzOX5ZgOpztDI1/CIrVDrC6+TxFs4yVfyuS6GVgkyj3gK0XJpq3DkCtLmCiSGNg1yj3TSIo02yzsVkkLB4+Uh4kMdYyHQUcFuTRH0XpClw+u0roLnPn9Pbin79EEOE0gONZQQhqYqcqxtpVtJtyqpv5EiPKwqr4GyoVSp525JrdBcyd2tBpOcqZOcOfxB/QKQqB0ikOQ/R3IZiEccVbtzY0jC/ijJ5Kz3aN79vfTkvvUCYwRJ0O5UNb7TAnGPZKJQJL7APA43QWAnO+X4bu3Mo1v+Ec8d5ZpeNsKY50ByQFvAquwrg0lxNSCMBY8jqyFcIRNEUS0vWLuVSMg/2SSMi8odEtWAfKk2Yv5hBVHQsPRtlQf2XJxbJFzM7SAfMNoE2GE0OAqaRYQOryGZ7q4JgmY3YrQzwHo0+KI6ok81BQZivV8s2sFXBcm4wsdImDXjw0/ODXU2uOunGWYGMI3B3YR8MWYyQSnv/oxV7gf7qm4B2+oQSOcqv8L1+vh1cJLTLlR6im8ErV17mY1mPRYLijn32p3aeOWs77Mk0WZ4I3RdYtqqaU7mVEexIN99Dom8tPLV8pZlHdnlCD11hJr3zoLYuxv4Yh4HKjTNEeHFOceKmZCb86yZ80dprc7suQJNH8K9Mc35FVjKWrr4RqHQIja+bJZqu2D1MA/1hoDLmp9ZlURyjhBq8OrxZloU4XE9Eguyjofn7TLFQi/IZvTQnO3sMYW/Mxh7NMWi+ff15RqR598/cKOK2GIcx5kf3h0R0War8mFqcw1R3hU6iLDF2CGzLGZ2deezValUYPmM8C7LPdbjscOjWolRevvipVor7Cv4nRHRvsJSjm7K51TH+5ufBIP38bKXN6kcbPbMBNMWI3LrcicdwxGhk3NlL8FrIEafmVjLU90ur8OuIlJqKV6DRMUVy3UvVE+Ngu05uVbwflRxJK5GEbVZ0SGuWkG4jZwielVvH2p8PkOU3zjONtFTEtkjgCTum9spFKv5tzH/djA7D43IG77CxIyQLx7L2D4esZHgW9nXinUdP51LOSGxv6SNbvIMR4S+9AvWe4xGdMK+o1/mtPsItVbjteaCRfxpK5sU2YcJJuzhQIj9Idnu6TmOiJw+trJI9G/CNBbuibDNv5XaxZMk0aK9HIs2szaRfppoNLzkyH6fac0V+7IPoOO3czHqhHwzSeNhbG3CDxehbLynSSJxMTlamSBbpcWjAg1cTIS8i3s0t0+zFJeXr9alB45igtd73pEnEXkzucb+OZbE2182LxCI8Xy6Eft+bJagsB/X1GbrXfeE7rCuORtdDeSGPTcme4slI16wOj+4uxmtPfbGPb/TvAoEIYNr5FI4pwiJt/m6rBoXT+rpW2q72idozMyFFEXE0L/32Jx4TPoQ97TgLLIth0D3R974Bu1BOH47oizwBp555L2XWwpiI8oneOXhGhDnE44iurvoo5bXKX3cVfwMmta5dnkJ1I8osYcXaFVhVmB+uk32ZjaKPbk7Bf8FLCFVcXnQWdaGSBfVD1a6V0EI0Qbx30K3dR7gUEqThTh428Xzi8mEdcGo4pQqNJdhsMHt+2FphtNS26b3mDLMWesY7xY7b2Hr7WhQF2o4RziuvWCIHj+9x5L5Zc0FX3yXzwX8sy0vpd7+y5pVghnT+X5CV3gPS/eUEMRZ8BEHrs3cLWMxn588L7Ft2+vCNPXi0snNj4DWChAYHp66v9MdMgKGITM5Vl87c2vTKpzdrmmanVNY5pd4e5VXna0jzIIfednsJvKDB84cp7VjPRavS3RrOdsUrCoW+x8zPLfuvMzrjur9j0ZUjsSamE4V2yCLNKzzX+wDXpCXcdLfW8zjpsjMG9nU0syKZjMXC6TD05S/t4vv6M/R8tu0HzSnoovqEgQx73+dBWCYWQ7iWdZRl/S/IcPT1pfIxQ8CrHlMuc0YWlCOe2sZnwEGsv9VngXkghjTOMj/4EduPmOZ+4eWh/wtENbPeDeUYdIe/N+XxFtYZpYTtMd0noaCnyHCY5p2beDm2X+C4QeMLHf9y+SA7+bW7xlEVfxHfk3rhRdeeOGFF1544f8K/wMhALkR+adD6wAAAABJRU5ErkJggg==`}
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
        {/* Monthly Sales Chart */}
        <div className="bg-gray-800 rounded-lg p-4 relative">
          {barChartData ? (
            <>
              <Bar data={barChartData} />
              <div className="absolute inset-0 bg-gradient-to-br from-green-300 via-green-400 to-green-300 opacity-30 rounded-lg"></div>
              <h1 className="mt-3 items-center flex mx-auto w-full">Graph By Months</h1>
            </>
          ) : (
            <p>Loading Monthly Sales Data...</p>
          )}
        </div>

        {/* Yearly Sales Chart */}
        <div className="bg-gray-800 rounded-lg p-4 relative">
          {barChartDataYearly ? (
            <>
              <Bar data={barChartDataYearly} />
              <div className="absolute inset-0 bg-gradient-to-br from-red-300 via-red-400 to-red-300 opacity-30 rounded-lg"></div>
              <h1 className="mt-3 items-center flex mx-auto w-full">Graph By Yearly</h1>
            </>
          ) : (
            <p>Loading Yearly Sales Data...</p>
          )}
        </div>
      </div>

      {/* Sales by State */}



      {position === "Manager" &&
        <>
          <div className="flex justify-center mt-2">
            <p className="text-xl font-semibold">Sales Team</p>
          </div>
          <div className="bg-gray-800 shadow-md dark:shadow-lg rounded-lg p-4 flex flex-row justify-between items-center dark:bg-boxdark">
            <div className="text-gray-100 ">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-md p-2 dark:bg-boxdark"
              >
                {indianStates.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-gray-100">
              <p className="text-xl font-semibold">{selectedState} : {orderData.totalConformKilowatt} KW</p>
            </div>
            <p className="text-xl font-semibold">Total Orders: {orderData.totalOrderCount} orders</p>
          </div>
        </>}

      {/* <div className="bg-gray-800 shadow-md dark:shadow-lg rounded-lg p-4 flex flex-row justify-between items-center">
        <p className="text-xl font-semibold">Sales Senior Executive : 150KW</p>
        <div className="text-xl font-semibold">Total Orders: 20 kW</div>
        <div className="text-xl font-semibold">Confirmed Order: 15</div>
      </div> */}
      {/* <div className="bg-gray-800 shadow-md dark:shadow-lg rounded-lg p-4 flex flex-row justify-between items-center">
        <p className="text-xl font-semibold">Sales Junior Executive : 150KW</p>
        <div className="text-xl font-semibold">Total Orders: 20 kW</div>
        <div className="text-xl font-semibold">Confirmed Order: 15</div>
      </div> */}
    </div>
  );

};

export default SalesDashboard;