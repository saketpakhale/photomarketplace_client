import { createContext, useContext, useEffect, useReducer } from "react";
import CartReducer from "../reducer/cartReducer";

const CartContext = createContext();



const getFromStorage = () => {
    const cartArr = localStorage.getItem("userCart");    
    if(cartArr==null || cartArr.length===0 ) {        
        return [];
    } else {
        let photoArray = JSON.parse(cartArr);
        return photoArray;        
    }      
}

const initialState = {
    cart: getFromStorage(),
    total_items: 0,
    aggrSum: 0,
}

const CartProvider = ({children}) => {

    const [state, dispatch] = useReducer(CartReducer, initialState);   
    
    
    useEffect(() => {
        localStorage.setItem("userCart", JSON.stringify(state.cart));
    },[state.cart]);
    

    const addToCart = (photo) => {
        // console.log(photo);
        dispatch({type:"ADD_TO_CART", payload:{photo}});
    }
    const removeFromCart = (item)=> {
        // console.log(item);
        dispatch({type: "REMOVE_ITEM", payload:item});
    }
    return (
        <CartContext.Provider value={{...state, addToCart, removeFromCart}}>
            {children}
        </CartContext.Provider>
    )
}

const useCartContext = () => {
    return useContext(CartContext);
}

export {CartProvider, useCartContext}