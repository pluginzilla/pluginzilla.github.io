jQuery.fn.jsTable = function(tableData) {
    // Table generation from json input
    return this.each(function() {
        var tbody = tableData.tbody;
        var thead = tableData.thead;
		var searchable = tableData.searchable;
		var pagination = tableData.pagination;
		var perPage = tableData.perPage;
		perPage = (perPage!=undefined && perPage!=null && perPage>0) ? perPage : tbody.length;

        if (tbody.length == 0) {
            return 0;
        }
		var columns = tableData.thead;
        var keys = Object.keys(tbody[0]);
		
		var table = this;
		var trs = table.getElementsByTagName('tr');
		table.innerHTML = '';
		var lastRowIndex = 0;
		
		
		
		var searchableRow = false;
		for (var j = 0; j < keys.length; j++) { 
			if (searchable[j]) {
				searchableRow = true;
			}
		}
		

		function drawTableHeader(table){
			var row = table.insertRow(lastRowIndex++);
			for (var j = 0; j < thead.length; j++) {
				var cell = row.insertCell(j);
				var thData = thead[j];
				cell.innerHTML = thData;
			}
		}
		function drawSearchableRow(table) {
			var row = table.insertRow(lastRowIndex++);
			for (var j = 0; j < thead.length; j++) {
				var cell = row.insertCell(j);
				if (searchable[j]) {
					cell.innerHTML = '<input type="text" id="field'+j+'" placeholder="Type Here"/>';
				} else {
					cell.innerHTML = '';
				}
			}
		}
		function drawTableBody(table){
			for (var i = 0; i < tbody.length; i++) {
				var row = table.insertRow(lastRowIndex++);
				
				for (var j = 0; j < keys.length; j++) {
					var cell = row.insertCell(j);
					var key = keys[j];
					cell.innerHTML = tbody[i][key];
				}

			}
		}
        function drawPaginatedTable(table,visiblePage,checkAlreadyVisible) {
			var trs = table.getElementsByTagName("tr");
			for (var i = 2; i < trs.length; i++) {
				var currentPage = i / perPage;
				//console.log(currentPage >= visiblePage && currentPage <= (visiblePage+1));
				var visibilityCondition = false
				if (checkAlreadyVisible) {
					visibilityCondition = currentPage >= visiblePage && currentPage <= (visiblePage+1) && trs[i].style=="";
				} else {
					visibilityCondition = currentPage >= visiblePage && currentPage <= (visiblePage+1);
				}
				if (visibilityCondition) {
					trs[i].style = "";	
				} else {
					trs[i].style = "display:none;";	
				}
			}
		}

		function drawPaginationLinks(table,activePage){
			
			$('#'+table.id+'-pagination').remove();

			var preparedList = "<nav id='"+table.id+"-pagination' aria-label=\"Page navigation example\">"+
			"<ul class=\"pagination\">";
			var totalPages = tbody.length/perPage;
			
			for (var i=0;i<totalPages;i++) {
				if ((activePage-1) == i) {
					preparedList = preparedList + "<li class=\"active page-item\"> <a href=\"javascript:void(0);\" class=\"page-link\">"+(i+1)+"</a></li>";
				} else {
					preparedList = preparedList + "<li class=\"page-item\"> <a href=\"javascript:void(0);\" class=\"page-link\">"+(i+1)+"</a></li>";
				}
				
			}
			preparedList = preparedList + "</ul></nav>";
			$("#"+table.id+"").parent().append(preparedList);
			$('#'+table.id+'-pagination a').click(function(){
				var pageNo = this.innerText;
				loadPage(pageNo);
			});
			function loadPage(pageNo) {
				var currentPage = 0;
				var trs = table.getElementsByTagName("tr");
				for (var i = 2; i < trs.length; i++) {
					currentPage = i/perPage;

					if (pageNo>=currentPage && (pageNo<=currentPage+1)) {
						trs[i].style = "";	
					} else {
						trs[i].style = "display:none;";	
					}
					
				}
				drawPaginationLinks(table,pageNo);	
			}
		}
		function bindSearchableEvents(table){
			for (var j = 0; j < thead.length; j++) {
				if (searchable[j]) {
					var targetTd = j;
					$("#field"+targetTd+"").keyup(function() {
						var title = $(this).val();
						
						var filter, tr, td, txtValue;
						filter = title.toUpperCase();
						//table = document.getElementById("example");
						tr = table.getElementsByTagName("tr");
						if (filter!="") {
							for (var i = 2; i < tr.length; i++) {
								td = tr[i].getElementsByTagName("td")[targetTd];
								if (td) {
									trs[i].style = "";	
									txtValue = td.textContent || td.innerText;
									if (txtValue.toUpperCase().indexOf(filter) > -1) {
										tr[i].removeAttribute("hidden");
										tr[i].style.display = "";
									} else {
										//tr[i].style.display = "";
										tr[i].style.display = "none";
										
									}
								}
							}
							$('#'+table.id+'-pagination').hide();
						} else {
							if (pagination) {
								drawPaginatedTable(table,0,false);
								drawPaginationLinks(table,1);
								$('#'+table.id+'-pagination').show();
							}
							
						}
						
						
					});
				}
			}
		}
		// table event
        if (columns.length == keys.length) {
			drawTableHeader(table);
			if (searchableRow) {
				drawSearchableRow(table);
				bindSearchableEvents(table);
			}
			drawTableBody(table);
			
			if (pagination) {
				
				drawPaginatedTable(table,0,false);
				drawPaginationLinks(table,1);
			}
        } else {
            alert('Error: Unable to draw!');
        }
		
		
        // var table = this;
        // table.style = "text-align:center;";
        // table.className = "table table-hover";
        // table.width = "100%";
        // table.border = 1;

       
        // for (var i = 0; i < trs.length; i++) {
        //     var tds = trs[i].getElementsByTagName('td');
        //     for (var j = 0; j < tds.length; j++) {
        //         var td = tds[j];
        //         td.style = "text-align:left;";
        //     }
		// }
		
        return 1;
    });
};

