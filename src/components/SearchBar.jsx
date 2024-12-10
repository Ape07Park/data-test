import { useRef, useState } from "react"

export default function SearchBar({}) {

    // 학교 이름 검색 
    // 저자
    // 관련 학교 
    // 정렬 

    const [term, setTerm] = useRef("");
    // const [category, setCategory] = useRef("");

    // 검색어 변경 핸들러
    const handleInputChange = (event) => {
        term.current = event.target.value;
    };

    // 검색 버튼 클릭 시 작동하는 핸들러
    // searchParam 객체에 값 넣어서 List 컴포넌트로 전송
    // const handleSearch = useCallback(() => {
    //     searchParam.term = term.current;
    //     searchParam.type = type.current;
    //     searchParam.sortType = sortType.current;
    //     searchParam.isDesc = isDesc.current;
    //     onSearchParam(searchParam);
    // }, [onSearchParam]);

    // 카테고리 변경 핸들러
    // const handleType = (event) => {
    //     category.current = event.target.value;
    //     handleSearch();
    // };

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

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            // 검색
        }
    };

    return (
        <>
        <input
        type="text"
        placeholder="검색"
        value={term}
        onChange={handleInputChange}
        onKeyDown={onKeyPress}
        />

        </>
    )
}