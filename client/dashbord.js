import Card from "./components/card/card.js";
import {ApiUrl} from "./config.js"

import { getItemFromLocalStorage, Logout } from "./utils/index.js";

let userInfo = JSON.parse(getItemFromLocalStorage("userInfo"));
let HelloTitle = document.getElementsByClassName("userName");
let LogoutButton = document.getElementById("Logout");
let userIdElement = document.getElementById("userId")


LogoutButton.addEventListener("click", Logout);
let firstName = userInfo.data.firstName;
let lastName = userInfo.data.lastName;
let token = userInfo.data.token;
let userId = userInfo.data.user_id;

console.log(userId)
const products = [];

const retrieveAllUserProducts = async token => {
	const params = {
		token: token
	};

	let urlApi = ApiUrl;
	let apiPath = "/api";
	let registerPath = "/user/product/get";

	const queryParams = new URLSearchParams(params);
	const url = urlApi + apiPath + registerPath + "/?" + queryParams;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();
    let Userproducts = data.data;

		if (Userproducts !== null) {
			Userproducts.forEach(p => {
				products.push(p);
			});
		}
		displayContent();
	} catch (error) {
		// Handle errors here.
		console.error("Error:", error);
	}
};


const retrieveAllProducts = async token => {
	const params = {
		token: token
	};

	let urlApi = ApiUrl;
	let apiPath = "/api";
	let registerPath = "/user/product/get";

	const queryParams = new URLSearchParams(params);
	const url = urlApi + apiPath + registerPath + "/?" + queryParams;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();
    let Userproducts = data.data;

		if (Userproducts !== null) {
			Userproducts.forEach(p => {
				products.push(p);
			});
		}
		displayContent();
	} catch (error) {
		// Handle errors here.
		console.error("Error:", error);
	}
};

const displayContent = () => {
  if (firstName != undefined && lastName != undefined && userId != undefined) {
      userIdElement.textContent += userId
      HelloTitle[0].textContent += `${firstName} ${lastName}`;
  } else {
      HelloTitle[0].textContent += `Unknown User ... `;
  }

  const cardContainerId = "card-container";

  if (products.length !== 0) {
      products.forEach(p => {
          const cardComponent = new Card(cardContainerId);
          cardComponent.createCard(
              "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
              `${p.productName}`,
              `Actual Owner : ${p.actualOwner}`,
              `${p.price} $`,
              "",
              "Change the owner",
              `./changeOwner.html?uid=${p.uid}&serialNumber=${p.serial_id}`
          );
      });
  } else {
      // If there are no products, display a message
      const contentElement = document.createElement("div");
      contentElement.textContent = "No products here.";
      contentElement.style.color = "#666"; // You can customize the style
      contentElement.style.fontSize = "16px";
      contentElement.style.textAlign = "center";

      // Assuming you have an element with the id 'card-container' to append the message to
      const WelcomeMessage = document.getElementById("welcomeMessage")
      WelcomeMessage.textContent = ""
      const cardContainer = document.getElementById(cardContainerId);
      cardContainer.innerHTML = ""; // Clear the container
      cardContainer.appendChild(contentElement);
  }
};



retrieveAllUserProducts(token);
