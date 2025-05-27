// Obtiene la URL actual
const url = window.location.href;
// Crea un nuevo objeto URLSearchParams a partir de la URL actual
const urlParams = new URLSearchParams(window.location.search);
// Obtiene el valor del parámetro 'investigacion_id'
const elementoIdInicial = urlParams.get('investigacion_id');
const showMenu = urlParams.get('show_menu') || 'true';
const baseUrl = window.location.origin + window.location.pathname;

// VueApp
//-----------------------------------------------------------------------------
var investigacionesApp = createApp({
    data(){
        return{
            nombreElemento: 'investigación',
            nombreElementos: 'investigaciones',
            menu:[
                {name: 'investigaciones.html', title: 'Investigaciones', active: true},
                {name: 'visualizaciones.html', title: 'Visualizaciones', active: false},
                {name: 'datos.html', title: 'Datos', active: false},
                {name: 'mapas.html', title: 'Mapas', active: false},
            ],
            loading: false,
            section:'lista',
            elementos: [],
            currentId: elementoIdInicial,
            currentElement: {'id':0,'titulo':'Cargando...'},
            q: '',
            filters: {
                status: '' 
            },
            filtroEstados: ['Enviada','Finalizada','4 Entregada', '5 Finalizada'],
            productos: [],
            hallazgos: [],
            showMenu: showMenu == 'true' ? true : false,
        }
    },
    methods: {
        setSection: function(newSection){
            this.section = newSection
            if ( newSection = 'lista' ) {
                history.pushState(null, null, baseUrl)
            }
        },
        getList: function(){
            this.loading = true
            return axios.get('content/data/investigaciones/investigaciones.json')
            .then(response => {
                this.elementos = response.data
            })
            .catch(function(error) { console.log(error) })
        },
        checkCurrent: function(){
            if ( elementoIdInicial > 0) {
                this.setCurrent(elementoIdInicial)
            }
        },
        clearSearch: function(){
            this.q = ''
            this.setSection('lista')
            history.pushState(null, null, baseUrl)
        },
        textToClass: function(prefix='', inputText){
            return prefix + Pcrn.textToClass(inputText)
        },
        setCurrent: function(investigacionId){
            this.section = 'ficha'
            this.currentId = investigacionId
            this.currentElement = this.elementos.find(elemento => elemento['id'] == investigacionId)
            this.scrollToTop()
            console.log(baseUrl)
            history.pushState(null, null, baseUrl +'?investigacion_id=' + investigacionId)

        },
        scrollToTop: function(){
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },
        textToClass: function(text){
            return Pcrn.textToClass(text)
        },
        getProductos: function(){
            this.loading = true
            return axios.get('content/data/investigaciones/productos.json')
            .then(response => {
                this.productos = response.data
            })
            .catch(function(error) { console.log(error) })
        },
        getHallazgos: function(){
            this.loading = true
            return axios.get('content/data/investigaciones/hallazgos.json')
            .then(response => {
                this.hallazgos = response.data
                this.checkCurrent()
            })
            .catch(function(error) { console.log(error) })
        },
        getProductoClass: function(tipoProducto){
            var productoClass = 'fa-solid fa-file producto-general'
            if ( tipoProducto == 'Informe final' ) productoClass = 'fa-solid fa-file-lines producto-pdf'
            if ( tipoProducto == 'Presentación' ) productoClass = 'fa-solid fa-display producto-presentacion'
            if ( tipoProducto == 'Visualización/Infografía' ) productoClass = 'fa-solid fa-chart-simple producto-dataviz'
            if ( tipoProducto == 'Visualización' ) productoClass = 'fa-solid fa-chart-simple producto-dataviz'
            if ( tipoProducto == 'Geovisor' ) productoClass = 'fa-solid fa-chart-simple producto-dataviz'
            if ( tipoProducto == 'Base de datos' ) productoClass = 'fa-solid fa-table producto-db'
            if ( tipoProducto == 'Informe cuantitativo' ) productoClass = 'fa-solid fa-file-lines producto-cuantitativo'
            if ( tipoProducto == 'Audiovisual' ) productoClass = 'fa-solid fa-circle-play producto-audiovisual'
            return productoClass
        },
        displayProducto: function(producto){
            var displayProducto = true
            if ( producto['investigacion_id'] != this.currentElement['id']) { displayProducto = false }
            if ( producto['incluir_en_ficha'] != 'Sí') { displayProducto = false }
            if ( producto['url'] == null) { displayProducto = false }
            return displayProducto
        },
    },
    mounted(){
        Promise.all([
            this.getList(),
            this.getProductos(),
            this.getHallazgos()
        ]).then(() => {
            this.checkCurrent()
        })
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
        },
        hallazgosFiltrados: function(){
            var hallazgosFiltrados = this.hallazgos.filter(hallazgo => hallazgo.investigacion_id == this.currentElement['id'])
            return hallazgosFiltrados
        },
    }
}).mount('#investigacionesApp')