import { render, screen } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import App from "./App";
import Navbar from "./components/Navbar";

it("renders without crashing", async () => {
  render(
    <HashRouter>
      <App />
    </HashRouter>
  );

  expect(await screen.findByText("Portfolio test profile.")).toBeInTheDocument();
});

it("shows a direct resume link when a current resume exists", () => {
  render(
    <HashRouter>
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
    </HashRouter>
  );

  expect(screen.getByRole("link", { name: "↓ Resume" })).toHaveAttribute(
    "href",
    "resumes/chirag-kular-resume.pdf"
  );
});
