import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
       <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}
