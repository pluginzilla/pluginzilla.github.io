
BookmarksDataConverter = function(documents, bookmarks) {
    this.getProjectSpaceList = function() {
        var projectSpaceList = [];

        for (var index = 0; index < bookmarks.length; index++) {
            var projectSpace = {
                "type": bookmarks[index].projectSpaceType,
                "name": bookmarks[index].projectSpaceName,
                "revision": bookmarks[index].projectSpaceRev,
                "owner": bookmarks[index].projectSpaceOwner,
                "state": bookmarks[index].projectSpaceState,
                "product": bookmarks[index].productName,
                "productId": bookmarks[index].productId,
                "description": bookmarks[index].productDescription
            };

            var found = false;
            for (var x = 0; x < projectSpaceList.length; x++) {
                var res = projectSpaceList[x].name == projectSpace.name;

                if (res) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                var bookmarkFolders = this.bookmarkFoldersByProjectSpaceName(bookmarks, projectSpace.name);

                var bookmarkInfoList = [];
                for (var x = 0; x < bookmarkFolders.length; x++) {
                    var bookmarkFolder = bookmarkFolders[x];
                    var bookmarkDetailsList = this.getBookmarkDetailsList(bookmarks, bookmarkFolder.name, projectSpace.name);

                    var documentInfoList = this.getDocumentsByBookmarkFolderName(bookmarks, bookmarkFolder.name, projectSpace.name);

                    var bookmarkFoldersPayload = {};
                    bookmarkFoldersPayload.bookmarkFolder = bookmarkFolder;
                    bookmarkFoldersPayload.bookmarkUrls = bookmarkDetailsList;
                    bookmarkFoldersPayload.documentUrls = documentInfoList;
                    bookmarkInfoList.push(bookmarkFoldersPayload);
                    //console.log("==========");
                    //console.log(bookmarkInfoList);

                }
                projectSpace.bookmarkFolders = bookmarkInfoList;
                projectSpaceList.push(projectSpace);
            }

        }
        //console.log(JSON.stringify(projectSpaceList));
        return projectSpaceList;
    }

    this.bookmarkFoldersByProjectSpaceName = function(bookmarks, projectSpace) {

        var bookmarkFolderList = [];
        for (var index = 0; index < bookmarks.length; index++) {
            var psn = bookmarks[index].projectSpaceName;
            if (psn == projectSpace) {
                var bookmarkFolder = {
                    "type": bookmarks[index].bookmarkFolderType,
                    "name": bookmarks[index].bookmarkFolderName,
                    "revision": bookmarks[index].bookmarkFolderRevision,
                    "owner": bookmarks[index].bookmarkFolderOwner,
                    "state": bookmarks[index].bookmarkFolderState,
                    "description": bookmarks[index].bookmarkFolderDesc
                };

                var found = false;
                for (var x = 0; x < bookmarkFolderList.length; x++) {
                    if (bookmarkFolderList[x].name == bookmarkFolder.name) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    bookmarkFolderList.push(bookmarkFolder);
                }
            }

        }

        return bookmarkFolderList;
    };
    this.getBookmarkDetailsList = function(bookmarks, bookmarkFolder, projectSpaceName) {
        var bookmarkDetailsList = [];
        for (var index = 0; index < bookmarks.length; index++) {
            var ps = bookmarks[index].projectSpaceName;
            var bf = bookmarks[index].bookmarkFolderName;

            if (ps == projectSpaceName && bf == bookmarkFolder) {
                var bookmarkDetails = {
                    "type": bookmarks[index].bookmarkURLType,
                    "name": bookmarks[index].bookmarkURLName,
                    "revision": bookmarks[index].bookmarkURLRev,
                    "owner": bookmarks[index].bookmarkURLOwner,
                    "state": bookmarks[index].bookmarkURLState,
                    "description": bookmarks[index].bookmarkURLDesc,

                    "id": bookmarks[index].bookmarkURLid,
                    "bookmarkURLLink": bookmarks[index].bookmarkURLLink,
                };

                var found = false;
                for (var x = 0; x < bookmarkDetailsList.length; x++) {
                    if (bookmarkDetailsList[x].name == bookmarkDetails.name) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    bookmarkDetailsList.push(bookmarkDetails);
                }
            }

        }

        return bookmarkDetailsList;
    };
    this.getFileNames = function(filesArray, files) {
        if (files.length > 0) {
            files = files + " ";
            var fileName = files.substring(0, files.indexOf('.'));
            if (fileName != "") {
                //console.log(fileName);
                var extension = files.substring(fileName.length, files.length);
                //console.log("extension: " + extension);
                extension = extension.substring(0, extension.indexOf(' '));
                //console.log("extension: " + extension);

                var file = fileName + extension;

                filesArray.push(file);
                files = files.substring(file.length + 1, files.length);
                return this.getFileNames(filesArray, files);

            }

            //console.log(files);

        } else {
            return 0;
        }

    };
    this.getDocumentsInfoByDocumentId = function(documentId) {
        var documentsInfo = {};
        var result = documents.filter(function(document) {
            if (document.documentId == documentId) {
                return document;
            }
        });
        if (result.length > 0) {
            documentsInfo.documentId = result[0].documentId;
            documentsInfo.type = result[0].documentType;
            documentsInfo.name = result[0].documentName;
            documentsInfo.revision = result[0].documentRevision;
            documentsInfo.owner = result[0].documentOwner;
            documentsInfo.state = result[0].documentState;
            documentsInfo.description = "";

            var fileInfoList = [];
            var fileIds = result[0].fileIds;
            var files = result[0].files;
            //console.log("fileInfo investigate....");
            //console.log(files);

            if (fileIds != null && fileIds != undefined && fileIds != "") {
                var filesArray = [];
                this.getFileNames(filesArray, files);

                files = result[0].files;
                var fileIdArray = fileIds.split(" ");

                for (var i = 0; i < fileIdArray.length; i++) {
                    var fileInfo = {
                        "fileId": fileIdArray[i],
                        "type": result[0].documentType,
                        "name": filesArray[i],
                        "revision": result[0].documentRevision,
                        "owner": result[0].documentOwner,
                        "state": result[0].documentState,
                        "description": ""
                    };
                    fileInfoList.push(fileInfo);
                }
            }
            documentsInfo.fileInfoList = fileInfoList;
        }

        return documentsInfo;
    };

    this.getDocumentsByBookmarkFolderName = function(bookmarks, bookmarkFolder, projectSpaceName) {
        //documents.split("^\.[^.]+$");
        var documentInfoList = [];
        for (var index = 0; index < bookmarks.length; index++) {
            var ps = bookmarks[index].projectSpaceName;
            var bf = bookmarks[index].bookmarkFolderName;
            var documents = bookmarks[index].documents;
            if ((bf == bookmarkFolder && ps == projectSpaceName) && documents != null && documents != undefined && documents != "") {
                var documentIds = documents.split(" ");
                for (var i = 0; i < documentIds.length; i++) {
                    var documentId = documentIds[i];

                    var documentInfoByDocumentId = this.getDocumentsInfoByDocumentId(documentId);
                    // console.log(documentInfoByDocumentId);

                    var documentInfo = {
                        "documentId": documentId,
                        "type": documentInfoByDocumentId.type,
                        "name": documentInfoByDocumentId.name,
                        "revision": documentInfoByDocumentId.revision,
                        "owner": documentInfoByDocumentId.owner,
                        "state": documentInfoByDocumentId.state,
                        "description": documentInfoByDocumentId.name,
                        "fileInfoList": documentInfoByDocumentId.fileInfoList
                    };
                    var found = false;
                    for (var docIndex = 0; docIndex < documentInfoList.length; docIndex++) {
                        if (documentInfoList[docIndex].documentId == documentInfo.documentId) {
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        documentInfoList.push(documentInfo);
                    }


                }

            }

        } //documents

        return documentInfoList;
    };

};

///////**********************************************************************************************************//////
///////**********************************************************************************************************//////
///////**********************************************************************************************************//////
///////**********************************************************************************************************//////

TreeTableGenerator = function(projectSpaceList) {
	
    this.generate = function() {
		console.log(projectSpaceList);
        var rows = "<tbody>";
        for (var i = 0; i < projectSpaceList.length; i++) {
            var projectSpaceId = 'ps_' + i;

            rows = rows + "<tr data-tt-id='" + i + "'>" +
                "<td style='text-align:left;'>" +
                "<a href='#'><img src='../resources/images/bookmark_images/project_space.png' alt='ps'/><span class='title'>" + projectSpaceList[i].name + "</span></a></td>" +
                "<td>" + 
					"<a target='_BLANK' href='https://3dpassport-18xdev2.plm.valmet.com:8280/3dpassport/login?service=https%3A%2F%2F3dspace-18xdev2.plm.valmet.com%3A8180%2F3dspace%2Fcommon%2FemxNavigator.jsp%3FobjectId%3D"+projectSpaceList[i].productId+"'>"+projectSpaceList[i].product +"</a>"
				+ "</td>" +
                "<td>" + projectSpaceList[i].type + "</td>" +
                "<td>" + projectSpaceList[i].name + "</td>" +
				//"<td>" + projectSpaceList[i].revision + "</td>" +
                "<td></td>" +
                "<td>" + projectSpaceList[i].description + "</td>" +
                "<td>" + projectSpaceList[i].owner + "</td>" +
                "<td>" + projectSpaceList[i].state + "</td>" +
                "</tr>";
            var bookmarkFolders = projectSpaceList[i].bookmarkFolders;

            for (var j = 0; j < bookmarkFolders.length; j++) {
                var bookmarkFolder = bookmarkFolders[j].bookmarkFolder;

                rows = rows + "<tr data-tt-id='" + i + "-" + j + "' data-tt-parent-id='" + i + "' style=''><td style='text-align:left;'>" +
                    "<img src='../resources/images/bookmark_images/bookmark_folder.png' alt='bookmark_folder'/><a href='#'><span class='title'>" + bookmarkFolder.name + "</span></a></span></td>" +
                    "<td></td>" +
                    "<td>" + bookmarkFolder.type + "</td>" +
                    "<td>" + bookmarkFolder.name + "</td>" +
                    //"<td>" + bookmarkFolder.revision + "</td>" +
                    "<td></td>" +
                    "<td>" + bookmarkFolder.description + "</td>" +
                    "<td>" + bookmarkFolder.owner + "</td>" +
                    "<td>" + bookmarkFolder.state + "</td>" +
                    "</tr>";

                var bookmarkUrls = bookmarkFolders[j].bookmarkUrls;
                var documentUrls = bookmarkFolders[j].documentUrls;

                // populate bookmark urls info structure
                for (var k = 0; k < bookmarkUrls.length; k++) {
                    var bookmarkUrl = bookmarkUrls[k];
                    rows = rows + "<tr data-tt-id='" + i + "-" + j + "-" + k + "' data-tt-parent-id='" + i + "-" + j + "'><td style='text-align:left;'><a target='_BLANK' href='" + bookmarkUrl.bookmarkURLLink + "'><img src='../resources/images/bookmark_images/bookmark_url.png' alt='bookmark'/><span class='title'>" +
                        "<b> " + bookmarkUrl.name + "</b></span>" +
                        "</a></td>" +
                        "<td></td>" +
                        "<td>" + bookmarkUrl.type + "</td>" +
                        "<td>" + bookmarkUrl.name + "</td>" +
                        //"<td>" + bookmarkUrl.revision + "</td>" +
                        "<td></td>" +
                        "<td>" + bookmarkUrl.description + "</td>" +
                        "<td>" + bookmarkUrl.owner + "</td>" +
                        "<td>" + bookmarkUrl.state + "</td>" +
                        "</tr>";
                }
                // populate document urls info structure
                for (var k = 0; k < documentUrls.length; k++) {
                    
                    var documentUrl = documentUrls[k];
					var keys = Object.keys(documentUrl);
					//alert(documentUrl[keys[2]]);
                    rows = rows + "<tr data-tt-id='" + i + "-" + j + "-" + k + "' data-tt-parent-id='" + i + "-" + j + "'><td style='text-align:left;'>" +
                        "<a href=''>" + documentUrl.name + "</a></td>" +
                        "<td></td>" +
                        "<td>" + documentUrl.type + "</td>" +
                        "<td>" + documentUrl.name + "</td>" +
                        "<td>" + documentUrl.revision + "</td>" +
                        "<td>" + documentUrl.description + "</td>" +
                        "<td>" + documentUrl.owner + "</td>" +
                        "<td>" + documentUrl.state + "</td>" +
                        "<td></td></tr>";
                    var fileInfoList = documentUrl.fileInfoList;

                    if (fileInfoList != undefined) {
                        for (var l = 0; l < fileInfoList.length; l++) {
                            var fileInfo = fileInfoList[l];

                            rows = rows + "<tr data-tt-id='" + i + "-" + j + "-" + k + "-" + l + "' data-tt-parent-id='" + i + "-" + j + "-" + k + "'>";
                            rows = rows + "<td style='text-align:left;'><a target='_BLANK' href='https://3dspace-18xdev2.plm.valmet.com:8180/3dspace/components/emxCommonDocumentPreCheckout.jsp?objectId=" + fileInfo.fileId + "&action=download&format&fileName&appName	=Table&appDir	=PMCFolderSummary&refresh&trackUsagePartId&version&customSortColumns&customSortDirections&uiType&table&getCheckoutMapFromSession&fromDataSessionKey&parentOID&appProcessPage&portalMode	false&frameName	content&id&fileAction&file&versionId'><img src='../resources/images/bookmark_images/document.png' alt='doc'/><span class='title'>" + fileInfo.name + "</span></a></td>" +
                                "<td></td>" +
                                "<td>" + fileInfo.type + "</td>" +
                                "<td>" + fileInfo.name + "</td>" +
                                "<td>" + fileInfo.revision + "</td>" +
                                "<td>" + fileInfo.description + "</td>" +
                                "<td>" + fileInfo.owner + "</td>" +
                                "<td>" + fileInfo.state + "</td>" +
                                "<td></td>";
                            rows = rows + "</tr>"; // end of Document URLs
                        }
                    }


                }
            }
        }
		var removed = $("#bookmarksTable body").remove();
		
		
		$('#bookmarksTable').remove();
		var $table = $('<table id="bookmarksTable"/>');
		$table.append('<thead>'+
		  '<tr>'+
			'<th>Title</th>'+
			'<th>Product</th>'+
			'<th>Type</th>'+
			'<th>Name</th>'+
			'<th>Rev</th>'+
			'<th>Description</th>'+
			'<th>Responsible</th>'+
			'<th>Maturity State</th>'+
		  '</tr>'+
		  '<tr>'+
			'<th><input type="text" id="bookmarkSearch0" placeholder="Enter Title" /></th>'+
			'<th><input type="text" id="bookmarkSearch1" placeholder="Enter Product" /></th>'+
			'<th></th>'+
			'<th></th>'+
			'<th></th>'+
			'<th></th>'+
			'<th></th>'+
			'<th></th>'+
		  '</tr>'+
		  '</thead>');
		$table.append(rows);
		
		$('#bookmarkTableContainer').append($table);
		$("#bookmarksTable").treetable({
				expandable: true
		});
	
		//jQuery('#bookmarksTable').treetable('collapseAll');

		// Highlight selected row
		$("#bookmarksTable tbody").on("mousedown", "tr", function() {
			$(".selected").not(this).removeClass("selected");
			$(this).toggleClass("selected");
		});
		
        $("#bookmarkSearch0").keyup(function() {
			jQuery('#bookmarksTable').treetable('expandAll');
            var title = $(this).val();
            var filter, table, tr, td, txtValue;
            filter = title.toUpperCase();
            table = document.getElementById("bookmarksTable");
            tr = table.getElementsByTagName("tr");
            if (title != "") {
                for (var i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[0];
					
					tr[i].className = tr[i].className.replace("expanded","collapsed");
					
                    if (td) {

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
				
            } else {

                for (var i = 0; i < tr.length; i++) {
                    var trClass = tr[i].className;

                    tr[i].className = trClass;
                    tr[i].style.display = "";
                    if (trClass.indexOf("hidden") > -1 && trClass.indexOf("child_hidden") < 0) {
                        tr[i].setAttribute("hidden", "");
                    }

                }
				jQuery('#bookmarksTable').treetable('collapseAll');
            }

            $("#bookmarkSearch1").val('');
        });

        $("#bookmarkSearch1").keyup(function() {
			jQuery('#bookmarksTable').treetable('expandAll');
            var filter, table, tr, td, txtValue;
			var title = this.value;
            table = document.getElementById("bookmarksTable");
            tr = table.getElementsByTagName("tr");
			if (title != "") {				
					filter = title.toUpperCase();
					for (var i = 0; i < tr.length; i++) {
					tr[i].className = tr[i].className.replace("expanded","collapsed");
					td = tr[i].getElementsByTagName("td")[1];
					if (td) {
						txtValue = td.textContent || td.innerText;
						if (txtValue.toUpperCase().indexOf(filter) > -1) {
							tr[i].style.display = "";
						} else {
							tr[i].style.display = "none";
						}
					}
				}
			} else {
				for (var i = 0; i < tr.length; i++) {
					tr[i].className = tr[i].className.replace("expanded","collapsed");
				}
				jQuery('#bookmarksTable').treetable('collapseAll');
			}
            
            $("#bookmarkSearch0").val('');
        });
    };


};

function getProjectSpaceListAction(documents,bookmarksJson) {
	return new Promise(function(resolve, reject) {	
		var dataConverter = new BookmarksDataConverter(documents, bookmarksJson);
		var projectSpaceList = dataConverter.getProjectSpaceList();
		resolve(projectSpaceList);
	});
}
function populateBookmarksTable(bookmarksJson){
	getProjectSpaceListAction(documents, bookmarksJson).then(function(projectSpaceList){
	var treeTableGenerator = new TreeTableGenerator(projectSpaceList);
	treeTableGenerator.generate();
	});
}

/////////////////////////////////////////////////////

populateBookmarksTable(filteredBookmarks);
$('#loadNewBookmarks').click(function(){
	populateBookmarksTable(newBookmarks);
});
//populateBookmarksTable(filteredBookmarks);


