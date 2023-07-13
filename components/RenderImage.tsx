import React from 'react';

const RenderImage = ({ imgBlock }) => {
  const { content } = imgBlock;

  console.log("content:")
  console.log(content)

  return <img src={content} alt="Image" />;
};

export default RenderImage;
