import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSignOutAlt, FaPlus, FaBars, FaTimes, FaHome, FaInfoCircle,
  FaUserShield, FaStethoscope, FaHospitalUser, FaCalendarCheck,
  FaBookMedical, FaAddressBook, FaSignInAlt, FaUserCog, FaUserCircle, FaUser, FaUserMd, FaFileMedical, FaHistory,
  FaCalendarAlt, FaChartBar
} from 'react-icons/fa';
import styles from './Header.module.css';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderNavLinks = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <>
            <li><Link to="/home" onClick={closeMobileMenu}><FaHome className={styles.icon} />Home</Link></li>
            <li className={styles.userMenu} ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={styles.userIconBtn}>
                <FaUserCircle size={28} />
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={() => navigate('/admin/dashboard')} className={styles.dropdownItem}>
                    <FaUserShield className={styles.dropdownIcon} /> Dashboard
                  </button>
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    <FaSignOutAlt className={styles.dropdownIcon} /> Logout
                  </button>
                </div>
              )}
            </li>
          </>
        );

      case 'doctor':
        return (
          <>
            <li><Link to="/doctor/dashboard" onClick={closeMobileMenu}><FaStethoscope className={styles.icon} />Queue Dashboard</Link></li>
            <li><Link to="/doctor/schedule-consultation" onClick={closeMobileMenu}><FaCalendarAlt className={styles.icon} />Availability Management</Link></li>
            <li><Link to="/doctor/feedback" onClick={closeMobileMenu}><FaChartBar className={styles.icon} />Performance Reviews</Link></li>

            <li className={styles.userMenu} ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={styles.userIconBtn}>
                <FaUserCircle size={28} />
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={() => navigate('/doctor/dashboard')} className={styles.dropdownItem}>
                    <FaUser className={styles.dropdownIcon} /> Profile
                  </button>
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    <FaSignOutAlt className={styles.dropdownIcon} /> Logout
                  </button>
                </div>
              )}
            </li>
          </>
        );

      case 'user':
        return (
          <>
            <li><Link to="/view-booking" onClick={closeMobileMenu}><FaCalendarCheck className={styles.icon} />My Appointments</Link></li>
            <li><Link to="/my-prescriptions" onClick={closeMobileMenu}><FaFileMedical className={styles.icon} />My Prescriptions</Link></li>
            <li><Link to="/medical-records" onClick={closeMobileMenu}><FaHistory className={styles.icon} />Medical History</Link></li>
            <li><Link to="/contact" onClick={closeMobileMenu}><FaAddressBook className={styles.icon} />Contact</Link></li>
            <li className={styles.userMenu} ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={styles.userIconBtn}>
                <FaUserCircle size={28} />
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={() => navigate('/user-profile')} className={styles.dropdownItem}>
                    <FaUser className={styles.dropdownIcon} /> Profile
                  </button>
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    <FaSignOutAlt className={styles.dropdownIcon} /> Logout
                  </button>
                </div>
              )}
            </li>
          </>
        );

      default:
        return (
          <>
            <li><Link to="/" onClick={closeMobileMenu}><FaHome className={styles.icon} />Home</Link></li>
            <li><Link to="/about" onClick={closeMobileMenu}><FaInfoCircle className={styles.icon} />About</Link></li>
            <li><Link to="/doctors" onClick={closeMobileMenu}><FaStethoscope className={styles.icon} />Doctors</Link></li>
            <li><Link to="/contact" onClick={closeMobileMenu}><FaAddressBook className={styles.icon} />Contact</Link></li>
            <li><Link to="/login" className={styles.loginButton} onClick={closeMobileMenu}><FaSignInAlt /> Login</Link></li>
          </>
        );
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.logo}><Link to="/">KL Hospital</Link></div>
        <button className={styles.hamburger} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <ul className={`${styles.navbarNav} ${isMobileMenuOpen ? styles.open : ''}`}>
          {renderNavLinks()}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
