const CartReducer = (state, action) => {
    if(action.type === "ADD_TO_CART") {
        let {photo} = action.payload;
        const cartItem = {
            url: photo.photoUrl,
            price: photo.sp,
            seller: photo.username,
            id: photo.photoId,            
        }     
        return {
            ...state,
            cart: [...state.cart, cartItem],
        }
    }
    if(action.type === "REMOVE_ITEM") {

        const newCart = state.cart.filter((cartItem) => cartItem.url !== action.payload.url);
        
        return {
            cart: newCart,
        }
    }
    
    return state;
} 

export default CartReducer;