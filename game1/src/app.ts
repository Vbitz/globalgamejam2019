import {Game} from './Game';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game(document);

  game.run();
});