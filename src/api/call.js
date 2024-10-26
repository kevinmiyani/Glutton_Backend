import api from "./api";

const auth = {
     singup: (data) => api.post("/api/auth/singup", data),
     login: (data) => api.post("/api/auth/login", data),
     getuser: (data) => api.get("/api/auth/getuser", data),
     getuserById: (id, data) => api.get(`/api/auth/getuser?id=${id}`, data),
     resetPassword: (data) => api.post(`/api/auth/resetPassword`, data),
     forgetPassword: (data) => api.post(`/api/auth/requestpasswordreset`, data)
};

const common = {
     getConfirmedKWmanagerid: (data) => api.post(`api/order/KWmanagerid`, data),
     getUserandCustomerCount: (data) => api.get("/api/order/counts", data),
     order: (data) => api.post("/api/order/createorder", data),
     getorders: (page, limit) => api.get(`/api/order?page=${page}&limit=${limit}`),
     getordersbymanager: (body) => api.post(`/api/order/OrdersByManagers`, body),
     getstateManager: (data) => api.get(`/api/stateManager/state-managers?page=${data}`),
     stateManager: (data) => api.post("/api/stateManager/state-managers", data),
     getdealer: (data) => api.get(`/api/dealer/dealers?page=${data}`),
     getsalesmanager: (data) => api.get(`/api/sales/all?page=${data}`),
     getstockmanagerbyid: (id, data) => api.get("/api/store/all/" + id, data),
     getprojectmanager: (data) => api.get(`/api/projecthandler/all?page=${data}`),
     getlicense: (data) => api.get(`/api/license/all?page=${data}`),
     getstockmanager: (data) => api.get("/api/store/all", data),
     getmaintainance: (data) => api.get(`/api/maintenance/all?page=${data}`),
     getdesigner: (data) => api.get(`/api/designer/designers`, data),
     Sales: (data) => api.post("/api/auth/registersalesmanager", data),
     Licensing: (data) => api.post("/api/auth/registerlicensemanager", data),
     project: (data) => api.post("api/auth/registerprojecthandler", data),
     Stock: (data) => api.post("api/auth/registerstoremanager", data),
     Store: (data) => api.post("api/auth/registerstoremanager", data),
     Maintenance: (data) => api.post("api/auth/registermaintainanecemanager", data),
     getnotification: (data) => api.get("/api/notification/", data),
     readnotification: (data) => api.patch("/api/notification/read", data),
     attendance: (data) => api.post(`/api/attendnce/attendance`, data),
     verifyStoke: (data) => api.patch(`/api/order/addReview`, data),
     searchstateManager: (page, queryParams) => api.get(`/api/stateManager/search?page=${page}${queryParams}`),
     searchsalesManager: (queryParams) => api.get(`/api/sales/search${queryParams}`),
     searchlicenseManager: (page, queryParams) => api.get(`/api/license/search?page=${page}${queryParams}`),
     searchProjeectHandlerManager: (page, queryParams) => api.get(`/api/projecthandler/search?page=${page}${queryParams}`),
     searchMaintenanceManager: (page, queryParams) => api.get(`/api/maintenance/search?page=${page}${queryParams}`),
     searchStoreManager: (page, queryParams) => api.get(`/api/store/search?page=${page}${queryParams}`),
     searchOrder: (page, queryParams) => api.get(`/api/order/search?page=${page}${queryParams}`),
     Complain: (queryParams) => api.get(`api/complain${queryParams}`),
     updateitem: (id, data) => api.put(`api/items/${id}`, data),
     topDealers: () => api.get(`api/order/topdealer`),
     topSales: () => api.get(`api/order/topsales`),

}


const order = {
     getAllorder: (data) => api.post("/api/order/All", data),
     createOrder: (data) => api.post("/api/order/createorder", data),
     getMonthandWeekProfit: (data) => api.post("/api/order/getMonthlyRevenue", data),
     salesorderbyid: (id, data) => api.get(`/api/order/salesbyid/${id}`, data),
     getorderbyId: (id, data) => api.get(`/api/order/${id}`, data),
     getsalesofeverymonths: (data) => api.post(`/api/order/getsalesofeverymonths`, data),
     gettop3states: () => api.get(`/api/order/top3salesstate`,),
     getsalesstates: () => api.get(`/api/order/salesstate`,),
     getCompnayKWSales: () => api.get(`/api/order/CompnayKWSales`,),
     getOrderCountByState: (queryParams, manager) => api.get(`/api/order/OrderCountByState?state=${queryParams}&manager=${manager}`,),
     getyearlyKWsbyCompnay: (data) => api.post(`api/order/yearkwCompnay`, data),
     getcountOrderByManagerId: (data) => api.get(`api/order/countOrderByManagerId?managerId=${data}`),
     salesorderbyid: (id, data) => api.get(`/api/order/salesbyid/${id}`, data),
     getorderbyId: (id, data) => api.get(`/api/order/${id}`, data),
}
const ORDER = {
     verifyOrder: (data) => api.patch(`/api/order/addReview`, data),
}

