import React, { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AthleteDashboardstatistics = () => {
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [registrations, setRegistrations] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [pending, setPending] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [published, setPublished] = useState(0);

  // Fetch Events
  useEffect(() => {
    const loadAllEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('athlete/events', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });
        const data = await response.json();
        setTotalEvents(data.length);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };
    loadAllEvents();
  }, []);

  // Fetch Registrations
  useEffect(() => {
    const loadMyEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('/athlete/events/registered', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });
        const data = await response.json();
        setRegistrations(data.length);
        const approvedRegistrations = data.filter(registration => registration.status === "Approved");
        setAccepted(approvedRegistrations.length);
        const pendingRegistrations = data.filter(registration => registration.status === "Pending");
        setPending(pendingRegistrations.length);
        const rejectedRegistrations = data.filter(registration => registration.status === "Rejected");
        setRejected(rejectedRegistrations.length);
      } catch (error) {
        console.error("Error loading my events:", error);
      }
    };
    loadMyEvents();
  }, []);

  useEffect(() => {
    const fetchEventResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/athlete/all-results", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setPublished(data.length);
      } catch (err) {
        console.error("Error fetching event results:", err);
      }
    };
    fetchEventResults();
  }, []);

  // Chart Data
  const chartData = {
    labels: ["Events yet to Register", "Registered", "Pending", "Accepted", "Rejected", "Published"],
    datasets: [
      {
        label: "Statistics",
        data: [totalEvents, registrations, pending, accepted, rejected, published],
        backgroundColor: ["blue", "lightblue", "#facc15", "green", "red", "indigo"],
      },
    ],
  };

  const options = {
    // maintainAspectRatio: false,
    // responsive: true,
    // plugins: {
    //   legend: { position: "top" },
    //   title: { display: true, text: "Statistics Overview" },
    maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        boxWidth: 0, // Removes the box (and effectively the line) next to the label
        usePointStyle: true, // Optional: Adjusts marker style to a point if needed
        color: "#000", 
    },
},
  },
  };

  return (
    <div className="transition-container">
    <div
      style={{
        backgroundColor: "#f5f5f5", // Light gray background
        padding: "20px",
        borderRadius: "16px",
        border: "2px solid #ccc",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="centered-jump">
        <h2 className="text-3xl font-bold mb-3 text-center text-gray-800"  style={{ color: "#1e3a8a" }}>
          Statistics
        </h2>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "center",
        }}
      >
        {[
          { label: "Events not yet Registered", value: totalEvents, bgColor: "Blue" },
          { label: "Registered for Events", value: registrations, bgColor: "lightblue" },
          { label: "Pending Approvals for Events", value: pending, bgColor: "#facc15" },
          { label: "Approved Registrations for Events", value: accepted, bgColor: "green" },
          { label: "Rejected Registrations for Events", value: rejected, bgColor: "Red" },
          { label: "Result Published Events", value: published, bgColor: "Indigo" },
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              backgroundColor: stat.bgColor,
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              textAlign: "center",
              flex: "1 1 calc(30% - 16px)",
              minWidth: "120px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "1px solid white",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
              {stat.label}
            </h3>
            <p style={{ fontSize: "20px", fontWeight: "bold" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div style={{ marginTop: "24px", height: "300px", width: "100%" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
    </div>
  );
};

export default AthleteDashboardstatistics;
