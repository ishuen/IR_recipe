$('.submit').click(function (e) {
    e.preventDefault(); // otherwise, it won't wait for the ajax response
	var href = $('.submit').attr('href');
	$('.searchResult').load(href);
});