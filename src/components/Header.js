import React, { Component, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Header = (props) => {
  const location = useLocation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    const findCurrentPathname = () => {
      if (location.pathname === "/") {
        setSelectedIndex(0);
      }
      if (location.pathname === "/home") {
        setSelectedIndex(0);
      }
      if (location.pathname === "/about") {
        setSelectedIndex(1);
      }
      if (location.pathname === "/resume") {
        setSelectedIndex(2);
      }
      if (location.pathname === "/contact") {
        setSelectedIndex(3);
      }
    };
    console.log("before" + selectedIndex);
    findCurrentPathname();
  }, [selectedIndex, location]);

  return (
    <HeaderComponent
      location={location}
      selectedIndex={selectedIndex}
      {...props}
    />
  );
};

export default class HeaderComponent extends Component {
  onChange = (location) => {
    this.props.location(location);
  };
  render() {
    let resumeData = this.props.resumeData;

    return (
      <React.Fragment>
        <header id="home">
          <nav id="nav-wrap">
            <a className="mobile-btn" href="#nav-wrap" title="Show navigation">
              Show navigation
            </a>
            <a className="mobile-btn" href="#" title="Hide navigation">
              Hide navigation
            </a>
            <ul id="nav" className="nav">
              <li className="current">
                <a className="smoothscroll" href="#home">
                  Home {this.props.selectedIndex}
                </a>
              </li>
              <li>
                <a className="smoothscroll" href="#about">
                  About
                </a>
              </li>
              <li>
                <a className="smoothscroll" href="#resume">
                  Resume
                </a>
              </li>
              <li>
                <a className="smoothscroll" href="#portfolio">
                  Works
                </a>
              </li>
              <li>
                <a className="smoothscroll" href="#testimonials">
                  Testimonials
                </a>
              </li>
              <li>
                <a className="smoothscroll" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="row banner">
            <div className="banner-text">
              <h1 className="responsive-headline">I am {resumeData.name}</h1>
              <h3 style={{ color: "#fff", fontFamily: "sans-serif " }}>
                I am a {resumeData.role}.{resumeData.roleDescription}
              </h3>
              <hr />
              <ul className="social">
                {resumeData.socialLinks &&
                  resumeData.socialLinks.map((item) => {
                    return (
                      <li key={item.name}>
                        <a href={item.url} target="_blank">
                          <i className={item.className}></i>
                        </a>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>

          <p className="scrolldown">
            <a className="smoothscroll" href="#about">
              <i className="icon-down-circle"></i>
            </a>
          </p>
        </header>
      </React.Fragment>
    );
  }
}
