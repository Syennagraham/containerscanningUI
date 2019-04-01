import React, { Component } from "react";
import "./Home.css";

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Practical Code Container Scanning</h1>
          <p>Scan your containers to generate a report that will indicate the security vulnerabilities of your container's infrastructure.</p>
        </div>
      </div>
    );
  }
}

