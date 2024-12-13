import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import {  Spinner } from "react-bootstrap";
import "../styles/coach.css";
import axios from "axios";
import { Typography, AppBar, Table, Toolbar, DialogTitle, DialogContent, Dialog, IconButton, Card, CardContent } from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import CloseIcon from '@mui/icons-material/Close';
import { IoIosArrowBack } from "react-icons/io";
import CoachStatistics from "./CoachStatistics";

const Popup = ({ message, type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{zIndex: '9999'}}>
      <div className={`
        relative 
        bg-white 
        rounded-lg 
        shadow-xl 
        p-6 
        max-w-sm 
        w-full 
        mx-4
        flex 
        flex-col 
        items-center
        ${type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}
      `}>
        <button
          onClick={onClose}
          style={{ backgroundColor: 'white' }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>
        {/* Icon */}
        <div className="mb-4">
          {type === 'success' ? (
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-16 h-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
        {/* Message */}
        <h3 className="text-center text-gray-700">{message}</h3>
      </div>
    </div>
  );
};

const spinnerContainerStyle = {
  display: 'flex',
  justifyContent: 'center', // Center horizontally
  alignItems: 'center',     // Center vertically
  height: '100vh',          // Full viewport height
  backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
  zIndex: 1000,             // Ensure it's on top
};

const spinnerWrapperStyle = {
  textAlign: 'center',       // Align spinner text in the center
  padding: '20px',           // Add padding around the spinner
  backgroundColor: '#fff',   // White background for the spinner container
  borderRadius: '12px',      // Rounded corners for the background
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
};

const spinnerStyle = {
  width: '80px',             // Increase spinner size
  height: '80px',            // Increase spinner size
  borderWidth: '5px',        // Make the spinner border thicker
  borderColor: 'transparent', // Hide the default border
  borderTopColor: '#3498db', // Blue color for the top border (spinner effect)
  animationDuration: '1.2s', // Smooth spinning animation
};

const loadingTextStyle = {
  marginTop: '15px',         // Space between spinner and text
  fontSize: '18px',          // Set a readable font size
  color: '#3498db',          // Blue color for the text
  fontWeight: '600',         // Bold text
  textTransform: 'uppercase', // Uppercase text for emphasis
  letterSpacing: '2px',      // Slight letter spacing for better readability
  fontFamily: '"Roboto", sans-serif', // Smooth and modern font
};


const CoachDashboard = ({
}) => {
  const [currentSection, setCurrentSection] = useState("profile");


  // States for managing data
  const [coachProfile, setCoachProfile] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [assistanceRequests, setAssistanceRequests] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [weightPlan, setWeightPlan] = useState(null);
  const [selectedAthlete, setSelectedAthlete] = useState(null); // Stores the selected athlete details
  const [profileModalOpen, setProfileModalOpen] = useState(false); // Tracks modal visibility
  const [coachDietPlan, setCoachDietPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Modal visibility states
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showAthleteProfileModal, setShowAthleteProfileModal] = useState(false);
  const [showWeightPlanModal, setShowWeightPlanModal] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
 // const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  // State for storing form data
  const [topPerformances, setTopPerformances] = useState([]); 

  const [updatedProfile, setUpdatedProfile] = useState({});
  const [newAchievement, setNewAchievement] = useState({});
  const [currentAthleteProfile, setCurrentAthleteProfile] = useState(null);
  const navigate = useNavigate();


  // Fetch data from API on component mount
  useEffect(() => {
    fetchCoachData();
    fetchAchievements();
    fetchAssistanceRequests();
    fetchAthletes();

    const intervalId = setInterval(fetchAssistanceRequests, 500);
    const intervalIds = setInterval(fetchAthletes, 500);
    return () =>
    { 
      clearInterval(intervalId);
      clearInterval(intervalIds);
    }
  }, []);

  const fetchCoachData = async () => {
    try {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false); // Stop the loader after 1 second
      }, 1000);
      const response = await axios.get("/coach/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCoachProfile(response.data);
    } catch (error) {
      console.error("Error fetching coach profile:", error);
    }
  };

 
  const handleLogout = () => {
    localStorage.clear();
    navigate('\*');
  }

  // Fetch achievements
  const fetchAchievements = async () => {
    try {
      const response = await axios.get("/coach/achievements", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAchievements(response.data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  // Fetch assistance requests
  const fetchAssistanceRequests = async () => {
    try {
      const response = await axios.get("/coach/getallassistancereq", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAssistanceRequests(response.data);
    } catch (error) {
      console.error("Error fetching assistance requests:", error);
    }
  };

  // Fetch accepted athletes
  const fetchAthletes = async () => {
    try {
      const response = await axios.get("/coach/athletes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAthletes(response.data);
      //console.log(athletes);
    } catch (error) {
      console.error("Error fetching athletes:", error);
    }
  };


  // Fetch athlete profile
  const fetchAthleteProfile = async (athleteId) => {
    console.log(athleteId, typeof (athleteId));
    try {
      const response = await axios.get(`/coach/athlete/${athleteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setCurrentAthleteProfile(response.data);
      console.log(currentAthleteProfile);
      // setShowAthleteProfileModal(true);

      fetchWeightPlan(athleteId)

      document.getElementById("athletePage").style.visibility = 'none';

      document.getElementById("athleteProfile").style.visibility = 'block';








    } catch (error) {
      console.error("Error fetching athlete profile:", error);
    }
  };
  const token = localStorage.getItem("token");
  // Fetch weight plan
  const fetchWeightPlan = async (athleteId) => {
    try {
      const response = await axios.get(`/coach/weightplan/athlete/${athleteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWeightPlan(response.data);

      axios.get(`/coach/diet/athlete/${athleteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(dietPlanResponse => {
          setCoachDietPlan(dietPlanResponse.data);
        })
        .catch(error => {
          console.error('Error fetching coach diet plans:', error);
        });


      // setShowWeightPlanModal(true);
    } catch (error) {
      console.error("Error fetching weight plan:", error);
    }
  };

  // Update coach profile
  const handleProfileUpdate = async () => {
    try {
      await axios.put("/coach/profile", updatedProfile, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowEditProfileModal(false);
      fetchCoachData(); // Refresh profile data
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Add a new achievement
  const handleAddAchievement = async () => {
    try {
      await axios.post("/coach/addAchievement", newAchievement, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowAchievementModal(false);
      fetchAchievements(); // Refresh achievements data
    } catch (error) {
      console.error("Error adding achievement:", error);
    }
  };

  // Accept assistance request
  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.put(`/coach/assistance/${requestId}/accept`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAssistanceRequests(); // Refresh requests data
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Reject assistance request
  const handleRejectRequest = async (requestId) => {
    try {
      await axios.put(`/coach/assistance/${requestId}/reject`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAssistanceRequests(); // Refresh requests data
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  // Handle input changes for forms
  const handleInputChange = (e, stateUpdater) => {
    const { name, value } = e.target;
    stateUpdater((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    setIsSaving(true);
    formData.append("firstName", updatedProfile.firstName);
    formData.append("lastName", updatedProfile.lastName);
    formData.append("email", updatedProfile.email);
    formData.append("expertise", updatedProfile.expertise);
    if (newImage) formData.append("imageFile", newImage);


    try {
      const response = await fetch("/coach/profile", {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setIsSaving(false);
        setShowEditProfileModal(false);
        //alert("Profile updated successfully!");
        fetchCoachData();
        setPopup({
          show: true,
          message: "Profile updated successfully!",
          type: 'success'
        });

      } else {
        setShowEditProfileModal(false);
        setIsSaving(false);
        setPopup({
          show: true,
          message: "Failed to update the profile. Please try again.",
          type: 'error'
        });
        console.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setShowEditProfileModal(false);
      setIsSaving(false);
      setPopup({
        show: true,
        message: "An unexpected error occurred. Please try again.",
        type: 'error'
      });
    }
  };

  const closePopup = () => {
    setPopup({ show: false, message: '', type: '' });
  };

  const [error, setError] = useState("");
  const [eventResults, setEventResults] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const resultsPerPage = 15;


  const handleViewDetails = (athleteId) => {
    console.log("viewdetial", athleteId, typeof (athleteId))
    // setSelectedAthlete(athlete);
    const athlete = athletes.find(a => a.athleteId === athleteId);
    fetchAthleteProfile(athleteId)
    // setProfileModalOpen(true);
    setSelectedAthlete(athlete);
    setProfileModalOpen(true);

    const fetchTopPerformances = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/coach/top-performance/by-athlete/${athleteId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTopPerformances(response.data); // Expecting an array
      } catch (err) {
        setError(err.response?.data?.error || "NO DATA YET");
      }
    }

    const fetchEventResults = async () => {
      // setEventResults(null);
      try {
        // prevResults(null);
        const token = localStorage.getItem("token");
        const response = await axios.get(`coach/result/by-athlete/${athleteId}`, {
          params: { page, size: resultsPerPage },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.length < resultsPerPage) {
          setHasMore(false);
        }
        setEventResults(response.data);

        // setEventResults((prevResults) => [...prevResults, ...response.data]);
      } catch (err) {
        setError(err.response?.data?.error || "NO DATA YET");
      }
    };

    fetchEventResults();
    fetchTopPerformances();



  };
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };


  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
    setSelectedAthlete(null);
  };


  const handleOpenProfileModal = (athlete) => {
    setSelectedAthlete(athlete);
    setProfileModalOpen(true);
  };


  const [showModal2, setShowModal2] = useState(false);

  const [formData2, setFormData2] = useState({
    startWeight: "",
    targetWeight: "",
    preference: "",
    dailyCalorieGoal: "",
  });

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({ ...formData2, [name]: value });
  };
  const [isEdit, setIsEdit] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    message: '',
    type: 'success'
  });

 
  const handleSubmit = async (e, athleteId) => {
    e.preventDefault(); // Prevent the default form submission behavior
    
    const token = localStorage.getItem("token");
    if (!isEdit) {
      try {
        await axios.post(
          `/coach/createplan`,
          {
            athleteId: parseFloat(athleteId),
            startWeight: parseFloat(formData2.startWeight),
            targetWeight: parseFloat(formData2.targetWeight),
            preference: formData2.preference,
            dailyCalorieGoal: parseInt(formData2.dailyCalorieGoal, 10),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        // Success actions
        setShowModal2(false);
        setPopup({
          show: true,
          message: "Weight plan created successfully!",
          type: "success",
        });
        setFormData2({
          startWeight: "",
          targetWeight: "",
          preference: "",
          dailyCalorieGoal: "",
        });
      } catch (error) {
        console.error("Error creating weight plan:", error);
        setPopup({
          show: true,
          message: "Failed to create weight plan.",
          type: "error",
        });
      }
    } else {
      try {
        await axios.put(
          `/coach/updateplan/${athleteId}`,
          {
            startWeight: parseFloat(formData2.startWeight),
            targetWeight: parseFloat(formData2.targetWeight),
            preference: formData2.preference,
            dailyCalorieGoal: parseInt(formData2.dailyCalorieGoal, 10),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        // Success actions
        setShowModal2(false);
        setPopup({
          show: true,
          message: "Weight plan updated successfully!",
          type: "success",
        });
        setFormData2({
          startWeight: "",
          targetWeight: "",
          preference: "",
          dailyCalorieGoal: "",
        });
      } catch (error) {
        console.error("Error updating weight plan:", error);
        setPopup({
          show: true,
          message: "Failed to update weight plan.",
          type: "error",
        });
      }
    }
    window.location.reload();
    fetchWeightPlan();
  };
  
  const setView2 = () => {
    setShowModal2(true);
    setIsEdit(true);
  }
  const setView3 = () => {
    setShowModal2(true);
    setIsEdit(false);
  }

  const [isVisible, setIsVisible] = useState(false);
  const [formData3, setFormData3] = useState({
    // athleteId: "",
    calories: "",
    // currentWeight: "",
    // weightPlanId: "",
    proteinIntake: "",
    carbohydrateIntake: "",
    fatIntake: "",
    fibreIntake: "",
    waterIntake: ""
  });

  const [fileName, setFileName] = useState("No file selected");
  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
    const file = e.target.files[0];
    setFileName(file ? file.name : "No file selected");
    if (file) {
      setIsLoading(true); // Start the loading
      // Simulate an image upload process with a timeout (you would replace this with actual upload logic)
      setTimeout(() => {
        setIsLoading(false); // Stop the loading after 2 seconds (replace with real upload logic)
        console.log("Image uploaded:", file);
      }, 1000); // Simulated delay (2 seconds)
    }
  };
  // Automatically set today's date
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  const handleChange3 = (e) => {
    setFormData3({
      ...formData3,
      [e.target.name]: e.target.value,
    });
  };

  const formatDateForDisplayAndForm = (dateString) => {
    if (!dateString) return '';
    const utcDate = new Date(dateString); 
    const localDate = new Date(utcDate.getTime() + new Date().getTimezoneOffset() * -60000);
    return localDate.toISOString().split('T')[0];
  };

  const handleSubmit3 = async (athleteId) => {
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      if (token) {
        // Assuming the token is a JSON Web Token (JWT)
        try {
          const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
          if (payload.role !== 'COACH') {
            window.location.href = '/login'; // Redirect to login page
          }
        } catch (error) {
          console.error('Invalid token:', error);
          window.location.href = '/login'; // Redirect if token is invalid
        }
      } else {
        window.location.href = '/login'; // Redirect if no token exists
      }
      const response = await axios.post(
        "/coach/creatediet",
        {
          athleteId: athleteId,
          // currentWeight: formData3.currentWeight,
          calories: formData3.calories,
          date: today,
          protein: formData3.proteinIntake,
          carbohydrate: formData3.carbohydrateIntake,
          fat: formData3.fatIntake,
          fibre: formData3.fibreIntake,
          water: formData3.waterIntake
        },
        // { ...formData3, athleteId: {athleteId} , date: today }, // Include today's date
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //alert("Diet plan created successfully!");
      setIsVisible(false); // Close the modal on success
      setPopup({
        show: true,
        message: "Diet plan created successfully!",
        type: 'success'
      });
    } catch (error) {
      console.error("Error creating diet plan:", error);
      //alert("Failed to create diet plan.");
      setIsVisible(false);
      setPopup({
        show: true,
        message: "Diet plan created successfully!",
        type: 'error'
      });
    }
  };



  return (
    <div className="coachDashboard">
      <AppBar position="static" className="navbar">
        <Toolbar className="navbar-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left Section: Coach */}
          <Typography variant="h5" className="navbar-title">
            <h1 className="text-3xl font-bold text-[#1e40af]">Coach</h1>
          </Typography>

          {/* Right Section: Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="" className="logout-link">
              <Button
                variant={currentSection === "profile" ? "primary" : "light"}
                onClick={() => setCurrentSection("profile")}
                className="px-2"
              >
                Profile
              </Button>
            </Link>
            <Link to="" className="logout-link">
              <Button
                variant={currentSection === "achievements" ? "primary" : "light"}
                onClick={() => setCurrentSection("achievements")}
                className="px-2"
              >
                Achievements
              </Button>
            </Link>
            <Link to="" className="logout-link">
              <Button
                variant={currentSection === "requests" ? "primary" : "light"}
                onClick={() => setCurrentSection("requests")}
                className="px-2"
              >
                Requests
              </Button>
            </Link>
            <Link to="" className="logout-link">
              <Button
                variant={currentSection === "athletes" ? "primary" : "light"}
                onClick={() => setCurrentSection("athletes")}
                className="px-2"
              >
                Athletes
              </Button>
            </Link>
            <Link to="" className="logout-link">
              <Button
                variant={currentSection === "athletes" ? "primary" : "light"}
                onClick={() => setCurrentSection("CoachStatistics")}
                className="px-2"
              >
                Statistics
              </Button>
            </Link>
            <Link to="/*" className="logout-link">
              <Button
                onClick={handleLogout}
                startIcon={<LoginIcon />}
                style={{ color: 'white' }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full text-white font-medium hover:shadow-lg transition transform hover:scale-105"
              >
                <LoginIcon /> Logout
              </Button>
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      <div>

      {currentSection === 'CoachStatistics' && <CoachStatistics />}



        {/* Profile Section */}
        {currentSection === "profile" && (
        isLoading ? (
          <div className="spinner-container" style={spinnerContainerStyle}>
          <div className="spinner-wrapper" style={spinnerWrapperStyle}>
            <Spinner animation="border" role="status" style={spinnerStyle}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p style={loadingTextStyle}>Loading, please wait...</p>
          </div>
        </div>
        
        ) : (
          <div>
            <br />
            <b>
              <h1 style={{ fontSize: '36px', color: 'white', textAlign: 'center' }}>
                Welcome, {coachProfile.firstName || "Coach"} {coachProfile.lastName || "Coach"}!
              </h1>
            </b>
            <br />
            <div className="profile-section">
              <div
                style={{
                  padding: "20px",
                  width: "900px",
                  height: "330px",
                  margin: "20px",
                  marginLeft: "30%",
                  backgroundColor: "#E5E3D4",
                  borderRadius: "12px",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Profile Image */}
                <div
                  style={{
                    flex: "0 0 150px",
                    marginRight: "20px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={coachProfile.imageBase64 ? `data:image/jpeg;base64,${coachProfile.imageBase64}` : '/default-profile.jpg'}
                    alt="Coach"
                    style={{
                      maxWidth: "200px",
                      borderRadius: "15px",
                      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>

                {/* Profile Details and Edit Button */}
                <div
                  style={{
                    flex: "1",
                    textAlign: "left",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "24px",
                      color: "#2c3e50",
                      fontWeight: "600",
                      marginBottom: "10px",
                    }}
                  >
                    {coachProfile.firstName} {coachProfile.lastName}
                  </h3>

                  {/* Display Email and Specialization */}
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#34495e",
                      marginBottom: "8px",
                    }}
                  >
                    <strong>Email: </strong>{coachProfile.email}
                  </p>

                  <p
                    style={{
                      fontSize: "16px",
                      color: "#34495e",
                      marginBottom: "20px",
                    }}
                  >
                    <strong>Expertise: </strong>{coachProfile.expertise}
                  </p>

                  {/* Edit Profile Button */}
                  <Button
                    variant="primary"
                    onClick={() => {
                      setUpdatedProfile(coachProfile);
                      setShowEditProfileModal(true);
                    }}
                    style={{
                      backgroundColor: "#3498db",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#2980b9";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#3498db";
                    }}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {popup.show && (
          <Popup
            message={popup.message}
            type={popup.type}
            onClose={closePopup}
          />
        )}

        {showEditProfileModal && (
          <div className="edit-profile-modal" style={modalStyles}>
            <div className="edit-modal-content" style={modalContentStyles}>
              <h1 style={modalTitleStyles}>Edit Profile</h1>
              <form
                className="edit-modal-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveProfile();
                }}
              >
                <label style={labelStyles}>
                  First Name <span className="required" style={requiredStyles}>*</span>:
                  <input
                    type="text"
                    name="firstName"
                    value={updatedProfile.firstName || ""}
                    onChange={(e) =>
                      setUpdatedProfile({
                        ...updatedProfile,
                        firstName: e.target.value,
                      })
                    }
                    placeholder="First Name"
                    required
                    style={inputStyles}
                  />
                </label>
                <label style={labelStyles}>
                  Last Name <span className="required" style={requiredStyles}>*</span>:
                  <input
                    type="text"
                    name="lastName"
                    value={updatedProfile.lastName || ""}
                    onChange={(e) =>
                      setUpdatedProfile({
                        ...updatedProfile,
                        lastName: e.target.value,
                      })
                    }
                    placeholder="Last Name"
                    required
                    style={inputStyles}
                  />
                </label>
                <label style={labelStyles}>
                  Expertise <span className="required" style={requiredStyles}>*</span>:
                  <input
                    type="text"
                    name="expertise"
                    value={updatedProfile.expertise || ""}
                    onChange={(e) =>
                      setUpdatedProfile({
                        ...updatedProfile,
                        expertise: e.target.value,
                      })
                    }
                    placeholder="Expertise"
                    required
                    style={inputStyles}
                  />
                </label>
                <label style={labelStyles}>
                  Profile Picture:
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: '3px',
                      border: "2px solid gray", // Dashed border
                      borderRadius: "23px", // Rounded corners
                      transition: "border-color 0.3s ease",
                      cursor: "pointer",
                    }}
                  >
                    <label
                      htmlFor="fileInput"
                      style={{
                        backgroundColor: "#8e44ad", // Purple color
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontSize: "1rem",
                        textAlign: "center",
                        margin: '0px',
                      }}
                    >
                      Browse
                    </label>
                    {/* Hidden File Input */}
                    <input
                      id="fileInput"
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                    {/* File Name Display */}
                    <span
                      style={{
                        fontSize: "1rem",
                        color: "#555", // Subtle gray for text
                      }}
                    >
                      {fileName}
                    </span>
                  </div>

                </label>
                {isSaving && (
                  <div className="loader-overlay">
                    <div className="loader"></div>
                    <p>Uploading...</p>
                  </div>
                )}
                <div className="form-buttons" style={buttonContainerStyles}>
                  <Button
                    type="submit"
                    variant="success"
                    onClick={handleSaveProfile}
                    style={buttonStyles}
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowEditProfileModal(false)}
                    style={buttonStyles}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>

        )}

       
        {/* Achievements Section */}
        {currentSection === "achievements" && (
          <>
            <br></br>
            <b><h1 style={{ fontSize: '36px', color: 'white', textAlign: 'center' }}>Your Achievements</h1></b>
            <br></br>
            <div className="achievements-section my-4">

              <Button variant="success" onClick={() => setShowAchievementModal(true)}>
                Add Achievement
              </Button>
              <ul
                style={{
                  listStyleType: "none",   // Remove default list styling
                  padding: 0,              // Remove padding for the list
                }}
              >
                {achievements.map((achievement, index) => (
                  <li
                    key={index}
                    style={{
                      border: "1px solid #e0e0e0",  // Subtle border for each item
                      padding: "20px",               // Ample padding inside the box
                      margin: "15px 0",              // Margin between each item
                      borderRadius: "12px",          // Rounded corners
                      background: "linear-gradient(135deg, #f7f7f7, #ffffff)", // Soft gradient background
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                      transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth hover transition
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)"; // Slightly enlarge on hover
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)"; // Bigger shadow
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "scale(1)"; // Reset size when hover ends
                      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)"; // Reset shadow
                    }}

                  >
                    <h3
                      style={{
                        marginBottom: "10px",  // More space below the title
                        fontSize: "20px",      // Slightly larger font for the title
                        fontWeight: "600",     // Bold title for emphasis
                        color: "#2c3e50",      // Dark text color for better readability
                        textTransform: "uppercase", // Uppercase for a formal look
                      }}
                    >
                      {achievement.title}
                    </h3>
                    <p
                      style={{
                        marginBottom: "10px",  // More space below the description
                        fontSize: "16px",      // Standard readable font size for description
                        lineHeight: "1.6",      // Better line spacing for readability
                        color: "#34495e",      // Slightly muted text color
                      }}
                    >
                      {achievement.description}
                    </p>
                    <span
                      style={{
                        display: "block",      // Make the date a block element for alignment
                        fontSize: "14px",      // Smaller font size for the date
                        color: "#95a5a6",      // Light gray for the date text
                        fontStyle: "italic",   // Italicize for a subtle distinction
                        textAlign: "right",    // Align the date to the right
                        marginTop: "10px",     // Space between description and date
                      }}
                    >
                      {achievement.achievedDate ? achievement.achievedDate.split("T")[0] : "Date not available"}
                    </span>
                  </li>

                ))}
              </ul>





              {/* Modal for Adding Achievement */}
              {showAchievementModal && (
                <div className="achievement-modal">
                  <div className="modal-content">
                    <h1 style={{ fontSize: "26px" }}>Add Achievement</h1>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddAchievement();
                      }}
                    >
                      <label>
                        Title<span className="required">*</span>:
                        <input
                          type="text"
                          value={newAchievement.title}
                          onChange={(e) =>
                            setNewAchievement({ ...newAchievement, title: e.target.value })

                          }
                          placeholder=" &nbsp; &nbsp; Achievement Title"
                          required
                        />
                      </label>
                      <label>
                        Description<span className="required">*</span>:
                        <textarea
                          value={newAchievement.description}
                          onChange={(e) =>
                            setNewAchievement({ ...newAchievement, description: e.target.value })
                          }
                          placeholder="Description"
                          required
                        />
                      </label>
                      <label>
                        Achieved Date<span className="required">*</span>:
                        <input
                          type="date"
                          value={newAchievement.achievedDate}
                          onChange={(e) =>
                            setNewAchievement({ ...newAchievement, achievedDate: e.target.value })
                          }
                          required
                        />
                      </label>
                      <div className="modal-buttons">
                        <button type="submit">Save</button>
                        <button
                          type="button"
                          onClick={() => setShowAchievementModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

         {currentSection === "requests" && (
          <>
            <br></br>
            <b><h1 style={{ fontSize: '36px', color: 'white', textAlign: 'center' }}>Assistance Requests</h1></b>
            <br></br>
            <div className="assistance-requests-section my-4">

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Request By</th>
                    <th>Athlete Details</th>
                    <th>Message</th>
                    <th>Request Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {assistanceRequests
                  .filter((request) => request.status === "Pending") // Filter for Pending requests
                  .map((request, index) => (
                <tr key={request.id}>
                  <td>{index + 1}</td>
                  <td>{request.athlete.firstName} {request.athlete.lastName}</td>
                  <td><Button
          variant="primary"
          size="sm"
          onClick={() => handleViewDetails(request.athlete.athleteId)}
          className="ms-2"
        >
          View Athlete
        </Button></td>
                  <td>{request.remarks || "No remarks provided."}</td>
                  <td>{formatDateForDisplayAndForm(request.requestDate)}</td>
                   
                        <td> 
                          <Button
                            variant="success"
                            onClick={() => handleAcceptRequest(request.assistanceRequestId)}
                            className="me-2"
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleRejectRequest(request.assistanceRequestId)}
                          >
                            Reject
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              {assistanceRequests.filter((request) => request.status === "Pending").length === 0 && (
                <p>No pending requests available.</p>
              )}
            </div>

        {currentAthleteProfile && (
<Dialog
  open={profileModalOpen}
  onClose={handleCloseProfileModal}
  maxWidth="md"
  fullWidth
  classes={{
    paper: 'athlete-profile-modal',
    root: 'dialog-root',
  }}
  sx={{
    '& .MuiDialog-paper': {
      margin: '20px',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      overflowY: 'auto',
    },
  }}
>
  <DialogTitle
    style={{
      textAlign: "center",
      fontSize: '24px',
      position: 'relative',
      color: 'white',
      backgroundColor: '#f08080', // Peach or light orange
      padding: '16px',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
    }}
  >
    Athlete Profile
    <IconButton
      onClick={handleCloseProfileModal}
      style={{
        position: 'absolute',
        left: 8,
        top: 8,
        color: 'white',
      }}
    >
      <IoIosArrowBack />
    </IconButton>
  </DialogTitle>
  <DialogContent
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#333',
      padding: '20px',
      maxHeight: '80vh',
      overflowY: 'auto',
    }}
  >
    <div className="flex items-center space-x-6 w-full">
      <div className="flex-shrink-0 w-1/3">
        <img
          src={currentAthleteProfile.photoBase64
            ? `data:image/jpeg;base64,${currentAthleteProfile.photoBase64}`
            : "/default-profile.jpg"
          }
          alt="Athlete"
          className="w-full h-[220px] object-cover rounded-lg"
        />
      </div>
      <div className="flex-grow">
        <h1 style={{ color: '#f08080', fontSize: '26px', marginBottom: '20px' }}>
          {currentAthleteProfile.firstName}
        </h1>
        <Typography variant="body1" gutterBottom>
          <strong>Name:</strong> {currentAthleteProfile.firstName} {currentAthleteProfile.lastName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Gender:</strong> {currentAthleteProfile.gender}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Height:</strong> {currentAthleteProfile.height} cm
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Weight:</strong> {currentAthleteProfile.weight} kg
        </Typography>
        <Typography variant="body1">
          <strong>Category:</strong> {currentAthleteProfile.category}
        </Typography>
      </div>
    </div>

    <div
      className="top-performance-card mt-6"
      style={{
        color: "#333",
        width: '100%',
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "white",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        maxHeight: '300px',
        overflowY: 'auto',
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#f08080", fontSize: "20px" }}>
        Top 5 Performances
      </h2>
      {error ? (
        <div className="error-message" style={{ color: "red", textAlign: "center" }}>
          {error}
        </div>
      ) : topPerformances.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            color: "#333",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Event Name</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Meet Name</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Score</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Comment</th>
            </tr>
          </thead>
          <tbody>
            {topPerformances.slice(0, 5).map((performance, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{performance.eventName}</td>
                <td style={{ padding: "10px" }}>{performance.meetName}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>{performance.score}</td>
                <td style={{ padding: "10px" }}>{performance.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "#666" }}>No top performances found.</p>
      )}
    </div>
  </DialogContent>
</Dialog>

)}


</>
        )}

        {currentSection === "athletes" && (
          <>
            <div id="athletePage">
              <br></br>
              <b><h1 style={{ fontSize: '36px', color: 'white', textAlign: 'center' }}>Your Athletes</h1></b>
              <br></br>
          
             <div
  className="athletes-section my-4"
  style={{
    background: "linear-gradient(rgb(2, 0, 97) 15%, rgb(24, 23, 24) 158.5%, rgb(5, 5, 5) 158.5%)",
    padding: "20px", // Adds some spacing inside the section
    borderRadius: "10px", // Optional: Rounds the corners of the section
  }}
>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {athletes.map((athlete, index) => (
      <div
        key={athlete.athleteId}
        className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
      >
       <img    src={athlete.photoBase64
                                ? `data:image/jpeg;base64,${athlete.photoBase64}`
                                : "/default-profile.jpg"
                              }
                              alt="Athlete"
                              className="w-full h-[220px] object-cover rounded-lg"
                            />
        
        <div className="text-lg font-semibold text-gray-800 mb-2">
          {athlete.firstName} {athlete.lastName}
        </div>
        <div className="text-sm text-gray-600 mb-4">{athlete.email}</div>
        <button
          onClick={() => handleViewDetails(athlete.athleteId)}
          className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
        >
          View Profile
        </button>
      </div>
    ))}
  </div>
</div>

            </div>
            <div id="athleteProfile">
              {currentAthleteProfile && (
                <Dialog
                  open={profileModalOpen}
                  onClose={handleCloseProfileModal}
                  fullScreen
                  classes={{
                    paper: 'athlete-profile-modal',
                    root: 'dialog-root'
                  }}
                  sx={{
                    '& .MuiDialog-paper': {
                      margin: '5px',
                      backgroundColor: 'transparent', // Ensure underlying background is transparent
                    },
                    '&::before': {
                      content: '""',
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      //margin: '5px',
                      background: 'linear-gradient(rgb(2, 0, 97) 15%, rgb(24, 23, 24) 158.5%, rgb(24, 23, 24) 158.5%, rgb(5, 5, 5) 158.5%)',
                      zIndex: -1,
                      pointerEvents: 'none',
                      borderRadius: '10px', // Optional: adds rounded corners to the margin
                    }
                  }}
                >
                  <DialogTitle
                    style={{
                      textAlign: "center",
                      fontSize: '28px',
                      position: 'relative',
                      color: 'white'
                    }}
                  >
                    Athlete Profile
                    <IconButton
                      onClick={handleCloseProfileModal}
                      style={{
                        position: 'absolute',
                        left: 8,
                        top: 8,
                        color: 'white'
                      }}
                    >
                     <IoIosArrowBack />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent
                    style={{
                      justifyContent: "center",
                      textAlign: "center",
                      color: 'white',
                    }}
                  >

                    <div>
                      <strong><h1 style={{ color: 'white', textAlign: 'center', fontSize: '30px', fontFamily: 'initial' }}>{currentAthleteProfile.firstName}</h1></strong>

                      <Card className="w-full max-w-4xl mx-auto">
                        <CardContent className="flex items-center space-x-6 p-6">
                          {/* Image Section */}
                          <div className="flex-shrink-0 w-1/3">
                            <img
                              src={currentAthleteProfile.photoBase64
                                ? `data:image/jpeg;base64,${currentAthleteProfile.photoBase64}`
                                : "/default-profile.jpg"
                              }
                              alt="Athlete"
                              className="w-full h-[220px] object-cover rounded-lg"
                            />
                          </div>

                          {/* Details Section */}
                          <div className="flex-grow">
                            <Typography variant="h6" gutterBottom>
                              Name: {currentAthleteProfile.firstName} {currentAthleteProfile.lastName}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                              Gender: {currentAthleteProfile.gender}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                              Height: {currentAthleteProfile.height}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                              Weight: {currentAthleteProfile.weight}
                            </Typography>
                            <Typography variant="h6">
                              Category: {currentAthleteProfile.category}
                            </Typography>
                          </div>
                        </CardContent>
                      </Card>

                      <h4 style={styles2.sectionTitle}>Weight Plan</h4>

                      {weightPlan ? (
                        <>

                          <div style={styles2.section}>


                            <>

                              <p>
                                <strong>Start Weight:</strong> {weightPlan.startWeight} kg
                              </p>
                              <p>
                                <strong>Target Weight:</strong> {weightPlan.targetWeight} kg
                              </p>
                              <p>
                                <strong>Preference:</strong> {weightPlan.preference}
                              </p>
                              <p>
                                <strong>Daily Calorie Goal:</strong> {weightPlan.dailyCalorieGoal} kcal
                              </p>
                            </>

                          </div>
                          <button
                            onClick={() => setView2()}
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "#007BFF",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Update Weight Plan
                          </button>

                          <h4 style={styles2.sectionTitle}>Diet Plan</h4>
                          <div>
                            {/* Button to open the modal */}
                            <button
                              onClick={() => setIsVisible(true)}
                              style={{
                                padding: "10px 20px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                            >
                              Create Diet Plan
                            </button>

                            {/* Modal  */}
                            {isVisible && (
                              <div
                                style={{
                                  position: "fixed",
                                  top: "50%",
                                  left: "50%",


                                  transform: "translate(-50%, -50%)",
                                  zIndex: 1000,
                                  backgroundColor: "#fff",
                                  padding: "20px",
                                  borderRadius: "8px",
                                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                                  width: "400px",
                                  color: 'black',

                                }}
                              >
                                <h2 style={{ marginBottom: "20px", color: "#333" }}>Create Daily Diet Plan</h2>
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit3(currentAthleteProfile.athleteId);
                                  }}
                                >
                                  <div style={{ marginBottom: "10px" }}>
                                    <label>Calories:</label>
                                    <input
                                      type="number"
                                      name="calories"
                                      step="0.01"
                                      value={formData3.calories}
                                      onChange={handleChange3}
                                      style={{
                                        width: "100%",
                                        padding: "8px",
                                        marginTop: "5px",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                      }}
                                    />
                                  </div>
                                  <div style={{ marginBottom: "10px" }}>
                                    <label>Protein Intake (grams):</label>
                                    <input
                                      type="number"
                                      name="proteinIntake"
                                      step="0.01"
                                      value={formData3.proteinIntake}
                                      onChange={handleChange3}
                                      style={{
                                        width: "100%",
                                        padding: "8px",
                                        marginTop: "5px",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                      }}
                                    />
                                  </div>
                                  <div style={{ marginBottom: "10px" }}>
                                    <label>Carbohydrate Intake (grams):</label>
                                    <input
                                      type="number"
                                      name="carbohydrateIntake"
                                      step="0.01"
                                      value={formData3.carbohydrateIntake}
                                      onChange={handleChange3}
                                      style={{
                                        width: "100%",
                                        padding: "8px",
                                        marginTop: "5px",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                      }}
                                    />
                                  </div>
                                  <div style={{ marginBottom: "10px" }}>
                                    <label>Fat Intake (grams):</label>
                                    <input
                                      type="number"
                                      name="fatIntake"
                                      step="0.01"
                                      value={formData3.fatIntake}
                                      onChange={handleChange3}
                                      style={{
                                        width: "100%",
                                        padding: "8px",
                                        marginTop: "5px",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                      }}
                                    />
                                  </div>
                                  <div style={{ marginBottom: "10px" }}>
                                    <label>Fibre Intake (grams):</label>
                                    <input
                                      type="number"
                                      name="fibreIntake"
                                      step="0.01"
                                      value={formData3.fibreIntake}
                                      onChange={handleChange3}
                                      style={{
                                        width: "100%",
                                        padding: "8px",
                                        marginTop: "5px",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                      }}
                                    />
                                  </div>
                                  <div style={{ marginBottom: "10px" }}>
                                    <label>Water Intake (Litre):</label>
                                    <input
                                      type="number"
                                      name="waterIntake"
                                      step="0.01"
                                      value={formData3.waterIntake}
                                      onChange={handleChange3}
                                      style={{
                                        width: "100%",
                                        padding: "8px",
                                        marginTop: "5px",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                      }}
                                    />
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                                    <button
                                      type="submit"
                                      style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#4CAF50",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        width: '170px',
                                        cursor: "pointer",
                                      }}
                                    >
                                      Submit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setIsVisible(false)}
                                      style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#f44336",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        width: '170px',
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                              </div>
                            )}

                            {/* Background overlay */}
                            {isVisible && (
                              <div
                                onClick={() => setIsVisible(false)}
                                style={{
                                  position: "fixed",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                  zIndex: 999,
                                }}
                              ></div>
                            )}
                          </div>



                        </>
                      ) : (
                        <>
                          <p style={styles2.emptyText}>No weight plan available</p>
                          <button
                            onClick={() => setView3()}
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "#007BFF",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Create Weight Plan
                          </button>
                        </>
                      )}


                      {weightPlan && coachDietPlan && (
                        <>
                          <div style={{ ...styles2.section1, display: 'flex', flexDirection: 'row', gap: '20px', flexWrap: 'nowrap', overflowX: 'auto' }}>
                            {coachDietPlan?.length > 0 ? (
                              coachDietPlan.map((diet, index) => (
                                <div key={index} style={styles2.dietItem}>
                                  <p>
                                    <strong>Date:</strong> {new Date(diet.date).toLocaleDateString()}
                                  </p>
                                  <p>
                                    <strong>Calories:</strong> {diet.calories} kcal
                                  </p>
                                  <p>
                                    <strong>Current Weight:</strong> {diet.currentWeight} kg
                                  </p>
                                  <p>
                                    <strong>Protein Intake:</strong> {diet.protein} grams
                                  </p>
                                  <p>
                                    <strong>Carbohydrate Intake:</strong> {diet.carbohydrate} grams
                                  </p>
                                  <p>
                                    <strong>Fat Intake:</strong> {diet.fat} grams
                                  </p>
                                  <p>
                                    <strong>Fibre Intake:</strong> {diet.fibre} grams
                                  </p>
                                  <p>
                                    <strong>Water Intake:</strong> {diet.water} Litre
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p style={styles2.emptyText}>No diet plan available</p>
                            )}
                          </div>
                        </>
                      )}


                      {eventResults && (
                        <div style={dashboardStyles}>
                          <div style={cardStyles}>
                            <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontSize: "24px" }}>All Event Results</h2>
                            {error ? (
                              <div style={errorStyles}>{error}</div>
                            ) : (
                              <table style={tableStyles}>
                                <thead>
                                  <tr style={headerRowStyles}>
                                    <th>Event Name</th>
                                    <th>Meet Name</th>
                                    <th>Date</th>
                                    <th>Score</th>
                                    <th>Comment</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {eventResults.map((result, index) => (
                                    <tr key={index} style={rowStyles}>
                                      <td style={{ color: 'black' }}>{result.eventName}</td>
                                      <td style={{ color: 'black' }}>{result.meetName}</td>
                                      <td style={{ color: 'black' }}>{result.eventDate ?
                                        (() => {
                                          const date = new Date(result.eventDate);
                                          return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
                                        })()
                                        : 'N/A'}</td>
                                      <td style={{ color: 'black' }}>{result.score}</td>
                                      <td style={{ color: 'black' }}>{result.comment}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                            {hasMore && !error && (
                              <button onClick={loadMore} style={buttonStyles}>
                                Load More
                              </button>
                            )}
                            {!hasMore && !error && (
                              <p style={noMoreStyles}>No more results to display.</p>
                            )}
                          </div>
                          {/* Existing elements below */}
                          <div>
                            {/* Add other admin dashboard components here */}
                          </div>
                        </div>


                      )}

                      <div>


                        {showModal2 && (
                          <div
                            style={{
                              position: "fixed",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              zIndex: "1000",
                              backgroundColor: "#fff",
                              padding: "20px",
                              borderRadius: "8px",
                              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                              width: "400px",
                              color:'black',
                            }}
                          >
                            <h2 style={{ marginBottom: "20px", textAlign: "center" ,fontFamily:'cursive',fontSize:'26px'
                            }}>
                              Weight Plan
                            </h2>
                            <form onSubmit={(e) => handleSubmit(e, currentAthleteProfile.athleteId)}>
                              <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px" }}>
                                  Start Weight
                                </label>
                                <input
                                  type="number"
                                  name="startWeight"
                                  value={formData2.startWeight}
                                  onChange={handleInputChange2}
                                  required
                                  style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                  }}
                                />
                              </div>
                              <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px" }}>
                                  Target Weight
                                </label>
                                <input
                                  type="number"
                                  name="targetWeight"
                                  value={formData2.targetWeight}
                                  onChange={handleInputChange2}
                                  required
                                  style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                  }}
                                />
                              </div>
                              <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px" }}>
                                  Preference
                                </label>
                                <input
                                  type="text"
                                  name="preference"
                                  value={formData2.preference}
                                  onChange={handleInputChange2}
                                  required
                                  style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                  }}
                                />
                              </div>
                              <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px" }}>
                                  Daily Calorie Goal
                                </label>
                                <input
                                  type="number"
                                  name="dailyCalorieGoal"
                                  value={formData2.dailyCalorieGoal}
                                  onChange={handleInputChange2}
                                  required
                                  style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                  }}
                                />
                              </div>
                              <button
                                type="submit"
                                style={{
                                  padding: "10px 20px",
                                  backgroundColor: "#28A745",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  width: "100%",
                                }}
                              >
                                Submit
                              </button>
                            </form>
                            <button
                              onClick={() => setShowModal2(false)}
                              style={{
                                padding: "10px 20px",
                                backgroundColor: "#DC3545",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                marginTop: "10px",
                                width: "100%",
                              }}
                            >
                              Close
                            </button>
                          </div>
                        )}

                        {showModal2 && (
                          <div
                            onClick={() => setShowModal2(false)}
                            style={{
                              position: "fixed",
                              top: "0",
                              left: "0",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              zIndex: "999",
                            }}
                          ></div>
                        )}
                      </div>




                    </div>


                  </DialogContent>
                </Dialog>
              )}
            </div>


          </>
        )}


      </div>

      {/* Modals (Reuse existing modal code here) */}
    </div>

  );
};

export default CoachDashboard;



const styles2 = {
  container: {
    display: 'flex', // Enables flexbox
    justifyContent: 'flex-start', // Aligns cards to the right
    gap: '20px', // Adds spacing between cards
    //alignItems: 'flex-start',
    padding: '20px',
    //backgroundColor: '#f4f4f4',

    backgroundColor: 'red',

  },
  coachCard: {
    width: '100%',
    width: '800px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    textAlign: 'center',
  },
  coachImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '15px',
    border: '3px solid #007BFF',
  },
  coachName: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '10px 0',
    color: '#333',
  },
  coachInfo: {
    fontSize: '16px',
    color: '#666',
    margin: '5px 0',
  },
  section1: {
    marginTop: '20px',
    textAlign: 'left',
    width: '800px',

  },
  section: {
    marginTop: '20px',
    textAlign: 'left',

  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: '10px',
    borderBottom: '2px solid #007BFF',
    paddingBottom: '5px',
  },
  achievementsBox: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  },
  achievementTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '5px 0',
  },
  achievementDescription: {
    fontSize: '14px',
    color: '#555',
  },
  emptyText: {
    fontSize: '14px',
    color: '#999',
    fontStyle: 'italic',
  },
  dietList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
  },
  dietItem: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    color: 'black',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    minWidth: '250px', // Ensures a fixed width for each card
    maxWidth: '300px',
    flexShrink: 0, // Prevents items from shrinking when space is limited
  },
  emptyText: {
    fontSize: '14px',
    color: '#999',
    fontStyle: 'italic',
  },
};


const modalStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",  // Semi-transparent background
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,  // Ensure modal is on top
};

const modalContentStyles = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "12px",
  width: "80%",
  maxWidth: "600px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  animation: "fadeIn 0.3s ease-in-out",
};

const modalTitleStyles = {
  textAlign: "center",
  fontSize: "34px",
  color: "#333",
  marginBottom: "20px",
};

const labelStyles = {
  display: "block",
  marginBottom: "15px",
  fontSize: "16px",
  color: "#555",
};

const requiredStyles = {
  color: "red",
};

const inputStyles = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "16px",
  color: "#333",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.3s",
};

const inputFocusStyles = {
  borderColor: "#3498db",
};

const buttonContainerStyles = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "20px",
};

const buttonStyles = {
  padding: "12px 20px",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer",
  width: "48%", // Button width to make them align horizontally
  textAlign: "center",
};

// Add a fade-in animation to the modal
const fadeInKeyframes = `@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}`;
document.styleSheets[0].insertRule(fadeInKeyframes, 0);
const dashboardStyles = {
  padding: "20px",
  //backgroundColor: "#f0f4f8",
};

const cardStyles = {
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  marginBottom: "20px",
  backgroundColor: "#fff",
};

const headerStyles = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#333",
};

const tableStyles = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "20px",
};

const headerRowStyles = {
  backgroundColor: "#007BFF",
  color: "white",
  textAlign: "left",
};

const rowStyles = {
  borderBottom: "1px solid #ccc",
};

const noMoreStyles = {
  textAlign: "center",
  color: "#777",
};

const errorStyles = {
  textAlign: "center",
  color: "red",
  fontWeight: "bold",
};
