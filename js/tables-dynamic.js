$(function(){
    var Territory = Backbone.Model.extend({});

    var PageableTerritories = Backbone.PageableCollection.extend({
        model: Territory,
        url: "lib/examples/pageable-territories.json",
        state: {
            pageSize: 15
        },
        mode: "client" // page entirely on the client side
    });

    var columns = [{
        name: "id", // The key of the model attribute
        label: "ID", // The name to display in the header
        editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
        // Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
        cell: Backgrid.IntegerCell.extend({
            orderSeparator: ''
        })
    }, {
        name: "name",
        label: "Name",
        // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
        cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
    }, {
        name: "pop",
        label: "Population",
        cell: "integer" // An integer cell is a number cell that displays humanized integers
//    }, {
//        name: "percentage",
//        label: "% of World Population",
//        cell: "number" // A cell type for floating point value, defaults to have a precision 2 decimal numbers
    }, {
        name: "url",
        label: "URL",
        cell: "uri" // Renders the value in an HTML <a> element
    }];


    var pageableTerritories = new PageableTerritories();

    var pageableGrid = new Backgrid.Grid({
        columns: columns,
        collection: pageableTerritories,
        footer: Backgrid.Extension.Paginator.extend({
            //okendoken. rewrite template to add pagination class to container
            template: _.template('<tr><td class="pagination text-align-center" colspan="<%= colspan %>"><ul><% _.each(handles, function (handle) { %><li <% if (handle.className) { %>class="<%= handle.className %>"<% } %>><a href="#" <% if (handle.title) {%> title="<%= handle.title %>"<% } %>><%= handle.label %></a></li><% }); %></ul></td></tr>')
        }),
        className: 'table table-striped table-editable no-margin'
    });

    $("#table-dynamic").append(pageableGrid.render().$el);

    pageableTerritories.fetch();
});