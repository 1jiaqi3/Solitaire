import React from 'react';
import { hashHistory } from 'react-router';

export class Game extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

        if (localStorage.getItem('newGame') !== 'yes' && localStorage.getItem('reloaded') === 'no') {
            localStorage.setItem('reloaded', 'yes');
            location.reload();
        }

        if (sessionStorage.getItem("status") !== "loggedin") {
            hashHistory.push("/login");
        }
        $("#btn-profile").click(function () {
            hashHistory.push("/profile/" + sessionStorage.getItem("username"));
        });
        $("#btn-start").click(function () {
            hashHistory.push("/start");
        });

        let drawTpl = _.template(
            '<% let cards = JSON.parse(localStorage.getItem("curCards")); %>' +
            '<% let drawCards = cards["draw"]; %>' +
            '<% let offset = 0; %>' +
            '<% for (let i = 0; i < drawCards.length; i++) { %>' +
            '<div class="card-style" style="z-index: <%= i %>; position: absolute; margin-top: <%= offset + \'px\'%>; margin-left: <%= offset + \'px\'%>">' +
                '<img src="img/back.jpg" class="drawCards down">' +
            '</div>' +
            '<% if (offset <= 6) { %>' +
                '<% offset++; %>' +
            '<% } %>' +
            '<% } %>'
        );

        let pileTpl = _.template(
            '<% for (let i = 1; i <= 7; i++) { %>' +
            '<% let cards = JSON.parse(localStorage.getItem("curCards")); %>' +
            '<% let curPile = cards["pile" + i]; %>' +
            '<div class="card-style" style="border: none" id="bigpile<%=i%>">' +
            '<% let offset = 0; %>' +
            '<% for (let j = 0; j < curPile.length; j++) { %>' +
            '<%     let card = curPile[j]; %>' +
            '<% if (card && card.up === false) { %>' +
            '    <div class="card-style pile<%=i%>" style="margin-top: <%= offset + \'px\'%>; z-index: <%= j %>; position: absolute; border: none">' +
            '    <img src="img/back.jpg" class="down">' +
            '    </div>' +
            '    <% } else { %>' +
            '    <div class="card-style pile<%=i%>" style="margin-top: <%= offset + \'px\'%>; z-index: <%= j %>; position: absolute; border: none">' +
            '    <img src="img/<%= card.suit %>_<%= card.value %>.png" class="up" id="<%=card.suit%>_<%=card.value%>">' +
            '    </div>' +
            '    <% } %>' +
            '<% offset += 20; %>' +
            '<% } %>' +
        '</div>' +
        '<% } %>'
        );

        let discardOneTmpl = _.template(
            '<% let cards = JSON.parse(localStorage.getItem("curCards")); %>' +
            '<% let discards = cards.discard; %>' +
            '<% let discardZindex = 0; %>' +
            '<% for (let i = 0; i < discards.length; i++) { %>' +
            '<div class="card-style discard" style="z-index: <%= discardZindex + \'px\'%>; position: absolute">'+
            '<img src="../img/<%= discards[i].suit %>_<%= discards[i].value %>.png" class="up" id="<%=discards[i].suit%>_<%=discards[i].value%>">'+
            '</div>' +
            '<% discardZindex++; %>' +
            '<% } %>'
        );

        let discardThreeTmpl = _.template(
            '<% let offset = 0 %>' +
            '<% let discardZindex = 0 %>' +
            '<% let upDown = "down"; %>' +
            '<% for (let i = 0; i < threeCards.length; i++) { %>' +
            '<% if (i === threeCards.length - 1) { %>' +
            '<%     upDown = "up"; %>' +
            '<% } %>' +
            '<%   let nextCard = threeCards[i]; %>' +
            '     <div class="card-style discard" style="z-index: <%= discardZindex + \'px\' %>; position: absolute; margin-left: <%= offset + \'px\' %>">' +
            '        <img src="img/<%= nextCard.suit %>_<%= nextCard.value %>.png" class=<%=upDown%> id="<%= nextCard.suit %>_<%= nextCard.value %>">' +
            '     </div>' +
            '<% offset += 20 %>' +
            '<% discardZindex++; %>' +
            '<% } %>'
        );
        let stackTmpl = _.template(
            '<% let cards = JSON.parse(localStorage.getItem("curCards")); %>' +
            '<% let curStack = cards[stackID]; %>' +
            '<% let zIndex = 0; %>' +
            '<% for (let i = 0; i < curStack.length; i++) { %>' +
            '<div class="card-style <%=stackID%>" style="z-index: <%= zIndex %>; position: absolute; border: none">' +
            '   <img src="../img/<%= curStack[i].suit %>_<%= curStack[i].value %>.png" class="up" id="<%=curStack[i].suit%>_<%=curStack[i].value%>">' +
            '</div>' +
            '<% zIndex++; %>' +
            '<% } %>'
        );

        let emptyTemplate = _.template(
            '<div class="card-style <%=pileID%> holder" style="position: absolute">' +
            '   <img src="../img/black_joker.png" class="up">' +
            '</div>'
        );
        let gameLogic = function (deck, currentState) {
            let data;
            if (deck.length > 0) {
                data = {};
                // build 7 piles
                for (let i = 1; i <= 7; i++) {
                    let propertyName = "pile" + i;
                    data[propertyName] = [];
                    for (let j = 0; j < i; j++) {
                        let newCard = deck.pop();
                        newCard.up = j === i - 1;
                        data[propertyName].push(newCard);
                    }
                }
                for (let i = 1; i <= 4; i++) {
                    let propertyName = "stack" + i;
                    data[propertyName] = [];
                }
                data.draw = deck;
                data.discard = [];
            } else {

                data = JSON.parse(currentState);
                console.log(data);
            }

            localStorage.setItem("curCards", JSON.stringify(data));

            $.ajax({
                url: "http://localhost:8080/v1/update",
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify({state: JSON.parse(localStorage.getItem("curCards"))}),
                dataType: 'json',
                success: function () {
                    console.log("state updated");
                }
            });

            let resultDraw = drawTpl();
            $("#draw").html(resultDraw);

            let resultPile = pileTpl();
            $("#pile").html(resultPile);

            let myCards = JSON.parse(localStorage.getItem("curCards"));
            for (let i = 1; i <= 7; i++) {
                if (myCards["pile" + i].length === 0) {
                    console.log(i);
                    let resultEmpty = emptyTemplate({pileID: "pile" + i});
                    $("#bigpile" + i).append(resultEmpty);
                }
            }
            for (let i = 1; i <= 4; i++) {
                let resultStack = stackTmpl({stackID: "stack" + i});
                $("#stack" + i).append(resultStack);
            }
            let resultDiscard;
            if (JSON.parse(localStorage.getItem('difficulty')) === 1) {
                resultDiscard = discardOneTmpl();
            } else {
                let start = Math.max(0, myCards.discard.length - 3);
                let threeCards = myCards.discard.slice(start, myCards.discard.length);
                resultDiscard = discardThreeTmpl({threeCards: threeCards});
            }
            $("#discard").html(resultDiscard);


            let discardZindex = 0;
            let discard = $("#discard");
            let tmplOne = _.template(
                '<div class="card-style discard" style="z-index: <%= discardZindex + \'px\'%>; position: absolute">'+
                '<img src="../img/<%= nextCard.suit %>_<%= nextCard.value %>.png" class="up" id="<%=nextCard.suit%>_<%=nextCard.value%>">'+
                '</div>'
            );
            let tmplThree = _.template(
                '<% let offset = 0 %>' +
                '<% let discardZindex = 0 %>' +
                '<% let upDown = "down"; %>' +
                '<% for (let i = 0; i < threeCards.length; i++) { %>' +
                '<% if (i === threeCards.length - 1) { %>' +
                '<%     upDown = "up"; %>' +
                '<% } %>' +
                '<%   let nextCard = threeCards[i]; %>' +
                '     <div class="card-style discard" style="z-index: <%= discardZindex + \'px\' %>; position: absolute; margin-left: <%= offset + \'px\' %>">' +
                '        <img src="../img/<%= nextCard.suit %>_<%= nextCard.value %>.png" class=<%=upDown%> id="<%= nextCard.suit %>_<%= nextCard.value %>">' +
                '     </div>' +
                '<% offset += 20 %>' +
                '<% discardZindex++; %>' +
                '<% } %>'
            );
            let difficulty = JSON.parse(localStorage.getItem("difficulty"));
            console.log(difficulty);
            $(".drawCards").click(function () {
                let state = JSON.parse(localStorage.getItem("curCards"));
                if (state.draw.length === 0) {
                    while (state.discard.length > 0) {
                        let curCard = state.discard.pop();
                        curCard.up = false;
                        state.draw.push(curCard);
                    }
                    discard.empty();
                    discardZindex = 0;
                }
                if (difficulty === 1) {
                    let nextCard = state.draw.pop();
                    nextCard.up = true;
                    state.discard.push(nextCard);
                    let toAppend = tmplOne({nextCard: nextCard, discardZindex: discardZindex});
                    discard.append(toAppend);
                    discardZindex++;
                } else {
                    let threeCards = [];
                    //console.log(state.draw.length);
                    let len = state.draw.length;
                    for (let i = 0; i < Math.min(3, len); i++) {
                        let nextCard = state.draw.pop();
                        nextCard.up = true;
                        threeCards.push(nextCard);
                        state.discard.push(nextCard);
                    }
                    //console.log(threeCards);
                    let toAppend = tmplThree({threeCards: threeCards});
                    discard.html(toAppend);
                }
                localStorage.setItem("curCards", JSON.stringify(state));
            });
            let up = $('.up');
            let source;
            let cardInfo;
            $(document).on("click", ".up", function(){
                if (source) {
                    let id = $(this).parent().attr("id");
                    let dst;
                    if (id) {
                        dst = id;
                    } else {
                        dst = $(this).parent().attr("class").split(" ")[1];
                    }
                    let stateJasn = {cards: [{"suit": cardInfo[0], "value": cardInfo[1]}], src: source, dst: dst};
                    //console.log(stateJasn);
                    source = null;

                    let state = JSON.parse(localStorage.getItem("curCards"));
                    $.ajax({
                        url: "http://localhost:8080/v1/game/" + localStorage.getItem('gameName'),
                        type: "PUT",
                        contentType: 'application/json',
                        data: JSON.stringify({state: state, move: stateJasn}),
                        dataType: 'json',
                        success: function () {
                            let toMoveMany = [];
                            let toMoveOne;
                            //The card highlighted
                            let srcCard = stateJasn.cards[0];
                            //These 2 lines make the format of srcCard same as that of the "cards" in state
                            srcCard.up = true;
                            srcCard.value = parseInt(srcCard.value);
                            let src = stateJasn.src;
                            let dest = stateJasn.dst;

                            let tmplPile = _.template(
                                '<div class="card-style <%=dest%>" style="margin-top: <%= offset + \'px\'%>; z-index: <%= zIndex %>; position: absolute; border: none">' +
                                '   <img src="../img/<%= nextCard.suit %>_<%= nextCard.value %>.png" class="up" id="<%=nextCard.suit%>_<%=nextCard.value%>">' +
                                '</div>'
                            );

                            let tmplStack = _.template(
                                '<div class="card-style <%=dest%>" style="z-index: <%= zIndex %>; position: absolute; border: none">' +
                                '   <img src="../img/<%= nextCard.suit %>_<%= nextCard.value %>.png" class="up" id="<%=nextCard.suit%>_<%=nextCard.value%>">' +
                                '</div>'
                            );

                            if (src.startsWith("pile")) {
                                let index = 0;
                                //to find the highlighted card from state
                                for (let m = 0; m < state[src].length; m++) {
                                    if (JSON.stringify(srcCard) === JSON.stringify(state[src][m])) {
                                        index = m;
                                        //console.log(index);
                                        break;
                                    }
                                }
                                let len = state[src].length;
                                for (let m = 0; m < len - index; m++) {
                                    toMoveMany.unshift(state[src].pop());
                                }
                                //state-wise, flip the card
                                if (index > 0) {
                                    let toFlip = state[src][index - 1];
                                    if (!toFlip.up) {
                                        state[src][index - 1].up = true;
                                    }
                                }

                                let next = $("#" + srcCard.suit + "_" + srcCard.value).parent();
                                let prev = $(next).prev();
                                if (dest.startsWith('pile')) {
                                    let toRemove = [];
                                    while (next.length) {
                                        toRemove.push(next);
                                        next = next.next();
                                    }
                                    for (let m = 0; m < toRemove.length; m++) {
                                        toRemove[m].remove();
                                    }


                                    let srcPileDOM = $("." + src);
                                    //flip the card
                                    if (srcPileDOM.length > 0) {
                                        let srcCardDIV = srcPileDOM[srcPileDOM.length - 1];
                                        let offsetPX = $(srcCardDIV).css("margin-top");
                                        let offset = parseInt(offsetPX.substring(0, offsetPX.length - 2));
                                        let zIndex = $(srcCardDIV).css("z-index");
                                        srcCardDIV.remove();
                                        let flipCard = state[src][state[src].length - 1];
                                        let toAppend = tmplPile({offset: offset, zIndex: zIndex, nextCard: flipCard, dest: src});
                                        $("#big" + src).append(toAppend);
                                    }


                                    //for King moving to empty pile
                                    if (prev.length === 0) {
                                        let curPile = $("#big" + src);
                                        let emptyTmpl = _.template(
                                            '<div class="card-style <%=src%> holder" style="position: absolute">' +
                                            '   <img src="../img/black_joker.png" class="up">' +
                                            '</div>'
                                        );
                                        let emptyAppend = emptyTmpl({src: src});
                                        curPile.append(emptyAppend);
                                        //$(curPile).css("border", "2px #aaaaaa solid");
                                    }
                                    //select all divs that belong to pileX class
                                    let dstPileDOM = $("." + dest);
                                    console.log(dstPileDOM);
                                    console.log($(dstPileDOM[0]).attr("class"));
                                    console.log(this);
                                    let dstClass = $(dstPileDOM[0]).attr("class").split(" ");
                                    if (dstPileDOM.length === 1 && dstClass.length === 3) {
                                        let bigPile = $("#big" + dest);
                                        bigPile.empty();
                                        let offset = 0;
                                        let zIndex = 0;
                                        while (toMoveMany.length > 0) {
                                            let nextCard = toMoveMany.shift();

                                            state[dest].push(nextCard);
                                            let toAppend = tmplPile({offset: offset, zIndex: zIndex, nextCard: nextCard, dest: dest});
                                            bigPile.append(toAppend);
                                            offset += 20;
                                            zIndex++;
                                        }
                                    } else {
                                        //select the last card (actually a div), which is facing up
                                        let dstCardDiv = dstPileDOM[dstPileDOM.length - 1];
                                        //get this div's margin-top (offset)
                                        let offsetPX = $(dstCardDiv).css("margin-top");
                                        let offset = parseInt(offsetPX.substring(0, offsetPX.length - 2)) + 20;
                                        //get this div's z-index
                                        let zIndex = $(dstCardDiv).css("z-index") + 1;
                                        while (toMoveMany.length > 0) {
                                            let nextCard = toMoveMany.shift();

                                            state[dest].push(nextCard);
                                            let toAppend = tmplPile({offset: offset, zIndex: zIndex, nextCard: nextCard, dest: dest});
                                            $("#big" + dest).append(toAppend);
                                            offset += 20;
                                            zIndex++;
                                        }
                                    }
                                    //to flip the back card
                                    localStorage.setItem("curCards", JSON.stringify(state));
                                } else if (toMoveMany.length === 1 && dest.startsWith("stack")) {
                                    next.remove();

                                    let srcPileDOM = $("." + src);
                                    //flip the card
                                    if (srcPileDOM.length > 0) {
                                        let srcCardDIV = srcPileDOM[srcPileDOM.length - 1];
                                        let offsetPX = $(srcCardDIV).css("margin-top");
                                        let offset = parseInt(offsetPX.substring(0, offsetPX.length - 2));
                                        let zIndex = $(srcCardDIV).css("z-index");
                                        srcCardDIV.remove();
                                        let flipCard = state[src][state[src].length - 1];
                                        let toAppend = tmplPile({offset: offset, zIndex: zIndex, nextCard: flipCard, dest: src});
                                        $("#big" + src).append(toAppend);
                                    }

                                    if (prev.length === 0) {
                                        let curPile = $("#big" + src);
                                        let emptyTmpl = _.template(
                                            '<div class="card-style <%=src%> holder" style="position: absolute">' +
                                            '   <img src="../img/black_joker.png" class="up">' +
                                            '</div>'
                                        );
                                        let emptyAppend = emptyTmpl({src: src});
                                        curPile.append(emptyAppend);
                                        //$(curPile).css("border", "2px #aaaaaa solid");
                                    }

                                    let dstStackDOM = $("." + dest);
                                    let dstStackDIV = dstStackDOM[dstStackDOM.length - 1];
                                    let zIndex = $(dstStackDIV).css("z-index") + 1;
                                    let nextCard = toMoveMany[0];
                                    state[dest].push(nextCard);
                                    let toAppend = tmplStack({zIndex: zIndex, nextCard: nextCard, dest: dest});
                                    $("#" + dest).append(toAppend);
                                    zIndex++;
                                    localStorage.setItem("curCards", JSON.stringify(state));
                                }

                            } else if (src.startsWith("stack")) {
                                let next = $("#" + srcCard.suit + "_" + srcCard.value).parent();
                                next.remove();
                                toMoveOne = state[src].pop();

                                let dstPileDOM = $("." + dest);
                                //select the last card (actually a div), which is facing up
                                let dstCardDiv = dstPileDOM[dstPileDOM.length - 1];
                                //get this div's margin-top (offset)
                                let offsetPX = $(dstCardDiv).css("margin-top");
                                let offset = parseInt(offsetPX.substring(0, offsetPX.length - 2)) + 20;
                                //get this div's z-index
                                let zIndex = $(dstCardDiv).css("z-index") + 1;
                                state[dest].push(toMoveOne);
                                let toAppend = tmplPile({offset: offset, zIndex: zIndex, nextCard: toMoveOne, dest: dest});
                                $("#big" + dest).append(toAppend);
                                localStorage.setItem("curCards", JSON.stringify(state));
                            } else if (src === "discard") {
                                let next = $("#" + srcCard.suit + "_" + srcCard.value).parent();

                                let pushBackToDraw = 0;
                                let prev = next.prev();
                                while (prev.length) {
                                    pushBackToDraw++;
                                    prev = prev.prev();
                                }

                                $(next).remove();
                                toMoveOne = state[src].pop();

                                let dstDOM = $("." + dest);
                                let dstClass = $(dstDOM[0]).attr("class").split(" ");
                                //select the last card (actually a div), which is facing up
                                let dstCardDiv = dstDOM[dstDOM.length - 1];
                                let zIndex = $(dstCardDiv).css("z-index") + 1;
                                state[dest].push(toMoveOne);
                                if (dest.startsWith("pile")) {
                                    if (dstDOM.length === 1 && dstClass.length === 3) {
                                        $("#big" + dest).empty();
                                        let offset = 0;
                                        let zIndex = 0;
                                        let toAppend = tmplPile({offset: offset, zIndex: zIndex, nextCard: toMoveOne, dest: dest});
                                        $("#big" + dest).append(toAppend);
                                    } else {
                                        let offsetPX = $(dstCardDiv).css("margin-top");
                                        let offset = parseInt(offsetPX.substring(0, offsetPX.length - 2)) + 20;
                                        let toAppend = tmplPile({offset: offset, zIndex: zIndex, nextCard: toMoveOne, dest: dest});
                                        $("#big" + dest).append(toAppend);
                                    }
                                } else if (dest.startsWith("stack")) {
                                    let toAppend = tmplStack({zIndex: zIndex, nextCard: toMoveOne, dest: dest});
                                    $("#" + dest).append(toAppend);
                                }
                                if (difficulty !== 1) {
                                    let threeCards = [];
                                    for (let i = 0; i < pushBackToDraw; i++) {
                                        threeCards.unshift(state.discard.pop());
                                    }
                                    let drawLen = state.draw.length;
                                    for (let i = 0; i < Math.min(3 - pushBackToDraw, drawLen); i++) {
                                        let nextCard = state.draw.pop();
                                        nextCard.up = true;
                                        threeCards.unshift(nextCard);
                                    }
                                    let toAppend = tmplThree({threeCards: threeCards});
                                    discard.html(toAppend);
                                    let threeLen = threeCards.length;
                                    for (let i = 0; i < threeLen; i++) {
                                        state.discard.push(threeCards.shift());
                                    }
                                    console.log(JSON.stringify(state.discard));
                                }
                                localStorage.setItem("curCards", JSON.stringify(state));
                            }
                            let resultState = JSON.parse(localStorage.getItem("curCards"));
                            let len1 = resultState.stack1.length;
                            let len2 = resultState.stack2.length;
                            let len3 = resultState.stack3.length;
                            let len4 = resultState.stack4.length;
                            if (len1 === 13 && len2 === 13 && len3 === 13 && len4 === 13) {
                                hashHistory.push("/fireworks");
                            }
                            $.ajax({
                                url: "http://localhost:8080/v1/update",
                                type: "PUT",
                                contentType: "application/json",
                                data: JSON.stringify({state: JSON.parse(localStorage.getItem("curCards"))}),
                                dataType: 'json',
                                success: function () {
                                    console.log("state updated");
                                }
                            });
                        },
                    });


                } else {
                    //highlight the selected card
                    let curImg = $(this);
                    curImg.addClass("selectedIMG");
                    //de-highlight the selected card by clicking the face-down cards
                    $(".down").click(function () {
                        curImg.removeClass("selectedIMG");
                        source = null;
                    });
                    // de-highlight the selected card by press ESC key
                    $(document).keyup(function(e) {
                        if (e.keyCode == 27) { // escape key maps to keycode `27`
                            curImg.removeClass("selectedIMG");
                            source = null;
                        }
                    });
                    let srcSource = $(this).attr("src").split('/');
                    let theCard = srcSource[srcSource.length - 1].split('.');
                    cardInfo = theCard[0].split('_');
                    source = $(this).parent().attr("class").split(" ")[1];
                }
            });
        };
        if (localStorage.getItem('newGame') === 'yes') {
            $.ajax({
                url: "http://localhost:8080/v1/game/shuffle",
                type: "GET",
                data: {"joker": "false"},
                success: function (deck) {
                    gameLogic(deck, {});
                }
            });
        } else {
            $.ajax({
                url: "http://localhost:8080/v1/game/" + localStorage.getItem('gameName'),
                type:"Get",
                success: function (currentState) {
                    gameLogic([], currentState);
                }
            });
        }
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-default">
                    <a className="navbar-brand" href="#">Solitaire</a>
                    <div className="form-inline">
                        <button className="btn btn-success navbar-btn" id="btn-profile" style={{float: "right", marginLeft: 10, marginRight: 15}}>Profile</button>
                    </div>
                    <div className="form-inline">
                        <button className="btn btn-danger navbar-btn" id="btn-start" style={{float: "right"}}>Start new game</button>
                    </div>
                </nav>

                <div id="cardTable">
                    <div id="topCards">
                        <div id="draw">
                            let cards = JSON.parse(localStorage.getItem("curCards"));
                        </div>

                        <div id="discard" className="card-style" style={{border: "none"}}></div>

                        <div id="stack">
                            <div className="card-style" id="stack1" style={{border: "none"}}>
                                <div className="card-style stack1" style={{zIndex: 0, position: "absolute"}}>
                                    <img src="img/heart.jpg" className="up"/>
                                </div>
                            </div>
                            <div className="card-style" id="stack2" style={{border: "none"}}>
                                <div className="card-style stack2" style={{zIndex: 0, position: "absolute"}}>
                                    <img src="img/spade.jpg" className="up"/>
                                </div>
                            </div>
                            <div className="card-style" id="stack3" style={{border: "none"}}>
                                <div className="card-style stack3" style={{zIndex: 0, position: "absolute"}}>
                                    <img src="img/diamond.jpg" className="up"/>
                                </div>
                            </div>
                            <div className="card-style" id="stack4" style={{border: "none"}}>
                                <div className="card-style stack4" style={{zIndex: 0, position: "absolute"}}>
                                    <img src="img/club.jpg" className="up"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="pile">

                    </div>
                </div>
            </div>
        );
    }
}