import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("cart")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(i => i._id === item._id);
      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    changeQuantity: (state, action) => {
      const { id, delta } = action.payload;
      const existing = state.items.find(i => i._id === id);
      if (existing) {
        existing.quantity = Math.max(1, existing.quantity + delta);
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: state => {
      state.items = [];
      localStorage.removeItem("cart");
    },
    setCart: (state, action) => {
      state.items = action.payload;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
  },
});

export const { addToCart, removeFromCart, changeQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
