/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/search'],

    (serverWidget, search) => {

        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                // Crear el formulario
                var form = serverWidget.createForm({
                    title: 'Formulario de Inventario'
                });

                // Crear un campo de búsqueda integrada
                var itemSelect = form.addField({
                    id: 'custpage_item_select',
                    type: serverWidget.FieldType.SELECT,
                    source: 'item',
                    label: 'Código Artículo'
                });

                // Crear un campo de selección para el bin number
                var binSelect = form.addField({
                    id: 'custpage_bin_select',
                    type: serverWidget.FieldType.SELECT,
                    source: '',
                    label: 'Selecciona un Bin Number'
                });

                binSelect.isAutoComplete = true;

                // Crear un campo de entrada de texto para la descripción del artículo
                var itemDescription = form.addField({
                    id: 'custpage_item_description',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Descripción Artículo'
                });

                form.clientScriptModulePath = './Client.FormularioInventarioAlmacen.js';

                // Cargar el Suitelet
                scriptContext.response.writePage(form);
            }
        }

        return { onRequest }

    });
