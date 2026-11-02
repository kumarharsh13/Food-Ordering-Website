let cart = [];

function addToCart(item_id) {
  const existing = cart.find((c) => c.itemId === item_id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ itemId: item_id, qty: 1 });
  }
  const total = cart.reduce((sum, c) => sum + c.qty, 0);
  document.getElementById("cart-number-count").innerHTML = total;
  const name = "btn" + item_id;
  document.getElementById(name).disabled = true;
  document.getElementById(name).innerHTML = "Added";
}

function openMyCart() {
  const url = "/cart";
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart }),
  }).then(() => {
    window.location.href = "/cart";
  });
}
