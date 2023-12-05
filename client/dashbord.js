import Card from "./components/card/card.js"



const getItemFromLocalStorage = (key) => {
    // Check if localStorage is supported by the browser
    if (typeof Storage !== 'undefined') {
        // Retrieve the value from localStorage based on the provided key
        return localStorage.getItem(key);
    } else {
        console.error('LocalStorage is not supported in this browser');
        return null;
        // You might want to implement an alternative solution for storage here
    }
};

let userInfo = getItemFromLocalStorage('userInfo')
userInfo = JSON.parse(userInfo)

console.log(userInfo);


const cardContainerId = 'card-container';
const cardComponent = new Card(cardContainerId);
cardComponent.createCard(
  'https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg',
  'Noteworthy technology acquisitions 2021',
  'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
  'Read more',
  '#'
);
