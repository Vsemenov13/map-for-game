const createConfig = () => ({
  modules: {
    errors: 'errors' as const,
    loading: 'loading' as const,
    router: 'router' as const,
  },
  environment: process.env.NODE_ENV,
});

/** Конфигурация приложения */
export const config: Readonly<ReturnType<typeof createConfig>> = createConfig();
