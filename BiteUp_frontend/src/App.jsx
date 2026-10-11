import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/slices/authSlice';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  const dispatch = useDispatch();
  const { authChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl animate-bounce">🍴</span>
          <p className="text-xs text-neutral-400">Loading BiteUp...</p>
        </div>
      </div>
    );
  }

  return <AppRoutes />;
};

export default App;