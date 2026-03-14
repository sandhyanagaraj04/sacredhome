import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Landing from './pages/Landing';
import Guide from './pages/Guide';
import Practice from './pages/Practice';
import Course from './pages/Course';

function App() {
  return (
    <Router>
      <nav className="nav">
        <div className="nav-inner">
          <NavLink to="/" className="nav-logo">
            <span>🏛️</span> Sacred Home
          </NavLink>
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/guide" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Guide
            </NavLink>
            <NavLink to="/practice" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Practice
            </NavLink>
            <NavLink to="/course" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Course
            </NavLink>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/course" element={<Course />} />
      </Routes>
    </Router>
  );
}

export default App;
