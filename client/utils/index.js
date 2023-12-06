
export const getItemFromLocalStorage = (key) => {
    // Check if localStorage is supported by the browser
    if (typeof Storage !== 'undefined') {
        // Retrieve the value from localStorage based on the provided key
        return localStorage.getItem(key);
    } else {
        console.error('LocalStorage is not supported in this browser');
        return null;
        // You might want to implement an alternative solution for storage here
    }
};


export const saveTokenToLocalStorage = (key,token) => {
    // Check if localStorage is supported by the browser
    if (typeof Storage !== 'undefined') {
        // Save the token to localStorage
        localStorage.setItem(key, token);
        console.log('Token saved to localStorage:', token);
    } else {
        // Handle the case where localStorage is not supported
        console.error('LocalStorage is not supported in this browser');
        // You might want to implement an alternative solution for token storage here
    }
};

export const redirectTo = path => {
	window.location.href = `http://localhost:5500/client/${path}.html`;
};

export const Logout = () => {
    // Redirect to login page
    redirectTo('login');

    // Remove items from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');

};


export default {
    getItemFromLocalStorage,saveTokenToLocalStorage,redirectTo,Logout
}