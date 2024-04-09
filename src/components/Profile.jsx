
import React, {useEffect, useState} from 'react';
import './Profile.css'; 
import { Box, TextField, Button, Input, IconButton, Tooltip } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { deleteObject } from '@firebase/storage';
import { storage } from "../firebase";
import { v4 } from "uuid";
import DeleteIcon from '@mui/icons-material/Delete';
import GalleryUpload from './GalleryUpload';

const Profile = () => {
  const [username,setUsername] = useState("UserName");
  const [bio,setBio] = useState("Bio");
  const [usernameText,setUsernameText] = useState("");
  const [bioText,setBioText] = useState("");
  const [photos,setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw12heLdDsmpYp-_bUEQAVp5&ust=1689847386411000&source=images&cd=vfe&opi=89978449&ved=0CA4QjRxqFwoTCLDbnJrCmoADFQAAAAAdAAAAABAE");
  

  useEffect(() => {
      const fetchData = async () => {
          try {
            const response = await fetch('https://photo-stock.onrender.com/profile', {
              method: "GET",
              headers: {'Content-Type': 'application/json', "authorization": localStorage.getItem("token")}
            }); 
            const jsonData = await response.json();
            setUsername(jsonData.username);
            setBio(jsonData.bio);
            setPhotos(jsonData.photoGallery.photoUrl);
            // const useit = jsonData.photoGallery.photoUrl;
            // dispatchPhotos({ type: 'SET_PHOTOS', payload: { useit } });
            if(jsonData.profilePhoto) {
              setProfilePhoto(jsonData.profilePhoto);
            }
            
          } catch (error) {
            console.error('An error occurred:', error);
          }
        };
        fetchData(); 
  },[]);

  function handleClick() {
      const collectData = async ()=> {
          const bodyPost = {usernameText,bioText}; 
          await fetch("https://photo-stock.onrender.com/profile", {
            method: "post",
            headers: {'Content-Type': 'application/json', "authorization": localStorage.getItem("token")},
            body: JSON.stringify(bodyPost)
          }); 
          setUsername(usernameText);
          setBio(bioText); 
          setUsernameText("");
          setBioText(""); 
          
      }
      collectData();
  }

  function handleProfilePhoto() {
    const uploadProfilePhoto = async () => {
      if (selectedPhoto) {
        const imageRef = ref(storage, `profileimages/${selectedPhoto.name + v4()}`);
        uploadBytes(imageRef, selectedPhoto).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            const data = {
              profilePhoto: url,
            }         
      
            try {
              const response = await fetch(`https://photo-stock.onrender.com/profile/profilePhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "authorization": localStorage.getItem("token")},
                body: JSON.stringify(data),
              });
              if (response.ok) {
                console.log('Photo uploaded successfully');
                alert("Profile photo updated.")
                const imageRef = ref(storage, `${profilePhoto}`);
                await deleteObject(imageRef);
                setProfilePhoto(url);
                setSelectedPhoto(null);
                window.location.reload();
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
    uploadProfilePhoto();
}
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
        }, 'image/jpeg', 0.8); // Adjust the compression quality here (0.8 means 80% quality)
      };
    });
  };

  // Resize and compress the image before uploading
  const compressedImage = await resizeAndCompressImage(file, 200, 200); // Adjust the maxWidth and maxHeight as needed

  setSelectedPhoto(compressedImage);
};

function handleUsername(e) {
    setUsernameText(e.target.value);
}
function handleBio(e) {
    setBioText(e.target.value);
}

const handlePhotoDelete = async (photoUrl) => {
  setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo !== photoUrl));
  try {
    const imageRef = ref(storage, `${photoUrl}`);
    await deleteObject(imageRef).then(async () => {
      try {
        await fetch(`https://photo-stock.onrender.com/profile/gallery`, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json', "authorization": localStorage.getItem("token")},
          body: JSON.stringify({ photoUrl }),
        });
        
        console.log('Photo deleted successfully');
      } catch (error) {
        console.error('An error occurred:', error);
      }
    });
    
  } catch (error) {
    console.error('Error deleting the photo:', error);
  }
  
};  

const addnewPhoto = (data) => {
  
  setPhotos((prevPhotos) => {
    return [...prevPhotos, data];
  })
};
    


  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="profile-avatar">
          <img src={profilePhoto} alt="Profile Avatar" />
          
        </div>
        <div className="profile-info">
          <h1 className="profile-username" >{username}</h1>          
          <p className="profile-bio" >{bio}</p>
          
        </div>
        
      </header>
      
    <div className='uploadsection'>
    <Box
      sx={{
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 4,
        width: 380,
        margin: '0 auto',
        backgroundColor: '#ffffff',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 2 }}>Update Details</h2>
      <Input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        sx={{ marginTop: 2, marginBottom: 2 }}
      />
      <Button variant="contained" onClick={handleProfilePhoto} fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
        Update Profile Photo
      </Button> 
      <TextField
        type="text"
        placeholder='New username'
        value={usernameText}
        onChange={handleUsername}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        type="text"
        placeholder='New bio'
        value={bioText}
        onChange={handleBio}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" onClick={handleClick} fullWidth>
        Update details
      </Button>
           
    </Box>
    <GalleryUpload  addnewPhoto={addnewPhoto}/>
    </div>
      <section className="profile-photos">
      {photos.map((photo, index) => (
          <div className="photo" key={index + 1} >
            <Box
              sx={{
                position: 'relative',
                '&:hover .deleteButton': {
                  display: 'block',
                },
              }}
            >
              <img src={`${photo}`} alt={photo.title} />
              
              <Tooltip title="Delete" placement="top">
                <IconButton
                  aria-label="Delete"
                  onClick={() => handlePhotoDelete(photo)}
                  className="deleteButton"
                  sx={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    display: 'none',
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>              
            </Box>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Profile;
