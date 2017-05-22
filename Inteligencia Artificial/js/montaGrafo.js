function caminho(){
	var pInput = document.getElementById("partida");
	var cInput = document.getElementById("chegada");
	var vInput = document.getElementById("vertices");
	var aInput = document.getElementById("arestas");
	vertices = vInput.value;
	arestas = aInput.value;
	pInput.value = pInput.value.toUpperCase();
	cInput.value = cInput.value.toUpperCase();
	partida = pInput.value;
	chegada = cInput.value;

	if (partida.length > 1) {
		alert("Você deve digitar apenas um vértice para partida !");
		pInput.value = "";
		return false;
	}
	if (chegada.length > 1) {
		alert("Você deve digitar apenas um vértice para chegada !");
		cInput.value = "";
		return false;
	};
	if (partida == chegada && partida.length > 0 && chegada.length > 0) {
		alert("Seu ponto de partida deve ser diferente do ponto de chegada !");
		cInput.value = "";
		return false;
	};
	if (!checaID(partida) && partida.length > 0) {
		alert("Você deve digitar um ponto de partida que está no grafo !");
		pInput.value = "";
		return false;
	};
	if (!checaID(chegada) && chegada.length > 0) {
		alert("Você deve digitar um ponto de chegada que está no grafo !");
		cInput.value = "";
		return false;
	};

	$('#caminho').empty();
	document.getElementById("distancia").innerHTML = "";
	document.getElementById("manhattan").innerHTML = "";
	window.percorrido = 0;

	if (partida.length < 1 || chegada.length < 1) {
		return false;
	};

	var xManhattan = checaID(partida);
	var yManhattan = checaID(chegada);

	if (xManhattan < 10) {
		xManhattan = "0" + "" + xManhattan;
	};
	if (yManhattan < 10) {
		yManhattan = "0" + "" + yManhattan;
	};

	var x1 = xManhattan.slice(0, 1);
	var x2 = xManhattan.slice(-1);
	var y1 = yManhattan.slice(0, 1);
	var y2 = yManhattan.slice(-1);

	xManhattan = Math.abs(x1 - y1);
	yManhattan = Math.abs(x2 - y2);

	document.getElementById("manhattan").innerHTML = xManhattan + yManhattan;

	var graph = montaMap();
	var caminho = graph.findShortestPath(partida, chegada);

	if (caminho == null) {
		alert("Você selecionou um caminho impossivel, somente a distancia manhattan será gerada !");
		return false;
	};

	printaCaminho(caminho);

	for (var i = 0 ; i < caminho.length - 1; i++) {
		var valor = adjacente(caminho[i], caminho[i+1]);

		if (valor > 1) {
			var valor = Math.sqrt(2);
		}else {
			var valor = 1;
		}

		percorrido += valor;
	};
	document.getElementById("distancia").innerHTML = percorrido;
}

function printaCaminho(caminho){
	var divzao = document.getElementById("caminho");
	for (var y = 0 ; y < caminho.length; y++) {
		var div = document.createElement("div");

		if (y % 6 == 0 && y > 0){
			var span = document.createElement("span");
			span.setAttribute("class", "col-1");
			divzao.appendChild(span);
		}

		div.innerHTML = caminho[y];
		div.setAttribute("class", "text col-1");
		divzao.appendChild(div);

		if (y != caminho.length - 1) {
			var i = document.createElement("i");
			i.setAttribute("class", "glyphicon glyphicon-arrow-right col-1");
			divzao.appendChild(i);
		};
	}
}
function montaMap(){
	var map = '{'

	montaPares();

	for (var i = 0; i < grafo.length; i++) {
		if (i > 0) {map += ',';}
		map += '"'+grafo[i]+'":{';

		for (var j = 0; j < pares.length; j++) {
			var primeiro = pares[j].substring(0, 1);
			var segundo = pares[j].substring(1, 2);

			if (primeiro == grafo[i]) {
				if (adjacente(primeiro, segundo) > 1) {
					var valor = Math.sqrt(2);
				}else {
					var valor = 1;
				}
				if (map.slice(-1) != '{') {map += ',';};
				map += '"'+segundo+'":'+valor;
			};
		};
		map += '}';
	};
	map += '}';
	graph = new Graph(JSON.parse(map));
	return graph;
}

function montaPares(){
	for (var i = 0; i < tamMatriz; i++) {
		for (var j = 0; j < tamMatriz; j++) {
			if (mAdj[i][j] == 1){
				var primeiro = letras[i];
				var segundo = letras[j];

				pares.push(primeiro + segundo);
				[segundo, primeiro] = [primeiro, segundo];
				pares.push(primeiro + segundo);
			}
		};
	};
	pares = pares.sort();
}

