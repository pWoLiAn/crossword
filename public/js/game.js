var setHover = (targets) => {
   var targetArray = targets.split(',');
   console.log(targetArray);
   targetArray.forEach(element => {
     element = element.slice(1);
     var x = document.getElementById(element);
     x.className = "hint-cell-hover";
   });
}

var resetHover = (targets) => {
  var targetArray = targets.split(',');
  targetArray.forEach(element => {
    element = element.slice(1);
    var x = document.getElementById(element);
    x.className = "hint-cell";
  });
}

var evalGrid = async (id, n, m) => {
  var set=[];
  var isD = false;
  var isA = false;
  var Aid = "", Did = "";
  var Aindex = {x: n, y: m}, Dindex={x: n, y: m};
  var word = document.getElementById(id).dataset.target;
  var wordArray = word.split(",");
  for(var l = 0; l< wordArray.length ; l++){
    if(wordArray[l].charAt(1) == "D"){
      isD = true;
    }
    else if(wordArray[l].charAt(1) == "A"){
      isA = true;
    }
  }
  var doms = document.getElementsByClassName("crossword-board__item");
  for(var l=0; l < doms.length; l++) {
    var dom = doms[l];
    var targetArray = dom.dataset.target.split(",");
    for(var i=0; i< targetArray.length; i++){
      if(wordArray.indexOf(targetArray[i]) !== -1){
        var yIndex = parseInt(dom.id.replace("item", "").split("-")[0],10) - 1;
        var xIndex = parseInt(dom.id.replace("item", "").split("-")[1],10) - 1;
        var newObj= {orientation: targetArray[i].charAt(1), letter:dom.value, x: xIndex,y: yIndex};
        set.push(newObj);
        if(newObj.x < Aindex.x && newObj.orientation == "A"){
          Aindex = {
            x: newObj.x,
            y: newObj.y
          }
        }
        if(newObj.y < Dindex.y && newObj.orientation == "D"){
          Dindex = {
            x: newObj.x,
            y: newObj.y
          }
        }
      }
    }
  };
  for(var i =0; i< words.length; i++){
    if(words[i].startIndex.x == Aindex.x && words[i].startIndex.y == Aindex.y && words[i].orientation == "across"){
      Aid = words[i]._id;
    }  
    if(words[i].startIndex.x == Dindex.x && words[i].startIndex.y == Dindex.y && words[i].orientation == "down"){
      Did = words[i]._id;
    }
  }
  var Aflag = 0;
  var Dflag = 0;
  for(var i = 0; i < set.length ; i++){
      if(set[i].letter == "" && set[i].orientation == "D"){
        Dflag = 1;
      }
      if(set[i].letter == "" && set[i].orientation == "A"){
        Aflag = 1;
      }
  }
  if((Aflag == 0 && isA) || (Dflag ==0 && isD)){
    evaluateWord(set, Aid, Did);
  }
}

var evaluateWord = async(set, Aid, Did) => {
  try{
    var result = await fetch("/user/check", {
      method: 'post', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({set: set, id: { across: Aid, down: Did}})
    });
    var result = await result.json();
    for(var i = 0; i < set.length && (result.changed.across || result.changed.down); i++){
      if(set[i].orientation == "A" && result.changed.across){
        var x = set[i].x + 1, y = set[i].y + 1;
        document.getElementById("item"+y+"-"+x).classList.add("completed");    
      }
      if(set[i].orientation == "D" && result.changed.down){
        var x = set[i].x + 1, y = set[i].y + 1;
        document.getElementById("item"+y+"-"+x).classList.add("completed");  
      }
    }
  } 
  catch(err){
  }
}

