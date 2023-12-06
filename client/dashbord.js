// dashbord.js

import Card from "./components/card/card.js";
import { ApiUrl, getItemFromLocalStorage, Logout } from "./utils/index.js";

let userInfo = JSON.parse(getItemFromLocalStorage("userInfo"));
let HelloTitle = document.getElementsByClassName("userName");
let LogoutButton = document.getElementById("Logout");
let userIdElement = document.getElementById("userId");

LogoutButton.addEventListener("click", Logout);
let firstName = userInfo?.data?.firstName;
let lastName = userInfo?.data?.lastName;
let token = userInfo?.data?.token;
let userId = userInfo?.data?.user_id;

const products = [];

const retrieveAllUserProducts = async (token) => {
    const params = {
        token: token
    };

    let apiPath = "/api";
    let registerPath = "/user/product/get";

    const queryParams = new URLSearchParams(params);
    const url = ApiUrl + apiPath + registerPath + "/?" + queryParams;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        let userProducts = data.data;

        if (userProducts !== null) {
            userProducts.forEach(p => {
                products.push(p);
            });
        }
        displayContent();
    } catch (error) {
        console.error("Error:", error);
    }
};

const displayPreviousOwners = (previousOwners) => {
    const previousOwnersList = document.getElementById("previousOwnersList");

    if (previousOwners.length > 0) {
        previousOwners.forEach((owner) => {
            const listItem = document.createElement("li");
            listItem.textContent = owner;
            previousOwnersList.appendChild(listItem);
        });
    } else {
        const listItem = document.createElement("li");
        listItem.textContent = "No previous owners found.";
        previousOwnersList.appendChild(listItem);
    }
};

const retrieveAllPreviousOwners = async (uid, serialId, token) => {
    const params = {
        serialNumber: serialId,
        uid,
        token,
    };

    let apiPath = "/api";
    let previousOwnersPath = "/product/previousowners";

    const queryParams = new URLSearchParams(params);
    const url = ApiUrl + apiPath + previousOwnersPath + "?" + queryParams;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const previousOwners = data.previousOwners || [];
        displayPreviousOwners(previousOwners);
    } catch (error) {
        console.error("Error fetching previous owners:", error);
    }
};

const displayContent = () => {
    if (firstName !== undefined && lastName !== undefined && userId !== undefined) {
        userIdElement.textContent += userId;
        HelloTitle[0].textContent += `${firstName} ${lastName}`;
    } else {
        HelloTitle[0].textContent += `Unknown User ... `;
    }

    const cardContainerId = "card-container";

    if (products.length !== 0) {
        products.forEach(p => {
			const names = [];
			const previousOwners = p.previousOwners.map((previous) =>{
				names.push(previous.firstName);
			})

			const cardComponent = new Card(cardContainerId);
            cardComponent.createCard(
                "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
                `${p.productName}`,
                `Actual Owner: ${p.actualOwner.firstName}`,
                `Previous Owners: ${names.join(' ,')}`,
                `${p.price}$`,
                "Change the owner",
                `./changeOwner.html?uid=${p.uid}&serialNumber=${p.serial_id}`,
            );
        });
    } else {
        const contentElement = document.createElement("div");
        contentElement.textContent = "No products here.";
        contentElement.style.color = "#666";
        contentElement.style.fontSize = "16px";
        contentElement.style.textAlign = "center";

        const WelcomeMessage = document.getElementById("welcomeMessage");
        WelcomeMessage.textContent = "";
        const cardContainer = document.getElementById(cardContainerId);
        cardContainer.innerHTML = "";
        cardContainer.appendChild(contentElement);
    }

    // retrieveAllPreviousOwners(userId, products[0]?.serial_id, token);
};

retrieveAllUserProducts(token);
