export function getPaginationOptions(req: any, max: number = 50) {
  let skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0;
  skip = Math.max(skip, 0);

  let take = req.query.take ? parseInt(req.query.take as string, 10) : 10;
  take = Math.min(take, max);
  take = Math.max(1, take);

  if (skip > 0) {
    take = Math.min(skip, take);
    if (skip % take !== 0) {
      take = skip / (skip % take);
    }
  }

  return [skip, take];
}
