# `game.service.ts`

- `createGameGrid`: 
  - This method generates a 2D game grid based on `rows` and `cols`.
  - Then it calculate the total number of mines (by default is 15% of total cells).
  - Then randomly place the mines into random cells. For every mine placed, it increment the `neighboringBombCount` field of the adjacent cells.

- `saveGame`: This method call the `createGameGrid` method to create a game grid and save to the `games` and `game_cells` tables.

- `findAllGames`: This method find all the games that can be filtered by game status.

- `findOneGame`: This method find one game by game id.

# `games.controller.ts`

- `GET /games`: get all the games, can be filtered by status. For example `GET /games?status=PENDING`

- `POST /games`: create a new game, takes in `rows` and `cols` in body. Return the created game.


Note: This implementation does not handle updating the cell yet as it is not required