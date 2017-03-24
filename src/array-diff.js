const EDIT_LEAVE = 0;
const EDIT_UPDATE = 1;
const EDIT_ADD = 2;
const EDIT_DELETE = 3;


// Diffs two arrays returning an array of splices. A splice object looks like:
// ```javascript
// {
//   index: 3,
//   removed: [item, item],
//   addedCount: 0
// }
// ```
export default function arrayDiff(value, oldValue) {
  if (!Array.isArray(value) || !Array.isArray(oldValue)) {
    throw new TypeError('Both values for array.diff must be arrays');
  }

  let currentStart = 0;
  let currentEnd = value.length;
  let oldStart = 0;
  let oldEnd = oldValue.length;

  let minLength = Math.min(currentEnd, oldEnd);
  let prefixCount = sharedPrefix(value, oldValue, minLength);
  let suffixCount = sharedSuffix(value, oldValue, minLength - prefixCount);

  currentStart += prefixCount;
  oldStart += prefixCount;
  currentEnd -= suffixCount;
  oldEnd -= suffixCount;

  if (currentEnd - currentStart === 0 && oldEnd - oldStart === 0) {
    return [];
  }

  // if nothing was added, only removed from one spot
  if (currentStart === currentEnd) {
    return [ new Splice(value, currentStart, oldValue.slice(oldStart, oldEnd), 0) ];
  }

  // if nothing was removed, only added to one spot
  if (oldStart === oldEnd) {
    return [ new Splice(value, currentStart, [], currentEnd - currentStart) ];
  }

  // a mixture of adds and removes
  let distances = calcEditDistances(value, currentStart, currentEnd, oldValue, oldStart, oldEnd);
  let ops = spliceOperationsFromEditDistances(distances);

  let splice = null;
  let splices = [];
  let index = currentStart;
  let oldIndex = oldStart;

  for (let i = 0, l = ops.length; i < l; i++) {
    let op = ops[i];
    if (op === EDIT_LEAVE) {
      if (splice) {
        splices.push(splice);
        splice = null;
      }

      index++;
      oldIndex++;
    } else if (op === EDIT_UPDATE) {
      if (!splice) {
        splice = new Splice(value, index, [], 0);
      }

      splice.addedCount++;
      index++;

      splice.removed.push(oldValue[oldIndex]);
      oldIndex++;
    } else if (op === EDIT_ADD) {
      if (!splice) {
        splice = new Splice(value, index, [], 0);
      }

      splice.addedCount++;
      index++;
    } else if (op === EDIT_DELETE) {
      if (!splice) {
        splice = new Splice(value, index, [], 0);
      }

      splice.removed.push(oldValue[oldIndex]);
      oldIndex++;
    }
  }

  if (splice) {
    splices.push(splice);
  }

  return splices;
}




// find the number of items at the beginning that are the same
function sharedPrefix(current, old, searchLength) {
  for (let i = 0; i < searchLength; i++) {
    if (diffBasic(current[i], old[i])) {
      return i;
    }
  }
  return searchLength;
}


// find the number of items at the end that are the same
function sharedSuffix(current, old, searchLength) {
  var index1 = current.length;
  var index2 = old.length;
  var count = 0;
  while (count < searchLength && !diffBasic(current[--index1], old[--index2])) {
    count++;
  }
  return count;
}


function spliceOperationsFromEditDistances(distances) {
  let i = distances.length - 1;
  let j = distances[0].length - 1;
  let current = distances[i][j];
  let edits = [];
  while (i > 0 || j > 0) {
    if (i === 0) {
      edits.push(EDIT_ADD);
      j--;
      continue;
    }

    if (j === 0) {
      edits.push(EDIT_DELETE);
      i--;
      continue;
    }

    let northWest = distances[i - 1][j - 1];
    let west = distances[i - 1][j];
    let north = distances[i][j - 1];
    let min;

    if (west < north) {
      min = west < northWest ? west : northWest;
    } else {
      min = north < northWest ? north : northWest;
    }

    if (min === northWest) {
      if (northWest === current) {
        edits.push(EDIT_LEAVE);
      } else {
        edits.push(EDIT_UPDATE);
        current = northWest;
      }
      i--;
      j--;
    } else if (min === west) {
      edits.push(EDIT_DELETE);
      i--;
      current = west;
    } else {
      edits.push(EDIT_ADD);
      j--;
      current = north;
    }
  }
  edits.reverse();
  return edits;
}


function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
  // "Deletion" columns
  let rowCount = oldEnd - oldStart + 1;
  let columnCount = currentEnd - currentStart + 1;
  let distances = new Array(rowCount);
  let i, j;

  // "Addition" rows. Initialize null column.
  for (i = 0; i < rowCount; i++) {
    distances[i] = new Array(columnCount);
    distances[i][0] = i;
  }

  // Initialize null row
  for (j = 0; j < columnCount; j++) {
    distances[0][j] = j;
  }

  for (i = 1; i < rowCount; i++) {
    for (j = 1; j < columnCount; j++) {
      if (!diffBasic(current[currentStart + j - 1], old[oldStart + i - 1])) {
        distances[i][j] = distances[i - 1][j - 1];
      } else {
        let north = distances[i - 1][j] + 1;
        let west = distances[i][j - 1] + 1;
        distances[i][j] = north < west ? north : west;
      }
    }
  }

  return distances;
}
