export default function TocItem({ data }) {
    return (
        <div>
            <ul>
                <li>학교 이름: {data.toc_id}</li>
                <li>학교 이름: {data.toc_title}</li>
                <li>학교 이름(한글): {data.toc_title_ko}</li>
                <li>저자: {data.toc_authors === null ? '없음' : data.toc_authors}</li>
                <li>관련 학교: {data.related_schools[0].primaryname}</li>
                <li>관련 학교(한글): {data.related_schools[0].primaryname_ko === null ? '없음' : data.related_schools[0].primaryname_ko}</li>
            </ul>
        </div>
    );
}
