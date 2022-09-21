import React from "react";
import { Route, Routes } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";

import FrotatorSettings from "./settings";
import FrotatorData from "./data";

export default function frotatorAdmin() {
  return (
    <React.Fragment>
      <Nav variant="tabs">
        <Nav.Item key="frotator-settings">
          <LinkContainer to="/adminpanel/frotator/settings">
            <Nav.Link eventKey="frotator-settings">Settings</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item key="frotator-data">
          <LinkContainer to="/adminpanel/frotator/data">
            <Nav.Link eventKey="frotator-data">Data</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item key="frotator-list">
          <LinkContainer to="/adminpanel/frotator/">
            <Nav.Link eventKey="frotator-list">Prefrosh List</Nav.Link>
          </LinkContainer>
        </Nav.Item>
      </Nav>
      <Routes>
        <Route exact path="/settings" element={<FrotatorSettings />} />
        <Route exact path="/data" element={<FrotatorData />} />
        <Route exact path="/" element={<div>TODO frosh list</div>} />
      </Routes>
    </React.Fragment>
  );
}
