import { ModuleOptions } from './module-options.interface'

export interface OptionsFactory {
  createStrongooseOptions(): Promise<ModuleOptions> | ModuleOptions
}