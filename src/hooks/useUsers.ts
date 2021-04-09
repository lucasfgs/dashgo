import { useQuery } from "react-query";
import { api } from "services/axios";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export async function getUsers() {
  const response = await api.get<User[]>("/users");

  const users = response.data.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: new Date(user.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };
  });

  return users;
}

export function useUsers() {
  return useQuery("users", getUsers, {
    staleTime: 5000,
  });
}
