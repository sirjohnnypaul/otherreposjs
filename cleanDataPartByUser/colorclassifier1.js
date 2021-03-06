
let colorByLabel = {
    'blue-ish': [],
    'green-ish': [],
    'pink-ish': [],
    'grey-ish': [],
    'red-ish': [],
    'purple-ish': [],
    'brown-ish': [],
    'orange-ish': [],
    'yellow-ish': [],
  }
  
  //definition for type to display in visualising by color function
  let label = 'blue-ish';
  
  
  function setup() {
    noCanvas();
  
  
    // Initialize Firebase

    //this one is mine, but it's generated by one user so i'm gonna use conding train fireabase
    var config = {
        apiKey: "AIzaSyDPekCKX4ee6h9NVR2lEITGAM0XIHn-c7c",
        authDomain: "color-classification.firebaseapp.com",
        databaseURL: "https://color-classification.firebaseio.com",
        projectId: "color-classification",
        storageBucket: "",
        messagingSenderId: "590040209608"
      };
    firebase.initializeApp(config);
    database = firebase.database();
    let ref = database.ref('colors');
    ref.once('value', gotData);

  }
  
  function gotData(results) {
    let data = results.val();

    // Processing data
    let keys = Object.keys(data);
    console.log(keys.length);
  
    let userData = [];
  
    for (let key of keys) {
      let record = data[key];
      let col = color(record.r, record.g, record.b);
      colorByLabel[record.label].push(record);
  
    //possible noisy users
    //BeriXSWj1LbzWMOoHYbYgfw4SGA3
    //YGdqOTDDmrbGm80gM5UHicxMBgS2
    //HUXmyv1dSSUnIvYk976MPWUSaTG2

      if(record.uid == 'YGdqOTDDmrbGm80gM5UHicxMBgS2') {
        userData.push(record);
      }
    }
  
    
    // Visualizing Data by User
    userData.sort((a,b) => {a.label > b.label
      if (a.label > b.label) {
        return 1;
      } else {
        return -1;
      }
    });
  
    let title = createDiv(`Data Entered by ${userData[0].uid}`);
    title.style('padding-top','50px');
    for (let entry of userData) {
      let div = createDiv(entry.label);
      let colorBox = createDiv('');
      colorBox.parent(div);
      colorBox.size(10,10);
      colorBox.style('background-color',`rgb(${entry.r},${entry.g},${entry.b})`)
    }

  }


  
  //what happens when we click on separate rectangle of color, 
  //we can access uid and detect who is making noise
  function mousePressed() {
    let i = floor(mouseX / 10);
    let j = floor(mouseY / 10);
    let index = i + j * (width / 10);
    let data = colorByLabel[label];
    console.log(data[index])
}