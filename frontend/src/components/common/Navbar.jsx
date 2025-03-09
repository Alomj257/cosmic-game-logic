import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Avatar, Dropdown, Menu } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Hide Navbar if user is not logged in
    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Dropdown menu for profile & logout
    const menu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-lg">
            {/* Logo */}
            <div className="text-2xl font-bold">
                <Link to="/">CGL</Link>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-6 text-lg">
                <Link to="/read" className="hover:text-gray-400">Read</Link>
                {user.userType === "ADMIN" && (
                    <Link to="/write" className="hover:text-gray-400">Write</Link>
                )}
                <Link to="/about" className="hover:text-gray-400">About</Link>
                <Link to="/contact" className="hover:text-gray-400">Contact Us</Link>
            </div>

            {/* Profile & Logout */}
            <Dropdown overlay={menu} placement="bottomRight">
                <Avatar className="cursor-pointer bg-blue-500">{user.firstName[0]}</Avatar>
            </Dropdown>
        </nav>
    );
};

export default Navbar;
