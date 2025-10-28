import {
  Box,
  MenuItem,
  Text,
  Menu,
  MenuButton,
  Button,
  MenuList,
  Portal
} from '@chakra-ui/react';

const ACTIVE_COLOR = "blue.400";

// eslint-disable-next-line react/prop-types
const LanguageSelector = ({ language, onSelect, languages }) => {
  // ✅ Add a safe fallback if 'languages' is missing or undefined
  const safeLanguages = Array.isArray(languages) ? languages : [];

  // ✅ Optional: Show placeholder if no languages available
  const hasLanguages = safeLanguages.length > 0;

  return (
    <Box textAlign="left" ml={2} mb={4}>
      <Text mb={2} fontSize="lg">
        Language:
      </Text>
      <Menu isLazy>
        <MenuButton as={Button}>
          {language || "Select Language"}
        </MenuButton>
        <Portal>
          <MenuList bg="gray.900" maxH="50vh" overflowY="auto">
            {hasLanguages ? (
              safeLanguages.map((lang) => (
                <MenuItem
                  key={lang.language}
                  color={lang.language === language ? ACTIVE_COLOR : "gray.400"}
                  bg={lang.language === language ? "gray.900" : "gray.900"}
                  _hover={{
                    color: ACTIVE_COLOR,
                    bg: "gray.900",
                  }}
                  onClick={() => onSelect && onSelect(lang.language)}
                >
                  {lang.language}
                  &nbsp;
                  <span
                    style={{
                      color: 'gray.500',
                      fontSize: '0.75rem',
                    }}
                  >
                    ({lang.version})
                  </span>
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled color="gray.500">
                No languages available
              </MenuItem>
            )}
          </MenuList>
        </Portal>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
