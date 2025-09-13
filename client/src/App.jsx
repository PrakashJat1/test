import "@/styles/App.css";
import useLoader from "@/hooks/useLoader";
import { useEffect } from "react";
import { registerGlobalLoader } from "@/utils/axios";
import Loader from "@/layouts/Loader";
import RoleBasedRoutes from "@/routes/RoleBasedRoutes";
import Header from "@/layouts/Header";
import { Home } from "lucide-react";

function App() {
  const { setLoading } = useLoader();

  useEffect(() => {
    registerGlobalLoader(setLoading);
  }, [setLoading]);

  return (
    <>
      <Loader />
      <RoleBasedRoutes />
    </>
  );
}

export default App;
