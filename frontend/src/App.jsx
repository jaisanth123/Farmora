import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/firebase/Login";
import Register from "./components/firebase/Register";
//import FarmerRegistrationForm from "./components/FarmerRegistrationForm";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/form" element={<FarmerRegistrationForm />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
