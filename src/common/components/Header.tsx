import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Шапка приложения
 * @returns - Компонент
 */
export const Header: React.FC = () => (
  <header className="app-header">
    <nav className="app-header__nav">
      <Link to="/" className="app-header__link">
        Карта
      </Link>
    </nav>
  </header>
);
