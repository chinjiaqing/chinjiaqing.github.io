const ejs = require("ejs")

const str = `
<% if (user) { %>
  <h2><%= user.name %></h2>
<% } %>
`;

// console.log(ejs)
let html = ejs.render(str, {
    user: {
        name:'Json'
    }
})
console.log(html);