function adjacente(primeiro, segundo){
	var input = document.getElementById("arestas");
	var num = input.value;

	var idPrimeiro = parseInt(checaID(primeiro));
	var idSegundo = parseInt(checaID(segundo));
	var aux = idPrimeiro;

	aux ++;
	if (aux == idSegundo){return 1;}
	aux = idPrimeiro;
	aux --;
	if (aux == idSegundo){return 1;}
	aux = idPrimeiro;
	aux += 10;
	if (aux == idSegundo){return 1;}
	aux = idPrimeiro;
	aux += 11;
	if (aux == idSegundo){return 2;}
	aux = idPrimeiro;
	aux += 9;
	if (aux == idSegundo){return 2;}
	aux = idPrimeiro;
	aux -= 10;
	if (aux == idSegundo){return 1;}
	aux = idPrimeiro;
	aux -= 9;
	if (aux == idSegundo){return 2;}
	aux = idPrimeiro;
	aux -= 11;
	if (aux == idSegundo){return 2;}

	alert("Os vertices conectados devem ser adjacentes !");
	input.value = num.slice(0, -2);
	return false;	
}

function setLetras(){
    return ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T'];
}

function numVert(){
	var input = document.getElementById("vertices");
	var num = input.value;
	window.tamMatriz = num;

	$('.linha').remove();
	$('#matriz').empty();
	$('#caminho').empty();
	document.getElementById("distancia").innerHTML = "";
	document.getElementById("manhattan").innerHTML = "";
	window.percorrido = 0;
	document.getElementById("arestas").value = "";
	document.getElementById("partida").value = "";
	document.getElementById("chegada").value = "";

	if (num <= 20 && num >= 0) {
		preenche(num);
		tblMatriz(num);
		window.mAdj = new Array(num);
		for (var i = 0; i < num; i++) {
			mAdj[i] = new Array(num);
		};
	}else {
		alert("O campo deve ser um numero entre 0 e 20 !");
		input.value = 0;
		input.focus();
		preenche(0);
	}
	if (num >= 0){
		grafo = letras;
		grafo.length = num;
		letras = setLetras();
	}
}

function numArest(){
	var input = document.getElementById("arestas");
	input.value = input.value.toUpperCase();
	var num = input.value;
	$('html,body').scrollTop(0);

	if (num.length == 0) {
		$('.linha').remove();
		$('#matriz').empty();
		$('#caminho').empty();
		document.getElementById("distancia").innerHTML = "";
		document.getElementById("manhattan").innerHTML = "";
		window.percorrido = 0;
		tblMatriz(tamMatriz);
		zeraMatriz();
		pares = [];
		document.getElementById("partida").value = "";
		document.getElementById("chegada").value = "";
		return false;
	};

	if (grafo.length < 1) {
		alert("Você deve criar no minimo 2 vértices antes de criar arestas !");
		input.value = "";
		return false;
	}

	if (checaID(num.substring(num.length - 1))){
		if (isEven(num.length)){
			$('.linha').remove();
			$('#caminho').empty();
			document.getElementById("distancia").innerHTML = "";
			document.getElementById("manhattan").innerHTML = "";
			window.percorrido = 0;
			zeraMatriz();
			pares = [];
			document.getElementById("partida").value = "";
			document.getElementById("chegada").value = "";
			for (var i = 0; i < num.length; i+=2) {
				var par = num.substring(i, i+2);
				var primeiro = par.substring(0, 1);
				var segundo = par.substring(1, 2);
				var um = primeiro.charCodeAt(0);
				var dois = segundo.charCodeAt(0);

				if (um > dois){
					var troca = inverte(primeiro, segundo);
					primeiro = troca[0];
					segundo = troca[1];
				}

				repetido(primeiro, segundo);

				if (equal(um, dois)){
					if (adjacente(primeiro, segundo)){
						linha(primeiro, segundo);
						//pares.push(primeiro.toString() + segundo.toString());
					}				
				}
			};
			$('#matriz').empty();
			tblMatriz(tamMatriz);
			fillMatriz();

		}
	}else {
		alert("Você deve informar um vértice desenhado para criar a aresta !");
		input.value = num.slice(0, -2);
	}
}

