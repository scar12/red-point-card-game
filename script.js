import Deck from "./deck.js"
import Player from "./player.js";

const CARD_VALUE_MAP = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 10,
    "10": 10,
    J: 10,
    Q: 10,
    K: 10,
    A: 20
  }

const tableCards = document.querySelector('.table-cards');
const unfoldInfo = document.querySelector('.unfold-card');
const resultInfo = document.querySelector('.result');

const deck = new Deck();
deck.shuffle();


// 各自发10张牌
let handCardsOne= new Deck(deck.cards.slice(0, 10));
let handCardsTwo = new Deck(deck.cards.slice(10, 20));

let playerOne = new Player('one', handCardsOne.cards);
let playerTwo = new Player('two', handCardsTwo.cards);


// 亮出12张牌于桌面
let cardsInTable = new Deck(deck.cards.slice(20, 32));
let cardInDeck = new Deck(deck.cards.slice(32));


// 界面初始化
renderCards(tableCards, cardsInTable.cards);
renderCards(playerOne.cardsInfo, playerOne.handCards);
renderCards(playerTwo.cardsInfo, playerTwo.handCards);


// 渲染卡牌信息
function renderCards(node,cards){
  // 删除所有子节点
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
  addCard(node, cards)
}

// 将卡牌信息逐个添加父节点下
function addCard(node, cards){
  for(let i = 0; i < cards.length; i++){
    let child = document.createElement('span');
    child.style.color = cards[i].color === "red" ? "red" : "black";
    child.textContent = cards[i].suit + cards[i].value + " ";
    child.setAttribute('data-id',i.toString());
    node.appendChild(child);
  }
}

// 为卡牌的点击事件注册监听器
playerOne.cardsInfo.addEventListener('click', (e) => {selectHandCard(playerOne, e)});
playerTwo.cardsInfo.addEventListener('click', (e) => {selectHandCard(playerTwo, e)});

function selectHandCard(player, event) {
  let target = event.target;
  let targetId = target.getAttribute('data-id');
  play(player, targetId)

}

// 更新当前玩家和桌面的卡牌信息，并计算当前得分
function play(player, handCardId){
  let cardOfSelect = player.handCards[handCardId];
  // 将已出的牌记录
  addCard(player.playInfo, [cardOfSelect]);
  player.point += match(cardOfSelect, player.takeInfo);
  // 更新手牌信息
  player.handCards.splice(handCardId, 1);
  renderCards(player.cardsInfo, player.handCards);
  // 翻出一张牌
  let drawCard = cardInDeck.pop();
  renderCards(unfoldInfo, [drawCard]);
  // 更新玩家得分
  player.point += match(drawCard, player.takeInfo);
  player.pointInfo.textContent = "目前获得点数: " + player.point;
  // 对手回合隐藏己方卡牌信息
  playerOne.cardsInfo.style.visibility = player.name === "one" ? "hidden" : "visible";
  playerTwo.cardsInfo.style.visibility = player.name === "two" ? "hidden" : "visible";
  isEmpty();
  }

// 传入指定卡牌与桌面上的牌匹配,返回点数
function match(card, takeInfo){
  let cards = cardsInTable.cards;
  let pointSum = 0;
  let cardId = false;
  for(let i = 0; i < cards.length; i++){
    let valueSum = CARD_VALUE_MAP[card.value] + CARD_VALUE_MAP[cards[i].value];
    let tenList = ["5", "10", "J", "Q", "K"];
    if( tenList.includes(cards[i].value) || tenList.includes(card.value) ){
      if(cards[i].value === card.value){
        if(card.color === "red" & cards[i].color === "red"){
          pointSum = valueSum;
          cardId = i;
          break;
        }
        if(card.color === "red" || cards[i].color === "red"){
          pointSum = valueSum - CARD_VALUE_MAP[card.value];
          cardId = i;
        }
        cardId = pointSum === 0 ? i : cardId; 
      }
    }else{
      // 排除99和AA配对情况
      if(valueSum % 10 === 0 & valueSum !== 20 & valueSum !== 40){
        if(card.color === "red" & cards[i].color === "red"){
            pointSum = valueSum;
            cardId = i;
            break;
        }
        if(card.color === "red" || cards[i].color === "red"){
            // 记录下红色牌的点数
            pointSum = card.color === "red" ? CARD_VALUE_MAP[card.value] : CARD_VALUE_MAP[cards[i].value];
            cardId = i;
        }
        // pointSum为0表示未匹配到红牌，当前第i张为匹配的黑牌，故记录下i
        cardId = pointSum === 0 ? i : cardId;
      }
    }    
  }
  // 有匹配的牌则拿走并记录得分，否则将牌置于桌面
  if(cardId !== false) {
    let matchCard = cards[cardId];
    // 记录到 拿走的牌 一栏
    addCard(takeInfo, [card,matchCard]);
    cardsInTable.delete(cardId);
    renderCards(tableCards, cardsInTable.cards);
    return pointSum
  }else{
    cardsInTable.push(card);
    renderCards(tableCards, cardsInTable.cards);
    return 0
  }
}

// 结束判断
function isEmpty(){
  if(playerTwo.handCards.length === 0){
    if( playerOne.point === playerTwo.point){
        resultInfo.textContent = "平局...";
    }
    let winner = point > pointTwo ? "1P" : "2P";
    resultInfo.textContent = winner + "胜利！！！";
  }
}



