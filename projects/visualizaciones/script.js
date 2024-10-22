// Obtiene la URL actual
const url = window.location.href;
// Crea un nuevo objeto URLSearchParams a partir de la URL actual
const urlParams = new URLSearchParams(window.location.search);
// Obtiene el valor del parámetro 'investigacion_id'
const elementoIdInicial = urlParams.get('investigacion_id');
const baseUrl = window.location.origin + window.location.pathname;

// VueApp
//-----------------------------------------------------------------------------
var visualizacionesApp = createApp({
    data(){
        return{
            nombreElemento: 'investigación',
            nombreElementos: 'visualizaciones',
            loading: false,
            section:'lista',
            elementos: [],
            currentId: elementoIdInicial,
            currentElement: {'id':0,'titulo':'Cargando...'},
            q: '',
            filters: {
                status: '' 
            },
            filtroEstados: ['en-revision','finalizado'],
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
            axios.get('content/data/visualizaciones/visualizaciones.json')
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
    },
    mounted(){
        this.getList()
    },
    computed: {
        elementosFiltrados: function() {
            var listaFiltrada = this.elementos
            listaFiltrada = listaFiltrada.filter(elemento => this.filtroEstados.includes(elemento['estado']))
            if (this.q.length > 0) {
                var fieldsToSearch = ['nombre','descripcion','palabras_clave']
                listaFiltrada = PmlSearcher.getFilteredResults(this.q, listaFiltrada, fieldsToSearch)
            }
            return listaFiltrada
        },
    }
}).mount('#visualizacionesApp')