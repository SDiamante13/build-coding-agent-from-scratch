import { describe, it, expect } from 'vitest';
import { BowlingGame } from './game.js';

describe('BowlingGame', () => {
  it('scores a gutter game as 0', () => {
    const game = new BowlingGame();
    for (let i = 0; i < 20; i++) {
      game.roll(0);
    }
    expect(game.score()).toBe(0);
  });

  it('scores all ones as 20', () => {
    const game = new BowlingGame();
    for (let i = 0; i < 20; i++) {
      game.roll(1);
    }
    expect(game.score()).toBe(20);
  });

  it('scores a spare followed by standard rolls correctly', () => {
    const game = new BowlingGame();
    game.roll(5);
    game.roll(5); // spare
    game.roll(3);
    for (let i = 0; i < 17; i++) {
      game.roll(0);
    }
    expect(game.score()).toBe(16);
  });

  it('scores a strike followed by standard rolls correctly', () => {
    const game = new BowlingGame();
    game.roll(10); // strike
    game.roll(3);
    game.roll(4);
    for (let i = 0; i < 16; i++) {
      game.roll(0);
    }
    expect(game.score()).toBe(24);
  });

  it('scores a perfect game (12 strikes) as 300', () => {
    const game = new BowlingGame();
    for (let i = 0; i < 12; i++) {
      game.roll(10);
    }
    expect(game.score()).toBe(300);
  });

  it('scores all spares (21 rolls of 5) as 150', () => {
    const game = new BowlingGame();
    for (let i = 0; i < 21; i++) {
      game.roll(5);
    }
    expect(game.score()).toBe(150);
  });

  it('scores tenth frame spare with bonus ball correctly', () => {
    const game = new BowlingGame();
    for (let i = 0; i < 18; i++) {
      game.roll(0);
    }
    game.roll(4);
    game.roll(6); // spare in 10th frame
    game.roll(5); // bonus roll
    expect(game.score()).toBe(15);
  });

  it('scores tenth frame strike with bonus balls correctly', () => {
    const game = new BowlingGame();
    for (let i = 0; i < 18; i++) {
      game.roll(0);
    }
    game.roll(10); // strike in 10th frame
    game.roll(10); // bonus roll 1
    game.roll(10); // bonus roll 2
    expect(game.score()).toBe(30);
  });

  it('scores a strike in the 10th frame followed by two standard rolls', () => {
    const game = new BowlingGame();
    for (let i = 0; i < 18; i++) {
      game.roll(0);
    }
    game.roll(10); // strike in 10th frame
    game.roll(3);
    game.roll(6);
    expect(game.score()).toBe(19);
  });

  it('scores consecutive strikes (turkey) correctly', () => {
    const game = new BowlingGame();
    game.roll(10); // frame 1: 10 + 10 + 10 = 30
    game.roll(10); // frame 2: 10 + 10 + 0 = 20
    game.roll(10); // frame 3: 10 + 0 + 0 = 10
    for (let i = 0; i < 14; i++) {
      game.roll(0);
    }
    expect(game.score()).toBe(60);
  });

  it('scores a full realistic game correctly', () => {
    const game = new BowlingGame();
    const rolls = [1, 4, 4, 5, 6, 4, 5, 5, 10, 0, 1, 7, 3, 6, 4, 10, 2, 8, 6];
    for (const pins of rolls) {
      game.roll(pins);
    }
    expect(game.score()).toBe(133);
  });
});
