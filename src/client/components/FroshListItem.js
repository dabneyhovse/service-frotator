import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateRanking } from "../store/ranking";

import { Button } from "react-bootstrap";

function FroshListItem(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(updateRanking(props.frosh.id, 0));
  };

  return (
    <div
      key={props.frosh.id}
      className={
        "frosh-list-item container" +
        (props.offcanvas
          ? "col col-12 mt-2 offcanvasfrosh"
          : "col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12")
      }
    >
      <div
        onClick={() => {
          if (props.offcanvas) {
          } else {
            navigate(`/frotator/frosh/${props.frosh.id}`);
          }
        }}
        className="frosh-list-image"
        style={{
          backgroundImage: props.frosh.image
            ? `url(${props.frosh.image})`
            : "url(https://play-lh.googleusercontent.com/8ddL1kuoNUB5vUvgDVjYY3_6HwQcrg1K2fd_R8soD-e2QYj8fT9cfhfh3G0hnSruLKec)",
        }}
      >
        <div className="frosh-info">{props.frosh.displayName}</div>
        {props.offcanvas ? (
          <Button onClick={handleAdd}> Add To Big Bad </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default FroshListItem;
