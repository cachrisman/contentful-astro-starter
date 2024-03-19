const SPACE = import.meta.env.CONTENTFUL_SPACE_ID
const TOKEN = import.meta.env.DEV 
  ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN 
  : import.meta.env.CONTENTFUL_DELIVERY_TOKEN;

async function apiCall(query, vars) {
  let variables = {
    ...vars,
    preview: import.meta.env.DEV,
  };
  const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${SPACE}/environments/master`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  }
  return await fetch(fetchUrl, options)
}

async function getAllBooks() {

  const query = `
    query ($preview: Boolean) {
        bookReferencePageCollection(preview: $preview) {
          items {
            sys {
                id
            }
            title
            author {
              name
            }
            coverImage {
              url
            }
          }
        }
      }`;
  const response = await apiCall(query);
  const json = await response.json()
  return await json.data.bookReferencePageCollection.items;
}

async function getSingleBook(id) {
  const query = `
    query ($preview: Boolean, $id: String!) {
        bookReferencePage(preview: $preview, id: $id) {
          title
          coverImage {
            url
          }
          description {
            json
          }
          author {
            sys {
              id
            }
            name
          }
        }
      }
    `;
  const variables = {
    id: id
  };
  const response = await apiCall(query, variables);
  const json = await response.json();
  return await json.data.bookReferencePage
}

async function getAuthor(id) {
  const query = `
    query ($preview: Boolean, $id: String!) {
      bookAuthor(preview: $preview, id:$id) {
        name
        avatar {
          url
          description
        }
        bio {
          json
        }
        linkedFrom {
          bookReferencePageCollection {
            items {
              title
            }
          }
        }
      }
    }
    `;
  const variables = {
    id: id
  };
  const response = await apiCall(query, variables);
  const json = await response.json();
  return await json.data.bookAuthor
}

export const client = { getAllBooks, getSingleBook, getAuthor }