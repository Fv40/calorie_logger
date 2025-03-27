const proxy = "https://92c3-98-15-181-20.ngrok-free.app"
const userEndpoint = `${proxy}/user/get-access`
const calorieEndpoint = `${proxy}/calorie/add`
let auth;
let currentUser;

getData()

async function getData() {
    let serverResponse = await fetch(`${userEndpoint}`, { 'method': 'GET', headers: { "ngrok-skip-browser-warning": null, "authorization": auth } })

    currentUser = await serverResponse.headers.get('authorization')
    console.log(`Current user: ${currentUser}`)
    const serverText = await serverResponse.text()

    if (await serverResponse.status == 200) {
        authDiv.style.display = 'none';

        foodDiv.style.display = 'block';

        let userTexts = serverText.split('%--BREAK--%')
        document.getElementById('column1').innerText = userTexts[0];
        document.getElementById('column2').innerText = userTexts[1];
    }
}

async function addItem(foodName) {
    console.log("adding item: " + foodName)
    await fetch(`${calorieEndpoint}`, {
        headers: {
            "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            foodName: foodName,
            currentDate: Date.now(),
            currentUser: currentUser
        }),
        credentials: "include"
    })

    getData()
}

const authInput = document.getElementById('authInput');
const updateAuthButton = document.getElementById('updateAuthButton');

updateAuthButton.addEventListener('click', () => {
    const newAuth = authInput.value;
    if (newAuth) {
        auth = newAuth

        window.getData();
    }
});

const foodInput = document.getElementById('foodInput');
const foodInputButton = document.getElementById('foodInputButton');

foodInputButton.addEventListener('click', () => {
    const newEntry = foodInput.value;
    if (newEntry) {
        window.addItem(newEntry);

        window.getData();
    } else {
        alert('Food entry is empty');
    }
});