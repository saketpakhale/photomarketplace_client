import Nav from "./components/Nav"
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Cart from './components/Cart';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

function App() {

  const theme = createTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#fafafa', 
      },
      secondary: {
        main: '#f50057',
      },
      
     
    },
  });

  return (  
    <div> 
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Nav />
          <Routes>          
            <Route path="/" element={<Homepage />} />          
            <Route path="/profile" element={<Profile />} />          
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
      </BrowserRouter>
    </ThemeProvider>
    </div>
  );
}

export default App;
