/* TODO: inserite il codice JavaScript necessario a completare il MHW! */


const N_domande = 3;
let lista_not_check = [];
let checked = [];
let risposte = [];
let sondaggio = {};
const lista = document.querySelectorAll('.choice-grid'); //quì prendo tutte le sezioni
const lista_block = document.querySelectorAll('.choice-grid div');

initialize();

function initialize(){
    for(let sez of lista) //TUTTE LE SEZIONI, UNA PER UNA
        sez.addEventListener('click', handler_sez, {capture: true}); //ogni sezione sarà mandata al figlio
    
    
    for(let div of lista_block){ //TUTTI I BLOCCHI DI UN'UNICA SECTION
            div.addEventListener('click', handler_block);
            lista_not_check.push(div);
    }

}


function handler_sez(event){
    const section = event.currentTarget;
    const clicker = event.target;
    const lista_div = section.querySelectorAll('div');
    /*--------------------------QUESTO CONTROLLO SERVE A FARMI CAPIRE SE L'UTENTE
    INVECE DI CLICCARE SULLE CASELLE PRECISE, STA CLICCANDO SUI BORDI, E QUINDI
    CHI GENERA L'EVENTO COINCIDE CON CHI LO GESTISCE (CIOE' LO SFONDO) E IO NON
    VOGLIO QUESTO, MA VOGLIO CHE CHI LO SCATENA SIA IL FIGLIO (CIOE' LA FOTO)
    DUNQUE ANNULLO LA FUNZIONE SE COINCIDE ------------------------------------*/
    if(section == clicker){
        event.stopPropagation();
        return;
    }

    for(let blocks of lista_div)
        blocks.classList.add('opacitura');
    
}

function handler_block(event){
    const block = event.currentTarget;
    const padre_main = block.parentNode;
    const img = block.querySelector('.checkbox');
    const index = lista_not_check.indexOf(block);

    
    block.classList.remove('opacitura');
    block.classList.add('selection');
    img.src = 'images/checked.png';

    uncheck(index, padre_main);
    checked.push(block);
    risposte.push(block);


    const ID = block.dataset.questionId;
    sondaggio[ID] = block.dataset.choiceId;
    
    //questo controllo lo faccio per dichiarare finito tutto
    const lenght_obj = Object.keys(sondaggio).length
    if(lenght_obj == N_domande){
        const uscita = getWinner();
        appendFiglio(uscita, padre_main);
    }
    
}


function uncheck(index, padre_main){
    for(let blocco of checked){
        const indice = lista_not_check.indexOf(blocco);
        //prendo gli indici degli elementi
        const padre = blocco.parentNode; 
        if(index != indice){
            if(padre == padre_main){
                console.log('mimmo');
                const uncheck = blocco.querySelector('.checkbox');
                uncheck.src = 'images/unchecked.png';
                blocco.classList.remove('selection');
                risposte.pop();
            }
        }
    }
}


function getWinner(){
    const valori = Object.values(sondaggio);
    let uscita = null;
    let counter = 0;
    let max = 0;

    for(let i = 0; i < N_domande; i++){
        for(let j = 0; j < N_domande; j++)
            if(valori[i] == valori[j])
                counter++;

        //fuori dal 1o for:
        if(counter > max){
            max = counter;
            uscita = valori[i];
        }
        counter = 0;
    }
 return uscita;
}


function appendFiglio(uscita){ //uscita ricordo essere la chiave
    const value = RESULTS_MAP[uscita];

    rimuoviEvent();
    
    const contenitore = document.createElement('div');
    const titolo = document.createElement('h1');
    const contenuto = document.createElement('p');
    const bottone = document.createElement('div');
    contenitore.classList.add('restart');
    bottone.id = 'bottone';
    
    titolo.textContent = Object.values(value)[0];
    contenuto.textContent = Object.values(value)[1];
    bottone.textContent = 'Ricomincia il quiz';
    
    console.log(titolo);
    console.log(contenuto);
    
    const pagina = document.querySelector('article');
    contenitore.appendChild(titolo);
    contenitore.appendChild(contenuto);
    contenitore.appendChild(bottone);
    pagina.appendChild(contenitore);
    

    bottone.addEventListener('click', restart);
    bottone.style.cursor = 'pointer';
}

function rimuoviEvent(){
    //FUNZIONE CHIAMATA DA appendFiglio()
    for(let padri of lista)
        padri.removeEventListener('click', handler_sez, {capture: true});
    for(let block of lista_block)
        block.removeEventListener('click', handler_block);
}


function restart(event){
    lista_not_check = [];
    checked = [];
    risposte = [];
    sondaggio = {};
    for(let div of lista_block){ //TUTTI I BLOCCHI DI OGNI SECTION
        div.classList.remove('opacitura');
        div.classList.remove('selection');
        (div.querySelector('.checkbox')).src = 'images/unchecked.png';
    }
    const pagina = document.querySelector('article');
    pagina.removeChild((event.currentTarget).parentNode);

    initialize();

}


























