import React from "react";

const NotAuthorized = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      color: "#ff6b6b",
      background: "#232323",
      borderRadius: "8px",
      margin: "40px auto",
      maxWidth: "400px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      padding: "40px 20px",
    }}
  >
    <h2 style={{ fontSize: "2rem", marginBottom: "16px" }}>Not Authorized</h2>
    <p style={{ color: "#eee", fontSize: "1.1rem", textAlign: "center" }}>
      You do not have permission to access this page.<br />
      Please contact your administrator if you believe this is a mistake.
    </p>
  </div>
);

export default NotAuthorized;