import {observer} from "mobx-react";
import React from "react";
import "./style.css"

interface Props {
    heading: string;
    content: string;
}

export const FooterPageTemplate = observer((props: Props) => {
    return (
        <div className="footer-page">
            <div className="section-one">
                <div className="heading">
                    {props.heading}
                </div>
            </div>
            <div className="content">
                <div className="ck-content" dangerouslySetInnerHTML={{__html: props.content}}>
                </div>
            </div>
        </div>
    );
})