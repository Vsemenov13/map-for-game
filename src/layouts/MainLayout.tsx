import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { Header, Footer } from '@common/components';
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
      <Header />
      <div>
        <main>{errorExist ? <ErrorLayout /> : children}</main>
      </div>
      <Footer />
    </GlobalLoader>
  );
};
