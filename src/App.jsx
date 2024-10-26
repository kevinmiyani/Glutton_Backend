import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import SignIn from "./Pages/Authentication/SignIn";
import SignUp from "./Pages/Authentication/SignUp";
import Calendar from "./Pages/Calendar";
import ECommerce from "./Pages/Dashboard/Ecommerce";
import FormElements from "./Pages/Form/FormElements";
import FormLayout from "./Pages/Form/FormLayout";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";
import Alerts from "./Pages/UiElements/Alerts";
import Buttons from "./Pages/UiElements/Buttons";
import DefaultLayout from "./layout/DefaultLayout";
import LicesingManager from "./Pages/Screens/LicesingManager";
import Maintenance from "./Pages/Screens/Maintenance";
import ProjectManager from "./Pages/Screens/ProjectManager";
import SalesManager from "./Pages/Screens/SalesManager";
import Stock from "./Pages/Screens/Stock";
import StockManager from "./Pages/Screens/StockManager";
import Orders from "./Pages/Screens/Orders";
import Chat from "./Pages/Screens/Chat";
import ChatGroup from "./Pages/Screens/ChatGroup";
import Addorders from "./Pages/Screens/Addorders";
import AddExecutive from "./Pages/Screens/AddExecutive";
import StockManagerProfile from "./components/StockManagerProfile";
import ProtectedRoute from "./Pages/ProtectedRoute";
// import Deller from './Pages/Screens/Deller';
// import StateManager from './Pages/Screens/AddStateManager';
import AddSalesOrder from "./Pages/AddOrder/AddSalesOrder";
import AddLicesingOrder from "./Pages/AddOrder/AddLicesingOrder";
import AddProjectOrder from "./Pages/AddOrder/AddProjectOrder";
import AddStockOrder from "./Pages/AddOrder/AddStockOrder";
import AddMaintenanceOrder from "./Pages/AddOrder/AddMaintenanceOrder";
import AddDeller from "./Pages/Screens/AddDeller";
import Deller from "./Pages/Screens/Deller";
import AddStateManager from "./Pages/Screens/AddStateManager";
import StateManager from "./Pages/Screens/StateManager";
import socketServices from "./api/Socket";
import InvoiceForm from "./Pages/Bill/InvoiceForm";
import TellyScreen from "./Pages/Screens/TellyScreen";
import MaintainaneceProfile from "./Pages/AddProfile/MaintainaneceProfile";
import DealerProfile from "./Pages/AddProfile/DealerProfile";
import LicesingProfile from "./Pages/AddProfile/LicesingProfile";
import ProjectProfile from "./Pages/AddProfile/ProjectProfile";
import SalesProfile from "./Pages/AddProfile/SalesProfile";
import StateProfile from "./Pages/AddProfile/StateProfile";
import StokeProfile from "./Pages/AddProfile/StokeProfile";
import SalesOrder from "./Pages/OrderScreen/SalesOrder";
import AddAccountOrder from "./Pages/AddOrder/AddAccountOrder";
import CreateOrder from "./Pages/Screens/CreateOrder";
import Designer from './Pages/Screens/Designer';
import OrderDetails from "./Pages/AddOrder/OrderDetails";
import Compain from "./Pages/Screens/Compain";
import AddStateOrder from "./Pages/AddOrder/AddStateOrder";
import SecondDesigner from "./Pages/Screens/SecondDesigner";
import CalendarL from "./Pages/CalenderL";
import Customer from "./Pages/customer/Customer";
import ResetPassword from "./Pages/Authentication/ResetPassword";
import Announcement from "./Pages/Screens/Announcement";

