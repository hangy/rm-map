// (c) peous 2012
// cc-by-sa 3.0
// http://stackoverflow.com/a/10912844/11963
function padZeroes(number, length)
{
    var str = '' + number;
    while (str.length < length) {str = '0' + str;}
    return str;
}

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i){
    return (padZeroes(((i>>16)&0xFF).toString(16), 2) + 
           padZeroes(((i>>8)&0xFF).toString(16), 2)+ 
           padZeroes((i&0xFF).toString(16), 2)
           );
}

function stringToColor(s)
{
    return intToRGB(hashCode(s));
}
