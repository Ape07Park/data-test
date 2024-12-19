import { useEffect, useRef, useState } from "react";
import axiosInstance from "../services/axios";
import TocItem from "./TocItem";
import SearchBar from "../components/SearchBar";

export default function TocList() {

    const limit = 10;

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [origianlTocData, setOrigianlTocData] = useState([]);
    const [filteredTocData, setFilteredTocData] = useState([]);

    const [totalCount, setTotalCount] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(true);

    const [term, setTerm] = useState("");
    const [type, setType] = useState("toc_title_ko")

    const [sortType, setSortType] = useState("");
    const [isDesc, setIsDesc] = useState(false);

    const observeTarget = useRef();

    /**
     * 
     * 데이터 불러와서 원본을 원 배열에 넣기
     * 검색, 무한 스크롤 시 필터 배열 만들어서 처리
     * 
     */

    // 데이터 불러오는 api
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axiosInstance.get('data');
                const res = response.data;

                setOrigianlTocData(res);
                setTotalCount(res.length);

                // 배열에서 첫 데이터 가져오기
                const initialData = res.slice(0, limit);
                setFilteredTocData(initialData);
                // 데이터 재대로 있나 확인
                setHasNextPage(res.length > limit);

            }
            catch (e) {
                console.log(e);
            }
        };
        getData();
    }, []);

    /**
      * 바닥에 도착했음을 감지하고 무한 스크롤 호출
      */
    // 감시 객체 생성, 감시 시작

    useEffect(() => {
        const handleObserver = (entries) => {
            const target = entries[0];
            // 감시 객체가 감시하고 있는지 
            if (target.isIntersecting === true && hasNextPage === true && loading === false) {
                infiniteScroll();
            }
        };

        // 감시 객체 생성
        const observer = new IntersectionObserver(handleObserver);

        // 감시
        if (observeTarget.current) {
            observer.observe(observeTarget.current);
        }

        // 감시 해제,  cleanup 함수
        return () => {
            if (observeTarget.current) {
                observer.unobserve(observeTarget.current);
            }
        };

    }, [hasNextPage, loading, page]);

    /**
     * 무한 스크롤
     */
    const infiniteScroll = () => {

        setLoading(true);
        /**
         * 데이터 가져오기
         */

        // 데이터 인덱스
        const startIndex = page * limit;
        const endIndex = startIndex + limit;

        // 검색어 있을경우 필터링 
        if (term.length !== 0) {

            // 필터링된 데이터
            let filtered = origianlTocData.filter(item =>
                item[type].includes(term)
            );

            // 정렬
            let sortedData = sortData(filtered, sortType, isDesc);

            setOrigianlTocData(sortedData)
        } else {
            setOrigianlTocData(origianlTocData)
        }

        // 불러올 부분 데이터
        const nextData = origianlTocData.slice(startIndex, endIndex);

        // 불러올 데이터 있을 시
        if (nextData.length > 0) {
            // 이전에 있던 것에 불러오는 부분
            setFilteredTocData(currData => [...currData, ...nextData]);

            // 다음 데이터 불러올 때마다 페이지 +1
            setPage(currPage => currPage + 1);

            setHasNextPage(endIndex < origianlTocData.length);

        } else {
            setHasNextPage(false);
        }
        setLoading(false);
    };

    /**
     * 검색 기능
     * @param {*} searchParams 검색 관련 객체
     */
    const handleSearch = (searchParams) => {

        setTerm(searchParams.term);
        setType(searchParams.type);
        setPage(1);

        // TODO: 검색어 없을 시 정렬만 따로 뺴야하나?

        console.log(searchParams.term.length);

        console.log(searchParams.sortType.length);
        
        

        // 검색어가 없고 정렬만 할 경우
        if(searchParams.term.length === 0 && searchParams.sortType.length !== 0){
            setFilteredTocData(origianlTocData.slice(0, limit));
            setTotalCount(origianlTocData.length);
            setHasNextPage(origianlTocData.length > limit);
            sortData(origianlTocData, searchParams.sortType, searchParams.isDesc)
            return;
        }

         // 검색어가 없을 경우
        else if (searchParams.term === 0) {
            setFilteredTocData(origianlTocData.slice(0, limit));
            setTotalCount(origianlTocData.length);
            setHasNextPage(origianlTocData.length > limit);
            return;
        } 

        // 검색어도 없고 버튼 클릭도 없을 경우

        // 카테고리에 따라 달라지는 데이터 넣기 위함
        let filtered = null;

        if (searchParams.type === 'related_schools') {

            // 관련 학교 검색 시
            filtered = origianlTocData.filter(item =>
                item[searchParams.type][0].primaryname_ko.includes(searchParams.term)
            );

        } else {
            // 관련 학교외 나머지 검색 시
            filtered = origianlTocData.filter(item =>
                item[searchParams.type].includes(searchParams.term)
            );
        }

        // 카테고리로 검색한 데이터 정렬기능
        filtered = sortData(filtered, searchParams.type, searchParams.isDesc);

        setFilteredTocData(filtered);
        setTotalCount(filtered.length);
        // 무한 스크롤 스탑
        setHasNextPage(filtered.length > limit);
    };

    /**
     * 데이터 정렬
     * @param {*} data 데이터
     * @param {*} sortType 정렬 타입
     * @param {*} isDesc 내림차순 여부
     * 
     */
    const sortData = (data, sortType, isDesc) => {
        return data.sort((a, b) => {

            // 정렬 기준
            let comparison = 0;

            switch (sortType) {
                case 'toc_title_ko':
                    comparison = a.toc_title_ko.localeCompare(b.toc_title_ko, 'ko');
                    break;

                case 'toc_authors':
                    comparison = a.toc_authors.localeCompare(b.toc_authors, 'ko');
                    break;

                case 'related_schools':
                    comparison = a.related_schools[0].primaryname_ko.localeCompare(b.related_schools[0].primaryname_ko, 'ko');
                    break;

                // 정렬 x
                default:
                    return 0;
            }

            // 내림차순이면 원래 정렬에서 반대로
            return isDesc ? -comparison : comparison;
        });
    };

    return (
        <>
            <h2 style={{ textAlign: 'center' }}>책 목차 리스트</h2>
            <div>검색 결과: {totalCount}</div>
            <SearchBar
                onSearchParam={handleSearch}
            />

            <div>
                {filteredTocData.map((data, i) => (
                    <TocItem key={`${data.toc_id}-${i}`} data={data} />
                ))}
            </div>

            {loading && <div>Loading more items...</div>}

            <div ref={observeTarget}></div>
            {!hasNextPage && <div style={{ textAlign: 'center', padding: '20px' }}>더 이상 데이터가 없습니다.</div>}
        </>
    );
}