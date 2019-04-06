import React, { Component } from "react";
import { API } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import "./NewNote.css";

export default class NewNote extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      content: "",
      creds: "",
    };
  }

  createNote(note) {
    return API.post("notes", "/notes", {
      body: note
    });
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleFieldChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }


  handleSubmit = async event => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
      return;
    }

    this.setState({ isLoading: true });
    
    try {
      const attachment = this.file
        ? await s3Upload(this.file)
        : null;

      await this.createNote({
        attachment,
        content: this.state.content,
        creds: this.state.creds
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div className="NewNote">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="content">
            <ControlLabel>Where can we find an image of your container? Please enter your Docker registry address.</ControlLabel>
            <FormControl
              onChange={this.handleFieldChange}
              value={this.state.content}
              componentClass="textarea"
              placeholder="URL of container registry"
            />
          </FormGroup>
          <FormGroup controlId="creds">
            <ControlLabel>Security credentials for access to your registry.</ControlLabel>
            <FormControl 
              onChange={this.handleFieldChange} 
              componentClass="textarea"
              value={this.state.creds}
              placeholder="Credentials"
            />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}

