import { ModuleMetadata, Type } from '@nestjs/common/interfaces'
import { OptionsFactory } from './options-factory.interface'
import { ModuleOptions } from './module-options.interface'

export interface ModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  connectionName?: string
  useExisting?: Type<OptionsFactory>
  useClass?: Type<OptionsFactory>
  useFactory?: (...args: any[]) => Promise<ModuleOptions> | ModuleOptions
  inject?: any[]
}