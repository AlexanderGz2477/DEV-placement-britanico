const BACKEND_PROTOCOL = import.meta.env.VITE_BACKEND_PROTOCOL || 'http'
const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST || 'localhost'
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT ? ':' + import.meta.env.VITE_BACKEND_PORT : ''
const BACKEND_URL = `${BACKEND_PROTOCOL}://${BACKEND_HOST}${BACKEND_PORT}`
console.log({BACKEND_URL})

export {
    BACKEND_PROTOCOL,
    BACKEND_HOST,
    BACKEND_PORT,
    BACKEND_URL,
}