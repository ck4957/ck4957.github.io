import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import AIFocus from './components/AIFocus';
import { loadPortfolioContent, loadResumeManifest } from './utils/portfolioContent';

const HomePage = ({ sharedData, resumeData, resumeManifest }) => {
  const location = useLocation();

  // Scroll to section links after routed content is available.
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      window.setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  useEffect(() => {
    if (!location.hash) {
      const redirectHash = window.sessionStorage.getItem('spa-redirect-hash');
      if (redirectHash) {
        window.sessionStorage.removeItem('spa-redirect-hash');
        window.setTimeout(() => {
          const section = document.getElementById(redirectHash.replace('#', ''));
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div>
      <Navbar resumeManifest={resumeManifest} />
      <Header sharedData={sharedData}
              resumeBasicInfo={resumeData.basic_info}
              sharedBasicInfo={sharedData.basic_info} />
      <AIFocus aiPositioning={resumeData.ai_positioning} />
      <Blog />
      <Projects
        resumeProjects={resumeData.projects}
        resumeBasicInfo={resumeData.basic_info}
      />
      <Skills
        sharedSkills={sharedData.skills}
        resumeBasicInfo={resumeData.basic_info}
      />
      <Experience
        resumeExperience={resumeData.experience}
        resumeBasicInfo={resumeData.basic_info}
      />
      <Footer sharedBasicInfo={sharedData.basic_info} />
    </div>
  );
};

const App = () => {
  const [sharedData, setSharedData] = useState({});
  const [resumeData, setResumeData] = useState({});
  const [resumeManifest, setResumeManifest] = useState({ current: null, versions: [] });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [{ sharedData, resumeData }, manifest] = await Promise.all([
          loadPortfolioContent(),
          loadResumeManifest()
        ]);

        setSharedData(sharedData);
        setResumeData(resumeData);
        setResumeManifest(manifest);
        document.title = `${sharedData?.basic_info?.name}`;
      } catch (error) {
        console.error(error);
      }
    };

    fetchContent();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            sharedData={sharedData}
            resumeData={resumeData}
            resumeManifest={resumeManifest}
          />
        }
      />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route
        path="*"
        element={
          <HomePage
            sharedData={sharedData}
            resumeData={resumeData}
            resumeManifest={resumeManifest}
          />
        }
      />
    </Routes>
  );
};

export default App;
