import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatPage from './pages/ChatPage';
import { ChatState } from './context/ChatProvider';

function App() {
  const { user } = ChatState();

  return (
    <div className='App'>
      <Routes>
        <Route path='*' element={!user ? <Login /> : <ChatPage />} />
        <Route exact path='/' element={!user ? <Login /> : <ChatPage />} />
        <Route exact path='/signup' element={<Signup />} />
        <Route exact path='/chats' element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
