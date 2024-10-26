const { Server } = require("socket.io");

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join Socket
    socket.on("JoinSocket", (userID) => {
      socket.join(userID);
    });

    // Add booking
    socket.on("AddBooking", (data) => {
      const cust_uid = data.customer.uid;
      const rest_uid = data.restaurant.uid;

      io.emit("BookingTimeSlotChange", data);
      io.to(cust_uid).emit("NewBookingForCutomer", data);
      io.to(rest_uid).emit("NewBookingForRestaurant", data);

      const bookingDate = new Date(data.booking.date);
      const today = new Date();
      bookingDate.toDateString() === today.toDateString() && io.to(rest_uid).emit("NewBookingForToday", data);
    });

    // Update booking
    socket.on("CancelBooking", (data) => {
      const cust_uid = data.customer.uid;
      const rest_uid = data.restaurant.uid;

      io.emit("BookingTimeSlotChange", data);
      io.to(cust_uid).emit("CancelBookingForCutomer", data);
      io.to(rest_uid).emit("CancelBookingForRestaurant", data);

      const bookingDate = new Date(data.booking.date);
      const today = new Date();
      bookingDate.toDateString() === today.toDateString() && io.to(rest_uid).emit("CancelBookingForToday", data);
    });

    socket.on("VerifiyBooking", (data) => {
      const cust_uid = data.customer.uid;
      const rest_uid = data.restaurant.uid;

      io.emit("BookingTimeSlotChange", data);
      io.to(cust_uid).emit("VerifyBookingForCutomer", data);
      io.to(rest_uid).emit("VerifyBookingForRestaurant", data);

      const bookingDate = new Date(data.booking.date);
      const today = new Date();
      bookingDate.toDateString() === today.toDateString() && io.to(rest_uid).emit("VerifyBookingForToday", data);
    });

    // Customer Updates
    socket.on("CustomersUpdates", (data) => {
      io.emit("CustomersUpdates", data);
    });

    // Resto Updates
    socket.on("RestoUpdates", (data) => {
      io.emit("RestoUpdates", data);
    });

    // Add Review
    socket.on("AddReview", (data) => {
      const { restId } = data;
      io.emit("ReviewAdded", data);
      io.to(restId).emit("RestReviewAdded", data);
    });

    // Menu Category
    socket.on("MenuCategoryUpdate", (data) => {
      io.emit("MenuCategoryUpdate", data);
    });

    // Menu Item Update
    socket.on("MenuItemUpdate", (restId) => {
      io.to(restId).emit("MenuItemUpdateOnRestaurant", restId);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
  return io;

}

module.exports = initializeSocket;
