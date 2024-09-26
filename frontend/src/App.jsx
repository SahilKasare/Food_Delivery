// src/App.jsx
import { Route, Routes } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import SignUp from './Components/signUp';
import Login from './Components/Login';
import CustomerDashboard from './Components/customerDashboard';
import RestaurantDashboard from './Components/RestaurantDashboard';
import PopularRestaurants from './Components/PopularRestaurants';
import SearchBox from './Components/SearchBox/SearchBox';
import Categories from './Components/Categories/Categories';
import AddMenuItemForm from './Components/AddMenuItemForm';
import AdminDashboard from './Components/AdminDashboard';
import GetUser from './Components/GetUser'
import DeleteUser from './Components/DeleteUser';
import ChangeUserRole from './Components/ChangeUserRole';
import './App.css';
import RestaurantForm from './Components/Restaurant/RestaurantForm';
import DeliveryPartnerCard from './Components/DeliveryPartner/DeliveryPartnerCard';
import AboutUs from './Components/AboutUs';
import Contact from './Components/Contact';
import RestaurantMenu from './Components/RestaurantMenu';
import { UserProvider } from './contexts/UserProvider';
import Menu from './Components/Menu';
import UpdateMenuItemForm from './Components/UpdateItem';

const App = () => {
  return (
    <UserProvider>
      <div className="App">
        <Header />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<><SearchBox /><Categories /><PopularRestaurants /><Footer /></>} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path='/about' element={<AboutUs />} />
            <Route path='/contact' element={<Contact />} />
            <Route path="/customer/" element={<><SearchBox /><Categories /><PopularRestaurants /><Footer /></>} />
            <Route path="/customer/menu/:restaurantId" element={<RestaurantMenu />} />
            <Route path="/restaurant/" element={<RestaurantDashboard />} />
            <Route path="/restaurant/profileDetails" element={<RestaurantForm />} />
            <Route path="/restaurant/menu/item" element={<AddMenuItemForm />} />
            <Route path="/restaurant/menu" element={<Menu />} />
            <Route path="/restaurant/updateItem/:id" element={<UpdateMenuItemForm/>} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/getUser" element={<GetUser />} />
            <Route path="/admin/deleteUser" element={<DeleteUser />} />
            <Route path="/admin/changeUserRole" element={<ChangeUserRole />} />
            
          </Routes>
        </div>
      <Footer/>
      </div>
    </UserProvider>
  );
}

export default App;
