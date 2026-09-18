const API_URL = '/api';

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        });
        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;
        if (!response.ok) {
            const message = Array.isArray(data.erreurs)
                ? data.erreurs.join(' ')
                : data.erreur || data.message || 'Erreur inconnue';
            throw new Error(message);
        }
        return data;
    } catch (error) {
        console.error('Erreur API :', error);
        throw error;
    }
}


const AuteursAPI = {
    getAll: () => fetchAPI('/auteurs'),
    getById: (id) => fetchAPI(`/auteurs/${id}`),     
    create: (data) => fetchAPI('/auteurs', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchAPI(`/auteurs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchAPI(`/auteurs/${id}`, { method: 'DELETE' }),
};

const AdherentsAPI = {
    getAll: () => fetchAPI('/adherents'),
    getById: (id) => fetchAPI(`/adherents/${id}`),        
    getHistorique: (id) => fetchAPI(`/adherents/${id}/emprunts`),
    create: (data) => fetchAPI('/adherents', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchAPI(`/adherents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchAPI(`/adherents/${id}`, { method: 'DELETE' }),
};

const LivresAPI = {
    getAll: (search = '', page = 1, limit = 10) => 
        fetchAPI(`/livres?search=${search}&page=${page}&limit=${limit}`),
    getById: (id) => fetchAPI(`/livres/${id}`),            
    create: (data) => fetchAPI('/livres', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchAPI(`/livres/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchAPI(`/livres/${id}`, { method: 'DELETE' }),
};

const EmpruntsAPI = {
    getAll: () => fetchAPI('/emprunts'),
    getById: (id) => fetchAPI(`/emprunts/${id}`),           
    create: (data) => fetchAPI('/emprunts', { method: 'POST', body: JSON.stringify(data) }),
    retour: (id) => fetchAPI(`/emprunts/${id}/retour`, { method: 'PUT' }),
};

const DashboardAPI = {
    getStats: () => fetchAPI('/dashboard/stats'),
    getEmpruntsRecents: () => fetchAPI('/dashboard/emprunts-recents'),
};