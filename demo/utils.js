/* @flow */

import type { TypeComposer } from 'graphql-compose';
import fetch from 'node-fetch';

export function createFindByIdResolver(tc: TypeComposer, urlAddr: string): void {
  tc.addResolver({
    name: 'findById',
    type: tc,
    args: {
      id: 'Int!',
    },
    resolve: rp => {
      return fetch(`https://swapi.co/api/${urlAddr}/${rp.args.id}/`).then(r => r.json());
    },
  });
}

export function createFindListByPageNumberResolver(tc: TypeComposer, urlAddr: string): void {
  tc.addResolver({
    name: 'findListByPageNumber',
    type: [tc],
    args: {
      page: 'Int!',
    },
    resolve: rp => {
      return fetch(`https://swapi.co/api/${urlAddr}/?page=${rp.args.page}`).then(r =>
        r.json().then(json => json.results)
      );
    },
  });
}

export function createFindByUrlListResolver(tc: TypeComposer): void {
  tc.addResolver({
    name: 'findByUrlList',
    type: [tc],
    args: {
      urls: '[String]!',
    },
    resolve: rp => {
      return Promise.all(rp.args.urls.map(url => fetch(url).then(r => r.json())));
    },
  });
}
