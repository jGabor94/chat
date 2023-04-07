import { useLocation } from "react-router-dom";


function SuccessPage(){

    const { state: { msg } = {} } = useLocation();

    return (
        <div className="d-flex flex-column align-items-center text-success">
            <p className="fs-5 fw-bolder m-0">{msg}</p>
            <p className="fs-6 fw-bold">(A megerősítő linket elküldtük az email címedre)</p>
            <img src="/success.png" style={{maxWidth: "60px"}} ></img>
        </div>
    )
}

export default SuccessPage