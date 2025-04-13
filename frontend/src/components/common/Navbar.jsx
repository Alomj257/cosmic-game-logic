import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Avatar, Dropdown, Menu } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import DrawerComponent from "../../utils/DrawerComponent";

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
            <nav className="bg-gradient-to-b from-yellow-700 via-brown-500 to-black text-white py-4 px-6 flex justify-between items-center shadow-md">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <Link to="/" className="hover:text-gray-300 transition">CGL</Link>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex space-x-6 text-lg">
                    <Link to="/read" className="hover:text-gray-300 transition">Read</Link>
                    {user.userType === "ADMIN" && (
                        <Link to="/admin/write" className="hover:text-gray-300 transition">Write</Link>
                    )}
                    <Link to="/about" className="hover:text-gray-300 transition">About</Link>
                    <Link to="/contact" className="hover:text-gray-300 transition">Contact Us</Link>
                </div>

                {/* Profile Avatar with Dropdown */}
                <Dropdown overlay={menu} placement="bottomRight">
                    <Avatar className="cursor-pointer bg-brown-500 border-2 border-white shadow-lg" size={42}>
                        {user.firstName[0]}
                    </Avatar>
                </Dropdown>
            </nav>

            {/* Profile Drawer Component */}
            <DrawerComponent open={openDrawer} onClose={() => setOpenDrawer(false)} user={user} />
        </>
    );
};

export default Navbar;
