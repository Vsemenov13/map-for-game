import { format } from 'date-fns';

type FormatDate = (formatString?: string, date?: Date) => string;

/**
 * ### Форматирование даты
 *
 * @param {string} formatString - Строка формата
 * @param {Date} date - Дата
 *
 * @returns {string} Дата в отформатированном виде
 */
export const formatDate: FormatDate = (
  formatString = 'dd.mm.yyyy',
  date = new Date(),
) => format(date, formatString);
