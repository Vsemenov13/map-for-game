/** Имена лоадеров в приложении. */
export enum Loader {
  Global = 'Global',
  GetPlaceImages = 'GetPlaceImages',
}

/** Состояние фичи loading: флаги по имени лоадера. */
export type LoadingState = Partial<Record<Loader, boolean>>;

/** Аргумент для useLoading: один лоадер или массив. */
export type LoaderPayload = Loader | Loader[];
