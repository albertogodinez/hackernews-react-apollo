// link: (parent, args) => {
//   const link = links.find(link => {
//     return link.id === args.id;
//   });
//   return link;
// }

async function feed(root, args, context, info) {
  // the feed filters out those that don't contains
  // the filter string in the description or url
  const where = args.filter
    ? {
        OR: [
          { description_contains: args.filter },
          { url_contains: args.filter }
        ]
      }
    : {};

  const links = await context.prisma.links({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy
  });
  const count = await context.prisma
    // linksConnection querys the prisma client API to retrieve the
    // total number of Link elements currently stored in the database
    .linksConnection({
      where
    })
    .aggregate()
    .count();
  return {
    links,
    count
  };
}

module.exports = {
  feed
};
