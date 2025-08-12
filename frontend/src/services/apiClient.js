const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');

async function handleResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : await response.text();
  if (!response.ok) {
    const message = (isJson && data && (data.message || data.error)) || response.statusText;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    // eslint-disable-next-line no-console
    console.error('[API ERROR]', response.url, response.status, message, data);
    throw error;
  }
  return data;
}

function buildUrl(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export async function get(path, options = {}) {
  const url = buildUrl(path);
  // eslint-disable-next-line no-console
  console.debug('[API GET]', url);
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json', ...(options.headers || {}) },
    credentials: options.credentials || 'omit',
    mode: 'cors',
  });
  return handleResponse(res);
}

export async function post(path, body, options = {}) {
  const url = buildUrl(path);
  // eslint-disable-next-line no-console
  console.debug('[API POST]', url, body);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...(options.headers || {}) },
    credentials: options.credentials || 'omit',
    mode: 'cors',
    body: body != null ? JSON.stringify(body) : undefined,
  });
  return handleResponse(res);
}

export async function put(path, body, options = {}) {
  const url = buildUrl(path);
  // eslint-disable-next-line no-console
  console.debug('[API PUT]', url, body);
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...(options.headers || {}) },
    credentials: options.credentials || 'omit',
    mode: 'cors',
    body: body != null ? JSON.stringify(body) : undefined,
  });
  return handleResponse(res);
}

export async function del(path, options = {}) {
  const url = buildUrl(path);
  // eslint-disable-next-line no-console
  console.debug('[API DELETE]', url);
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json', ...(options.headers || {}) },
    credentials: options.credentials || 'omit',
    mode: 'cors',
  });
  return handleResponse(res);
}

export { API_BASE_URL };
