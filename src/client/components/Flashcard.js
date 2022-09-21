import React, { useEffect, useState } from "react";
import cn from "classnames";

import "./flashcard.scss";

import { Container } from "react-bootstrap";

export default function Flashcard(props) {
  const [showBack, setShowBack] = useState(false);
  const handleClick = () => setShowBack(!showBack);

  useEffect(() => {
    setShowBack(false);
  }, props.frosh);


  return (
    <Container className="flip-card-outer" onClick={handleClick}>
      <div
        className={cn("flip-card-inner", {
          showBack,
        })}
      >
        {props.frosh ? (
          <>
            <div className="card front">
              <div className="card-body d-flex justify-content-center align-items-center">
                <div
                  className="card-image"
                  style={{ backgroundImage: `url(${props.frosh.image})` }}
                ></div>
              </div>
            </div>
            <div className="card back">
              <div className="card-body d-flex flex-column text-center justify-content-center align-items-center">
                <p className="card-text fs-1 fw-bold">
                  {props.frosh.displayName}
                </p>
                <small className="card-text">{props.frosh.pronouns}</small>
                <p className="card-text">"{props.frosh.bio.funfact}"</p>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </Container>
  );
}
