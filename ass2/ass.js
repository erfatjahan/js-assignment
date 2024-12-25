const apiBase = "https://www.themealdb.com/api/json/v1/1";
let cart = [];
const loadMeals = async (query = "") => {
  const res = await fetch(`${apiBase}/search.php?s=${query}`);
  const data = await res.json();
  if (data.meals) {
    displayMeals(data.meals.slice(0, 10)); 
  } else {
    document.getElementById("meal-container").innerHTML = `<h3>No meals found</h3>`;
  }
};
const displayMeals = (meals) => {
  const mealContainer = document.getElementById("meal-container");
  mealContainer.innerHTML = "";
  meals.forEach((meal) => {
    const price = (Math.random()*50 + 5).toFixed(2);
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h4>${meal.strMeal}</h4>
      <p>Category: ${meal.strCategory}</p>
      <p>Area: ${meal.strArea}</p>
      <p>Tags: ${meal.strTags || "None"}</p>
      <p>Ingredients: 6+</p>
      <p>Price: $${price}</p>
      <button id="add-btn-${meal.idMeal}" onclick="addToCart('${meal.idMeal}', '${meal.strMeal}', '${price}')">Add to Cart</button>
      <button onclick="showDetails('${meal.idMeal}')">Details</button>
    `;
    mealContainer.appendChild(div);
  });
};
const addToCart = (id, name, price) => {
  if (cart.length >= 11) {
    alert("You can't add more than 11 meals to the cart.");
    return;
  }
  if (!cart.some((meal) => meal.id === id)) {
    cart.push({ id, name, price });
    updateCart();
    const addButton = document.getElementById(`add-btn-${id}`);
    addButton.textContent = "Already Added";
    addButton.disabled = true;
  } else {
    alert("Meal already added to the cart.");
  }
};
const updateCart = () => {
  const cartList = document.getElementById("cart-list");
  const cartCount = document.getElementById("cart-count");

  cartList.innerHTML = "";
  cart.forEach((meal) => {
    const li = document.createElement("li");
    li.innerHTML = `${meal.name} - $${meal.price}`;
    cartList.appendChild(li);
  });
cartCount.textContent = cart.length;
};
const showDetails = async (id) => {
  const res = await fetch(`${apiBase}/lookup.php?i=${id}`);
  const data = await res.json();
  if (data.meals) {
    const meal = data.meals[0];
    const price = (Math.random() * 50 + 5).toFixed(2); 
    const instructions = meal.strInstructions.split(" ").slice(0, 10).join(" ") + "..."; // Limit to 10 words

    const modalDetails = document.getElementById("modal-details");
    modalDetails.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width: 150px; height: auto;">
      <h2>${meal.strMeal}</h2>
      <p>Category: ${meal.strCategory}</p>
      <p>Area: ${meal.strArea}</p>
      <p>Instructions: ${instructions}</p>
      <p>Price: $${price}</p>
    `;

    showModal();
  } else {
    alert("Meal details not found!");
  }
};
const showModal = () => {
  const modal = document.getElementById("meal-modal");
  modal.style.display = "block";

  const closeBtn = document.querySelector(".close");
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
};
document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search-bar").value.trim();
  loadMeals(query);
});
window.onload = () => {
  loadMeals();
};
