Oskari.registerLocalization({
    "lang": "en",
    "key": "StatsGrid",
    "value": {
        "title": "Patio",
        "desc": "",
        "tile": {
            "title": "Thematic maps"
        },
        "view": {
            "title": "Patio",
            "message": "patiopoc"
        },
        "tab": {
            "title": "Indicators",
            "description": "Own indicators",
            "grid": {
                "name": "Title",
                "description": "Description",
                "organization": "Data source",
                "year": "Year",
                "delete": "Delete"
            },
            "deleteTitle": "Deleting indicator",
            "destroyIndicator": "Delete",
            "cancelDelete": "Cancel",
            "confirmDelete": "Are you sure you want to delete indicator ",
            "newIndicator": "New indicator",
            "error": {
                "title": "Error",
                "indicatorsError": "Error occurred whilst loading the indicators. Please try again later",
                "indicatorError": "Error occurred whilst loading an indicator. Please try again later",
                "indicatorDeleteError": "Error occurred whilst removing an indicator. Please try again later"
            }
        },
        "sex": "Sex",
        "genders": {
            "male": "male",
            "female": "female",
            "total": "total"
        },
        "defunctRegion": "Defunct region",
        "addColumn": "Get data",
        "removeColumn": "Remove",
        "indicators": "Indicator",
        "layers": "Layer",
        "cannotDisplayIndicator": "The indicator does not have values on the selected region category so it cannot be displayed in the grid.",
        "availableRegions": " The following region categories have values on the indicator: ",
        "year": "Year",
        "buttons": {
            "ok": "OK",
            "cancel": "Cancel",
            "filter": "Filter"
        },
        "stats": {
            "municipality": "Municipality",
            "code": "Code",
            "errorTitle": "Error",
            "regionDataError": "Error in getting statistics region data.",
            "regionDataXHRError": "Error loading statistics region data",
            "indicatorsDataError": "Error in getting statistics indicators.",
            "indicatorsDataXHRError": "Error loading statistics indicators",
            "indicatorMetaError": "Error in getting statistics indicator metadata",
            "indicatorMetaXHRError": "Error loading statistics indicator metadata",
            "indicatorDataError": "Error in getting statistics indicator data",
            "indicatorDataXHRError": "Error loading statistics indicator data",
            "descriptionTitle": "Description",
            "sourceTitle": "Source"

        },
        "classify": {
            "classify": "Classify",
            "classifymethod": "Method",
            "classes": "Classes",
            "jenks": "Jenks ranges",
            "quantile": "Quantile ranges",
            "eqinterval": "Eqinterval",
            "manual": "Manual breaks",
            "manualPlaceholder": "Input numbers separated with a comma.",
            "manualRangeError": "There should be at least {min} and at most {max} numbers!",
            "nanError": "A value was not a number!",
            "infoTitle": "Manual breaks",
            "info": "Input manual breaks separated with a comma. Period works as a decimal separator. First enter the lower bound, then the class bounds and finally the upper bound. E.g. by entering \"0, 10.5, 24, 30.2, 57, 73.1\" you'll get five classes with lower and upper bounds set to 0 and 73,1 and class bounds between those. Values left outside the bounds will be excluded.",
            "mode": "Class limits",
            "modes": {
                "distinct": "Continuous",
                "discontinuous": "Discrete"
            }
        },
        "colorset": {
            "button": "Colors",
            "flipButton": "Flip colors",
            "themeselection": "Color theme selection",
            "setselection": "Color set selection",
            "sequential": "Sequential",
            "qualitative": "qualitative",
            "divergent": "Divergent",
            "info2": "Color range selection - ",
            "cancel": "Exit"

        },
        "statistic": {
            "title": "Statistical variables",
            "avg": "Average",
            "max": "Maximum value",
            "mde": "Mode",
            "mdn": "Median",
            "min": "Minimum value",
            "std": "Standard deviation",
            "sum": "Sum",
            "tooltip": {
                "avg": "Average value of the indicator",
                "max": "Largest value of the indicator",
                "mde": "Most common value of the indicator",
                "mdn": "Middle value of the indicator",
                "min": "Smallest value of the indicator",
                "std": "Standard deviation of the indicator",
                "sum": "The total sum of the indicator values"
            },
            "plugins": {
                "fi.nls.oskari.control.statistics.plugins.sotka.plugin_name": "SotkaNET",
                "fi.nls.oskari.control.statistics.plugins.user.plugin_name": "Your indicators"
            },
            "selector": {
                "year": "Year",
                "sex": "Sex"
            }
        },
        "noIndicatorData": "Can not display indicator with selected region category",
        "values": "values",
        "included": "Values",
        "municipality": "Municipalities",
        "selectRows": "Select rows",
        "select4Municipalities": "Select at least two areas",
        "showSelected": "Show only selected areas on the grid",
        "not_included": "Not included",
        "noMatch": "No results matched",
        "selectIndicator": "Select an indicator",
        "addIndicatorButton": "Add an indicator",
        "noDataSource": "No data source matched",
        "selectDataSource": "Select a data source",
        "filterTitle": "Filter out column data",
        "indicatorFilterDesc": "Filtered values are selected in the grid. You can set filtering separately for every column.",
        "filterIndicator": "Indicator:",
        "filterCondition": "Condition:",
        "filterSelectCondition": "Select condition",
        "filterGT": "Greater than (>)",
        "filterGTOE": "Greater than or equal to (>=)",
        "filterE": "Equal (=)",
        "filterLTOE": "Less than or equal to (<=)",
        "filterLT": "Less than (<)",
        "filterBetween": "In between (exclusive)",
        "filter": "Filter",
        "filterByValue": "By value",
        "filterByRegion": "By region",
        "selectorPlaceholders": {
            "year": "Choose a year",
            "sex": "Choose a sex"
        },
        "selectors": {
            "year": "Year",
            "sex": "Sex"
        },
        "selectorValues": {
            "sex": {
                "male": "male",
                "female": "female",
                "total": "total"
            }
        },
        "regionCategories": {
            "oskari:kunnat2013": "Municipality",
            "oskari:avi": "Regional administrative agency",
            "oskari:ely": "ELY",
            "oskari:maakunta": "Province",
            "oskari:erva-alueet": "Hospital special responsibility district",
            "oskari:nuts1": "Mainland Finland and the Åland Islands",
            "oskari:sairaanhoitopiiri": "Hospital district",
            "oskari:seutukunta": "Subregion"
        },
        "regionCategoriesTitle": "Region categories",

        "selectRegionCategory": "Region categories:",
        "regionCatPlaceholder": "Choose a region category",
        "selectRegion": "Regions:",
        "chosenRegionText": "Choose regions",
        "noRegionFound": "Region not found",
        "addDataButton": "Add indicator",
        "addDataTitle": "Add new indicator",
        "openImportDialogTip": "Import data from clipboard",
        "openImportDataButton": "Import data",
        "addDataMetaTitle": "Title",
        "addDataMetaTitlePH": "Indicator's title",
        "addDataMetaSources": "Source",
        "addDataMetaSourcesPH": "Data source",
        "addDataMetaDescription": "Description",
        "addDataMetaDescriptionPH": "Description",
        "addDataMetaReferenceLayer": "Reference layer",
        "addDataMetaYear": "Year",
        "addDataMetaYearPH": "Year",
        "addDataMetaPublicity": "Publishable",
        "municipalityHeader": "Municipalities",
        "dataRows": "Data rows",
        "municipalityPlaceHolder": "Give value",
        "formEmpty": "Reset",
        "formCancel": "Cancel",
        "formSubmit": "Submit",
        "formSaveIndicator": "Save indicator",
        "cancelButton": "Cancel",
        "clearImportDataButton": "Reset",
        "importDataButton": "Add values",
        "popupTitle": "Import data",
        "importDataDescription": "You can bring region value tuples by copying them to the textarea. \nPlace every region to their own row. You can separate the values with tabulator, colon or comma. \nExample 1: Alajärvi, 1234 \nExample 2: 009    2100",
        "failedSubmit": "Add indicator's metadata: ",
        "connectionProblem": "We could not save the data due to connection problems",
        "parsedDataInfo": "Imported regions count",
        "parsedDataUnrecognized": "Unrecognized regions count",
        "loginToSaveIndicator": "Log in if you want to save your indicators",
        "connectionError": "Connection error!"
    }
});
