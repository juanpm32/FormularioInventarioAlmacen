/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/search'],

    function (search) {

        function pageInit(scriptContext) {

        }

        function getBinNumbersForItem(itemCode) {
            // Realizar una búsqueda para obtener los bin numbers asociados al código de artículo
            // Consulta la tabla NumberInventoryBalance y filtra por el código de artículo
            var binNumbers = [];

            var itemBinSearch = search.create({
                type: 'InventoryBalance',
                filters: [
                    search.createFilter({
                        name: 'item',
                        operator: search.Operator.IS,
                        values: itemCode
                    })
                ],
                columns: [
                    search.createColumn({ name: 'binnumber' })
                ]
            });

            itemBinSearch.run().each(function (result) {
                var binNumber = result.getValue({
                    name: 'binnumber'
                });
                binNumbers.push(binNumber);
                return true;
            });

            return binNumbers;
        }

        function fieldChanged(scriptContext) {
            if (scriptContext.fieldId === 'custpage_item_select') {
                var selectedValue = scriptContext.currentRecord.getValue('custpage_item_select');
                if (selectedValue) {
                    // Realizar una búsqueda para obtener la descripción del artículo
                    var itemSearch = search.create({
                        type: search.Type.ITEM, // Tipo de registro de artículo (puedes ajustarlo según tus necesidades)
                        filters: [
                            search.createFilter({ name: 'internalid', operator: 'is', values: Number(selectedValue) })
                        ],
                        columns: ['description'] // Columna que contiene la descripción del artículo
                    });

                    var itemDescription = itemSearch.run().getRange(0, 1)[0].getValue('description');

                    if (itemDescription) {
                        // Establecer la descripción en el campo de entrada de texto
                        scriptContext.currentRecord.setValue('custpage_item_description', itemDescription);
                    } else {
                        alert('La descripción del artículo no se encontró o está vacía.');
                    }

                    // Realizar una búsqueda para obtener los bin numbers asociados al código de artículo
                    var binNumbers = getBinNumbersForItem(Number(selectedValue));

                    // Actualizar las opciones del campo de selección con los bin numbers
                    var binSelectField = scriptContext.currentRecord.getField({ fieldId: 'custpage_bin_select' });
                    binSelectField.removeSelectOption({ value: null });
                    binNumbers.forEach(function (binNumber) {
                        binSelectField.insertSelectOption({
                            value: binNumber,
                            text: binNumber
                        });
                    });
                }
            }
        }


        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged
        };

    });
