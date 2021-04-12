import { useQuery } from "react-query";
import { api } from "services/axios";

type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

type GetUsersResponse = {
  totalCount: number;
  users: User[];
};

export async function getUsers(page: number): Promise<GetUsersResponse> {
  const response = await api.get<User[]>("/users", {
    params: {
      page,
    },
  });

  const totalCount = Number(response.headers["x-total-count"]);

  const users = response.data.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: new Date(user.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };
  });

  return { users, totalCount };
}

export function useUsers(page: number) {
  return useQuery(["users", page], () => getUsers(page), {
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
