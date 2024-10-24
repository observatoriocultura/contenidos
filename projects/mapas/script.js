// Obtiene la URL actual
const url = window.location.href;
// Crea un nuevo objeto URLSearchParams a partir de la URL actual
const urlParams = new URLSearchParams(window.location.search);
// Obtiene el valor del parámetro 'mapa_id'
const elementoIdInicial = urlParams.get('mapa_id');
const baseUrl = window.location.origin + window.location.pathname;

// VueApp
//-----------------------------------------------------------------------------
var mapasApp = createApp({
    data(){
        return{
            nombreElemento: 'mapa',
            nombreElementos: 'mapas',
            menu:[
                {name: 'investigaciones.html', title: 'Investigaciones', active: false},
                {name: 'visualizaciones.html', title: 'Visualizaciones', active: false},
                {name: 'datos.html', title: 'Datos', active: false},
                {name: 'mapas.html', title: 'Mapas', active: true},
            ],
            loading: false,
            section:'lista',
            elementos: [],
            currentId: elementoIdInicial,
            currentElement: {'id':0,'nombre':'Cargando...'},
            q: '',
            filters: {
                status: '' 
            },
            filtroEstados: ['Finalizado'],
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
            axios.get('content/data/mapas/mapas.json')
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
        setCurrent: function(mapaId){
            this.section = 'ficha'
            this.currentId = mapaId
            this.currentElement = this.elementos.find(elemento => elemento['id'] == mapaId)
            this.scrollToTop()
            console.log(baseUrl)
            history.pushState(null, null, baseUrl +'?mapa_id=' + mapaId)

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
                var fieldsToSearch = ['nombre','descripcion','palabras_clave', 
                    'seccion','subseccion'
                ]
                listaFiltrada = PmlSearcher.getFilteredResults(this.q, listaFiltrada, fieldsToSearch)
            }
            return listaFiltrada
        },
    }
}).mount('#mapasApp')