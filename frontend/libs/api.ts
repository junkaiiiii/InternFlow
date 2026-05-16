const BASE_URL = "https://internflow-e7km.onrender.com/api"

const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("intern-flow-token");
  };

const getHeaders = () => {
    const token = getToken();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

export const api = {
    get: (path: string) => {
        return fetch(`${BASE_URL}${path}`, {
            headers: getHeaders()
        })
            .then(res => res.json())
    },

    post: (path: string, body: unknown) => {
        return fetch(`${BASE_URL}${path}`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(body)
        })
            .then(res => res.json())
    },

    put: (path: string, body: unknown) => {
        return fetch(`${BASE_URL}${path}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(body)
        })
            .then(res => res.json())
    },

    delete: (path: string) => {
        return fetch(`${BASE_URL}${path}`, {
            method: "DELETE",
            headers: getHeaders()
        })
            .then(res => res.json())
    },


}
