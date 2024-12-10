import { useEffect, useState, useRef } from "react";
import axiosInstance from "../services/axios";
import TocItem from "./TocItem";
import SearchBar from "../components/SearchBar";

export default function TocList() {
    const [tocData, setTocData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [pageParams, setPageparams] = useState([]);
    const [page, setPage] = useState(1);
    const observerRef = useRef();
    const limit = 20;

    const getData = async (page) => {
        if (pageParams.includes(page)) {
            return;
        }

        setLoading(true);

        try {
            const response = await axiosInstance.get(`data?_page=${page}&_limit=${limit}`);
            const res = response.data;
            const totalCount = parseInt(response.headers['x-total-count'], 10);
            setTocData(prevData => [...prevData, ...res]);
            setTotalCount(totalCount);
            setPageparams((prev) => [...prev, page]);
            setHasNextPage(totalCount > tocData.length + res.length); 
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData(page);
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const firstEntry = entries[0];

            if (firstEntry.isIntersecting && !loading && hasNextPage) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (observerRef.current) {
            observer.observe(observerRef.current);
        }
        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [loading, hasNextPage]);

    return (
        <>
            <h2 style={{ textAlign: 'center' }}>책 목차 리스트</h2>
            <div>검색 결과: {totalCount}</div>
            <SearchBar />
            <div>
                {tocData.map((data, i) => (
                    <TocItem key={`${data.toc_id}-${i}`} data={data} />
                ))}
            </div>
            <div ref={observerRef}>Loading...</div>
        </>
    );
}
