import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  favoriteFrosh,
  fetchSingleFrosh,
  gotSingleFrosh,
  postNewComment,
  singleFroshDefault,
} from "../store/singleFrosh";

import {
  Row,
  Container,
  ButtonToolbar,
  ButtonGroup,
  Button,
} from "react-bootstrap";

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTextArea,
  MDBCardFooter,
  MDBCheckbox,
} from "mdb-react-ui-kit";

import "./SingleFrosh.css";
import Comment from "./Comment";
import { toast } from "react-toastify";

export default function SingleFrosh() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [newComment, setNewComment] = useState({
    anon: true,
    text: "",
  });

  const { frosh, userInfo, selectedFroshIdx, allFrosh } = useSelector((state) => ({
    frosh: state.frotator.singleFrosh.frosh,
    allFrosh: state.frotator.frosh.list,
    userInfo: state.user.data,
    selectedFroshIdx: state.frotator.frosh.selectedFroshIdx,
  }));

  useEffect(() => {
    dispatch(fetchSingleFrosh(params.froshId));
  }, [params.froshId]);

  const handleChange = (event) => {
    setNewComment({
      ...newComment,
      [event.target.name]:
        event.target.name == "anon" ? event.target.checked : event.target.value,
    });
  };

  const toggleFavorite = () => {
    dispatch(favoriteFrosh(params.froshId, !frosh.favorite));
  };

  const handleShift = (amount) => () => {
    let idx = amount + selectedFroshIdx;
    if (selectedFroshIdx == -1) {
      idx = 0;
    } else if (idx < 0) {
      idx = allFrosh.length - 1 + idx;
    } else if (idx - allFrosh.length + 1 > 0) {
      idx = idx - allFrosh.length + 1;
    }
    navigate(`/frotator/frosh/${allFrosh[idx].id}`);
    dispatch(gotSingleFrosh(singleFroshDefault.frosh));
  };

  const handlePost = (event) => {
    event.preventDefault();

    dispatch(
      postNewComment({
        ...newComment,
        froshId: params.froshId,
        userId: userInfo.sub,
      })
    );
    setNewComment({
      anon: true,
      text: "",
    });
  };

  return (
    <Container className="mainContent" style={{ backgroundColor: "#eee" }}>
      <ButtonToolbar>
        <ButtonGroup>
          <Button
            className="m-1"
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            className="m-1"
            onClick={() => {
              navigate("/frotator/frosh");
            }}
          >
            Frosh List
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button className="m-1" onClick={handleShift(-1)}>
            Previous Prefr*sh
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button className="m-1" onClick={handleShift(1)}>
            Next Prefr*sh
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center row icon-name-card">
                <MDBCardImage
                  className="col col-sm-12 col-12 col-md-6 col-lg-6"
                  src={
                    frosh.image
                      ? frosh.image
                      : "https://play-lh.googleusercontent.com/8ddL1kuoNUB5vUvgDVjYY3_6HwQcrg1K2fd_R8soD-e2QYj8fT9cfhfh3G0hnSruLKec"
                  }
                  alt="prefrosh image"
                  style={{ width: "200px" }}
                  fluid
                />
                <div className="col col-sm-12 col-12 col-md-6 col-lg-6">
                  <h2>{frosh.displayName}</h2>
                  <p>"{frosh.anagram}"</p>
                  <hr />
                  <p>{frosh.pronouns}</p>
                  <p>Dinner Group {frosh.dinnerGroup}</p>
                </div>
                <div className="col col-12 d-flex justify-content-center m-2">
                  <ButtonToolbar aria-label="Toolbar with button groups">
                    <ButtonGroup className="me-2" aria-label="Second group">
                      <Button variant="success" onClick={toggleFavorite}>
                        {frosh.favorite ? "Unf" : "F"}avorite this prefr*sh
                      </Button>
                    </ButtonGroup>
                    {/* <ButtonGroup className="me-2" aria-label="Concern Group">
                      <Button
                        variant="warning"
                        onClick={() => {
                          // TODO fix this tonight
                          toast.error(
                            "There was an error reporting your concern"
                          );
                        }}
                      >
                        Report a Concern
                      </Button>
                    </ButtonGroup> */}
                  </ButtonToolbar>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="12">
                    <MDBCardText>
                      <strong>Prefr*sh Bio</strong> <br />
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>

                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Hometown</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText>
                      {frosh.bio.hometown == ""
                        ? "no information"
                        : frosh.bio.hometown}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>

                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Intended major</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText>
                      {frosh.bio.major == ""
                        ? "no information"
                        : frosh.bio.major}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>

                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Hobbies</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText>
                      {frosh.bio.hobbies == ""
                        ? "no information"
                        : frosh.bio.hobbies}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>

                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Clubs they might join</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText>
                      {frosh.bio.clubs == ""
                        ? "no information"
                        : frosh.bio.clubs}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>

                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Funfact</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText>
                      {frosh.bio.funfact == ""
                        ? "no information"
                        : frosh.bio.funfact}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol lg="12">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="12">
                    <MDBCardText>
                      <strong>
                        Comments ({frosh["frotator-comments"].length})
                      </strong>
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>

                <MDBContainer className="py-5" style={{ maxWidth: "1000px" }}>
                  <MDBRow className="justify-content-center">
                    <MDBCol md="12" lg="10">
                      <MDBCard className="text-dark">
                        {frosh["frotator-comments"].map((comm) => (
                          <Comment key={comm.id} comment={comm} />
                        ))}
                        <MDBCardFooter
                          className="py-3 border-0"
                          style={{ backgroundColor: "#f8f9fa" }}
                        >
                          <div className="d-flex flex-start w-100">
                            <MDBCardImage
                              className="rounded-circle shadow-1-strong me-3"
                              src={userInfo.picture || "/resources/images/defaultProfile.png"}
                              alt="avatar"
                              width="40"
                              height="40"
                            />
                            <MDBTextArea
                              label="Message"
                              id="textAreaExample"
                              name="text"
                              rows={4}
                              value={newComment.text}
                              onChange={handleChange}
                              style={{ backgroundColor: "#fff" }}
                              wrapperClass="w-100"
                            />
                          </div>
                          <div className="float-end mt-2 pt-1 d-flex">
                            <MDBCheckbox
                              label="Anonymous"
                              checked={newComment.anon}
                              name="anon"
                              onChange={handleChange}
                            ></MDBCheckbox>
                            <Button
                              onClick={handlePost}
                              size="sm"
                              className="me-1"
                              style={{ marginLeft: "5px" }}
                            >
                              Post comment
                            </Button>
                          </div>
                        </MDBCardFooter>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </Container>
  );
}
