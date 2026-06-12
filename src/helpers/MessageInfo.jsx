import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MessageInfo.css";

export function MessageInfo() {
  return (
    <ToastContainer
      toastClassName="message-info__toast"
      bodyClassName="message-info__body"
      progressClassName="message-info__progress"
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      pauseOnHover
      draggable
      theme="dark"
    />
  );
}
