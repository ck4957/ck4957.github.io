import React from 'react';

const ArrowIcon = ({ external = false }) => (
  <svg
    className="app-shelf-arrow"
    viewBox="0 0 18 18"
    aria-hidden="true"
    focusable="false"
  >
    <path d={external ? 'M6 4h8v8M14 4 5 13' : 'M3 9h11M9 4l5 5-5 5'} />
  </svg>
);

const Apps = ({ apps = [], appsSection = {} }) => {
  if (!apps.length) {
    return null;
  }

  const heading = appsSection.heading || 'Apps I’m shipping';
  const description = appsSection.description || 'Small, useful products for everyday life, learning, memory, and care.';

  return (
    <section id="apps" className="app-shelf-section" aria-labelledby="apps-heading">
      <div className="app-shelf-container">
        <div className="app-shelf-intro">
          <div>
            <p className="app-shelf-count">{String(apps.length).padStart(2, '0')} products</p>
            <h2 id="apps-heading">{heading}</h2>
            <p>{description}</p>
          </div>
          <div className="app-shelf-signature" aria-hidden="true">
            <span>SwiftUI</span>
            <span>Apple platforms</span>
          </div>
        </div>

        <div className="app-shelf-list">
          {apps.map((app, index) => (
            <article
              className={`app-shelf-row app-shelf-row--${index % 2 === 0 ? 'image-right' : 'image-left'} ${index === 0 ? 'app-shelf-row--featured' : ''}`}
              key={app.title}
              style={{ '--app-accent': `var(--app-${app.accent || 'blue'})` }}
            >
              <div className="app-shelf-marker" aria-hidden="true">
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="app-shelf-copy">
                <p className="app-shelf-platform">
                  <span className="app-shelf-dot" aria-hidden="true" />
                  {app.platform}
                </p>
                <h3>{app.title}</h3>
                <p className="app-shelf-description">{app.description}</p>
                <div className="app-shelf-links">
                  {app.productUrl && (
                    <a href={app.productUrl} target="_blank" rel="noopener noreferrer">
                      View product page <ArrowIcon />
                    </a>
                  )}
                  {app.appStoreUrl && (
                    <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer">
                      App Store <ArrowIcon external />
                    </a>
                  )}
                </div>
              </div>
              <a
                className={`app-shelf-media app-shelf-media--${app.mediaType || 'wide'}`}
                href={app.productUrl || app.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${app.title} product page`}
              >
                <img src={app.images?.[0]} alt={`${app.title} app screenshot`} loading={index > 1 ? 'lazy' : 'eager'} />
                <span className="app-shelf-media-label">Open case study <ArrowIcon /></span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Apps;
