import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Homepage from './pages/Homepage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Browse from './pages/Browse';
import MyPurchases from './pages/MyPurchases';
import MyProducts from './pages/MyProducts';
import Sell from './pages/Sell';
import PageNotFound from './pages/PageNotFound';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="browse" element={<Browse />} />
          <Route path="purchases" element={<MyPurchases />} />
          <Route path="products" element={<MyProducts />} />
          <Route path="sell" element={<Sell />} />
          <Route path="product/:id" element={<ProductDetail />} />
        </Route>
        <Route path="admin" element={<Admin />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
