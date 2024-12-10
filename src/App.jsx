import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './pages/Main';
import TocList from './pages/TocList';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/list" element={<TocList />} />
        {/* <Route path="/view" element={<PostView />} /> */}
      </Routes>
      {/* 푸터 */}
    </BrowserRouter>
  );
}

export default App
