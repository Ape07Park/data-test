import { useEffect, useRef, useState } from "react";
import axiosInstance from "../services/axios";
import SearchStudy from "../components/SearchStudy";

export default function Scroll() {

    const limit = 10;
    const [page, setPage] = useState(1);
    const [originData, setOriginData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [totalCnt, setTotalCnt] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(true);
    const observerRef = useRef(null);
    const index = useRef(0);
    const [sortType, setSortType] = useState('toc_id');
    const [isDesc, setIsDesc] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axiosInstance.get('data');
                const res = await response.data;
                setOriginData(res);
                setTotalCnt(res.length);
                const initialData = res.slice(0, limit);
                setFilteredData(initialData);
                index.current = 10;
            } catch (e) {
                console.log(e);
            }
        }
        getData();
    }, []);

    // 관찰자 설정
    useEffect(() => {
        // 콜백 함수
        const onIntersection = (entries) => {
            entries.forEach((entry) => {
                let firstEntry = entry
                if (firstEntry.isIntersecting === true && hasNextPage === true) {
                    getMoreData();
                }
            })
        }
        const observer = new IntersectionObserver(onIntersection);

        if (observerRef.current !== null) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
            observer.disconnect();
        };
        // 처음 실행 시에는 originData에 값이 없다. 이유는 비동기라 나중에 채워짐 그래서 getMoreData를 해도 originData에 값이 없어 작동 x 
        // 그러나 page가 올라가서 리랜더링이 발생하고 useEffect의 함수가 다시 실행될 때는 originData에 값이 있는 상태라 작동한다.
    }, [hasNextPage, page])

    // 추가 데이터 가져오기
    const getMoreData = async () => {

        if (hasNextPage === true) {
            // *처음 랜더링 시에는 비동기로 인해 originData가 빈 배열이다.
            const startIndex = index.current;
            const endIndex = index.current + limit
            const moreData = originData.slice(startIndex, endIndex);
            setFilteredData(prevData => [...prevData, ...moreData])
            index.current = endIndex;
            setPage(page + 1);

            // 처음 랜더링 시 totalCnt가 0으로 나옴, 그래서 totalCnt !== 0 추가함
            // 현제 인덱스와 총 아이템 개수를 비교
            if (totalCnt < index.current && totalCnt !== 0) {
                setHasNextPage(false)
            }
        } else {
            setHasNextPage(false);
        }
    }

    // 검색 수행
    const handleSearch = (type, term) => {
        // originData에서 검색어에 맞는 거만 골라서 꺼내기
        setPage(1);
        let searchData = null;

        if (type === "related_schools") {
            searchData = originData.filter(data =>
                data.related_schools[0].primaryname_ko.includes(term)
            )

        } else {
            searchData = originData.filter(data =>
                data[type].includes(term)
            )
        }

        // 타입에 맞게 데이터 필터링 하기

        setFilteredData(searchData);
        setTotalCnt(searchData.length);
        //
        setHasNextPage(searchData.length > limit);
    }

    return (
        <>
            <h1>무한 스크롤</h1>
            <SearchStudy onSearch={handleSearch} />
            <p>총 개수: {totalCnt}</p>
            <div>
                {
                    filteredData.map((data, i) => (
                        <ul key={i}>
                            <li>학교 번호: {data.toc_id}</li>
                            <li>학교 이름: {data.toc_title}</li>
                            <li>학교 이름(한글): {data.toc_title_ko}</li>
                            <li>저자: {data.toc_authors === null ? '없음' : data.toc_authors}</li>
                            <li>관련 학교: {data.related_schools[0].primaryname}</li>
                            <li>관련 학교(한글): {data.related_schools[0].primaryname_ko === null ? '없음' : data.related_schools[0].primaryname_ko}</li>
                        </ul>
                    ))
                }
            </div>

            <div ref={observerRef}>로딩 중...</div>

            {hasNextPage === false &&
                <div>모든 데이터가 랜더링 되었습니다.</div>
            }
        </>
    );
}