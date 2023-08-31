const categoriesContainer = document.getElementById("categoriesContainer");
const cardsContainer = document.getElementById("cardsContainer");
const noVideoContainer = document.getElementById("noVideoContainer");
const sort = document.getElementById("sort");

let arrayOfCards = [];

const loadCategories = async () => {
  const responce = await fetch(
    "https://openapi.programming-hero.com/api/videos/categories"
  );
  const data = await responce.json();
  displayCategories(data.data);
};
const displayCategories = (array) => {
  array.forEach((element) => {
    let div = document.createElement("div");
    div.innerHTML = `
    <div onclick="loadCards('${element.category_id}',this)" class="text-[#5D5D5D] bg-[#DEDEDE] rounded-md py-1 px-5 cursor-pointer">
    ${element.category}
    </div>
    `;
    categoriesContainer.appendChild(div);
  });
  categoriesContainer.children[0].children[0].classList.add("active");
};
const loadCards = async (id, ele) => {
  if (ele) {
    let categoriesArray = [...categoriesContainer.children];
    categoriesArray.forEach((e) => {
      e.children[0].classList.remove("active");
    });
    ele.classList.add("active");
  }
  let responce = await fetch(
    `https://openapi.programming-hero.com/api/videos/category/${id}`
  );
  let data = await responce.json();
  arrayOfCards = [...data.data];
  displayCards(arrayOfCards);
  sort.addEventListener("click", () => {
    let arrayOfViews = arrayOfCards.map((e) => parseInt(e.others.views));
    arrayOfViews.sort(function (a, b) {
      return b - a;
    });
    let newArrayOfCards = [];
    arrayOfViews.forEach((e) => {
      let target = arrayOfCards.find((ele) => parseInt(ele.others.views) === e);
      newArrayOfCards.push(target);
      arrayOfCards.splice(arrayOfCards.indexOf(target), 1);
      displayCards(newArrayOfCards);
    });
  });
};
const displayCards = (array) => {
  if (array.length !== 0) {
    cardsContainer.innerHTML = "";
    noVideoContainer.innerHTML = "";
    array.forEach((element) => {
      let second = element.others.posted_date;
      let hour, min;
      if (second) {
        hour = parseInt(parseInt(second) / 60 / 60);
        min = parseInt(parseInt(second) / 60 - hour * 60);
      }
      let div = document.createElement("div");
      div.innerHTML = `
     <div class="">
        <div class="relative">
        <p class="text-white bg-[#171717] py-1 px-2 text-sm rounded-lg absolute bottom-2 right-2 ${
          element.others.posted_date ? "" : "hidden"
        }">${
        element.others.posted_date ? hour + "hrs" + " " + min + "min ago" : ""
      }</p>
        <img class="rounded-lg h-[300px] md:h-[200px] w-full" src="${
          element.thumbnail
        }" alt="" />
        </div>
        <div class="flex gap-3 mt-5">
          <img class="w-10 h-10 rounded-full" src="${
            element.authors[0].profile_picture
          }" alt="" />
          <div class="">
            <p class="text-[#171717] text-base font-bold">
              ${element.title}
            </p>
            <div class="flex gap-2 my-2">
              <p class="text-[#676767] text-sm">${
                element.authors[0].profile_name
              }</p>
              <img src=${
                element.authors[0].verified ? "./images/blue_tick.png" : "./"
              } alt="" />
            </div>
            <p class="text-[#676767] text-sm"><span>${
              element.others.views
            }</span> Views</p>
          </div>
        </div>
      </div>
  `;
      cardsContainer.appendChild(div);
    });
  } else {
    cardsContainer.innerHTML = "";
    noVideoContainer.innerHTML = "";
    let div = document.createElement("div");
    div.innerHTML = `
    <div class="flex flex-col items-center justify-center gap-3">
      <img src="./images/no_video.png" alt="" />
      <p class="text-[#171717] text-center text-3xl font-bold">
        Oops!! Sorry, There is no content here
      </p>
    </div>
    `;
    noVideoContainer.appendChild(div);
  }
};
loadCategories();
loadCards("1000");
