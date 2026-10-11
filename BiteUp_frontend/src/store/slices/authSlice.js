import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const routes = {
  user: {
    register: '/auth/user/register',
    resend: '/auth/user/resendotp',
    verify: '/auth/user/verifyUser',
    complete: '/auth/user/completeRegistration',
    login: '/auth/user/login',
    logout: '/auth/user/logout',
    logoutAll: '/auth/user/logoutAll',
  },
  foodPartner: {
    register: '/auth/foodpartner/register',
    resend: '/auth/foodpartner/resendotp',
    verify: '/auth/foodpartner/verifyfoodPartner',
    complete: '/auth/foodpartner/completeRegistration',
    login: '/auth/foodpartner/login',
    logout: '/auth/foodpartner/logout',
    logoutAll: '/auth/foodpartner/logoutAll',
  }
};

const getErrorMessage = (error) => {
  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join(', ');
  if (message) return message;
  return error.message || 'Something went wrong';
};

export const registerRequest = createAsyncThunk('auth/registerRequest',
  async ({ role, username, email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post(routes[role].register, { username, email, password });
      return { registrationId: res.data?.registrationId || res.data.pending?._id };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const verifyAndComplete = createAsyncThunk('auth/verifyAndComplete',
  async ({ role, registrationId, otp }, { rejectWithValue }) => {
    try {
      await api.post(routes[role].verify, { registrationId, otp });
      await api.post(routes[role].complete, { registrationId });
      return true;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const resendOtp = createAsyncThunk('auth/resendOtp',
  async ({ role, registrationId }, { rejectWithValue }) => {
    try {
      await api.post(routes[role].resend, { registrationId });
      return true;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const loginRequest = createAsyncThunk('auth/loginRequest',
  async ({ role, email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post(routes[role].login, { email, password });
      const account = res.data.user || res.data.foodPartner;
      const accessToken = res.data.AccessToken;

      localStorage.setItem('biteup_account', JSON.stringify(account));
      localStorage.setItem('biteup_role', role);

      return { role, accessToken, account };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logoutRequest = createAsyncThunk('auth/logoutRequest',
  async (_, { getState, rejectWithValue }) => {
    try {
      const role = getState().auth.role || localStorage.getItem('biteup_role') || 'user';
      await api.post(routes[role].logout);
    } catch (error) {
    } finally {
      localStorage.removeItem('biteup_account');
      localStorage.removeItem('biteup_role');
    }
    return true;
  }
);

export const logoutAllRequest = createAsyncThunk('auth/logoutAllRequest',
  async (_, { getState, rejectWithValue }) => {
    try {
      const role = getState().auth.role || localStorage.getItem('biteup_role') || 'user';
      await api.post(routes[role].logoutAll);
    } catch (error) {
    } finally {
      localStorage.removeItem('biteup_account');
      localStorage.removeItem('biteup_role');
    }
    return true;
  }
);

export const checkAuth = createAsyncThunk('auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const role = localStorage.getItem('biteup_role') || 'user';
      const endpoint = role === 'foodPartner' ? '/auth/foodpartner/rotateToken' : '/auth/user/rotateToken';

      const res = await api.post(endpoint);
      const account = res.data.user || res.data.foodPartner;

      return { role, accessToken: res.data.AccessToken, account,};
    } catch (error) {
      localStorage.removeItem('biteup_account');
      localStorage.removeItem('biteup_role');
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

let savedAccount = null;
try{
    const item = localStorage.getItem('biteup_account');
    if(item && item !== 'undefined'){
        savedAccount = JSON.parse(item);
    }
}catch(e){
    savedAccount = null;
}

const savedRole = localStorage.getItem('biteup_role');

const initialState = {
  account: null,
  role: null,
  error: null,
  accessToken: null,
  registrationId: null,
  loading: false,
  info: null,
  authChecked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.info = null;
    },
  },
  extraReducers: (builder) => {
    builder
       .addCase(checkAuth.fulfilled, (state, action) => {
         state.account = action.payload.account;
         state.role = action.payload.role;
         state.accessToken = action.payload.accessToken;
         state.authChecked = true;
       })
       .addCase(checkAuth.rejected, (state) => {
         state.account = null;
         state.role = null;
         state.accessToken = null;
         state.authChecked = true;
       })

      .addCase(registerRequest.fulfilled, (state, action) => {
        state.registrationId = action.payload.registrationId;
        state.info = 'Verification code sent to your email';
      })
      .addCase(verifyAndComplete.fulfilled, (state) => {
        state.registrationId = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.info = 'A new code has been sent to your email';
      })
      .addCase(loginRequest.fulfilled, (state, action) => {
        state.account = action.payload.account;
        state.role = action.payload.role;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(logoutRequest.fulfilled, (state) => {
        state.account = null;
        state.role = null;
        state.accessToken = null;
      })
      .addCase(logoutAllRequest.fulfilled, (state) => {
        state.account = null;
        state.role = null;
        state.accessToken = null;
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
          state.info = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Something went wrong';
        }
      );
  },
});

export const { clearMessages } = authSlice.actions;
export default authSlice.reducer;