import React from 'react';

const RenderImage = ({ imgBlock }) => {
  const { content } = imgBlock;

  return <img src={content} alt="Image" />;
};

export default RenderImage;
