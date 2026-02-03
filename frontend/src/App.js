import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // must match path exactly
import Events from "./pages/Events";
import Clubs from "./pages/Clubs";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AdminCreateEvent from "./pages/AdminCreateEvent";
import EventPage from "./pages/Events";
import EventRegisterPage from "./pages/EventRegisterPage";
import ClubJoinPage from "./pages/ClubJoinPage";
import ClubsPage from "./pages/Clubs";
import Account from "./pages/Account"
import HomePage from "./pages/HomePage";
import ClubDetails from "./pages/ClubDetails"; // import the details page
import EventDetails from "./pages/EventDetails";
import { useLocation } from "react-router-dom";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* <-- navbar here */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Register />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/admin/create-event" element={<AdminCreateEvent />} />
        <Route path="/permissions" element={<div><h2>Permissions Page</h2></div>} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/clubs/join/:id" element={<ClubJoinPageWrapper />} />
        <Route path="/clubs/:clubId" element={<ClubDetails />} /> {/* dynamic route */}
        <Route path="/account" element={<Account />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/events/:eventId" element={<EventDetails />} /> {/* dynamic */}
        <Route path="/events/:eventId/register" element={<EventRegisterPage />} />
        <Route path="/about" element={<About />} /> {/* About Us page */}
        <Route path="/contact" element={<Contact />} /> {/* Contact Us page */}
      </Routes>
    </BrowserRouter>
  );
}


function ClubJoinPageWrapper() {
  const location = useLocation();
  const clubName = location.state?.clubName || "Club";
  return <ClubJoinPage clubName={clubName} />;
}

export default App;
