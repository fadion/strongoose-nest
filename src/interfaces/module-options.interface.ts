export interface ModuleOptions {
  [key: string]: any
  retryAttempts?: number
  retryDelay?: number
  connectionName?: string
}