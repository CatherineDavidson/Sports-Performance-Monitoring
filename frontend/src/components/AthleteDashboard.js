import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, AppBar, Toolbar, Dialog, Card, CardContent } from "@mui/material";
import { useNavigate, Link } from 'react-router-dom';
import LoginIcon from "@mui/icons-material/Login";
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import axios from "axios";
import '../styles/athlete.css';
import defaultProfileImage from '../components/images/download.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import AthleteDashboardstatistics from "./athleteDashboardstatistics";
import { 
  PencilIcon,
  Scissors, 
  Feather, 
  Cpu, 
  Layers, 
  Compass 
} from 'lucide-react';
import zIndex from '@mui/material/styles/zIndex';
const Popup = ({ message, type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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


function AthleteDashboard() {
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState(null);
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSection, setCurrentSection] = useState('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [remark, setRemark] = useState('');
  const [remarks2, setRemarks2] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); 
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [selectedEvent2, setSelectedEvent2] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Registered');
  const [isOpen, , setisOpen,] = useState('Overview');
  const [selectedSubTab, setSelectedSubTab] = useState('Overview');
  const [isSaving, setIsSaving] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });
  const [assistanceDetails, setAssistanceDetails] = useState({
    status: null,
    coachId: null,
    coach: null,
    requestPending: false,
  });

  const spinnerStyles = {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid green",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 2s linear infinite",
  };

  const formatDateForDisplayAndForm = (dateString) => {
    if (!dateString) return '';
    const utcDate = new Date(dateString); 
    const localDate = new Date(utcDate.getTime() + new Date().getTimezoneOffset() * -60000);
    return localDate.toISOString().split('T')[0];
  };

  const [updatedProfile, setUpdatedProfile] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    height: '',
    weight: '',
    category: '',
    coach: '',
  });
  const [topPerformances, setTopPerformances] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);



  const filterCompletedEvents = (resultStatus) => {
    const today = new Date();
    return events.filter((event) => {
      const eventDate = new Date(event.eventDate);
      return (
        eventDate < today &&
        (resultStatus === 'Result Pending'
          ? event.resultStatus === 'Pending'
          : event.resultStatus === 'Published')
      );
    });
  };


  const [showDialog, setShowDialog] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState(null);
  const [eventResults, setEventResults] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const resultsPerPage = 5;

  useEffect(() => {
    const fetchEventResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/athlete/all-results", {
          params: { page, size: resultsPerPage },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.length < resultsPerPage) {
          setHasMore(false);
        }

        setEventResults(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "NO DATA YET");
      }
    };

    fetchEventResults();
   
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };



  useEffect(() => {
    loadAthleteProfile();
    loadAllEvents();
    loadMyEvents();
    const intervalId = setInterval(loadMyEvents, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const loadAthleteProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/athlete/profile', {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch athlete profile");
      }

      const data = await response.json();
      const formattedDisplayDate = data.birthDate ? formatDateForDisplayAndForm(data.birthDate) : 'Data not available';
      const formattedFormDate = data.birthDate ? formatDateForDisplayAndForm(data.birthDate) : '';
      setAthlete({
        firstName: data.firstName || 'Data not available',
        lastName: data.lastName || '',
        birthDate: formattedDisplayDate,
        gender: data.gender || 'Data not available',
        height: data.height || 'Data not available',
        weight: data.weight || 'Data not available',
        category: data.category || 'Data not available',
        photoBase64: data.photoBase64 || null,
      });

      setUpdatedProfile({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        birthDate: formattedFormDate, 
        gender: data.gender || '',
        height: data.height || '',
        weight: data.weight || '',
        category: data.category || 'Not specified',
        coach: data.coach || null,
      });
    } catch (error) {
      console.error("Error loading athlete profile:", error);
    }
  };

  const handleProfileChange2 = (event) => {
    const { name, value } = event.target;
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

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
      console.log(data);
      console.log(data.eventId);
      setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

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
      setMyEvents(data);
    } catch (error) {
      console.error("Error loading my events:", error);
    }
  };
 
  const handleViewEvent2 = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/athlete/events/${eventId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      const data = await response.json();
      setSelectedEvent2(data);
    } catch (error) {
      console.error("Error loading my events:", error);
    }

  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/*'); 
  };

  const handleEditProfile = () => {
    setEditingProfile(true);
  };
  const handleOpenRegisterPopup = (event) => setRegisteringEvent(event);

  const handleViewEvent = (event) => setSelectedEvent(event);


  const handleCloseModal = () => {
    setEditingProfile(false);
    setSelectedEvent(null); 
    setRegisteringEvent(null);
    setRemark('');
  };
  const handleCloseModal1 = () => {
    setSelectedEvent2(null);
  };
  const handleCloseModal2 = () => {
    setSelectedEvent3(null);
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]); 
    const file = e.target.files[0]
    setFileName(file ? file.name : "No file selected");

  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setUpdatedProfile({
      ...updatedProfile,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    const formData = new FormData();
    setIsSaving(true);
    if (updatedProfile.firstName) formData.append('firstName', updatedProfile.firstName);
    if (updatedProfile.lastName) formData.append('lastName', updatedProfile.lastName);
    if (updatedProfile.birthDate) formData.append('birthDate', updatedProfile.birthDate);
    if (updatedProfile.gender) formData.append('gender', updatedProfile.gender);
    if (updatedProfile.height) formData.append('height', updatedProfile.height);
    if (updatedProfile.weight) formData.append('weight', updatedProfile.weight);
    if (updatedProfile.category) formData.append('category', updatedProfile.category);
    if (newImage) formData.append('photoUrl', newImage); 
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/athlete/createProfile', {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setIsSaving(false);
        setEditingProfile(false);
        loadAthleteProfile();
        setPopup({
          show: true,
          message: "Profile updated successfully!",
          type: 'success'
        });
      } else {
        setIsSaving(false);
        setEditingProfile(false);
        const errorDetails = await response.json();
        console.error('Error saving profile:', errorDetails);
        setPopup({
          show: true,
          message: "Failed to update the profile. Please try again.",
          type: 'error'
        });
      }
    } catch (error) {
      setIsSaving(false);
      setEditingProfile(false);
      console.error('Error saving profile:', error);
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
  const handleRegisterForEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/athlete/registerForEvent/${eventId}`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          remarks: remark
        })
      });

      if (response.ok) {
        loadAllEvents();
        loadMyEvents();
        setShowSuccessPopup(true);
        handleCloseModal();
      } else {
        console.log(`${eventId}`);
        console.error('Error registering for event:', response);
      }
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const filterMyEvents = () => {
    switch (selectedSubTab) {
      case 'Pending':
        return myEvents.filter(event => event.status === 'Pending');
      case 'Approved':
        return myEvents.filter(event => event.status === 'Approved');
      case 'Rejected':
        return myEvents.filter(event => event.status === 'Rejected');
      default:
        return myEvents;
    }
  };

  const [selectedSubTab2, setSelectedSubTab2] = useState('Result Pending');
  const [events2, setEvents2] = useState([]);
  const [selectedEvent3, setSelectedEvent3] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [athleteResult, setAthleteResult] = useState(null);
  useEffect(() => {
    const fetchEvents2 = async () => {
      const token = localStorage.getItem("token");
      const endpoint =
        selectedSubTab2 === 'Result Pending'
          ? `athlete/events/no-results`
          : `athlete/events/with-results`;
      setEvents2([]);
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });
        const data = await response.json();
        setEvents2(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents2([]);
      }
    };

    fetchEvents2();
  }, [selectedSubTab2]);
  const handleViewEvent3 = async (eventId) => {

    const token = localStorage.getItem("token");
    const response = await fetch(`athlete/events/${eventId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });
    const data = await response.json();
    setSelectedEvent3(data);
    try {
      const athleteResultResponse = await fetch(
        `athlete/results/event/${eventId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      }
      );
      const resultData = await athleteResultResponse.json();
      setAthleteResult(resultData);
      const leaderboardResponse = await fetch(`athlete/event/leaderboard/${eventId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      const leaderboardData = await leaderboardResponse.json();
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching event details:', error);
      setAthleteResult(null);
      setLeaderboard([]);
    }
  }
  const [assistanceRequest, setAssistanceRequest] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [coachDetails, setCoachDetails] = useState(null);
  const [coachAchievements, setCoachAchievements] = useState([]);
  const [coachWeightPlan, setCoachWeightPlan] = useState([]);
  const [coachDietPlan, setCoachDietPlan] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = () => {
    axios.get('/athlete/getassistancereq', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        const assistanceData = response.data;
        setAssistanceRequest(assistanceData);

        if (assistanceData && (assistanceData.status === 'Accepted' || assistanceData.status === 'Pending')) {
          axios.get(`/athlete/coach/${assistanceData.coachId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(coachResponse => {
              setCoachDetails(coachResponse.data);
            })
            .catch(error => {
              console.error('Error fetching coach details:', error);
            });
          axios.get(`/athlete/achievements/coach/${assistanceData.coachId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(achievementsResponse => {
              setCoachAchievements(achievementsResponse.data);
            })
            .catch(error => {
              console.error('Error fetching coach achievements:', error);
            });
          axios.get(`/athlete/getweightplan`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(weightPlanResponse => {
              setCoachWeightPlan(weightPlanResponse.data);
            })
            .catch(error => {
              console.error('Error fetching coach weight plans:', error);
            });
          axios.get(`/athlete/getdailydiets`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(dietPlanResponse => {
              setCoachDietPlan(dietPlanResponse.data);
            })
            .catch(error => {
              console.error('Error fetching coach diet plans:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error fetching assistance request:', error);
      });
    axios.get('/athlete/getallcoaches', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setCoaches(response.data);
      })
      .catch(error => {
        console.error('Error fetching coaches:', error);
      });
    }
    const intervalId = setInterval(fetchData, 500);
    return () => clearInterval(intervalId);
  }, [token]); 


  useEffect(() => {
    const fetchTopPerformances = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/athlete/top-performance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTopPerformances(response.data); // Set data
      } catch (err) {
        setError(err.response?.data?.error || "NO DATA YET");
      }
    };

    // Validate role synchronously before making any API calls
   
      fetchTopPerformances(); // Only fetch data if role is valid
    
  }, []);



  const handleShowCoachProfile = (coachId) => {
    axios.get(`/athlete/coach/${coachId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setCoachDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching coach details:', error);
      });

    axios.get(`/athlete/achievements/coach/${coachId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setCoachAchievements(response.data);
      })
      .catch(error => {
        console.error('Error fetching coach achievements:', error);
      });

    axios.get(`/athlete/getweightplan`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setCoachWeightPlan(response.data);
      })
      .catch(error => {
        console.error('Error fetching coach weight plans:', error);
      });

    axios.get(`/athlete/getdailydiets`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setCoachDietPlan(response.data);
      })
      .catch(error => {
        console.error('Error fetching coach diet plans:', error);
      });

    setSelectedCoachId(coachId);
    setShowModal(true);
  };
  const [fileName, setFileName] = useState("No file selected");
  
  const handleRequestAssistance = async (coachId) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('coachId', coachId);
      formData.append('remarks', remarks2 || '');

      const response = await fetch(`/athlete/createassistancereq`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
       setShowModal(false)
        setPopup({
          show: true,
          message: "Assistance request sent successfully!",
          type: 'success'
        });
        loadAthleteProfile();
      } else {
        const errorData = await response.json();
        console.error('Error requesting assistance:', errorData.message);
       setShowModal(false)
       setPopup({
        show: true,
        message: "Failed to send assistance request. Please try again.",
        type: 'error'
      });
      }
    } catch (error) {
      console.error('Error requesting assistance:', error);
      setShowModal(false)
      setPopup({
        show: true,
        message: "An error occurred. Please try again.",
        type: 'error'
      });
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };
  const filteredEvents = events.filter(event =>
    event.eventTitle.toLowerCase().includes(searchQuery) ||
    event.meetId.meetName.toLowerCase().includes(searchQuery)
  );


  const styles = {
    coachList: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '20px',
      padding: '20px',
    },
    coachCard: {
      width: '250px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
      padding: '20px',
      textAlign: 'center',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
      border: '1px solid #e9e9e9',
    },
    coachImage: {
      width: '200px',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '8px',
      border: '2px solid #f0f0f0',
      marginBottom: '15px',
    },
    coachName: {
      color: '#333',
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '10px',
    },
    button: {
      backgroundColor: '#5a8dee',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      marginTop: '10px',
      fontWeight: '500',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      width: '500px',
      maxWidth: '90%',
      maxHeight: '90%',
      overflowY: 'auto',
      position: 'relative',
      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
      textAlign: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#888',
      transition: 'color 0.3s ease',
      padding: '10px',
    },
    closeButtonHover: {
      color: '#333',
    },
    remarkTextarea: {
      width: '100%',
      minHeight: '100px',
      marginBottom: '15px',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      resize: 'vertical',
      fontSize: '14px',
      backgroundColor: 'rgb(217, 217, 244)',
    },
    achievementsBox: {
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '10px',
      border: '1px solid #e9ecef',
      backgroundColor: 'rgb(217, 217, 244)',
    },
  };

  const styles2 = {
    ...styles,
    container: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '12px',
    },
    coachCard: {
      ...styles.coachCard,
      width: '100%',
      maxWidth: '700px',
      margin: '0 auto',
    },
    section: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.04)',

    },
    section1: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
      width: '550px',

      flex: 1,
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '8px', 
      backgroundColor: '#f9f9f9',
    },
    sectionTitle: {
      fontSize: '20px',
      borderBottom: '2px solid #5a8dee',
      paddingBottom: '10px',
      marginBottom: '15px',
      color: 'rgb(2, 0, 97)',
      fontWeight: '600',
    },
    coachInfo: {
      color: '#666',
      margin: '10px 0',
    },
    emptyText: {
      color: '#999',
      fontStyle: 'italic',
    },
    dietList: {
      listStyle: 'none',
      padding: 0,
    },
    dietItem: {
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '10px',
      border: '1px solid #e9ecef',
    },
  };



  return (
    <div className="athlete-dashboard" >

      <AppBar position="static" className="navbar">
        <Toolbar className="navbar-content">
          <h1 className="text-3xl font-bold text-center text-[#1e40af]">
            Athletes
          </h1>
          <Box className="navbar-actions">
            <Link to="" className="logout-link" >
              <Button className="logout-button" onClick={() => setCurrentSection('profile')}>
                Profile
              </Button>
            </Link>
            <Link to="" className="logout-link">
              <Button className="logout-button" onClick={() => setCurrentSection('events')}>
                Events
              </Button>
            </Link>
            <Link to="" className="logout-link">
              <Button className="logout-button" onClick={() => setCurrentSection('myEvents')}>
                My Events
              </Button>
            </Link>
            <Link to="" className="logout-link">
              <Button className="logout-button" onClick={() => setCurrentSection('coach')}>
                Coach
              </Button>
            </Link>
            <Link to="" className="logout-link">
          <Button
            className="logout-button"
            onClick={() => setCurrentSection('athleteDashboardstatistics.js')}
          >
            Statistics
          </Button>
        </Link>
            <Link to="/*" className="logout-link">

              <Button
                onClick={handleLogout}
                startIcon={<LoginIcon />}
                style={{ color: 'white' }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full text-white font-medium hover:shadow-lg transition transform hover:scale-105">
                Logout
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

     
      <div className="content">
        {currentSection === 'profile' && (
          <>
            <div className="transition-container">
              <div className="centered-jump">
                <br></br>
                <h2 className="text-3xl font-bold mt-10 mb-3 text-center text-white">
                  Profile
                </h2>
              </div>
              <div className="profile-section">
                {athlete && (
                  <>

                    {/* <img
                      src={athlete.photoBase64 ? `data:image/jpeg;base64,${athlete.photoBase64}` : defaultProfileImage}
                      alt="Profile"
                      className="profile-photo"
                    />

                    <div className="athlete-info">
                      <p>Name: {athlete.firstName} {athlete.lastName}</p>
                      <p>Date of Birth: {athlete.birthDate ? athlete.birthDate.split('T')[0] : 'N/A'}
                      </p>
                      <p>Gender: {athlete.gender}</p>
                      <p>Height: {athlete.height}</p>
                      <p>Weight: {athlete.weight}</p>
                      <p>Category: {athlete.category}</p>
                      <button onClick={handleEditProfile}>Edit Profile</button>
                    </div>*/}
             <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden grid grid-cols-12 transform transition-all hover:scale-[1.01]">
      {/* Photo Section - Now spans 5 columns instead of 3 */}
      <div className="relative col-span-5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500">
        <div className="h-full relative">
          <img
            src={athlete.photoBase64 ? `data:image/jpeg;base64,${athlete.photoBase64}` : defaultProfileImage}
            alt="Profile"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent"></div>
          
          {/* Edit Button */}
          <button 
            onClick={handleEditProfile}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-sm transition-all duration-300 group"
          >
            <PencilIcon className="text-white w-6 h-6 group-hover:rotate-45 transition-transform" />
          </button>
        </div>
      </div>

      {/* Details Section - Now spans 7 columns */}
      <div className="col-span-7 p-8 bg-white">
        <h2 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
          {athlete.firstName} {athlete.lastName}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {[
            { 
              icon: <Feather className="text-indigo-500" />, 
              label: 'Birth Date', 
              value: athlete.birthDate 
                ? new Date(athlete.birthDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                : 'N/A'
            },
            { 
              icon: <Cpu className="text-purple-500" />, 
              label: 'Gender', 
              value: athlete.gender 
            },
            { 
              icon: <Layers className="text-pink-500" />, 
              label: 'Height', 
              value: athlete.height 
            },
            { 
              icon: <Compass className="text-indigo-600" />, 
              label: 'Weight', 
              value: athlete.weight 
            },
            { 
              icon: <Scissors className="text-purple-600" />, 
              label: 'Category', 
              value: athlete.category 
            }
          ].map(({ icon, label, value }, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
                {icon}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-lg font-semibold text-gray-800">{value}</p>
              </div>
            </div>
          ))}
          <button onClick={handleEditProfile} className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full text-white font-medium hover:shadow-lg transition transform hover:scale-105 text-xl" style={{marginLeft:'10%',width:'150px',margin:'5%'}}>Edit Profile</button>
        </div>
      </div>
    </div>
    </> 
                )}
              </div>
            </div>
            <div className="top-performance-card" style={{ margin: "20px", padding: "20px", backgroundColor: "white", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
              <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontSize: "24px" }}>Top 5 Performances</h2>
              {error ? (
                <div className="error-message" style={{ color: "red", textAlign: "center" }}>{error}</div>
              ) : topPerformances.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
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
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{performance.eventName}</td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{performance.meetName}</td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee", textAlign: "center" }}>{performance.score}</td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{performance.comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: "center", color: "#666" }}>No top performances found.</p>
              )}
            </div>

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
                          <td>{result.eventName}</td>
                          <td>{result.meetName}</td>
                          <td>{formatDateForDisplayAndForm(result.eventDate)}</td>
                          <td>{result.score}</td>
                          <td>{result.comment}</td>
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
              <div>
              </div>
            </div>
          </>
        )}

        {editingProfile && (
          <div className="modal">
            <div className="modal-content">
              <h2 style={{ fontSize: '26px' }}>Edit Profile</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <label>
                  <input
                    type="text"
                    name="firstName"
                    value={updatedProfile.firstName}
                    onChange={handleProfileChange}
                    placeholder=" "
                  />
                  <span>First Name</span>
                </label>

                <label>
                  <input
                    type="text"
                    name="lastName"
                    value={updatedProfile.lastName}
                    onChange={handleProfileChange}
                    placeholder=" "
                  />
                  <span>Last Name</span>
                </label>

                <label>
                  <input
                    type="date"
                    name="birthDate"
                    value={updatedProfile.birthDate}
                    onChange={handleProfileChange}
                    placeholder=" "
                  />
                  <span>Date of Birth</span>
                </label>

                <label>
                  <input
                    type="text"
                    name="gender"
                    value={updatedProfile.gender}
                    onChange={handleProfileChange}
                    placeholder=" "
                  />
                  <span>Gender</span>
                </label>
                <label>
                  <input
                    type="text"
                    name="height"
                    value={updatedProfile.height}
                    onChange={handleProfileChange}
                    placeholder=" "
                  />
                  <span>Height</span>
                </label>
                <label>
                  <input
                    type="text"
                    name="weight"
                    value={updatedProfile.weight}
                    onChange={handleProfileChange}
                    placeholder=''
                  />
                  <span>Weight</span>
                </label>
                <label>
                  <input
                    type="text"
                    name="category"
                    value={updatedProfile.category}
                    onChange={handleProfileChange}
                    placeholder=''
                  />
                  <span>Category</span>
                </label>

                <label>Upload Image</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "3px",
                    border: "2px solid gray",
                    borderRadius: "23px",
                    transition: "border-color 0.3s ease",
                    cursor: "pointer",
                    minWidth: "420px", 
                    maxWidth: "100%",
                    flexWrap: "wrap",
                  }}
                >
                  <label
                    htmlFor="fileInput"
                    style={{
                      backgroundColor: "#8e44ad",
                      color: "white",
                      padding: "10px 20px",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      textAlign: "center",
                      margin: "0px",
                    }}
                  >
                    Browse
                  </label>

                  <input
                    id="fileInput"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />

                  <span
                    style={{
                      fontSize: "1rem",
                      color: "#555", 
                      whiteSpace: "nowrap", 
                      overflow: "hidden", 
                      textOverflow: "ellipsis", 
                      maxWidth: "calc(100% - 120px)", 
                      textAlign: "left", 
                    }}
                  >
                    {fileName}
                  </span>
                </div>


                <br></br>
                <br></br>
                {isSaving && (
                  <div className="loader-overlay">
                    <div className="loader"></div>
                    <p>Uploading...</p>
                  </div>
                )}
                <div className="modal-actions">
                  <button type="button" onClick={handleSaveProfile} className='btn2'>Save</button>
                  <button type="button" onClick={handleCloseModal} className='btn2'>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {popup.show && (
          <Popup
            message={popup.message}
            type={popup.type}
            onClose={closePopup}
          />
        )}

        {currentSection === 'events' && (
          <div className="transition-container">
            <br></br>
            <div className="centered-jump">
              <h2 className="text-3xl font-bold mb-3 text-center text-white">
                Events
              </h2>
            </div>
            <div className="events-section">
              <div style={{ margin: '20px 0', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <FontAwesomeIcon icon={faSearch} style={{ marginRight: '8px', color: '#ccc', fontSize: '16px' }} />
                 <input
                    type="text"
                    placeholder="Search by event name or meet name..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{
                      padding: '10px',
                      width: '350px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      fontSize: '16px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>


              <div className="events-container">
                {filteredEvents.map(event => (
                  <div key={event.eventId} className="event-card" style={{ width: '280px', padding: '7px', margin: '2px' }}>
                    <img
                      src={event.imageBase64 ? `data:image/jpeg;base64,${event.imageBase64}` : '/default-profile.jpg'}
                      alt={event.eventTitle} onClick={() => handleViewEvent(event)} />
                    <h3 style={{ textAlign: 'center' }}>{event.eventTitle}</h3>
                    <p>Meet: {event.meetId.meetName}</p>
                    <p>Category: {event.category}</p>
                    <button className="button-19" onClick={() => handleViewEvent(event)}>View</button>
                    <p></p>
                    <button className="button-19" onClick={() => handleOpenRegisterPopup(event)}>Register</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedEvent && (
          <Dialog open={isOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#1F509A', color: 'white' }}>
              <Typography variant="h5" gutterBottom>
                {selectedEvent.eventTitle}
              </Typography>
            </div>
            <DialogContent className="flex p-6">
              <div className="w-1/2 pr-6">
                <img
                  src={selectedEvent.imageBase64
                    ? `data:image/jpeg;base64,${selectedEvent.imageBase64}`
                    : '/default-profile.jpg'}
                  alt={selectedEvent.eventTitle}
                  onClick={() => handleViewEvent(selectedEvent)}
                  className="w-full h-[300px] object-cover rounded-lg cursor-pointer"
                />
              </div>
              <div className="w-1/2 pl-6 flex flex-col justify-between">
                <div>
                  <Typography variant="body1" className="mb-2">
                    <strong>Meet:</strong> {selectedEvent.meetId.meetName}
                  </Typography>
                  <Typography variant="body1" className="mb-2">
                    <strong>Category:</strong> {selectedEvent.category}
                  </Typography>
                  <Typography variant="body1" className="mb-2">
                    <strong>Description:</strong> {selectedEvent.eventDescription}
                  </Typography>
                  <Typography variant="body1" className="mb-2">
                    <strong>Location:</strong> {selectedEvent.location}
                  </Typography>
                  <Typography variant="body1" className="mb-4">
                    <strong>Event Date:</strong> {formatDateForDisplayAndForm(selectedEvent.eventDate)}
                  </Typography>

                  <TextField
                    multiline
                    rows={1}
                    fullWidth
                    placeholder="Remarks (optional)"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    variant="outlined"
                  />
                </div>      
                <div className="flex justify-between">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleRegisterForEvent(selectedEvent.eventId)}
                    className="w-[48%]"
                  >
                    Register
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCloseModal}
                    className="w-[48%]"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {registeringEvent && (
          <div className="modal" >
            <div className="modal-content" style={{ width: '420px', height: '300px', textAlign: 'center', paddingTop: '2%' }}>
              <h1 style={{ fontSize: '24px' }}>Register for {registeringEvent.eventTitle}</h1>
              <br></br>
              <textarea placeholder="Add your remark" required value={remark} onChange={(e) => setRemark(e.target.value)}></textarea>
              <p></p>
              <button onClick={() => handleRegisterForEvent(registeringEvent.eventId)} style={{ width: '150px', marginRight: '15px' }}>Submit</button>
              <button onClick={handleCloseModal} style={{ width: '150px', marginRight: '15px' }}>Cancel</button>
            </div>
          </div>
        )}
        {showSuccessPopup && (
          <div className="modal">
            <div className="modal-content" style={{ textAlign: 'center', height: '200px' }}>
              <br></br>
              <br></br>
              <h2>Registration Successful!</h2>
              <p>You have successfully registered for the event.</p>
              <button onClick={closeSuccessPopup} style={{ marginTop: '20px' }}>OK</button>
            </div>
          </div>
        )}
        {currentSection === 'myEvents' && (
          <div className="transition-container">
            <br />
            <br />
            <div className="centered-jump">
              <h2 className="text-3xl font-bold mb-8 text-center text-white"> My Events </h2>
            </div>
            <div className="my-events-section">
              <div className="tabs-container">
                <button
                  className={`tab-button ${selectedTab === 'Registered' ? 'active' : ''}`}
                  onClick={() => setSelectedTab('Registered')}
                >
                  REGISTERED EVENTS
                </button>
                <button
                  className={`tab-button ${selectedTab === 'Completed' ? 'active' : ''}`}
                  onClick={() => setSelectedTab('Completed')}
                >
                  COMPLETED EVENTS
                </button>
                <br />
              </div>

              <div style={{ margin: '20px 0', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <FontAwesomeIcon icon={faSearch} style={{ marginRight: '8px', color: '#ccc', fontSize: '16px' }} />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      padding: '10px',
                      width: '350px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      fontSize: '16px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>



              {selectedTab === 'Registered' && (
                <div>
                  <div className="tabs">
                    {['Overview', 'Pending', 'Approved', 'Rejected'].map((tab) => (
                      <button
                        key={tab}
                        className={selectedSubTab === tab ? 'active' : ''}
                        onClick={() => setSelectedSubTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Event Name</th>
                        <th>Meet Name</th>
                        <th>Registration Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterMyEvents(selectedSubTab)
                        .filter(
                          (regis) =>
                            regis.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            regis.meetName.toLowerCase().includes(searchTerm.toLowerCase())
                        )

                        .map((regis) => (
                          <tr key={regis.registrationId}>
                            <td>{regis.eventName}</td>
                            <td>{regis.meetName}</td>
                            <td>{formatDateForDisplayAndForm(regis.registrationDate)}</td>
                            <td>{regis.status}</td>
                            <td>
                              <button
                                className="button-19"
                                onClick={() => handleViewEvent2(regis.eventId)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedTab === 'Completed' && (
                <div>
                  <div className="tabs1">
                    {['Result Pending', 'Result Published'].map((tab) => (
                      <button
                        key={tab}
                        className={`tab1-button ${selectedSubTab2 === tab ? 'active' : ''}`}
                        onClick={() => setSelectedSubTab2(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Event Name</th>
                        <th>Meet Name</th>
                        <th>Event Date</th>
                        <th>Result Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events2
                        .filter(
                          (event) =>
                            event.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.meetName.toLowerCase().includes(searchTerm.toLowerCase())
                        )

                        .map((event) => (
                          <tr key={event.eventId}>
                            <td>{event.eventTitle}</td>
                            <td>{event.meetName}</td>
                            <td>{formatDateForDisplayAndForm(event.eventDate)}</td>
                            <td>
                              {selectedSubTab2 === 'Result Pending' ? 'Pending' : 'Published'}
                            </td>
                            <td>
                              <button
                                className="button-19"
                                onClick={() => handleViewEvent3(event.eventId)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {selectedEvent3 && (
                    <div
                    className="modal-overlay"
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "115%",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1000,
                      pointerEvents: "auto",
                    }}
                  >
                    <div
                      className="modal-content"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                        maxWidth: "900px",
                        width: "100%",
                        maxHeight: "90vh",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                      }}
                    >
                     
                      {/* Fixed Header */}
                      <div
                        style={{
                          padding: "20px",
                          textAlign: "center",
                          borderBottom: "1px solid #ddd",
                          position: "sticky",
                          top: 0,
                          backgroundColor: "white",
                          zIndex: 10,
                        }}
                      >
                        <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                          {selectedEvent3.eventTitle}
                        </h2>
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#007BFF",
                            margin: "10px 0 0",
                          }}
                        >
                          {selectedEvent3.category}
                        </p>
                         <button
                        onClick={handleCloseModal2}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          backgroundColor: "#ff4d4f",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          fontSize: "16px",
                          lineHeight: "1",
                          zIndex:"99999",
                        }}
                      >
                        &times;
                      </button>
                  
                      </div>
                  
                      {/* Scrollable Content */}
                      <div
                        style={{
                          overflowY: "auto",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "20px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          <div
                            style={{
                              width: "50%",
                              backgroundImage: `url(data:image/png;base64,${selectedEvent3.imageBase64})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              borderRadius: "8px",
                            }}
                          />
                          <div
                            style={{
                              width: "50%",
                              padding: "20px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            <p>
                              <b>Meet Name:</b> {selectedEvent3.meetName}
                            </p>
                            <p>
                              <b>Event Date:</b> {formatDateForDisplayAndForm(selectedEvent3.eventDate)}
                            </p>
                            <p>
                              <b>Event Description:</b> {selectedEvent3.eventDescription}
                            </p>
                            <p>
                              <b>Event Location:</b> {selectedEvent3.location}
                            </p>
                          </div>
                        </div>
                  
                        {selectedSubTab2 === 'Result Published' && athleteResult?.comment && leaderboard && (
                          <div style={{ padding: "20px", borderBottom: "1px solid #ddd" }}>
                            <h3>Your Result</h3>
                            <table
                              style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginTop: "10px",
                              }}
                            >
                              <thead>
                                <tr>
                                  <th style={tableHeaderStyle}>Rank</th>
                                  <th style={tableHeaderStyle}>Score</th>
                                  <th style={tableHeaderStyle}>Comment</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td style={tableCellStyle}>
                                    {leaderboard.findIndex(
                                      (entry) => entry.athleteName === athleteResult.athleteName
                                    ) + 1}
                                  </td>
                                  <td style={tableCellStyle}>{athleteResult.score}</td>
                                  <td style={tableCellStyle}>{athleteResult.comment}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                  
                        {leaderboard && (
                          <div style={{ padding: "20px" }}>
                            <h3>Leaderboard</h3>
                            <table
                              style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginTop: "10px",
                                marginBottom: "20px",
                              }}
                            >
                              <thead>
                                <tr>
                                  <th style={tableHeaderStyle}>Rank</th>
                                  <th style={tableHeaderStyle}>Athlete Name</th>
                                  <th style={tableHeaderStyle}>Score</th>
                                  <th style={tableHeaderStyle}>Comment</th>
                                </tr>
                              </thead>
                              <tbody>
                                {leaderboard.length > 0 ? (
                                  leaderboard.map((entry, index) => (
                                    <tr key={index}>
                                      <td style={tableCellStyle}>{index + 1}</td>
                                      <td style={tableCellStyle}>{entry.athleteName}</td>
                                      <td style={tableCellStyle}>{entry.score}</td>
                                      <td style={tableCellStyle}>{entry.comment}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="4" style={tableCellStyle}>
                                      No leaderboard data available.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  )}

                </div>
              )}
            </div>
          </div>
        )}






        {selectedEvent2 && (
          <div
            className="modal"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "8px",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
                maxWidth: "800px",
                width: "100%",
                height: '75%',
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0px 6px 20px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.2)";
              }}
            >
              <div
                style={{
                  padding: "20px",
                  boxSizing: "border-box",
                  textAlign: "center",
                  borderBottom: "1px solid #ddd",
                  backgroundColor: '#FFD2A0',
                }}
              >
                <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0, backgroundColor: 'A888B5', }}>
                  {selectedEvent2.eventTitle}
                </h2>
                <p style={{ fontSize: "16px", fontWeight: "bold", color: "#fff", margin: "3px 0 0", backgroundColor: 'A888B5', }}>
                  {selectedEvent2.category}
                </p>
              </div>
              <br></br>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row", 
                  alignItems: "stretch",
                }}
              >
                <div
                  style={{
                    width: "50%",
                    backgroundImage: selectedEvent2.imageBase64
                      ? `url(data:image/jpeg;base64,${selectedEvent2.imageBase64})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div
                  style={{
                    width: "50%",
                    padding: "20px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p><b>Meet Name:</b> {selectedEvent2.meetName}</p>
                    <p><b>Event Description:</b> {selectedEvent2.eventDescription}</p>
                    <p><b>Event Date:</b> {formatDateForDisplayAndForm(selectedEvent2.eventDate)}</p>
                    <p><b>Location:</b> {selectedEvent2.location}</p>
                  </div>
                  <button
                    onClick={handleCloseModal1}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#007BFF",
                      color: "white",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      alignSelf: "flex-start",
                      marginTop: "20px",
                      width: '330px',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#007BFF"}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}




{currentSection === 'athleteDashboardstatistics.js' && <AthleteDashboardstatistics />}
       
        {currentSection === 'coach' && (
          <div className="transition-container">
          <div >
            <div className="centered-jump">
              <br></br>
              <br></br>
              <h2 className="text-3xl font-bold mt-8 text-center text-white">
                Coach
              </h2>
            </div>
            {assistanceRequest && assistanceRequest.status === 'Accepted' && (
              <div style={{ margin: '50px' }}>
                <div style={styles2.container}>
                  <Card className="w-full max-w-4xl mx-auto">
                    <CardContent className="flex items-center space-x-6 p-6">
                      <div className="flex-shrink-0 w-1/3">
                        <img
                          src={
                            coachDetails?.imageBase64
                              ? `data:image/jpeg;base64,${coachDetails.imageBase64}`
                              : '/default-profile.jpg'
                          }
                          alt={`${coachDetails?.firstName} ${coachDetails?.lastName}`}
                          style={styles2.coachImage}
                        />
                      </div>
                      <div className="flex-grow">
                        <Typography variant="h4" gutterBottom>
                          <div style={{ color: "blue", display: 'flex' }}>{coachDetails?.firstName} {coachDetails?.lastName}</div>
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                          Expertise: {coachDetails?.expertise || 'N/A'}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                          Email:  {coachDetails?.email || 'N/A'}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>


                  <div style={styles2.section}>
                    <h4 style={styles2.sectionTitle}>Achievements</h4>
                    {coachAchievements?.length > 0 ? (
                      coachAchievements.map((achievement, index) => (
                        <div key={index} style={styles2.achievementsBox}>
                          <h1 style={{ fontSize: '24px', fontFamily: 'cursive' }}>{achievement.title}</h1>
                          <br></br>
                          <p style={{ color: '#757575' }}>{achievement.description}</p>
                        </div>
                      ))
                    ) : (
                      <p style={styles2.emptyText}>No achievements available</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ marginRight: '10px' }}>
                      <div style={styles2.section1} >
                        <h3 style={styles2.sectionTitle} >Weight Plan</h3>
                        {coachWeightPlan ? (
                          <>

                            <p>
                              <strong>Start Weight:</strong> {coachWeightPlan.startWeight} kg
                            </p>
                            <p>
                              <strong>Target Weight:</strong> {coachWeightPlan.targetWeight} kg
                            </p>
                            <p>
                              <strong>Preference:</strong> {coachWeightPlan.preference}
                            </p>
                            <p>
                              <strong>Daily Calorie Goal:</strong> {coachWeightPlan.dailyCalorieGoal} kcal
                            </p>
                          </>
                        ) : (
                          <p style={styles2.emptyText}>No weight plan available</p>
                        )}
                      </div>
                    </div>
                    <div style={styles2.section1}>
                      <h3 style={styles2.sectionTitle}>Diet Plan</h3>
                      {coachDietPlan?.length > 0 ? (
                        <ul style={styles2.dietList}>
                          {coachDietPlan.map((diet, index) => (
                            <li key={index} style={styles2.dietItem}>
                              <p>
                                <strong>Date:</strong> {formatDateForDisplayAndForm(diet.date)}
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
                              <p>
                                <strong>Weight Plan ID:</strong> {diet.weightPlanId}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={styles2.emptyText}>No diet plan available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            )}
            {/* {assistanceRequest && assistanceRequest.status === 'Pending' && (
              <>
                <div style={styles.coachList}>
                  <div style={styles.coachCard}>
                    <img
                      src={coachDetails?.imageBase64 ? `data:image/jpeg;base64,${coachDetails?.imageBase64}` : '/default-coach.jpg'}
                      alt={`${coachDetails?.firstName} ${coachDetails?.lastName}`}
                      style={styles.coachImage}
                    />
                    <h3 style={styles.coachName}>{coachDetails?.firstName} {coachDetails?.lastName}</h3>
                    <h4>Achievements</h4>
                    {coachAchievements?.map((achievement, index) => (
                      <div key={index} style={styles.achievementsBox}>
                        <h5>{achievement.title}</h5>
                        <p>{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )} */}
        {(assistanceRequest && assistanceRequest.status === 'Pending') && (
  <div style={{ margin: '50px' }}>
  <div style={styles2.container}>
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        {/* Requested Coach Heading */}
        <div className="text-center">
        <div className="flex-grow">
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: 'blue' }}>
            Requested Coach
          </Typography>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Left Section - Image */}
          <div className="flex-shrink-0 w-1/3">
            <img
              src={
                coachDetails?.imageBase64
                  ? `data:image/jpeg;base64,${coachDetails.imageBase64}`
                  : '/default-profile.jpg'
              }
              alt={`${coachDetails?.firstName} ${coachDetails?.lastName}`}
              style={styles2.coachImage}
            />
          </div>

          {/* Right Section - Details */}
          <div className="flex-grow">
            <Typography variant="h4" gutterBottom>
              <div style={{ color: 'blue' }}>
                {coachDetails?.firstName} {coachDetails?.lastName}
              </div>
            </Typography>
            <Typography variant="h6" gutterBottom>
              Expertise: {coachDetails?.expertise || 'N/A'}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Email: {coachDetails?.email || 'N/A'}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Achievements Section */}
    <div style={styles2.section}>
      <h4 style={styles2.sectionTitle}>Achievements</h4>
      {coachAchievements?.length > 0 ? (
        coachAchievements.map((achievement, index) => (
          <div key={index} style={styles2.achievementsBox}>
            <h1 style={{ fontSize: '24px', fontFamily: 'cursive' }}>
              {achievement.title}
            </h1>
            <br />
            <p style={{ color: '#757575' }}>{achievement.description}</p>
          </div>
        ))
      ) : (
        <p style={styles2.emptyText}>No achievements available</p>
      )}
    </div>
  </div>
</div>
        )}


            {(!assistanceRequest || assistanceRequest.status === 'Rejected') && (
              <>
                <div style={styles.coachList}>
                  {coaches?.map((coach) => (
                    <div
                      key={coach.coachId}
                      style={styles.coachCard}
                      onClick={() => handleShowCoachProfile(coach.coachId)}
                    >
                      <img
                        src={coach.imageBase64 ? `data:image/jpeg;base64,${coach.imageBase64}` : '/default-coach.jpg'}
                        alt={`${coach.firstName} ${coach.lastName}`}
                        style={styles.coachImage}
                      />
                      <h3 style={styles.coachName}>{coach.firstName} {coach.lastName}</h3>
                      <button style={{ color: 'white' }} className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full text-white font-medium hover:shadow-lg transition transform hover:scale-105"
                      >View Profile</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {showModal && (
              <div style={styles.modal}>
                <div style={styles.modalContent}>
                  <button
                    style={styles.closeButton}
                    onClick={() => setShowModal(false)}
                    onMouseOver={(e) => e.target.style.color = styles.closeButtonHover.color}
                    onMouseOut={(e) => e.target.style.color = styles.closeButton.color}
                  >
                    ✕
                  </button>
                  <strong><h1 style={{ fontSize: '30px' }}>{coachDetails?.firstName} {coachDetails?.lastName}</h1></strong>
                  <div style={{ marginLeft: '25%' }}>
                    <img
                      src={coachDetails?.imageBase64 ? `data:image/jpeg;base64,${coachDetails?.imageBase64}` : '/default-coach.jpg'}
                      alt={`${coachDetails?.firstName} ${coachDetails?.lastName}`}
                      style={styles.coachImage}
                    />
                  </div>
                  <h1 style={{ fontSize: '20px', color: 'rgb(56, 56, 122)', textAlign: 'left' }}>Achievements</h1>
                  {coachAchievements?.map((achievement, index) => (
                    <div key={index} style={styles.achievementsBox}>
                      <h5 style={{ textAlign: 'center', color: 'black', fontFamily: 'cursive', fontSize: '20px' }}>{achievement.title}</h5>
                      <p style={{ color: 'rgb(52, 50, 50)' }}>{achievement.description}</p>
                    </div>
                  ))}
                  <h1 style={{ fontSize: '20px', color: 'rgb(56, 56, 122)', textAlign: 'left' }}>Request Assistance</h1>
                  <textarea
                    style={styles.remarkTextarea}
                    placeholder="Enter remarks..."
                    value={remarks2}
                    onChange={(e) => setRemarks2(e.target.value)}
                  ></textarea>
                  <button
                    style={{ color: 'white' }} className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full text-white font-medium hover:shadow-lg transition transform hover:scale-105"
                    onClick={() => handleRequestAssistance(coachDetails.coachId)}
                  >
                    Request Assistance
                  </button>
                </div>
              </div>
            )}


          </div>
          </div>
        )}
      </div>
    </div>
  );

}

const dashboardStyles = {
  padding: "20px",
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

const buttonStyles = {
  display: "block",
  margin: "10px auto",
  padding: "10px 20px",
  backgroundColor: "#007BFF",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
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


const styles2 = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    margin: '20px',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '10px'
  },
  coachCard: {
    width: '100%',
    maxWidth: '800px',
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
  section: {
    marginTop: '20px',
    textAlign: 'left',
    display: 'flex-end',
    width: '48%',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'rgb(2, 0, 97)',
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

  achievementDescription: {
    fontSize: '14px',
    color: 'grey',
  },
  emptyText: {
    fontSize: '14px',
    color: '#999',
    fontStyle: 'italic',
  },
  dietList: {
    listStyleType: 'none',
    padding: '0',
  },
  dietItem: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  },
};
const tableHeaderStyle = {
  padding: "10px",
  backgroundColor: "#007BFF",
  color: "white",
  textAlign: "left",
  fontWeight: "bold",
};

const tableCellStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};




export default AthleteDashboard;