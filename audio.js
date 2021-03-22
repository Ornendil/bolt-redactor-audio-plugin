(function($R)
{
    $R.add('plugin', 'audio', {
        
        // Hvordan modalen skal se ut
        modals: {
            'audiomodal': '<form action="">'
                + '<div class="form-item">'
                    + '<label>Last opp en fil</label>'
                    + '<input type="file" name="file" accept="audio/*">'
                + '</div>'
            + '</form>'
        },
        
        // Initialiser de forskjellige tingene vi trenger
        init: function(app){
            // Selve appen
            this.app = app;
            // Gjør at vi kan legge til knappen i toolbar
            this.toolbar = app.toolbar;
            
            // Gjør at vi kan sette inn ting i content
            this.insertion = app.insertion;
            
            // Gjør at vi kan hente frem file manager eller no...
            this.opts = app.opts;
            console.log(this);
            console.log(this.opts);
        },
        
        // De forskjellige callback-funksjonene
        onmodal: {
            audiomodal: {
                
                // Når vi åpner modalen
                open: function($modal, $form){
                    this._setUpload($form);
                    
                },
                
                // Når modalen er åpnet
                opened: function($modal, $form){
                    $form.getField('text').focus();
                },
                
                // Når vi lukker modalen
                close: function($modal, $form){
                },
                
                // Når modalen er lukket
                closed: function($modal, $form){
                },
                
                // Når vi avbryter
                cancel: function($modal, $form){
                },
                
                // Når vi trykker på "Insert"
                insert: function($modal, $form){
                    var data = $form.getData();
                    this._insert(data);
               }
            }
        },
        
        // Callback-funksjonene for opplastingen
        onupload: {
            myupload: {
                complete: function(response){
                    this._insert(response);
                },
                error: function(response){
                    this._uploadError(response);
                }
            }
        },
        
        // Vi lager knappen og setter den inn i toolbar
        start: function(){
            var buttonData = {
                title: 'Audio',
                api: 'plugin.audio.open'
            };

            var $button = this.toolbar.addButton('audio', buttonData);
        },
        
        // Vi åpner modalen
        open: function(){
        
            // Noen innstillinger til modalen
            var options = {
                title: 'Audio', // the modal title
                name: 'audiomodal', // the modal variable in modals object
                handle: 'insert', // Hvilken kommando som skal kjøres hvis vi trykker "Enter"
                commands: {
                    insert: { title: 'Insert' },
                    cancel: { title: 'Cancel' } // the cancel button in the modal
                }
            };

            // open the modal with API
            this.app.api('module.modal.build', options);
        },
        
        
        _setUpload: function($form){
            var options = {
                // Advarsel! Ikke bruk på live siden uten at dette opplastingsskriptet er byttet ut med noe sikrere
                url: '/tempuploadscript.php',
                element: $form.getField('file'),
                name: 'myupload'
            };

            this.app.api('module.upload.build', options);
        },
        
        _uploadError: function(response){
            this.app.broadcast('myuploadError', response);
        },
        
        // Hva som skal skje når vi trykker på "Insert"
        _insert: function(data){
            
            // close the modal
            this.app.api('module.modal.close');

            this.app.broadcast('myuploadComplete', data);
            
            for (file in data) {
                this.insertion.insertHtml('<audio controls="" src="/'+data[file]['url']+'"></audio>');
            }
        }
    });
})(Redactor);