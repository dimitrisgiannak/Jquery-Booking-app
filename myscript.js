$(document).ready(function() {
    $.ajax({
        datatype : "json" ,
        type     : "get"  ,
        url      : "https://mocki.io/v1/0b4da118-49d2-4862-99d0-31a01630e92b" ,
       
        success  : function(data){ //data = jsosn file saved in server
            let max = -Infinity;
            let min = Infinity;
            const entries = data[1].entries;
            var dyn_filters = []; //we will store all the filters in order to display them
            var dyn_hotel_loc = []; //we will store all the hotel locations in order to display them
            var city_list = [] ; //we will store all our city names and hotel names for our autocomplete search bar
            
            entries.forEach(function(entry) {
                if (!city_list.includes(entry.city)){  //this particular script is from classs
                    city_list.push(entry.city);
                    dyn_hotel_loc.push(entry.city);
                }

                if (!city_list.includes(entry.hotelName)){
                    city_list.push(entry.hotelName);
                }

                const entryFilters = entry.filters;
                entryFilters.forEach(function(filter){
                    if (!dyn_filters.includes(filter.name)){
                        dyn_filters.push(filter.name);
                    }
                })

            });
            
            //taking all the filters dynamically and displaying them 
            for (const filter of dyn_filters) {
                $("#sort-by").append("<option>" + filter + "</option>")
            }
            
            //taking all the hotel location dynamically and displaying them
            for (const loc of dyn_hotel_loc) {
                $("#location").append("<option>" + loc + "</option>")
            } 


            const day_array = ["Sunday" , "Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday"] //array to display day name when we change date
            var search_input ; //we get the value of the input bar
            var stars ; //creating a span for each star
            var multi_stars ; // str to int from entries.rating to multiply stars
            var val ; //slide bar value replaces html of #max-value
            var rating ; //storing the current value the user selected
            var guest_rating ; //storing the current value the user selected
            var hotel_loc ; //storing the current value the user selected
            var sorting ; //storing the current value the user selected
            var filters ; //storing all fields from entries.filters

            const default_val = "3000"; //default value for reset after search
            
            //Each time we visit this page we want the check-in to show current day 
            //and check-out the next day.Same goes for the day name display
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); 
            var yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;
            $('#check-in').val(today);
            var add_day = new Date();
            var td = add_day.getDay(); //return's the day with a number starting from 1 === Sunday , 2 === Monday etc
            $('#ci-day').append('<b>' + day_array[td] + '</b>' + ' ' + ',');
            
            if (td === 6) {            //when td === 6 we want to display Sunday according to our day_array list
                $('#co-day').append(day_array[0] + ' ' + ',');
            }else {
                $('#co-day').append('<b>' + day_array[td + 1] + '</b>' + ' ' + ',');
            };

            var next_date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
            var next_dd = String(next_date.getDate()).padStart(2, '0');
            var mm = String(next_date.getMonth() + 1).padStart(2, '0'); 
            var yyyy = next_date.getFullYear();
            next_date = yyyy + '-' + mm + '-' + next_dd;
            $('#check-out').val(next_date);

            
      
            //Search bar autocomplete
            $(".input-field").autocomplete({
                    source    : city_list , //the list which we have already stored all the names needed
                },
                {
                    autofocus : true ,
                    delay     : 0    ,
                    minLength : 1 , //we need to input at least one character in input-field
                }); 

            //Search button
            $(".submit").on("click" , function(){
                //We empty container3 to "refresh" our view
                $(".container3").empty();
                search_input = $(".input-field").val() ;
                   //Reseting all fields after each search even if not valid
                   $(".input-field").val("");
                   $(".slide-bar").val("3000");
                   $("#max-value").html("max : " + default_val);
                   $("#property").val("all");
                   $("#rating-tag").val("all");
                   $("#location").val("all");
                   $("#more-filters").val("all");
                   $("#sort-by").val("all");
                   $("#family-rooms").val("rooms");
                   $("#check-in").val(today);
                   $("#check-out").val(next_date);
                   $('#ci-day').empty();
                   $('#co-day').empty();
                   $('#ci-day').append('<b>' + day_array[td] + '</b>' + ' ' + ',');
                   if (td === 6) {
                       $('#co-day').append(day_array[0] + ' ' + ',');
                   }else {
                       $('#co-day').append('<b>' + day_array[td + 1] + '</b>' + ' ' + ',');
                   };
                   //Reseting all variables to null so the previous values
                   //wont affect future changes on the filters
                   rating = null ;
                   guest_rating = null ;
                   hotel_loc = null ;
                   sorting = null ;
                   filters = null ;
 
                entries.forEach(function(search){
                    //We will accept input with hotel name or city and hotel name
                    //If input is Paris we will have two entries and they will be shown accordingly
                    //In any other case we will have only one entry according to our data
                    
                    if (search_input === search.hotelName) {
                        //Define the stars shown for each entry by multiplying the string itself with the integer of search.rating
                        stars = '<span class="fa fa-star checked" style="inline-size: auto"></span>';
                        multi_stars = stars.repeat(Number(search.rating));

                        $(".container3").append('<li class = "content"> '+
                                                '<div class = "img"><img id = "img" src= ' + search.thumbnail + ' alt="hotel1"></div> '+
                                                '<div class = "hotel-info"><h2 id = "hotel-title">' + search.hotelName + '</h2>' +
                                                multi_stars + ' Hotel' + '<p>Lorem ipsum dolor, sit amet </p>' +
                                                '<h3>' + '<span id = "loc-dets">' + search.ratings.no + '</span>' +' ' + search.ratings.text + '</h3>'+ '<p>Lorem ipsum dolor, sit amet </p></div>' +
                                                '<div class = "hotel-web"><div id="border-height"><div id="blue-box"><p>Hotel website</p><p id = "bold-price">$' + search.price +'</p></div><div id="lorem"><p id="p-pad">Lorem </p><p id="p-pad2" >$Lorem</p><p id="p-pad">Lorem</p><p id="p-pad2" >$Lorem</p><select class="lorem-select"><option selected disabled>Lorem</option></select></div></div></div>' + 
                                                '<div class = "view-deal"><div id="deal-dets"<p id="hw-title">Hotel Website</p><p id="hotel-w-price">$' + search.price + '</p><span id="three-nights">3 nights for</span><span> $' + search.price * 3 + '</span></div><a id = "link-button" href = "https://www.youtube.com/watch?v=UUdhde9PslU&ab_channel=TheMcLyon" target="_blank"><button type="button" id = "view-deal">View Deal <span id="deal-arrow" class="fas fa-chevron-right "></span></button></a></div>'+
                                                '</li>');
                    }

                    else if (search_input === search.city){
                        stars = '<span class="fa fa-star checked" style="inline-size: auto"></span>';
                        multi_stars = stars.repeat(Number(search.rating));
                        $(".container3").append('<li class = "content"> '+
                                                '<div class = "img"><img id = "img" src= ' + search.thumbnail + ' alt="hotel1"></div> '+
                                                '<div class = "hotel-info"><h2 id = "hotel-title">' + search.hotelName + '</h2>' +
                                                multi_stars + ' Hotel' + '<p>Lorem ipsum dolor, sit amet </p>' +
                                                '<h3>' + '<span id = "loc-dets">' + search.ratings.no + '</span>' +' ' + search.ratings.text + '</h3>'+ '<p>Lorem ipsum dolor, sit amet </p></div>' +
                                                '<div class = "hotel-web"><div id="border-height"><div id="blue-box"><p>Hotel website</p><p id = "bold-price">$' + search.price +'</p></div><div id="lorem"><p id="p-pad">Lorem </p><p id="p-pad2" >$Lorem</p><p id="p-pad">Lorem</p><p id="p-pad2" >$Lorem</p><select class="lorem-select"><option selected disabled>Lorem</option></select></div></div></div>' + 
                                                '<div class = "view-deal"><div id="deal-dets"<p id="hw-title">Hotel Website</p><p id="hotel-w-price">$' + search.price + '</p><span id="three-nights">3 nights for</span><span> $' + search.price * 3 + '</span></div><a id = "link-button" href = "https://www.youtube.com/watch?v=UUdhde9PslU&ab_channel=TheMcLyon" target="_blank"><button type="button" id = "view-deal">View Deal <span id="deal-arrow" class="fas fa-chevron-right "></span></button></a></div>'+
                                                '</li>');    
                    }
                   
                })
            });

            //Price slider
            $(".slide-bar").on("change", function() {
                //empty container3 each time we change the slidebar
                $(".container3").empty();
                val = $(this).val();
                //max changes html its time we slide the bar
                $("#max-value").html("max : $" + val);
                //for each entry we check if the condition is True and if it is
                //return all the possible entries
                entries.forEach(function(result){
                    if (val <= result.price) {
                        if (sorting == null) {
                            if  ( ( (rating == null)     || (Number(rating) === result.rating)        ) &
                                ( (guest_rating == null) || (guest_rating === result.ratings["text"]) ) & 
                                ( (hotel_loc == null)    || (hotel_loc === result.city)               ) 
                                ){
                                
                                stars = '<span class="fa fa-star checked" style="inline-size: auto"></span>';
                                multi_stars = stars.repeat(Number(result.rating));
                                $(".container3").append('<li class = "content"> '+
                                                    '<div class = "img"><img id = "img" src= ' + result.thumbnail + ' alt="hotel1"></div> '+
                                                    '<div class = "hotel-info"><h2 id = "hotel-title">' + result.hotelName + '</h2>' +
                                                    multi_stars + ' Hotel' + '<p>Lorem ipsum dolor, sit amet </p>' +
                                                    '<h3>' + '<span id = "loc-dets">' + (result.ratings.no).toFixed(1) + '</span>' +' ' + result.ratings.text + '</h3>' + '<p>Lorem ipsum dolor, sit amet </p></div>' +
                                                    '<div class = "hotel-web"><div id="border-height"><div id="blue-box"><p>Hotel website</p><p id = "bold-price">$' + result.price +'</p></div><div id="lorem"><p id="p-pad">Lorem </p><p id="p-pad2" >$Lorem</p><p id="p-pad">Lorem</p><p id="p-pad2" >$Lorem</p><select class="lorem-select"><option selected disabled>Lorem</option></select></div></div></div>' + 
                                                    '<div class = "view-deal"><div id="deal-dets"<p id="hw-title">Hotel Website</p><p id="hotel-w-price">$' + result.price + '</p><span id="three-nights">3 nights for</span><span> $' + result.price * 3 + '</span></div><a id = "link-button" href = "https://www.youtube.com/watch?v=UUdhde9PslU&ab_channel=TheMcLyon" target="_blank"><button type="button" id = "view-deal">View Deal <span id="deal-arrow" class="fas fa-chevron-right "></span></button></a></div>'+
                                                    '</li>');  
                                            
                            }
                        }else {
                            filters = result.filters;
                            filters.forEach(function(filters){
                                if (sorting === filters.name) {
                                    if  ( ( (rating == null) || (Number(rating) === result.rating) ) &
                                        ( (guest_rating == null) || (guest_rating === result.ratings["text"]) ) & 
                                        ( (hotel_loc == null) || (hotel_loc === result.city) ) ){
                                        
                                        stars = '<span class="fa fa-star checked" style="inline-size: auto"></span>';
                                        multi_stars = stars.repeat(Number(result.rating));
                                        $(".container3").append('<li class = "content"> '+
                                                    '<div class = "img"><img id = "img" src= ' + result.thumbnail + ' alt="hotel1"></div> '+
                                                    '<div class = "hotel-info"><h2 id = "hotel-title">' + result.hotelName + '</h2>' +
                                                    multi_stars + ' Hotel' + '<p>Lorem ipsum dolor, sit amet </p>' +
                                                    '<h3>' + '<span id = "loc-dets">' + (result.ratings.no).toFixed(1) + '</span>' +' ' + result.ratings.text + '</h3>'+ '<p>Lorem ipsum dolor, sit amet </p></div>' +
                                                    '<div class = "hotel-web"><div id="border-height"><div id="blue-box"><p>Hotel website</p><p id = "bold-price">$' + result.price +'</p></div><div id="lorem"><p id="p-pad">Lorem </p><p id="p-pad2" >$Lorem</p><p id="p-pad">Lorem</p><p id="p-pad2" >$Lorem</p><select class="lorem-select"><option selected disabled>Lorem</option></select></div></div></div>' + 
                                                    '<div class = "view-deal"><div id="deal-dets"<p id="hw-title">Hotel Website</p><p id="hotel-w-price">$' + result.price + '</p><span id="three-nights">3 nights for</span><span> $' + result.price * 3 + '</span></div><a id = "link-button" href = "https://www.youtube.com/watch?v=UUdhde9PslU&ab_channel=TheMcLyon" target="_blank"><button type="button" id = "view-deal">View Deal <span id="deal-arrow" class="fas fa-chevron-right "></span></button></a></div>'+
                                                    '</li>');  
                                            
                                    }
                                }
                            })
                        }
                    }
                })
            })

             //Property rating
             $("#property").on("change" , function() {
                //empty container3 each time we change the slidebar
                $(".container3").empty();
                rating = $(this).val();
                //for each entry we check if the condition is True and if it is
                //return all the possible entries
                entries.forEach(function(result){
                    if (Number(rating) === result.rating) {
                        if (sorting == null) {
                            if  ( ( (val == null)        || (val <= result.price)        ) &
                                ( (guest_rating == null) || (guest_rating === result.ratings["text"]) ) & 
                                ( (hotel_loc == null)    || (hotel_loc === result.city)               ) 
                                ){
                                
                                stars = '<span class="fa fa-star checked" style="inline-size: auto"></span>';
                                multi_stars = stars.repeat(Number(result.rating));
                                $(".container3").append('<li class = "content"> '+
                                                    '<div class = "img"><img id = "img" src= ' + result.thumbnail + ' alt="hotel1"></div> '+
                                                    '<div class = "hotel-info"><h2 id = "hotel-title">' + result.hotelName + '</h2>' +
                                                    multi_stars + ' Hotel' + '<p>Lorem ipsum dolor, sit amet </p>' +
                                                    '<h3>' + '<span id = "loc-dets">' + (result.ratings.no).toFixed(1) + '</span>' +' ' + result.ratings.text + '</h3>'+ '<p>Lorem ipsum dolor, sit amet </p></div>' +
                                                    '<div class = "hotel-web"><div id="border-height"><div id="blue-box"><p>Hotel website</p><p id = "bold-price">$' + result.price +'</p></div><div id="lorem"><p id="p-pad">Lorem </p><p id="p-pad2" >$Lorem</p><p id="p-pad">Lorem</p><p id="p-pad2" >$Lorem</p><select class="lorem-select"><option selected disabled>Lorem</option></select></div></div></div>' + 
                                                    '<div class = "view-deal"><div id="deal-dets"<p id="hw-title">Hotel Website</p><p id="hotel-w-price">$' + result.price + '</p><span id="three-nights">3 nights for</span><span> $' + result.price * 3 + '</span></div><a id = "link-button" href = "https://www.youtube.com/watch?v=UUdhde9PslU&ab_channel=TheMcLyon" target="_blank"><button type="button" id = "view-deal">View Deal <span id="deal-arrow" class="fas fa-chevron-right "></span></button></a></div>'+
                                                    '</li>');  
                                            
                            }
                        }else {
                            filters = result.filters;
                            filters.forEach(function(filters){
                                if (sorting === filters.name) {
                                    if  ( ( (val == null)        || (val <= result.price) ) &
                                        ( (guest_rating == null) || (guest_rating === result.ratings["text"]) ) & 
                                        ( (hotel_loc == null)    || (hotel_loc === result.city) ) ){
                                        
                                        stars = '<span class="fa fa-star checked" style="inline-size: auto"></span>';
                                        multi_stars = stars.repeat(Number(result.rating));
                                        $(".container3").append('<li class = "content"> '+
                                                    '<div class = "img"><img id = "img" src= ' + result.thumbnail + ' alt="hotel1"></div> '+
                                                    '<div class = "hotel-info"><h2 id = "hotel-title">' + result.hotelName + '</h2>' +
                                                    multi_stars + ' Hotel' + '<p>Lorem ipsum dolor, sit amet </p>' +
                                                    '<h3>' + '<span id = "loc-dets">' + (result.ratings.no).toFixed(1) + '</span>' +' ' + result.ratings.text + '</h3>'+ '<p>Lorem ipsum dolor, sit amet </p></div>' +
                                                    '<div class = "hotel-web"><div id="border-height"><div id="blue-box"><p>Hotel website</p><p id = "bold-price">$' + result.price +'</p></div><div id="lorem"><p id="p-pad">Lorem </p><p id="p-pad2" >$Lorem</p><p id="p-pad">Lorem</p><p id="p-pad2" >$Lorem</p><select class="lorem-select"><option selected disabled>Lorem</option></select></div></div></div>' + 
                                                    '<div class = "view-deal"><div id="deal-dets"<p id="hw-title">Hotel Website</p><p id="hotel-w-price">$' + result.price + '</p><span id="three-nights">3 nights for</span><span> $' + result.price * 3 + '</span></div><a id = "link-button" href = "https://www.youtube.com/watch?v=UUdhde9PslU&ab_channel=TheMcLyon" target="_blank"><button type="button" id = "view-deal">View Deal <span id="deal-arrow" class="fas fa-chevron-right "></span></button></a></div>'+
                                                    '</li>');  
                                            
                                    }
                                }
                            })
                        } 
                    }
                })   
            }) 
            
            
             //Guest rating
             $("#rating-tag").on("change" , function(){
                //empty container3 each time we change the slidebar
                $(".container3").empty();
                guest_rating = $(this).val();
                //for each entry we check if the condition is True and if it is
                //return all the possible entries
                entries.forEach(function(result){
                    if (guest_rating === result.ratings["text"]) {
                        if (sorting == null) {
                            if  ( ( (val == null)        || (val <= result.price)        ) &
                                ( (rating == null)       || (Number(rating) === result.rating) ) & 
                                ( (hotel_loc == null)    || (hotel_loc === result.city)               ) 
                                ){
                                
                                stars = '<span class="fa fa-star checked" style="inline-size: auto"></span>';
                                multi_stars = stars.repeat(Number(result.rating));
                                $(".container3").append('<li class = "content"> '+
                                                    '<div class = "img"><img id = "img" src= ' + result.thumbnail + ' alt="hotel1"></div> '+
                                                    '<div class = "hotel-info"><h2 id = "hotel-title">' + result.hotelName + '</h2>' +
                                                    multi_stars + ' Hotel' + '<p>Lorem ipsum dolor, sit amet </p>' +
                                                    '<h3>' + '<span id = "loc-dets">' + (result.ratings.no).toFixed(1) + '</span>' +' ' + result.ratings.text + '</h3>'+ '<p>Lorem ipsum dolor, sit amet </p></div>' +
                                                    '<div class = "hotel-web"><div id="border-height"><div id="blue-box"><p>Hotel website</p><p id = "bold-price">$' + result.price +'</p></div><div id="lorem"><p id="p-pad">Lorem </p><p id="p-pad2" >$Lorem</p><p id="p-pad">Lorem</p><p id="p-pad2" >$Lorem</p><select class="lorem-select"><option selected disabled>Lorem</option></select></div></div></div>' +  
                                                    '<div class = "view-deal"><div id="deal-dets"<p id="hw-title">Hotel Website</p><p id="hotel-w-price">$' + result.price + '</p><span id="three-nights">3 nights for</span><span> $' + result.price * 3 + '</span></div><a id = "link-button" href = "https://www.youtube.com/watch?v=UUdhde9PslU&ab_channel=TheMcLyon" target="_blank"><button type="button" id = "view-deal">View Deal <span id="deal-arrow" class="fas fa-chevron-right "></span></button></a></div>'+
                                                    '</li>'); 
                                            
                            }
                        }else {
                            filters = result.filters;
                            filters.forEach(function(filters){
                                if (sorting === filters.name) {
                                    if  ( ( (val == null)        || (val <= result.price) ) &
                                        ( (rating == null) || (Number(rating) === result.rating) ) & 
                                        ( (hotel_loc == null)    || (hotel_loc === result.city) ) ){
                                        
                                        stars = '<span class="fa fa-star checked" style="inline-size: auto"></span>';
                                        multi_stars = stars.repeat(Number(result.rating));
                                        $(".container3").append('<li class = "content"> '+
                                                    '<div class = "img"><img id = "img" src= ' + result.thumbnail + ' alt="hotel1"></div> '+
                                                    '<div class = "hotel-info"><h2 id = "hotel-title">' + result.hotelName + '</h2>' +
                                                    multi_stars + ' Hotel' + '<p>Lorem ipsum dolor, sit amet </p>' +
                                                    '<h3>' + '<span id = "loc-dets">' + (result.ratings.no).toFixed(1) + '</span>' +' ' + result.ratings.text + '</h3>'+ '<p>Lorem ipsum dolor, sit amet </p></div>' +
                                                    '<div class = "hotel-web"><div id="border-height"><div id="blue-box"><p>Hotel website</p><p id = "bold-price">$' + result.price +'</p></div><div id="lorem"><p id="p-pad">Lorem </p><p id="p-pad2" >$Lorem</p><p id="p-pad">Lorem</p><p id="p-pad2" >$Lorem</p><select class="lorem-select"><option selected disabled>Lorem</option></select></div></div></div>' +  
                                                    '<div class = "view-deal"><div id="deal-dets"<p id="hw-title">Hotel Website</p><p id="hotel-w-price">$' + result.price + '</p><span id="three-nights">3 nights for</span><span> $' + result.price * 3 + '</span></div><a id = "link-button" href = "https://www.youtube.com/watch?v=UUdhde9PslU&ab_channel=TheMcLyon" target="_blank"><button type="button" id = "view-deal">View Deal <span id="deal-arrow" class="fas fa-chevron-right "></span></button></a></div>'+
                                                    '</li>');  
                                            
                                    }
                                }
                            })
                        } 
                    }
                })    
            })


            
            //Hotel locations
            $("#location").on("change" , function(){
                //empty container3 each time we change the slidebar
                $(".container3").empty();
                hotel_loc = $(this).val();
                //for each entry we check if the condition is True and if it is
                //return all the possible entries
                entries.forEach(function(result){
                    if (hotel_loc === result.city) {
                        if (sorting == null) {
                            if  ( ( (val == null)        || (val <= result.price)        ) &
                                ( (rating == null)       || (Number(rating) === result.rating) ) & 
                                ( (guest_rating == null) || (guest_rating === result.ratings["text"]) ) 
                                ){
                                
                                stars = '<span class="fa fa-star checked" style="inline-size: auto"></span>';
                                multi_stars = stars.repeat(Number(result.rating));
                                $(".container3").append('<li class = "content"> '+
                                                    '<div class = "img"><img id = "img" src= ' + result.thumbnail + ' alt="hotel1"></div> '+
                                                    '<div class = "hotel-info"><h2 id = "hotel-title">' + result.hotelName + '</h2>' +
                                                    multi_stars + ' Hotel' + '<p>Lorem ipsum dolor, sit amet </p>' +
                                                    '<h3>' + '<span id = "loc-dets">' + (result.ratings.no).toFixed(1) + '</span>' +' ' + result.ratings.text + '</h3>'+ '<p>Lorem ipsum dolor, sit amet </p></div>' +
                                                    '<div class = "hotel-web"><div id="border-height"><div id="blue-box"><p>Hotel website</p><p id = "bold-price">$' + result.price +'</p></div><div id="lorem"><p id="p-pad">Lorem </p><p id="p-pad2" >$Lorem</p><p id="p-pad">Lorem</p><p id="p-pad2" >$Lorem</p><select class="lorem-select"><option selected disabled>Lorem</option></select></div></div></div>' + 
                                                    '<div class = "view-deal"><div id="deal-dets"<p id="hw-title">Hotel Website</p><p id="hotel-w-price">$' + result.price + '</p><span id="three-nights">3 nights for</span><span> $' + result.price * 3 + '</span></div><a id = "link-button" href = "https://www.youtube.com/watch?v=UUdhde9PslU&ab_channel=TheMcLyon" target="_blank"><button type="button" id = "view-deal">View Deal <span id="deal-arrow" class="fas fa-chevron-right "></span></button></a></div>'+
                                                    '</li>'); 
                                            
                            }
                        }else {
                            filters = result.filters;
                            filters.forEach(function(filters){
                                if (sorting === filters.name) {
                                    if  ( ( (val == null)        || (val <= result.price) ) &
                                        ( (rating == null)       || (Number(rating) === result.rating) ) & 
                                        ( (guest_rating == null) || (guest_rating === result.ratings["text"]) ) ){
                                        
                                        stars = '<span class="fa fa-star checked" style="inline-size: auto"></span>';
                                        multi_stars = stars.repeat(Number(result.rating));
                                        $(".container3").append('<li class = "content"> '+
                                                    '<div class = "img"><img id = "img" src= ' + result.thumbnail + ' alt="hotel1"></div> '+
                                                    '<div class = "hotel-info"><h2 id = "hotel-title">' + result.hotelName + '</h2>' +
                                                    multi_stars + ' Hotel' + '<p>Lorem ipsum dolor, sit amet </p>' +
                                                    '<h3>' + '<span id = "loc-dets">' + (result.ratings.no).toFixed(1) + '</span>' +' ' + result.ratings.text + '</h3>'+ '<p>Lorem ipsum dolor, sit amet </p></div>' +
                                                    '<div class = "hotel-web"><div id="border-height"><div id="blue-box"><p>Hotel website</p><p id = "bold-price">$' + result.price +'</p></div><div id="lorem"><p id="p-pad">Lorem </p><p id="p-pad2" >$Lorem</p><p id="p-pad">Lorem</p><p id="p-pad2" >$Lorem</p><select class="lorem-select"><option selected disabled>Lorem</option></select></div></div></div>' + 
                                                    '<div class = "view-deal"><div id="deal-dets"<p id="hw-title">Hotel Website</p><p id="hotel-w-price">$' + result.price + '</p><span id="three-nights">3 nights for</span><span> $' + result.price * 3 + '</span></div><a id = "link-button" href = "https://www.youtube.com/watch?v=UUdhde9PslU&ab_channel=TheMcLyon" target="_blank"><button type="button" id = "view-deal">View Deal <span id="deal-arrow" class="fas fa-chevron-right "></span></button></a></div>'+
                                                    '</li>');  
                                            
                                    }
                                }
                            })
                        } 
                    }
                })       
            })
              

            //Sorting options
            $("#sort-by").on("change" , function(){
                //empty container3 each time we change the slidebar
                $(".container3").empty();
                sorting = $(this).val();
                 //for each entry we check if the condition is True and if it is
                //return all the possible entries
                entries.forEach(function(result){       
                    filters = result.filters;
                    filters.forEach(function(filters){
                        if (sorting === filters.name) {
                            if  ( ( (val == null)        || (val <= result.price) ) &
                                ( (rating == null)       || (Number(rating) === result.rating) ) & 
                                ( (guest_rating == null) || (guest_rating === result.ratings["text"]) ) &
                                ( (hotel_loc == null)    || (hotel_loc === result.city) ) ){
                                
                                stars = '<span class="fa fa-star checked" style="inline-size: auto"></span>';
                                multi_stars = stars.repeat(Number(result.rating));
                                $(".container3").append('<li class = "content"> '+
                                            '<div class = "img"><img id = "img" src= ' + result.thumbnail + ' alt="hotel1"></div> '+
                                            '<div class = "hotel-info"><h2 id = "hotel-title">' + result.hotelName + '</h2>' +
                                            multi_stars + ' Hotel' + '<p>Lorem ipsum dolor, sit amet </p>' +
                                            '<h3>' + '<span id = "loc-dets">' + (result.ratings.no).toFixed(1) + '</span>' +' ' + result.ratings.text + '</h3>'+ '<p>Lorem ipsum dolor, sit amet </p></div>' +
                                            '<div class = "hotel-web"><div id="border-height"><div id="blue-box"><p>Hotel website</p><p id = "bold-price">$' + result.price +'</p></div><div id="lorem"><p id="p-pad">Lorem </p><p id="p-pad2" >$Lorem</p><p id="p-pad">Lorem</p><p id="p-pad2" >$Lorem</p><select class="lorem-select"><option selected disabled>Lorem</option></select></div></div></div>' + 
                                            '<div class = "view-deal"><div id="deal-dets"<p id="hw-title">Hotel Website</p><p id="hotel-w-price">$' + result.price + '</p><span id="three-nights">3 nights for</span><span> $' + result.price * 3 + '</span></div><a id = "link-button" href = "https://www.youtube.com/watch?v=UUdhde9PslU&ab_channel=TheMcLyon" target="_blank"><button type="button" id = "view-deal">View Deal <span id="deal-arrow" class="fas fa-chevron-right "></span></button></a></div>'+
                                            '</li>');     
                                
                            }
                        } 
                    })
                })    
            })

            //Modal map 
            $('.gmap-canvas iframe').attr('src' , entries[3].mapurl); 

            //Every time we change the date with calendar indicator we check if the date is valid
            $('#check-in').on("change" , function(){
                let current_date = new Date();
                let current_time = current_date.getTime();
                let cal_date = new Date($('#check-in').val().split("-"));
                if (cal_date >= current_time) {
                    $('#ci-day').empty();
                    let day = cal_date.getDay();
                    $('#ci-day').append('<b>' + day_array[day] + '</b>' + ',');
                }else{
                    $('#check-in').val(today);
                    alert("The date you have chosen is not valid\nPlease try again!");
                } 
            })

            //Every time we change the date with calendar indicator we check if the date is valid
            $('#check-out').on("change" , function(){
                let current_date = new Date();
                let current_time = current_date.getTime();
                let cal_date = new Date($('#check-out').val().split("-"));
                if (cal_date >= current_time) {
                    $('#co-day').empty();
                    let day = cal_date.getDay();
                    $('#co-day').append('<b>' + day_array[day] + '</b>' + ',');
                }else{
                    $('#check-out').val(next_date);
                    alert("The date you have chosen is not valid\nPlease try again!");
                }
            })
     
            //Every time we change the date with left arrow we check if the date is valid
            //day name display changes accordingly
            $('#ci-left-arrow').click(function(){
                let current_date = new Date();
                let current_time = current_date.getTime();
                let cal_date = new Date($('#check-in').val().split("-"));
                if (cal_date >= current_time) {                  
                    $('#ci-day').empty();
                    let prev_d = new Date(cal_date.getTime() - 24 * 60 * 60 * 1000);
                    let day = prev_d.getDay();
                    let prev_dd = String(prev_d.getDate()).padStart(2, '0');
                    let mm = String(prev_d.getMonth() + 1).padStart(2, '0'); 
                    let yyyy = prev_d.getFullYear();
                    prev_d = yyyy + '-' + mm + '-' + prev_dd;
                    $('#check-in').val(prev_d);
                    $('#ci-day').append('<b>' + day_array[day] + '</b>' + ',');
                }else {
                    alert("The date you have chosen is not valid\nPlease try again!");
                }
               
            })
             
            //Day name display changes accordingly when we use right arrow
            $('#ci-right-arrow').click(function(){
                $('#ci-day').empty();
                let cal_date = new Date($('#check-in').val().split("-"));
                let next_date = new Date(cal_date.getTime() + 24 * 60 * 60 * 1000);
                let next_day = next_date.getDay();
                let next_dd = String(next_date.getDate()).padStart(2, '0');
                let mm = String(next_date.getMonth() + 1).padStart(2, '0'); 
                let yyyy = next_date.getFullYear();
                next_date = yyyy + '-' + mm + '-' + next_dd;
                $('#check-in').val(next_date);
                $('#ci-day').append('<b>' + day_array[next_day] + '</b>' + ',');
            })

            //Every time we change the date with left arrow we check if the date is valid
            $('#co-left-arrow').click(function(){
                let current_date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                let cal_date = new Date($('#check-out').val().split("-"));     
                if (cal_date >= current_date) {                  
                    $('#co-day').empty();
                    let prev_d = new Date(cal_date.getTime() - 24 * 60 * 60 * 1000);
                    let day = prev_d.getDay();
                    let prev_dd = String(prev_d.getDate()).padStart(2, '0');
                    let mm = String(prev_d.getMonth() + 1).padStart(2, '0'); 
                    let yyyy = prev_d.getFullYear();
                    prev_d = yyyy + '-' + mm + '-' + prev_dd;
                    $('#check-out').val(prev_d);
                    $('#co-day').append('<b>' + day_array[day] + '</b>' + ',');
                }else {
                    alert("The date you have chosen is not valid\nPlease try again!");
                }
            })

            //Day name display changes accordingly when we use right arrow
            $('#co-right-arrow').click(function(){
                $('#co-day').empty();
                let cal_date = new Date($('#check-out').val().split("-"));
                let next_d = new Date(cal_date.getTime() + 24 * 60 * 60 * 1000);
                let next_day = next_d.getDay();
                let next_dd = String(next_d.getDate()).padStart(2, '0');
                let mm = String(next_d.getMonth() + 1).padStart(2, '0'); 
                let yyyy = next_d.getFullYear();
                next_d = yyyy + '-' + mm + '-' + next_dd;
                $('#check-out').val(next_d);
                $('#co-day').append('<b>' + day_array[next_day] + '</b>' + ',');
            })

        } ,
        //If for some reason we dont have access to the server we will use container3 to alert the user
        //with an error message
        error : function(){
            $(".container3").append("<b>something went wrong.We are working on it.<br>Please try later...</b>")

        }
        
    })
})
