// card.js

class Card {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
    }
  
    createCard(imageSrc, title, content, linkText, linkHref) {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
  
      const imageElement = document.createElement('img');
      imageElement.src = imageSrc;
      imageElement.alt = '';
  
      const contentElement = document.createElement('div');
      contentElement.classList.add('card-content');
  
      const titleElement = document.createElement('h5');
      titleElement.classList.add('card-title');
      titleElement.textContent = title;
  
      const textElement = document.createElement('p');
      textElement.classList.add('card-text');
      textElement.textContent = content;
  
      const linkElement = document.createElement('a');
      linkElement.href = linkHref;
      linkElement.textContent = linkText;
  
      contentElement.appendChild(titleElement);
      contentElement.appendChild(textElement);
      contentElement.appendChild(linkElement);
  
      cardElement.appendChild(imageElement);
      cardElement.appendChild(contentElement);
  
      this.container.appendChild(cardElement);
    }
  }



export default Card;