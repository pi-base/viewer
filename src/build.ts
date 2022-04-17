const env = (import.meta as any).env

export const branch = env.REACT_APP_BRANCH || 'dev'
export const commitRef = env.REACT_APP_COMMIT_REF || 'head'
export const context = env.REACT_APP_CONTEXT || 'dev'
export const netlify = env.REACT_APP_NETLIFY || false
