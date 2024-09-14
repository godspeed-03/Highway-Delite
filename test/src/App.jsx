import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Pages/register";
import Homepage from "./Pages/Homepage";
import Login from "./Pages/login";
import OtpVerification from "./Pages/otpverify";

function App() {

  return (
    <div className="app">
      <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/verifyotp/:email" element={<OtpVerification />} />
            <Route path="/" element={<Login />} />
            <Route
              path="/home"
              element={<Homepage /> }
            />
            
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
