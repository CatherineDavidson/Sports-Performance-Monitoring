// import React, { useState, useEffect } from "react";
// import {
//   ChevronDown,
//   Calendar,
//   Activity,
//   Dumbbell,
//   Users,
//   ClipboardCheck,
//   Trophy,
//   Heart,
// } from "lucide-react";
// import Login from "./Login"; // Ensure the path is correct
// import Register from "./Register"; // Ensure the path is correct

// const HomePage = () => {
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const [activeForm, setActiveForm] = useState(null); // State to track active form
//   const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrollPosition(window.scrollY);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const openModal = (formType) => {
//     setActiveForm(formType);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="w-full overflow-hidden relative">
//       {/* Hero Section */}
//       <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 to-black">
//         <div className="absolute inset-0 overflow-hidden">
//           <svg
//             className="absolute animate-spin-slow opacity-10"
//             viewBox="0 0 100 100"
//             width="1000"
//             height="1000"
//           >
//             <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="0.5" fill="none" />
//             <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="0.5" fill="none" />
//             <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="0.5" fill="none" />
//           </svg>
//         </div>
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />

//         <div className="relative z-10 text-center text-white">
//           <h1 className="text-6xl font-bold mb-6 animate-fade-in">Sports Performance Monitor</h1>
//           <p className="text-xl mb-12 animate-slide-up">
//             Elevate Your Game. Track Your Progress. Achieve Excellence.
//           </p>
//           <div className="space-x-6 animate-fade-in-up">
//             <button
//               className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition-all transform hover:scale-105"
//               onClick={() => openModal("login")}
//             >
//               Login
//             </button>
//             <button
//               className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white px-8 py-3 rounded-full transition-all transform hover:scale-105"
//               onClick={() => openModal("register")}
//             >
//               Register
//             </button>
//           </div>
//         </div>
//         <ChevronDown className="absolute bottom-8 text-white animate-bounce w-8 h-8" />
//       </section>

//       {/* Modal Implementation */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
//             <button
//               className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
//               onClick={closeModal}
//             >
//               ✕
//             </button>
//             {activeForm === "login" && <Login />}
//             {activeForm === "register" && <Register />}
//           </div>
//         </div>
//       )}

//       {/* Features Section */}
//       <section className="py-20 bg-gradient-to-b from-black to-blue-900">
//         <div className="container mx-auto px-4">
//           <div className="grid gap-16">
//             {/* Feature 1 */}
//             <div
//               className="flex items-center gap-12"
//               style={{
//                 opacity: Math.min(1, (scrollPosition - 300) / 400),
//                 transform: `translateX(${Math.max(0, 100 - (scrollPosition - 300) / 4)}px)`,
//               }}
//             >
//               <div className="w-1/2">
//                 <Calendar className="w-16 h-16 text-blue-400 mb-4" />
//                 <h2 className="text-3xl font-bold text-white mb-4">Event Management</h2>
//                 <p className="text-gray-300">
//                   Create, manage, and track sporting events with ease. Our comprehensive event
//                   management system helps administrators organize competitions efficiently.
//                 </p>
//               </div>
//               <div className="w-1/2 h-64 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg shadow-xl transform hover:scale-105 transition-transform" />
//             </div>

//             {/* Feature 2 */}
//             <div
//               className="flex items-center gap-12"
//               style={{
//                 opacity: Math.min(1, (scrollPosition - 600) / 400),
//                 transform: `translateX(${Math.min(0, -100 + (scrollPosition - 600) / 4)}px)`,
//               }}
//             >
//               <div className="w-1/2 h-64 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg shadow-xl transform hover:scale-105 transition-transform" />
//               <div className="w-1/2">
//                 <Activity className="w-16 h-16 text-purple-400 mb-4" />
//                 <h2 className="text-3xl font-bold text-white mb-4">Performance Tracking</h2>
//                 <p className="text-gray-300">
//                   Monitor athlete progress with advanced analytics. Track performance metrics, set
//                   goals, and visualize improvements over time.
//                 </p>
//               </div>
//             </div>

