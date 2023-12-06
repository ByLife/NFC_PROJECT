import { ApiUrl, getItemFromLocalStorage, redirectTo } from "./utils/index.js";


const RegisterButton = document.getElementById("signInButton");

const createUser = async () => {

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const password = document.getElementById("password").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    const params = {
        firstName: firstName,
        lastName: lastName,
        password: password,
        phoneNumber: phoneNumber
    };

  
    let apiPath = "/api"
    let registerPath = "/user/auth/register"
  
    const queryParams = new URLSearchParams(params);
    const url = ApiUrl + apiPath + registerPath + "?" + queryParams
  
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
			const redirection = getItemFromLocalStorage("redirectUrl")
      if(redirection) {
        localStorage.removeItem("redirectUrl")
        window.location.href = redirection
      } else {
        redirectTo("login")
      }
		}
      
  
      // Do something with the response data.
    } catch (error) {
      // Handle errors here.
      console.error('Error:', error);
    }
  };



RegisterButton.addEventListener("click", () => createUser());

const displayErrorMessage = () => {
	const errorMessageElement = document.getElementById("error-message");

	if (errorMessageElement) {
		errorMessageElement.innerText = "Invalid credentials. Please try again.";
	} else {

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
