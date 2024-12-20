import { useRef } from "react";

export default function SearchStudy({ onSearch }) {

    // 검색어, 검색 버튼, 검색어 넘기기

    // input의 값을 가져오기

    const term = useRef('');
    const type = useRef('toc_title_ko');

    const handleTerm = (e) => {
        term.current = e.target.value
    }

    const handleSearch = () => {
        let searchType = type.current;
        let searchTerm = term.current;
        onSearch(searchType, searchTerm)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    };

    const handleType = (e) => {
        type.current = e.target.value;
    }

    return (
        <>
            <select onChange={handleType}>
                <option value="toc_title_ko">학교 이름(한글)</option>
                <option value="related_schools">관련 학교(한글)</option>
            </select>

            <input type="text" onChange={handleTerm} onKeyDown={handleKeyDown}/>
            <button onClick={handleSearch}>검색</button>
        </>
    );
}