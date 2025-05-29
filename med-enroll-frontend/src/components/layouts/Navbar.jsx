import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import brandIcon from "../../assets/brand.svg";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const debounceTimeout = useRef(null);
  const fullName = "John Doe"; // Replace this with actual user name
  const imageUrl = `https://robohash.org/${encodeURIComponent(
    fullName
  )}?size=150x150`;

  const getLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? "text-[var(--color-brand)] font-semibold" : ""}`;

  const toggleDropdown = () => {
    const newState = !dropdownOpen;
    setDropdownOpen(newState);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (newState) {
      debounceTimeout.current = setTimeout(() => {
        setDropdownOpen(false);
      }, 3000);
    }
  };
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <nav
      className="shadow-sm"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="nav-brand flex items-center gap-2"
          >
            <img src={brandIcon} alt="MedEnroll Logo" className="w-6 h-6" />
            <span>MedEnroll</span>
          </NavLink>

          <div className="flex space-x-6 items-center relative">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={getLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/register-customer" className={getLinkClass}>
                  Add
                </NavLink>
                <NavLink to="/customers" className={getLinkClass}>
                  Customers
                </NavLink>

                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Profile"
                    onClick={toggleDropdown}
                    className="w-8 h-8 rounded-full border-2 border-[var(--color-brand)] cursor-pointer"
                  />

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-md z-10">
                      <span
                        onClick={() => {
                          logout();
                          closeDropdown();
                        }}
                        className="block px-4 py-2 text-sm hover:text-[var(--color-hover)] cursor-pointer"
                      >
                        Logout
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className={getLinkClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className={getLinkClass}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