//             {/* Feature 3 */}
//             <div
//               className="flex items-center gap-12"
//               style={{
//                 opacity: Math.min(1, (scrollPosition - 900) / 400),
//                 transform: `translateX(${Math.max(0, 100 - (scrollPosition - 900) / 4)}px)`,
//               }}
//             >
//               <div className="w-1/2">
//                 <Dumbbell className="w-16 h-16 text-green-400 mb-4" />
//                 <h2 className="text-3xl font-bold text-white mb-4">Training Programs</h2>
//                 <p className="text-gray-300">
//                   Customized training and diet plans created by professional coaches. Get
//                   personalized workout routines and nutrition guidance.
//                 </p>
//               </div>
//               <div className="w-1/2 h-64 bg-gradient-to-r from-green-600 to-green-400 rounded-lg shadow-xl transform hover:scale-105 transition-transform" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Roles Section */}
//       <section className="py-20 bg-gradient-to-b from-blue-900 to-black">
//         <div className="container mx-auto px-4">
//           <h2 className="text-4xl font-bold text-center text-white mb-16">Who It's For</h2>
//           <div className="grid grid-cols-3 gap-8">
//             {/* Admin Card */}
//             <div className="bg-gradient-to-br from-blue-800 to-blue-600 p-8 rounded-xl text-white transform hover:scale-105 transition-all">
//               <Users className="w-12 h-12 mb-4" />
//               <h3 className="text-2xl font-bold mb-4">Administrators</h3>
//               <ul className="space-y-2 text-blue-100">
//                 <li>Create and manage events</li>
//                 <li>Monitor registrations</li>
//                 <li>Publish results</li>
//                 <li>Oversee system operations</li>
//               </ul>
//             </div>

//             {/* Coach Card */}
//             <div className="bg-gradient-to-br from-purple-800 to-purple-600 p-8 rounded-xl text-white transform hover:scale-105 transition-all">
//               <ClipboardCheck className="w-12 h-12 mb-4" />
//               <h3 className="text-2xl font-bold mb-4">Coaches</h3>
//               <ul className="space-y-2 text-purple-100">
//                 <li>Track athlete progress</li>
//                 <li>Create training plans</li>
//                 <li>Provide feedback</li>
//                 <li>Monitor performance metrics</li>
//               </ul>
//             </div>

//             {/* Athlete Card */}
//             <div className="bg-gradient-to-br from-green-800 to-green-600 p-8 rounded-xl text-white transform hover:scale-105 transition-all">
//               <Trophy className="w-12 h-12 mb-4" />
//               <h3 className="text-2xl font-bold mb-4">Athletes</h3>
//               <ul className="space-y-2 text-green-100">
//                 <li>Register for events</li>
//                 <li>View performance stats</li>
//                 <li>Access training plans</li>
//                 <li>Track achievements</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>

    //   {/* Developer Section */}
    //   <section className="py-20 bg-black text-white">
    //     <div className="container mx-auto px-4">
    //       <h2 className="text-4xl font-bold text-center mb-16">Our Team</h2>
    //       <div className="grid grid-cols-3 gap-8">
    //         {[1, 2, 3].map((dev) => (
    //           <div key={dev} className="text-center">
    //             <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
    //               <Heart className="w-12 h-12" />
    //             </div>
    //             <h3 className="text-xl font-bold mb-2">Developer {dev}</h3>
    //             <p className="text-gray-400">Full Stack Developer</p>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </section>

    //   {/* Footer */}
    //   <footer className="py-8 bg-blue-900 text-white text-center">
    //     <p>&copy; 2024 Sports Performance Monitor. All rights reserved.</p>
    //   </footer>
//     </div>
//   );
// };

// export default HomePage;
import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Calendar,
  Activity,
  Dumbbell,
  Users,
  ClipboardCheck,
  Trophy,
  Heart,
} from "lucide-react";
import Login from "./Login"; // Ensure the path is correct
import Register from "./Register"; // Ensure the path is correct

