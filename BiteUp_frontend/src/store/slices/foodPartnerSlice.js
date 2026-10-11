import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'


const getErrorMessage = (error) => {
    const message = error.response?.data?.message
    if (Array.isArray(message)) return message.join(', ')
    if(message) return message
    return error.message || 'something went wrong'
}

export const fetchFoodPartner = createAsyncThunk('foodPartner/fetchFoodPartner',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/foodPartner/${id}`)
      return res.data.foodPartner
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

const initialState = {
  profile: null,
  requestedId: null,
  loading: false,
  error: null,
}

const foodPartnerSlice = createSlice({
  name: 'foodPartner',
  initialState,
  reducers: {
    clearProfile() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoodPartner.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.profile = null
        state.requestedId = action.meta.arg
      })
      .addCase(fetchFoodPartner.fulfilled, (state, action) => {
        if (action.meta.arg !== state.requestedId) return
        state.loading = false
        state.profile = action.payload
      })
      .addCase(fetchFoodPartner.rejected, (state, action) => {
        if (action.meta.arg !== state.requestedId) return
        state.loading = false
        state.error = action.payload?.message || 'Could not load profile'
      })
  },
})

export const { clearProfile } = foodPartnerSlice.actions
export default foodPartnerSlice.reducer