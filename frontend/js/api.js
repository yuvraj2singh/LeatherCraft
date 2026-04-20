const API_BASE_URL =
  window.LEATHERCRAFT_API_BASE_URL ||
  localStorage.getItem('leathercraft_api_base_url') ||
  ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5001/api'
    : '/api');

const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('leathercraft_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const text = await response.text();
    let msg = text;
    try { msg = JSON.parse(text).message || text; } catch (_) {}
    throw new Error(msg || 'Something went wrong');
  }

  return response.json();
};

window.api = {
  // Auth
  login: (email, password) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (name, email, password, role) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role })
  }),

  // Inventory
  getInventory: () => fetchAPI('/inventory'),
  addInventory: (itemData) => fetchAPI('/inventory', {
    method: 'POST',
    body: JSON.stringify(itemData)
  }),
  updateInventory: (id, itemData) => fetchAPI(`/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(itemData)
  }),
  deleteInventory: (id) => fetchAPI(`/inventory/${id}`, {
    method: 'DELETE'
  }),

  // Users
  updateProfile: (data) => fetchAPI('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  getUsers: () => fetchAPI('/users'),

  // Projects (Archive)
  getProjects: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchAPI(`/projects${qs ? '?' + qs : ''}`);
  },
  createProject: (data) => fetchAPI('/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateProject: (id, data) => fetchAPI(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteProject: (id) => fetchAPI(`/projects/${id}`, { method: 'DELETE' }),
  patchProjectStatus: (id, status) => fetchAPI(`/projects/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  // Suppliers (Partner Tanneries)
  getSuppliers: () => fetchAPI('/suppliers'),
  createSupplier: (data) => fetchAPI('/suppliers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateSupplier: (id, data) => fetchAPI(`/suppliers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteSupplier: (id) => fetchAPI(`/suppliers/${id}`, { method: 'DELETE' })
};
