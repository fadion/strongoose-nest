import { Inject } from '@nestjs/common'
import { Strongoose } from 'strongoose'
import { ModelClass } from '../interfaces/model-class.interface'
import { getModelToken } from '../strongoose.util'

export const InjectModel = <T extends Strongoose>(model: ModelClass<T>) =>
  Inject(getModelToken(model.name))