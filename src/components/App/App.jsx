import { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate
} from "react-router-dom";

import useStore from '../../zustand/store';
import Nav from '../Nav/Nav';
import StudentHomePage from '../StudentHomePage/StudentHomePage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import EventsPage from '../EventsPage/EventsPage';
import SuccessPage from '../../SuccessPage/SuccessPage';
import UpdateEvent from '../UpdateEvent/UpdateEvent';
import AdminHome from '../AdminHome.jsx/AdminHome';
import SuperAdminHome from '../SuperAdminHome.jsx/SuperAdminHome';


function App() {
  const user = useStore((state) => state.user);
  const fetchUser = useStore((state) => state.fetchUser);
  const logOut = useStore((state) => state.logOut);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);



  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">LMR</h1>
          <Nav />
          <nav className="main-nav">
            {/* <Link to="/about" className="nav-link">Abou</Link> */}
            {user?.id ? (
              <button
                className="nav-link logout-button"
                onClick={async () => {
                  await logOut();
                  navigate('/logout-success');
                }}
              >
                Logout
              </button>

            ) : (

              <>
                {/* <Link to="/login" className="nav-link">Login</Link>
                <Link to="/registration" className="nav-link">Register</Link> */}
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            exact path="/"
            element={
              user.id ? (
                <StudentHomePage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            exact path="/adminHome"
            element={
              user.id ? (
                <AdminHome />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            exact path="/superAdminHome"
            element={
              user.id ? (
                <SuperAdminHome />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            exact path="/login"
            element={
              user.id ? (
                <Navigate to="/login-success" replace />
              ) : (
                <LoginPage />
              )
            }
          />

          <Route
            exact path="/login-success"
            element={
              <SuccessPage
                message="Successfully logged in!"
                redirectTo="/"
                delay={1500}
              />
            }
          />

          <Route
            exact path="/logout-success"
            element={
              <SuccessPage
                message="Successfully logged out!"
                redirectTo="/login"
                delay={1500}
              />
            }
          />

          <Route
            exact path="/registration"
            element={
              user.id ? (
                <Navigate to="/login-success" replace />
              ) : (
                <RegisterPage />
              )
            }
          />

          <Route
            exact path="/about"
            element={
              <div className="about-container">
                <h2 className="about-title">About Page</h2>


                <p className="about-quote">

                  The technologies We used were React, Node.js, Express, Tailwind CSS and PostgreSQL to build this app.
                </p>

                {user?.id && (
                  <Link to="/events" className="back-to-Events-button">
                    Back to Events Page
                  </Link>
                )}
              </div>
            }
          />

          <Route
            exact
            path="/events"
            element={
              user.id ? (
                <EventsPage />// Render HomePage for authenticated user.
              ) : (
                <Navigate to="/" replace /> // Redirect unauthenticated user.
              )
            }
          />

<Route path="/studentHomePage" element={<StudentHomePage />} />
<Route path="/updateEvent/:eventId/:eventTitle" element={<UpdateEvent />} />


          <Route
            path="*"
            element={
              <h2 className="error-page">404 Page</h2>
            }
          />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>Copyright © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;



//   return (
//     <>
//       <header>
//         <h1>Prime Group Project</h1>
//         <Nav />
//       </header>
//       <main>
//         <Routes>
//           <Route
//             exact
//             path="/"
//             element={
//               user.id ? (
//                 <HomePage /> // Render HomePage for authenticated user.
//               ) : (
//                 <Navigate to="/login" replace /> // Redirect unauthenticated user.
//               )
//             }
//           />
//           <Route
//             exact
//             path="/login"
//             element={
//               user.id ? (
//                 <Navigate to="/" replace /> // Redirect authenticated user.
//               ) : (
//                 <LoginPage /> // Render LoginPage for unauthenticated user.
//               )
//             }
//           />
//           <Route
//             exact
//             path="/registration"
//             element={
//               user.id ? (
//                 <Navigate to="/" replace /> // Redirect authenticated user.
//               ) : (
//                 <RegisterPage /> // Render RegisterPage for unauthenticated user.
//               )
//             }
//           />
//           <Route path="/events" element={<EventsPage />} />
//           <Route
//             exact
//             path="/about"
//             element={
//               <>
//                 <h2>About Page</h2>
//                 <p>
//                   Intelligence doesn’t seem like an aspect of personal
//                   character, and it isn’t. Coincidentally, great intelligence is
//                   only loosely connected to being a good programmer.
//                 </p>
//                 <p>What? You don’t have to be superintelligent?</p>
//                 <p>
//                   No, you don’t. Nobody is really smart enough to program
//                   computers. Fully understanding an average program requires an
//                   almost limitless capacity to absorb details and an equal
//                   capacity to comprehend them all at the same time. The way you
//                   focus your intelligence is more important than how much
//                   intelligence you have…
//                 </p>
//                 <p>
//                   …most of programming is an attempt to compensate for the
//                   strictly limited size of our skulls. The people who are the
//                   best programmers are the people who realize how small their
//                   brains are. They are humble. The people who are the worst at
//                   programming are the people who refuse to accept the fact that
//                   their brains aren’t equal to the task. Their egos keep them
//                   from being great programmers. The more you learn to compensate
//                   for your small brain, the better a programmer you’ll be.
//                   <span className="squiggle">
//                     {" "}
//                     The more humble you are, the faster you’ll improve.
//                   </span>
//                 </p>
//                 <p>
//                   --From Steve McConnell's <em>Code Complete</em>.
//                 </p>
//               </>
//             }
//           />
//           <Route
//             exact
//             path="/events"
//             element={
//               user.id ? (
//                 <EventsPage to="/events" />// Render HomePage for authenticated user.
//               ) : (
//                 <Navigate to="/" replace /> // Redirect unauthenticated user.
//               )
//             }
//           />
//           <Route path="*" element={<h2>404 Page</h2>} />
//         </Routes>
//       </main>
//       <footer>
//         <p>Copyright © {new Date().getFullYear()}</p>
//       </footer>
//     </>
//   );
// }


// export default App;
