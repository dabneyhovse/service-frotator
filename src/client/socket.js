import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io();

socket.on("serverNorman", (arg) => {
  if (window.location.pathname.indexOf("/frotator") == 0) {
    toast.info(`${arg.from.username}:\t${arg.text}`);
  }
});

export default socket;
