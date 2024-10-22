// Obtiene la URL actual
const url = window.location.href;
// Crea un nuevo objeto URLSearchParams a partir de la URL actual
const urlParams = new URLSearchParams(window.location.search);
// Obtiene el valor del parámetro 'investigacion_id'
const elementoIdInicial = urlParams.get('investigacion_id');
const baseUrl = window.location.origin + window.location.pathname;

// VueApp
//-----------------------------------------------------------------------------
var datosApp = createApp({
    data(){
        return{
            nombreElemento: 'dato',
            nombreElementos: 'datos',
            menu:[
                {name: 'investigaciones.html', title: 'Investigaciones', active: false},
                {name: 'visualizaciones.html', title: 'Visualizaciones', active: false},
                {name: 'datos.html', title: 'Datos', active: true},
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
            filtroEstados: ['Publicado'],
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
            axios.get('content/data/datos/datos.json')
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
        }
    },
    mounted(){
        this.getList()
    },
    computed: {
        elementosFiltrados: function() {
            var listaFiltrada = this.elementos
            listaFiltrada = listaFiltrada.filter(elemento => this.filtroEstados.includes(elemento['estado']))
            if (this.q.length > 0) {
                var fieldsToSearch = ['titulo', 'tema','texto','fuente','palabras_clave','texto_complementario']
                listaFiltrada = PmlSearcher.getFilteredResults(this.q, listaFiltrada, fieldsToSearch)
            }
            return listaFiltrada
        },
    }
}).mount('#datosApp')