import React from "react";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import FlowChart from "./FlowChart";
import Login from "./components/Login";
import "./App.css";

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="App loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Show flowchart to everyone, but only admins can edit
  return (
    <div className="App">
      {!user && <Login />}
      {user && <FlowChart />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
