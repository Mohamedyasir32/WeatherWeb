import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Weather from "./components/Weather";
import Forecast from "./components/Forecast";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Weather />} />
        <Route path="/forecast/:city" element={<Forecast />} />
      </Routes>
    </Router>
  );
}

export default App;
