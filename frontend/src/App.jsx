import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/firebase/Login";
import Register from "./components/firebase/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
