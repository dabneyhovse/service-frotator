import React, { useEffect, useState } from "react";
import cn from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Container, Button, ButtonGroup, Form } from "react-bootstrap";

import { fetchFrosh } from "../store/frosh";

export default function FlashCards() {
  // probably dont use the search reducer, just use a
  // state hook: useState(), since it is the only param
  // of interest and should probably be seperate from the main search
  const { frosh } = useSelector((state) => ({
    frosh: state.frotator.frosh.cards.filter((f) => f.image !== null),
  }));

  const [search, setSearch] = useState({});

  const [selectedFrosh, setSelectedFrosh] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    // cards are an extra modifier to the search that
    // does not impact the actual frosh found in the query,
    // so I had it seperate, this could be changed, as its a matter of style
    dispatch(fetchFrosh({ search, cards: true }));
  }, []);

  const onChange = (event) => {
    event.preventDefault();
    setSearch({
      cards: true,
      dinnerGroup: event.target.value,
    });
    dispatch(
      fetchFrosh({
        search: { dinnerGroup: event.target.value },
        cards: true,
      })
    );
    setSelectedFrosh(0);
    setShowBack(false);
  };

  const goToPreviousFrosh = () => {
    setShowBack(false);
    if (selectedFrosh == 0) {
      setSelectedFrosh(frosh.length - 1);
      return;
    }
    setSelectedFrosh(selectedFrosh - 1);
  };

  const goToNextFrosh = () => {
    setShowBack(false);
    if (selectedFrosh == frosh.length - 1) {
      setSelectedFrosh(0);
      return;
    }
    setSelectedFrosh(selectedFrosh + 1);
  };

  const keyHandler = (event) => {
    // Left arrow
    if (event.keyCode == 37) {
      goToPreviousFrosh();
    }
    // Right arrow
    else if (event.keyCode == 39) {
      goToNextFrosh();
    }
    // Up or down arrow
    else if (event.keyCode == 38 || event.keyCode == 40) {
      setShowBack(!showBack);
    }
  };

  const handleClick = () => setShowBack(!showBack);

  return (
    <Container
      autoFocus
      className="flash-card-container"
      onKeyDown={(e) => keyHandler(e)}
    >
      <Form>
        <Form.Group>
          <Form.Select
            onChange={onChange}
            name="dinnerGroup"
            value={search.dinnerGroup}
          >
            <option value="any">Any Dinner</option>
            <option value="A">Dinner A</option>
            <option value="B">Dinner B</option>
            <option value="C">Dinner C</option>
            <option value="D">Dinner D</option>
            <option value="E">Dinner E</option>
            <option value="F">Dinner F</option>
            <option value="G">Dinner G</option>
            <option value="H">Dinner H</option>
          </Form.Select>
        </Form.Group>
      </Form>

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
        <Button onClick={goToPreviousFrosh}>Previous Frosh</Button>
        <Button onClick={goToNextFrosh}>Next Frosh</Button>
      </ButtonGroup>
    </Container>
  );
}
