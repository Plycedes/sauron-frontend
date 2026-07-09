export const ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
  },
  users: {
    byId: (id: string) => `/users/${id}`,
    myCompanies: '/users/me/companies',
  },
  companies: {
    create: '/companies',
    byId: (id: string) => `/companies/${id}`,
    members: (companyId: string) => `/companies/${companyId}/members`,
  },
  invites: {
    send: '/invites/send',
    accept: '/invites/accept',
    pending: '/invites/pending',
  },
  projects: {
    create: '/projects',
    list: '/projects',
    addMember: (id: string) => `/projects/${id}/members`,
    removeMember: (id: string, userId: string) => `/projects/${id}/members/${userId}`,
  },
  updates: {
    submit: '/updates',
    byProject: '/updates/project',
    byUser: '/updates/user',
  },
  rag: {
    query: '/query/query',
  },
  analytics: {
    projectStats: (projectId: string) => `/analytics/project/${projectId}`,
    userStats: (userId: string) => `/analytics/user/${userId}`,
    confidenceTrend: (projectId: string) => `/analytics/project/${projectId}/confidence-trend`,
    staleMembers: (projectId: string) => `/analytics/project/${projectId}/stale-members`,
  },
} as const;
