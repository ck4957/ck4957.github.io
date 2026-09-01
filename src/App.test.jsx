import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import BlogPost from "./components/BlogPost";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

it("renders without crashing", async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  expect(await screen.findByText("Portfolio test profile.")).toBeInTheDocument();
});

it("shows a direct resume link when a current resume exists", () => {
  render(
    <BrowserRouter>
      <Navbar
        resumeManifest={{
          current: "resumes/chirag-kular-resume.pdf",
          versions: [
            {
              label: "Chirag Kular Resume",
              path: "resumes/chirag-kular-resume.pdf"
            }
          ]
        }}
      />
    </BrowserRouter>
  );

  expect(screen.getByRole("link", { name: "↓ Resume" })).toHaveAttribute(
    "href",
    "resumes/chirag-kular-resume.pdf"
  );
});

it("renders the Claude certification badge with descriptive alt text", () => {
  render(
    <MemoryRouter>
      <Header
        sharedData={{}}
        sharedBasicInfo={{
          name: "Chirag Kular",
          titles: [],
          social: [],
          certifications: ["claude-certified-developer-foundations.png"]
        }}
        resumeBasicInfo={{}}
      />
    </MemoryRouter>
  );

  expect(
    screen.getByRole("img", { name: "Claude Certified Developer - Foundations" })
  ).toHaveAttribute("src", "images/claude-certified-developer-foundations.png");
});

it("loads an individual blog post from the root content URL", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    statusText: "OK",
    json: async () => [
      {
        id: "test-post",
        slug: "test-post",
        title: "Test Blog Post",
        date: "Jul 2026",
        readTime: "1 min read",
        tags: ["Testing"],
        content: {
          introduction: "A route-level regression test.",
          sections: []
        }
      }
    ]
  });

  render(
    <MemoryRouter initialEntries={["/blog/test-post"]}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </MemoryRouter>
  );

  expect(
    await screen.findByRole("heading", { name: "Test Blog Post" })
  ).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith("/blog_posts.json");
});
