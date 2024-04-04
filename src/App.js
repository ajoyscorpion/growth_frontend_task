import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './Pages/dashboard';
import Login_Signup from './Pages/Login_Signup';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' Component={Login_Signup}></Route>
        <Route path='/dashboard' Component={Dashboard}></Route>
      </Routes>  
    </div>
  );
}

export default App;
