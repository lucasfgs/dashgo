import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Input } from "components/Form/Input";
import { Header } from "components/Header";
import { Sidebar } from "components/Sidebar";
import { useMutation } from "react-query";
import { api } from "services/axios";
import { FormEvent } from "react";
import { queryClient } from "services/react-query";
import { useRouter } from "next/router";

type createUserFormData = {
  nome: string;
  email: string;
  password: string;
  password_confirmation: string;
};

const createUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: yup
    .string()
    .required("Senha obrigatória")
    .min(6, "No mínimo 6 caracteres"),
  password_confirmation: yup
    .string()
    .oneOf([null, yup.ref("password")], "As senhas precisam ser iguais"),
});

export default function CreateUser() {
  const router = useRouter();
  const createUser = useMutation(
    async (user: createUserFormData) => {
      const response = await api.post("/users", {
        user: {
          ...user,
          created_at: new Date(),
        },
      });

      return response.data.user;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
        router.push("/users");
      },
    }
  );

  const { register, handleSubmit, formState, errors } = useForm({
    resolver: yupResolver(createUserFormSchema),
  });

  const handleCreateUser: SubmitHandler<createUserFormData> = async (
    values
  ) => {
    await createUser.mutateAsync(values);
  };

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxW="1480" mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
          onSubmit={handleSubmit(handleCreateUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Criar usuário
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <Stack spacing={["6", "8"]}>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="name"
                label="Nome Completo"
                error={errors.name}
                ref={register}
              />
              <Input
                name="email"
                type="email"
                label="E-mail"
                error={errors.email}
                ref={register}
              />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="password"
                type="password"
                label="Senha"
                error={errors.password}
                ref={register}
              />
              <Input
                name="password_confirmation"
                type="password"
                label="Confirmação da senha"
                error={errors.password_confirmation}
                ref={register}
              />
            </SimpleGrid>
          </Stack>

          <Flex mt="8" justify="flex-end">
            <Stack direction="row" spacing="4">
              <Link href={"/users"} passHref>
                <Button colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button
                type="submit"
                colorScheme="pink"
                isLoading={formState.isSubmitting}
              >
                Salvar
              </Button>
            </Stack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
