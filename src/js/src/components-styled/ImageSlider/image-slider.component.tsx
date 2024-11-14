import {CSSProperties, useState} from "react";

const slideStyles = {
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundColor: "white",
    backgroundRepeat: "no-repeat"
} as CSSProperties;

const rightArrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translate(0, -50%)",
    right: "32px",
    fontSize: "45px",
    color: "#fff",
    zIndex: 1,
    cursor: "pointer",
} as CSSProperties;

const leftArrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translate(0, -50%)",
    left: "32px",
    fontSize: "45px",
    color: "#fff",
    zIndex: 1,
    cursor: "pointer",
} as CSSProperties;

const sliderStyles = {
    position: "relative",
    height: "100%",
} as CSSProperties;

const dotsContainerStyles = {
    display: "flex",
    justifyContent: "center",
} as CSSProperties;

const dotStyle = {
    position: "relative",
    margin: "-25px 3px",
    cursor: "pointer",
    fontSize: "20px",
} as CSSProperties;

const activeDotStyle = {
    position: "relative",
    margin: "-25px 3px",
    cursor: "pointer",
    fontSize: "20px",
    color: "red",
} as CSSProperties;

export interface Slide {
    url: string;
}

interface ImageSliderProps {
    slides: Slide[]
    arrowsColor?: string;
}

const containerStyles = {
    width: "100%",
    height: "480px",
    margin: "0 auto",
} as CSSProperties;

const ImageSlider = (props: ImageSliderProps) => {

    const {slides} = props;

    const [currentIndex, setCurrentIndex] = useState(0);

    if (slides.length === 0) {
        return <h1>No Preview</h1>
    }

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };
    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };
    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };
    const slideStylesWidthBackground = {
        ...slideStyles,
        backgroundImage: `url(${slides[currentIndex].url})`,
    };

    const isOneImageOnly = props.slides.length === 1;

    return (
        <div style={containerStyles}>
            <div style={sliderStyles}>
                <div>
                    <div onClick={goToPrevious} style={{...leftArrowStyles, color: props.arrowsColor}}
                         hidden={isOneImageOnly}>
                        ❰
                    </div>
                    <div onClick={goToNext} style={{...rightArrowStyles, color: props.arrowsColor}}
                         hidden={isOneImageOnly}>
                        ❱
                    </div>
                </div>
                <div style={slideStylesWidthBackground}></div>
                <div style={dotsContainerStyles}>
                    {slides.map((slide, slideIndex) => (
                        <div
                            style={currentIndex === slideIndex ? activeDotStyle : dotStyle}
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                        >
                            ●
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageSlider;