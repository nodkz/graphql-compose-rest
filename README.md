# graphql-compose-rest

[![travis build](https://img.shields.io/travis/graphql-compose/graphql-compose-rest.svg)](https://travis-ci.org/graphql-compose/graphql-compose-rest)
[![codecov coverage](https://img.shields.io/codecov/c/github/graphql-compose/graphql-compose-rest.svg)](https://codecov.io/github/graphql-compose/graphql-compose-rest)
[![](https://img.shields.io/npm/v/graphql-compose-rest.svg)](https://www.npmjs.com/package/graphql-compose-rest)
[![npm](https://img.shields.io/npm/dt/graphql-compose-rest.svg)](http://www.npmtrends.com/graphql-compose-rest)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Greenkeeper badge](https://badges.greenkeeper.io/graphql-compose/graphql-compose-rest.svg)](https://greenkeeper.io/)

This is a plugin for [graphql-compose](https://github.com/nodkz/graphql-compose), which derives GraphQLType from REST response. Also derives bunch of internal GraphQL Types.

## Getting started

### Demo

We have a [Live demo app](https://graphql-compose-swapi.herokuapp.com) which shows how to build an API upon [SWAPI](https://swapi.co) using `graphql-compose-rest`.

[Demo repo](https://github.com/lyskos97/graphql-compose-rest).

You can run it using:

```js
npm run demo
```

### Installation

```bash
npm install graphql graphql-compose graphql-compose-rest --save
```

Modules `graphql`, `graphql-compose`, are located in `peerDependencies`, so they should be installed explicitly in your app. They have global objects and should not have ability to be installed as submodule.

### Examples

We have a sample response object:

```js
const responseFromRestApi = {
  name: 'Anakin Skywalker',
  birth_year: '41.9BBY',
  gender: 'male',
  homeworld: 'https://swapi.co/api/planets/1/',
  films: [
    'https://swapi.co/api/films/5/',
    'https://swapi.co/api/films/4/',
    'https://swapi.co/api/films/6/',
  ],
  species: ['https://swapi.co/api/species/1/'],
  starships: [
    'https://swapi.co/api/starships/59/',
    'https://swapi.co/api/starships/65/',
    'https://swapi.co/api/starships/39/',
  ],
};
```

which we pass to a `composeWithRest` function of `graphql-compose-rest` along with desired type name as first argument in order to generate a `GraphQL` type:

```js
const PersonTC = composeWithRest('Person', responseFromRestApi);
```

### Customization

If you want to specify new fields for your type, just use the `addField` function of `TypeComposer` type of `graphql-compose`:

```js
PersonTC.addFields({
  weapon: { // standard GraphQL field definition
    type: GraphQLString,
    resolve: (source) => source.name.toUpperCase(),
  },
});
```

You may also pass custom `field configs` directly to your API response object:

```js
const restApiResponse = {
  title: 'New Hope',
  episode_id: 4,
  planets: () => ({
    type: 'Int',
    resolve: source => source.planets.length,
  }),
};
```

Moreover, we can pass there our pre-defined resolvers of other types and customize them:
```js
const restApiResponse = {
  title: 'New Hope',
  episode_id: 4,
  characters: () =>
    PeopleTC.getResolver('findByUrlList')
      .wrapResolve(next => rp => {
        const characterUrls = rp.source.characters;
        rp.args.urls = characterUrls;
        return next(rp);
      })
      .removeArg('urls'),
  };
}
```

In case you want to create a relation with another type simply use `addRelation` function of `TypeComposer`:

```js
PersonTC.addRelation('filmObjects', { // uses shortened syntax
  resolver: () => FilmTC.getResolver('findByUrlList'),
  prepareArgs: { // you're free to define `resolve` the way you want
    urls: source => source.films,
  },
});
```

`graphql-compose` provides a vast variety of methods for types' `fields` and `resolvers` (aka `field configs` in vanilla `GraphQL`) management. To learn more visit [graphql-compose repo](https://github.com/nodkz/graphql-compose).

## License

[MIT](https://github.com/graphql-compose/graphql-compose-rest/blob/master/LICENSE.md)