var buildMatrix = (parentID, cell, across, down, n, m, hintID) => { 
   document.getElementById("start-btn").style.display = "none";
   var width = window.innerWidth;
   var height;
   if(width <= 768){
      width = width*0.8;
      $("#game-board1").css("text-align", "center");
      $("#game-board1").css("display", "inline-block");
      $("#hint-board1").css("left", "unset");
   }
   else{
      width = width*0.4; 
      $("#game-board1").css("padding-left", "10px");
      $("#hint-board1").css("left", "unset");
      // $(".game-area").css("display", "flex");
   }
   height = width;
   width = width/m;
   height = height/n;
   height = height > width ? height : width;
   width = height;
   var parent = document.getElementById(parentID);
   var table = document.createElement("table");
   var tableBody = document.createElement("tbody");
   for (let r = 1; r <= n; r++) {
      var row = document.createElement('tr');
      for (let c = 1; c <= m; c++) {
       var divId = "item"+r+"-"+c;
       var td = document.createElement('td');
       if(cell[r-1][c-1].state == -1){
         td.insertAdjacentHTML('beforeend', '<div class="crossword-board__item--blank" id="'+divId+'" style="width: '+width+'px; height: '+height+'px;"></div>');
       }
       else{
         if(cell[r-1][c-1].start==0){
           var number = cell[r-1][c-1].state == 2 ? "#D"+cell[r-1][c-1].Dqno : "";
           number = cell[r-1][c-1].state == 1 ? "#A"+cell[r-1][c-1].Aqno : number;
           number = cell[r-1][c-1].state == 3 ? "#D"+cell[r-1][c-1].Dqno+",#A"+cell[r-1][c-1].Aqno: number;
           td.insertAdjacentHTML('beforeend', '<div class="floatContainer"><input data-target="'+ number +'" oninput="evalGrid(this.id, '+n+', '+m+')" id="'+divId+'" class="crossword-board__item" type="text" minlength="1" maxlength="1" required="required" value="" style="width: '+width+'px; height: '+height+'px;"/></div>');
         }
         else if(cell[r-1][c-1].state==1){
           var number =  "#A"+cell[r-1][c-1].Aqno;
           td.insertAdjacentHTML('beforeend', '<div class="floatContainer"><label for="'+divId+'">'+cell[r-1][c-1].Aqno+'</label><input data-target="'+ number +'" oninput="evalGrid(this.id, '+n+', '+m+')" id="'+divId+'" class="crossword-board__item" type="text" minlength="1" maxlength="1" required="required" value="" style="width: '+width+'px; height: '+height+'px;"></div>');
         }
         else if(cell[r-1][c-1].state==2){
           var number = "#D"+cell[r-1][c-1].Dqno ;
           td.insertAdjacentHTML('beforeend', '<div class="floatContainer"><label for="'+divId+'">'+cell[r-1][c-1].Dqno+'</label><input data-target="'+ number +'" oninput="evalGrid(this.id, '+n+', '+m+')" id="'+divId+'" class="crossword-board__item" type="text" minlength="1" maxlength="1" required="required" value="" style="width: '+width+'px; height: '+height+'px;"></div>');
         }
         else {
           if(cell[r-1][c-1].start == 1){
            var number = "#D"+cell[r-1][c-1].Dqno+",#A"+cell[r-1][c-1].Aqno;
            td.insertAdjacentHTML('beforeend', '<div class="floatContainer"><label for="'+divId+'">'+cell[r-1][c-1].Aqno+'</label><input data-target="'+ number +'" oninput="evalGrid(this.id, '+n+', '+m+')" id="'+divId+'" class="crossword-board__item" type="text" minlength="1" maxlength="1" required="required" value="" style="width: '+width+'px; height: '+height+'px;"></div>');  
           }
           else if(cell[r-1][c-1].start == 2){
            var number = "#D"+cell[r-1][c-1].Dqno+",#A"+cell[r-1][c-1].Aqno;
           td.insertAdjacentHTML('beforeend', '<div class="floatContainer"><label for="'+divId+'">'+cell[r-1][c-1].Dqno+'</label><input data-target="'+ number +'" oninput="evalGrid(this.id, '+n+', '+m+')" id="'+divId+'" class="crossword-board__item" type="text" minlength="1" maxlength="1" required="required" value="" style="width: '+width+'px; height: '+height+'px;"></div>');
           }
           else{
            var number = "#D"+cell[r-1][c-1].Dqno+",#A"+cell[r-1][c-1].Aqno;
            td.insertAdjacentHTML('beforeend', '<div class="floatContainer"><label for="'+divId+'">'+cell[r-1][c-1].Aqno+'</label><input data-target="'+ number +'" oninput="evalGrid(this.id, '+n+', '+m+')" id="'+divId+'" class="crossword-board__item" type="text" minlength="1" maxlength="1" required="required" value="" style="width: '+width+'px; height: '+height+'px;"></div>');
           }
         }
       }
       row.appendChild(td);
      }
      tableBody.appendChild(row);
   }
   table.setAttribute("style","margin: 0 auto;")
   table.appendChild(tableBody);
   parent.appendChild(table); 
 
   var hintHeight = across.length > down.length ? across.length : down.length;
   var hintBody = document.getElementById(hintID);
   var table = document.createElement("table");
   table.id = "hint-table";
   var tableBody = document.createElement("tbody");
   var row= document.createElement("tr"); 
   var th1 = document.createElement("th");
   th1.insertAdjacentHTML("beforeend", "<h3>Across</h3>");
   var th2 = document.createElement("th");
   th2.insertAdjacentHTML("beforeend", "<h3>Down</h3>");
   row.appendChild(th1);
   row.appendChild(th2);
   tableBody.appendChild(row);
   for(var i =0 ; i < hintHeight; i++){
    var row = document.createElement('tr'); 
    row.id = "rowHint-"+(i+1);
    row.className = "rowHint";
    tableBody.appendChild(row);
   }
   table.appendChild(tableBody);
   hintBody.appendChild(table);
   var j = 0;
   for(var i = 0; i < across.length ; i++){
    var row = document.getElementById('rowHint-'+(i+1));
    var cell = row.insertCell(0);
    cell.className = "hint-cell";
    console.log(across[i]);''
    cell.insertAdjacentHTML("beforeend", "<div class='hint-cell' id='A"+across[i].number+"'>"+across[i].number+". "+across[i].hint+"</div>"); 
    j++;
   }
   for(;j<down.length; j++){
    var row = document.getElementById('rowHint-'+(i+1));
    var cell = row.insertCell(0);
    cell.className = "hint-cell";
    cell.insertAdjacentHTML("beforeend", "<div class='hint-cell'></div>"); 
   }
   for(var i = 0; i < down.length ; i++){
    var row = document.getElementById('rowHint-'+(i+1));
    var cell = row.insertCell(1);
    cell.className = "hint-cell";
    cell.insertAdjacentHTML("beforeend", "<div class='hint-cell' id='D"+down[i].number+"'>"+down[i].number+". "+down[i].hint+"</div>"); 
   }
   $(".crossword-board__item").mouseenter(function () {
    setHover(this.dataset.target);
   });
   $(".crossword-board__item").mouseout(function () {
    resetHover(this.dataset.target);
   });
   for(var i=0; i < completed.length; i++){
    for(var j =0; j < words.length; j++){
        if(words[j]._id == completed[i]._id){
          completedWord(words[j].startIndex, words[j].length, words[j].orientation, completed[i].word);
          break;
        }
    }
   }
}

var completedWord = (startIndex, length, orien, word) => {
   var x = startIndex.x+1, y = startIndex.y+1;
   for(var i =0; i< length ; i++){
     var divId = "item"+y+"-"+x;
     document.getElementById(divId).value = word[i];
     document.getElementById(divId).classList.add("completed");
     if(orien == "across")
        x++;
     else
        y++;
   }
}