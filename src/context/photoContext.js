import React, {createContext, useContext, useReducer, useEffect} from "react";
import reducer from "../reducer/photosReducer";

const AppContext = createContext();


const initialState = [];

const URL = "https://photo-stock.onrender.com/";



const AppProvider = ({children}) => {

    const [state,dispatch] = useReducer(reducer,initialState);

    useEffect(() => {
        getPhotos(URL);
    },[]);

    const getPhotos = (url) => {
        fetch("https://photo-stock.onrender.com/")
        .then(response => response.json())
        .then(data => {
            dispatch({type:"SET_ALL_PHOTOS", payload: data})
        })
        .catch(error => console.error('Error: Saket', error));
    }


    return (
    <AppContext.Provider value={state}>
        {children}
    </AppContext.Provider>
    );
}


const useHomePhoto = () => {
    return useContext(AppContext);
}

export {AppProvider, useHomePhoto}