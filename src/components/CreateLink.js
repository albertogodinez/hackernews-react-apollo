import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { FEED_QUERY } from './LinkList';
import gql from 'graphql-tag';

/**
 * 3 steps for writing out Mutations
 * 1. write the mutation as a JavaScript constant using the gql parser function
 * 2. use the <Muttion /> component passing the GraphQL mutation and variables
 *    (if needed) as props
 * 3. use the mutation function that gets injected into the components render prop function
 */
class CreateLink extends Component {
  state = {
    description: '',
    url: ''
  };

  render() {
    const { description, url } = this.state;
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        {/* wraps the buttons around the Mutation Component and passes in the variables */}
        <Mutation
          mutation={POST_MUTATION}
          variables={{ description, url }}
          onCompleted={() => this.props.history.push('/')}
          update={(store, { data: { post } }) => {
            const data = store.readQuery({ query: FEED_QUERY });
            data.feed.links.unshift(post);
            store.writeQuery({
              query: FEED_QUERY,
              data
            });
          }}
        >
          {/* 
            calls the function that Apollo injects into <Mutation /> component's
            render prop function inside onClick button's event
          */}
          {postMutation => <button onClick={postMutation}>Submit</button>}
        </Mutation>
      </div>
    );
  }
}

// stores the mutation
const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

export default CreateLink;
