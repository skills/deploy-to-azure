import Game from "./game.js";

let p1, p2;
while (!p1) {
  p1 = window.prompt("Who is player 1?");
}

while (!p2 && p1 !== p2) {
  p2 = window.prompt(
    p1 === p2 ? `Please enter a different name than ${p1}.` : "Who is player 2?"
  );
}

window.onload = () => {
  document.getElementById("p1Name").innerText = p1;
  document.getElementById("p2Name").innerText = p2;
  let score1 = 0;
  let score2 = 0;

  (function playGame(p1, p2) {
    document.getElementById("win").style.display = "none";
    document.getElementById("turn").style.display = "inline";
    document.getElementById("p1Score").innerText = score1;
    document.getElementById("p2Score").innerText = score2;

    const game = new Game(p1, p2);
    const player = document.getElementById("player");
    player.innerText = game.player;

    document.querySelectorAll("#tictactoe td").forEach((el) => {
      el.innerText = "";
      el.onclick = (evt) => {
        el.onclick = undefined;
        evt.target.innerText = game.sym;
        evt.target.onclick = undefined;

        const [row, col] = evt.target.classList;
        game.turn(row, col);

        if (game.hasWinner()) {
          document.getElementById("winner").innerText = game.player;
          document.getElementById("win").style.display = "inline";
          document.getElementById("turn").style.display = "none";

          if (game.player === p1) {
            document.getElementById("p1Score").innerText = ++score1;
          } else {
            document.getElementById("p2Score").innerText = ++score2;
          }

          document.getElementById("newGame").style.display = "inline";
          document.getElementById("newGame").onclick = () => playGame(p1, p2);

          document.querySelectorAll("td").forEach((el) => {
            el.onclick = undefined;
          });
        } else {
          game.nextPlayer();
          player.innerText = game.player;
        }
      };
    });
  })(p1, p2);
};
