import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EducationScreen from './pages/EducationScreen';
import LocationScreen from './pages/LocationScreen';
import SubjectsScreen from './pages/SubjectsScreen';
import SearchResultsScreen from './pages/SearchResultsScreen';
import ProfessorProfileScreen from './pages/professor/ProfessorProfileScreen';
import LoginScreen from './pages/LoginScreen'; // dodaj
import MyProfile from './pages/MyProfile';
import AuthChoice from './pages/AuthChoice'; // ako si stavila u pages/
import EditProfile from './pages/EditProfile';
import AddAvailability from './pages/AddAvailability';
import CalendarView from './pages/CalendarView';
import Register from './pages/Register'; 
import SelectMode from './pages/SelectMode';
import RateProfessor from './pages/RateProfessor';
import CancelLesson from './pages/cancel/[id]';
import Privatnost from './pages/Privatnost';
import Uslovi from './pages/Uslovi';
import Kontakt from './pages/Kontakt';
import Footer from './components/Footer';




function App() {
  const navigate = useNavigate();

  return (
 <div className="app-content">
    <Routes>
      <Route path="/" element={<HomePage navigate={navigate} />} />
      <Route path="/education" element={<EducationScreen navigate={navigate} />} />
      <Route path="/location" element={<LocationScreen navigate={navigate} />} />
      <Route path="/subjects" element={<SubjectsScreen />} />
      <Route path="/search-results" element={<SearchResultsScreen />} />
      <Route path="/professor/:id" element={<ProfessorProfileScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/auth-choice" element={<AuthChoice />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/add-availability" element={<AddAvailability />} />
      <Route path="/calendar-view" element={<CalendarView />} />
      <Route path="/register" element={<Register />} />
      <Route path="/mode" element={<SelectMode />} />
      <Route path="/rate/:rezervacijaId" element={<RateProfessor />} />
      <Route path="/cancel/:id" element={<CancelLesson />} />
      <Route path="/privatnost" element={<Privatnost />} />
<Route path="/uslovi" element={<Uslovi />} />
<Route path="/kontakt" element={<Kontakt />} />

   
    </Routes>
        <Footer />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
