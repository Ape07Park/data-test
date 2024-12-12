import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './pages/Main';
import TocList from './pages/TocList';
import Scroll from './pages/Scroll';
import Search from './pages/Search';
import Sort from './pages/Sort';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/list" element={<TocList />} />
        <Route path="/scroll" element={<Scroll />} />
        <Route path="/search" element={<Search />} />
        <Route path="/sort" element={<Sort />} />

      </Routes>
      {/* 푸터 */}
    </BrowserRouter>
  );
}

export default App
