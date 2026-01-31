import React from "react";
import Container from "../../container/container.jsx"; // Assuming path is correct
import Logo from "../Logo";
import { Link, NavLink } from "react-router-dom"; // Import NavLink
import LogoutBtn from "./LogoutBtn.jsx";
import { useSelector } from "react-redux";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  return (
    <header className="py-3 shadow-md bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <Logo width="70px" />
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="flex items-center ml-auto gap-x-2 sm:gap-x-4">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <NavLink
                    to={item.slug}
                    className={({ isActive }) =>
                      `inline-block px-3 py-2 sm:px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white" // Active link style
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" // Inactive link style
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ) : null
            )}

            {/* Logout Button */}
            {authStatus && (
              <li className="ml-2">
                {/* Added margin for spacing */}
                <LogoutBtn />
              </li>
            )}

            {/* Theme Toggle Button */}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
