import { memo } from "react";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";

function MoveIcons() {
  return (
    <div className="move-icons">
      <GoArrowLeft className="go-left" />
      <span className="move-span">Sürükle</span>
      <GoArrowRight className="go-right" />
    </div>
  );
}

export default memo(MoveIcons);
