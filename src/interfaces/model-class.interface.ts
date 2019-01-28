import { Strongoose } from 'strongoose'

export interface ModelClass<T extends Strongoose> {
  new(...args: any[]): T
}