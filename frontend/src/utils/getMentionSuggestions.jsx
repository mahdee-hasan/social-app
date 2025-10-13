import getFriends from "@/services/getFriends";

export const getMentionSuggestions = async (text) => {
  // Look for the last "@" with some word characters after it
  const match = text.match(/@(\w*)$/);
  if (!match) return [];

  const query = match[1].toLowerCase();
  const findFriends = await getFriends();
  const { friends } = findFriends.friends;
  return {
    person: friends.filter((n) => n.name.toLowerCase().includes(query)),
    query,
  };
};
