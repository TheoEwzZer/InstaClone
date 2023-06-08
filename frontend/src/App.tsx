import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
