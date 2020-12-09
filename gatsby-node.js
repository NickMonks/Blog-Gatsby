// This node file allows to hook configurations dynamically when the gatsby webserver is building
// Remember: Gatsby builds static webpages thanks to be build from CI/CD, not the browser as React (which re-renders dynamically)
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`)
// We use `` because gatsby encourage to use them as the prettier standards
// Prettier is basically a standard so every developer can follow it

// Gatsy expects to be equal to a function, where we pass the node
// where node appears in graphql queries and it's the representation of any file 
// from gatsby 
exports.onCreateNode = ({ node, getNode, actions }) => {
    
    //internal is the data itself 
    // actions from gatsby
    const { createNodeField } = actions
    if (node.internal.type==='MarkdownRemark'){
        // we create a slug, is the URL or link that
        // the browser recognizes to navigate to it. We need to attach it to the node as a field 
        // so whenever we want to route it we have the link
        // it is basically a filepath to so the browser can route it
        //                                     \/ extracts the actual node
        const slug = createFilePath({ node, getNode})

        // So, everytime we call MarkdownRemark, we will append the slug or filepath to the node
        createNodeField(
            {node,
            name: `slug`,
            value: slug
        })
    }
}

//Now that we have the url, we can access in our application
// to build our final applications, by using markdowns files. 

exports.createPages = ({graphql, actions}) => {
    // createPages is a method that allows us to build pages
    const { createPage } = actions
    // return graphql to receive all markdowns
    // this will return the result as a promise, so it will reject or resolve
    return graphql(`
    query MyQuery {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
       result.data.allMarkdownRemark.edges.forEach(({node})=> {
           // for each node we will create a page:
           createPage({
             path: node.fields.slug,
             // component is basically the react componrent
             // this component expects a relative path to be build 
             component: path.resolve(`./src/templates/blog-post.js`),
             // context is used to pass any variables needed to the component.
             // In our case we want to pass $slug!
             context : {
                 slug: node.fields.slug
             }
           })
       }) 
    })
}