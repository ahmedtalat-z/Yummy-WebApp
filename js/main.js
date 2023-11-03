// variables
let meal;
let meals = [],
    categories = [],
    areas = [],
    ingredients = [];
let widthInner;
// regex
let nameRegex = /^[a-zA-Z]{2,}/,
  emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
  phoneRegex = /^01[0-2]\d{8,8}$/,
  ageRegex = /^(1[89]|[2-9]\d)$/,
  passRegex = /^([a-zA-Z0-9@*#]{8,15})$/;

$(document).ready(function () {

    widthInner = $("#innerContent").innerWidth();
    $("#sideBar").css('left', -widthInner);
    $("#slidingIcon").click(function () {
        if ($("#sideBar").css('left') == '0px') {
            $("#sideBar").animate({ left: -widthInner }, 500);
            $('#slidingIcon').removeClass('fa-xmark');
            $('#slidingIcon').addClass('fa-bars');
            
        } else {
            $("#sideBar").animate({ left: 0 }, 500);
            $('#slidingIcon').removeClass('fa-bars');
            $("#slidingIcon").addClass("fa-xmark");
        }

    })
    
    $("#sideBar").addClass("d-none");
    getMeal()

    $("#search").click(function () {
        loadApear()
        
        $(".box ").html(`
        <div class="row mb-5 " >
        <div class="col-md-7 m-3" style=" z-index : 999999999">
            <input id="searchName" placeholder="Enter Name"  type="text" onInput="search(value)" class="form-control">
        </div>
        <div class="col-md-3 m-3" style=" z-index : 999999999">
            <input id="searchChar" placeholder="Enter First Character" maxlength="1" onInput="searchChar(value)"  type="text" class="form-control">
        </div>
        </div>
        <div id="foodBox" class="row g-4"></div>
        `);
        slideNav(); 
        loadRemove();
      })
    
    
});

function hover() {
    $(".foodIcon").hover(
        function () {
            $(this).children(".layr").css("display", "flex");
            $(this).children(".layr").animate({top:'0px'},500);
        },
        function () {
          $(this).children(".layr").animate({top:'100%'},500);
      }
    );
}

function slideNav() {
    $("#sideBar").animate({ left: -widthInner }, 500);
    $("#slidingIcon").removeClass("fa-xmark");
    $("#slidingIcon").addClass("fa-bars");
}

function loadApear() {
    $("#loading").fadeIn(100);
    $("body").css('overflow', 'hidden ')
    $("#sideBar").addClass('d-none')
    $("#sideBar").removeClass('d-block')
}
function loadRemove() {
    $("#loading").fadeOut(1000);
    $("body").css('overflow','scroll')
    $("#sideBar").addClass('d-block');
    $("#sideBar").removeClass('d-none')
}

async function getMeal() {
    for (let i = 0; i < 20; i++) {
        let mealApi = await fetch("https://themealdb.com/api/json/v1/1/random.php");
        meal = await mealApi.json();
        meals.push(meal.meals[0]);
    }
    displayMeals(meals)
}





function displayMeals(arr) {
    loadApear()
    let cont='';
    for (let i = 0; i < arr.length; i++){
        let img = arr[i].strMealThumb;
        cont += `    
        <div class="col-md-3 ">
            <div class='foodIcon'><img class='rounded w-100 ' src="${img}" alt="">
            <div class="layr w-100 h-100 rounded  align-items-center justify-content-center" onclick="diplayMeal(${i})">
            <h3>${arr[i].strMeal}</h3>
            </div>
            </div>
            
        </div>`;
        
    }
    
    
    $(".box #foodBox").html(cont);
    hover()
    loadRemove()
}

function diplayMeal(i) {
    let ingredients = ``;
    let j =1
    while (meals[i][`strIngredient${j}`] != "") {
        ingredients += `<span class='d-inline-block m-2 p-3 rounded bg-warning'>${
          meals[i][`strMeasure${j}`]
        }  ${meals[i][`strIngredient${j}`]}</span>`;
        j++;
    }
    let cont1 = `
    <div class="row">
    <div class="col-md-4">
        <div class='mainIcon mb-5'><img class='rounded w-100 ' src="${meals[i].strMealThumb}" alt=""></div>
        <h3 class="text-white">${meals[i].strMeal}</h3>
    </div>
    <div class="col-md-8 text-white ">
        <h3 class="mb-3">Instructions</h3>
        <p>${meals[i].strInstructions}</p>
        <h3 class="mb-3">Area : ${meals[i].strArea}</h3>
        <h3 class="mb-4">Category : ${meals[i].strCategory}</h3>
        <h3 class="mb-4">recipe : </h3>
        <div>${ingredients}</div>
        <h3 class="mb-3">Tags : </h3>
        <div>
        <a href="${meals[i].strSource}" class="btn btn-outline-danger px-3 py-2 me-2 ">Source</a>
        <a href="${meals[i].strYoutube}" class="btn btn-outline-info px-3 py-2 ">Youtube</a>
        </div>
    </div>
    </div>
    `;
    $(".box ").html(cont1);
    loadRemove();
}


async function search(input) {
    loadApear()
    let M = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`
    );
    let r = await M.json();
    let searchedMeals = r.meals;
    meals = []
    $("#foodBox").empty();
    for (let i = 0; i < searchedMeals.length; i++){
        meals.push(searchedMeals[i])
    }
    displayMeals(meals)
    $("#searchName").blur(function () {
      $("#searchName").val("");
    });
    loadRemove()
}
async function searchChar(input) {
    loadApear()
    if(input==''){input='a'}
    let M = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${input}`
    );
    let r = await M.json();
    let searchedMeals = r.meals;
    meals = []
    $("#foodBox").empty();
    for (let i = 0; i < searchedMeals.length; i++){
        meals.push(searchedMeals[i])
    }
    displayMeals(meals)
    $("#searchChar").blur( function () {
        $("#searchChar").val("");
    }); 
    loadRemove()
}

$("#category").click(function () { 
    getCategory();
    slideNav()
})

async function getCategory() {
    loadApear()
    if (categories.length == 0) {
        let r = await fetch(
          "https://www.themealdb.com/api/json/v1/1/categories.php"
        );
        let rr = await r.json();
        for (let i = 0; i < rr.categories.length; i++){
            categories.push(rr.categories[i])
        };
    }
    displayCategories();
}


function displayCategories() {
    $(".box ").html('<div id="foodBox" class="row g-4"></div>');
    let cont = "";
    for (let i = 0; i < categories.length; i++) {
      let img = categories[i].strCategoryThumb;
      cont += `    
        <div class="col-md-4 ">
            <div class='foodIcon'><img class='rounded w-100 h-100' src="${img}" alt="">
            <div class="layr p-2 w-100 h-100 rounded flex-column align-items-center justify-content-start" onclick="diplayCategoryMeals(${i})">
            <h3 class="my-2">${categories[i].strCategory}</h3>
            <p class="fs-6">${categories[i].strCategoryDescription}</p>
            </div>
            </div>
            
        </div>`;
    }

    $(".box #foodBox").html(cont);
    hover();
    loadRemove();
}

async function diplayCategoryMeals(i) {
    loadApear()
    let s = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categories[i].strCategory}`)
    let r = await s.json()
    let catArr = []
    for (let i = 0; i < r.meals.length; i++){
        let s2 = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${r.meals[i].idMeal}`
        );
        let r2 = await s2.json();
        catArr.push(r2.meals[0])
    }
    meals = catArr;
    displayMeals(meals)
    loadRemove()
}


