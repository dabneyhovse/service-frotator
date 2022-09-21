import React, { useEffect, useState } from "react";
import cn from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Container, Button, ButtonGroup } from "react-bootstrap";

import { fetchFrosh } from "../store/frosh";

export default function FlashCards() {
  const [selectedFrosh, setSelectedFrosh] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFrosh({ cards: true }));
  }, []);

  const { frosh } = useSelector((state) => ({
    frosh: state.frotator.frosh.cards.filter((f) => f.image !== null),
  }));

  const handleClick = () => setShowBack(!showBack);

  return (
    <Container className="flash-card-container">
      <Container className="flip-card-outer" onClick={handleClick}>
        <div
          className={cn("flip-card-inner", {
            showBack,
          })}
        >
          {frosh[selectedFrosh] ? (
            <>
              <div className="card front">
                <div className="card-body d-flex justify-content-center align-items-center">
                  <div
                    className="card-image"
                    style={{
                      backgroundImage: `url(${frosh[selectedFrosh].image})`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="card back">
                {showBack ? (
                  <div className="card-body d-flex flex-column text-center justify-content-center align-items-center">
                    <p className="card-text fs-1 fw-bold">
                      {frosh[selectedFrosh].displayName}
                    </p>
                    <small className="card-text">
                      {frosh[selectedFrosh].pronouns}
                    </small>
                    <p className="card-text">
                      "{frosh[selectedFrosh].bio.funfact}"
                    </p>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </Container>

      <ButtonGroup>
        <Button
          onClick={() => {
            setShowBack(false);
            if (selectedFrosh == 0) {
              setSelectedFrosh(frosh.length - 1);
              return;
            }
            setSelectedFrosh(selectedFrosh - 1);
          }}
        >
          Previous Frosh
        </Button>
        <Button
          onClick={() => {
            setShowBack(false);
            if (selectedFrosh == frosh.length - 1) {
              setSelectedFrosh(0);
              return;
            }
            setSelectedFrosh(selectedFrosh + 1);
          }}
        >
          Next Frosh
        </Button>
      </ButtonGroup>
    </Container>
  );
}
