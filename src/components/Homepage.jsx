import React, { useState, useEffect, useMemo } from 'react';
import './homepage.css';
import { Box,FormControl, InputLabel, MenuItem, Select, Toolbar, InputBase, IconButton, Paper  } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import { useHomePhoto } from '../context/photoContext';
import { useCartContext } from '../context/cartContext';
import Masonry from "react-responsive-masonry";

const backgroundImageUrl = 'url("https://firebasestorage.googleapis.com/v0/b/photo-stock-1688205589170.appspot.com/o/images%2Fundefined0e57eeaf-19cd-4783-8376-29ae301e780e?alt=media&token=5968f6d8-9b7c-4a85-a2fa-eca774cda854")';

const headerStyle = {  
  background: backgroundImageUrl,
  backgroundSize: 'cover',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '90vh',
};



const searchStyle = {
  position: 'relative',
  borderRadius: '20px',
  backgroundColor: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#FFFFFF',
  },
  margin: '0 auto',
  width: '70%',
  '@media (min-width: 600px)': {
    marginLeft: '24px',
    width: 'auto',
  },
};

const searchIconStyle = {
  padding: '0 8px',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const inputRootStyle = {
  color: 'inherit',
};

const inputInputStyle = {
  padding: '8px 8px 8px calc(1em + 32px)',
  transition: 'width 300ms ease-in-out',
  width: '50%',
  '@media (min-width: 600px)': {
    width: '150px',
  },
  
};


function Homepage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOrientation, setSelectedOrientation] = useState('');
  const callPhoto = useHomePhoto();
  const {addToCart} = useCartContext(); 

  useEffect(() => {    
    setPhotos(callPhoto);
    setFilteredPhotos(callPhoto);    
  },[callPhoto]);

  useEffect(() => {
    let sortedPhotos = [...filteredPhotos];
  
    if (sortBy === 'priceLowToHigh') {
      sortedPhotos.sort((a, b) => parseFloat(a.sp) - parseFloat(b.sp));
    } else if (sortBy === 'priceHighToLow') {
      sortedPhotos.sort((a, b) => parseFloat(b.sp) - parseFloat(a.sp));
    } else if (sortBy === 'random') {
      for (let i = sortedPhotos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sortedPhotos[i], sortedPhotos[j]] = [sortedPhotos[j], sortedPhotos[i]];
      }
    }
    setFilteredPhotos(sortedPhotos);
  }, [sortBy]);
  
  

  useEffect(() => {
    const filterPhotos = () => {
      let filteredPhotos = [...photos];

      if (selectedCategory !== '') {
        filteredPhotos = filteredPhotos.filter((photo) => photo.category === selectedCategory);
      }

      if (selectedOrientation !== '') {
        filteredPhotos = filteredPhotos.filter((photo) => photo.orientation === selectedOrientation);
      }

      return filteredPhotos;
    };
    const updatedFilteredPhotos = filterPhotos();
    setFilteredPhotos(updatedFilteredPhotos);
  }, [selectedCategory, selectedOrientation, photos]);
  

  
  const memoizedComponent = useMemo(() => {
      

      const handleSearch = (e) => {
        e.preventDefault();

        fetch(`https://photo-stock.onrender.com/search?query=${searchQuery}`)
          .then(response => response.json())
          .then(data => {
            setPhotos(data);
            setFilteredPhotos(data);
          })
          .catch(error => console.error('Error:', error));
      };



      const handleZoom = (photoUrl) => {
        window.open(photoUrl, '_blank');
      };

      

      
      

      return (
        <>
        <div style={headerStyle} >

            <div >
              <div ><p style={{fontSize:'60px', fontWeight:'bold', color:'white', textAlign:'centre'}}>The best <span style={{ color: '	#0FFF50' }}>stock photos</span>, royalty free <br />
              images & videos shared by creators.</p>
            </div>
            <Toolbar >          
              <Paper component="form" style={searchStyle} onSubmit={handleSearch}>
                <IconButton type="submit" style={searchIconStyle}>
                  <SearchIcon />
                </IconButton>
                <InputBase
                  placeholder="Search photos"
                  style={{
                    ...inputRootStyle,
                    ...inputInputStyle,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Paper>
            </Toolbar>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ m:5, minWidth: 120}}>
                <FormControl sx={{ m: 1, minWidth: 120, backgroundColor: '#fff' }} size="small">
                  <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="">Original</MenuItem>
                    <MenuItem value="priceLowToHigh">Price (Low to High)</MenuItem>
                    <MenuItem value="priceHighToLow">Price (High to Low)</MenuItem>
                    <MenuItem value="random">Random</MenuItem>
                  </Select>
                </FormControl>
                <FormControl  sx={{ m: 1, minWidth: 120, backgroundColor: '#fff' }} size="small">
                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Portrait">Portrait</MenuItem>
                    <MenuItem value="Landscape">Landscape</MenuItem>
                    <MenuItem value="Nature">Nature</MenuItem>
                  </Select>
                </FormControl>

                <FormControl  sx={{ m: 1, minWidth: 120, backgroundColor: '#fff' }} size="small">
                  <InputLabel id="demo-simple-select-label">Orientation</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedOrientation}
                    onChange={(e) => setSelectedOrientation(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="horizontal">Horizontal</MenuItem>
                    <MenuItem value="vertical">Vertical</MenuItem>
                  </Select>
                </FormControl>
            </Box>
          </div>
            </div>

            
        </div>

          
        <div className="homepage" >
          
        

            
          <div className='photo-grid'>
            <Masonry columnsCount={4} gutter="20px">
              {filteredPhotos.map((photo) => (
                <div key={photo.photoUrl} className="photo-card">
                  <div className="photo">
                    <img src={`${photo.photoUrl}`} alt="" />
                    <div className="photo-overlay">
                      <p>Photo by: {photo.username}</p>
                      <p>Price: ₹{photo.sp}</p>
                      <button className="buy-button" onClick={() => addToCart(photo)}>Add to Cart</button>
                      <button className="zoom-button" onClick={() => handleZoom(photo.photoUrl)}>Zoom</button>
                    </div>
                  </div>
                </div>
              ))}
              </Masonry>
          </div>
          
                
        </div>
        </>
      );
  }, [ sortBy, selectedCategory, selectedOrientation, addToCart, filteredPhotos, searchQuery]);

  return memoizedComponent;
}

export default Homepage;


