import * as FRME from './frme_client.min.js';

/*
 * Bind listeners
 */
document.addEventListener('DOMContentLoaded', FRME.onInitialPageLoad)

document.getElementById('dropFile').addEventListener('drop',
    function(e) { FRME.drop(e); } )
document.getElementById('dropFile').addEventListener('dragover',
    function(e) { FRME.allowDrop(e); })
document.getElementById('dropFile').addEventListener('dragleave',
    function(e) { FRME.removeHighlight(e); })

document.getElementById('file_selector').addEventListener('change',
    function(e) { FRME.attachFileInput(e.target); })

document.getElementById('offlineCloseButton').addEventListener('click',
    FRME.offlineAlertClosed)
