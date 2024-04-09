import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import { useCartContext } from '../context/cartContext';
import { Table, TableBody, Button, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const user =localStorage.getItem("token");
    const {cart,removeFromCart} = useCartContext();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (cart !== null) {
        setCartItems(cart);
      } else {
        setCartItems([]);
      }
      
    }, [cart,removeFromCart]);

      const handleCheckout = () => {
        
        if(user) {

        } else {
            navigate("/login");
        }
        
      };
      
  
    const totalPrice = cartItems.reduce((total, item) => total + parseInt(item.price, 10), 0);
  
    return (
      <Box width="70%" margin="auto" marginTop={3}>
      <div className="cart">
        <h3>Cart</h3>
        {cartItems.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty.</p>
        ) : (
          <div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Seller</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>File Format</TableCell>
                    <TableCell align="center">Remove</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.url}>
                      <TableCell>
                        <img className="item-image" src={`${item.url}`} alt={item.seller} />
                      </TableCell>
                      <TableCell>{item.seller}</TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>JPG/JPEG</TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="Remove"
                          onClick={() => removeFromCart(item)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" className="total">Total: ₹{totalPrice}</Typography>
            <Box display="flex" justifyContent="left" mt={2}>
              <Button variant="contained" color="primary" onClick={handleCheckout}>
                Checkout
              </Button>
            </Box>
          </div>
        )}
      </div>
    </Box>
    );
  }
  
  export default Cart;
