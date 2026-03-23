import { SignIn } from "@clerk/remix";
import { Box, Flex } from "@mantine/core";

export default function SignInPage() {
  return (
    <Flex justify="center" align="center" mih="100vh">
      <Box>
        <SignIn />
      </Box>
    </Flex>
  );
}
