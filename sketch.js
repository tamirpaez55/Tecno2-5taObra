let classifier;
let label = "listening...";
// Teachable Machine model URL:
let soundModel = "https://teachablemachine.withgoogle.com/models/PyBWphr5K/";
let FREC_MIN = 100;
let FREC_MAX = 700;
let AMP_MIN = 0.02;
let AMP_MAX = 0.1;
let vol;
let mic;
let pitch;
let audioContext;
let gestorAmp;
let gestorPitch;
let amp;
let haySonido = false;
let antesHabiaSonido = false;
let antesHabiaFrec = false;
let frecuencia;
let frecuenciaAnterior;
let estado = "inicio";
const model_url =
  "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";
let cuadDibujado = false;
let fondoDibujado = false;
let cuad;
let cuadr;
let fondo;
let grupos;
let prevX = 0;
let prevY = 0;
let animandoRotacion = false; // Bandera para controlar si se está animando la rotación
const GRAVE_THRESHOLD = 0.5;
function preload() {
    classifier = ml5.soundClassifier(soundModel + 'model.json');
  cuadimg = loadImage("img/cuadradoblanco.png");
  diagimg = loadImage("img/diagblanco.png"); //transparente
  rectimg = loadImage("img/rect.png"); //transparente
  cuad1 = loadImage("img/cuad1.png"); //imagen plana
  cuad2 = loadImage("img/cuad2.png"); //imagen plana
  cuad3 = loadImage("img/cuad4.png"); //imagen plana
  cuad4 = loadImage("img/cuad5.png"); //imagen plana
  cuad5 = loadImage("img/cuad6.png"); //imagen plana
}

function setup() {
  audioContext = getAudioContext(); // inicia el motor de audio
  mic = new p5.AudioIn(); // inicia el micrófono
  mic.start(startPitch); // se enciende el micrófono y le transmito el analisis de frecuencia (pitch) al micrófono. Conecto la libreria con el micrófono
  userStartAudio(); // inicia el audio
  pg = createGraphics(600, 600);
  cuadr = createGraphics(600, 600);
  fondo = new Fondo();
  frameRate(60);
  createCanvas(600, 600);
  cuad = new Cuad();
  
  grupos = cuad.grupos; // Obtiene los grupos desde la clase Cuad
  cuad.dibujar(cuadr);
  inicio();

  gestorAmp =  new GestorSenial( AMP_MIN, AMP_MAX);
  gestorPitch = new GestorSenial( FREC_MIN, FREC_MAX);

  antesHabiaSonido = false;
  classifier.classify(gotResult);
}

function draw() {
  //clear(); // Limpia el canvas principal
  image(pg, 0, 0);
  image(cuadr, 0, 0);

  let vol = mic.getLevel(); // cargo en vol la amplitud del micrófono (señal cruda);
  gestorAmp.actualizar(vol);
  
  haySonido = gestorAmp.filtrada > 0.01; // umbral de ruido que define el estado haySonido

  let inicioElSonido = haySonido && !antesHabiaSonido; // evendo de INICIO de un sonido
  let finDelSonido = !haySonido && antesHabiaSonido; // evento de fIN de un sonido

  if(inicioElSonido){ //Evento
  }
  if(haySonido){ //Estado
}
  if(finDelSonido){//Evento
    cuadDibujado = false;
    fondoDibujado = false;
  }

  let highAmplitudeThreshold = 0.06; // Define your threshold here
  if (amp > highAmplitudeThreshold) {
    let speed = dist(mouseX, mouseY, prevX, prevY); // Calcula la velocidad del cursor
    cuadr.clear();
    cuad.cambiarImagenesGrupo1();
    for (let cuadro of grupos[0]) {
      cuadro.dibujar(cuadr);
    }
    for (let cuadro of grupos[1]) {
      cuadro.dibujar(cuadr);
    }
    
  }
  if (label == 'Nashe') {   
    cuad.rotarGrupo0();
    for (let cuadro of grupos[0]) {
        cuadro.dibujar(cuadr); 
  }
}
  prevX = mouseX; // Actualiza la posición previa del cursor para la próxima iteración
  prevY = mouseY;
  amp = mic.getLevel();
  console.log(label);
  console.log("amplitud:  ", amp);
}

function inicio() {
  fondo.colorFon();
  console.log("Grupo 1:", grupos[0]);
  console.log("Grupo 2:", grupos[1]);
}


function rotarGrupo0ConAnimacion() {
  let cuadroAnimado = false;
  for (let cuadro of grupos[0]) {
    if (cuadro.rotar90Grados()) {
      cuadroAnimado = true;
    }
  }
  if (!cuadroAnimado) {
    animandoRotacion = false;
  }
}
function llamadoARotar() {
  if (animandoRotacion) {
    rotarGrupo0ConAnimacion();
  }
}
function generarNuevosCuadros(speed) {
  if (speed > 150) {
    cuadr.clear();
    cuad.cambiarImagenesGrupo1();
    for (let cuadro of grupos[0]) {
      cuadro.dibujar(cuadr);
    }
    for (let cuadro of grupos[1]) {
      cuadro.dibujar(cuadr);
    }
  }
}


function mouseClicked() {
  fondo.colorFon();
}

function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}
function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {
      gestorPitch.actualizar(frequency);
      //console.log(frequency);
    }
    getPitch();
  });
}
function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
}
