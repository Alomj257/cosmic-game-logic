import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Avatar, Dropdown, Menu, Drawer } from "antd";
import { LogoutOutlined, UserOutlined, MailOutlined, PhoneOutlined, FlagOutlined, CalendarOutlined } from "@ant-design/icons";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [openDrawer, setOpenDrawer] = useState(false);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => setOpenDrawer(true)}>
                Profile
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 px-6 flex justify-between items-center shadow-lg">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <Link to="/" className="hover:text-gray-300 transition">CGL</Link>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex space-x-6 text-lg">
                    <Link to="/read" className="hover:text-gray-300 transition">Read</Link>
                    {user.userType === "ADMIN" && (
                        <Link to="/write" className="hover:text-gray-300 transition">Write</Link>
                    )}
                    <Link to="/about" className="hover:text-gray-300 transition">About</Link>
                    <Link to="/contact" className="hover:text-gray-300 transition">Contact Us</Link>
                </div>

                {/* Profile Avatar with Dropdown */}
                <Dropdown overlay={menu} placement="bottomRight">
                    <Avatar className="cursor-pointer bg-blue-600 border-2 border-white shadow-md">
                        {user.firstName[0]}
                    </Avatar>
                </Dropdown>
            </nav>

            {/* Profile Drawer */}
            <Drawer 
                title={
                    <div className="flex items-center space-x-3">
                        <Avatar size={64} className="bg-blue-500 text-white text-xl">
                            {user.firstName[0]}
                        </Avatar>
                        <div>
                            <h2 className="text-lg font-semibold">{user.firstName} {user.lastName}</h2>
                            <p className="text-gray-500">{user.userType}</p>
                        </div>
                    </div>
                }
                placement="right"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
                width={380}
                className="custom-drawer"
            >
                <div className="p-4 space-y-4 text-gray-700">
                    <p className="flex items-center space-x-2">
                        <MailOutlined className="text-blue-500 text-lg" />
                        <span className="font-medium">{user.email}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                        <PhoneOutlined className="text-green-500 text-lg" />
                        <span>{user.phone}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                        <FlagOutlined className="text-red-500 text-lg" />
                        <span>{user.country}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                        <CalendarOutlined className="text-gray-500 text-lg" />
                        <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                    </p>
                </div>
            </Drawer>
        </>
    );
};

export default Navbar;
