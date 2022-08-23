import { getKickback } from './kickback-calculator';

describe('kickback', () => {
  test('should be max 50 points if >= 500', () => {
    expect(getKickback(500)).toEqual(50);
    expect(getKickback(550)).toEqual(50);
    expect(getKickback(1000)).toEqual(50);
    expect(getKickback(10000)).toEqual(50);
  });

  test('should return 10% of input if <= 500', () => {
    expect(getKickback(100)).toEqual(10);
    expect(getKickback(10)).toEqual(1);
    expect(getKickback(490)).toEqual(49);
  });

  test('should floor numbers', () => {
    expect(getKickback(55)).toEqual(5);
    expect(getKickback(11)).toEqual(1);
    expect(getKickback(127)).toEqual(12);
  });
});
