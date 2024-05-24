export default function getPageInfo(count, page, totalItemPage = 10) {
  const totalPage = Math.floor(count / totalItemPage);
  return {
    currentPage: page,
    totalPages: totalPage,
    totalItems: count,
    hasNextPage: page === totalPage ? false : true,
    hasPreviousPage: page === 0 ? false : true,
  };
}
