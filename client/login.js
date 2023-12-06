import {
	saveTokenToLocalStorage,
	redirectTo,
	getItemFromLocalStorage,
	ApiUrl
} from "./utils/index.js";

const SignInButton = document.getElementById("signInButton");

const loginUser = async () => {
	const phoneNumber = document.getElementById("phoneNumber").value;
	const password = document.getElementById("password").value;

	const params = {
		phoneNumber: phoneNumber,
		password: password
	};

	let apiPath = "/api";
	let registerPath = "/user/auth/login";

	const queryParams = new URLSearchParams(params);
	const url = ApiUrl + apiPath + registerPath + "/?" + queryParams;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();
		if (data.error) {
			displayErrorMessage();
			wipeOutPreviousForm();
		} else {
			const { token } = data.data;
			saveTokenToLocalStorage("authToken", token);
			saveTokenToLocalStorage("userInfo", JSON.stringify(data));
			const redirection = getItemFromLocalStorage("redirectUrl");
			if (redirection) {
				localStorage.removeItem("redirectUrl");
				window.location.href = redirection;
			} else {
				redirectTo("dashbord");
			}
		}
	} catch (error) {
		// Handle errors here.
		console.error("Error:", error);
	}
};

SignInButton.addEventListener("click", () => loginUser());
const displayErrorMessage = () => {
	// Assuming you have an element with the id 'error-message' to display the error
	const errorMessageElement = document.getElementById("error-message");

	// Display the error message or handle it in a way that makes sense for your UI
	if (errorMessageElement) {
		errorMessageElement.innerText = "Invalid credentials. Please try again.";
	} else {
		// If the error message element doesn't exist, you might want to create and append it to the DOM
		// For example, you could append it to the form
		const formElement = document.getElementById("loginForm");
		if (formElement) {
			const newErrorMessageElement = document.createElement("p");
			newErrorMessageElement.id = "error-message";
			newErrorMessageElement.innerText = "Invalid credentials. Please try again.";
			formElement.appendChild(newErrorMessageElement);
		}
	}
};

const wipeOutPreviousForm = () => {
	// Assuming you have an element with the id 'loginForm' for the form
	const formElement = document.getElementById("loginForm");
	formElement.reset();
};
