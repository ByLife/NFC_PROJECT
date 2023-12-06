import {
	getItemFromLocalStorage,
	redirectTo,
	saveTokenToLocalStorage,
	Logout,
	baseUrl,
	ApiUrl
} from "./utils/index.js";

let url = window.location.search;
const queryParams = url.split("&");
let LogoutButton = document.getElementById("Logout");
LogoutButton.addEventListener("click", Logout);


if (queryParams.length == 2) {
	const uid = queryParams[0].split("=")[1];
	const serialId = queryParams[1].split("=")[1];



	let tokenUser = localStorage.getItem("authToken");

	if (!tokenUser) {
		localStorage.setItem("redirectUrl", window.location.href);
		redirectTo("login")
	}

	const ClaimButton = document.getElementById("claimButton");

	const claimRequest = async (uid, serialId, token) => {
		const params = {
			serialNumber: serialId,
			uid,
			token
		};

		let apiPath = "/api";
		let claimPath = "/product/claim";

		const queryParams = new URLSearchParams(params);
		const url = ApiUrl + apiPath + claimPath + "?" + queryParams;

		try {
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			if (data.error) {
				alert(data.error);
			} else {
				alert(data.info);
			}

			// Do something with the response data.
		} catch (error) {
			// Handle errors here.
			console.error("Error:", error);
		}
	};

	ClaimButton.addEventListener(
		"click",
		async () => await claimRequest(uid, serialId, tokenUser)
	);
} else {
	redirectTo("client")
}
