/**
 * Created by 1jiaqi3 on 11/29/2016.
 */

let validMoves = function(state) {
    //console.log(state);
    //Validate the scenarios where dst is one of piles
    let pileValidation = function(srcCard, move, num) {
        let dstPile = state["pile" + num];
        move.dst = "pile" + num;
        // if dst pile is empty, do not need to check the validity
        if (dstPile.length === 0) {
            if (srcCard.value === 13) {
                results.push(move);
            }
        } else {
            let dstCard = dstPile[dstPile.length - 1];
            //console.log("my srcCard is ");
            //console.log(srcCard);
            let srcColor = colorMap[srcCard.suit];
            let dstColor = colorMap[dstCard.suit];
            if (srcColor !== dstColor && srcCard.value === dstCard.value - 1) {
                //console.log("finally found you!!!");
                results.push(move);
            }
        }
    };
    //Validate the scenarios where dst is one of stacks
    let stackValidation = function (srcCard, move, num) {
        let stack = state["stack" + num];
        move.dst = "stack" + num;
        if (stack.length === 0) {
            if (srcCard.value === 1 && srcCard.suit === suitMap[num - 1]) {
                results.push(move);
            }
        } else {
            let dstCard = stack[stack.length - 1];
            if (srcCard.suit === suitMap[num - 1] && srcCard.value === dstCard.value + 1) {
                results.push(move);
            }
        }
    };

    let results = [];
    // map the 4 suits to red and black colors
    let colorMap = {heart: "red", diamond: "red", club: "black", spade: "black"};
    let suitMap = ["heart", "spade", "diamond", "club"];
    //valid moves from 7 piles, the outter loop is for src piles
    for (let i = 1; i <= 7; i++) {
        let curPile = state["pile" + i];
        if (curPile.length > 0) {
            let k = 1;
            let srcCard = curPile[curPile.length - k];
            while (srcCard && srcCard.up) {
                // this inner loop is for every dst pile
                for (let j = 1; j <= 7; j++) {
                    // only if src pile and dst pile are not the same pile
                    if (i !== j) {
                        let move = {};
                        move.cards = [{suit: srcCard.suit, value: srcCard.value}];
                        move.src = "pile" + i;
                        pileValidation(srcCard, move, j);
                    }
                }
                if (k === 1) {
                    //check scenarios where dst is one of 4 stacks
                    for (let j = 1; j <= 4; j++) {
                        let move = {};
                        move.cards = [{suit: srcCard.suit, value: srcCard.value}];
                        move.src = "pile" + i;
                        stackValidation(srcCard, move, j);
                    }
                }
                k++;
                srcCard = curPile[curPile.length - k];
            }
            //let srcCard = curPile[curPile.length - 1];

        }
    }
    // check scenarios where src is one of 4 stacks
    for (let i = 1; i <= 4; i++) {
        let stack = state["stack" + i];
        if (stack.length > 0) {
            let srcCard = stack[stack.length - 1];
            for (let j = 1; j <= 7; j++) {
                let move = {};
                move.cards = [{suit: srcCard.suit, value: srcCard.value}];
                move.src = "stack" + i;
                pileValidation(srcCard, move, j);
            }
        }
    }


    //check scenarios where src card is the top card of discards
    let discards = state.discard;
    if (discards.length > 0) {
        let srcCard = discards[discards.length - 1];
        for (let i = 1; i <= 7; i++) {
            let move = {};
            move.cards = [{suit: srcCard.suit, value: srcCard.value}];
            move.src = "discard";
            pileValidation(srcCard, move, i);
        }
        for (let i = 1; i <= 4; i++) {
            let move = {};
            move.cards = [{suit: srcCard.suit, value: srcCard.value}];
            move.src = "discard";
            stackValidation(srcCard, move, i);
        }
    }
    for (let k = 0; k < results.length; k++) {
        //console.log(results[k]);
    }
    return results;
};

module.exports = validMoves;


