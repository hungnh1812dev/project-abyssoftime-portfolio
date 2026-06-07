export const GET_CONTACT = /* GraphQL */ `
  query GetContact {
    cvContact {
      name
      location
      phone
      email
      linkedIn
      github
      avatar {
        url
      }
    }
  }
`;
