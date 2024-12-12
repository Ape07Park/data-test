import { useEffect, useState } from "react";
import axiosInstance from "../services/axios";


export default function Scroll() {

    const [page, setPage] = useState(1);
    const [originData, setOriginData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const[totalCnt, setTotalCnt] = useState(0);

    useEffect(() => {

        const getData = async () => {
            try{
                const response = await axiosInstance.get('data');
                const res = response.data;
                setOriginData(res);
                setTotalCnt(res.length);

            } catch (e){
                console.log(e);
            }
        }
        getData();
    }, []);

    return (
        <>
        <h1>무한 스크롤</h1>
        <p>총 개수: {totalCnt}</p>
        <div>
            {
            originData.map((data, i) => (
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
        </>
    );
}