const HomePage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeForm, setActiveForm] = useState(null); // State to track active form
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = (formType) => {
    setActiveForm(formType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full overflow-hidden relative">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 to-black">
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute animate-spin-slow opacity-10"
            viewBox="0 0 100 100"
            width="1000"
            height="1000"
          >
            <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />

        <div className="relative z-10 text-center text-white">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">Sports Performance Monitor</h1>
          <p className="text-xl mb-12 animate-slide-up">
            Elevate Your Game. Track Your Progress. Achieve Excellence.
          </p>
          <div className="space-x-6 animate-fade-in-up">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition-all transform hover:scale-105"
              onClick={() => openModal("login")}
            >
              Login
            </button>
            <button
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white px-8 py-3 rounded-full transition-all transform hover:scale-105"
              onClick={() => openModal("register")}
            >
              Register
            </button>
          </div>
        </div>
        <ChevronDown className="absolute bottom-8 text-white animate-bounce w-8 h-8" />
      </section>

      {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative bg-transparent rounded-lg shadow-lg w-full max-w-md p-6">
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        onClick={closeModal}
      >
        ✕
      </button>
      {activeForm === "login" && <Login />}
      {activeForm === "register" && <Register />}
    </div>
  </div>
)}
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-blue-900">
        <div className="container mx-auto px-4">
          <div className="grid gap-16">
            {/* Feature 1 */}
            <div
              className="flex items-center gap-12"
              style={{
                opacity: Math.min(1, (scrollPosition - 300) / 400),
                transform: `translateX(${Math.max(0, 100 - (scrollPosition - 300) / 4)}px)`,
              }}
            >
              <div className="w-1/2">
                <Calendar className="w-16 h-16 text-blue-400 mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">Event Management</h2>
                <p className="text-gray-300">
                  Create, manage, and track sporting events with ease. Our comprehensive event
                  management system helps administrators organize competitions efficiently.
                </p>
              </div>
              <div className="w-1/2 h-64 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg shadow-xl transform hover:scale-105 transition-transform" />
            </div>

            {/* Feature 2 */}
            <div
              className="flex items-center gap-12"
              style={{
                opacity: Math.min(1, (scrollPosition - 600) / 400),
                transform: `translateX(${Math.min(0, -100 + (scrollPosition - 600) / 4)}px)`,
              }}
            >
              <div className="w-1/2 h-64 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg shadow-xl transform hover:scale-105 transition-transform" />
              <div className="w-1/2">
                <Activity className="w-16 h-16 text-purple-400 mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">Performance Tracking</h2>
                <p className="text-gray-300">
                  Monitor athlete progress with advanced analytics. Track performance metrics, set
                  goals, and visualize improvements over time.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div
              className="flex items-center gap-12"
              style={{
                opacity: Math.min(1, (scrollPosition - 900) / 400),
                transform: `translateX(${Math.max(0, 100 - (scrollPosition - 900) / 4)}px)`,
              }}
            >
              <div className="w-1/2">
                <Dumbbell className="w-16 h-16 text-green-400 mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">Training Programs</h2>
                <p className="text-gray-300">
                  Customized training and diet plans created by professional coaches. Get
                  personalized workout routines and nutrition guidance.
                </p>
              </div>
              <div className="w-1/2 h-64 bg-gradient-to-r from-green-600 to-green-400 rounded-lg shadow-xl transform hover:scale-105 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-gradient-to-b from-blue-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Who It's For</h2>
          <div className="grid grid-cols-3 gap-8">
            {/* Admin Card */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-600 p-8 rounded-xl text-white transform hover:scale-105 transition-all">
              <Users className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Administrators</h3>
              <ul className="space-y-2 text-blue-100">
                <li>Create and manage events</li>
                <li>Monitor registrations</li>
                <li>Publish results</li>
                <li>Oversee system operations</li>
              </ul>
            </div>

            {/* Coach Card */}
            <div className="bg-gradient-to-br from-purple-800 to-purple-600 p-8 rounded-xl text-white transform hover:scale-105 transition-all">
              <ClipboardCheck className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Coaches</h3>
              <ul className="space-y-2 text-purple-100">
                <li>Track athlete progress</li>
                <li>Create training plans</li>
                <li>Provide feedback</li>
                <li>Monitor performance metrics</li>
              </ul>
            </div>

            {/* Athlete Card */}
            <div className="bg-gradient-to-br from-green-800 to-green-600 p-8 rounded-xl text-white transform hover:scale-105 transition-all">
              <Trophy className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Athletes</h3>
              <ul className="space-y-2 text-green-100">
                <li>Track performance metrics</li>
                <li>Receive personalized training</li>
                <li>Register for events</li>
                <li>Improve fitness with tailored programs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
       {/* Developer Section */}
       <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Team</h2>
          <div className="grid grid-cols-3 gap-8">
            {[1, 2, 3].map((dev) => (
              <div key={dev} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Heart className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">Developer {dev}</h3>
                <p className="text-gray-400">Full Stack Developer</p>
              </div>
            ))}
          
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-blue-900 text-white text-center">
        <p>&copy; 2024 Sports Performance Monitor. All rights reserved.</p>
      </footer>

      {/* Developer Section */}
      
    </div>
  );
};

export default HomePage;
