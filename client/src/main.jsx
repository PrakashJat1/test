import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/index.css";
import App from "./App.jsx";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoaderProvider } from "@/contexts/LoaderContext";
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LoaderProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LoaderProvider>
    </BrowserRouter>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
  </StrictMode>
);
