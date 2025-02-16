const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const resultat = document.getElementById("resultat");

let noms = [];
let angle = 0;
let girant = false;

// Función para leer nombres desde el archivo noms.txt
async function carregarNoms() {
    try {
        const resposta = await fetch("noms.txt");
        const text = await resposta.text();
        noms = text.split("\n").map(n => n.trim()).filter(n => n);
        if (noms.length === 0) throw new Error("El fitxer està buit!");
        dibuixarRuleta();
        alert("Noms carregats correctament!");
    } catch (error) {
        alert("Error carregant noms: " + error.message);
    }
}

document.getElementById("loadNames").addEventListener("click", carregarNoms);

function dibuixarRuleta() {
    if (noms.length === 0) {
        alert("Carrega primer els noms!");
        return;
    }

    const angleTall = (2 * Math.PI) / noms.length;
    const colors = ["#ff5733", "#33ff57", "#3357ff", "#ff33a1", "#a133ff", "#ff8c33"];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);

    for (let i = 0; i < noms.length; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, canvas.width / 2, i * angleTall, (i + 1) * angleTall);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.rotate(i * angleTall + angleTall / 2);
        ctx.fillStyle = "#fff";
        ctx.font = "16px Arial";
        ctx.fillText(noms[i], canvas.width / 4, 0);
        ctx.restore();
    }

    ctx.restore();
}

document.getElementById("spin").addEventListener("click", () => {
    if (noms.length === 0) {
        alert("Carrega primer els noms!");
        return;
    }

    if (girant) return;
    girant = true;

    let voltes = Math.floor(Math.random() * 4) + 6;
    let angleFinal = angle + voltes * 2 * Math.PI + Math.random() * 2 * Math.PI;
    let tempsInicial = null;
    let duracio = 3000;

    function animar(temps) {
        if (!tempsInicial) tempsInicial = temps;
        let transcorregut = temps - tempsInicial;
        let progrés = Math.min(transcorregut / duracio, 1);

        angle = angle + (angleFinal - angle) * (1 - Math.pow(1 - progrés, 3));

        dibuixarRuleta();

        if (progrés < 1) {
            requestAnimationFrame(animar);
        } else {
            girant = false;
            seleccionarGuanyador();
        }
    }

    requestAnimationFrame(animar);
});

function seleccionarGuanyador() {
    let angleTall = (2 * Math.PI) / noms.length;
    let angleCorregit = angle % (2 * Math.PI);
    let index = Math.floor(((Math.PI * 1.5 - angleCorregit + 2 * Math.PI) % (2 * Math.PI)) / angleTall);

    resultat.textContent = `Nom seleccionat: ${noms[index]}`;

    let soVictoria = document.getElementById("winSound");
    soVictoria.play();
}