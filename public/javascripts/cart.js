let item_count = 0;
let cart = [];

function addToCart(item_id) {
  item_count++;
  document.getElementById("cart-number-count").innerHTML = item_count;
  const name = "btn" + item_id;
  document.getElementById(name).disabled = true;
  document.getElementById(name).innerHTML = "Added";
  cart.push(item_id);
}

function openMyCart() {
  let url = "http://localhost:3000/cart";
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cart: cart,
      item_count: item_count,
    }),
  });

  window.location.href = "http://localhost:3000/cart";
}
