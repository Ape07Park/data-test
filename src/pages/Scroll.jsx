import { useEffect, useRef, useState } from "react";
import axiosInstance from "../services/axios";


export default function Scroll() {

    /**
     * 무한 스크롤 구현 시 필요한 거
     * 1) 데이터 10개씩 가져오기
     * 2) 바닥에 닿았다는 기준
     * 3) 
     */

    const limit = 10;
    const [page, setPage] = useState(1);
    const [originData, setOriginData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [totalCnt, setTotalCnt] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(true);
    const observerRef = useRef(null);
    const index = useRef(0);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axiosInstance.get('data');
                const res = response.data;

                // 이거는 배열에 넣기 위함이지 조작을 위한 데이터가 아님
                setOriginData(res);
                setTotalCnt(res.length);

                setFilteredData(res.slice(0, limit));
                index.current = 10;

                // 데이터 10개 씩 쪼개기
                // 쪼갠 데이터 10개 씩 보여주기
            } catch (e) {
                console.log(e);
            }
        }
        getData();
    }, []);

    // 관찰자 설정
    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection)

        if (observerRef.current !== null) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observer.isIntersecting) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [hasNextPage])


    // 콜백 함수
    const onIntersection = (entries) => {
        entries.forEach((entry) => {
            let firstEntry = entry
            if (firstEntry.isIntersecting) {
                getMoreData();
            }
        })
    }

    // 추가 데이터 가져오기
    const getMoreData = () => {
        if (hasNextPage === true){
            setPage(page + 1);
            let moreData = originData.slice(index.current, index.current + 10);
            setFilteredData(prevData => [...prevData], [...moreData])
            index.current = index.current + 10;
        } else{
            setHasNextPage(false);
        }
    }

    // 데이터 10개 추가로 가져오기
    return (
        <>
            <h1>무한 스크롤</h1>
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