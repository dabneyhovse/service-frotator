import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io();

socket.on("serverNorman", (arg) => {
  toast.success(`${arg.from.username}:\t${arg.text}`);
});

export default socket;
