import { GetHighscoreService } from '.';
import { IContext } from '../..';

describe('kickback', () => {
  test('should be max 50 points if >= 500', () => {
    const service = new GetHighscoreService({} as IContext);
    expect(service.getKickback(500)).toEqual(50);
    expect(service.getKickback(550)).toEqual(50);
    expect(service.getKickback(1000)).toEqual(50);
    expect(service.getKickback(10000)).toEqual(50);
  });

  test('should return 10% of input if <= 500', () => {
    const service = new GetHighscoreService({} as IContext);
    expect(service.getKickback(100)).toEqual(10);
    expect(service.getKickback(10)).toEqual(1);
    expect(service.getKickback(490)).toEqual(49);
  });

  test('should floor numbers', () => {
    const service = new GetHighscoreService({} as IContext);
    expect(service.getKickback(55)).toEqual(5);
    expect(service.getKickback(11)).toEqual(1);
    expect(service.getKickback(127)).toEqual(12);
  });
});
