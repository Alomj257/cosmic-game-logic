import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Input, Button } from "antd";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <Input name="email" placeholder="Email" className="mb-2" onChange={handleChange} required />
        <Input.Password name="password" placeholder="Password" className="mb-2" onChange={handleChange} required />
        <Button type="primary" htmlType="submit" block>Login</Button>
      </form>
    </div>
  );
};

export default Login;
