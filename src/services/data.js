import {randomUUID, createHash, randomInt} from "crypto";

const users = [
  {
    id: "jdpst",
  },
  {
    id: "ojedarob",
  },
  {
    id: "andzdroid",
  }
];

export const userData = ({
  getById: async (id) => users.find(user => user.id === id),
  getAll: async () => users
})

const createCommit = ({message, userId}) => {
  const id = randomUUID();
  const sha = createHash("sha256").update(id).digest("hex");
  const short = sha.slice(0, 7);
  return {id, sha, short, message, userId};
};

const commits = Array(20).fill(0).map(() => createCommit({
  userId: users[randomInt(0, users.length)].id,
  message: "changes something"
}));

export const commitData = ({
  getById: async (id) => commits.find(commit => commit.id === id),
  getAllByUserId: async (userId) => commits.filter(commit => commit.userId === userId),
  getAll: async () => commits,
  insert: async ({message, userId}) => {
    if (!userId || !message) return null; 
    const commit = createCommit({message, userId});
    commits.push(commit);
    return commit;
  }
});