// Obtiene la URL actual
const url = window.location.href;
// Crea un nuevo objeto URLSearchParams a partir de la URL actual
const urlParams = new URLSearchParams(window.location.search);
// Obtiene el valor del parámetro 'investigacion_id'
const elementoIdInicial = urlParams.get('investigacion_id');

// VueApp
//-----------------------------------------------------------------------------
var investigacionesApp = createApp({
    data(){
        return{
            nombreElemento: 'investigación',
            nombreElementos: 'investigaciones',
            loading: false,
            section:'lista',
            elementos: [],
            productos: [],
            currentId: elementoIdInicial,
            currentElement: {'id':0,'titulo':'Cargando...'},
            q: '',
            filters: {
                status: '' 
            },
            filtroEstados: ['Enviada','Finalizada'],
        }
    },
    methods: {
        getList: function(){
            this.loading = true
            axios.get('content/data/investigaciones/investigaciones.json')
            .then(response => {
                this.elementos = response.data
                if ( elementoIdInicial > 0) {
                    this.setCurrent(elementoIdInicial)
                }
            })
            .catch(function(error) { console.log(error) })
        },
        getProductos: function(){
            this.loading = true
            axios.get('content/data/investigaciones/productos.json')
            .then(response => {
                this.productos = response.data
            })
            .catch(function(error) { console.log(error) })
        },
        clearSearch: function(){
            this.q = ''
        },
        textToClass: function(prefix='', inputText){
            return prefix + Pcrn.textToClass(inputText)
        },
        setCurrent: function(investigacionId){
            this.section = 'ficha'
            this.currentId = investigacionId
            this.currentElement = this.elementos.find(elemento => elemento['id'] == investigacionId)
        },
        textToClass: function(text){
            return Pcrn.textToClass(text)
        },
        getProductoClass: function(tipoProducto){
            var productoClass = 'fa-solid fa-file producto-general'
            if ( tipoProducto == 'Informe final' ) productoClass = 'fa-solid fa-file-lines producto-pdf'
            if ( tipoProducto == 'Presentación' ) productoClass = 'fa-solid fa-display producto-presentacion'
            if ( tipoProducto == 'Visualización/Infografía' ) productoClass = 'fa-solid fa-chart-simple producto-dataviz'
            if ( tipoProducto == 'Base de datos' ) productoClass = 'fa-solid fa-table producto-db'
            if ( tipoProducto == 'Informe cuantitativo' ) productoClass = 'fa-solid fa-file-lines producto-cuantitativo'
            if ( tipoProducto == 'Audiovisual' ) productoClass = 'fa-solid fa-circle-play producto-audiovisual'
            return productoClass
        },
        displayProducto: function(producto){
            var displayProducto = true
            if ( producto['investigacion_id'] != this.currentElement['id']) { displayProducto = false }
            if ( producto['incluir_en_ficha'] != 'Sí') { displayProducto = false }
            return displayProducto
        },
    },
    mounted(){
        this.getList()
        this.getProductos()
    },
    computed: {
        elementosFiltrados: function() {
            var listaFiltrada = this.elementos
            listaFiltrada = listaFiltrada.filter(elemento => this.filtroEstados.includes(elemento['estado']))
            if ( this.filters.status != '' ) {
                listaFiltrada = listaFiltrada.filter(elemento => elemento['estado'] == this.filters.status)
            }
            if (this.q.length > 0) {
                var fieldsToSearch = ['titulo','descripcion','palabras_clave','entidad_soliciante',
                    'dependencia'
                ]
                listaFiltrada = PmlSearcher.getFilteredResults(this.q, listaFiltrada, fieldsToSearch)
            }
            return listaFiltrada
        }
    }
}).mount('#investigacionesApp')