import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/firebase/Login";
import Register from "./components/firebase/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
