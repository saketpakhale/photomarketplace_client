
import React, { useState } from 'react';
import './GallreyUpload.css';
import { Box, TextField, Button, InputLabel, Select, MenuItem, Input } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";

const GalleryUpload = ({addnewPhoto}) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [price, setPrice] = useState('');
  const [keywords, setKeywords] = useState('');
  const [category, setCategory] = useState('');

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    // setSelectedPhoto(file);
    const resizeAndCompressImage = (imageFile, maxWidth, maxHeight) => {
      return new Promise((resolve) => {
        const image = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        image.src = URL.createObjectURL(imageFile);
        image.onload = () => {
          let width = image.width;
          let height = image.height;
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(image, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 1); // Adjust the compression quality here (0.8 means 80% quality)
        };
      });
    };

    // Resize and compress the image before uploading
    
    const compressedImage = await resizeAndCompressImage(file, 800, 800); // Adjust the maxWidth and maxHeight as needed

    setSelectedPhoto(compressedImage);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleKeywordsChange = (event) => {
    setKeywords(event.target.value);
  };

  const uploadPhoto = async () => {

    setCategory("");
    setKeywords("");
    setPrice("");
    if (selectedPhoto) {
      
      alert("your photo is uploading...");
      
      const imageRef = ref(storage, `images/${selectedPhoto.name + v4()}`);
      uploadBytes(imageRef, selectedPhoto).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          addnewPhoto(url);
          const data = {
            url: url,
            price: price,
            keywords: keywords,
            category: category,
            width: selectedPhoto.width,
            height: selectedPhoto.height,
          }

          try {
            const response = await fetch(`https://photo-stock.onrender.com/profile/gallery`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json', "authorization": localStorage.getItem("token")},
              body: JSON.stringify(data),
            });
            if (response.ok) {
              console.log('Photo uploaded successfully');
              alert("Photo uploaded successfully.")
              setSelectedPhoto(null);
              

            } else {
              console.error('Failed to upload photo');
            }
          } catch (error) {
            console.error('An error occurred:', error);
          }
        });
      });
      
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 4,
        width: 380,
        margin: '0 auto',
        backgroundColor: '#ffffff'
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 2 }}>Upload Photo</h2>
      <Input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        type="text"
        placeholder="Price"
        value={price}
        onChange={handlePriceChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        type="text"
        placeholder="Keywords (seperated with commas)"
        value={keywords}
        onChange={handleKeywordsChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <InputLabel htmlFor="category">Category: </InputLabel>
      <Select
        id="category"
        value={category}
        onChange={handleCategoryChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="Any">Any</MenuItem>
        <MenuItem value="Portrait">Portrait</MenuItem>
        <MenuItem value="Landscape">Landscape</MenuItem>
        <MenuItem value="Nature">Nature</MenuItem>
        <MenuItem value="Cinematic">Cinematic</MenuItem>
        <MenuItem value="Product">Product</MenuItem>
      </Select>
      <Button variant="contained" onClick={uploadPhoto} fullWidth>
        Upload
      </Button>
    </Box>
  );
};

export default GalleryUpload;
