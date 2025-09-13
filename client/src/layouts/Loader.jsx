import useLoader from "@/hooks/useLoader";
import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <ClipLoader color="#fff" size={50} />
    </div>
  );
};

export default Loader;
