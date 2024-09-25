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
            loading: false,
            section:'lista',
            elementos: [],
            productos: [],
            currentId: elementoIdInicial,
            currentElement: {'ID':0,'Título':'Cargando...'},
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
        setCurrent: function(investigacionId){
            this.section = 'ficha'
            this.currentId = investigacionId
            this.currentElement = this.elementos.find(elemento => elemento['id'] == investigacionId)
        },
        showElement: function(element){
            var showElement = true
        },
        clearSearch: function(){
            this.q = ''
        },
        getProductoClass: function(tipoProducto){
            var productoClass = 'fa-solid fa-arrow-right producto-general'
            if ( tipoProducto == 'Informe final' ) productoClass = 'fa-solid fa-file-lines producto-pdf'
            return productoClass
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
                var fieldsToSearch = ['titulo','descripcion','palabras_vlave','entidad_soliciante',
                    'dependencia'
                ]
                listaFiltrada = PmlSearcher.getFilteredResults(this.q, listaFiltrada, fieldsToSearch)
            }
            return listaFiltrada
        }
    }
}).mount('#investigacionesApp')