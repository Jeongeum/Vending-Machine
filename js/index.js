const drinkItems = document.querySelectorAll(".get-item-btn"); // 자판기 음료수 아이템
const returnBtn = document.querySelector(".return-btn"); // 반환 버튼
const insertBtn = document.querySelector(".insert-btn"); // 입금 버튼
const getBtn = document.querySelector(".get-btn"); // 획득 버튼
const balanceMoney = document.querySelector(".balance-money"); // 잔액
const haveMoney = document.querySelector(".have-money"); // 소지금
const insertMoney = document.querySelector(".insert-inp"); // 입금액
const getCart = document.querySelector(".get-cart-list"); // 벤딩머신 리스트

// 함수
function select() {
  drinkItems.forEach((item) => {
    console.log(item);
  });
}

// 이벤트 정리

// 입금 버튼 클릭 시
insertBtn.addEventListener("click", (e) => {
  if (!insertMoney.value) {
    alert("입금액을 입력해주세요!");
  }
  e.preventDefault();
  haveMoney.textContent = haveMoney.textContent - insertMoney.value; // 소지금 잔액 변경
  balanceMoney.textContent = insertMoney.value; // 잔액 변경
  insertMoney.value = "";
  console.log("click");
});

// 음료수 선택 시
drinkItems.forEach((item) => {
  const liItem = document.createElement("li");
  liItem.classList.add("get-item");
  const itemName = item.children[1].innerHTML; // 콜라 이름
  let drinkCount = 0;
  item.addEventListener("click", () => {
    getCart.appendChild(liItem);
    drinkCount++;
    liItem.innerHTML = `<img src='./images/${itemName}.png' alt='콜라'><span class='item-name'>${itemName}</span><span class='item-num'>${drinkCount}</span>`;
  });
});

// 획득 버튼 클릭 시
getBtn.addEventListener("click", (e) => {
  e.preventDefault();
});

console.log(balanceMoney.textContent);
