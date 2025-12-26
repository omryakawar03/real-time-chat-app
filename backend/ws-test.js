const { io } = require("socket.io-client");

const omToken = "PASTE_OM_ACCESS_TOKEN_HERE";
const rahulToken = "PASTE_RAHUL_ACCESS_TOKEN_HERE";
const rahulId = "PASTE_RAHUL_USERID";

const socketOm = io("ws://localhost:3000", {
  query: { token: omToken }
});

socketOm.on("connect", () => {
  console.log("OM connected");
  socketOm.emit("send_message", {
    receiverId: rahulId,
    text: "Hello from Om"
  });
});
