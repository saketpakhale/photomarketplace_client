import React, { useState } from "react";
import './Signup.css';
import { Link ,useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnfPass, setCnfPass] = useState("");
  const navigate = useNavigate();
  
  const collectData = async ()=> {
    const bodyPost = {email,password}; 
    await fetch("https://photo-stock.onrender.com/signup", {
      method: "post",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(bodyPost)
    });   
    navigate("/login");
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {    
    setPassword(e.target.value);
  };

  const handleCnfPasswordChange = (e) => {
    setCnfPass(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(password!==cnfPass) {
      alert("The Confirm Password is not same as Password.");
      setPassword("");
      setCnfPass("");
    } else {
      collectData();
      setEmail("");
      setPassword("");
      setCnfPass("");
    
    }    
  };

  return (
    <div className="page">
        <div className="signup-page">
        <h1>Signup</h1>
        <form onSubmit={handleSubmit} className="signup-form" >
            <div>
            <label htmlFor="email"></label>
            <input
                type="email"
                id="email"
                value={email}
                placeholder="Email"
                onChange={handleEmailChange}
                required
            />
            </div>
            <div>
            <label htmlFor="password"></label>
            <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
            />
            </div>
            <div>
            <label htmlFor="cnfPass"></label>
            <input
                type="password"
                id="password"
                placeholder="ConfirmPassword"
                value={cnfPass}
                onChange={handleCnfPasswordChange}
                required
            />
            </div>
            <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account <Link to="/login">Log in</Link></p>
        </div>
    </div>
  );
}

export default Signup;
