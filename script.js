const apiUrl = 'https://jsonplaceholder.typicode.com/todos/';
let singleClick = true;
function capitalizeEachLetter(text) {
  let words = text.trim().split(' ');
  words = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return words.join(' ');
}

function addTodoToDOM(todo) {
  const todoList = document.querySelector('#todo-list');
  const div = document.createElement('div');
  div.classList.add('todo');
  const textNode = document.createTextNode(capitalizeEachLetter(todo.title));
  div.setAttribute('data-id', todo.id);
  div.append(textNode);
  todo.completed && div.classList.add('done');
  todoList.appendChild(div);
}

function removeFromDOM(elem) {
  elem.parentElement.removeChild(elem);
}

function getTodos() {
  return new Promise((resolve, reject) => {
    fetch(apiUrl + '?_limit=5')
      .then((res) => res.json())
      .then((todos) => resolve(todos))
      .catch((err) => reject(err));
  });
}

function createTodo(e) {
  e.preventDefault();
  const inputValue = e.target.firstElementChild.value;
  if (inputValue === '') {
    alert('Please enter some value');
    return;
  }
  const newTodo = { title: inputValue, completed: false };
  fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(newTodo),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((todo) => addTodoToDOM(todo))
    .catch((err) => console.log(err));
}

function updateTodo(e) {
  singleClick = true;
  if (!e.target.classList.contains('todo')) return;
  e.target.classList.toggle('done');
  const updatedTodo = {
    title: e.target.innerText,
    completed: e.target.classList.contains('done'),
  };
  fetch(apiUrl + `${e.target.dataset.id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedTodo),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}

function deleteTodo(e) {
  singleClick = false;
  if (!e.target.classList.contains('todo')) return;
  fetch(apiUrl + `${e.target.dataset.id}`, {
    method: 'DELETE',
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
  removeFromDOM(e.target);
}

const init = () => {
  document.addEventListener(
    'DOMContentLoaded',
    getTodos().then((todos) => todos.forEach((todo) => addTodoToDOM(todo)))
  );
  document.querySelector('#todo-form').addEventListener('submit', createTodo);
  document.querySelector('#todo-list').addEventListener('click', (e) => {
    setTimeout(() => {
      // https://stackoverflow.com/questions/48295288/how-to-handle-single-click-and-double-click-on-the-same-html-dom-element-usi
      if (singleClick) updateTodo(e);
    }, 200);
  });
  document.querySelector('#todo-list').addEventListener('dblclick', deleteTodo);
};

init();
