(() => {
 'use strict';

  const URL = 'https://cdn.rawgit.com/Pavel-Sachivkin/json/fb12b556/table.json';

 window.load = (onSuccess, onError) => {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', URL);

  xhr.addEventListener('load', (evt) => {
   if (xhr.status === 200) {
    onSuccess(JSON.parse(xhr.responseText));
   } else {
    onError(`Ошибка загрузки данных: статус ${xhr.status} ${xhr.statusText}`);
   }
  });

  xhr.addEventListener('error', (evt) => {
   onError('Произошла ошибка соединения');
  });

  xhr.addEventListener('timeout', (evt) => {
   onError(`Запрос не успел выполниться за ${xhr.timeout} мс`);
  });

  xhr.timeout = 10000;

  xhr.send();
 };
})();

(() => {
 'use strict';

 const tableOrderCarList = document.querySelector('#table-order-car');
 const orderCarTemplate = document.querySelector('#template-order-car').content;

 const addingForm = document.querySelector('.form'),
  inputName = addingForm.querySelector('#input-name'),
  inputYear = addingForm.querySelector('#input-year'),
  inputPrice = addingForm.querySelector('#input-price'),
  inputDescription = addingForm.querySelector('#input-description'),
  radiosName = addingForm.querySelectorAll('.form__input-radio[name="color"]'),
  selectStatus = addingForm.querySelector('#select-status'),
  formInputs = addingForm.querySelectorAll('.form__input');

 const renderOrderCar = (orderCar) => {
  const identificationOfStatus = (carStatus) => {
   switch (carStatus) {
    case 'pednding':
     return 'Ожидается';
    case 'out_of_stock':
     return 'Нет в наличии';
    case 'in_stock':
     return 'В наличии';
    default:
     return 'Нет в наличии';
   }
  };

  const carStatus = identificationOfStatus(orderCar.status);

  const carElement = orderCarTemplate.cloneNode(true);
  const carElementTable = carElement.querySelector('.table__item');

  carElement.querySelector('.table__item-value--title').textContent = orderCar.title;
  carElement.querySelector('.table__item-value--description').textContent = orderCar.description;
  carElement.querySelector('.table__item-value--description-mobile').textContent = orderCar.description;
  carElement.querySelector('.table__item-value--year').textContent = orderCar.year;
  carElement.querySelector('.circle-color').classList.add(`circle-color--${orderCar.color}`);
  carElement.querySelector('.table__item-value--status').textContent = carStatus;
  carElement.querySelector('.table__item-value--price').textContent = `${orderCar.price} руб.`;
  carElement.querySelector('.btn--delete').addEventListener('click', (evt) => {
   carElementTable.remove();
  });

  return carElement;
 };

 const createNewOrderCar = () => {
  const checkRadio = (elems) => {
   for (let i = 0; i < elems.length; i++) {
    if (elems[i].checked) {
     return elems[i];
    }
   }
  };

  orderCarLastID++;

  const orderCar = {
   id: orderCarLastID,
   title: inputName.value,
   description: inputDescription.value,
   year: inputYear.value,
   color: checkRadio(radiosName).value,
   status: selectStatus.value,
   price: inputPrice.value
  };

  return orderCar;
 };

 const isValidityInputs = (...inputsForm) => {
  const inputsFormFilter = [].filter.call(inputsForm, (elem) => elem.value);

  return inputsFormFilter.length;
 };

 const onAddNewOrderCar = (evt) => {
  const fragment = document.createDocumentFragment(),
   newOrderCar = createNewOrderCar();

  if (isValidityInputs(inputName, inputYear, inputPrice)) {

   if (Number(inputYear.value) && Number(inputPrice.value)) {
    fragment.appendChild(renderOrderCar(newOrderCar));
    tableOrderCarList.appendChild(fragment);
   }

  }
 };

 const successHandler = (orderCar) => {
  window.orderCarLastID = orderCar.length;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < orderCar.length; i++) {
   fragment.appendChild(renderOrderCar(orderCar[i]));
  }

  tableOrderCarList.appendChild(fragment);
 };

 const errorHandler = (errorMessage) => {
  const node = document.createElement('div');

  node.classList.add('error-message');
  node.textContent = errorMessage;
  document.body.insertAdjacentElement('afterbegin', node);
 };

 [].forEach.call(formInputs, (elem) => {
  elem.addEventListener('blur', (evt) => {
   if (elem.value) {
    elem.nextElementSibling.classList.add('form__input-title--show');
   } else {
    elem.nextElementSibling.classList.remove('form__input-title--show');
   }
  });
 });

 addingForm.querySelector('.btn--submit').addEventListener('click', onAddNewOrderCar);

 load(successHandler, errorHandler);
})();