import {gql} from "@apollo/client";

export const GET_ALL_CHARACTERS = gql`
  query characters($page: Int!) {
      characters(page: $page) {
          info {
              count
              pages
              next
              prev
          }
          results {
              id
              name
              image
              status
              species
              gender
          }
      }
  }
`;

export const GET_CHARACTER_BY_ID = gql`
  query character($id: ID!) {
      character(id: $id) {
          id
          name
          status
          species
          gender
          image
          created
          origin {
              id
              name
          }
          location {
              name
              type
          }
          episode {
              name
              air_date
              episode
          }
      }
  }
`;
