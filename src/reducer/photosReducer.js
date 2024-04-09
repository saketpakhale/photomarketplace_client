
const PhotoReducer = (state, action) => {
    if(action.type==="SET_ALL_PHOTOS") {
        return [...state, ...action.payload]; 
    }
    return state;
} 

export default PhotoReducer;