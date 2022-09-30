import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Pagination,
  Accordion,
  Form,
  Button,
  Offcanvas,
  ButtonGroup,
  ButtonToolbar,
  Card,
  Row,
} from "react-bootstrap";
import FroshList from "./FroshList";
import { fetchFrosh, froshListSetPage, setSearch } from "../store/frosh";

import "./Ranking.css";
import { RankingFroshCard } from ".";
import { fetchRanking } from "../store/ranking";

export default function Ranking(props) {
  const { frosh, page, count, search, user, rankingList } = useSelector(
    (state) => ({
      frosh: state.frotator.frosh.list,
      count: state.frotator.frosh.count,
      page: state.frotator.frosh.page,
      search: state.frotator.frosh.search,
      user: state.user.data,
      rankingList: state.frotator.ranking.list,
    })
  );

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showList, setShowList] = useState(false);

  const handleClose = () => setShowAdvanced(false);
  const toggleShow = () => setShowAdvanced((s) => !s);

  const handleCloseList = () => setShowList(false);
  const toggleShowList = () => setShowList((s) => !s);

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
    setShowAdvanced(false);
    event.preventDefault();
    dispatch(froshListSetPage(1));
    dispatch(fetchFrosh({ search, pageNum: 1 }));
  };

  useEffect(() => {
    dispatch(fetchRanking());
  }, []);

  return (
    <div className="mainContent">
      <Offcanvas
        show={showAdvanced}
        onHide={handleClose}
        scroll={true}
        backdrop={true}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Advanced Search Options</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group className="mb-3" controlId="searchFormName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                onChange={onChange}
                value={search.name}
                name="name"
                type="name"
                placeholder="Enter Name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="searchFormAnagram">
              <Form.Label>Anagram</Form.Label>
              <Form.Control
                onChange={onChange}
                value={search.anagram}
                name="anagram"
                type="anagram"
                placeholder="Enter Anagram"
              />
            </Form.Group>

            <Form.Group className="mb-3">
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
                <option value="E">Linner E</option>
                <option value="F">Dinner F</option>
                <option value="G">Dinner G</option>
                <option value="H">Dinner H</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sort</Form.Label>
              <Form.Select onChange={onChange} name="sort" value={search.sort}>
                <option value="0">Default</option>
                <option value="1">Alphabetical</option>
                {user.authLevel >= 4 ? (
                  <>
                    <option value="2">Most Comments</option>
                    <option value="3">Least Comments</option>
                    <option value="4">Most Favorites</option>
                    <option value="5">Least Favorites</option>
                  </>
                ) : (
                  ""
                )}
              </Form.Select>
            </Form.Group>
            <Card>
              <Card.Body>
                <Card.Text>Prefr*sh Bio Info</Card.Text>
                <Form.Group className="mb-3" controlId="searchFormBioHometown">
                  <Form.Label>Hometown</Form.Label>
                  <Form.Control
                    onChange={onChange}
                    value={search["bio-hometown"]}
                    name="bio-hometown"
                    type="bio-hometown"
                    placeholder="Enter Hometown"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="searchFormBiomajor">
                  <Form.Label>Major</Form.Label>
                  <Form.Control
                    onChange={onChange}
                    value={search["bio-major"]}
                    name="bio-major"
                    type="bio-major"
                    placeholder="Enter Major"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="searchFormBiohobbies">
                  <Form.Label>Hobbies</Form.Label>
                  <Form.Control
                    onChange={onChange}
                    value={search["bio-hobbies"]}
                    name="bio-hobbies"
                    type="bio-hobbies"
                    placeholder="Enter Hobbies"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="searchFormBioclubs">
                  <Form.Label>Clubs</Form.Label>
                  <Form.Control
                    onChange={onChange}
                    value={search["bio-clubs"]}
                    name="bio-clubs"
                    type="bio-clubs"
                    placeholder="Enter Clubs"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="searchFormBioHometown">
                  <Form.Label>Funfact</Form.Label>
                  <Form.Control
                    onChange={onChange}
                    value={search["bio-funfact"]}
                    name="bio-funfact"
                    type="bio-funfact"
                    placeholder="Enter Funfact"
                  />
                </Form.Group>
              </Card.Body>
            </Card>
            <Button
              className="m-2"
              onClick={onSearch}
              variant="primary"
              type="submit"
            >
              Search
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas
        show={showList}
        onHide={handleCloseList}
        scroll={true}
        backdrop={true}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Prefrosh List</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Search Options</Accordion.Header>
              <Accordion.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="searchFormName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      onChange={onChange}
                      value={search.name}
                      name="name"
                      type="name"
                      placeholder="Enter Name"
                    />
                  </Form.Group>

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
                      <option value="E">Linner E</option>
                      <option value="F">Dinner F</option>
                      <option value="G">Dinner G</option>
                      <option value="H">Dinner H</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Sort</Form.Label>
                    <Form.Select
                      onChange={onChange}
                      name="sort"
                      value={search.sort}
                    >
                      <option value="0">Default</option>
                      <option value="1">Alphabetical</option>
                      {user.authLevel >= 4 ? (
                        <>
                          <option value="2">Most Comments</option>
                          <option value="3">Least Comments</option>
                          <option value="4">Most Favorites</option>
                          <option value="5">Least Favorites</option>
                        </>
                      ) : (
                        ""
                      )}
                    </Form.Select>
                  </Form.Group>
                  <ButtonToolbar>
                    <ButtonGroup>
                      <Button
                        className="m-2"
                        onClick={onSearch}
                        variant="primary"
                        type="submit"
                      >
                        Search
                      </Button>
                    </ButtonGroup>
                    <ButtonGroup>
                      <Button
                        variant="primary"
                        onClick={toggleShow}
                        className="m-2"
                      >
                        Advanced Search
                      </Button>
                    </ButtonGroup>
                  </ButtonToolbar>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <FroshList frosh={frosh} offcanvas={true} />
          {count == 0 ? (
            ""
          ) : (
            <Pagination className="d-flex justify-content-center">
              <Pagination.First
                className={before}
                onClick={handlePageMove(1)}
              />
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
              <Pagination.Last
                className={after}
                onClick={handlePageMove(count)}
              />
            </Pagination>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <h1>Big Bad List</h1>

      <Button variant="primary" onClick={toggleShowList} className="m-2">
        Prefr*sh List
      </Button>
      <Row>
        {rankingList.map((frosh, i) => (
          <RankingFroshCard frosh={frosh} i={i + 1} />
        ))}
      </Row>
    </div>
  );
}
