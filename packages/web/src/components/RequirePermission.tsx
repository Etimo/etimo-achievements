import React from 'react';
import useHasAccess, { Resource } from '../common/hooks/use-has-access';
import useHasScope from '../common/hooks/use-has-scope';

type Props = {
  create?: Resource;
  read?: Resource;
  update?: Resource;
  remove?: Resource;
  admin?: Resource;
  scope?: string;
};

const RequirePermission: React.FC<Props> = ({ create, read, update, remove, admin, scope, children }) => {
  const hasAccess = useHasAccess();
  const hasScope = useHasScope();

  if (create && hasAccess('create', create)) return <>{children}</>;
  if (read && hasAccess('read', read)) return <>{children}</>;
  if (update && hasAccess('update', update)) return <>{children}</>;
  if (remove && hasAccess('remove', remove)) return <>{children}</>;
  if (admin && hasAccess('admin', admin)) return <>{children}</>;
  if (scope && hasScope(scope)) return <>{children}</>;

  return null;
};

export default RequirePermission;
