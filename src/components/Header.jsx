import React, { useState, useEffect, useMemo } from "react";
import { ReactTyped } from "react-typed";
import { Link } from "react-router-dom";

const certificationAltText = {
  "aws_dea_c01.png": "AWS Certified Data Engineer Associate",
  "aws_dva_c02.png": "AWS Certified Developer Associate",
  "aws_saa_c03.png": "AWS Certified Solutions Architect Associate",
  "azure_ai_900.png": "Microsoft Certified Azure AI Fundamentals",
  "dd-fund.png": "Datadog Fundamentals",
  "dd-apm.png": "Datadog APM"
};

const Header = ({ sharedData, sharedBasicInfo, resumeBasicInfo }) => {
  const [titles, setTitles] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [certificationBadges, setCertificationBadges] = useState([]);
  const [name, setName] = useState("");
  const [patent, setPatent] = useState(null);
  //const [sectionName, setSectionName] = useState("");
  const [hello, setHello] = useState("");
  const [about, setAbout] = useState("");

  if (sharedBasicInfo && sharedBasicInfo.social) {
    var networks = sharedBasicInfo?.social?.map(function (network) {
      return (
        <span key={network.name} className="m-4">
          <a href={network.url} target="_blank" rel="noopener noreferrer">
            <i className={network.class}></i>
          </a>
        </span>
      );
    });
  }

  useEffect(() => {
    if (sharedBasicInfo) {
      setName(sharedBasicInfo?.name);
      setTitles(sharedBasicInfo?.titles?.map((x) => x.toUpperCase()) || []);
      setProfilePic(sharedBasicInfo.image ? "images/" + sharedBasicInfo.image : "");
      setCertificationBadges(
        sharedBasicInfo.certifications?.map((certification) => ({
          src: "images/" + certification,
          alt: certificationAltText[certification] || certification.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")
        })) || []
      );
    }
    if (resumeBasicInfo) {
      //setSectionName(resumeBasicInfo.section_name.about);
      setHello(resumeBasicInfo.description_header);
      setAbout(resumeBasicInfo.description);
    }
    if (sharedBasicInfo?.patent) {
      setPatent(sharedBasicInfo.patent);
    }
  }, [sharedData, sharedBasicInfo, resumeBasicInfo]);

  const HeaderTitleTypeAnimation = useMemo(() => {
    if (!titles.length) {
      return null;
    }

    return (
      <ReactTyped
        className="title-styles"
        strings={titles}
        typeSpeed={45}
        backSpeed={25}
        backDelay={1400}
        loop
      />
    );
  }, [titles]);

  return (
    <header id="home">
      <div className="row aligner header-content mx-0">
        <div className="col-sm-12 col-md-4 mb-5">
          <div className="d-block">
            <div className="polaroid center">
              <span style={{ cursor: "auto" }}>
                {profilePic && (
                  <img height="300px" src={profilePic} alt="Avatar placeholder" />
                )}
              </span>
            </div>
          </div>
          <div className="d-block">
            {certificationBadges.map((badge) => (
              <div className="d-inline" key={badge.src}>
                <span style={{ cursor: "auto" }}>
                  <img
                    height="120px"
                    src={badge.src}
                    alt={badge.alt}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-sm-12 col-md-7">
          <div className="col-md-12 d-block mb-5">
            <div className="card">
              <div className="card-header">
                <span
                  className="iconify"
                  data-icon="emojione:red-circle"
                  data-inline="false"
                ></span>{" "}
                &nbsp;{" "}
                <span
                  className="iconify"
                  data-icon="twemoji:yellow-circle"
                  data-inline="false"
                ></span>{" "}
                &nbsp;{" "}
                <span
                  className="iconify"
                  data-icon="twemoji:green-circle"
                  data-inline="false"
                ></span>
              </div>
              <div
                className="card-body font-trebuchet text-justify ml-3 mr-3"
                style={{
                  height: "auto",
                  fontSize: "132%",
                  lineHeight: "200%",
                  whiteSpace: "pre-wrap",
                }}
              >
                <br />
                <span className="wave">{hello} :) </span>
                <br />
                <br />
                {about}
                <br />
                {networks}
                {patent && (
                  <div className="mt-3">
                    <span className="iconify mr-2" data-icon="fa-solid:certificate" data-inline="false"></span>
                    <strong>Patent:</strong> <a href={patent.url} target="_blank" rel="noopener noreferrer" title={patent.title}>{patent.number}</a> — {patent.title} ({patent.status})
                  </div>
                )}
                <span className="m-4">
                  <Link to="/#blog" style={{ color: 'inherit' }} title="Blog & Learnings">
                    <span className="iconify" data-icon="clarity:contract-line" data-inline="false"></span>
                  </Link>
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-12 d-block">
            <div>
              <span
                className="iconify header-icon"
                data-icon="la:laptop-code"
                data-inline="false"
              ></span>
              <br />
              <h1 className="mb-0">
                {name}
              </h1>
              <div className="title-container">{HeaderTitleTypeAnimation}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