$("#area").click(function () {
  getArea();
  slideNav();
});

async function getArea() {
    loadApear()
    if (areas.length == 0) {
        let r = await fetch(
          "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
        );
        let rr = await r.json();
        for (let i = 0; i < rr.meals.length; i++){
            areas.push(rr.meals[i])
        };
    }
    displayAreas();
}


function displayAreas() {
  $(".box ").html('<div id="foodBox" class="row g-4"></div>');
  let cont = "";
    for (let i = 0; i < areas.length; i++) {
        cont += `
        <div class="col-md-4">
            <div class='foodIcon text-center m-4' onclick="diplayAreaMeals(${i})" >
            <div><i class=" fs-1 fa-solid fa-map-location-dot" style="color: #ffffff;"></i></div>
            <h3 class="my-2 text-white text-center">${areas[i].strArea}</h3>
            </div>
        </div>
  `;
    }

  $(".box #foodBox").html(cont);
  loadRemove();
}

async function diplayAreaMeals(i) {
  loadApear();
  let s = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areas[i].strArea}`
  );
  let r = await s.json();
  let areaArr = [];
  for (let i = 0; i < r.meals.length; i++) {
    let s2 = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${r.meals[i].idMeal}`
    );
    let r2 = await s2.json();
    areaArr.push(r2.meals[0]);
  }
  meals = areaArr;
  displayMeals(meals);
  loadRemove();
}



$("#ingredients").click(function () {
  getIngredients();
  slideNav();
});

async function getIngredients() {
  loadApear();
  if (ingredients.length == 0) {
    let r = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    );
    let rr = await r.json();
    console.log(rr);
    for (let i = 0; i < 40 ; i++) {
      ingredients.push(rr.meals[i]);
    }
    console.log(ingredients);
  }
  displayIngredients();
}

