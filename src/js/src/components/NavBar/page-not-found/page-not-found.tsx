import pageNotFoundImage from '../../../assets/404.png'

export const PageNotFound = () => {

    return (
        <div className="page_not_found">
            <div>
                <img src={pageNotFoundImage} alt="PAGE NOT FOUND"/>
            </div>
        </div>
    )
}