export const GET_HOME_PAGE = /* GraphQL */ `
  query GetHomePage {
    homePage {
      headline
      subheadline
      sectionTitles {
        impact
        projects
        specializations
        skills
        contact
      }
      impactStats {
        value
        label
        note
      }
      projects {
        title
        tagline
        role
        period
        challenge
        approach
        outcomes {
          value
          label
          note
        }
        techStack
        thumbnail
        link
        repositoryLink
      }
      specializations {
        title
        description
      }
      skills {
        category
        items
      }
    }
  }
`;
