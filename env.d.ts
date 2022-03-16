declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_DOMAIN: string
    }
  }
}

export {}