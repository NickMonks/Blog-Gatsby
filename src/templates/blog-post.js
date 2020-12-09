import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';

export default ({ data }) => {
    const post = data.markdownRemark;
    return (
        <Layout>
            <div>
                {/* This populates the HTML in the frontend. In typical react
                 this is dangerous, but because we statically build our page is safe to use*/}
                <h1>{post.frontmatter.title} </h1>
                <div dangerouslySetInnerHTML={{ __html: post.html }} />
            </div>
        </Layout>
    )
}

// remember that the query used above defined below
// basically, we check here any $slug that matches to the one below
// 
export const query = graphql`
    query($slug: String!) {
        markdownRemark( fields: {slug: {eq: $slug}}) {
            html
            frontmatter {
                title
            }
        }
    }
`