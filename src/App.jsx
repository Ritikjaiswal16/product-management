import React from "react"
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from "./LoginPage.jsx";
import './App.css';
import AuthProvider from "./Routes/AuthProvider.jsx";
import Routes from "./Routes/Routes.jsx";

function App() {
    return (
        <div className="app">
            <AuthProvider>
              <Routes />
            </AuthProvider>
            </div>
          );
}

export default App