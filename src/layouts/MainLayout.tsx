import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import {
  ErrorLayout,
  selectors as errorSelectors,
} from '@common/features/errors';
import { GlobalLoader } from '@common/features/loading';

type LayoutProp = {
  children: ReactNode | ReactNode[];
};

/**
 * Базовый макет страницы
 * @returns - Компонент
 */
export const MainLayout: React.FC<LayoutProp> = ({ children }) => {
  const errorExist = useSelector(errorSelectors.isErrorExist);

  return (
    <GlobalLoader>
      <div>
        <main>{errorExist ? <ErrorLayout /> : children}</main>
      </div>
    </GlobalLoader>
  );
};
