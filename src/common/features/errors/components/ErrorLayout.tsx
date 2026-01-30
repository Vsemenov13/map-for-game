import React from 'react';
import { useSelector } from 'react-redux';

import { selectors } from '../selectors';

export const ErrorLayout: React.FC = () => {
  const title = useSelector(selectors.errorTitle);
  const message = useSelector(selectors.errorMessage);
  const code = useSelector(selectors.errorCode);

  return (
    <div className="error-layout">
      <div className="error-layout__card">
        <div className="error-layout__icon" aria-hidden>
          !
        </div>
        <h1 className="error-layout__title">{title}</h1>
        <p className="error-layout__message">
          {code ? `${code} — ${message}` : message}
        </p>
      </div>
    </div>
  );
};
