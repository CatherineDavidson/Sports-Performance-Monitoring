// // src/App.js
// import React,{useState,useEffect} from "react";
// import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import AdminDashboard from "./components/AdminDashboard";
// import AthleteDashboard from "./components/AthleteDashboard";
// import CoachDashboard from "./components/CoachDashboard";
// import HomePage from "./components/Home";
// import ProtectedRoute from "./components/protectedroute";
// const App = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);

//     useEffect(() => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         setIsAuthenticated(true);
//       }
//     }, []);
//     return (
//         <Router>
           
//             <Routes>
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//                 {/* <Route path="/adminDashboard" element={<AdminDashboard />} />
//                 <Route path="/athleteDashboard" element={<AthleteDashboard />} />
//                 <Route path="/coachDashboard" element={<CoachDashboard />} /> */}
//                 <Route
//           path="/athletedashboard"
//           element={
//             <ProtectedRoute
//               element={AthleteDashboard}
//               allowedRole="ATHLETE"
//             />
//           }
//         />
//         <Route
//           path="/admindashboard"
//           element={
//             <ProtectedRoute
//               element={AdminDashboard}
//               allowedRole="ADMIN"
//             />
//           }
//         />
//         <Route
//           path="/coachdashboard"
//           element={
//             <ProtectedRoute
//               element={CoachDashboard}
//               allowedRole="COACH"
//             />
//           }
//         />
//                 <Route path="*" element={<HomePage />} />
//             </Routes>
//                     </Router>
//     );
// };

// export default App;


import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import AthleteDashboard from "./components/AthleteDashboard";
import CoachDashboard from "./components/CoachDashboard";
import HomePage from "./components/Home";
import ProtectedRoute from "./components/protectedroute"; // Import ProtectedRoute

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Use ProtectedRoute inside Route component */}
        <Route
          path="/athletedashboard"
          element={
            <ProtectedRoute
              element={AthleteDashboard}
              allowedRole="ATHLETE"
            />
          }
        />
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute
              element={AdminDashboard}
              allowedRole="ADMIN"
            />
          }
        />
        <Route
          path="/coachdashboard"
          element={
            <ProtectedRoute
              element={CoachDashboard}
              allowedRole="COACH"
            />
          }
        />

        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;