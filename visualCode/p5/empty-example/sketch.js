var audioIn1;
var audioIn2; //entrada linea
var fft1; //array de frecuencias
var fft2;
var r=0, g=0, b =0; //color
var ctx; //contexto canvas
var count = 0; //contador
var relWH; //relacion ancho / alto
var maxW, maxH; //ancho alto
var note;

if(navigator.requestMIDIAccess){
  navigator.requestMIDIAccess().then(success, failure);
}

function failure(){
  console.log('ERROR MIDI');
}

function success(midiAccess){
  midiAccess.addEventListener('onstatechange', updateDevides);
  const inputs = midiAccess.inputs;
  inputs.forEach((input) => {
    input.onmidimessage = handleInput;
  })
}

function handleInput(event){
  console.log(event.data[0].toString(2), event.data[1], event.data[2]);
  note = event.data[1];
}

function updateDevides(event){
  console.log(event);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


function WHrelation(){
  if(window.innerHeight>window.innerWidth){
    relWH = window.innerHeight/window.innerWidth;
  }
  else {relWH = window.innerWidth/window.innerHeight;}
}


function newColor(r, g, b){
  ctx.FillStyle = 'rgb('
  + r + ',' + g + ',' + b
  ')'; 
}


function setup(){
  maxW = window.innerWidth;
  maxH = window.innerHeight;
  createCanvas(maxW, maxH, WEBGL);
  ctx = canvas.getContext("webgl");



  audioIn1 = new p5.AudioIn();

  audioIn1.getSources().then((values) => {
    console.log(values);
    audioIn1.setSource([2]);
    audioIn1.start();}); //audiobox
    
    audioIn2 = new p5.AudioIn();
    audioIn2.getSources().then((values) => {
      console.log(values);
      audioIn2.setSource([0]);
      audioIn2.start();
    }); //scarlet


  fft1 = new p5.FFT();
  fft1.setInput(audioIn1);

  fft2 = new p5.FFT();
  fft2.setInput(audioIn2);
}



function draw(){
  WHrelation();
  if(maxH !== window.innerHeight || maxW !== window.innerWidth){
    resizeCanvas(window.innerWidth, window.innerHeight);
  }

  var spectrum = fft2.analyze();
  background(spectrum[0], spectrum[1], spectrum[2]);
  var vol1 = audioIn1.getLevel();
  //var vol2 = audioIn2.getLevel();
  //newColor(0, 0, 0);
  //sphere(vol1*(relWH)*10000, 16, 24);
  console.log(vol1);
}