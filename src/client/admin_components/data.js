import React, { useState } from "react";

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTextArea,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
  MDBFile,
} from "mdb-react-ui-kit";

import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import Axios from "axios";

export default function frotatorSettings() {
  const [selectedSeedFile, setSelectedSeedFile] = useState(null);
  const [selectedUpdateFile, setSelectedUpdateFile] = useState(null);

  const handleUpdateFileSelect = (event) => {
    setSelectedUpdateFile(event.target.files[0]);
  };
  const handleUpdate = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedUpdateFile);
    try {
      const res = await Axios.put(
        "/api/frotator/frosh/",
        { "csv-file": selectedUpdateFile },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("The update file was sucessfully uploaded.");
    } catch (error) {
      toast.error("There was an error submitting the update file.");
    }
  };

  const handleSeedFileSelect = (event) => {
    setSelectedSeedFile(event.target.files[0]);
  };
  const handleSeed = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("csv-file", selectedSeedFile);
    try {
      const res = await axios({
        method: "post",
        url: "/api/frotator/frosh",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("The seed file was sucessfully uploaded.");
    } catch (error) {
      toast.error("There was an error submitting the seed file.");
    }
  };

  return (
    <MDBContainer className="py-5">
      <MDBRow>
        <MDBCol lg="12">
          <MDBCard className="mb-4">
            <MDBCardBody>
              <MDBRow>
                <MDBCol sm="12">
                  <MDBCardText>
                    <strong>Upload Frosh Data</strong>
                  </MDBCardText>
                </MDBCol>
              </MDBRow>
              <hr />
              <MDBRow>
                <MDBCol sm="12">
                  <MDBCardText>
                    The frosh data we get from admin. Expects a csv file that at
                    least has an "email" col we can identify frosh by. It also
                    accepts the following columns: fullName, lastName,
                    preferredName, photo, pronouns, bio-hometown, bio-major,
                    bio-hobbies, bio-clubs, bio-funfact
                  </MDBCardText>
                </MDBCol>
              </MDBRow>
              <hr />
              <MDBRow>
                <MDBCol sm="6">
                  <MDBFile id="seedFile" onChange={handleSeedFileSelect} />
                </MDBCol>
                <MDBCol sm="6">
                  <Button type="submit" onClick={handleSeed}>
                    Submit
                  </Button>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>

          <MDBCard className="mb-4">
            <MDBCardBody>
              <MDBRow>
                <MDBCol sm="12">
                  <MDBCardText>
                    <strong>Update Frosh Data</strong>
                  </MDBCardText>
                </MDBCol>
              </MDBRow>
              <hr />
              <MDBRow>
                <MDBCol sm="12">
                  <MDBCardText>
                    Upload any extra frosh data here to update any values
                    currently within the database. Useful if for some reason you
                    dont recieve all the information about the frosh at once.
                    This csv file must contain an "email" column to match to
                    existing frosh. Other accepted columns include: fullName,
                    lastName, preferredName, photo, pronouns, bio-hometown,
                    bio-major, bio-hobbies, bio-clubs, bio-funfact
                  </MDBCardText>
                </MDBCol>
              </MDBRow>
              <hr />
              <MDBRow>
                <MDBCol sm="6">
                  <MDBFile id="seedFile" onChange={handleUpdateFileSelect} />
                </MDBCol>
                <MDBCol sm="6">
                  <Button type="submit" onClick={handleUpdate}>
                    Submit
                  </Button>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
