import { ModelClass } from './interfaces/model-class.interface'
import { Connection } from 'mongoose'
import { getModelToken, getConnectionToken } from './strongoose.util'
import { DEFAULT_DB_CONNECTION } from './strongoose.constants'

export function createStrongooseProviders(connectionName: string, models: ModelClass<any>[] = []) {
  const providers = (models || []).map(model => ({
    provide: getModelToken(model.name),
    useFactory: (connection: Connection) => new model().getModel(model, {
      existingConnection: connection
    }),
    inject: [
      connectionName === DEFAULT_DB_CONNECTION
        ? DEFAULT_DB_CONNECTION
        : getConnectionToken(connectionName)
    ]
  }))

  return providers
}