var records = [];
for (var i=0;i<50;i++) {
	var firstName = faker.name.firstName();
	var lastName = faker.name.lastName();
	var name = firstName + " " + lastName;
	var fatherName = faker.name.firstName();
	 fatherName += " " +faker.name.lastName();

	var data = {
		"name" : name,
		"fatherName" : fatherName,
		"district" : faker.address.city(),
		"ssn" : faker.phone.phoneNumber()
	};
	records.push(data);
}
$('#loadDefault').click(function(){
	loadInitialData();
});
function loadInitialData(){
	var tableData = {
		"thead": ["Name", "Father Name", "District", "SSN"],
		"searchable": [true, false, false, false],
		"pagination" : true,
		"actionButtons" : false,
		"perPage" : 10,
		"globalSearch" : false,
		"tbody": records
	};
	$('#example').jsTable(tableData);
}
loadInitialData();

$('#loadData').click(function(){
	var records = [];
	for (var i=0;i<100000;i++) {
		var firstName = faker.name.firstName();
		var lastName = faker.name.lastName();
		var name = firstName + " " + lastName;
		var fatherName = faker.name.firstName();
		 fatherName += " " +faker.name.lastName();
		var data = {
			"name" : name,
			"fatherName" : fatherName,
			"district" : faker.address.city(),
			"ssn" : faker.phone.phoneNumber()
		};
		records.push(data);
	}
	var tableData = {
		"thead": ["Name", "Father Name", "District", "SSN"],
		"searchable": [true, false, false, false],
		"pagination" : true,
		"actionButtons" : false,
		"perPage" : 10,
		"globalSearch" : false,
		"tbody": records
	};
	$('#example').jsTable(tableData);
});

