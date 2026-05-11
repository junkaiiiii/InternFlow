const BASE_URL = "http://localhost:5132/api"

const getToken = () => localStorage.getItem("intern-flow-token")

export const api = {
    get: (path: string) => {
        return fetch(`${BASE_URL}${path}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
    },

    post: (path: string, body: any) => {
        return fetch(`${BASE_URL}${path}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
    },

    put: (path: string, body: any) => {
        return fetch(`${BASE_URL}${path}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
    },

    delete: (path: string) => {
        return fetch(`${BASE_URL}${path}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
    },


}