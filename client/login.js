const loginUser = async () => {
    const phoneNumber = document.getElementById('Phone_Number').value;
    const password = document.getElementById('password').value;

    const params = {
        phoneNumber: phoneNumber,
        password: password
    };

    let urlApi = "http://localhost:3000";
    let apiPath = "/api";
    let registerPath = "/user/auth/login";

    const queryParams = new URLSearchParams(params);
    const url = urlApi + apiPath + registerPath + "/?" + queryParams;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
            displayErrorMessage()
            wipeOutPreviousForm()
        }
        else {
            const { token } = data.data;
            saveTokenToLocalStorage(token)
            redirectTo("dashbord")
        }




        // Do something with the response data.
    } catch (error) {
        // Handle errors here.
        console.error('Error:', error);
    }
};

const saveTokenToLocalStorage = (token) => {
    // Check if localStorage is supported by the browser
    if (typeof Storage !== 'undefined') {
        // Save the token to localStorage
        localStorage.setItem('authToken', token);
        console.log('Token saved to localStorage:', token);
    } else {
        // Handle the case where localStorage is not supported
        console.error('LocalStorage is not supported in this browser');
        // You might want to implement an alternative solution for token storage here
    }
};


const displayErrorMessage = () => {
    // Assuming you have an element with the id 'error-message' to display the error
    const errorMessageElement = document.getElementById('error-message');

    // Display the error message or handle it in a way that makes sense for your UI
    if (errorMessageElement) {
        errorMessageElement.innerText = 'Invalid credentials. Please try again.';
    } else {
        // If the error message element doesn't exist, you might want to create and append it to the DOM
        // For example, you could append it to the form
        const formElement = document.getElementById('loginForm');
        if (formElement) {
            const newErrorMessageElement = document.createElement('p');
            newErrorMessageElement.id = 'error-message';
            newErrorMessageElement.innerText = 'Invalid credentials. Please try again.';
            formElement.appendChild(newErrorMessageElement);
        }
    }
};

const wipeOutPreviousForm = () => {
    // Assuming you have an element with the id 'loginForm' for the form
    const formElement = document.getElementById('loginForm');
    formElement.reset()
};


const redirectTo = (path) => {
    window.location.replace = `http://localhost:3000/client/${path}.html`;
}
