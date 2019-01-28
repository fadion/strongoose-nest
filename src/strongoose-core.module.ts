import * as mongoose from 'mongoose'
import { Global, Module, DynamicModule, Provider } from '@nestjs/common'
import { createConnection } from 'mongoose'
import { ModuleAsyncOptions } from './interfaces/module-async-options.interface'
import { ModuleOptions } from './interfaces/module-options.interface'
import { OptionsFactory } from './interfaces/options-factory.interface'
import { defer } from 'rxjs'
import { handleRetry, getConnectionToken } from './strongoose.util'
import { DEFAULT_DB_CONNECTION, STRONGOOSE_CONNECTION_NAME, STRONGOOSE_MODULE_OPTIONS } from './strongoose.constants'

@Global()
@Module({})
export class StrongooseCoreModule {
  static forRoot(uri: string, options: ModuleOptions): DynamicModule {
    const {
      retryAttempts,
      retryDelay,
      connectionName,
      ...mongooseOptions
    } = options

    const mongooseConnectionName = connectionName
      ? getConnectionToken(connectionName)
      : DEFAULT_DB_CONNECTION

    const mongooseConnectionNameProvider = {
      provide: STRONGOOSE_CONNECTION_NAME,
      useValue: mongooseConnectionName
    }

    const connectionProvider = {
      provide: mongooseConnectionName,
      useFactory: async (): Promise<any> =>
        await defer(async () =>
          mongoose.createConnection(uri, mongooseOptions as any)
        )
        .pipe(handleRetry(retryAttempts, retryDelay))
        .toPromise()
    }

    return {
      module: StrongooseCoreModule,
      providers: [connectionProvider, mongooseConnectionNameProvider],
      exports: [connectionProvider]
    }
  }

  static forRootAsync(options: ModuleAsyncOptions): DynamicModule {
    const mongooseConnectionName = options.connectionName
      ? getConnectionToken(options.connectionName)
      : DEFAULT_DB_CONNECTION

    const mongooseConnectionNameProvider = {
      provide: STRONGOOSE_CONNECTION_NAME,
      useValue: mongooseConnectionName,
    }

    const connectionProvider = {
      provide: mongooseConnectionName,
      useFactory: async (strongooseOptions: ModuleOptions): Promise<any> => {
        const {
          retryAttempts,
          retryDelay,
          connectionName,
          ...mongooseOptions
        } = strongooseOptions

        return await defer(async () =>
          mongoose.createConnection(strongooseOptions.uri, mongooseOptions as any)
        )
        .pipe(handleRetry(retryAttempts, retryDelay))
        .toPromise()
      },
      inject: [STRONGOOSE_MODULE_OPTIONS]
    }

    const asyncProviders = this.createAsyncProviders(options)

    return {
      module: StrongooseCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        connectionProvider,
        mongooseConnectionNameProvider
      ],
      exports: [connectionProvider]
    }
  }

  private static createAsyncProviders(options: ModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory)
      return [this.createAsyncOptionsProvider(options)]
    
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      }
    ]
  }

  private static createAsyncOptionsProvider(options: ModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: STRONGOOSE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }
    
    return {
      provide: STRONGOOSE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: OptionsFactory) =>
        await optionsFactory.createStrongooseOptions(),
      inject: [options.useExisting || options.useClass],
    }
  }
}