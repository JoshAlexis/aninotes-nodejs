const paginated = ({
  page,
  limit,
  startIndex,
  endIndex,
  items,
  total,
  url,
}) => {
  const results = {};

  results.total = total;
  results.isLast = false;

  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
      size: limit,
      link: `api/${url}/?page=${page - 1}&limit=${limit}`,
    };
  } else {
    results.prev = null;
  }

  if (endIndex <= total) {
    results.next = {
      page: page + 1,
      size: limit,
      link: `api/${url}/?page=${page + 1}&limit=${limit}`,
    };
  } else {
    results.next = null;
  }

  if (results.next === null) results.isLast = true;

  results.data = items;

  return results;
};

module.exports = paginated;
