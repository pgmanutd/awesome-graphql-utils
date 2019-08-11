const _isError = require('lodash/fp/isError');

const getLastResolverValue = async (resolvers, args) => {
  let lastResolvedValue;

  for (const resolver of resolvers) {
    lastResolvedValue = await resolver(...args, lastResolvedValue);

    if (_isError(lastResolvedValue)) {
      break;
    }
  }

  return lastResolvedValue;
};

const composeResolvers = (fields, resolvers = []) =>
  Object.keys(fields).reduce(
    (enhancedFields, field) => ({
      ...enhancedFields,
      [field]: {
        ...fields[field],
        resolve: async (...args) => {
          const lastResolvedValue = await getLastResolverValue(resolvers, args);

          if (_isError(lastResolvedValue)) {
            return lastResolvedValue;
          }

          return await fields[field].resolve(...args, lastResolvedValue);
        },
      },
    }),
    {},
  );

module.exports = composeResolvers;
