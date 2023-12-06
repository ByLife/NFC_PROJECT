import {getItemFromLocalStorage,redirectTo,saveTokenToLocalStorage,Logout} from "./utils/index.js"
import {baseUrl,ApiUrl} from "./config.js"

let url = window.location.search;
const queryParams = url.split("&");
let LogoutButton = document.getElementById("Logout");
LogoutButton.addEventListener("click", Logout);

console.log(queryParams.length)

if(queryParams.length == 2) {
const uid = queryParams[0].split('=')[1]
const serialId = queryParams[1].split('=')[1]

console.log(uid)
console.log(serialId)

let tokenUser= localStorage.getItem("authToken")


if(!tokenUser) {
    localStorage.setItem("redirectUrl", window.location.href)
    window.location.href = baseUrl + "/client/login.html?error=azjhifazzf"
    console.log(tokenUser)
}

const ClaimButton = document.getElementById("claimButton")
console.log(ClaimButton)

const claimRequest = async (uid, serialId, token) => {

	const params = {
        serialNumber: serialId,
        uid,
        token
	};
    
	let urlApi = ApiUrl;
	let apiPath = "/api";
	let claimPath = "/product/claim";
    
	const queryParams = new URLSearchParams(params);
	const url = urlApi + apiPath + claimPath + "?" + queryParams;
    
	try {
        const response = await fetch(url);
        
		if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
		}
        
		const data = await response.json();
		if (data.error) {
            alert(data.error)
		} else {
			alert(data.info)
		}
        
		// Do something with the response data.
	} catch (error) {
        // Handle errors here.
		console.error("Error:", error);
	}
};

ClaimButton.addEventListener('click', async () => await claimRequest(uid, serialId, tokenUser))


} else {
    console.log(queryParams.length)
    //window.location.href = baseUrl+"/client"     
}

