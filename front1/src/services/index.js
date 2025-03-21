const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ✅ Register
export const register = async (data) => {
    const response = await fetch(`${BACKEND_URL}/api/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (response.status === 200 || response.status === 400) {
        return response.json();
    }
    throw new Error('Something went wrong');
};

// ✅ Login
export const login = async (data) => {
    const response = await fetch(`${BACKEND_URL}/api/user/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (response.status === 200 || response.status === 400) {
        return response.json();
    }
    throw new Error('Something went wrong');
};

// ✅ Fetch all forms
export const getForms = async () => {
    const response = await fetch(`${BACKEND_URL}/api/user/forms`);
    if (response.ok) {
        return response.json();
    }
    throw new Error('Failed to fetch forms');
};

// ✅ Fetch single form by ID (Fix: API path was incorrect)
export const getFormById = async (id) => {
    const response = await fetch(`${BACKEND_URL}/api/user/form/${id}`); // Changed "forms" to "form"
    if (response.ok) {
        return response.json();
    }
    throw new Error('Failed to fetch form');
};

// ✅ Create a new form
export const createForm = async (data) => {
    const response = await fetch(`${BACKEND_URL}/api/user/form/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        return response.json();
    }
    throw new Error('Failed to create form');
};

// ✅ Update an existing form (Fix: API path corrected)
export const updateForm = async (id, data) => {
    const response = await fetch(`${BACKEND_URL}/api/user/form/${id}/edit`, { // Changed "forms" to "form"
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        return response.json();
    }
    throw new Error('Failed to update form');
};

// ✅ Delete a form (Fix: API path corrected)
export const deleteForm = async (id) => {
    const response = await fetch(`${BACKEND_URL}/api/user/form/${id}`, { // Changed "forms" to "form"
        method: 'DELETE'
    });
    if (response.ok) {
        return response.json();
    }
    throw new Error('Failed to delete form');
};
