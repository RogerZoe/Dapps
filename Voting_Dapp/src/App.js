import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Components/Home";
import Winner from "./Components/Winner";

const App = () => {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <nav className="relative bg-slate-500 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-4xl mx-auto px-6">
          <ul className="flex space-x-1 sm:space-x-6 py-4 text-white font-semibold">
            <li>
              <Link
                to="/"
                className="px-4 py-2 rounded-lg hover:bg-white/20 hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                🏠 Home
              </Link>
            </li>
            <li>
              <Link
                to="/SelectWinner"
                className="px-4 py-2 rounded-lg hover:bg-white/20 hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                🏁 Select Winner
              </Link>
            </li>
          </ul>
        </div>

        {/* Subtle gradient underline animation */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-70"></div>
      </nav>

      {/* Page Content */}
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SelectWinner" element={<Winner />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;