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
   
      default:
         break;
   }
}

module.exports = {
   allFieldExists
};
