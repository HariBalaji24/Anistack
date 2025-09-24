import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Showsnavbar from "../components/Shows-Navbar/Showsnavbar";
import Genres from "../pages/Genres/Genres";
import Home from "../pages/Home/Home";
import Ongoing from "../pages/Ongoing/Onging";
import Popular from "../pages/Popularanime/Popular";
import Popularmanga from "../pages/Popularanime/Popularmanga";
import Characters from "../pages/Shows/Characters/Characters";
import Images from "../pages/Shows/Images/Images";
import Shows from "../pages/Shows/Indishows/Shows";
import Recommendation from "../pages/Shows/Recommendation/Recommendation";
import Seasons from "../pages/Seasons/Seasons";
import Staff from "../pages/Shows/Staff/Staff";
import Trailer from "../pages/Shows/Trailer/Trailer";
import Types from "../pages/Types/Types";
import Upcoming from "../pages/Upcoming/Upcoming";
import Signin from "../pages/Sigin/Signin";
import User from "../pages/User/User";
import Notfound from "../pages/Not found/Notfound";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider} from "@react-oauth/google"

function WithNavbarLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function WithoutNavbarLayout() {
  return <Outlet />;
}

const  Googlewrapper = () =>{
  return (< GoogleOAuthProvider clientId="922837798894-aqmio252ldv45al2ql3ge26lp9fj27c5.apps.googleusercontent.com">
        <Signin/>
  </GoogleOAuthProvider>)
}

function App() {
  return (
    <BrowserRouter  future={{ v7_relativeSplatPath: true }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route element={<WithNavbarLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/popular/anime" element={<Popular />} />
          <Route path="/popular/manga" element={<Popularmanga />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/ongoing" element={<Ongoing />} />
          <Route path="/type/:type" element={<Types />} />

          <Route path="/anime/:id" element={<Showsnavbar />}>
            <Route index element={<Shows />} />
            <Route path="seasons" element={<Seasons />} />
            <Route path="characters" element={<Characters />} />
            <Route path="staffs" element={<Staff />} />
            <Route path="images" element={<Images />} />
            <Route path="recommendations" element={<Recommendation />} />
            <Route path="trailers" element={<Trailer />} />
          </Route>

          <Route path="/manga/:id" element={<Showsnavbar />}>
            <Route index element={<Shows />} />
            <Route path="seasons" element={<Seasons />} />
            <Route path="characters" element={<Characters />} />
            <Route path="images" element={<Images />} />
            <Route path="recommendations" element={<Recommendation />} />
          </Route>

          <Route path="/genre/:genre" element={<Genres />} />
          <Route path="/user-details" element={<User />} />
        </Route>

        <Route element={<WithoutNavbarLayout />}>
          <Route path="/signin" element={<Googlewrapper />} />
          <Route path="/login" element={<Googlewrapper />} />
          <Route path="*" element={<Notfound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
