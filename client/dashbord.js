import Card from "./components/card/card.js";
import { getItemFromLocalStorage, Logout } from "./utils/index.js";

let userInfo = JSON.parse(getItemFromLocalStorage("userInfo"));
let HelloTitle = document.getElementsByClassName("userName");
let LogoutButton = document.getElementById("Logout");

LogoutButton.addEventListener("click", Logout);
let firstName = userInfo.data.firstName;
let lastName = userInfo.data.lastName;
let token = userInfo.data.token;
const products = [];

const retrieveAllProducts = async token => {
	const params = {
		token: token
	};

	let urlApi = "http://localhost:3000";
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
  if (firstName != undefined && lastName != undefined) {
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
              "more",
              "Claim this product",
              "#"
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



retrieveAllProducts(token);
