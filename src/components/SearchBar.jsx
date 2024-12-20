import { useCallback, useRef } from "react"

export default function SearchBar({ onSearchParam }) {

    // input의 값을 관리할 ref
    const inputRef = useRef(null);

    // 실제 검색에 사용될 term ref
    const searchTerm = useRef("");
    const type = useRef("toc_title_ko");

    // 정렬을 위한 ref
    const sortType = useRef("");
    const isDesc = useRef(false);

    // 타입 변경 핸들러
    const handleType = (e) => {
        type.current = e.target.value;
    }

    // Enter 키 처리
    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    /**
     * 검색 실행 함수
     * 검색 버튼을 클릭하거나 Enter를 눌렀을 때만 실행
     */
    const handleSearch = useCallback(() => {
        searchTerm.current = inputRef.current.value;  // input의 현재 값을 검색어로 설정

        const searchParam = {
            term: searchTerm.current,
            type: type.current,
            sortType: sortType.current,
            isDesc: isDesc.current,
        };

        onSearchParam(searchParam);
    }, [onSearchParam]);

    /**
     * 정렬 실행 함수
     * 정렬 시에는 마지막으로 검색된 term을 사용
     */
    const handleSort = (newSortType) => {
        if (newSortType === sortType.current) {
            isDesc.current = !isDesc.current;
        } else {
            sortType.current = newSortType;
            isDesc.current = false;
        }

        const searchParam = {
            term: searchTerm.current,  // 마지막으로 검색된 term 사용
            type: type.current,
            sortType: sortType.current,
            isDesc: isDesc.current,
        };

        onSearchParam(searchParam);
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
                ref={inputRef}
                onKeyDown={onKeyPress}
            />
            <button onClick={handleSearch}>검색</button>

            <div>
                <button onClick={() => handleSort('toc_title_ko')}>
                    학교 이름 순 정렬 {sortType.current === 'toc_title_ko' && (isDesc.current ? '↓' : '↑')}
                </button>

                <button onClick={() => handleSort('toc_authors')}>
                    작가 순 정렬 {sortType.current === 'toc_authors' && (isDesc.current ? '↓' : '↑')}
                </button>

                <button onClick={() => handleSort('related_schools')}>
                    관련 학교 순 정렬 {sortType.current === 'related_schools' && (isDesc.current ? '↓' : '↑')}
                </button>
            </div>
        </>
    )
}