export default class Player {
  constructor(name, handCards) {
    this.name = name;
    this.cardsInfo = document.querySelector('.cards-info-' + name);
    this.playInfo = document.querySelector('.play-info-' + name);
    this.takeInfo = document.querySelector('.take-info-' + name);
    this.pointInfo = document.querySelector('.point-info-' + name);
    this.point = 0;
    this.handCards = handCards; 
  }
}