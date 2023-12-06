import {
	ApiUrl,
	Logout, redirectTo
} from "./utils/index.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const uid = urlParams.get("uid");
const serialId = urlParams.get("serialNumber");
let LogoutButton = document.getElementById("Logout");
let GoBackDashboardButton = document.getElementById("dashboard");

GoBackDashboardButton.style.color = "white"
GoBackDashboardButton.style.textDecoration = "none"

LogoutButton.addEventListener("click", Logout);
LogoutButton.style.color = "white"


if (!uid || !serialId) redirectTo("dashbord");

let tokenUser = localStorage.getItem("authToken");

if (!tokenUser) {
	localStorage.setItem("redirectUrl", window.location.href);
	redirectTo("login");
}

const ChangerOwnerButton = document.getElementById("ChangerOwnerButton");

const ChangerOwner = async (uid, serialId, token, userId) => {
	const params = {
		serialNumber: serialId,
		uid,
		token,
		userId
	};

	let apiPath = "/api";
	let changeOwernPath = "/product/changeowner";

	const queryParams = new URLSearchParams(params);
	const url = ApiUrl + apiPath + changeOwernPath + "?" + queryParams;

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

ChangerOwnerButton.addEventListener("click", async () => {
	let userId = document.getElementById("userId2").value;
	await ChangerOwner(uid, serialId, tokenUser, userId);
});


