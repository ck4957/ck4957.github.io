const fetchJson = async (path) => {
  const response = await fetch(path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });

  if (!response.ok) {
    throw new Error(`Unable to load ${path}: ${response.statusText}`);
  }

  return response.json();
};

const normalizeContent = (content) => ({
  sharedData: {
    basic_info: content.personal,
    skills: content.skills
  },
  resumeData: {
    basic_info: content.profile,
    projects: content.projects,
    apps: content.apps,
    apps_section: content.apps_section,
    experience: content.experience,
    ai_positioning: content.ai_positioning
  }
});

export const loadPortfolioContent = async () => {
  try {
    return normalizeContent(await fetchJson('/portfolio_content.json'));
  } catch (error) {
    console.warn(error);
    const [sharedData, resumeData] = await Promise.all([
      fetchJson('/portfolio_shared_data.json'),
      fetchJson('/res_primaryLanguage.json')
    ]);

    return { sharedData, resumeData };
  }
};

export const loadResumeManifest = async () => {
  try {
    return fetchJson('/resumes/manifest.json');
  } catch (error) {
    console.warn(error);
    return { current: null, versions: [] };
  }
};
