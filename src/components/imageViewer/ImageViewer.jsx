import React, { useRef } from "react";
import "./imageViewer.css";
import { useChatStore } from "../../lib/chatStore";
import useClickOutside from "../customHooks/ClickOutside";

const ImageViewer = () => {
  const { imgSrc, changeImgViewerState } = useChatStore();
  const elementRef = useRef(null);

  const handleClose = () => {
    imgSrc ? changeImgViewerState() : null;
  };

  useClickOutside(elementRef, handleClose);

  return (
    <div className="main">
      <div className="closeButton">
        <img src="./plus.png" alt="" onClick={() => changeImgViewerState("")} />
      </div>

      {imgSrc && <img ref={elementRef} src={imgSrc} alt="" />}
    </div>
  );
};

export default ImageViewer;
