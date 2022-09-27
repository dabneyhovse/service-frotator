import React, { useEffect } from "react";

import { Container, Card, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "./FrotatorHome.css";

export default function FrotatorHome() {
  const navigate = useNavigate();

  return (
    <Container className="mainContent">
      <h2>Welcome to Frotator™</h2>
      <small>"A slight improvement over Froshulator"</small>
      <p>
        Remember that only darbs rotating with dabney should be accessing this
        information.
      </p>
      <Card
        className="home-card m-3"
        onClick={() => navigate("/frotator/frosh")}
      >
        <Row className="p-3" style={{ width: "100%" }}>
          <div className="col col-sm-12 col-md-6 d-flex align-items-center">
            <div className="m-2 home-card-text">
              <h5>Prefro*h List</h5>
              <p>A simple list of all the prefrosh </p>
            </div>
          </div>
          <div
            className="col col-sm-12 col-md-6 home-card-img"
            style={{
              backgroundImage:
                "url('https://us.123rf.com/450wm/anatolymas/anatolymas1310/anatolymas131000007/23327770-3d-small-person-stands-out-in-a-crowd-of-people-in-red-3d-image-white-background.jpg')",
            }}
          ></div>
        </Row>
      </Card>

      <Card
        className="home-card m-3"
        onClick={() => navigate("/frotator/flashcards")}
      >
        <Row className="p-3">
          <div className="col col-sm-12 col-md-6 d-flex align-items-center">
            <div className="m-2 ">
              <h5>Frosh Flashcards</h5>
              <p>
                Are you a tormented Dabney secretary? Do you want shitty flash
                cards that you can use to memorize the frosh? If you answered
                these questions at all, you should review the frosh with these
                flashcards
              </p>
            </div>
          </div>
          <div
            className="col col-sm-12 col-md-6 home-card-img"
            style={{
              backgroundImage:
                "url('https://www.wikihow.com/images/thumb/b/b1/Write-Flash-Cards-Step-1-Version-2.jpg/v4-460px-Write-Flash-Cards-Step-1-Version-2.jpg.webp')",
            }}
          ></div>
        </Row>
      </Card>

      <Card className="home-card m-3">
        <Row className="p-3">
          <div className="col col-sm-12 col-md-6 d-flex align-items-center">
            <div className="m-2 ">
              <h5>Frosh Quiz</h5>
              <p>
                Prove your frosh comprehension skills in this highly competitive
                quiz.{" "}
                <strong>
                  Will not be available until the end of rotation nears.
                </strong>{" "}
                Each user only recieves one try
              </p>
            </div>
          </div>
          <div
            className="col col-sm-12 col-md-6 home-card-img"
            style={{
              backgroundImage:
                "url('https://www.myamericannurse.com/wp-content/uploads/2013/02/quiz_question_multiple_choice_think.jpg')",
            }}
          ></div>
        </Row>
      </Card>

      <Card
        className="home-card m-3"
        onClick={() => navigate("/frotator/spam")}
      >
        <Row className="p-3">
          <div className="col col-sm-12 col-md-6 d-flex align-items-center">
            <div className="m-2 ">
              <h5>Spam</h5>
              <p>
                Want to spam Norman during meetings? You're in luck, frotator
                has a new feature!!!
              </p>
            </div>
          </div>
          <div
            className="col col-sm-12 col-md-6 home-card-img"
            style={{
              backgroundImage:
                "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwBY7WD7yjOFBZhfQgCRMeju_KSmP9MEC1rzMmjFY8_A&s')",
            }}
          ></div>
        </Row>
      </Card>
    </Container>
  );
}
