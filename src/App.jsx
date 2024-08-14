import './App.css';
import {
  BrowserRouter as Router,
  useNavigate,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from 'react';
import Login from './components/Login';
import Onebox from './components/Onebox';


function App() {

  const [isLoggedin, setLoggedin] = useState(false);
  const [isDarkMode, setMode] = useState(true);

  return (
    <>
      <div className="w-screen h-screen ">
        <div className='w-screen h-screen'>
          <div className='w-full h-full'>
            <Routes>
              <Route exact path="/login" element={<Login isLoggedin={isLoggedin} setLoggedin={setLoggedin} isDarkMode={isDarkMode} setMode={setMode} />} />
              <Route exact path="/onebox" element={<Onebox isLoggedin={isLoggedin} setLoggedin={setLoggedin} isDarkMode={isDarkMode} setMode={setMode} />} />
              <Route exact path="/*" element={<Login isLoggedin={isLoggedin} setLoggedin={setLoggedin} isDarkMode={isDarkMode} setMode={setMode} />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
