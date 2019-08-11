const _pathOr = require('lodash/fp/pathOr');

const getFieldsProjection = (fieldNodes, depth = 10) => {
    const selections = _pathOr(null, 'selectionSet.selections', fieldNodes);

    if (!Array.isArray(selections)) {
      return [];
    }

    if (depth < 0) {
      throw new RangeError('Nesting too deep. Please do something about it.');
    }

    return selections.reduce((projections, selection) => {
      const {
        name: { value },
      } = selection;

      return [
        ...projections,
        value,
        ...getFieldsProjection(selection, depth - 1),
      ];
    }, []);
};

module.exports = getFieldsProjection;
