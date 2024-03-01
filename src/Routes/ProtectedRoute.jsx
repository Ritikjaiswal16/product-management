import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import TopBar from "../TopBar";
import SideBar from "../SideBar";
import { Card } from "react-bootstrap";

export const ProtectedRoute = () => {
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
      <SideBar hovered={hovered} setHovered={setHovered}/>
      {/* <Card className={`body-card ${hovered ? "hovered-width": ""} p-3`}> */}
        <Outlet />
      {/* </Card> */}
      </div>
    </>);
  }