var rows = 8;
var colums = 20;

let ticketCost = 20000;
let luggageCost = 0;
let endCost;

let passangers = 1;
let choosenSeats = 0;
let chosenSeatIDs = []; // Array to store chosen seat IDs

for (let i = 1; i < rows + 1; i++) {
    document.write("<tr>");
    for (let j = 1; j < colums + 1; j++) {
        if (i == 3 || i == 6) {
            document.write(`<td></td>`);
        } else
        if (i < 4) {
            let cellID = `Rr${j}c${i}`;
            document.write(`<td id="${cellID}" class="" onclick='tdclick(this)'></td>`);
        } else if (i < 6) {
            let cellID = `Mr${j}c${i-2}`;
            document.write(`<td id="${cellID}" class="" onclick='tdclick(this)'></td>`);
        } else {
            let cellID = `Lr${j}c${i-4}`;
            document.write(`<td id="${cellID}" class="" onclick='tdclick(this)'></td>`);
        }
    }
}

// Poggyász méretének megadása
function poggyasz(value) {
    if (value > 10*passangers) {
        luggageCost = Math.ceil((value-10*passangers)/5)*2000;
    } else luggageCost = 0;
    vegosszeg();
}

document.addEventListener('DOMContentLoaded', function() {
    var input2 = document.getElementById('luggage');
    input2.addEventListener('change', function() {
        poggyasz(this.value);
    });
});

// Utasok számának megadása
var input = document.getElementById('utasok');
input.addEventListener('change', function() {
    utasok(this.value);
});

function utasok(value) {
    passangers = value;
    ticketCost = passangers * 20000;
    poggyasz(document.getElementById('luggage').value); // Update luggage cost
    vegosszeg();
    console.log(passangers);
    if (choosenSeats > passangers) clearChosenSeats();
}



// Helyek kiválasztása
function tdclick(element) {
    console.log(element);
    if (element.classList.contains('choosenSeat')) {
        element.classList.remove("choosenSeat");
        choosenSeats--;
        // Remove the unchosen seat ID from the array
        const index = chosenSeatIDs.indexOf(element.id);
        if (index > -1) {
            chosenSeatIDs.splice(index, 1);
        }
    }
    else if (choosenSeats < passangers) {
        choosenSeats++;
        element.classList.add("choosenSeat");
        // Add the chosen seat ID to the array
        chosenSeatIDs.push(element.id);
    }
}

// Törli az összes 'choosenSeat' classt
function clearChosenSeats() {
    var cells = document.querySelectorAll('.choosenSeat');
    cells.forEach(function(cell) {
        cell.classList.remove('choosenSeat');
    });
    choosenSeats = 0; // Reset the count of chosen seats
    chosenSeatIDs = []; // Clear the array of chosen seat IDs
    vegosszeg(); // Update the total cost
}

// Vegosszeget szamol
function vegosszeg() {
    endCost = luggageCost + ticketCost;
    console.log("Végösszeg: " + endCost);
    console.log("Jegyek: " + ticketCost);
    console.log("Poggyászok: " + luggageCost);
    document.getElementById("printOutTicketCost").innerHTML=`${ticketCost}Ft`;
    document.getElementById("printOutLuggageCost").innerHTML=`${luggageCost}Ft`;
    document.getElementById("printOutCost").innerHTML=`${endCost}Ft`;
}
