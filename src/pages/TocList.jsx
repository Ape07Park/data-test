import { useEffect, useState } from "react";
import axiosInstance from "../services/axios";
import TocItem from "./TocItem";
import SearchBar from "../components/SearchBar";

export default function TocList() {
    const [page, setPage] = useState(1);
    const [tocData, setTocData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [term, setTerm] = useState("");
    const [type, setType] = useState("toc_title_ko")

    const limit = 10;

    // 데이터 불러오는 api
    const getData = async (page, searchTerm = "") => {
        try {
            const searchQuery = searchTerm ? `&q=${searchTerm}` : "";
            const response = await axiosInstance.get(`data?_page=${page}&_limit=${limit}${searchQuery}`);
            const res = response.data;
            const totalCount = parseInt(response.headers['x-total-count'], 10);
            
            if (page === 1) {
                setTocData(res);
            } else {
                setTocData(prevData => [...prevData, ...res]);
            }
            
            setTotalCount(totalCount);
            setHasNextPage(tocData.length < totalCount);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getData(page, term);
    }, [page, term]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {  
                if(hasNextPage === true) {
                    setPage(prevPage => prevPage + 1);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasNextPage]);

    const handleSearch = (searchTerm) => {
        setTerm(searchTerm.term);
        setType(searchTerm.type);
        setPage(1); 

         console.log(type);
         
    };

    return (
        <>
            <h2 style={{ textAlign: 'center' }}>책 목차 리스트</h2>
            <div>검색 결과: {totalCount}</div>
            <SearchBar
                onSearchParam={handleSearch}
            />
            <div>
                {tocData.map((data, i) => (
                    <TocItem key={`${data.toc_id}-${i}`} data={data} />
                ))}
            </div>
            {!hasNextPage && <div style={{ textAlign: 'center', padding: '20px' }}>더 이상 데이터가 없습니다.</div>}
        </>
    );
}