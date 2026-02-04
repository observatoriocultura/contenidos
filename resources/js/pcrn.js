/**
 * FUNCIONES GENERALES PARA EL USO EN EL LENGUAJE JAVASCRIPT
 * DESARROLLADAS POR Pacarina Media Lab (Pcrn)
 * 2024-12-15
 * 
 */

var Pcrn = new function()
{
    /**
     * Controlar el value de una variable numérica para que su value permanezca
     * en un rango determinado
     * 
     * @param {type} $value
     * @param {type} $min
     * @param {type} $max
     * @returns {unresolved}
     */
    this.limit_between = function($value, $min, $max)
    {
        $limited_value = $value;

        if ( $limited_value < $min ) $limited_value = $min;
        if ( $limited_value > $max ) $limited_value = $max;

        return $limited_value;
    };
    
    /**
     * Controlar el value de una variable numérica para que su value permanezca
     * en un rango determinado,
     * Si supera el máximo devuelve el mínimo
     * Si supera el mínimo devuelve el máximo
     * 
     * @param {type} $value
     * @param {type} $min
     * @param {type} $max
     * @returns {unresolved}
     */
    this.cycle_between = function($value, $min, $max)
    {
        $limited_value = $value;

        if ( $limited_value < $min ) $limited_value = $max;
        if ( $limited_value > $max ) $limited_value = $min;

        return $limited_value;
    };

    /**
     * Redondea un número con cierto número de decimales
     * 
     * @param {number} num 
     * @param {number} decimals 
     */
    this.round = function round(num, decimals = 2) {
        var sign = (num >= 0 ? 1 : -1);
        num = num * sign;
        if (decimals === 0) //con 0 decimals
            return sign * Math.round(num);
        // round(x * 10 ^ decimals)
        num = num.toString().split('e');
        num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimals) : decimals)));
        // x * 10 ^ (-decimals)
        num = num.toString().split('e');
        return sign * (num[0] + 'e' + (num[1] ? (+num[1] - decimals) : -decimals));
    }

    /**
     * Redondea un número con cierto número de decimales
     * 
     * @param {number} num 
     * @param {number} total
     */
    this.intPercent = function intPercent(num, total = 100) {
        var intPercent = this.round(100 * num / total, 0)
        return intPercent
    }

    /**
     * Convierte un texto a un formato clase CSS, minúsculas sin espacios
     * ni acentos
     * 2024-12-12
     * @param {string} inputText Texto de entrada
     * @return {string} texto tranformado
     */
    this.textToClass = function textToClass(inputText){
        // Validar que inputText sea un string válido
        if (typeof inputText !== 'string' || inputText === undefined || inputText === null) {
            return ''; // Devuelve un string vacío si no es válido
        }

        let text = inputText.toLowerCase();
        text = text.replace(/ /g, "-"); // Guiones en lugar de espacios

        // Quitar tildes
        const accents = {'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u'};
        text = text.replace(/[áéíóúü]/g, function(letter) {
            return accents[letter];
        });

        // Eliminar caracteres especiales y de puntuación
        text = text.replace(/[^a-z0-9-]/g, '');

        return text;
    }
};