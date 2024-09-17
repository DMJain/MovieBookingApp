import { useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OnFailure = () => {
    const movie = useSelector((state) => state.movie)
    const location = useSelector((state) => state.location) 
    const navigate = useNavigate();

    const handleNaviagte = () => {
        navigate(`/${location.location}/movies/${movie._id}/bookShow`)
    }

    return (
        <div className="flex justify-center items-center p-10 gap-10">
            <div className="flex flex-col gap-10">
            <div className="border border-error rounded-xl p-4">
                <div className="text-5xl text-error">
                    Payment Failed
                </div>
            </div>
            <div>
                Any ammount deducted will be refunded to source.
            </div>
            <div className="flex justify-center items-center">
                <button className="btn btn-success" onClick={handleNaviagte}>To Book Page</button>
            </div>
            </div>
        </div>
    )
}

export default OnFailure;