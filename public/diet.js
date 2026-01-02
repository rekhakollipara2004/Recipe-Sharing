function calculateBMR(weight, height, age, gender) {
  // Harris-Benedict Formula
  return 10 * weight + 6.25 * height - 5 * age + (gender === "male" ? 5 : -161);
}

function calculateTDEE(bmr, activity) {
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
  };
  return bmr * activityFactors[activity];
}

// Sample food database with calories
const foodDatabase = {
  breakfast: [
    { name: "Vegetable Upma with coconut chutney", calories: 280 },
    { name: "Masala oats with curd", calories: 300 },
    { name: "Moong dal chilla with mint chutney", calories: 250 },
    { name: "Idli with sambar", calories: 320 },
    { name: "Poha with peanuts and lemon", calories: 270 },
  ],
  lunch: [
    { name: "Brown rice chicken biryani with cucumber raita", calories: 450 },
    { name: "Rajma with brown rice and salad", calories: 400 },
    { name: "Grilled paneer wrap with mint yogurt", calories: 420 },
    {
      name: "Mixed vegetable salad with sprouted moong and lemon dressing",
      calories: 350,
    },
    { name: "Stuffed paratha (spinach/paneer) with curd", calories: 400 },
  ],
  dinner: [
    { name: "Grilled tandoori chicken with sautéed vegetables", calories: 380 },
    { name: "Vegetable khichdi with papad and pickle", calories: 350 },
    { name: "Methi thepla with curd", calories: 300 },
    { name: "Paneer tikka with grilled veggies", calories: 340 },
    { name: "Veg hakka noodles with chili garlic tofu", calories: 360 },
  ],
};

function generateDiet(event) {
  event.preventDefault();

  const age = parseInt(document.getElementById("age").value);
  const weight = parseInt(document.getElementById("weight").value);
  const height = parseInt(document.getElementById("height").value);
  const activity = document.getElementById("activity").value;
  const goal = document.getElementById("goal").value;

  // Calculate daily calorie needs
  const bmr = calculateBMR(weight, height, age, "female");
  let tdee = calculateTDEE(bmr, activity);

  // Adjust calories based on goal
  switch (goal) {
    case "lose":
      tdee -= 500; // Create caloric deficit
      break;
    case "gain":
      tdee += 500; // Create caloric surplus
      break;
  }

  // Generate 7-day meal plan
  const daysGrid = document.getElementById("daysGrid");
  daysGrid.innerHTML = "";

  for (let day = 1; day <= 7; day++) {
    const dayCard = document.createElement("div");
    dayCard.className = "day-card";

    const meals = generateDayMeals(tdee);

    dayCard.innerHTML = `
                    <h2>DAY ${day}</h2>
                    <div class="meal">
                        <div class="meal-type">Breakfast:</div>
                        <div class="meal-items">${meals.breakfast.name}</div>
                    </div>
                    <div class="meal">
                        <div class="meal-type">Lunch:</div>
                        <div class="meal-items">${meals.lunch.name}</div>
                    </div>
                    <div class="meal">
                        <div class="meal-type">Dinner:</div>
                        <div class="meal-items">${meals.dinner.name}</div>
                    </div>
                    <div class="calories-info">
                        Total calories: ${meals.totalCalories} kcal
                    </div>
                `;

    daysGrid.appendChild(dayCard);
  }

  // Show the diet plan
  document.getElementById("dietPlan").classList.add("active");
}

function generateDayMeals(targetCalories) {
  // Distribute calories: 30% breakfast, 35% lunch, 35% dinner
  const breakfastCal = targetCalories * 0.3;
  const lunchCal = targetCalories * 0.35;
  const dinnerCal = targetCalories * 0.35;

  // Select meals that best match the calorie targets
  const breakfast =
    foodDatabase.breakfast[
      Math.floor(Math.random() * foodDatabase.breakfast.length)
    ];
  const lunch =
    foodDatabase.lunch[Math.floor(Math.random() * foodDatabase.lunch.length)];
  const dinner =
    foodDatabase.dinner[Math.floor(Math.random() * foodDatabase.dinner.length)];

  return {
    breakfast,
    lunch,
    dinner,
    totalCalories: breakfast.calories + lunch.calories + dinner.calories,
  };
}
//dropdown hovering
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".nav-icon").forEach((icon) => {
    const dropdown = icon.querySelector(".dropdown");

    icon.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent event from bubbling up
      closeAllDropdowns();
      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    });
  });

  document.addEventListener("click", function () {
    closeAllDropdowns();
  });

  function closeAllDropdowns() {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.style.display = "none";
    });
  }
});
