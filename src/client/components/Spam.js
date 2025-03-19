import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import socket from "../socket";
import Comment from "./Comment";

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardImage,
  MDBTextArea,
  MDBCardFooter,
} from "mdb-react-ui-kit";
import { frotatorAddSpam } from "../store/spam";

function Spam() {
  const { spam, userInfo } = useSelector((state) => ({
    spam: state.frotator.spam,
    userInfo: state.user.data,
  }));

  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");

  const handleChange = (event) => {
    setNewComment(event.target.value);
  };

  const handlePost = () => {
    setNewComment("");

    dispatch(
      frotatorAddSpam({
        text: newComment,
        from: { username: userInfo.preferred_username },
        id: Math.random(),
      })
    );
    socket.emit("spam", {
      text: newComment,
      from: { username: userInfo.preferred_username },
      id: Math.random(),
    });
  };

  return (
    <div className="mainContent">
      <h1>Spam Alanna</h1>
      <MDBContainer className="py-5" style={{ maxWidth: "1000px" }}>
        <MDBRow className="justify-content-center">
          <MDBCol md="12" lg="10">
            <MDBCard className="text-dark">
              {/* {spam.map((comment) => (
                <Comment key={comment.id} comment={comment} spam={true} />
              ))} */}
              <MDBCardFooter
                className="py-3 border-0"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <div className="d-flex flex-start w-100">
                  <MDBCardImage
                    className="rounded-circle shadow-1-strong me-3"
                    src={userInfo.picture}
                    alt="avatar"
                    width="40"
                    height="40"
                  />
                  <MDBTextArea
                    label="Message"
                    id="textAreaExample"
                    name="text"
                    rows={4}
                    value={newComment}
                    onChange={handleChange}
                    style={{ backgroundColor: "#fff" }}
                    wrapperClass="w-100"
                  />
                </div>
                <div className="float-end mt-2 pt-1 d-flex">
                  <Button
                    onClick={handlePost}
                    size="sm"
                    className="me-1"
                    style={{ marginLeft: "5px" }}
                  >
                    Spam
                  </Button>
                </div>
              </MDBCardFooter>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Spam;
