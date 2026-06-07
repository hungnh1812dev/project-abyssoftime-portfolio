export const GET_HEADER_NAV = /* GraphQL */ `
  query GetHeaderNav {
    headerNav {
      brandText
      navItems {
        label
        path
      }
      languages {
        code
        label
      }
    }
  }
`;
