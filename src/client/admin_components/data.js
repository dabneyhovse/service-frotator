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
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import Axios from "axios";

export default function frotatorSettings() {
  const [selectedSeedFile, setSelectedSeedFile] = useState(null);
  const [selectedUpdateFile, setSelectedUpdateFile] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(null);

  const handleShowDeleteConfirmModal = () => setShowDeleteConfirmModal(true);
  const handleHideDeleteConfirmModal = () => setShowDeleteConfirmModal(false);

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
      const res = await Axios({
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

  const handleDelete = async (event) => {
    event.preventDefault();
    try {

      const res = await Axios.delete(
        "/api/frotator/frosh"
      );
      toast.success("The data was successfully deleted.");
    } catch (error) {
      toast.error("There was an error deleting the data.");
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
                    least has an "email" col (
                    <b>the email col should be first</b>) we can identify frosh
                    by. It also accepts the following columns: fullName,
                    lastName, preferredName, photo, pronouns, bio-hometown,
                    bio-major, bio-hobbies, bio-clubs, bio-funfact
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
                    This csv file must contain an "email" column (
                    <b>the email col should be first</b>)to match to existing
                    frosh. Other accepted columns include: fullName, lastName,
                    preferredName, photo, pronouns, bio-hometown, bio-major,
                    bio-hobbies, bio-clubs, bio-funfact
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

          <MDBCard className="mb-4">
            <MDBCardBody>
              <MDBRow>
                <MDBCol sm="12">
                  <MDBCardText>
                    <strong>Delete All Frosh Data</strong>
                  </MDBCardText>
                </MDBCol>
              </MDBRow>
              <hr />
              <Button type="submit" variant="danger" onClick={handleShowDeleteConfirmModal}>
                Delete Data
              </Button>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      <Modal show={showDeleteConfirmModal}>
        <Modal.Header>
          <Modal.Title>Are you sure you want to delete all frosh data?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Doing this will remove all frosh data in the Frotator database.
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="danger" onClick={(event) => { handleDelete(event); handleHideDeleteConfirmModal(); }}>
            Yes
          </Button>
          <Button type="secondary" onClick={handleHideDeleteConfirmModal}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </MDBContainer>
  );
}
