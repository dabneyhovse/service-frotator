import React from "react";
import { useNavigate } from "react-router-dom";

function FroshListItem(props) {
  const navigate = useNavigate();
  return (
    <div
      key={props.frosh.id}
      className="frosh-list-item co-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 container"
    >
      <div
        onClick={() => {
          navigate(`/frotator/frosh/${props.frosh.id}`);
        }}
        className="frosh-list-image"
        style={{
          backgroundImage: props.frosh.image
            ? `url(${props.frosh.image})`
            : "url(https://play-lh.googleusercontent.com/8ddL1kuoNUB5vUvgDVjYY3_6HwQcrg1K2fd_R8soD-e2QYj8fT9cfhfh3G0hnSruLKec)",
        }}
      >
        <div className="frosh-info">{props.frosh.displayName}</div>
      </div>
    </div>
  );
}

export default FroshListItem;
