import React from 'react';
import useHasAccess, { Resource } from '../common/hooks/use-has-access';

type Props = {
  create?: Resource;
  read?: Resource;
  update?: Resource;
  remove?: Resource;
  admin?: Resource;
};

const RequirePermission: React.FC<Props> = ({ create, read, update, remove, admin, children }) => {
  const hasAccess = useHasAccess();

  if (create && hasAccess('create', create)) return <>{children}</>;
  if (read && hasAccess('read', read)) return <>{children}</>;
  if (update && hasAccess('update', update)) return <>{children}</>;
  if (remove && hasAccess('remove', remove)) return <>{children}</>;
  if (admin && hasAccess('admin', admin)) return <>{children}</>;

  return null;
};

export default RequirePermission;
