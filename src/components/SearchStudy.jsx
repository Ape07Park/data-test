import { useRef } from "react";

export default function SearchStudy({ onSearch }) {

    // 검색어, 검색 버튼, 검색어 넘기기

    // input의 값을 가져오기

    const term = useRef('');

    const handleTerm = (e) => {
        term.current = e.target.value
    }

    const handleSearch = () => {
        let searchTerm = term.current;
        onSearch(searchTerm)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    };

    return (
        <>
            <input type="text" onChange={handleTerm} onKeyDown={handleKeyDown}/>
            <button onClick={handleSearch}>검색</button>
        </>
    );
}