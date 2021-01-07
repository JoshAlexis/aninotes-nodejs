/**
 * 
 * @param {object} obj 
 * @param {number} type 
 */
const allFieldExists = (obj, type) => {
   switch (type) {
      case 1:
         if(obj.hasOwnProperty('idPixiv') && obj.hasOwnProperty('Content') 
         && obj.hasOwnProperty('Quality')&& obj.hasOwnProperty('Favorite') 
         && obj.hasOwnProperty('Link')){
            return true
         }else{
            return false
         } 
         break;
      case 3:
         if(obj.hasOwnProperty('Name') && obj.hasOwnProperty('Viewed')
         && obj.hasOwnProperty('Description') && obj.hasOwnProperty('Comments')
         && obj.hasOwnProperty('Link')){
            return true
         } else{
            return false
         }
         break;
      default:
         break;
   }
}
/**
 * 
 * @param {String} query 
 */
const cleanEscapedSpaces = (query) => {
   if(!query) return query.replace('%20', ' ')
}

module.exports = {
   allFieldExists,
   cleanEscapedSpaces
};
