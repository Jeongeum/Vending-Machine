import ColaGenerator from "./colaGanerator.js";
import Vendingmachine from "./vendingMachine.js";

const colaGanerator = new ColaGenerator();
const vendingmachine = new Vendingmachine();

// await 이용하기
// colaGanerator가 실행될 때 까지 vendingmachine은 대기
await colaGanerator.setup();
vendingmachine.setup();
