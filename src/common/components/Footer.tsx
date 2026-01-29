import React from 'react';

import packageData from '@packageSrc';

/**
 * Подвал приложения
 * @returns - Компонент
 */
export const Footer: React.FC = () => (
  <footer>
    <div>
      Версия приложения:&nbsp;
      {packageData.version}
    </div>
  </footer>
);
