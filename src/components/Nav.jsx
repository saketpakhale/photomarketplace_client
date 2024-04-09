import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import './nav.css';
import { useCartContext } from "../context/cartContext";
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function Nav() {
  const user = localStorage.getItem("token");
  const userId = user !== null && user !== "undefined";
  const navigate = useNavigate();
  const {cart} = useCartContext();
  const [cartItem, setCartItems] = useState(0);
  
  useEffect(() => {
    setCartItems(cart.length);
  },[cart]);


  const handleHomeClick = () => {
    navigate("/");
  };


  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
      
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ cursor: 'pointer' }} onClick={handleHomeClick}>
          Stock-Photos
        </Typography>
        <div style={{ flex: 1 }}></div>
        <Button color="inherit" component={Link} to="/" >
          Home
        </Button>
        {userId ? (
          <>
            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              SignUp
            </Button>
          </>
        )}
        <IconButton color="inherit" component={Link} to="/cart">
          <Badge badgeContent={cartItem} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
      
    );
  }

export default Nav;