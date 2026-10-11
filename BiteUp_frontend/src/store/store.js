import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import foodReducer from './slices/foodSlice'
import foodPartnerReducer from './slices/foodPartnerSlice'



export const store = configureStore({
    reducer:{
        auth : authReducer,
        food : foodReducer,
        foodPartner : foodPartnerReducer
    },
})