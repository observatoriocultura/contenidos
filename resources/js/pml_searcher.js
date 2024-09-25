/**
 * FUNCIONES DE BÚSQUEDA Y FILTRO DE REGISTROS PARA EL USO EN EL LENGUAJE JAVASCRIPT
 * DESARROLLADAS POR Pacarina Media Lab (Pml)
 * 2024-08-24
 * 
 */

// FUNCIONES ESPECIALES
//-----------------------------------------------------------------------------

/**
 * Devuelve array de las palabras buscadas
 * 2024-05-13
 */
const getSearchedWords = function(searchedText) {
    var searchedTextNoAccents = removeAccents(searchedText)
    //var noBuscar = ['de', 'en', 'la', 'los', 'el', 'por', '-', 'y', 'con', 'un', 'para']
    var searchedWords = searchedTextNoAccents.toLowerCase().split(' ')
    return searchedWords
}

/**
 * Quita las tildes de un texto
 * 2024-05-13
 * @param {string} text 
 * @returns {strig} //
 */
const removeAccents = function(text) {
    var accents = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'
    };

    return text.replace(/[áéíóúÁÉÍÓÚ]/g, function(letter) {
        return accents[letter];
    });
}

/**
 * Devuelve elmentos filtrados
 * 2024-08-25
 */
var PmlSearcher = new function()
{
    this.getFilteredResults = function(searchedText, arrayTotal, fieldsToSearch) {
        // Texto de búsqueda
        var searchedWords = getSearchedWords(searchedText);
    
        // Filtrar elementos
        var filteredResults = arrayTotal.filter(function(rowElement) {
            var searchingIn = ''
            fieldsToSearch.forEach(fieldName => {
                if (rowElement[fieldName] != null) {
                    searchingIn += rowElement[fieldName].toLowerCase()
                }
            });
            searchingIn = removeAccents(searchingIn)
            
            // Verificar que todas las palabras estén incluidas
            return searchedWords.every(function(word) {
                return searchingIn.includes(word);
            });
        });
    
        // Devolver los resultados filtrados
        return filteredResults;
    }
};