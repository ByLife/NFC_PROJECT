import {getItemFromLocalStorage,redirectTo,saveTokenToLocalStorage} from "./utils/index.js"
import {baseUrl,ApiUrl} from "./config.js"


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const uid = urlParams.get('uid')
const serialId = urlParams.get('serialNumber')

if(!uid || !serialId) redirectTo('dashbord')

let tokenUser= localStorage.getItem("authToken")

if(!tokenUser) {
    localStorage.setItem("redirectUrl", window.location.href)
    //window.location.href = baseUrl + "/client/login.html?error=azjhifazzf"
    console.log(tokenUser)
}

const ChangerOwnerButton = document.getElementById("ChangerOwnerButton")

const ChangerOwner = async (uid, serialId, token,userId) => {

	const params = {
        serialNumber: serialId,
        uid,
        token,
        userId
	};
    
	let urlApi = ApiUrl;
	let apiPath = "/api";
	let changeOwernPath = "/product/changeowner";
    

    console.log(params)

	const queryParams = new URLSearchParams(params);
	const url = urlApi + apiPath + changeOwernPath + "?" + queryParams;
    
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

ChangerOwnerButton.addEventListener('click', async () => {
    var userId = document.getElementById('userId2').value
    await ChangerOwner(uid, serialId, tokenUser,userId)
})

