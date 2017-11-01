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

We have a [Live demo](https://graphql-compose-swapi.herokuapp.com/?query=%7B%0A%20%20person(id%3A%201)%20%7B%0A%20%20%20%20name%0A%20%20%20%20films%20%7B%0A%20%20%20%20%20%20title%0A%20%20%20%20%20%20release_date%0A%20%20%20%20%20%20director%0A%20%20%20%20%7D%0A%20%20%20%20homeworld%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20climate%0A%20%20%20%20%20%20diameter%0A%20%20%20%20%7D%0A%20%20%20%20starships%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20cost_in_credits%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A) (source code [repo](https://github.com/lyskos97/graphql-compose-swapi)) which shows how to build an API upon [SWAPI](https://swapi.co) using `graphql-compose-rest`.

### Installation

```bash
npm install graphql graphql-compose graphql-compose-rest --save
```

Modules `graphql`, `graphql-compose`, are located in `peerDependencies`, so they should be installed explicitly in your app. They have global objects and should not have ability to be installed as submodule.

### Examples

You have a sample response object:

```js
const restApiResponse = {
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

which you can pass to `graphql-compose-rest` along with desired type name as your first argument and it will automtically generate a `GraphQL` type:

```js
const PersonTC = composeWithRest('Person', responseFromRestApi);
```

#### Schema building

Now when you have your type built, you may specify the schema and data fetching method:

```js
GQC.rootQuery().addFields({
  person: {
    type: PersonTC,
    args: {
      id: `Int!`, // equals to `new GraphQLNonNull(GraphQLInt)`
    },
    resolve: (_, args) => fetch(`https://swapi.co/api/people/${args.id}/`).then(r => r.json()),
  },
}

export const schema = GQC.buildSchema();
```

## Customization

You can write custom field configs directly to a field of your API response object:

```js
const restApiResponse = {
  name: 'Anakin Skywalker',
  birth_year: '41.9BBY',
  starships: [
    'https://swapi.co/api/starships/59/',
    'https://swapi.co/api/starships/65/',
    'https://swapi.co/api/starships/39/',
  ],
  starships_count: () => ({
    type: 'Int',
    resolve: source => source.starships.length,
  }),
};
```

Moreover, `graphql-compose` allows you to pass pre-defined resolvers of other types to the response object and customize them:

```js
const restApiResponse = {
  name: 'Anakin Skywalker',
  starships: () =>
    PeopleTC.getResolver('findByUrlList') // resolves an array of URLs
      .wrapResolve(next => rp => {
        const starshipsUrls = rp.source.starships;
        rp.args.urls = starshipsUrls;
        return next(rp);
      })
      .removeArg('urls'), // wrap your pre-defined resolver with custom logic and remove args which are unnecessary
  };
}
```

### Further customization with `graphql-compose`

In case you need to separate custom field definition from your response object there are `graphql-compose` methods made for this purpose.

If you want to specify new fields of your type, simply use the `addFields` method of `graphql-compose`:

```js
PersonTC.addFields({
  vehicles_count: {
    type: GraphQLString, // standard GraphQL field definition notation
    resolve: (source) => source.vehicles.length,
  },
});
```

When you want to create a relation with another type simply use `addRelation` method of `graphql-compose`:

```js
PersonTC.addRelation('filmObjects', {
  resolver: () => FilmTC.getResolver('findByUrlList'),
  prepareArgs: {
    urls: source => source.films,
  },
});
```

`graphql-compose` provides a vast variety of methods for `fields` and `resolvers` (aka field configs in vanilla `GraphQL`) management of `GraphQL` types. To learn more visit [graphql-compose repo](https://github.com/nodkz/graphql-compose).

## License

[MIT](https://github.com/graphql-compose/graphql-compose-rest/blob/master/LICENSE.md)
