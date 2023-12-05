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
        console.log(data)
        // const {
        //     _id,
        //     user_id,
        //     token,
        //     firstName,
        //     lastName,
        //     password,
        //     phone_number,
        //     created_at,
        //     role,
        //     __v
        // } = data.data;

        // console.log(data)
        
        // // Now you can use these variables as needed
        // console.log(_id, user_id, token, firstName, lastName, password, phone_number, created_at, role, __v);

        saveTokenToLocalStorage(token)
        

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