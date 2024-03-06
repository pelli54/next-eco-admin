import Aside from "@/components/Aside";
import Navbar from "@/components/Navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Aside />
      <Navbar />
      <div className="p-3 flex bg-secondary h-[calc(100vh-4rem)]">
        <div className="p-3 rounded-lg bg-card w-full border border-slate-600 shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
