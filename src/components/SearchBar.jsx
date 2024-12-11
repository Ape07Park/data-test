import { useCallback, useRef } from "react"

export default function SearchBar({ onSearchParam }) {

    // 학교 이름 검색 
    // 저자
    // 관련 학교 
    // 정렬 

    const term = useRef("");
    const type = useRef("toc_title_ko");

    // 타입에 따른 정렬
    const sortType = useRef("");
    const isDesc = useRef(false);


    // TODO 카테고리 변경은 검색 클릭 시 작동하도록 하기

    // 검색어 변경 핸들러
    const handleInputChange = (event) => {
        term.current = event.target.value;
    };

    // 타입 변경 핸들러
    const handleType = (e) => {
        type.current = e.target.value;
        // 검색 버튼 클릭 시 타입 전송 
        // handleSearch()
    }

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 검색 버튼 클릭 시 작동하는 핸들러
    // searchParam 객체에 값 넣어서 List 컴포넌트로 전송
    const handleSearch = useCallback(() => {
        const searchParam = {
            term: term.current,
            type: type.current,
            sortType: sortType.current,
            isDesc: isDesc.current,
        };
        
        onSearchParam(searchParam)
    }, [onSearchParam]);

    // 정렬 핸들러
    const handleSort = (newSortType) => {
        if (newSortType === sortType.current) {
            isDesc.current = !isDesc.current;
        } else {
            sortType.current = newSortType;
            isDesc.current = false;
        }
        handleSearch();
    };

    return (
        <>
            <select onChange={handleType}>
                <option value="toc_title_ko">학교 이름</option>
                <option value="toc_authors">저자</option>
                <option value="related_schools">관련 학교</option>
            </select>

            <input
                type="text"
                placeholder="검색"
                onChange={handleInputChange}
                onKeyDown={onKeyPress}
            />
            <button onClick={handleSearch}>검색</button>

            <div>
                <button
                    onClick={() => handleSort('toc_title_ko')}
                >
                    학교 이름 순 정렬 {sortType.current === 'toc_title_ko' && (isDesc.current ? '↓' : '↑')}
                </button>

                <button
                    onClick={() => handleSort('toc_authors')}
                >
                    이름 순 정렬 {sortType.current === 'toc_authors' && (isDesc.current ? '↓' : '↑')}
                </button>

                <button
                    onClick={() => handleSort('related_schools')}
                >
                    관련 학교 순 정렬 {sortType.current === 'related_schools' && (isDesc.current ? '↓' : '↑')}
                </button>
            </div>

        </>
    )
}