import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const getErrorMessage = (error) => {
    const message = error.response?.data?.message
    if (Array.isArray(message)) return message.join(', ')
    if(message) return message
    return error.message || 'something went wrong'
}

export const fetchFood = createAsyncThunk('food/fetchFoods',
    async (_,{rejectWithValue}) => {
        try{
            const res = await api.get('/food/fetch')

            let savedIds = new Set()
            try{
                const savedRes = await api.get('/food/saved')
                savedIds = new Set(savedRes.data.savedFoods.map((doc) => doc.food?._id).filter(Boolean))
            }catch(savedError){
            }

            return res.data.fooditems.map((item) => ({ ...item, isSaved: savedIds.has(item._id) }))
        }catch(error){
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const createFood = createAsyncThunk('food/createFood',
    async ({video,name,description},{rejectWithValue}) => {
        try{
            const formData = new FormData();
            formData.append('name',name);
            formData.append('description',description);
            formData.append('videos',video);

            const res = await api.post('/food/create',formData);
            return res.data.food;
        }catch(error){
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const likes = createAsyncThunk('food/likeFood',
    async (foodId,{rejectWithValue}) => {
        try{
            const res = await api.post('/food/like',{foodId});
            return { foodId, liked: res.status === 201 };
        }catch(error){
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const saveFood = createAsyncThunk('food/saveFood',
    async (foodId,{rejectWithValue}) => {
        try{
            const res = await api.post('/food/save',{foodId});
            return { foodId, saved: res.status === 201 };
        }catch(error){
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const getsavedFood = createAsyncThunk('food/saved',
    async (_,{rejectWithValue}) => {
        try{
            const res = await api.get('/food/saved');
            return res.data.savedFoods
                .map((doc) => doc.food)
                .filter(Boolean)
                .map((item) => ({ ...item, isSaved: true }));
        }catch(error){
            if (error.response?.status === 404 && error.response?.data?.message === 'No saved foods found') return [];
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

const updateFood = (state, foodId, updater) => {
    state.fooditems.forEach((item) => {
        if (item._id === foodId) updater(item)
    })
    state.savedFoods.forEach((item) => {
        if (item._id === foodId) updater(item)
    })
}

const initialState = {
    fooditems: [],
    savedFoods: [],
    loading: false,
    actionLoading: false,
    error: null,
}

const foodSlice = createSlice({
    name: 'food',
    initialState,
    reducers:{
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder

        .addCase(fetchFood.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchFood.fulfilled, (state,action) => {
            state.loading = false;
            state.error = null;
            state.fooditems = action.payload;
        })
        .addCase(fetchFood.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(createFood.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        })
        .addCase(createFood.fulfilled, (state, action) => {
          state.actionLoading = false;
          state.fooditems.unshift(action.payload);
        })
        .addCase(createFood.rejected, (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        })



        .addCase(getsavedFood.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getsavedFood.fulfilled, (state, action) => {
          state.loading = false;
          state.savedFoods = action.payload;
        })
        .addCase(getsavedFood.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })



        .addCase(likes.pending, (state) => {
          state.error = null;
        })
        .addCase(likes.fulfilled, (state, action) => {
            const { foodId, liked } = action.payload;
            updateFood(state, foodId, (item) => {
                item.isLiked = liked;
                item.likeCount = Math.max(0, (item.likeCount || 0) + (liked ? 1 : -1));
            });
        })
        .addCase(likes.rejected, (state, action) => {
          state.error = action.payload;
        })


        
        .addCase(saveFood.pending, (state) => {
          state.error = null;
        })
        .addCase(saveFood.fulfilled, (state, action) => {
          const { foodId, message, save } = action.payload;
          if (message.includes('saved successfully')) {
            const fullFood = state.fooditems.find((f) => f._id === foodId);
            state.savedFoods.push({ ...save, food: fullFood });
          } else {
            state.savedFoods = state.savedFoods.filter(
              (item) => item.food?._id !== foodId && item.food !== foodId
            );
          }
        })
        .addCase(saveFood.rejected, (state, action) => {
          state.error = action.payload;
        });
  },
});

export const { clearError } = foodSlice.actions;
export default foodSlice.reducer;
