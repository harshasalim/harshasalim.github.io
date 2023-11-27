import React, { Component } from "react";
import Header from "./components/Header";
import About from "./components/About";
import Resume from "./components/Resume";
import Testimonials from "./components/Testimonials";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import resumeData from "./resumeData";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    let sections = document.querySelectorAll("section");
    sections = [...sections, document.getElementById("home")];
    let navLinks = document.querySelectorAll("header nav a");

    window.onscroll = () => {
      sections.forEach((sec) => {
        let top = window.scrollY;
        let offset = sec.offsetTop;
        let height = sec.offsetHeight;
        let id = sec.getAttribute("id");

        if (top >= offset && top < offset + height) {
          navLinks.forEach((links) => {
            links.classList.remove("current");
            document.getElementById(id + "Link").classList.add("current");
          });
        }
      });
    };
  }

  render() {
    return (
      <div className="App" onScroll={this.handleScroll}>
        <Header resumeData={resumeData} />
        <About resumeData={resumeData} />
        <Resume resumeData={resumeData} />
        {/* <Portfolio resumeData={resumeData} /> */}
        {/* <Testimonials resumeData={resumeData} /> */}
        {/* <ContactUs resumeData={resumeData} /> */}
        <Footer resumeData={resumeData} />
      </div>
    );
  }
}

export default App;