function fillMatriz(){
	var input = document.getElementById("arestas");
	var num = input.value;
	
	for (var i = 0; i < num.length; i+=2) {
		var par = num.substring(i, i+2);
		var primeiro = par.substring(0, 1);
		var segundo = par.substring(1, 2);

		montaMatriz(primeiro, segundo);
	}
}

function tblMatriz(size){
	var div = document.getElementById("matriz");
	var table = document.createElement("table");
	var tbody = document.createElement("tbody");
	size ++;

	for (var x = 0; x < size; x++) {
		var tr = document.createElement("tr");

		for (var y = 0; y < size; y++) {
			if (x == 0 && y == 0) {
				var td = document.createElement("td");
				td.innerHTML = "<div class='numberCircle matriz'>M</div>";
				tr.appendChild(td);
			}else if (x == 0) {
				var td = document.createElement("td");
				td.innerHTML = "<div class='numberCircle matriz'>"+ letras[y - 1] +"</div>";
				tr.appendChild(td);
			}else if (x > 0 && y == 0){
				var td = document.createElement("td");
				td.innerHTML = "<div class='numberCircle matriz'>"+ letras[x - 1] +"</div>";
				tr.appendChild(td);
			}else{
				var td = document.createElement("td");
				td.innerHTML = "<div id=m"+x+""+y+" class='numberCircle matriz'>0</div>";
				tr.appendChild(td);
			}
		};
		tbody.appendChild(tr);
		var br = document.createElement("br");
		tbody.appendChild(br);
	};
	table.appendChild(tbody);
	div.appendChild(tbody);
}

function montaMatriz(primeiro, segundo){
	var input = document.getElementById("arestas");
	var num = input.value;

	var linha = pegaLetra(primeiro);
	var coluna = pegaLetra(segundo);
	var x = linha+1;
	var y = coluna+1;
	var xy = "m" + x + "" + y;

	document.getElementById(xy).innerHTML = 1;

	mAdj[linha][coluna] = 1;
}

function zeraMatriz(){
	for (var i = 0; i < tamMatriz; i++) {
		for (var j = 0; j < tamMatriz; j++) {
			mAdj[i][j] = 0;
		};
	};
}

function pegaLetra(letra){
	for (var i = letras.length - 1; i >= 0; i--) {
		if (letra == letras[i]){
			return i;
		}
	};
}

function repetido(primeiro, segundo){
	var input = document.getElementById("arestas");
	var num = input.value;
	var par = primeiro + segundo;
	var checked = false;

	for (var i = 0; i < num.length; i+=2) {
		if (par == num.substring(i, i+2) && checked == false){
			checked = true;
		}else if (par == num.substring(i, i+2) && checked == true){
			alert("Você não pode criar duas arestas iguais !");
			input.value = num.slice(0, -2);
			break;
		}
	}
}

function equal(um, dois){
	var input = document.getElementById("arestas");
	var num = input.value;

	if (um == dois){
		alert("Você não pode conectar um vertice nele mesmo !");
		input.value = num.slice(0, -2);
		return false;
	}
	return true;
}

function inverte(primeiro, segundo){
	var input = document.getElementById("arestas");
	var num = input.value;

	[segundo, primeiro] = [primeiro, segundo];
	input.value = num.slice(0, -2);
	input.value += primeiro + segundo;
	return [primeiro, segundo];
}

function linha(primeiro, segundo){
	var vert1 = document.getElementById(checaID(primeiro));
	var vert2 = document.getElementById(checaID(segundo));
	connect(vert1, vert2, "#FF0000", 2, "linha");
}

function checaID(x){
	var letra = x.charCodeAt(0);
	var grafo = window.grafo;
	var idLetras = window.idLetras;

	for (var i = 0; i < grafo.length; i++) {
		var desenho = grafo[i].charCodeAt(0);

		if (letra == desenho){
			return idLetras[i];
		}
	};
	return false;
}

function show(x){
	document.getElementById(x).style.display = "block";
}

function hide(x){
	document.getElementById(x).style.display = "none";
}

function checkHide(x){
	if (document.getElementById(x).style.display == "none"){
		return true;
	}else {
		return false;
	}
}

function preenche(num){
	var att = 0;
	for (var i = 0; i <= 19 ; i++) {

		if (checkHide(att)){
			if (i < num) {
				show(att);
			}
		}else {
			if (i > num - 1){
				hide(att);
			}
		}

		if (att < 10) {
			att += 10;
		}else{
			att -= 9;
		}
	};
}

function isEven(n) {
   return n % 2 == 0;
}

function isOdd(n) {
   return Math.abs(n % 2) == 1;
}