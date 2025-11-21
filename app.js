// ===== USUÁRIO & PERFIL ======
let usuario = {
    nome: "",
    email: "",
    perfil: "",
    vulneravel: false,
    progresso: 0,
    trilha: []
};

// ===== TRILHAS ======
const todasTrilhas = {
    iniciante: [
        "Energia Solar - Básico",
        "Agricultura Sustentável - Iniciante",
        "Gestão de Água - Inicial"
    ],
    intermediario: [
        "Energia Eólica - Intermediário",
        "Economia Circular - Intermediário",
        "Eficiência Energética - Intermediário"
    ],
    avancado: [
        "Bioeconomia Avançada",
        "Gestão Sustentável de Resíduos",
        "Inovação em Energia Renovável"
    ]
};

// ===== MARKETPLACE ======
let vagas = [
    {empresa:"SolarTech",titulo:"Técnico em Painéis Solares",nivel:"iniciante"},
    {empresa:"AgroVerde",titulo:"Agricultor Sustentável",nivel:"iniciante"},
    {empresa:"EcoEnergia",titulo:"Analista de Eficiência Energética",nivel:"intermediario"},
    {empresa:"BioEnergia",titulo:"Gestor de Bioeconomia",nivel:"avancado"}
];

// ===== FUNÇÕES ======
function diagnostico() {
    // Simulação de IA automática
    usuario.nome = prompt("Digite seu nome:");
    usuario.email = prompt("Digite seu email:");
    let idade = parseInt(prompt("Digite sua idade:"));
    usuario.vulneravel = idade < 30;
    // Definição automática de perfil baseado na idade e experiência
    if(idade < 25) usuario.perfil = "iniciante";
    else if(idade < 40) usuario.perfil = "intermediario";
    else usuario.perfil = "avancado";

    gerarTrilha(usuario.perfil);
}


function gerarTrilha(perfil) {
    usuario.trilha = todasTrilhas[perfil];
    usuario.progresso = 0;
    const lista = document.getElementById("listaTrilhas");
    lista.innerHTML = "";
    usuario.trilha.forEach(mod => {
        const li = document.createElement("li");
        li.textContent = mod;
        lista.appendChild(li);
    });
    document.getElementById("progresso").textContent = usuario.progresso;
    document.getElementById("totalModulos").textContent = usuario.trilha.length;
    alert(`Trilha gerada: \n- ${usuario.trilha.join("\n- ")}`);
}

function avancarModulo() {
    if(usuario.progresso < usuario.trilha.length){
        // Marca módulo atual como concluído
        const lista = document.getElementById("listaTrilhas");
        const liAtual = lista.children[usuario.progresso];
        if(liAtual) liAtual.style.textDecoration = "line-through";

        // Incrementa progresso
        usuario.progresso++;
        document.getElementById("progresso").textContent = usuario.progresso;

        alert(`Progresso: ${usuario.progresso}/${usuario.trilha.length}`);

        // Se for o primeiro módulo, libera simulações
        if(usuario.progresso === 1){
            document.getElementById("simulacaoAviso").textContent = "";
        }

        // Se concluir toda trilha, emitir certificado
        if(usuario.progresso === usuario.trilha.length){
            emitirCertificado();
        }
    } else {
        alert("Trilha já concluída!");
    }
}


function emitirCertificado(){
    const modal = document.createElement("div");
    modal.style.position="fixed";
    modal.style.top="0"; modal.style.left="0";
    modal.style.width="100%"; modal.style.height="100%";
    modal.style.background="rgba(0,0,0,0.8)";
    modal.style.display="flex"; modal.style.alignItems="center"; modal.style.justifyContent="center";
    modal.style.color="white"; modal.style.fontSize="24px"; modal.style.textAlign="center";
    modal.innerHTML = `<div>Parabéns ${usuario.nome}!<br>Você concluiu a trilha e recebeu seu certificado digital.<br><br><button onclick="this.parentElement.parentElement.remove()">Fechar</button></div>`;
    document.body.appendChild(modal);
}

// ===== MARKETPLACE ======
function mostrarVagas(){
    const lista = document.getElementById("listaVagas");
    lista.innerHTML = "";
    // Prioridade para vulneráveis
    const recomendadas = vagas.filter(v=>v.nivel===usuario.perfil)
        .sort((a,b)=> usuario.vulneravel ? -1 : 0);
    recomendadas.forEach(v=>{
        const li = document.createElement("li");
        li.textContent = `${v.empresa} - ${v.titulo}`;
        const btn = document.createElement("button");
        btn.textContent = "Candidatar";
        btn.onclick = ()=>alert(`Candidatura enviada para ${v.empresa}`);
        li.appendChild(btn);
        lista.appendChild(li);
    });
}

function cadastrarVaga(e){
    e.preventDefault();
    const empresa = document.getElementById("empresa").value;
    const titulo = document.getElementById("titulo").value;
    const nivel = document.getElementById("nivel").value;
    // Simula auditoria automática
    if(empresa && titulo && nivel){
        vagas.push({empresa,titulo,nivel});
        alert("Vaga cadastrada e validada com sucesso!");
        document.getElementById("formVaga").reset();
    }
}

// ===== SIMULAÇÕES RV/RA ======
let renderer, scene, camera;
function iniciarSimulacao(tipo){
    if(usuario.progresso===0){
        document.getElementById("simulacaoAviso").textContent = "Complete pelo menos 1 módulo antes de iniciar a simulação.";
        return;
    } else {
        document.getElementById("simulacaoAviso").textContent = "";
    }

    const container = document.getElementById("simulacaoContainer");
    container.innerHTML = "";

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const light = new THREE.DirectionalLight(0xffffff,1);
    light.position.set(5,5,5);
    scene.add(light);

    let geometry, material, mesh;
    if(tipo==="solar"){
        geometry = new THREE.BoxGeometry(1,1,1);
        material = new THREE.MeshPhongMaterial({color:0xffcc00});
        mesh = new THREE.Mesh(geometry, material);
    } else {
        geometry = new THREE.CylinderGeometry(0.2,0.2,1,32);
        material = new THREE.MeshPhongMaterial({color:0x00aaff});
        mesh = new THREE.Mesh(geometry, material);
    }
    scene.add(mesh);

    function animate(){
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        renderer.render(scene,camera);
    }
    animate();
}

// ===== PAINEL DE INCLUSÃO ======
function painelInclusao(){
    const grupos = {
        Jovens:35,
        Mulheres:25,
        "Baixa Renda":20,
        "Trabalhadores Setores Poluentes":20
    };
    const ctx = document.getElementById("graficoInclusao").getContext("2d");
    if(window.graficoInclusao) window.graficoInclusao.destroy();
    window.graficoInclusao = new Chart(ctx,{
        type:'pie',
        data:{
            labels: Object.keys(grupos),
            datasets:[{
                data:Object.values(grupos),
                backgroundColor:['#2d7a4b','#3f9e64','#a3d9a5','#95c88a']
            }]
        }
    });
}

window.onload = painelInclusao;
