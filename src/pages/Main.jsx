import { useNavigate } from "react-router-dom"

export default function Main () {
    
    const navigate = useNavigate();

    const handleMove = () => {
        navigate('/list')
    }

    return (
        <>

        <h1>메인 페이지</h1>

        <button onClick={handleMove}>리스트로 이동</button>
        </>
    )
}