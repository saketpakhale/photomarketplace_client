import React, { useState } from "react";
import './Signup.css';
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    
    const collectData = async ()=> {
        const bodyPost = {email,password}; 
        await fetch("https://photo-stock.onrender.com/login", {
          method: "post",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(bodyPost)
        }).then(response => response.json()).then(json => {
          localStorage.setItem('token', json.token); 
          if(json) {
            if(json.result) {
              (json.result === "Incorrect Password") ? 
              alert("Incorrect Password") : navigate("/signup");
            } else {
              navigate("/profile");
            }
          } else {
              navigate("/signup");
          }
        });       
      }
    
      const handleEmailChange = (e) => {
        setEmail(e.target.value);
      };
    
      const handlePasswordChange = (e) => {    
        setPassword(e.target.value);
      };      
    
      const handleSubmit = (e) => {
        e.preventDefault();
        collectData();
        setEmail("");
        setPassword("");        
        }    
      
    
      return (
        <div className="page">
            <div className="signup-page">
            <h1>Login</h1>
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
                <button type="submit">Log In</button>
            </form>
            <p>Don't have an account <Link to="/signup">Sign up</Link></p>
            </div>
        </div>
      );
};
export default Login;