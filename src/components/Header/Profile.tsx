import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

export function Profile() {
  return (
    <Flex align="center">
      <Box mr="4" textAlign="right">
        <Text>Lucas Ferreira</Text>
        <Text color="gray.300" fontSize="small">
          lucsferreira.dev@gmail.com
        </Text>
      </Box>

      <Avatar
        size="md"
        name="Lucas Ferreira"
        src="https://github.com/lucasfgs.png"
      />
    </Flex>
  );
}