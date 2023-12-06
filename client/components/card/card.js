// card.js

class Card {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
    }
  
    createCard(imageSrc, productName, ActualOwner,price ,linkText,claimLink , linkHref) {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
  
      const imageElement = document.createElement('img');
      imageElement.src = imageSrc;
      imageElement.alt = '';
  
      const contentElement = document.createElement('div');
      contentElement.classList.add('card-content');
  
      const titleElement = document.createElement('h5');
      titleElement.classList.add('card-title');
      titleElement.textContent = productName;
  
      const textElement = document.createElement('p');
      textElement.classList.add('card-text');
      textElement.textContent = ActualOwner;

      const priceElement = document.createElement('p');
      textElement.classList.add('card-text');
      textElement.textContent = price;

  
      const linkElement = document.createElement('a');
      linkElement.href = linkHref;
      linkElement.textContent = linkText;

      const ClaimElement = document.createElement('a');
      ClaimElement.href = linkHref;
      ClaimElement.textContent = claimLink;
  
      contentElement.appendChild(titleElement);
      contentElement.appendChild(textElement);
      contentElement.appendChild(priceElement);
      contentElement.appendChild(linkElement);
      contentElement.innerHTML += ("<br/>");
      contentElement.innerHTML += ("<br/>");
      contentElement.innerHTML += ("<hr/>");
      contentElement.appendChild(ClaimElement);
      contentElement.style.textTransform = "uppercase"
  
      cardElement.appendChild(imageElement);
      cardElement.appendChild(contentElement);
  
      this.container.appendChild(cardElement);
    }
  }



export default Card;