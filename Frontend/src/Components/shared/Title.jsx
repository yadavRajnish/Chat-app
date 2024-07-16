import React from "react";
import {Helmet} from "react-helmet-async"

const Title = ({
  title = "ChatApp",
  description = "This is ChatApp made by me",
}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={description}/>
    </Helmet>
  )
};

export default Title;
