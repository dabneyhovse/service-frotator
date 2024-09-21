import React, { useEffect } from "react";

import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";

import "./Comment.css";

export default function Comment(props) {
  return (
    <>
      <MDBCardBody className="p-4">
        <div className="d-flex flex-start">
          {props.spam ? (
            ""
          ) : (
            <MDBCardImage
              className="rounded-circle shadow-1-strong me-3"
              src={props.comment.from.picture}
              alt="avatar"
              width="60"
              height="60"
            />
          )}
          <div>
            <MDBTypography tag="h6" className="fw-bold mb-1">
              {props.comment.from.name}
            </MDBTypography>
            {props.comment.text.split("\n").map((line) => (
              <p className="mb-0">{line}</p>
            ))}
          </div>
        </div>
      </MDBCardBody>

      <hr className="my-0" />
    </>
  );
}
