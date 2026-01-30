import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import {
  ErrorLayout,
  selectors as errorSelectors,
} from '@common/features/errors';
import { GlobalLoader } from '@common/features/loading';

/** URL фонового изображения для всех страниц (заблюренное). */
const LAYOUT_BACKGROUND = '/background.jpg';

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
      <div className="main-layout">
        <div
          className="main-layout__bg"
          style={{ backgroundImage: `url(${LAYOUT_BACKGROUND})` }}
          aria-hidden
        />
        <main className="main-layout__content">
          {errorExist ? <ErrorLayout /> : children}
        </main>
      </div>
    </GlobalLoader>
  );
};
