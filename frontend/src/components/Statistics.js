import React, { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = ({ onClose }) => {
  // Example data
  const data = {
   // totalEvents: 50,
  //  registeredEvents: 40,
   // pendingEvents: 10,
    //acceptedEvents: 30,
   // topPerformers: 5,
   // averageResult: 80,
  };

  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [registrations,setRegistrations]=useState(0);
  const[accepted,setAccepted]=useState(0);
  const[pending,setPending]=useState(0);
  const[rejected,setRejected]=useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("Loading events...");
        setLoading(true); // Show spinner
        const token = localStorage.getItem("token");
        const response = await fetch("/admin/events", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events.");
        }

        const data = await response.json();
        setEvents(data); // Store events in state
        setTotalEvents(data.length); // Calculate total events
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        console.log("Finished loading events.");
        setLoading(false); // Hide spinner
      }
    };

    fetchEvents();
  }, []);
 
  useEffect(() => {
  const fetchRegistrations = async () => {
   // setLoading(true);
    try {
        console.log("Loading Registrtions...");
        setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("/admin/registrations", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch registrations.");
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
     // showPopup("Failed to fetch registrations", 'error');
    }finally {
        console.log("Finished loading Registrations.");
        setLoading(false); // Hide spinner
      }
  };

  fetchRegistrations();
  }, []);


  useEffect(() => {
    const fetchRegistrationsacceptedpending = async () => {
     // setLoading(true);
      try {
          console.log("Loading Registrtions...");
          setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("/admin/registrations", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch registrations.");
        const data = await response.json();
        const approvedRegistrations = data.filter(registration => registration.status === "Approved");
        setAccepted(approvedRegistrations);
        const pendingRegistrations = data.filter(registration => registration.status === "Pending");
        setPending(pendingRegistrations);
        const rejectedRegistrations = data.filter(registration => registration.status === "Rejected");
        setRejected(rejectedRegistrations);
      } catch (error) {
        console.error("Error fetching registrations:", error);
       // showPopup("Failed to fetch registrations", 'error');
      }finally {
          console.log("Finished loading Registrations.");
          setLoading(false); // Hide spinner
        }
    };
  
    fetchRegistrationsacceptedpending();
    }, []);

  // Data for the bar chart
  const chartData = {
    labels: ["Total Events", "Registered", "Pending", "Accepted","Rejected"],
    datasets: [
      {
        label: "Statistics",
        data: [
          totalEvents,
          registrations.length,
          pending.length,
          accepted.length,
          rejected.length,
         
        ],
        backgroundColor: ["#1e40af", "#3b82f6", "#facc15", "#22c55e", "red"],
      },
    ],
  };

  const options = {
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
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          padding: "20px",
          width: "75%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h1 className="text-3xl font-bold text-center text-[#1e40af]" style={{ fontWeight: "bold", marginBottom: "16px", textAlign: "center" }}>
             Statistics
            </h1>
        <h2 >
        </h2>

        {/* Summary Cards */}
        <div
          style={{
            // display: "flex",
            // flexWrap: "wrap",
            // gap: "16px",
            // justifyContent: "center",
            display: "flex",
            flexWrap: "nowrap", // Prevent wrapping
            gap: "16px",
            justifyContent: "space-between", 
            overflowX: "auto", 
          }}
        >
          {[
            { label: "Total Number of Events", value: totalEvents, bgColor: "#1e40af" },
            { label: "Total Registered for Events",value: registrations.length , bgColor: "#3b82f6" },
            { label: "Pending Approvals for Events", value: pending.length, bgColor: "#facc15" },
            { label: "Approved Registrations for Events", value: accepted.length, bgColor: "#22c55e" },
            { label: "Rejected Registrations for Events",value: rejected.length, bgColor: "Red" },
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
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>{stat.label}</h3>
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div
          style={{
            marginTop: "24px",
            height: "300px", // Set a fixed height
            width: "100%", // Full width
          }}
        >
          <Bar data={chartData} options={options} />
        </div>

       
        <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "skyblue",
              color: "white",
              padding: "10px 20px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#dc2626")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
