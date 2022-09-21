import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Row } from "react-bootstrap";
import FroshListItem from "./FroshListItem";

import "./FroshList.css";

export default function FroshList(props) {
  return (
    <Container>
      <Row>
        {props.frosh.map((f) => {
          return <FroshListItem frosh={f} />;
        })}
      </Row>
    </Container>
  );
}
