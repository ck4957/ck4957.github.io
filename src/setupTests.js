// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = MockIntersectionObserver;

const portfolioContent = {
  personal: {
    name: "Chirag Kular",
    titles: ["Software Engineer"],
    social: [],
    certifications: []
  },
  profile: {
    description_header: "Hi I'm Chirag Kular",
    description: "Portfolio test profile.",
    section_name: {
      projects: "Projects",
      skills: "Skills",
      experience: "Experience",
      resume: "Resume"
    }
  },
  skills: { categories: [] },
  ai_positioning: null,
  projects: [],
  experience: []
};

const jsonResponses = {
  "portfolio_content.json": portfolioContent,
  "resumes/manifest.json": { current: null, versions: [] },
  "blog_posts.json": []
};

global.fetch = vi.fn(async (input) => {
  const path = typeof input === "string" ? input : input.url;
  const payload = jsonResponses[path];

  if (!payload) {
    return {
      ok: false,
      statusText: "Not found",
      json: async () => ({})
    };
  }

  return {
    ok: true,
    statusText: "OK",
    json: async () => payload
  };
});
