/* @flow */

const composeWithRest = () => {
  throw new Error(
    `This package was deprecated in favor of better naming graphql-compose-json.` +
      `Please run following commands:` +
      `   yarn remove graphql-compose-rest` +
      `   yarn install graphql-compose-json`
  );
};

export default composeWithRest;
export { composeWithRest };
