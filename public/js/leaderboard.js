function buildLeaderboard(parentID, listPeople, n, m, pageNumber, itemsPerPage, pageNumberId) {

    setCurrentPage(pageNumber, pageNumberId, n, itemsPerPage,parentID);

    var screenWidth = window.innerWidth;
    var parent = document.getElementById(parentID);
    var table = document.createElement("table");
    var tableBody = document.createElement("tbody");

    // set parent inner HTML empty to prevent appending of parent instead of replacing.
    parent.innerHTML = '';

    // numberOfItems to be displayed is itemsPerPage or if it's the last page then all the left overs.
    // so minimum of the leftovers and itemsPerPage value.
    var numberOfItems = (n-((pageNumber)*itemsPerPage))<itemsPerPage?(n-((pageNumber)*itemsPerPage)):itemsPerPage;

    // to handle different width sizes.
    if(screenWidth <= 768){
        screenWidth = screenWidth*0.9;
    }
    else{
        screenWidth = screenWidth*0.4; 
    }

    table.style.width=screenWidth+'px';
    var radiusCorner=20;
    var heightPercentage=400;

    table.className="leaderboardTable";
    var row = document.createElement('tr');
    row.style.borderRadius=radiusCorner+'px';
    var td = document.createElement('td');
    tableBody.appendChild(row);

    for(let i=pageNumber*itemsPerPage; i<pageNumber*itemsPerPage+numberOfItems; i++) {
        row = document.createElement('tr');
        for(let j=0; j<m; j++) {
            
            td = document.createElement('td');
            td.insertAdjacentHTML('beforeend', ''+listPeople[i][j])+'';

            // for rounding the corners.
            if(j==0) {
                td.style.borderTopLeftRadius=radiusCorner+'px';
                td.style.borderBottomLeftRadius=radiusCorner+'px';
            }
            
            // for rounding the corners.
            if(j==m-1) {
                td.style.borderTopRightRadius=radiusCorner+'px';
                td.style.borderBottomRightRadius=radiusCorner+'px';
            }

            // append the item to the row.
            row.appendChild(td);      
        }

        row.style.lineHeight=heightPercentage+'%';

        // append the row to the tableBody.
        tableBody.appendChild(row);
    }    
    
    // append tableBody to the table and table to the parent.
    table.appendChild(tableBody);
    parent.appendChild(table);

}

function setCurrentPage(pageNumber, pageNumberContainerId, n, itemsPerPage, tableID) {
    
    // pageNumber is in the erange of 0,1,...n-1 so incrementing it.
    pageNumber++;

    // for styling
    var screenWidth = window.innerWidth;
    
    // total number of pages for pagination
    var numberOfBoxes=Math.ceil((n)/itemsPerPage);

    // total number of boxes currently visible
    // includes ... as a box since they have same dimensions.
    // 7 is in the general case when 1,...,current-1,current,current+1,...,last.
    var numberOfBoxesVisible=7;

    var parent = document.getElementById(pageNumberContainerId);

    // styling the container view so that it comes sin the middle.
    parent.innerHTML="";
    parent.style.display='inline-flex';
    parent.style.height='30px';
    parent.style.textAlign='center';
    parent.style.paddingLeft=((screenWidth/2-20*numberOfBoxesVisible)+'px');
    parent.style.marginTop=('3%');
    parent.style.marginBottom=('2%');

    // depending upon the size of data, add boxes and set on click on them with the the box number.

    // in this case simply draw 6 boxes, else depending upon the current page.
    if(numberOfBoxes<=5) {

        // reseting number of boxes that are visible and based on that margin, to set them in the centre.
        numberOfBoxesVisible=numberOfBoxes;
        parent.style.paddingLeft=((screenWidth/2-20*numberOfBoxesVisible)+'px');

        for(var i=1; i<=numberOfBoxes; i++) {
            parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+(i-1)+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+i+'</div>';
        }

    } else {
        
        // always first box will appear so drawing them first.
        parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+0+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+1+'</div>';

        // in this case show first three boxes, then ... and then the last two boxes.
        if(pageNumber==1) {

            numberOfBoxesVisible=5;
            parent.style.paddingLeft=((screenWidth/2-20*numberOfBoxesVisible)+'px');

            parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+1+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+2+'</div>';
            parent.innerHTML+='<div class="paginationDots">...</div>';
            parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+(numberOfBoxes-2)+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+(numberOfBoxes-1)+'</div>';
            parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+(numberOfBoxes-1)+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+numberOfBoxes+'</div>';
        
        } else {

            if(pageNumber<=3) {

                // draw first four boxes and then ... and then the last two boxes.
                // else if pageNumber is 4, then box 1,2 followed by ... and then 4,5, then ... and finally last two boxes.
                if(pageNumber==2) {

                    numberOfBoxesVisible=5;
                    parent.style.paddingLeft=((screenWidth/2-20*numberOfBoxesVisible)+'px');
        
                    parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+1+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+2+'</div>';
                    parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+2+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+3+'</div>';
                    parent.innerHTML+='<div class="paginationDots">...</div>';
                    parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+(numberOfBoxes-1)+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+numberOfBoxes+'</div>';
                } else if(pageNumber==3) {

                    parent.innerHTML+='<div class="paginationDots">...</div>';
                    parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+2+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+3+'</div>';
                    parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+3+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+4+'</div>';
                    parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+4+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+5+'</div>';
                    parent.innerHTML+='<div class="paginationDots">...</div>';
                    parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+(numberOfBoxes-2)+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+(numberOfBoxes-1)+'</div>';
                }
            } else if(pageNumber>=numberOfBoxes-2) {

                // in this case to prevent more boxes being drawn, draw all the leftovers till numberOfBoxes value.
                numberOfBoxesVisible=3;
                numberOfBoxesVisible+=numberOfBoxes-pageNumber;
                parent.style.paddingLeft=((screenWidth/2-20*numberOfBoxesVisible)+'px');

                parent.innerHTML+='<div class="paginationDots">...</div>';

                for(var i=pageNumber; i<=numberOfBoxes; i++) {
                    parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+(i-1)+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+(i)+'</div>';
                }
                
            } else {
                // the standard case, first two box, then ... and then current-1, current, current+1 box and then finally last two boxes.

                parent.innerHTML+='<div class="paginationDots">...</div>';
                parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+(pageNumber-2)+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+(pageNumber-1)+'</div>';
                parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+(pageNumber-1)+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+(pageNumber)+'</div>';
                parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+(pageNumber)+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+(pageNumber+1)+'</div>';
                parent.innerHTML+='<div class="paginationDots">...</div>';
                parent.innerHTML+='<div class="pageNumberBox" onclick=buildLeaderboard("'+tableID+'",listPeople,'+n+','+m+','+(numberOfBoxes-1)+','+itemsPerPage+',"'+pageNumberContainerId+'");>'+numberOfBoxes+'</div>';
            }

        }

    }

}
