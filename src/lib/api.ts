const API = "";

// Try to get auth token
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

// Helper to fetch from API
export const apiFetch = async (path: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API}${path}`, {
        cache: 'no-store', // ensures we don't cache admin lists
        ...options,
        headers,
    });
    
    if (res.status === 401) {
        if (typeof window !== 'undefined') localStorage.removeItem('auth_token');
    }

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        let err: any = { message: '' };
        try { err = JSON.parse(text); } catch(e) {}
        throw new Error(err.error || err.message || 'API error');
    }
    if (res.status === 204) return null;
    const text = await res.text().catch(() => '');
    return text ? JSON.parse(text) : null;
};

// ── Public
export const getProjects  = () => apiFetch('/api/projects');
export const getProject   = (slug: string) => apiFetch(`/api/projects/${slug}`);

// ── Auth
export const login  = async (email: string, password: string) => {
    const res = await apiFetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (res && res.token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', res.token);
    }
    return res;
};
export const logout = async () => {
    await apiFetch('/api/logout', { method: 'POST' });
    if (typeof window !== 'undefined') localStorage.removeItem('auth_token');
};
export const getUser = () => apiFetch('/api/user');

// ── Admin
export const getAdminProjects = () => apiFetch('/api/admin/projects');
export const getStats         = () => apiFetch('/api/admin/stats');
export const createProject = (data: FormData) =>
    apiFetch('/api/admin/projects', { method:'POST', body: data }); // FormData
export const updateProject = (id: number, data: FormData) =>
    apiFetch(`/api/admin/projects/${id}`, { method:'POST', body: data }); // Laravel prefers POST with _method=PUT for multipart
export const deleteProject = (id: number) =>
    apiFetch(`/api/admin/projects/${id}`, { method:'DELETE',
        headers:{'X-XSRF-TOKEN':getCsrfToken()} });
export const toggleProject = (id: number, field: string) =>
    apiFetch(`/api/admin/projects/${id}/toggle`, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json','X-XSRF-TOKEN':getCsrfToken()},
        body: JSON.stringify({ field }),
    });
export const reorderProjects = (order: {id: number, order: number}[]) =>
    apiFetch('/api/admin/projects/reorder', {
        method: 'POST',
        headers: {'Content-Type':'application/json','X-XSRF-TOKEN':getCsrfToken()},
        body: JSON.stringify({ order }),
    });
export const uploadImage = (file: File) => {
    const form = new FormData();
    form.append('image', file);
    return apiFetch('/api/admin/upload', { method:'POST', body: form,
        headers:{'X-XSRF-TOKEN':getCsrfToken()} });
};
export const getAdminProjectPhotos = (projectId: number) => apiFetch(`/api/admin/projects/${projectId}/photos`);
export const uploadPhoto = (projectId: number, data: FormData) => apiFetch(`/api/admin/projects/${projectId}/photos`, { method: 'POST', body: data });
export const updatePhoto = (projectId: number, photoId: number, data: FormData) => apiFetch(`/api/admin/projects/${projectId}/photos/${photoId}`, { method: 'POST', body: data });
export const deletePhoto = (projectId: number, photoId: number) => apiFetch(`/api/admin/projects/${projectId}/photos/${photoId}`, { method: 'DELETE', headers: { 'X-XSRF-TOKEN': getCsrfToken() } });
export const reorderPhotos = (projectId: number, order: {id: number, order: number}[]) => apiFetch(`/api/admin/projects/${projectId}/photos/reorder`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() }, body: JSON.stringify({ order }) });
export const analyzePhoto = (projectId: number, photoId: number) => apiFetch(`/api/admin/projects/${projectId}/photos/${photoId}/analyze`, { method: 'POST', headers: { 'X-XSRF-TOKEN': getCsrfToken() } });
export const updatePhotoData = (projectId: number, photoId: number, data: any) => apiFetch(`/api/admin/projects/${projectId}/photos/${photoId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() }, body: JSON.stringify(data) });
export const uploadVideo = (projectId: number, data: FormData) => apiFetch(`/api/admin/projects/${projectId}/video`, { method: 'POST', body: data });
export const deleteVideo = (projectId: number) => apiFetch(`/api/admin/projects/${projectId}/video`, { method: 'DELETE', headers: { 'X-XSRF-TOKEN': getCsrfToken() } });

export const processThumbnail = (projectId: number, payload: any) => 
    apiFetch(`/api/admin/projects/${projectId}/process-thumbnail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
        body: JSON.stringify(payload)
    });

// ── Hero ──
export const getHeroSetting = () => apiFetch('/api/admin/hero');
export const uploadHeroPhoto = (data: FormData) => 
    apiFetch('/api/admin/hero/upload', { method: 'POST', body: data });
export const updateHeroPhoto = (data: any) => 
    apiFetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
        body: JSON.stringify(data),
    });
export const deleteHeroPhoto = () => 
    apiFetch('/api/admin/hero/photo', { method: 'DELETE', headers: { 'X-XSRF-TOKEN': getCsrfToken() } });

// ── Standalone Photography (Public) ──
export const getPhotos = (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/photos${query ? '?' + query : ''}`);
};
export const getFeaturedPhotos = () => apiFetch('/api/photos/featured');

// ── Standalone Photography (Admin) ──
export const getAdminGalleryPhotos = () => apiFetch('/api/admin/photos');
export const uploadGalleryPhoto = (file: File, source: string) => {
    const form = new FormData();
    form.append('photo', file);
    form.append('source', source);
    return apiFetch('/api/admin/photos', {
        method: 'POST', body: form,
        headers: { 'X-XSRF-TOKEN': getCsrfToken() },
    });
};
export const analyzeGalleryPhoto = (path: string) =>
    apiFetch('/api/admin/photos/analyze', {
        method: 'POST',
        headers: { 'Content-Type':'application/json','X-XSRF-TOKEN':getCsrfToken() },
        body: JSON.stringify({ path }),
    });
export const updateGalleryPhoto = (id: number, data: any) =>
    apiFetch(`/api/admin/photos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type':'application/json','X-XSRF-TOKEN':getCsrfToken() },
        body: JSON.stringify(data),
    });
export const deleteGalleryPhoto = (id: number) =>
    apiFetch(`/api/admin/photos/${id}`, {
        method: 'DELETE',
        headers: { 'X-XSRF-TOKEN': getCsrfToken() },
    });
export const toggleGalleryFeatured = (id: number) =>
    apiFetch(`/api/admin/photos/${id}/toggle-featured`, {
        method: 'PATCH',
        headers: { 'X-XSRF-TOKEN': getCsrfToken() },
    });
export const reorderGalleryPhotos = (order: {id: number, order: number}[]) =>
    apiFetch('/api/admin/photos/reorder', {
        method: 'POST',
        headers: { 'Content-Type':'application/json','X-XSRF-TOKEN':getCsrfToken() },
        body: JSON.stringify({ order }),
    });

// Read XSRF token from cookie
function getCsrfToken() {
    if (typeof document === 'undefined') return '';
    return decodeURIComponent(
        document.cookie.split(';')
            .find(c => c.trim().startsWith('XSRF-TOKEN='))
            ?.split('=')[1] ?? ''
    );
}
