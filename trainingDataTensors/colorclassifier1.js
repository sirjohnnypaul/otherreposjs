
let data;
let labelList = [
  'blue-ish',
  'green-ish',
  'pink-ish',
  'grey-ish',
  'red-ish',
  'purple-ish',
  'brown-ish',
  'orange-ish',
  'yellow-ish',
]

let xs, ys;
let model;
let labelP;
let lossP;


let rSlider, gSlider, bSlider;

function preload() {
  data = loadJSON('colorData.json');
}


function setup () {
  //console.log(data.entries.length);

  let colors = [];
  let labels = [];

  labelP = createP('');
  lossP = createP('');
  rSlider = createSlider(0, 255, 255);
  gSlider = createSlider(0, 255, 255);
  bSlider = createSlider(0, 255, 0);

  for (let record of data.entries) {
    //dividing will normalize the data in some specific range
    let col = [record.r/255, record.g/255, record.b/255];
    colors.push(col);
    labels.push(labelList.indexOf(record.label));
  }

  //console.log(colors);

  xs = tf.tensor2d(colors);
  //console.log(xs.shape);

  let labelsTensor = tf.tensor1d(labels, 'int32');
 // labelsTensor.print();

  ys = tf.oneHot(labelsTensor, 9);
  labelsTensor.dispose();
  //console.log(xs.shape);
  //console.log(ys.shape);
  //xs.print();
  //ys.print();
  //console.log(labels);


  //Architecture for model
  model = tf.sequential();

  let hidden = tf.layers.dense({
    units: 16,
    activation: 'sigmoid',
    inputDim: 3  //or inputShape: [3]
  });
  

  let output = tf.layers.dense({
    units: 9,
    activation: 'softmax'
  });

  model.add(hidden);
  model.add(output);

  //Create optimizer 'categoricalCrossEntropy instead of meanSquaredError'
  const lr = 0.2;
  const optimizer = tf.train.sgd(lr);

  //compilation of model
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy'
  });

  //train model
  train().then(results => {
    console.log(results.history.loss)
  });

}

async function train() {
  //fit the model
  const options = {
    epochs: 4, //number of times to iterate over traning data
    validationSplit: 0.2, //20% of training data will be used as validation data
    shuffle: true, //it will mix the data for every single epoch so the training would be better
    callbacks: {
      onTrainBegin: () => console.log('Training started'),
      onTrainEnd: () => console.log('Training finished'),
      onBatchEnd: async(num, logs) => {
        await tf.nextFrame();
      },
      onEpochEnd: (num, logs) => {
        console.log('Epoch: '+num);
        lossP.html('Loss: '+logs.loss);
        console.log(logs);
      }
    }
  }
  return await model.fit(xs,ys,options); //await will allow to finish the fit first then trigger the then statement
}

function draw() {
  let r = rSlider.value();
  let g = gSlider.value();
  let b = bSlider.value();
  background(r, g, b);
  // stroke(255);
  // strokeWeight(4);
  // line(frameCount % width, 0, frameCount % width, height);
tf.tidy(() => {
  const xs = tf.tensor2d([
    [r / 255, g / 255, b / 255]
  ]);

  let results = model.predict(xs);
  let index = results.argMax(1).dataSync()[0]; //will give the index of our nine optionsof colour prediction

  //console.log(index);
  let label = labelList[index];
  labelP.html(label);
  // index.print();
});

}


/////////////////
////////////////
//OUR DATA

//Xs           /// Ys
///INPUTS     /// TARGET OUTPUTS
///R,G,B      /// LABEL
//2D tensor


