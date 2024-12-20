import { useRef } from "react";

export default function SearchStudy({ onSearch }) {

    // 정렬 기준 선택 - 정렬 기준 넘기기 - 기준에 맞게 정렬하기
    
    const term = useRef('');
    const type = useRef('toc_title_ko');
    const sortType = useRef('toc_id');
    const isDesc = useRef('false');

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
            handleSearch();
        }
    };

    const handleType = (e) => {
        type.current = e.target.value;
    }

    // 정렬 타입을 따로 하는 것이 좋을까? 아니면 같이 handleSearch에 넣는 것이 좋을까?
    const handleSort = (e) => {
        sortType.current = e.target.value;
    }

    return (
        <>
            <select onChange={handleType}>
                <option value="toc_title_ko">학교 이름(한글)</option>
                <option value="related_schools">관련 학교(한글)</option>
            </select>

            <input type="text" onChange={handleTerm} onKeyDown={handleKeyDown} />
            <button onClick={handleSearch}>검색</button>

            <div>
                <button value='toc_id' onClick={handleSort}>학교 번호</button>
                <button value='toc_title_ko'>학교 이름(한글)</button>
                <button value='related_schools'>관련 학교(한글)</button>
            </div>
        </>
    );
}