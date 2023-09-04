"use strict";

const $cupcakeList = $("#cupcake-list");
const $cupcakeForm = $("#add-cupcake-form");

async function getCupcakes() {
  const response = await fetch("/api/cupcakes");
  const data = await response.json();
  return data;
}


async function addCupcakesToList() {
  const cupcakes = await getCupcakes();

  for (const { flavor, size, rating, image_url } of cupcakes["cupcakes"]) {
    const $li = $(`<li><div>
    <h3>${flavor}</h3>
    <p>${size}</p>
    <p>${rating}</p>
    <img src="${image_url} alt="Cupcake Image">
    </div></li>`);

    $cupcakeList.append($li);
  }
}

addCupcakesToList();


async function handleCupcakeSubmit(evt) {
  evt.preventDefault();

  const flavor = $("#flavor-input").val();
  const size = $("#flavor-input").val();
  const rating = $("#flavor-input").val();
  const imageUrl = $("#flavor-input").val();

  await fetch("/api/cupcakes", {
    method: "POST",
    body: JSON.stringify({ flavor, size, rating, image_url: imageUrl }),
    headers: {
      'Content-Type': "application/json"
    }
  });


  addCupcakesToList();
}


$cupcakeForm.on("submit", handleCupcakeSubmit);
