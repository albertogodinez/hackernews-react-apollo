async function feed(root, args, context, info) {
  const { filter, first, skip } = args; // destructure input arguments

  // A link is only returned if either its url contains the provided filter
  // OR
  // its description contains the provided filter
  const where = filter
    ? { OR: [{ url_contains: filter }, { description_contains: filter }] }
    : {};

  const queriedLinks = await ctx.db.query.links({ first, skip, where });

  return {
    linkIds: queriedLinks.map(link => link.id),
    count
  };
}

module.exports = {
  feed
};
