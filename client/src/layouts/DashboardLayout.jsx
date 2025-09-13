import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ Navbar, Sidebar }) => {
  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div>{Sidebar}</div>

      {/* Main Content */}
      <div className="d-flex flex-column flex-grow-1">
        {Navbar}
       <main
          className="flex-grow-1 p-2 bg-light hide-scrollbar"
          style={{
            overflowY: "auto",
            minHeight: 0, // necessary for flex scrolling to work properly
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
