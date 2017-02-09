/**
 * Created by 1jiaqi3 on 10/3/2016.
 */
module.exports = function (app) {
    app.get('/v1/game/shuffle', function (req, res) {
        let hasJoker = req.query.joker;
        if (hasJoker === 'false') {
            let shuffleFunc = function (arr) {
                let j, temp, i;
                for (i = arr.length; i; i--) {
                    j = Math.floor(Math.random() * i);
                    temp = arr[i - 1];
                    arr[i - 1] = arr[j];
                    arr[j] = temp;
                }
            };
            let cards = [];
            let suits = ["club", "diamond", "spade", "heart"];
            for (let i = 0; i < suits.length; i++) {
                for (let j = 1; j <= 13; j++) {
                    let newCard = {};
                    newCard.suit = suits[i];
                    newCard.value = j;
                    newCard.up = false;
                    cards.push(newCard);
                }
            }
            shuffleFunc(cards);
            res.json(cards);
        } else {
            res.json([]);
        }
    });
};