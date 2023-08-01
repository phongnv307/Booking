import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";

import { UserContextProvider } from "./globalState.js";
import { SearchContextProvider } from "./context/SearchContext.js";
import { AuthContextProvider } from "./context/AuthContext.js";
import Tour from "./components/tours/Tour";
import Tours from "./pages/tour/Tours";
function App() {
  
  
  return (
    <UserContextProvider>
      <AuthContextProvider>
        <SearchContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hotels" element={<List />} />
              <Route path="/hotels/:id" element={<Hotel />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tours/:id" element={<Tours/>}/>
            </Routes>
          </BrowserRouter>
        </SearchContextProvider>
      </AuthContextProvider>
    </UserContextProvider>
  );
}

export default App;
