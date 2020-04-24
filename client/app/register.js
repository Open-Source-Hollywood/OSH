Handlebars.registerHelper('each_with_index', function(array, fn) {
  var buffer, i, item, j, len;
  buffer = '';
  for (j = 0, len = array.length; j < len; j++) {
    i = array[j];
    item = i;
    item.index = _i;
    buffer += fn(item);
  }
  return buffer;
});

Handlebars.registerHelper("inc", function(value, options) {
    return parseInt(value) + 1;
});

Handlebars.registerHelper('ifEveryOther', function(options) {
  var index = options.data.index + 1;
  if (index % 2 === 0) 
    return true;
  else
    return false;
});