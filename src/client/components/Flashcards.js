import React, { useEffect, useState } from "react";
import cn from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Container, Button, ButtonGroup, Form } from "react-bootstrap";

import { fetchFrosh, setSearch } from "../store/frosh";

export default function FlashCards() {
  const { frosh, search } = useSelector((state) => ({
    frosh: state.frotator.frosh.cards, //.filter((f) => f.image !== null),
    search: state.frotator.frosh.search,
  }));

  const [selectedFrosh, setSelectedFrosh] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFrosh({ ...search, cards: true }));
  }, []);

  const onChange = (event) => {
    event.preventDefault();
    dispatch(
      setSearch({
        ...search,
        cards: true,
        [event.target.name]: event.target.value,
      })
    );
    dispatch(
      fetchFrosh({
        ...search,
        cards: true,
        [event.target.name]: event.target.value,
      })
    );
    setSelectedFrosh(0);
    setShowBack(false);
  };

  console.log(frosh[0]);

  const handleClick = () => setShowBack(!showBack);

  return (
    <Container className="flash-card-container">
      <Form>
        <Form.Group>
          <Form.Label>Dinner Group</Form.Label>
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
