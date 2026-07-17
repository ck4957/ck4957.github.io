import React, { Component } from "react";

class Skills extends Component {
  render() {
    if (this.props.sharedSkills && this.props.resumeBasicInfo) {
      var sectionName = this.props.resumeBasicInfo.section_name.skills;
      
      // Render categorized skills
      var skillCategories = this.props.sharedSkills.categories?.map(function (category, idx) {
        var icons = category.icons.map(function (skill, i) {
          return (
            <li className="list-inline-item mx-3" key={i}>
              <div className="text-center skills-tile">
                <span className="skill-icon-container">
                  {skill.icon ? (
                    <span
                      className="iconify skill-brand-icon"
                      data-icon={skill.icon}
                      data-inline="false"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <i className={skill.class} aria-hidden="true"></i>
                  )}
                </span>
                <p className="text-center skill-label">{skill.name}</p>
              </div>
            </li>
          );
        });

        return (
          <div key={idx} className="skill-category-group">
            <div className="skill-category-name">
              <h3>{category.name}</h3>
            </div>
            <div className="skill-category-icons">
              <ul className="list-inline skill-icon">{icons}</ul>
            </div>
          </div>
        );
      });
    }

    return (
      <section id="skills">
        <div className="col-md-12">
          <div className="col-md-12">
            <h1 className="section-title">
              <span className="text-white">{sectionName}</span>
            </h1>
          </div>
          {skillCategories}
        </div>
      </section>
    );
  }
}

export default Skills;
