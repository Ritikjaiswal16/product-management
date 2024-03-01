import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Dashboard from "../Dashboard";
import { useAuth } from "./AuthProvider";
import LoginPage from "../LoginPage";
import Products from "../Product/Products";

const Routes = () => {
  const { token } = useAuth();
  console.log("Token value", token)

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/service",
      element: <div>Service Page</div>,
    },
    {
      path: "/about-us",
      element: <div>About Us</div>,
    },
    {
      path: "/contact-us",
      element: <div>Contact Us</div>,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute/>, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/",
          element: <Dashboard/>,
        },
        {
          path: "/products",
          element: <Products/>,
        },
        {
          path: "/inventory",
          element: <div>Inventory</div>,
        },
        {
          path: "/invoices",
          element: <div>Invoice</div>,
        },
        {
          path: "/books",
          element: <div>Books</div>,
        },
        {
          path: "/customers",
          element: <div>Customer</div>,
        },
        {
          path: "/profile",
          element: <div>User Profile</div>,
        },
        {
          path: "/logout",
          element: <div>Logout</div>,
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <LoginPage/>,
    }
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;