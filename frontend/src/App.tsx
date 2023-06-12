import { ReactElement } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/register";

function App(): ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/accounts/login/" element={<Home />} />
        <Route path="/accounts/emailsignup/" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
