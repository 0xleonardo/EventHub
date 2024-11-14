import pageNotFoundImage from '../../../assets/403.png'

export const Forbidden = () => {

    return (
        <div className="page_not_found">
            <div>
                <img src={pageNotFoundImage} alt="FORBIDDEN"/>
            </div>
        </div>
    )
}