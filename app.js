$(document).ready(function(){

  var apiKey="dc6zaTOxFJmzC";
  var url1="https://api.giphy.com/v1/gifs/"
  var endpoint="search?";
  var limit="100";
  var giphyObject;
  var nextTen=0;

  var things = ["rat", "crow", "dingo", "insects"];


  var savedGifs = JSON.parse(localStorage.getItem("savedGifsStorage"));
    
    if (!Array.isArray(savedGifs)) {
    	$("#placeHolder").attr('visibility','visible');
    	
      savedGifs = [];
    }
    else{
    displaySaved();
    }
  //var savedGifs = [];


  function renderButtons() {
        $("#buttons-view").empty();
        
        for (var i = 0; i < things.length; i++) {
          var newButton = $("<button>");
          newButton.addClass("thing_button op_button round_button");
          newButton.attr("data-name", things[i]);
          newButton.text(things[i]);
          newButton.click(function(){searchThingButton($(this).attr('data-name'));
          });
          
          $("#buttons-view").append(newButton);
        }
      }

  function addSearch(){
        event.preventDefault();
        
        var thing = $("#gifSearch").val().trim();
        things.push(thing);
        renderButtons();
  }
 
  function searchThingButton(search){
    
    endpoint="search?";
    
    //var search=$().attr("data-name");

    var url=url1+endpoint+"api_key="+apiKey+"&q="+search+"&limit="+limit;

    callGiphy(url);
    
    
  }
  
  
  function callGiphy(url){
    $("#tenImages").empty();
    $.ajax({url: url, method: "GET"})
      .done(function(response){
      console.log(response);
      giphyObject=response;
      for(i=0;i<response.data.length; i++){
          var rating = response.data[i].rating;
              var p = $("<p class='rate_p'>").text("Rating: " + rating);
          //var imgSrc=response.data[i].images.original_still.url;
          var imgSrc=response.data[i].images.fixed_height_small_still.url;

          var img= new Image(); 
          img.src=imgSrc;
          img.className ='gif_image';
          $(img).attr("data-pause_play",'pause');
                
          var saveButton="<button class='save_button'>&#x2714;</button>";
          
          var imgDiv=$("<div class='gifDiv' data-ref-num="+i+">");
          
          imgDiv.append(p);
          imgDiv.append(saveButton);
          imgDiv.append(img);

          
        $("#tenImages").append(imgDiv);
      }
    })
  }
  function pausePlay(){
    var i=$(this).parent().attr('data-ref-num');
        
    var gifSrc=giphyObject.data[i].images.fixed_height_small.url;
    
    var imgSrc=giphyObject.data[i].images.fixed_height_small_still.url;
    changeState(gifSrc,imgSrc,this);
  }

  function pausePlaySaved(){
    var i=$(this).parent().attr('data-ref-num');
    console.log(i);
    var gifSrc=savedGifs[i].gifSrc;
    var imgSrc=savedGifs[i].imgSrc;
    changeState(gifSrc,imgSrc,this);
  }

  function changeState(gifSrc,imgSrc, img){
    var state=$(img).attr('data-pause_play');
    if(state=='pause'){
      $(img).attr('src',gifSrc);
      $(img).attr('data-pause_play','play');
    }
    else{
      $(img).attr('src',imgSrc);
      $(img).attr('data-pause_play','pause');
    }
  }

  
  
  function searchTenGifs(){
    endpoint="search?";
    
    var search=$("#gifSearch").val().trim();
    console.log(search);

    var url=url1+endpoint+"api_key="+apiKey+"&q="+search+"&limit="+limit;

    callGiphy(url);
    
    
  }
  function searchTrendingGifs(){
    endpoint="trending?"
    
    var url=url1+endpoint+"api_key="+apiKey+"&limit="+limit;

    callGiphy(url);
  }
  function saveGif(){
  	$("#placeHolder").attr('visibility','hidden');

    var i=$(this).parent().attr('data-ref-num');
    var gifSrc=giphyObject.data[i].images.original.url;
    console.log(gifSrc);
    var imgSrc=giphyObject.data[i].images.original_still.url;
    var img={gifSrc:gifSrc, imgSrc:imgSrc};
    savedGifs.push(img);
    console.log(savedGifs);
    localStorage.setItem("savedGifsStorage",JSON.stringify(savedGifs));
        
    displaySaved();

  }
  function displaySaved(){
    $("#savedGifs1").empty();
    $("#savedGifs2").empty();

    savedGifs = JSON.parse(localStorage.getItem("savedGifsStorage"));

    for(var i=0; i<savedGifs.length; i++){
      
      var newDiv=$("<div class='savedDiv' data-ref-num="+i+">");
      var deleteButt=$("<button class='delete_button'>");
      deleteButt.text("X");
      var imgS=$("<img src="+savedGifs[i].gifSrc+" class='saved_image data-pause_play='pause'>");
      newDiv.append(imgS);
      newDiv.append(deleteButt);
     
     $("#savedGifs1").append(newDiv);    
     
    }
  }
  function clearStorage(){
    localStorage.removeItem("savedGifsStorage");
    $("#savedGifs1").empty();
    $("#savedGifs2").empty();
    $("#placeHolder").attr('visibility','visible');
    
    savedGifs=[];
  }
  function deleteGif(){
    var i=$(this).parent().attr('data-ref-num');
    savedGifs.splice(i,1);
    if(savedGifs==[]){
    	$("#placeHolder").attr('visibility','visible');
    	
    }
    localStorage.setItem("savedGifsStorage",JSON.stringify(savedGifs));
    displaySaved();

  }
  function scrollLeft(div) {
    var elmnt = document.getElementById(div);
    elmnt.scrollLeft += 50;
    console.log("trying to scroll");
	}


function scrollRight(div) {
	var elmnt = document.getElementById(div);
    elmnt.scrollLeft -= 50;
    console.log("trying to scroll Right");
    
	}

  // $(document).on("click", ".thing_button", searchThingButton);
  $("#tenImages").on("click", ".gif_image", pausePlay);
  $("#savedGifs1").on("click", ".saved_image", pausePlaySaved);
  $("#tenImages").on("click", ".save_button", saveGif);
  $("#clearStorage").on("click", clearStorage);
  $("#savedGifs1").on("click", ".delete_button", deleteGif);
  $("#addSearchButton").on("click", addSearch);
  $("#submitTen").on("click", searchTenGifs);
  $("#submitTrend").on("click", searchTrendingGifs);
  $("#scrollLeftButton").on("click", function(){
  	scrollLeft("searchedGifs");
  });
  $("#scrollRightButton").on("click", function(){
  	scrollRight("searchedGifs");
  });
  $("#scrollLeftButton2").on("click", function(){
  	scrollLeft("savedGifsContainer");
  });
  $("#scrollRightButton2").on("click", function(){
  	scrollRight("savedGifsContainer");
  });
   
  
  renderButtons();
  searchThingButton("neon");
});