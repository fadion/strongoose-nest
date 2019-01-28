import { Module, DynamicModule } from '@nestjs/common'
import { StrongooseCoreModule } from './strongoose-core.module'
import { createStrongooseProviders } from './strongoose.providers'
import { ModelClass } from './interfaces/model-class.interface'
import { ModuleAsyncOptions } from './interfaces/module-async-options.interface'
import { ModuleOptions } from './interfaces/module-options.interface'
import { DEFAULT_DB_CONNECTION } from './strongoose.constants'

@Module({})
export class StrongooseModule {
  static forRoot(uri: string, options: ModuleOptions): DynamicModule {
    return {
      module: StrongooseModule,
      imports: [StrongooseCoreModule.forRoot(uri, options)]
    }
  }

  static forRootAsync(options: ModuleAsyncOptions): DynamicModule {
    return {
      module: StrongooseModule,
      imports: [StrongooseCoreModule.forRootAsync(options)],
    }
  }

  static forFeature(models: ModelClass<any>[], connectionName: string = DEFAULT_DB_CONNECTION): DynamicModule {
    const providers = createStrongooseProviders(connectionName, models)
    return {
      module: StrongooseModule,
      providers,
      exports: providers
    }
  }
}