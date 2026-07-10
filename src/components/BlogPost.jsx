import React from 'react';
import { Link, useParams } from 'react-router-dom';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Scroll to top when blog post loads
    window.scrollTo(0, 0);

    const fetchPost = async () => {
      try {
        const response = await fetch('blog_posts.json');
        const posts = await response.json();
        const foundPost = posts.find(p => p.slug === slug);
        setPost(foundPost);
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <section id="blog-post" style={{ minHeight: '100vh', padding: '50px 20px' }}>
        <div style={{ textAlign: 'center' }}>Loading...</div>
      </section>
    );
  }

  if (!post) {
    return (
      <section id="blog-post" style={{ minHeight: '100vh', padding: '50px 20px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Post not found</h2>
          <Link to="/" className="learning-pill" style={{ marginTop: '20px' }}>
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section id="blog-post">
      <article className="blog-post-container">
        <header className="blog-post-header">
          <Link to="/" className="blog-back-link">
            ← Back to Blog
          </Link>
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-post-meta">
            <span className="blog-post-date">{post.date}</span>
            <span className="blog-post-read-time">{post.readTime}</span>
          </div>
          <div className="blog-post-tags">
            {post.tags.map(tag => (
              <span key={tag} className="blog-post-tag">{tag}</span>
            ))}
          </div>
        </header>

        <div className="blog-post-content">
          <p className="blog-post-intro">{post.content.introduction}</p>

          {post.content.sections.map((section, idx) => (
            <div key={idx} className="blog-post-section">
              <h2>{section.heading}</h2>
              {section.text && <p>{section.text}</p>}
              {section.image && (
                <figure className="blog-post-image">
                  <img 
                    src={section.image.src} 
                    alt={section.image.alt} 
                    loading="lazy"
                  />
                  {section.image.caption && (
                    <figcaption>{section.image.caption}</figcaption>
                  )}
                </figure>
              )}
              {section.list && (
                <ul className="blog-post-list">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {post.demoType === 'interactive' && post.slug === 'chrome-extension-design-system' && (
            <ChromeExtensionDemo />
          )}
          
          {post.demoType === 'interactive' && post.slug === 'figma-code-connect' && (
            <FigmaCodeConnectDemo />
          )}

          {post.demoType === 'interactive' && post.slug === 'med-charting-sidebar' && (
            <MedChartingSidebarDemo />
          )}
        </div>
      </article>
    </section>
  );
};

const MedChartingSidebarDemo = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [chartedMeds, setChartedMeds] = React.useState([]);

  const medications = [
    { id: 1, name: 'Aspirin', dose: '81 mg', time: '09:00 AM', type: 'Oral' },
    { id: 2, name: 'Warfarin', dose: '1 mg', time: '10:00 AM', type: 'Oral' },
    { id: 3, name: 'Celecoxib', dose: '200 mg', time: '07:00 AM', type: 'Oral' },
    { id: 4, name: 'Metformin', dose: '500 mg', time: '08:00 AM', type: 'Oral' },
    { id: 5, name: 'Lisinopril', dose: '10 mg', time: '09:00 AM', type: 'Oral' },
    { id: 6, name: 'Atorvastatin', dose: '20 mg', time: '09:00 PM', type: 'Oral' }
  ];

  const unchartedMeds = medications.filter(m => !chartedMeds.includes(m.id));
  const charted = medications.filter(m => chartedMeds.includes(m.id));

  const handleChart = (medId) => {
    setChartedMeds([...chartedMeds, medId]);
  };

  return (
    <div className="med-charting-demo">
      <h2 className="demo-heading">💊 Live Demo: Medication Sidebar</h2>
      <p className="demo-description">
        See how the persistent sidebar solves the scrolling problem. Try charting medications to see progress tracked in real-time!
      </p>

      <div className="med-demo-container">
        <div className="med-main-area">
          <div className="med-header">
            <h3>Scheduled Medications</h3>
            <span className="med-count">{unchartedMeds.length} remaining</span>
          </div>
          
          <div className="med-list">
            {unchartedMeds.length === 0 ? (
              <div className="med-complete">
                <div className="med-complete-icon">✓</div>
                <p>All medications charted!</p>
              </div>
            ) : (
              unchartedMeds.map(med => (
                <div key={med.id} className="med-card">
                  <div className="med-card-header">
                    <strong>{med.name}</strong>
                    <span className="med-time">{med.time}</span>
                  </div>
                  <div className="med-card-body">
                    <p><strong>Dose:</strong> {med.dose}</p>
                    <p><strong>Route:</strong> {med.type}</p>
                  </div>
                  <button 
                    className="med-chart-btn"
                    onClick={() => handleChart(med.id)}
                  >
                    Chart Medication
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`med-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="med-sidebar-header">
            <h4>Charted ({chartedMeds.length})</h4>
            <button 
              className="med-sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? '→' : '←'}
            </button>
          </div>
          
          {sidebarOpen && (
            <div className="med-sidebar-content">
              {chartedMeds.length === 0 ? (
                <p className="med-sidebar-empty">No medications charted yet</p>
              ) : (
                <div className="med-sidebar-list">
                  {charted.map(med => (
                    <div key={med.id} className="med-sidebar-item">
                      <span className="med-sidebar-check">✓</span>
                      <div className="med-sidebar-info">
                        <div className="med-sidebar-name">{med.name}</div>
                        <div className="med-sidebar-details">{med.dose} • {med.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="med-demo-insights">
        <div className="insight-box success">
          <strong>✓ Key Benefit: No More Scrolling</strong>
          <p>The sidebar stays visible while you chart, providing instant visual confirmation without losing your place</p>
        </div>
        <div className="insight-box info">
          <strong>💡 Built with Existing Data</strong>
          <p>Frontend already tracked charting state—we just displayed it differently. No backend changes needed.</p>
        </div>
      </div>
    </div>
  );
};

const FigmaCodeConnectDemo = () => {
  const [selectedComponent, setSelectedComponent] = React.useState('button');
  const [showCode, setShowCode] = React.useState(false);

  const components = {
    button: {
      name: 'Button',
      icon: '🔘',
      figmaProps: { variant: 'primary', size: 'medium', text: 'Click me' },
      codeSnippet: `<Button 
  variant="primary" 
  size="medium"
>
  Click me
</Button>`,
      handoffTime: { before: '15 min', after: '2 min' },
      revisions: { before: 3, after: 0 }
    },
    badge: {
      name: 'Badge',
      icon: '🏷️',
      figmaProps: { color: 'info', rounded: true, text: 'New' },
      codeSnippet: `<Badge 
  color="info" 
  rounded={true}
>
  New
</Badge>`,
      handoffTime: { before: '10 min', after: '1 min' },
      revisions: { before: 2, after: 0 }
    },
    tooltip: {
      name: 'Tooltip',
      icon: '💬',
      figmaProps: { position: 'top', trigger: 'hover' },
      codeSnippet: `<Tooltip 
  position="top" 
  trigger="hover"
>
  Help text here
</Tooltip>`,
      handoffTime: { before: '12 min', after: '90 sec' },
      revisions: { before: 2, after: 0 }
    },
    modal: {
      name: 'Modal (Complex)',
      icon: '🪟',
      figmaProps: { size: 'large', closable: true },
      codeSnippet: `<Modal 
  size="large" 
  closable={true}
>
  {/* ⚠️ Manual implementation needed:
     - onClose handler
     - Form validation
     - Error states
     - Submit logic */}
</Modal>`,
      handoffTime: { before: '45 min', after: '30 min' },
      revisions: { before: 3, after: 2 }
    }
  };

  const selected = components[selectedComponent];

  return (
    <div className="figma-demo">
      <h2 className="demo-heading">🎨 Live Demo: Figma Code Connect in Action</h2>
      <p className="demo-description">
        See how Code Connect bridges design and development. Click components to see the instant code generation!
      </p>

      <div className="figma-demo-container">
        <div className="figma-panel">
          <div className="figma-panel-header">
            <span className="figma-logo">Figma Design</span>
          </div>
          <div className="figma-component-library">
            <div className="figma-library-label">Component Library</div>
            {Object.entries(components).map(([key, comp]) => (
              <div
                key={key}
                className={`figma-component-item ${selectedComponent === key ? 'selected' : ''}`}
                onClick={() => { setSelectedComponent(key); setShowCode(false); }}
              >
                <span className="figma-icon">{comp.icon}</span>
                <span>{comp.name}</span>
              </div>
            ))}
          </div>

          <div className="figma-properties">
            <div className="figma-properties-header">Properties</div>
            {Object.entries(selected.figmaProps).map(([key, value]) => (
              <div key={key} className="figma-property">
                <span className="figma-prop-key">{key}</span>
                <span className="figma-prop-value">{value.toString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="figma-arrow">
          <div className="arrow-line"></div>
          <div className="arrow-label">Code Connect</div>
          <div className="arrow-head">→</div>
        </div>

        <div className="code-panel">
          <div className="code-panel-header">
            <span>Developer View</span>
            <button 
              className="code-toggle-btn"
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? 'Hide Code' : 'Show Code'}
            </button>
          </div>

          {showCode ? (
            <div className="code-snippet">
              <pre><code>{selected.codeSnippet}</code></pre>
              <div className="code-copy-hint">
                ✓ Ready to copy and paste into your project
              </div>
            </div>
          ) : (
            <div className="code-placeholder">
              <div className="code-placeholder-icon">👨‍💻</div>
              <p>Click "Show Code" to see the React component code</p>
            </div>
          )}

          <div className="code-metrics">
            <div className="metric-card">
              <div className="metric-label">Handoff Time</div>
              <div className="metric-comparison">
                <span className="metric-before">{selected.handoffTime.before}</span>
                <span className="metric-arrow">→</span>
                <span className="metric-after">{selected.handoffTime.after}</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Avg. Revisions</div>
              <div className="metric-comparison">
                <span className="metric-before">{selected.revisions.before}</span>
                <span className="metric-arrow">→</span>
                <span className="metric-after">{selected.revisions.after}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="figma-demo-insights">
        <div className="insight-box success">
          <strong>✓ Perfect for Simple Components</strong>
          <p>Button, Badge, Tooltip - instant code generation with 60% time savings</p>
        </div>
        <div className="insight-box warning">
          <strong>⚠️ Complex Components Need Work</strong>
          <p>Modal still requires manual implementation of business logic and state management</p>
        </div>
      </div>
    </div>
  );
};

const ChromeExtensionDemo = () => {
  const [selectedComponent, setSelectedComponent] = React.useState(null);
  const [highlightMode, setHighlightMode] = React.useState(false);

  const mockComponents = [
    { id: 1, name: 'ds-button', count: 12, type: 'Button', properties: { variant: 'primary', size: 'medium' } },
    { id: 2, name: 'ds-card', count: 8, type: 'Card', properties: { elevated: true, padding: 'large' } },
    { id: 3, name: 'ds-badge', count: 24, type: 'Badge', properties: { color: 'info', rounded: true } },
    { id: 4, name: 'ds-input', count: 6, type: 'Input', properties: { type: 'text', required: true } }
  ];

  return (
    <div className="chrome-extension-demo">
      <h2 className="demo-heading">🔍 Live Demo: Component Inspector</h2>
      <p className="demo-description">
        This simulates what the Chrome extension shows when scanning a page. Try clicking components to inspect their properties!
      </p>

      <div className="demo-container">
        <div className="demo-sidebar">
          <div className="demo-toolbar">
            <button 
              className={`demo-highlight-btn ${highlightMode ? 'active' : ''}`}
              onClick={() => setHighlightMode(!highlightMode)}
            >
              {highlightMode ? '✓ Highlighting' : 'Enable Highlighting'}
            </button>
          </div>

          <div className="demo-component-list">
            <div className="demo-list-header">
              <strong>Components Found: {mockComponents.length}</strong>
            </div>
            {mockComponents.map(comp => (
              <div 
                key={comp.id}
                className={`demo-component-item ${selectedComponent?.id === comp.id ? 'selected' : ''}`}
                onClick={() => setSelectedComponent(comp)}
              >
                <div className="demo-component-name">
                  <code>{comp.name}</code>
                  <span className="demo-component-count">{comp.count}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="demo-inspector">
          {selectedComponent ? (
            <>
              <div className="demo-inspector-header">
                <h3>&lt;{selectedComponent.name}&gt;</h3>
                <span className="demo-inspector-type">{selectedComponent.type}</span>
              </div>
              <div className="demo-inspector-body">
                <h4>Properties</h4>
                <div className="demo-properties">
                  {Object.entries(selectedComponent.properties).map(([key, value]) => (
                    <div key={key} className="demo-property">
                      <span className="demo-property-key">{key}:</span>
                      <span className="demo-property-value">"{value.toString()}"</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="demo-inspector-empty">
              <p>← Select a component to inspect its properties</p>
            </div>
          )}
        </div>

        <div className="demo-preview">
          <div className="demo-preview-label">Page Preview</div>
          <div className="demo-page-mockup">
            {mockComponents.map(comp => (
              <div 
                key={comp.id}
                className={`demo-page-component ${highlightMode ? 'highlighted' : ''} ${selectedComponent?.id === comp.id ? 'selected' : ''}`}
                onClick={() => setSelectedComponent(comp)}
                title={comp.name}
              >
                {comp.type}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="demo-footer">
        <p>💡 This demonstrates component detection, property inspection, and visual highlighting—all core features of the Chrome extension.</p>
      </div>
    </div>
  );
};

export default BlogPost;
