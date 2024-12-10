import { useCallback, useRef } from "react"

export default function SearchBar({ onSearchParam }) {

    // 학교 이름 검색 
    // 저자
    // 관련 학교 
    // 정렬 

    const term = useRef("");
    const type = useRef("toc_title_ko");
    // const sortType = useRef("");
    // const isDesc = useRef(false);

    // 검색어 변경 핸들러
    const handleInputChange = (event) => {
        term.current = event.target.value;
    };

    // 타입 변경 핸들러
    const handleType = (e) => {
        type.current = e.target.value;
        handleSearch();
    }

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            // handleSearch()
        }
    };

   


    const searchParam = {
        term: "",
        type: 'title',
        sortType: "id",
        isDesc: false,
    };

    // 검색 버튼 클릭 시 작동하는 핸들러
    // searchParam 객체에 값 넣어서 List 컴포넌트로 전송
    const handleSearch = useCallback(() => {
        searchParam.term = term.current;
        searchParam.type = type.current;
        // searchParam.sortType = sortType.current;
        // searchParam.isDesc = isDesc.current;
        onSearchParam(searchParam);
    }, [onSearchParam]);

    // 정렬 핸들러
    // const handleSort = (newSortType) => {
    //     if (newSortType === sortType.current) {
    //         isDesc.current = !isDesc.current;
    //     } else {
    //         sortType.current = newSortType;
    //         isDesc.current = false;
    //     }
    //     handleSearch();
    // };

    return (
        <>
            <select onChange={handleType} value={type.current}>
                <option value="toc_title_ko">학교 이름</option>
                <option value="toc_authors">저자</option>
                <option value="related_schools.primaryname_ko">관련 학교</option>
            </select>
            
            <input
                type="text"
                placeholder="검색"
                onChange={handleInputChange}
                onKeyDown={onKeyPress}
            />
            <button onClick={handleSearch}>검색</button>

        </>
    )
}