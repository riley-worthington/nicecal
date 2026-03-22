import { SignUp } from "@clerk/remix";
import { Box, Flex } from "@mantine/core";

export default function SignUpPage() {
  return (
    <Flex justify="center" align="center" mih="100vh">
      <Box>
        <SignUp />
      </Box>
    </Flex>
  );
}
