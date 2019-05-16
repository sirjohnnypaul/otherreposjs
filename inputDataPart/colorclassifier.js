let r,g,b;
let database;

function pickColor() {
    r = floor(random(256));
    g = floor(random(256));
    b = floor(random(256));
    background(r,g,b);
}


function setup() {

    //Initiaize Firebase
    var config = {
        apiKey: "AIzaSyCnU7e2eAm0Fg8DffIP3c66T5W7ADkLOMY",
        authDomain: "color-classification-57b5e.firebaseapp.com",
        databaseURL: "https://color-classification-57b5e.firebaseio.com",
        projectId: "color-classification-57b5e",
        storageBucket: "",
        messagingSenderId: "30629591278"
    };
    firebase.initializeApp(config);
    database = firebase.database();


    //Stuff to generate data
    createCanvas(600,600);
    pickColor();

  let buttons= [];
  buttons.push(createButton('red-ish'));
  buttons.push(createButton('green-ish'));
  buttons.push(createButton('blue-ish'));
  buttons.push(createButton('orange-ish'));
  buttons.push(createButton('yellow-ish'));
  buttons.push(createButton('pink-ish'));
  buttons.push(createButton('purple-ish'));
  buttons.push(createButton('brown-ish'));
  buttons.push(createButton('grey-ish'));

  for (let i = 0; i < buttons.length; i++) {
      buttons[i].mousePressed(sendData)
  }

  function sendData() {

    let colorDatabase = database.ref('colors');

    var data = {
        r: r,
        g: g,
        b: b,
        label: this.html()
    }

    console.log("Saving to Firebase started...");
    console.log(data);

    let color = colorDatabase.push(data, finished);
    console.log("Generated key: "+color.key);

    function finished(err) {
        if (err) {
            console.error("something went wrong");
            console.error(err);
        } else {
            console.log("Success");
            pickColor();
        }
    }
  }
}

