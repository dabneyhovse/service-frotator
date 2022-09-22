import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, Accordion, Form, Button } from "react-bootstrap";
import FroshList from "./FroshList";
import { fetchFrosh, froshListSetPage, setSearch } from "../store/frosh";

export default function FroshListMain(props) {
  const { frosh, page, count, search } = useSelector((state) => ({
    frosh: state.frotator.frosh.list,
    count: state.frotator.frosh.count,
    page: state.frotator.frosh.page,
    search: state.frotator.frosh.search,
  }));

  const dispatch = useDispatch();
  const handlePageMove = (newPage) => (event) => {
    dispatch(froshListSetPage(newPage));
    dispatch(fetchFrosh({ search, pageNum: newPage }));
  };

  const before = page == 1 ? "disabled" : "";
  const after = page == count ? "disabled" : "";

  const onChange = (event) => {
    dispatch(setSearch({ ...search, [event.target.name]: event.target.value }));
  };

  const onSearch = (event) => {
    event.preventDefault();
    dispatch(froshListSetPage(1));
    dispatch(fetchFrosh({ search, pageNum: 1 }));
  };

  return (
    <div className="mainContent">
      <h1>Prefr*sh List</h1>

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Search Options</Accordion.Header>
          <Accordion.Body>
            <Form>
              <Form.Group className="mb-3" controlId="searchFormName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  onChange={onChange}
                  name="name"
                  type="name"
                  placeholder="Enter Name"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Dinner Group</Form.Label>
                <Form.Select onChange={onChange} name="dinnerGroup">
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

              <Button
                className="mt-3"
                onClick={onSearch}
                variant="primary"
                type="submit"
              >
                Search
              </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <FroshList frosh={frosh} />
      {count == 0 ? (
        ""
      ) : (
        <Pagination className="d-flex justify-content-center">
          <Pagination.First className={before} onClick={handlePageMove(1)} />
          <Pagination.Prev
            className={before}
            onClick={handlePageMove(page - 1)}
          />
          {before == "" ? (
            <Pagination.Item onClick={handlePageMove(page - 1)}>
              {page - 1}
            </Pagination.Item>
          ) : (
            ""
          )}
          <Pagination.Item active>{page}</Pagination.Item>
          {after == "" ? (
            <Pagination.Item onClick={handlePageMove(page + 1)}>
              {page + 1}
            </Pagination.Item>
          ) : (
            ""
          )}

          <Pagination.Next
            className={after}
            onClick={handlePageMove(page + 1)}
          />
          <Pagination.Last className={after} onClick={handlePageMove(count)} />
        </Pagination>
      )}
    </div>
  );
}
