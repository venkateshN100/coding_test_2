// controller.js

function sortData(column, order) {
    return TableModel.sorted_data.sort(function (a, b) {
      if (a[column] < b[column]) return order === "asc" ? -1 : 1;
      if (a[column] > b[column]) return order === "asc" ? 1 : -1;
      return 0;
    });
  }
  
  function parseUrlParameters() {
    var urlParams = new URLSearchParams(window.location.search);
  
    var sortColumn = urlParams.get('sortColumn');
    var sortOrder = urlParams.get('sortOrder');
  
    if (sortColumn && sortOrder) {
      TableModel.currentSort.column = sortColumn;
      TableModel.currentSort.order = sortOrder;
    }
  
    var page = urlParams.get('page');
    if (page) {
      TableModel.currentPage = parseInt(page);
    }
  }
  
  function updateUrlParameters() {
    var urlParams = new URLSearchParams();
  
    urlParams.set('sortColumn', TableModel.currentSort.column);
    urlParams.set('sortOrder', TableModel.currentSort.order);
  
    urlParams.set('page', TableModel.currentPage);
  
    window.history.replaceState({}, '', '?' + urlParams.toString());
  }
  
  var TableController = {
    init: function () {
      $.getJSON("data.json", function (data) {
        TableModel.ajax_data = data;
        TableModel.sorted_data = [...TableModel.ajax_data];
        TableView.renderTable();
      });
  
      parseUrlParameters();
  
      this.setupEventListeners();
    },
  
    setupEventListeners: function () {
      $(document).on("click", ".sort-btn", function (event) {
        event.preventDefault();
        var column = $(this).data("column");
  
        if (TableModel.currentSort.column === column) {
          TableModel.currentSort.order = TableModel.currentSort.order === "asc" ? "desc" : "asc";
        } else {
          TableModel.currentSort.column = column;
          TableModel.currentSort.order = "asc";
        }
  
        TableModel.sorted_data = sortData(TableModel.currentSort.column, TableModel.currentSort.order);
        TableView.renderTable();
      });
  
      $(document).on("click", ".page-link", function (event) {
        event.preventDefault();
        TableModel.currentPage = $(this).data("page");
        TableView.renderTable();
      });
    },
  };
  