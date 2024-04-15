import './App.css';
import Feed from './components/Feed';
import Header from './components/common/Header';
import SignUp from './components/SignUp';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppContextProvider } from './Context/AppContext';
import Login from './components/Login';
import { Toaster, toast } from 'sonner'



function App() {

  return (
    <AppContextProvider>
      <Router>
        <div className=''>
          <Header />
          <Toaster richColors position="top-right"/>
          <div className="">
            <Routes>
              <Route path='/' element={<Home/>} exact />
              <Route path='/feed' element={<Feed />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<SignUp />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AppContextProvider>
  );
}

export default App;
