import { redirectTo } from "./utils/index.js";
import {ApiUrl} from "./config.js"

let url = window.location.search;
const token = url.split("=")[1];

const redirectUser = async token => {
	const params = {
		token: token
	};

	let urlApi = ApiUrl;
	let apiPath = "/api";
	let registerPath = "/user/auth/get";

	const queryParams = new URLSearchParams(params);
	const url = urlApi + apiPath + registerPath + "/?" + queryParams;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();

		if (data.error) redirectTo("register");
		if (data.info) redirectTo("login");

		// Do something with the response data.
	} catch (error) {
		// Handle errors here.
		console.error("Error:", error);
	}
};

redirectUser(token);
