import { useEffect, useState } from "react";
import axiosInstance from "../services/axios";

export default function Scroll() {

    const [page, setPage] = useState(1);
    const [tocData, setTocData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(true);

    const limit = 10;

    // 데이터 불러오는 api
    const getData = async (page) => {
        try {
            const response = await axiosInstance.get(`data?_page=${page}&_limit=${limit}`);
            const res = response.data;
            const totalCount = parseInt(response.headers['x-total-count'], 10);
            setTocData(prevData => [...prevData, ...res]);
            setTotalCount(totalCount);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getData(page);
        setHasNextPage(tocData < totalCount)
    }, [page]);

    /**
     * div 높이가 ~~ 되면 데이터 가져오는 api 호출
     * api 호출 시 현재 위치 확인해 마지막 페이지면 그냥 return 하기 
     */

    useEffect(() => {
        const handleScroll = () => {
            // 화면에 보이는 거 + 세로 스크롤 위치 (현재 보이는 영역의 가장 아래 부분의 위치) >= 문서 전체 높이

            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {  
                if(hasNextPage === true)  {
                    setPage(prevPage => prevPage + 1);
                } else {
                    return;
                }
            }
        };
        
        window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }, []);

    return (
        <>
            <h2 style={{ textAlign: 'center' }}>스크롤 연습</h2>
            <div>검색 결과: {totalCount}</div>

            <div>
                {tocData.map((data, i) => (
                    <ul key={i}>
                        <li>{data.toc_id}</li>
                        <li>{data.toc_title_ko}</li>
                    </ul>
                ))}
            </div>
            
        </>
    );
}