function displayIngredients() {
  $(".box ").html('<div id="foodBox" class="row g-4"></div>');
    let cont = "";
    let desc = ''
    for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].strDescription != null) {
          desc = ingredients[i].strDescription;
      }else desc = "";
        cont += `
        <div class="col-md-4">
            <div class='foodIcon text-center m-4' onclick="diplayIngredientsMeals(${i})" >
            <div><i class="fs-1 fa-solid fa-plate-wheat" style="color: #ffffff;"></i></div>
            <h3 class="display-3 my-2 text-white text-center">${ingredients[i].strIngredient}</h3>
           
            <p class=" text-white ">${desc}</p>
            </div>
        </div>
  `;
  }

  $(".box #foodBox").html(cont);
  loadRemove();
}

async function diplayIngredientsMeals(i) {
  loadApear();
  let s = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients[i].strIngredient}`
  );
    let r = await s.json();

    console.log(ingredients[i].strIngredient);
    console.log(r);
  let ingredientsArr = [];
  for (let i = 0; i < r.meals.length; i++) {
    let s2 = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${r.meals[i].idMeal}`
    );
    let r2 = await s2.json();
    ingredientsArr.push(r2.meals[0]);
  }
  meals = ingredientsArr;
  displayMeals(meals);
  loadRemove();
}

$("#contact").click(function () {
  loadApear();
  displayForm();
    slideNav();
    
    $("#name").on("keyup", function () {
      validate("#name", nameRegex);
      submitEnable()
    });
    $("#email").on("keyup", function () {
      validate("#email", emailRegex);
      submitEnable()
    });
    $("#phone").on("keyup", function () {
      validate("#phone", phoneRegex);
      submitEnable()
    });
    $("#age").on("keyup", function () {
      validate("#age", ageRegex);
      submitEnable()
    });
    $("#pass").on("keyup", function () {
      validate("#pass", passRegex);
      submitEnable()
    });
    $("#repass").on("keyup", function () {
        if ($("#repass").val() == $("#pass").val()) {
            $("#repass").addClass("vald");
            $("#repass").siblings().addClass('d-none');
            submitEnable();
        } else {
            $("#repass").removeClass("vald");
            $("#repass").siblings().removeClass("d-none");
      }
    });

    function submitEnable() {
        if (
            validate("#name", nameRegex) &&
            validate("#email", emailRegex) &&
            validate("#phone", phoneRegex) &&
            validate("#age", ageRegex) &&
            validate("#pass", passRegex) &&
            $("#repass").hasClass("vald")
        ) {
            $("#sub").removeAttr("disabled");
        console.log('done');}
    }
});

function displayForm() {
    let cont = `
    <div class='w-100 my-5'><div class="rounded-circle formImg m-auto" style="width:300px;height:300px;"></div></div>
    <div class="row mb-5 " >
        <div class="col-md-3 m-3" >
            <input id="name" placeholder="Enter Name"  type="text" onInput="" class="form-control">
            <p class='text-danger d-none'>*Enter at least two characters</p>
        </div>
        <div class="col-md-7 m-3" >
            <input id="email" placeholder="Enter Email"  onInput=""  type="text" class="form-control">
            <p class='text-danger d-none'>*Enter valid email, eg:somthing@someserver.com</p>
        </div>
    </div>
    <div class="row mb-5 " >
        <div class="col-md-7 m-3" >
            <input id="phone" placeholder="Enter phone"  type="text" onInput="" class="form-control">
            <p class='text-danger d-none'>*Enter valid phone eg: 01*********</p>
        </div>
        <div class="col-md-3 m-3" >
            <input id="age" placeholder="Enter Age"  onInput=""  type="text" class="form-control">
            <p class='text-danger d-none'>*Enetr valid age from 18 to 99</p>
        </div>
    </div>
    <div class="row mb-5 " >
        <div class="col-md-5 m-3" >
            <input id="pass" placeholder="Enter password"  type="password" onInput="" class="form-control">
            <p class='text-danger d-none'>* Password must consists of at least 8 characters and not more than 15 characters</p>
        </div>
        <div class="col-md-5 m-3" >
            <input id="repass" placeholder="renter password"  onInput=""  type="password" class="form-control">
            <p id="pass" class='text-danger d-none'>*Not the same password</p>
        </div>
    </div>
    <div class="row mb-5 " >
        <div class="col-md-12 m-3" >
            <div class="m-auto" style="width:75px;height:40px"><input id="sub" type="submit" value="submit" class="btn btn-outline-info "  disabled></div>
        </div>
       
    </div>
        
    `;
    $(".box ").html(cont);
    loadRemove();
}

function validate(id, regex) {
    let input = $(id).val()
    if (regex.test(input)) {
        $(id).siblings().addClass("d-none");
        return true;
    }
    else {
        $(id).siblings().removeClass("d-none");
        return false
    }
}

