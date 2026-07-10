import { useState, useEffect } from "react";

const listeners = new Set();

// Function to navigate programmatically
export const navigate = (path) => {
  window.history.pushState({}, "", path);
  listeners.forEach((listener) => listener(path));
  
  // Handle hash scrolling
  if (path.includes('#')) {
    const hash = path.split('#')[1];
    setTimeout(() => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  } else {
    window.scrollTo(0, 0); // Scroll to top on navigation
  }
};

// Hook to get the current path
export const usePath = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = (newPath) => setPath(newPath);
    listeners.add(handler);

    const popHandler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", popHandler);

    return () => {
      listeners.delete(handler);
      window.removeEventListener("popstate", popHandler);
    };
  }, []);

  return path;
};

// Link Component to use instead of <a>
export const Link = ({ href, children, className, style, ...props }) => {
  const handleClick = (e) => {
    e.preventDefault();
    navigate(href);
  };
  return (
    <a href={href} onClick={handleClick} className={className} style={style} {...props}>
      {children}
    </a>
  );
};
