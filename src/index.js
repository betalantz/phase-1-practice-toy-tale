let addToy = false;
const baseUrl = `http://localhost:3000/toys`

// Defining variables
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
const toyCollection = document.getElementById('toy-collection')
const newToyForm = document.querySelector('.add-toy-form')

// Fetches
const getToys = () => {
  fetch(baseUrl)
  .then(res => res.json())
  .then(renderAllToys)
}

const patchToy = (likes, id) => {
  const updateBody = {
    "likes": likes
  }
  const config = {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updateBody)
  }
  fetch(baseUrl + `/${id}`, config)
  .then(res => res.json())
  .then(console.log)
}

const postToy = toyObj => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(toyObj)
  }
  fetch(baseUrl, config)
  .then(res => res.json())
  .then(renderToyCard) // pessimistic rendering 
}

const deleteToy = id => {

}

// Event listeners
addBtn.addEventListener("click", () => {
  // hide & seek with the form
  addToy = !addToy;
  if (addToy) {
    toyFormContainer.style.display = "block";
  } else {
    toyFormContainer.style.display = "none";
  }
});

newToyForm.addEventListener('submit', handleToySubmit)

// Rendering
const renderAllToys = toysArr => {
  toyCollection.innerHTML = ''
  // iterate over data, pass individuals to renderToys
  toysArr.forEach(renderToyCard)
}

const renderToyCard = toyObj => {
   // Defining Variables
   let div = document.createElement('div')
   let h2 = document.createElement('h2')
   let img = document.createElement('img')
   let p = document.createElement('p')
   let button = document.createElement('button')
   let deleteBtn = document.createElement('button')

   // Defining classes / ids
   div.className = 'card'
   img.className = 'toy-avatar'
   button.className = 'like-btn'
   button.dataset.id = toyObj.id
   deleteBtn.dataset.id = toyObj.id

   // Attribute toyObj data to variables

   h2.innerText = toyObj.name
   img.src = toyObj.image
   p.innerText = toyObj.likes
   button.innerText = 'Like <3'
   deleteBtn.innerText = 'Remove'
   
   // Append above to div element
   div.append(h2, img, p, button, deleteBtn)

   // Append div to index page
   toyCollection.appendChild(div)

   // EventListener
   button.addEventListener('click', (e) => handleAddLike(e, p))
   deleteBtn.addEventListener('click', handleDelete)
}

// Event handler functions
const handleAddLike = (e, p) => {
   // Defining variables
      let toyId = e.target.dataset.id
      p.innerText++  // optimistic rendering
      let likes = p.innerText
      patchToy(likes, toyId)
}

function handleToySubmit(e) {
  e.preventDefault()
  let name = e.target.name.value
  let image = e.target.image.value
  let newToy = {
    'name': name,
    'image': image,
    'likes': 0
  }
  postToy(newToy)
}

const handleDelete = e => {
  const id = e.target.dataset.id
  fetch(baseUrl + `/${id}`, {method: "DELETE"})
  .then(res => res.json())
  .then(() => getToys()) // pessimistic rendering
}

// Intialize
getToys()


