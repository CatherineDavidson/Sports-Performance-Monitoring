import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CoachStatistics = () => {
  const [totalAthletes, setTotalAthletes] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [pending, setPending] = useState(0);
  const [rejected, setRejected] = useState(0);

  // Fetch Assistance Requests
  useEffect(() => {
    const fetchAssistanceRequests = async () => {
      try {
        const response = await axios.get("/coach/getallassistancereq", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = response.data;

        setTotalAthletes(data.length);
        setAccepted(data.filter(athletes => athletes.status === "Accepted").length);
        setPending(data.filter(athletes => athletes.status === "Pending").length);
        setRejected(data.filter(athletes => athletes.status === "Rejected").length);
      } catch (error) {
        console.error("Error fetching assistance requests:", error);
      }
    };
    fetchAssistanceRequests();
  }, []);

  // Chart Data
  const chartData = {
    labels: ["Total Requests", "Accepted", "Pending", "Rejected"],
    datasets: [
      {
        label: "Statistics",
        data: [totalAthletes, accepted, pending, rejected],
        backgroundColor: ["blue", "green", "#facc15", "red"],
      },
    ],
  };

  const options = {
    // maintainAspectRatio: false,
    // responsive: true,
    // plugins: {
    //   legend: { position: "top" },
    //  // title: { display: true, text: "Statistics Overview" },
    // },
    maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        boxWidth: 0, // Removes the box (and effectively the line) next to the label
        usePointStyle: true, // Optional: Adjusts marker style to a point if needed
        color: "#000", // Ensures label text color is set
      },
    },
    // title: { display: true, text: "Statistics Overview" }, // Uncomment if a title is required
  },
  };

  return (
    <div
      style={{
        backgroundColor: "white", // Pure white background
        padding: "24px", // Padding around the content
        borderRadius: "12px", // Rounded corners for aesthetics
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        margin: "16px auto", // Centering with auto margins
        maxWidth: "1200px", // Maximum width for better layout
      }}
    >
      <div className="transition-container">
        <br />
      </div>
      <div className="centered-jump">
        <h2 className="text-3xl font-bold mb-3 text-center" style={{ color: "#1e3a8a" }}>
          Statistics
        </h2>
      </div>

      {/* Summary Cards */}
      <div
        style={{
                         display: "flex",
                        justifyContent: "space-between",
                        gap: "16px",
                        margin: "auto",
                         overflowX: "auto", /* Optional: Adds scrolling if the screen is small */
                      }}
      >
        {[
          { label: "Total no of Athletes Requested", value: totalAthletes, bgColor: "blue" },
          { label: "No of Athletes Accepted", value: accepted, bgColor: "green" },
          { label: "No of Athletes Pending", value: pending, bgColor: "#facc15" },
          { label: "No of Athletes Rejected", value: rejected, bgColor: "red" },
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
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              {stat.label}
            </h3>
            <p style={{ fontSize: "20px", fontWeight: "bold" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div
        style={{
          marginTop: "24px",
          height: "300px",
          width: "100%",
        }}
      >
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CoachStatistics;
