import { Route, Routes } from 'react-router-dom';
import UserRegister from '../pages/UserRegister';
import UserLogin from '../pages/UserLogin';
import FoodPartnerRegister from '../pages/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/FoodPartnerLogin';
import Home from '../pages/general/Home';
import Saved from '../pages/general/Saved';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';
import BottomNav from '../components/BottomNav';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/foodpartner/register" element={<FoodPartnerRegister />} />
      <Route path="/foodpartner/login" element={<FoodPartnerLogin />} />
      <Route path="/" element={<ProtectedRoute><Home /><BottomNav /></ProtectedRoute>}/>
      <Route path="/saved" element={<ProtectedRoute><Saved /><BottomNav /></ProtectedRoute>}/>
      <Route path="/foodPartner/:id" element={<ProtectedRoute><Profile /><BottomNav /></ProtectedRoute>}/>      <Route path="/createFood" element={<ProtectedRoute allowedRole="foodPartner"><CreateFood /></ProtectedRoute> }/></Routes>
  );
};

export default AppRoutes;