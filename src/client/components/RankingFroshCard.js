import React from "react";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateRanking } from "../store/ranking";

function FroshListItem(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRankChange = (val) => () => {
    dispatch(updateRanking(props.frosh.id, props.frosh.rank + val));
  };

  return (
    <div key={props.frosh.id} className="rankingListFrosh">
      <div
        onClick={() => {
          navigate(`/frotator/frosh/${props.frosh.id}`);
        }}
        className="frosh-list-image col-4"
        style={{
          backgroundImage: props.frosh.image
            ? `url(${props.frosh.image})`
            : "url(https://play-lh.googleusercontent.com/8ddL1kuoNUB5vUvgDVjYY3_6HwQcrg1K2fd_R8soD-e2QYj8fT9cfhfh3G0hnSruLKec)",
        }}
      ></div>
      <div className="col-8 m-4">
        <h4>{props.frosh.displayName}</h4>
        <small>#{props.i}</small>
        <p>{props.frosh.anagram}</p>
        <ButtonToolbar>
          <ButtonGroup>
            <Button varient="warning" onClick={handleRankChange(1)}>
              Move Up
            </Button>
            <Button varient="warning" onClick={handleRankChange(-1)}>
              Move Down
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              onClick={handleRankChange(-1 - props.frosh.rank)}
              variant="danger"
            >
              Remove From Big Bad List
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      </div>
    </div>
  );
}

export default FroshListItem;
