function compareList(list1, list2){
    let equals = true;
    list1.filter(function(element) {
        if (list2.indexOf(element) == -1) {  
          equals = false;
        }
    });
    return equals
}

const lista_a = [1,2,3]
const lista_b = [1,2,3,5]  

console.log(compareList(lista_a, lista_b))
