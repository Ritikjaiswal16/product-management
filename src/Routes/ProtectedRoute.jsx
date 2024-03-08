import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import TopBar from "../TopBar";
import SideBar from "../SideBar";

export const ProtectedRoute = () => {
  const pathname = window.location.pathname;
  const dict={
    "/":0,
    "/invoices":1,
    "/inventory":2,
    "/books":3,
    "/customers":4,
    "/products":5,
  }
  const [hovered, setHovered] = useState(false);
    const { token } = useAuth();
  
    // Check if the user is authenticated
    if (!token) {
      // If not authenticated, redirect to the login page
      return <Navigate to="/login" />;
    }
  
    // If authenticated, render the child routes
    return (
    <>
      <TopBar/>
      <div className="container">
      <SideBar index={dict[pathname]} hovered={hovered} setHovered={setHovered}/>
        <Outlet />
      </div>
    </>);
  }