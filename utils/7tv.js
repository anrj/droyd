async function query7TV(query, variables = {}) {
	const response = await fetch('https://7tv.io/v4/gql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	});

	return response.json();
}

const searchQuery =
`
  query searchEmote($query: String!) {
  emotes {
    search(
      query: $query
      sort: {sortBy: TOP_ALL_TIME, order: DESCENDING}
      page: 1
      perPage: 1
    ) {
      items {
        id
      }
    }
  }
}
`;

export async function getEmoteURL(name, size) {
	const response = await query7TV(searchQuery, { query: name });
	if (response?.data?.emotes?.search?.items?.length > 0) {
		const id = response.data.emotes.search.items[0].id;
		return `[name](https://cdn.7tv.app/emote/${id}/${size}.webp)`;
	}
	else {
		return 'No emote found';
	}
};
