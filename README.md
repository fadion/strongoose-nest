# Strongoose NestJS Module

A module for integrating [Strongoose](https://github.com/fadion/strongoose) models into NestJS. The implementation is completely based on [@nestjs/mongoose](https://github.com/nestjs/mongoose/).

Strongoose builds Mongoose models using Typescript classes and a few decorators.

## Installation

Before installing, make sure you have [NestJS](https://github.com/nestjs/nest), [Mongoose](https://www.npmjs.com/package/mongoose) and [Reflect Metadata](https://www.npmjs.com/package/reflect-metadata) installed, all listed as `peerDependencies`.

```
$ npm install --save strongoose-nest
```

## Usage

If you've ever used Mongoose in nest, this should feel pretty familiar. In changes in very few details.

First make the connection to the database in your main module (usually `app.module.ts`):

```typescript
import { Module } from '@nestjs/common'
import { StrongooseModule } from '@strongoose'

@Module({
  imports: [StrongooseModule.forRoot('mongodb://localhost:27017/strongoose', { useNewUrlParser: true })]
})
export class ApplicationModule {}
```

Create a Strongoose model class:

```typescript
import { Strongoose, field } from 'strongoose'

export class Cat extends Strongoose {
  @field()
  name: string
}
```

Supposing there's a `CatModule` that handles cat stuff, import the new model:

```typescript
import { Module } from '@nestjs/common'
import { StrongooseModule } from '@strongoose'
import { Cat } from './models/cat.model.ts'
import { CatService } from './services/cat.service.ts'

@Module({
  imports: [StrongooseModule.forFeature(Cat)],
  providers: [CatService]
})
export class CatModule {}
```

Finally, inject the model as a dependency into the service. This could very well be a repository or any patterns you're using:

```typescript
export class CatService {
  constructor(
    @InjectModel(Cat) private readonly cat: ModelType<Cat>
  ) {}

  async findById(id: string) {
    return await this.cat.findById(id).exec()
  }
}
```