function App() {
  const [loading, setLoading] = useState(true);
const userId = localStorage.getItem("uid")

useEffect(() => {
  setTimeout(() => setLoading(false), 1000);
  const initialize = async () => {
        await socketServices.initializeSocket();
      };
  
      initialize();
    }, []);
  

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <DefaultLayout>
                <PageTitle title="Dashboard" />
                <ECommerce />
              </DefaultLayout>
            }
          />

          <Route
            path="/calendar"
            element={
              <DefaultLayout>
                <PageTitle title="Calendar" />
                <Calendar />
              </DefaultLayout>
            }
          />
          <Route
            path="/calendarl"
            element={
              <DefaultLayout>
                <PageTitle title="CalendarL" />
                <CalendarL />
              </DefaultLayout>
            }
          />
          <Route
            path="/designer"
            element={
              <DefaultLayout>
                <PageTitle title="Calendar" />
                <Designer />
              </DefaultLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <DefaultLayout>
                <PageTitle title="Profile" />
                <Profile />
              </DefaultLayout>
            }
          />
          <Route
            path="/createorder"
            element={
              <DefaultLayout>
                <PageTitle title="Profile" />
                <CreateOrder />
              </DefaultLayout>
            }
          />

          <Route
            path="/forms/form-elements"
            element={
              <DefaultLayout>
                <PageTitle title="Form Elements" />
                <FormElements />
              </DefaultLayout>
            }
          />
          <Route
            path="/forms/form-layout"
            element={
              <DefaultLayout>
                <PageTitle title="Form Layout" />
                <FormLayout />
              </DefaultLayout>
            }
          />

          <Route
            path="/settings"
            element={
              <DefaultLayout>
                <PageTitle title="Settings" />
                <Settings />
              </DefaultLayout>
            }
          />

          <Route
            path="/ui/alerts"
            element={
              <DefaultLayout>
                <PageTitle title="Alerts" />
                <Alerts />
              </DefaultLayout>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <DefaultLayout>
                <PageTitle title="Buttons" />
                <Buttons />
              </DefaultLayout>
            }
          />
          <Route
            path="/orderDetails"
            element={
              <DefaultLayout>
                <PageTitle title="order Details" />
                <OrderDetails />
              </DefaultLayout>
            }
          />
          <Route
            path="/compain"
            element={
              <DefaultLayout>
                <PageTitle title="Compain" />
                <Compain />
              </DefaultLayout>
            }
          />
          <Route
            path="/licesingmanager"
            element={
              <DefaultLayout>
                <PageTitle title="Licesing Manager" />
                <LicesingManager />
              </DefaultLayout>
            }
          />
          <Route
            path="/maintenance"
            element={
              <DefaultLayout>
                <PageTitle title="Maintenance" />
                <Maintenance />
              </DefaultLayout>
            }
          />
          <Route
            path="/projectmanager"
            element={
              <DefaultLayout>
                <PageTitle title="Project Manager" />
                <ProjectManager />
              </DefaultLayout>
            }
          />
          <Route
            path="/salesmanager"
            element={
              <DefaultLayout>
                <PageTitle title="Sales Manager" />
                <SalesManager />
              </DefaultLayout>
            }
          />
          <Route
            path="/adddeller"
            element={
              <DefaultLayout>
                <PageTitle title="AddDeller" />
                <AddDeller />
              </DefaultLayout>
            }
          />
          <Route
            path="/deller"
            element={
              <DefaultLayout>
                <PageTitle title="Deller" />
                <Deller />
              </DefaultLayout>
            }
          />
          <Route
            path="/statemanger"
            element={
              <DefaultLayout>
                <PageTitle title="Statemanger" />
                <StateManager />
              </DefaultLayout>
            }
          />
          <Route
            path="/addstatemanger"
            element={
              <DefaultLayout>
                <PageTitle title="Addstatemanger" />
                <AddStateManager />
              </DefaultLayout>
            }
          />
          <Route
            path="/addsalesorder"
            element={
              <DefaultLayout>
                <PageTitle title="" />
                <AddSalesOrder />
              </DefaultLayout>
            }
          />
          <Route
            path="/addstateorder"
            element={
              <DefaultLayout>
                <PageTitle title="" />
                <AddStateOrder />
              </DefaultLayout>
            }
          />
          <Route
            path="/addlicesingorder"
            element={
              <DefaultLayout>
                <PageTitle title="" />
                <AddLicesingOrder />
              </DefaultLayout>
            }
          />
          <Route
            path="/addprojectorder"
            element={
              <DefaultLayout>
                <PageTitle title="" />
                <AddProjectOrder />
              </DefaultLayout>
            }
          />
          
          <Route
            path="/addstockorder"
            element={
              <DefaultLayout>
                <PageTitle title="" />
                <AddStockOrder />
              </DefaultLayout>
            }
          />
          <Route
            path="/announcement"
            element={
              <DefaultLayout>
                <PageTitle title="" />
                <Announcement />
              </DefaultLayout>
            }
          />
          <Route
            path="/addmaintenanceorder"
            element={
              <DefaultLayout>
                <PageTitle title="" />
                <AddMaintenanceOrder />
              </DefaultLayout>
            }
          />
          <Route
            path="/addaccountorder"
            element={
              <DefaultLayout>
                <PageTitle title="" />
                <AddAccountOrder />
              </DefaultLayout>
            }
          />
          <Route
            path="/stock"
            element={
              <DefaultLayout>
                <PageTitle title="Stock" />
                <Stock />
              </DefaultLayout>
            }
          />

          <Route
            path="/storemanager"
            element={
              <DefaultLayout>
                <PageTitle title="Stock Manager" />
                <StockManager />
              </DefaultLayout>
            }
          />
          <Route
            path="/SecondDesigner"
            element={
              <DefaultLayout>
                <PageTitle title="Second Designer" />
                <SecondDesigner />
              </DefaultLayout>
            }
          />
          <Route
            path="/orders"
            element={
              <DefaultLayout>
                <PageTitle title="Orders" />
                <Orders />
              </DefaultLayout>
            }
          />
          <Route
            path="/customerdetails"
            element={
              <DefaultLayout>
                <PageTitle title="Customer" />
                <Customer />
              </DefaultLayout>
            }
          />
          {/* <Route
            path="/sales-order"
            element={
              <DefaultLayout>
                <PageTitle title="Orders" />
                <SalesOrder/>
              </DefaultLayout>
            }
          /> */}
          {/* <Route
          path="/designer"
          element={
            <DefaultLayout>
              <PageTitle title="Designer" />
              <Designer />
            </DefaultLayout>
          }
        /> */}
          <Route
            path="/chat/:roomId"
            element={
              <DefaultLayout>
                <PageTitle title="Chat" />
                <Chat />
              </DefaultLayout>
            }
          />
          <Route
            path="/chatgroup"
            element={
              <DefaultLayout>
                <PageTitle title="Chat Group" />
                <ChatGroup />
              </DefaultLayout>
            }
          />
          <Route
            path="/addorders"
            element={
              <DefaultLayout>
                <PageTitle title="Addorders" />
                <Addorders />
              </DefaultLayout>
            }
          />
          <Route
            path="/telly"
            element={
              <DefaultLayout>
                <TellyScreen>
                  <PageTitle title="telly" />
                  {/* <StockManagerProfile /> */}
                </TellyScreen>
              </DefaultLayout>
            }
          />

          <Route
            path="/addexecutive"
            element={
              <DefaultLayout>
                <PageTitle title="AddExecutive" />
                <AddExecutive />
              </DefaultLayout>
            }
          />
          <Route
            path="/manager-profile"
            element={
              <DefaultLayout>
                <PageTitle title="Profile" />
                <StockManagerProfile />
              </DefaultLayout>
            }
          />
          <Route
            path="/maintainanece-profile"
            element={
              <DefaultLayout>
                <PageTitle title="Profile" />
                <MaintainaneceProfile />
              </DefaultLayout>
            }
          />
          <Route
            path="/licesing-profile"
            element={
              <DefaultLayout>
                <PageTitle title="Profile" />
                <LicesingProfile />
              </DefaultLayout>
            }
          />
          <Route
            path="/project-profile"
            element={
              <DefaultLayout>
                <PageTitle title="Profile" />
                <ProjectProfile />
              </DefaultLayout>
            }
          />
          <Route
            path="/sales-profile"
            element={
              <DefaultLayout>
                <PageTitle title="Profile" />
                <SalesProfile />
              </DefaultLayout>
            }
          />
          <Route
            path="/state-profile"
            element={
              <DefaultLayout>
                <PageTitle title="Profile" />
                <StateProfile />
              </DefaultLayout>
            }
          />
          <Route
            path="/store-profile"
            element={
              <DefaultLayout>
                <PageTitle title="Profile" />
                <StokeProfile />
              </DefaultLayout>
            }
          />
          <Route
            path="/Dealer-profile"
            element={
              <DefaultLayout>
                <PageTitle title="Profile" />
                <DealerProfile />
              </DefaultLayout>
            }
          />
          <Route
            path="/bill"
            element={
              <InvoiceForm>
                <PageTitle title="Bill" />
                {/* <StockManagerProfile /> */}
              </InvoiceForm>
            }
          />

<Route
            path="/addaccountorder"
            element={
              <DefaultLayout>
                <PageTitle title="" />
                <AddAccountOrder />
              </DefaultLayout>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import SignIn from "./Pages/Authentication/SignIn";
// import SignUp from "./Pages/Authentication/SignUp";
// import Loader from "./common/Loader";
// import PageTitle from "./components/PageTitle";
// import ECommerce from "./Pages/Dashboard/Ecommerce";
// import DefaultLayout from "./layout/DefaultLayout";

// function App() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1000);
//   }, []);

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/auth/signin"
//           element={
//             <>
//               <PageTitle title="Sign In" />
//               <SignIn />
//             </>
//           }
//         />
//         <Route
//           path="/auth/signup"
//           element={
//             <>
//               <PageTitle title="Sign Up" />
//               <SignUp />
//             </>
//           }
//         />
//         <Route
//           path="*"
//           element={
//             <DefaultLayout>
//               <Routes>
//                 <Route
//                   index
//                   element={
//                     <>
//                       <PageTitle title="Dashboard" />
//                       <ECommerce />
//                     </>
//                   }
//                 />
//               </Routes>
//             </DefaultLayout>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
