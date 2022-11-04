class Vendingmachine {
  constructor() {
    const vMachine = document.querySelector(".vending-machine");
    this.drinkList = vMachine.querySelector(".drink-list"); // 자판기 음료수 목록
    this.balanceMoney = vMachine.querySelector(".balance-money"); // 잔액
    this.returnBtn = vMachine.querySelector(".return-btn"); // 반환 버튼
    this.insertMoney = vMachine.querySelector(".insert-inp"); // 입금액
    this.insertBtn = vMachine.querySelector(".insert-btn"); // 입금 버튼
    this.getCart = vMachine.querySelector(".get-cart-list"); // 선택한 음료 목록
    this.getBtn = vMachine.querySelector(".get-btn"); // 획득 버튼

    const myInfo = document.querySelector(".my-info");
    this.haveMoney = myInfo.querySelector(".have-money"); // 소지금
    this.gotCart = myInfo.querySelector(".get-cart-list"); // 획득한 음료 목록
    this.getTotal = myInfo.querySelector(".get-total"); // 총 금액
  }

  setup() {
    this.bindEvents();
  }

  // 선택한 음료수 목록 생성
  stagedItemGenerator(target) {
    const stagedItem = document.createElement("li");
    stagedItem.dataset.item = target.dataset.item;
    stagedItem.dataset.price = target.dataset.price;
    stagedItem.innerHTML = `
        <button type="button" class="get-item">
            <img src="./images/${target.dataset.img}" alt="">
            <strong class="item-name">${target.dataset.item}</strong>
            <span class="item-num">1</span>
        </button>
    `;
    this.getCart.appendChild(stagedItem);
  }

  // 이벤트 정리 함수
  bindEvents() {
    /*
     * 1. 입금 버튼 기능
     * 입금액을 입력하고 입금 버튼을 누르면 소지금 == 소지금 - 입금액, 잔액 == 기존 잔액 + 입금액이 됩니다.
     * 입금액이 소지금 보다 많다면 실행을 중단하고 "소지금이 부족합니다." 라고 쓰인 경고창을 띄웁니다.
     * 입금액 인풋창은 초기화됩니다.
     * */

    this.insertBtn.addEventListener("click", (e) => {
      console.log("click");
      const inputCost = parseInt(this.insertMoney.value); // 입금액
      const myMoneyVal = parseInt(
        this.haveMoney.textContent.replaceAll(",", "")
      ); // 소지금
      const balanceVal = parseInt(
        this.balanceMoney.textContent.replaceAll(",", "")
      ); // 잔액

      if (inputCost) {
        if (inputCost <= myMoneyVal) {
          this.haveMoney.textContent =
            new Intl.NumberFormat().format(myMoneyVal - inputCost) + " 원";
          this.balanceMoney.textContent =
            new Intl.NumberFormat().format(
              (balanceVal ? balanceVal : 0) + inputCost
            ) + " 원"; // 잔액이 없을 경우는 0, 잔액이 남아있는데 입금을 또 하는 경우는 balanceVal을 그대로 사용
        } else if (inputCost < 0) {
          alert("올바른 금액을 입력하세요!");
        } else {
          alert("소지금이 부족합니다.");
        }
        this.insertMoney.value = null;
      }
    });

    /*
     * 2. 거스름돈 반환 버튼 기능
     * 반환 버튼을 누르면 소지금 == 소지금 + 잔액이 됩니다.
     * 반환 버튼을 누르면 잔액 창은 초기화됩니다.
     */

    this.returnBtn.addEventListener("click", (event) => {
      const balanceVal = parseInt(
        this.balanceMoney.textContent.replaceAll(",", "")
      );
      const myMoneyVal = parseInt(
        this.haveMoney.textContent.replaceAll(",", "")
      );

      if (balanceVal) {
        this.haveMoney.textContent =
          new Intl.NumberFormat().format(balanceVal + myMoneyVal) + " 원";
        this.balanceMoney.textContent = "원";
      }
    });

    /*
     * 3. 자판기 메뉴 기능
     * 아이템을 누르면 잔액 == 잔액 - 아이템 가격이 됩니다.
     * 아이템 가격보다 잔액이 적다면 "잔액이 부족합니다. 돈을 입금해주세요" 경고창이 나타납니다.
     * 아이템이 획득가능 창에 등록됩니다.
     * 아이템 버튼의 data-count 값이 -1 됩니다.
     * 만약 data-count 값이 0 이라면 부모 li에 sold-out 클래스를 붙여줍니다.
     */

    const btnsCola = this.drinkList.querySelectorAll("button");

    btnsCola.forEach((item) => {
      item.addEventListener("click", (event) => {
        const targetEl = event.currentTarget; // 현재 내가 클릭한 버튼
        const balanceVal = parseInt(
          this.balanceMoney.textContent.replaceAll(",", "")
        );
        let isStaged = false; // 이미 선택되었는지를 판단하기 위해 상태 저장
        const targetElPrice = parseInt(targetEl.dataset.price); // 내가 클릭한 버튼의 데이터에 저장된 가격
        const stagedListItem = this.getCart.querySelectorAll("li"); // 선택한 음료 li 모두

        // 예외처리
        // 잔액이 1000원보다 많거나 같아야 함.
        if (balanceVal >= targetElPrice) {
          this.balanceMoney.textContent =
            new Intl.NumberFormat().format(balanceVal - targetElPrice) + " 원";

          // 클릭한 음료수가 내가 이미 선택한 아이템인지 탐색한다.
          for (const item of stagedListItem) {
            // 만약, 내가 클릭한 음료수 이름과 이미 선택된 목록에 있는 음료수 이름이 같은 경우
            // 즉, 이미 한번 선택한 적이 있는 음료수인 경우
            if (item.dataset.item === targetEl.dataset.item) {
              item.querySelector(".item-num").textContent++;
              isStaged = true;
              break;
            }
          }

          // 처음 선택한 경우
          if (!isStaged) {
            this.stagedItemGenerator(targetEl);
          }

          // 콜라를 선택할 때마다 저장되어있는 콜라의 갯수 감소
          targetEl.dataset.count--;

          // 상품 소진 시
          if (parseInt(targetEl.dataset.count) === 0) {
            targetEl.parentElement.classList.add("soldout");
            const warning = document.createElement("em");
            warning.textContent = "품절되었습니다.";
            warning.classList.add("ir");
            // em 요소를 button 요소의 앞에 배치하여 스크린리더가 읽을 수 있도록 한다.
            targetEl.parentElement.insertBefore(warning, targetEl);
          }
        } else {
          alert("잔액이 부족합니다. 돈을 입금해주세요");
        }
      });
    });

    /**
     * 4. 획득 버튼 기능
     * 획득 버튼을 누르면 선택한 음료수 목록이 획득한 음료 목록으로 이동합니다.
     * 획득한 음료의 금액을 모두 합하여 총금액을 업데이트 합니다.
     */

    this.getBtn.addEventListener("click", (event) => {
      let isGot = false;
      let totalPrice = 0;
      // 내가 선택한 음료수 목록과 이미 획득한 음료수 목록을 비교한다.
      for (const getItem of this.getCart.querySelectorAll("li")) {
        for (const gotItem of this.gotCart.querySelectorAll("li")) {
          let gotItemCount = gotItem.querySelector(".item-num");
          // 내가 선택한 음료수와 이미 획득한 음료수가 같으면 갯수를 업데이트 한다.
          // 획득한 음료 각각 카운트 = 기존에 획득한 음료 개수 + 내가 선택한 음료 개수
          if (getItem.dataset.item === gotItem.dataset.item) {
            gotItemCount.textContent =
              parseInt(gotItemCount.textContent) +
              parseInt(getItem.querySelector(".item-num").textContent);
            isGot = true;
            break;
          }
        }

        // 처음 획득하는 음료수라면
        if (!isGot) {
          this.gotCart.appendChild(getItem);
        }
      }
      // 자판기 내 내가 선택한 목록(get-cart-list)을 초기화 한다.
      this.getCart.innerHTML = null;

      // 획득한 음료 목록 순회돌면서 총 금액 계산
      // 음료 가격 * 음료 개수
      this.gotCart.querySelectorAll("li").forEach((gotItem) => {
        totalPrice +=
          gotItem.dataset.price *
          parseInt(gotItem.querySelector(".item-num").textContent);
      });

      this.getTotal.textContent = `총금액 : ${new Intl.NumberFormat().format(
        totalPrice
      )}원`;
    });
  }
}

export default Vendingmachine;
