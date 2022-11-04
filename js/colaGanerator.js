// 콜라를 생산하는 클래스

class ColaGenerator {
  constructor() {
    this.itemList = document.querySelector(".drink-list");
  }

  async setup() {
    await this.loadData((json) => {
      this.colaFactory(json);
    });
  }

  async loadData(callback) {
    // fetch 이용
    const response = await fetch("js/item.json");

    if (response.ok) {
      //hhtp 프로토콜로 받는 상태코드가 200~299일 경우
      callback(await response.json());
    } else {
      alert("통신 에러!" + response.status);
    }
  }

  colaFactory(data) {
    // 최적화
    const docFrag = document.createDocumentFragment();
    data.forEach((el) => {
      const item = document.createElement("li");
      const itemTemplate = `
          <button type="button" class="get-item-btn" data-item="${el.name}" data-count="${el.count}" data-price="${el.cost}" data-img="${el.img}">
              <img src="images/${el.img}" alt="" class="img-item">
              <strong class="tit-item">${el.name}</strong>
              <span class="txt-price">${el.cost}원</span>
          </button>
          `;
      item.innerHTML = itemTemplate;
      docFrag.appendChild(item);
    });
    this.itemList.appendChild(docFrag);
  }
}

export default ColaGenerator;
