const { getPaginationOptions } = require('./pagination-helper');

describe('getPaginationOptions', () => {
  test('should parse skip from query', () => {
    const req = { query: { skip: 10, take: 5 } };
    const [skip, take] = getPaginationOptions(req);
    expect(skip).toBe(10);
  });

  test('should parse take from query', () => {
    const req = { query: { skip: 30, take: 15 } };
    const [skip, take] = getPaginationOptions(req);
    expect(take).toBe(15);
  });

  test('should parse skip and take from query', () => {
    const req = { query: { skip: 18, take: 9 } };
    const [skip, take] = getPaginationOptions(req);
    expect(skip + take).toBe(27);
  });

  test('should not allow skip lower than 0', () => {
    const req = { query: { skip: -1, take: 10 } };
    const [skip, take] = getPaginationOptions(req);
    expect(skip).toBe(0);
  });

  test('should not allow take lower than 1', () => {
    const req = { query: { skip: 10, take: 0 } };
    const [skip, take] = getPaginationOptions(req);
    expect(take).toBe(1);
  });

  test('should not allow take larger than 50', () => {
    const req = { query: { skip: 200, take: 100 } };
    const [skip, take] = getPaginationOptions(req);
    expect(take).toBe(50);
  });

  test('should reduce take to be a multiplier of skip', () => {
    const req = { query: { skip: 30, take: 100 } };
    const [skip, take] = getPaginationOptions(req);
    expect(take).toBe(30);
  });

  test('should increase take to be a multiplier of skip', () => {
    const req = { query: { skip: 27, take: 8 } };
    const [skip, take] = getPaginationOptions(req);
    expect(take).toBe(9);
  });

  test('should be able to get one item', () => {
    const req = { query: { skip: 0, take: 1 } };
    const [skip, take] = getPaginationOptions(req);
    expect(take).toBe(1);
  });
});