"use strict";

const $cupcakeList = $("#cupcake-list");
const $cupcakeForm = $("#add-cupcake-form");





/** Gets list of cupcakes from API */
async function getCupcakes() {
  const response = await fetch("/api/cupcakes");
  const data = await response.json();
  return data;
}


/** Add all cupcakes to home page */
async function populateCupcakeList() {
  $cupcakeList.empty();
  const cupcakes = await getCupcakes();

  for (const { flavor, size, rating, image_url } of cupcakes["cupcakes"]) {
    const $li = createCupcakeMarkup(flavor, size, rating, image_url);

    $cupcakeList.prepend($li);
  }
}


/** Generate and return markup for a cupcake */
function createCupcakeMarkup(flavor, size, rating, imageUrl) {
  const $li = $(`<li class="list-group-item"><div class="row">
    <div class="col-6">
      <h3>Flavor: ${flavor}</h3>
      <p>Size: ${size}</p>
      <p>Rating: ${rating}</p>
    </div>
    <div class="col-6">
      <img src="${imageUrl}" alt="Cupcake Image" width="100" class="img-thumbnail">
    </div>
    </div></li>`);

  return $li;
}


/** Submit cupcake form data to API and add cupcake to list */
async function handleCupcakeSubmit(evt) {
  evt.preventDefault();

  const flavor = $("#flavor-input").val();
  const size = $("#size-input").val();
  const rating = $("#rating-input").val();
  const imageUrl = $("#image-input").val();

  await fetch("/api/cupcakes", {
    method: "POST",
    body: JSON.stringify({ flavor, size, rating, image_url: imageUrl }),
    headers: {
      'Content-Type': "application/json"
    }
  });

  const $li = createCupcakeMarkup(flavor, size, rating, imageUrl);
  $cupcakeList.prepend($li);
}


$cupcakeForm.on("submit", handleCupcakeSubmit);

//Generate cupcake list on page load
populateCupcakeList();
