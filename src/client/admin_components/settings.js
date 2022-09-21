import React, { useState } from "react";

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCheckbox,
} from "mdb-react-ui-kit";

export default function frotatorSettings() {
  return (
    <MDBContainer className="py-5">
      <MDBRow>
        <MDBCard className="mb-4">
          <MDBCardBody>
            <MDBRow>
              <MDBCol sm="12">
                <MDBCardText>
                  <strong>Frotator General Settings</strong>
                </MDBCardText>
              </MDBCol>
            </MDBRow>
            <hr />
            <MDBRow>
              <MDBCol sm="3">
                <MDBCardText>Turn Frotator On</MDBCardText>
              </MDBCol>
              <MDBCol sm="9">
                <MDBCheckbox></MDBCheckbox>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBRow>
    </MDBContainer>
  );
}