const customer = {
     getAllCustomer: (data) => api.get("/api/customers/all", data),
     createNotes: (data) => api.post(`api/notes/`, data),
     getNotesbyUser: (userid) => api.get(`api/notes/${userid}`),
     updatenote: (id, data) => api.put(`api/notes/${id}`, data),
     delete: (id) => api.delete(`api/notes/${id}`),
}

const Chat = {
     getAllTeamsChat: (data) => api.get("/api/messages/", data),
     getAllCustomerChat: (data) => api.get("/api/messages/sales-customer-rooms", data),
     getMessaged: (roomId, data) => api.get(`/api/messages/${roomId}`, data),
     createChatRoom: (data) => api.post(`api/messages/createroom`, data)
}

const Dealer = {
     verifyDealer: (id, data) => api.patch(`/api/dealer/dealers/${id}/verify`, data),
     createDealer: (data) => api.post("/api/dealer/dealers", data),
     searchDealer: (page, queryParams) => api.get(`/api/dealer/search?page=${page}${queryParams}`),
}

const Stock = {
     getAllItems: (data) => api.get(`/api/items`, data),
     getAllCategory: (data) => api.get(`/api/categories`, data),
     getAllMaterial: (data) => api.get(`/api/materials`, data),
     AddCategory: (data) => api.post(`/api/categories`, data),
     AddMaterial: (data) => api.post(`/api/materials`, data),
     AddItem: (data) => api.post(`/api/items`, data),
     verifyStoke: (data) => api.patch(`/api/order/addReview`, data),
     checkstock: (data) => api.post(`/api/items/compareStock`, data)
}
const StockManager = {
     getAllStockManager: (data) => api.get(`/api/stockmanagers/All`, data),
     allstateManager: (data) => api.get(`/api/stateManager/all`, data),

}

const Project = {
     verifyProject: (data) => api.patch(`/api/order/addReview`, data),
     assignMaintenance: (data) => api.get(`/api/maintenance/allsenior`, data),
     allsenior: (data) => api.get(`/api/projecthandler/allsenior`, data),
     updateManager: (id, data) => api.patch(`/api/projecthandler/${id}`, data),

}
const Maintenance = {
     verifyMaintenance: (data) => api.patch(`/api/order/addReview`, data),
     allsenior: (data) => api.get(`/api/maintenance/allsenior`, data),
     updateManager: (id, data) => api.patch(`/api/maintenance/${id}`, data),

}
const License = {
     verifyLicense: (data) => api.patch(`/api/order/addReview`, data),
     assignProject: (data) => api.get(`/api/projecthandler/allsenior`, data),
     assignstore: (data) => api.get(`/api/store/allsenior`, data),
     allsenior: (data) => api.get(`/api/license/allsenior`, data),
     updateManager: (id, data) => api.patch(`/api/license/${id}`, data),

}

const Sales = {
     verifySales: (data) => api.patch(`/api/order/addReview`, data),
     assignLicesing: (data) => api.get(`/api/license/allsenior`, data),
     allsenior: (data) => api.get(`/api/sales/allsenior`, data),
     allmanager: (data) => api.get(`/api/sales/all`, data),
     updateManager: (id, data) => api.patch(`/api/sales/${id}`, data),
}

const StoreManager = {
     getall: (data) => api.get(`/api/store/all?page=${data}`),
     assignstore: (data) => api.get(`/api/store/all`, data),

}
const Telly = {
     addtelly: (data) => api.post(`/api/telly/`, data),
     getall: (data) => api.get(`/api/telly/`, data),
     deletetelly: (id, data) => api.delete(`/api/telly/${id}`, data),
     downloadexcel: (data) => api.get(`/api/telly/export`, data),

}
const Designer = {
     verifyDesign: (data) => api.patch(`/api/order/addReview`, data),
     getAllDesigner: (page) => api.get(`/api/designer/designers?page=${page}`),
}
const Complain = {
     Complain: (data) => api.post(`/api/complain`, data),
     getallComplain: (id, page) => api.get(`/api/complain/${id}?page=${page}`),
     updateComplain: (id, data) => api.put(`/api/complain/${id}`, data),
     delete: (id) => api.delete(`/api/complain/${id}`),
     searchComplain: (queryParams) => api.get(`api/complain/search${queryParams}`),

}
const announcement = {
     updateannouncement: (id, data) => api.put(`api/announcementRoutes/${id}`, data),
     getannouncement: () => api.get(`api/announcementRoutes/`)
}



// export { Telly, auth, StoreManager, common, Dealer, Stock, Sales, Project, Maintenance, License, StockManager, Chat, customer, order, Designer };
export { Telly, Complain, auth, StoreManager, common, Dealer, Stock, Sales, Project, Maintenance, License, StockManager, Chat, customer, order, Designer, ORDER, announcement };


