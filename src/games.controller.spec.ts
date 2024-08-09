import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game, GameCell, GameStatus } from './entities';

describe('GamesController', () => {
  let gamesController: GamesController;
  const mockGamesRepository = {
    findOneBy: jest.fn(() => null),
  };

  const mockGameCellsRepository = {
    findOneBy: jest.fn(() => null),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGamesRepository,
        },
        {
          provide: getRepositoryToken(GameCell),
          useValue: mockGameCellsRepository,
        },
      ],
    }).compile();

    gamesController = app.get<GamesController>(GamesController);
  });

  describe('/games', () => {
    it('should return a list of available games', async () => {
      const data = await gamesController.getAll();
      expect(data).toBeDefined();
    });
  });
  describe('/games', () => {
    it('should create and return the created game', async () => {
      const ROWS = 10;
      const COLS = 10;
      const TOTAL_MINES = Math.floor(ROWS * COLS * 0.15); // 15% of the total grid
      const game = await gamesController.create(10, 10);

      const totalGameMine = game.cells.flat().reduce((prev, curr) => {
        if (curr.isMine) {
          return prev + 1;
        }
      }, 0);
      expect(game).toBeDefined();
      expect(game.status).toEqual(GameStatus.Pending);
      expect(game.rows).toEqual(ROWS);
      expect(game.columns).toEqual(COLS);
      expect(totalGameMine).toEqual(TOTAL_MINES);
    });
  });
});
