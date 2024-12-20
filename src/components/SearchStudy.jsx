import { useRef } from "react";

export default function SearchStudy({ onSearch, onSort }) {

    const term = useRef('');
    const type = useRef('toc_title_ko');
    const sortType = useRef('toc_id');
    const isDesc = useRef(false);

    const handleTerm = (e) => {
        term.current = e.target.value
    }

    const handleSearch = () => {
        const searchType = type.current;
        const searchTerm = term.current;

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

    // TODO 검색, 정렬은 따로 가야한다.

    // 검색창에 값을 넣을 때마다 term에 계속 반영된다

    // 정렬 타입을 따로 하는 것이 좋을까? 아니면 같이 handleSearch에 넣는 것이 좋을까?
    const handleSort = (e) => {
        sortType.current = e.target.value;
        // 현재와 반대로 되게 하기
        isDesc.current = !isDesc.current;

        onSort(sortType.current, isDesc.current);
    }

    return (
        <>
            <select onChange={handleType}>
                <option value="toc_title_ko">학교 이름(한글)</option>
                <option value="related_schools">관련 학교(한글)</option>
            </select>

            <input type="text" onChange={handleTerm} onKeyDown={handleKeyDown} />
            <button onClick={handleSearch}>검색</button>
{/* 오름, 내림 순서 표시 */}
            <div>
                <button value='toc_id' onClick={handleSort}>{isDesc.current ?  '학교 번호 ㅜ' : '학교 번호 ㅗ'} </button>
                <button value='toc_title_ko' onClick={handleSort}>{isDesc.current ?  '학교 이름(한글) ㅜ':'학교 이름(한글) ㅗ'}</button>
                <button value='related_schools' onClick={handleSort}>{isDesc.current ?  '관련 학교(한글) ㅜ':'관련 학교(한글) ㅗ'}</button>
            </div>
        </>
    );
}